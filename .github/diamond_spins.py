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
# Fixed authenticated source, never an arbitrary-URL proxy.
receipt=requests.get('https://kps.diamonds:8443/estock/apistock',params={'user':os.environ['KPS_API_USER']},timeout=60).json()
u=urlparse(receipt.get('fileUrl',''))
if receipt.get('status')!='ok' or u.scheme!='https' or u.hostname!='kps.diamonds':raise RuntimeError('Invalid stock receipt')
r=requests.get(u.geturl(),timeout=90);r.raise_for_status();rows=list(csv.DictReader(io.StringIO(r.content.decode('utf-8-sig',errors='replace'))))
snap=sql('select payload,expires_at>now() as fresh from public.diamond_catalogue_snapshot where id=1')[0]
if not snap['fresh']:raise RuntimeError('Stock snapshot expired')
live={s['ref']:s for s in snap['payload']};source={r['STOCKID'].strip():r for r in rows if r['STATUS'].strip()=='PROMOTION'}
if len(set(live)&set(source))<.95*len(live):raise RuntimeError('Source/snapshot mismatch')
ORDER_KEY='2606198511121984'
import base64
from cryptography.hazmat.primitives.ciphers import Cipher,algorithms,modes
from cryptography.hazmat.primitives.padding import PKCS7
# Only cached pixels and numeric frame dimensions are public. No viewer HTML/scripts/metadata leaves this worker.
sql('''create table if not exists public.diamond_spin_cache(ref text primary key,sprite text not null,width integer not null,height integer not null,frames integer not null,updated_at timestamptz not null default now());
alter table public.diamond_spin_cache enable row level security;revoke all on public.diamond_spin_cache from anon,authenticated;grant select on public.diamond_spin_cache to anon,authenticated;grant all on public.diamond_spin_cache to service_role;
drop policy if exists "Fresh stock spins only" on public.diamond_spin_cache;
create policy "Fresh stock spins only" on public.diamond_spin_cache for select to anon,authenticated using(exists(select 1 from public.diamond_catalogue_snapshot s,jsonb_array_elements(s.payload) x where s.expires_at>now() and x->>'ref'=diamond_spin_cache.ref));notify pgrst,'reload schema';''')
buckets=store('bucket')
if not any(x['id']=='diamond-spins' for x in buckets):store('bucket','POST',json={'id':'diamond-spins','name':'diamond-spins','public':True,'file_size_limit':1048576,'allowed_mime_types':['image/webp']})
old={x['ref']:x for x in sql('select ref from public.diamond_spin_cache')}
choices=[]
for stone in sorted(live.values(),key=lambda x:-x['discount']):
 row=source.get(stone['ref']);url=row.get('V360','').strip() if row else '';u=urlparse(url)
 if u.scheme=='https' and u.hostname=='images.kpsanghvi.com' and u.path=='/estock/video/'+stone['ref']+'/'+stone['ref']+'.html' and not u.query:choices.append((stone['ref'],url))
selected=choices[:100];keep={x[0] for x in selected};expired=[x for x in old if x not in keep]
if expired:
 store('object/diamond-spins','DELETE',json={'prefixes':[x+'.webp' for x in expired]})
 sql('delete from public.diamond_spin_cache where ref in ('+','.join("'"+x+"'" for x in expired)+')')
 for x in expired:unstage_media('spins',x)
usage=int(sql("select coalesce(sum((metadata->>'size')::bigint),0) as bytes from storage.objects where bucket_id='diamond-spins'")[0]['bytes'])
if usage>100*1024*1024:raise RuntimeError('Spin cache cap reached')
# Stable subset100,20 fetches/run,one connection,20MB input cap,1MB output cap. Unsupported structure never guesses frame order.
done=0;failed=0
for stock,url in [x for x in selected if x[0] not in old][:20]:
 try:
  r=requests.get(url,timeout=60,stream=True,allow_redirects=False);r.raise_for_status();data=bytearray()
  for c in r.iter_content(65536):
   data.extend(c)
   if len(data)>20*1024*1024:raise RuntimeError('Oversized viewer')
  text=data.decode('utf8');meta=json.loads(re.search(r"var strJSON0='([^']*)'",text)[1]);key=ORDER_KEY.encode()
  decryptor=Cipher(algorithms.AES(key),modes.CBC(key)).decryptor();raw=decryptor.update(base64.b64decode(meta['scramble']))+decryptor.finalize();pad=PKCS7(128).unpadder();order=json.loads(pad.update(raw)+pad.finalize())
  frames=[]
  for i in range(1,6):
   values=json.loads(re.search(r"var strJSON"+str(i)+r"='([^']*)'",text)[1]);mapping=list(map(str,order[i-1]));n=len(values)
   if n!=len(mapping) or sorted(map(int,mapping))!=list(range(n)):raise RuntimeError('Invalid frame map')
   images=[values[mapping.index(str(x))] for x in range(n)]
   if i==1:frames=images
   else:
    for x,v in enumerate(images):frames.insert(2*x+1,v)
  # Five levels yield64 native-ordered frames. Keep every other frame for32-angle lightweight playback.
  if len(frames)!=64:raise RuntimeError('Unexpected frame count')
  ims=[]
  for f in frames[::2]:
   im=Image.open(io.BytesIO(base64.b64decode(f))).convert('RGB');im.thumbnail((360,360));ims.append(im)
  width,height=ims[0].size
  if any(im.size!=(width,height) for im in ims):raise RuntimeError('Mixed frame sizes')
  atlas=Image.new('RGB',(width*8,height*4),'white')
  for i,im in enumerate(ims):atlas.paste(im,((i%8)*width,(i//8)*height))
  out=io.BytesIO();atlas.save(out,'WEBP',quality=78)
  if out.tell()>1048576:raise RuntimeError('Oversized spin sprite')
  data=out.getvalue()
  store('object/diamond-spins/'+stock+'.webp','POST',data=data,headers={'Content-Type':'image/webp','x-upsert':'true','cache-control':'3600'})
  stage_media('spins',stock,data);pending_rows.append((stock,width,height));done+=1
 except Exception:failed+=1
pushed=publish_media()
pbase=REPO_BASE+'spins/' if pushed else base+'/storage/v1/object/public/diamond-spins/'
for stock,width,height in pending_rows:
 sql("insert into public.diamond_spin_cache(ref,sprite,width,height,frames) values('%s','%s%s.webp',%d,%d,32) on conflict(ref) do update set sprite=excluded.sprite,width=excluded.width,height=excluded.height,frames=32,updated_at=now()"%(stock,pbase,stock,width,height))
print('Spin batch:',json.dumps({'subset':len(selected),'added':done,'unsupported':failed,'removed':len(expired)}),flush=True)
print('Spin total:',json.dumps(sql('select count(*) as spins from public.diamond_spin_cache')),flush=True)

