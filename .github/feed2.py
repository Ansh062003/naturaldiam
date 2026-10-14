import os,io,csv,re,json,math,hashlib,time,concurrent.futures,requests,collections
from urllib.parse import urlparse
from PIL import Image,ImageOps
ref='eigdjzygkqyslwpcaotp';control='https://api.supabase.com/v1/projects/'+ref
admin=requests.Session();admin.headers['Authorization']='Bearer '+os.environ['SUPABASE_ACCESS_TOKEN']
def api(path,method='POST',**kw):
 r=admin.request(method,control+path,timeout=90,**kw);r.raise_for_status();return r.json() if r.content else None
def sql(q):return api('/database/query',json={'query':q})
key=next(x['api_key'] for x in api('/api-keys','GET') if x['name']=='service_role')
base='https://'+ref+'.supabase.co';H={'apikey':key,'Authorization':'Bearer '+key}
def rest(path,method='GET',**kw):
 r=requests.request(method,base+'/rest/v1/'+path,headers={**H,**kw.pop('headers',{})},timeout=120,**kw);r.raise_for_status();return r.json() if r.content else None
def store(path,method='GET',**kw):
 r=requests.request(method,base+'/storage/v1/'+path,headers={**H,**kw.pop('headers',{})},timeout=40,**kw);r.raise_for_status();return r.json() if r.content and 'json' in r.headers.get('content-type','') else None
sql('''create table if not exists public.diamond_extra_snapshot (id integer primary key check (id=1), fetched_at timestamptz not null, expires_at timestamptz not null, payload jsonb not null);
alter table public.diamond_extra_snapshot enable row level security;
revoke all on public.diamond_extra_snapshot from anon,authenticated;
grant select on public.diamond_extra_snapshot to anon,authenticated;
drop policy if exists "Only fresh extra snapshot" on public.diamond_extra_snapshot;
create policy "Only fresh extra snapshot" on public.diamond_extra_snapshot for select to anon,authenticated using (expires_at > now());
grant all on public.diamond_extra_snapshot to service_role;
create table if not exists public.diamond_extra_photo_cache (ref text primary key,photo text not null,fingerprint text not null,updated_at timestamptz not null default now());
alter table public.diamond_extra_photo_cache enable row level security;
revoke all on public.diamond_extra_photo_cache from anon,authenticated;
grant select(ref,photo) on public.diamond_extra_photo_cache to anon,authenticated;
drop policy if exists "Extra photos readable" on public.diamond_extra_photo_cache;
create policy "Extra photos readable" on public.diamond_extra_photo_cache for select to anon,authenticated using (true);
grant all on public.diamond_extra_photo_cache to service_role;
create table if not exists public.diamond_extra_photo_attempts(ref text primary key, attempted_at timestamptz not null default now());
alter table public.diamond_extra_photo_attempts enable row level security; revoke all on public.diamond_extra_photo_attempts from anon,authenticated; grant all on public.diamond_extra_photo_attempts to service_role;
notify pgrst,'reload schema';''')
# ---- download feed (secret URL, never printed)
r=requests.get(os.environ['FEED2_URL'],timeout=180);r.raise_for_status()
rows=list(csv.DictReader(io.StringIO(r.content.decode('utf-8-sig',errors='replace'))))
if len(rows)<5000 or 'stock_no' not in rows[0] or 'rap' not in rows[0]:raise RuntimeError('Unexpected feed shape')
SH={'round':'Round','emerald':'Emerald','oval':'Oval','pear':'Pear','princess':'Princess','heart':'Heart','asscher':'Asscher','marquise':'Marquise','cushion':'Cushion'}
FL={'N':'NONE','F':'FNT','M':'MED','S':'STG','VS':'VST'}
def meas(s):
 s=(s or '').strip().lower().replace(' ','')
 m=re.fullmatch(r'([\d.]+)-([\d.]+)x([\d.]+)',s)
 if m:a,b,d=m.groups()
 else:
  m=re.fullmatch(r'([\d.]+)x([\d.]+)x([\d.]+)',s)
  if not m:return '-'
  a,b,d=m.groups()
 return '%s - %s X %s'%(a,b,d)
def sig(shape,carat,color,clarity,lab,m):
 d=re.findall(r'[\d.]+',m or '');depth=d[-1] if d else ''
 return '|'.join([shape,'%.2f'%float(carat),color,clarity,lab,depth])
# ---- KPS snapshot (read only) for duplicate detection
kps=rest('diamond_catalogue_snapshot?select=payload&id=eq.1')
kps=kps[0]['payload'] if kps else []
dups=set(sig(s['shape'],s['carat'],s['color'],s['clarity'],s['lab'],s.get('measure','')) for s in kps)
out=[];seen=set();st=collections.Counter();imgs={}
for x in rows:
 try:
  if x['shape'] not in SH:st['shape']+=1;continue
  if x['colsh']!='WH' or x['milky']!='M0':st['bgm']+=1;continue
  c=(x['comments'] or '').lower()
  if re.search(r'brown|green|milky',c):st['comment']+=1;continue
  rap=float(x['rap']);back=float(x['back']);car=float(x['carat'])
  if rap<=0 or car<=0 or not x['clarity'] or len(x['color'])!=1:st['fancy']+=1;continue
  cert=(x['report']+x['report_no']).strip()
  if cert in seen:st['dup_inner']+=1;continue
  seen.add(cert)
  m=meas(x['measurements']);shape=SH[x['shape']];lab=x['report']
  if sig(shape,car,x['color'],x['clarity'],lab,m) in dups:st['dup_kps']+=1;continue
  nd=min(0,math.trunc(back+7));disc=-nd;perct=rap*(1+nd/100);tot=perct*car
  cut='3EX' if x['cut']=='EX' and x['polish']=='EX' and x['symmetry']=='EX' else (x['cut'] if x['cut'] not in('--','') else '-')
  sid=x['stock_no'].strip()
  if not re.fullmatch(r'[0-9]{5,12}',sid):continue
  out.append({'id':100001+len(out),'ref':sid,'shape':shape,'carat':car,'color':x['color'],'clarity':x['clarity'],'cut':cut,'lab':lab,'measure':m,'polish':x['polish'],'symmetry':x['symmetry'],'fluorescence':FL.get(x['fluorescence'],x['fluorescence']),'discount':disc,'perCt':round(perct,2) if disc>60 else None,'total':round(tot,2) if disc>60 else None})
  imgs[sid]=x['image']
 except Exception:st['bad']+=1
print('Feed rows',len(rows),'kept',len(out),'priced',sum(1 for o in out if o['total'] is not None),dict(st),flush=True)
prev=rest('diamond_extra_snapshot?select=payload&id=eq.1')
if len(out)<2000 or (prev and len(out)<.5*len(prev[0]['payload'])):raise RuntimeError('Suspicious result, previous snapshot retained')
now=time.time();iso=lambda t:time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime(t))
rest('diamond_extra_snapshot?on_conflict=id','POST',headers={'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'},data=json.dumps({'id':1,'fetched_at':iso(now),'expires_at':iso(now+2*3600),'payload':out}))
print('Snapshot saved',flush=True)
# ---- photos
usage=int(sql("select coalesce(sum((metadata->>'size')::bigint),0) as b from storage.objects")[0]['b'])
print('Storage bytes',usage,flush=True)
live=set(o['ref'] for o in out)
if not any(b['id']=='diamond-extra-photos' for b in store('bucket')):store('bucket','POST',json={'id':'diamond-extra-photos','name':'diamond-extra-photos','public':True,'file_size_limit':65536,'allowed_mime_types':['image/webp']})
old={x['ref']:x for x in sql('select * from public.diamond_extra_photo_cache')}
sold=[k for k in old if k not in live]
for i in range(0,len(sold),100):
 b=sold[i:i+100];store('object/diamond-extra-photos','DELETE',json={'prefixes':[k+'.webp' for k in b]});sql('delete from public.diamond_extra_photo_cache where ref in ('+','.join("'"+k+"'" for k in b)+')')
hosts=collections.Counter(urlparse(u).hostname for u in imgs.values() if re.search(r'\.(jpe?g|png|webp)(\?|$)',u or '',re.I))
okhosts={h for h,n in hosts.items() if n>=100}
attempts={x['ref']:x['attempted_at'] for x in sql('select * from public.diamond_extra_photo_attempts')}
def fp(u):return hashlib.sha256(u.encode()).hexdigest()
pend=[(o['ref'],imgs[o['ref']]) for o in sorted(out,key=lambda o:(o['total'] is None,-o['discount'])) if urlparse(imgs[o['ref']]).hostname in okhosts and urlparse(imgs[o['ref']]).scheme=='https' and (o['ref'] not in old or old[o['ref']]['fingerprint']!=fp(imgs[o['ref']])) and attempts.get(o['ref'],'')<iso(now-12*3600)]
work=pend[:600] if usage<700*1024*1024 else []
deadline=time.monotonic()+1200
def photo(item):
 sid,url=item
 if time.monotonic()>deadline:return None
 try:
  rr=requests.get(url,timeout=25,stream=True,allow_redirects=False);rr.raise_for_status()
  if not rr.headers.get('content-type','').startswith('image/'):return None
  data=bytearray()
  for ch in rr.iter_content(65536):
   data.extend(ch)
   if len(data)>8*1024*1024:return None
  Image.MAX_IMAGE_PIXELS=16*1024*1024
  im=ImageOps.exif_transpose(Image.open(io.BytesIO(data)));im.thumbnail((500,500));im=im.convert('RGB');o=io.BytesIO();im.save(o,'WEBP',quality=75)
  if o.tell()>65536:o=io.BytesIO();im.save(o,'WEBP',quality=55)
  if o.tell()>65536:return None
  store('object/diamond-extra-photos/'+sid+'.webp','POST',data=o.getvalue(),headers={'Content-Type':'image/webp','x-upsert':'true','cache-control':'3600'})
  sql("insert into public.diamond_extra_photo_cache(ref,photo,fingerprint) values('%s','%s','%s') on conflict(ref) do update set photo=excluded.photo,fingerprint=excluded.fingerprint,updated_at=now()"%(sid,base+'/storage/v1/object/public/diamond-extra-photos/'+sid+'.webp',fp(url)));return True
 except Exception:return None
 finally:sql("insert into public.diamond_extra_photo_attempts(ref) values('%s') on conflict(ref) do update set attempted_at=now()"%sid)
done=0
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for s in pool.map(photo,work):done+=bool(s)
print('Photos',json.dumps({'pending':len(pend),'attempted':len(work),'cached':done,'total':sql('select count(*) as n from public.diamond_extra_photo_cache')[0]['n']}),flush=True)
