

(function () {
  var S = window.STONES || [], C = window.SITE || {};
  var N = {stockno:'id',id:'id',stone:'type',type:'type',carat:'carat',weight:'carat',treatment:'heat',heat:'heat',shape:'shape',origin:'origin',certificate:'certificate',colour:'color',color:'color',dimensions:'dimensions',priceperct:'pricePerCarat',pricepercarat:'pricePerCarat',video:'video',status:'status',srno:'id',stonename:'type',certcolour:'color',certcolor:'color',sizelwxdmm:'dimensions',sizelxwxdmm:'dimensions',weightcts:'carat',size:'dimensions',stocknumero:'id',measurement:'dimensions',alct:'pricePerCarat'};
  function parseCSV(t){var rows=[],r=[],f='',q=false,i,c;for(i=0;i<t.length;i++){c=t[i];if(q){if(c=='"'&&t[i+1]=='"'){f+='"';i++}else if(c=='"')q=false;else f+=c}else if(c=='"')q=true;else if(c==','){r.push(f);f=''}else if(c=='\n'){r.push(f);rows.push(r);r=[];f=''}else if(c!='\r')f+=c}if(f!==''||r.length){r.push(f);rows.push(r)}return rows}
  function fromCSV(t){var rows=parseCSV(t),h=rows.shift().map(function(x){return N[x.toLowerCase().replace(/[^a-z]/g,'')]||null});return rows.map(function(r){var o={};h.forEach(function(k,i){if(k)o[k]=(r[i]||'').trim()});o.id=/^[0-9]/.test(o.id)?'#'+o.id:o.id;o.carat=parseFloat(o.carat);o.pricePerCarat=parseFloat(String(o.pricePerCarat).replace(/[^0-9.]/g,''));return o}).filter(function(o){return o.id&&o.carat>0&&o.pricePerCarat>0&&!/^(sold|hold|reserved)$/i.test(o.status||'')})}
  function cap(x){x=String(x||'').trim();return x?x.charAt(0).toUpperCase()+x.slice(1).toLowerCase():''}
  function norm(o){var h=String(o.heat||'').toLowerCase().replace(/[^a-z]/g,''),t=String(o.type||'').toLowerCase(),sh=String(o.shape||'').toLowerCase(),og=String(o.origin||'').toLowerCase();
    o.heat=/^(no ?heat|unheat|unheated|nh)/.test(String(o.heat||'').toLowerCase().trim())||h==='noheat'||h==='unheat'||h==='unheated'?'No heat':'Heated';
    o.type=/ruby/.test(t)?'Ruby':/sapphire/.test(t)?'Sapphire':cap(o.type);
    o.shape=/heart/.test(sh)?'Heart':/cush.*ov|ov.*cush/.test(sh)?'Cushion / Oval':/cush/.test(sh)?'Cushion':/oval/.test(sh)?'Oval':/oct/.test(sh)?'Octagon':/round/.test(sh)?'Round':cap(o.shape);
    o.origin=/^moz/.test(og)?'Mozambique':/^(meda|mada)/.test(og)?'Madagascar':/ceylon|sri/.test(og)?'Sri Lanka':/africa/.test(og)?'Africa':(!og||og==='n/a')?'':cap(o.origin);
    o.dimensions=String(o.dimensions||'').replace(/X/g,'x');return o}
  function init(){
    document.documentElement.setAttribute('data-source', window.__src || 'baked');
    S=S.map(norm);
  var $ = function (id) { return document.getElementById(id); };
  if (!C.showPrices) { var _so = document.getElementById('sort'); if (_so) Array.prototype.slice.call(_so.options).forEach(function (o) { if (o.value === 'pa' || o.value === 'pd') _so.removeChild(o); }); }
  $('name').textContent = C.name; $('tag').textContent = C.tagline;
  $('foot').innerHTML = C.footHtml || ('Contact: <a href="mailto:' + C.contact + '">' + C.contact + '</a>');
  var types = []; S.forEach(function (s) { if (types.indexOf(s.type) < 0) types.push(s.type); });
  $('type').innerHTML = '<option value="">All stones</option>' + types.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('');
  var origins = []; S.forEach(function (s) { if (s.origin && origins.indexOf(s.origin) < 0) origins.push(s.origin); }); origins.sort();
  $('origin').innerHTML = '<option value="">All origins</option>' + origins.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('');
  var fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: C.currency || 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 });
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function embed(u, id) {
    if (!u) return '<div class="vid none"><span>Video coming soon</span></div>';
    if (C.videoMode === 'link') return '<a class="vid none link" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer"><span>&#9654; Watch video</span></a>';
    var m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
    if (m) return '<div class="vid"><iframe loading="lazy" src="https://www.youtube.com/embed/' + m[1] + '" title="Video ' + esc(id) + '" allowfullscreen></iframe></div>';
    m = u.match(/vimeo\.com\/(\d+)/);
    if (m) return '<div class="vid"><iframe loading="lazy" src="https://player.vimeo.com/video/' + m[1] + '" title="Video ' + esc(id) + '" allowfullscreen></iframe></div>';
    m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (m) return '<div class="vid"><iframe loading="lazy" src="https://drive.google.com/file/d/' + m[1] + '/preview" title="Video ' + esc(id) + '" allowfullscreen></iframe></div>';
    return '<div class="vid"><video poster="' + esc((window.__poster||{})[u]||'') + '" src="' + esc(u) + '" muted loop playsinline preload="metadata"></video><button class="pbtn" type="button" aria-label="Play video">&#9654;</button></div>';
  }
  function total(s) { return s.pricePerCarat * s.carat; }
  function render() {
    var q = $('q').value.toLowerCase(), t = $('type').value, og = $('origin').value, z = $('size').value, h = $('heat').value, so = $('sort').value;
    var r = S.filter(function (s) {
      if (t && s.type !== t) return false;
      if (og && s.origin !== og) return false;
      if (h && s.heat !== h) return false;
      if (z) { var p = z.split('-'); if (s.carat < +p[0] || s.carat >= +p[1]) return false; }
      if (q && (s.id + ' ' + s.type + ' ' + s.shape + ' ' + (s.origin || '') + ' ' + (s.certificate||'')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    if (so) r.sort(function (a, b) { return so === 'pa' ? total(a) - total(b) : so === 'pd' ? total(b) - total(a) : so === 'ca' ? a.carat - b.carat : b.carat - a.carat; });
    $('count').textContent = r.length + ' of ' + S.length + ' stones';
    $('empty').hidden = r.length > 0;
    $('grid').innerHTML = r.map(function (s) {
      return '<article class="card">' + embed(s.video, s.id) + '<div class="body"><h3>' + esc(s.type) + '<span>' + s.carat.toFixed(2) + ' ct</span></h3><p class="sid"><span>Stock no.</span> ' + esc(s.id) + (s.sample ? ' - sample' : '') + '</p><dl>' +
        '<dt>Treatment</dt><dd>' + esc(s.heat) + '</dd>' +
        ((s.origin || s.certificate) ? '<dt>Origin / Certificate</dt><dd>' + (s.origin ? '<span>' + esc(s.origin) + '</span>' : '') + (s.origin && s.certificate ? ' · ' : '') + (s.certificate ? '<span>' + esc(s.certificate) + '</span>' : '') + '</dd>' : '') + '</dl>' +
        (C.showPrices ? '<p class="price"><span class="ppc">' + fmt.format(s.pricePerCarat) + ' <small>/ ct</small></span></p>' : '') +
        '<a class="ask" target="_blank" rel="noopener noreferrer" href="https://wa.me/393513976900?text=' + encodeURIComponent('Hello, I am interested in stone ' + s.id + ' (' + s.type + ', ' + s.carat.toFixed(2) + ' ct) on your website.') + '">Enquire on WhatsApp</a></div></article>';
    }).join('');
  }
  ['q', 'type', 'origin', 'size', 'heat', 'sort'].forEach(function (id) { $(id).addEventListener('input', render); });
  $('reset').addEventListener('click', function () { ['q', 'type', 'origin', 'size', 'heat', 'sort'].forEach(function (id) { $(id).value = ''; }); render(); });
  $('grid').addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('.vid') : null; if (!b) return; var v = b.querySelector('video'); if (!v) return; if (v.paused) { v.controls = true; v.play(); b.classList.add('playing'); } else if (e.target === v) { v.pause(); } });
  $('grid').addEventListener('error',function(e){var v=e.target;if(v.tagName!=='VIDEO')return;var card=v.closest('.card'),id=card&&card.querySelector('.sid');var stock=id&&id.textContent.match(/#[0-9.]+/);var fallback=stock&&(window.VIDEO_MAP||{})[stock[0]];if(fallback&&!v.dataset.fallback){v.dataset.fallback='1';v.poster=(window.__poster||{})[fallback]||'';v.src=fallback;v.load();}},true);
  render();
  }
  function request(url, opts) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function(){if(ctrl)ctrl.abort();}, 8000);
    opts=opts||{}; if(ctrl)opts.signal=ctrl.signal;
    return fetch(url,opts).then(function(r){clearTimeout(timer);if(!r.ok)throw Error('Stock unavailable');return r;},function(e){clearTimeout(timer);throw e;});
  }
  function sheetFallback(){
    if(!C.sheetCsvUrl){init();return;}
    request(C.sheetCsvUrl+(C.sheetCsvUrl.indexOf('?')<0?'?':'&')+'_='+Date.now(),{cache:'no-store'}).then(function(r){return r.text();}).then(function(t){
      var d=fromCSV(t);if(!d.length)throw Error('Empty sheet');
      d.forEach(function(o){if(!o.video)o.video=(window.VIDEO_MAP||{})[o.id]||'';});
      S=d;window.__src='sheet';init();
    }).catch(function(){window.__src='baked';init();});
  }
  if(C.supabaseUrl && C.supabaseKey){
    request(C.supabaseUrl+'/rest/v1/stones?select=*&status=eq.available&order=carat',{headers:{apikey:C.supabaseKey},cache:'no-store'}).then(function(r){return r.json();}).then(function(d){
      if(!Array.isArray(d))throw Error('Invalid stock');
      var base=C.supabaseUrl+'/storage/v1/object/public/videos/';
      var next=d.map(function(o){o.pricePerCarat=Number(o.price_per_carat);o.carat=Number(o.carat);
        o.video=o.video_path?base+o.video_path:'';
        if(o.video){window.__poster=window.__poster||{};window.__poster[o.video]=o.poster_path?base+o.poster_path:'';}
        return o;});
      if(next.some(function(o){return !o.id||!(o.carat>0)||!(o.pricePerCarat>0);}))throw Error('Invalid stone');
      next.sort(function(a,b){return parseFloat(a.id.replace('#',''))-parseFloat(b.id.replace('#',''));});
      S=next;window.__src='supabase';init();
    }).catch(sheetFallback);
  }else sheetFallback();
})();
