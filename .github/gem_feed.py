import json, re, os, subprocess, sys, urllib.request, datetime

BASE='https://eigdjzygkqyslwpcaotp.supabase.co'
KEY='sb_publishable_OjReDIKLqvD-vhuEW5vMQg_Gc3ligt6'  # public anon key, already shipped in gems/assets/stones.js
REPO=os.environ.get('GITHUB_WORKSPACE','.')
FEED=os.path.join(REPO,'gems','api','stones-with-videos.json')

def build():
    req=urllib.request.Request(BASE+'/rest/v1/stones?select=*&status=eq.available',headers={'apikey':KEY,'Authorization':'Bearer '+KEY})
    rows=json.load(urllib.request.urlopen(req,timeout=60))
    if not isinstance(rows,list) or not rows: raise RuntimeError('empty stock')
    src=open(os.path.join(REPO,'gems','assets','videos.js')).read()
    vm=json.loads(re.search(r'window\.VIDEO_MAP=(\{.*?\});window\.__poster',src).group(1))
    posters=json.loads(re.search(r'window\.__poster=(\{.*?\});\n?window\.STONES',src,re.S).group(1))
    def norm(o):
        h=str(o.get('heat') or '').lower().strip()
        heat='No heat' if re.match(r'^(no ?heat|unheat|unheated|nh)',h) else 'Heated'
        t=str(o.get('type') or '')
        typ='Ruby' if 'ruby' in t.lower() else ('Sapphire' if 'sapphire' in t.lower() else t.strip().capitalize())
        sh=str(o.get('shape') or '').lower()
        if 'heart' in sh: shape='Heart'
        elif re.search(r'cush.*ov|ov.*cush',sh): shape='Cushion / Oval'
        elif 'cush' in sh: shape='Cushion'
        elif 'oval' in sh: shape='Oval'
        elif 'oct' in sh: shape='Octagon'
        elif 'round' in sh: shape='Round'
        else: shape=(str(o.get('shape') or '').strip().capitalize())
        og=str(o.get('origin') or '').lower()
        if og.startswith('moz'): origin='Mozambique'
        elif og.startswith('meda') or og.startswith('mada'): origin='Madagascar'
        elif 'ceylon' in og or 'sri' in og: origin='Sri Lanka'
        elif 'africa' in og: origin='Africa'
        elif not og or og=='n/a': origin=''
        else: origin=str(o.get('origin') or '').strip().capitalize()
        return typ,heat,shape,origin
    def display_id(i):
        m=re.match(r'^#?(\d+)(\.\d+)?$',str(i))
        return '#%d%s'%(int(m.group(1))+7439,m.group(2) or '') if m else str(i)
    stones=[]
    for o in rows:
        vid=vm.get(o['id'])
        if not vid: continue
        typ,heat,shape,origin=norm(o)
        e={'stock':display_id(o['id']),'type':typ,'carat':float(o['carat']),'shape':shape,'origin':origin,'treatment':heat,'certificate':o.get('certificate') or '','color':o.get('color') or '','price_per_carat':float(o['price_per_carat']),'video':'https://naturaldiam.it/gems/'+vid}
        if posters.get(vid): e['poster']='https://naturaldiam.it/gems/'+posters[vid]
        stones.append(e)
    stones.sort(key=lambda s:(lambda m:(int(m.group(1)),float(m.group(2) or 0)))(re.match(r'^#(\d+)(\.\d+)?$',s['stock'])))
    return {'generated_at':datetime.date.today().isoformat(),'source':'https://naturaldiam.it/gems/','contact':'info@naturaldiam.it','currency':'USD','price_unit':'per_carat','count':len(stones),'stones':stones}

def git(*a): return subprocess.run(['git','-C',REPO]+list(a),capture_output=True,text=True)

try:
    feed=build()
except Exception as e:
    print('stock fetch failed, keeping existing feed:',e); sys.exit(0)  # never break the site on a bad refresh
body=json.dumps(feed,indent=1,ensure_ascii=False)+'\n'
old=open(FEED).read() if os.path.exists(FEED) else ''
# ignore generated_at when comparing so daily no-change runs do not commit
strip=lambda b: re.sub(r'"generated_at": "[^"]*"','"generated_at": ""',b)
if strip(old)==strip(body):
    print('feed unchanged, no commit'); sys.exit(0)
os.makedirs(os.path.dirname(FEED),exist_ok=True)
open(FEED,'w').write(body)
git('config','user.email','actions@users.noreply.github.com');git('config','user.name','github-actions')
git('add','--sparse','--',FEED)
c=git('commit','-q','-m','Gem video feed refresh: %d stones'%feed['count'])
if c.returncode!=0: print('commit failed:',c.stderr[:300]); sys.exit(1)
ok=False
for _ in range(5):
    git('rebase','--abort');git('fetch','-q','origin','main')
    if git('rebase','-q','origin/main').returncode!=0: continue
    if git('push','-q','origin','HEAD:main').returncode==0: ok=True;break
print('pushed' if ok else 'push failed - feed updated locally only');sys.exit(0 if ok else 1)
