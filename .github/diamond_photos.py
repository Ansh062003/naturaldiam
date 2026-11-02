import os,io,json,csv,re,hashlib,time,concurrent.futures,requests
from urllib.parse import urlparse,unquote
from PIL import Image,ImageOps

# --- repo media publishing: stage built webps into diamonds/media and push with GITHUB_TOKEN ---
import subprocess
REPO_DIR=os.environ.get('GITHUB_WORKSPACE','.')
REPO_BASE='https://naturaldiam.it/diamonds/media/'
staged_files=[];removed_files=[];pending_rows=[]
def stage_media(subdir,stock,data):
 p=os.path.join(REPO_DIR,'diamonds','media',subdir,stock+'.webp')
 os.makedirs(os.path.dirname(p),exist_ok=True)
 open(p,'wb').write(data);staged_files.append(p)
def unstage_media(subdir,stock):removed_files.append('diamonds/media/'+subdir+'/'+stock+'.webp')
def publish_media():
 if not staged_files and not removed_files:return False
 def git(*a):return subprocess.run(['git','-C',REPO_DIR]+list(a),capture_output=True,text=True)
 try:
  git('config','user.email','actions@users.noreply.github.com');git('config','user.name','github-actions')
  for p in removed_files:git('rm','-q','--cached','--ignore-unmatch','--',p)
  if staged_files:git('add','--sparse','--',*staged_files)
  c=git('commit','-q','-m','Sync diamond media: %d added, %d removed'%(len(staged_files),len(removed_files)))
  if c.returncode!=0:return False
  for _ in range(5):
   git('rebase','--abort')
   git('fetch','-q','origin','main');r=git('rebase','-q','origin/main')
   if r.returncode!=0:continue
   p=git('push','-q','origin','HEAD:main')
   if p.returncode==0:return True
  return False
 except Exception:return False
# --- end repo media publishing ---
ref='eigdjzygkqyslwpcaotp';control='https://api.supabase.com/v1/projects/'+ref
admin=requests.Session();admin.mount('https://',requests.adapters.HTTPAdapter(max_retries=requests.packages.urllib3.util.retry.Retry(total=4,backoff_factor=4,status_forcelist=[500,502,503,504],allowed_methods=None)));admin.headers['Authorization']='Bearer '+os.environ['SUPABASE_ACCESS_TOKEN']
def api(path,method='POST',**kw):
 r=admin.request(method,control+path,timeout=90,**kw);r.raise_for_status();return r.json() if r.content else None
def sql(q):return api('/database/query',json={'query':q})
# Never print supplier URLs, credentials or response bodies.
keys=api('/api-keys','GET');key=next(x['api_key'] for x in keys if x['name']=='service_role')
base='https://'+ref+'.supabase.co';headers={'apikey':key,'Authorization':'Bearer '+key}
def store(path,method='GET',**kw):
 r=requests.request(method,base+'/storage/v1/'+path,headers={**headers,**kw.pop('headers',{})},timeout=40,**kw);r.raise_for_status();return r.json() if r.content and 'json' in r.headers.get('content-type','') else None
usage=sql("select coalesce(sum((metadata->>'size')::bigint),0) as bytes from storage.objects")
print('Current project storage bytes:',usage[0]['bytes'],flush=True)
if int(usage[0]['bytes'])>700*1024*1024:raise RuntimeError('Insufficient free storage headroom')
sql('''create table if not exists public.diamond_photo_cache (ref text primary key,photo text not null,fingerprint text not null,updated_at timestamptz not null default now());
alter table public.diamond_photo_cache enable row level security;
revoke all on public.diamond_photo_cache from anon,authenticated;
grant select(ref,photo) on public.diamond_photo_cache to anon,authenticated;
grant all on public.diamond_photo_cache to service_role;
drop policy if exists "Fresh stock photos only" on public.diamond_photo_cache;
create policy "Fresh stock photos only" on public.diamond_photo_cache for select to anon,authenticated using(exists(select 1 from public.diamond_catalogue_snapshot s,jsonb_array_elements(s.payload) x where s.expires_at>now() and x->>'ref'=diamond_photo_cache.ref));
create table if not exists public.diamond_photo_attempts(ref text primary key, attempted_at timestamptz not null default now());
alter table public.diamond_photo_attempts enable row level security; revoke all on public.diamond_photo_attempts from anon,authenticated; grant all on public.diamond_photo_attempts to service_role;
notify pgrst,'reload schema';''')
buckets=store('bucket')
if not any(b['id']=='diamond-photos' for b in buckets):store('bucket','POST',json={'id':'diamond-photos','name':'diamond-photos','public':True,'file_size_limit':65536,'allowed_mime_types':['image/webp']})
# Fixed authenticated source, never an arbitrary-URL proxy.
receipt=requests.get('https://kps.diamonds:8443/estock/apistock',params={'user':os.environ['KPS_API_USER']},timeout=60).json()
u=urlparse(receipt.get('fileUrl',''))
if receipt.get('status')!='ok' or u.scheme!='https' or u.hostname!='kps.diamonds':raise RuntimeError('Invalid stock receipt')
r=requests.get(u.geturl(),timeout=90);r.raise_for_status();rows=list(csv.DictReader(io.StringIO(r.content.decode('utf-8-sig',errors='replace'))))
snap=sql('select payload,expires_at>now() as fresh from public.diamond_catalogue_snapshot where id=1')[0]
if not snap['fresh']:raise RuntimeError('Stock snapshot expired')
live={s['ref']:s for s in snap['payload']};source={r['STOCKID'].strip():r for r in rows if r['STATUS'].strip()=='PROMOTION'}
# Never delete based on a failed, empty or suspiciously different export.
if len(set(live)&set(source))<.95*len(live):raise RuntimeError('Source/snapshot mismatch')
old={r['ref']:r for r in sql('select * from public.diamond_photo_cache')}
sold=[x for x in old if x not in source or x not in live]
for start in range(0,len(sold),100):
 batch=sold[start:start+100];store('object/diamond-photos','DELETE',json={'prefixes':[x+'.webp' for x in batch]})
 sql('delete from public.diamond_photo_cache where ref in ('+','.join("'"+x.replace("'","''")+"'" for x in batch)+')')
 for x in batch:unstage_media('photos',x)
print('Removed sold assets:',len(sold),flush=True)
def candidate(st):
 row=source.get(st['ref']);formula=row.get('IMAGES/VIDEO','') if row else '';match=re.search(r'HYPERLINK\("([^\"]+)"',formula)
 if not match:return None
 gallery=match[1];u=urlparse(gallery)
 if u.scheme!='https' or u.hostname!='kps.diamonds' or u.path!='/estock/faces/ImageExpStockList.jsp':return None
 fingerprint=hashlib.sha256(gallery.encode()).hexdigest()
 return (st['ref'],gallery,fingerprint) if st['ref'] not in old or old[st['ref']]['fingerprint']!=fingerprint else None
attempts={x['ref']:x['attempted_at'] for x in sql('select * from public.diamond_photo_attempts')}
pending=[c for c in (candidate(s) for s in sorted(live.values(),key=lambda x:-x['discount'])) if c]
pending.sort(key=lambda c:attempts.get(c[0],''))
# Bounded run: 500 lookups, two concurrent connections, originals <=8MB, thumbnails <=64KB.
fail=0;done=0;deadline=time.monotonic()+900
cache_bytes=sum(int(x.get('bytes',0)) for x in [])
cache_usage=sql("select coalesce(sum((metadata->>'size')::bigint),0) as bytes from storage.objects where bucket_id='diamond-photos'")[0]['bytes']
limit=min(500,max(0,(256*1024*1024-int(cache_usage))//65536));work=pending[:limit]
def photo(item):
 if time.monotonic()>deadline:return None
 stock,gallery,fingerprint=item
 if not re.fullmatch(r'[A-Za-z0-9_-]{1,60}',stock):return None
 try:
  g=requests.get(gallery,timeout=20,allow_redirects=False);g.raise_for_status()
  if len(g.content)>1024*1024:return None
  links=re.findall(r'href=[\"\x27]([^\"\x27]+)',g.text)
  image=next((x for x in links if 'Officelight Gray-01.png' in unquote(x)),None)
  if not image:return None
  u=urlparse(image)
  if u.scheme!='https' or u.hostname!='images.kpsanghvi.com' or not u.path.startswith('/estock/CertifiedItemImages/'):return None
  rr=requests.get(image,timeout=25,stream=True,allow_redirects=False);rr.raise_for_status();data=bytearray()
  for chunk in rr.iter_content(65536):
   data.extend(chunk)
   if len(data)>8*1024*1024:return None
  Image.MAX_IMAGE_PIXELS=16*1024*1024
  im=ImageOps.exif_transpose(Image.open(io.BytesIO(data)));im.thumbnail((600,600));im=im.convert('RGB');out=io.BytesIO();im.save(out,'WEBP',quality=85)
  if out.tell()>65536:out=io.BytesIO();im.save(out,'WEBP',quality=65)
  if out.tell()>65536:return None
  data=out.getvalue()
  store('object/diamond-photos/'+stock+'.webp','POST',data=data,headers={'Content-Type':'image/webp','x-upsert':'true','cache-control':'3600'})
  stage_media('photos',stock,data);pending_rows.append((stock,fingerprint));return True
 except Exception:return None
 finally:
  sql("insert into public.diamond_photo_attempts(ref) values('%s') on conflict(ref) do update set attempted_at=now()"%stock)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for success in pool.map(photo,work):
  if success:done+=1
  else:fail+=1
pushed=publish_media()
pbase=REPO_BASE+'photos/' if pushed else base+'/storage/v1/object/public/diamond-photos/'
for stock,fingerprint in pending_rows:
 sql("insert into public.diamond_photo_cache(ref,photo,fingerprint) values('%s','%s%s.webp','%s') on conflict(ref) do update set photo=excluded.photo,fingerprint=excluded.fingerprint,updated_at=now()"%(stock,pbase,stock,fingerprint))
print('Photo batch:',json.dumps({'attempted':len(work),'cached':done,'fallback':fail,'pending_before':len(pending)}),flush=True)
print('Cache totals:',json.dumps(sql('select count(*) as photos from public.diamond_photo_cache')),flush=True)

