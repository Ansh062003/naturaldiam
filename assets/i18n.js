(function(){
var LANGS=['en','it','fr','es','de'],NAMES={en:'EN',it:'IT',fr:'FR',es:'ES',de:'DE'};
// each entry: English -> [it, fr, es, de]
var D={
"Menu":["Menu","Menu","Menú","Menü"],
"Home":["Home","Accueil","Inicio","Start"],
"Diamonds":["Diamanti","Diamants","Diamantes","Diamanten"],
"Rubies & Sapphires":["Rubini e Zaffiri","Rubis et Saphirs","Rubíes y Zafiros","Rubine & Saphire"],
"Contact":["Contatti","Contact","Contacto","Kontakt"],
"Certified natural diamonds, rubies and sapphires, crafted and supplied from our offices in Milano, Mumbai and Bangkok":["Diamanti naturali, rubini e zaffiri certificati, lavorati e forniti dai nostri uffici di Milano, Mumbai e Bangkok","Diamants naturels, rubis et saphirs certifiés, façonnés et fournis depuis nos bureaux de Milano, Mumbai et Bangkok","Diamantes naturales, rubíes y zafiros certificados, elaborados y suministrados desde nuestras oficinas en Milano, Mumbai y Bangkok","Zertifizierte Naturdiamanten, Rubine und Saphire, gefertigt und geliefert aus unseren Büros in Milano, Mumbai und Bangkok"],
"View the stones":["Scopri le pietre","Voir les pierres","Ver las piedras","Steine ansehen"],
"Get in touch":["Contattaci","Contactez-nous","Contáctenos","Kontakt aufnehmen"],
"Certified fine gems and diamonds":["Gemme pregiate e diamanti certificati","Gemmes fines et diamants certifiés","Gemas finas y diamantes certificados","Zertifizierte Edelsteine und Diamanten"],
"Origin & treatment disclosed":["Origine e trattamenti dichiarati","Origine et traitements communiqués","Origen y tratamientos declarados","Herkunft und Behandlung angegeben"],
"Who we are":["Chi siamo","Qui sommes-nous","Quiénes somos","Über uns"],
"Natural stones, honestly described.":["Pietre naturali, descritte con onestà.","Des pierres naturelles, décrites en toute honnêteté.","Piedras naturales, descritas con honestidad.","Natursteine, ehrlich beschrieben."],
"Natural Diam Srl supplies natural loose diamonds and fine coloured gemstones to jewellers, dealers and collectors. Every stone is sold with a laboratory certificate, and we state the species, origin and treatment of each one plainly, so you know exactly what you are buying.":["Natural Diam Srl fornisce diamanti naturali sciolti e pregiate pietre colorate a gioiellieri, commercianti e collezionisti. Ogni pietra è venduta con certificato di laboratorio e indichiamo con chiarezza specie, origine e trattamento di ciascuna, così sai esattamente cosa stai acquistando.","Natural Diam Srl fournit des diamants naturels non montés et des pierres de couleur fines aux joailliers, négociants et collectionneurs. Chaque pierre est vendue avec un certificat de laboratoire, et nous indiquons clairement l'espèce, l'origine et le traitement de chacune, afin que vous sachiez exactement ce que vous achetez.","Natural Diam Srl suministra diamantes naturales sueltos y gemas de color finas a joyeros, comerciantes y coleccionistas. Cada piedra se vende con certificado de laboratorio, y indicamos con claridad la especie, el origen y el tratamiento de cada una, para que sepa exactamente lo que compra.","Natural Diam Srl liefert natürliche lose Diamanten und feine Farbedelsteine an Juweliere, Händler und Sammler. Jeder Stein wird mit einem Laborzertifikat verkauft, und wir geben Art, Herkunft und Behandlung jedes Steins klar an, damit Sie genau wissen, was Sie kaufen."],
"What we offer":["Cosa offriamo","Ce que nous proposons","Qué ofrecemos","Unser Angebot"],
"Natural Diamonds":["Diamanti naturali","Diamants naturels","Diamantes naturales","Naturdiamanten"],
"Loose natural diamonds certified by GIA and IGI. Ask us for the current selection.":["Diamanti naturali sciolti certificati GIA e IGI. Chiedici la selezione attuale.","Diamants naturels non montés certifiés GIA et IGI. Demandez-nous la sélection actuelle.","Diamantes naturales sueltos certificados por GIA e IGI. Pídanos la selección actual.","Lose Naturdiamanten mit GIA- und IGI-Zertifikat. Fragen Sie nach der aktuellen Auswahl."],
"Enquire":["Richiedi info","Nous consulter","Consultar","Anfragen"],
"Certified rubies and sapphires from 2 carats, with origin and treatment stated.":["Rubini e zaffiri certificati da 2 carati, con origine e trattamento dichiarati.","Rubis et saphirs certifiés à partir de 2 carats, avec origine et traitement indiqués.","Rubíes y zafiros certificados desde 2 quilates, con origen y tratamiento indicados.","Zertifizierte Rubine und Saphire ab 2 Karat, mit Angabe von Herkunft und Behandlung."],
"Browse the stones":["Sfoglia le pietre","Parcourir les pierres","Ver las piedras","Steine ansehen"],
"Certified":["Certificato","Certifié","Certificado","Zertifiziert"],
"Each stone comes with its lab report from a recognised gemmological laboratory.":["Ogni pietra è accompagnata dal rapporto di un laboratorio gemmologico riconosciuto.","Chaque pierre est accompagnée de son rapport d'un laboratoire gemmologique reconnu.","Cada piedra incluye su informe de un laboratorio gemológico reconocido.","Jeder Stein wird mit dem Bericht eines anerkannten gemmologischen Labors geliefert."],
"Transparent":["Trasparente","Transparent","Transparente","Transparent"],
"Species, origin and treatment are disclosed for every stone, with no surprises.":["Specie, origine e trattamento sono dichiarati per ogni pietra, senza sorprese.","Espèce, origine et traitement sont communiqués pour chaque pierre, sans mauvaise surprise.","Especie, origen y tratamiento se declaran en cada piedra, sin sorpresas.","Art, Herkunft und Behandlung werden für jeden Stein offengelegt, ohne Überraschungen."],
"Personal":["Diretto","Contact direct","Trato personal","Persönlich"],
"Talk directly to our team in Milano, Mumbai or Bangkok, by phone or WhatsApp, about what you need.":["Parla direttamente con il nostro team a Milano, Mumbai o Bangkok, per telefono o WhatsApp, di ciò che ti serve.","Parlez directement à notre équipe à Milano, Mumbai ou Bangkok, par téléphone ou WhatsApp, de ce dont vous avez besoin.","Hable directamente con nuestro equipo en Milano, Mumbai o Bangkok, por teléfono o WhatsApp, sobre lo que necesita.","Sprechen Sie direkt mit unserem Team in Milano, Mumbai oder Bangkok, per Telefon oder WhatsApp, über Ihren Bedarf."],
"20,000+":["20.000+","20 000+","20.000+","20.000+"],
"Natural diamonds":["Diamanti naturali","Diamants naturels","Diamantes naturales","Naturdiamanten"],
"Certified gems":["Gemme certificate","Gemmes certifiées","Gemas certificadas","Zertifizierte Edelsteine"],
"Certified rubies & sapphires":["Rubini e zaffiri certificati","Rubis et saphirs certifiés","Rubíes y zafiros certificados","Zertifizierte Rubine & Saphire"],
"Diamond certificates":["Certificati per diamanti","Certificats de diamants","Certificados de diamantes","Diamantzertifikate"],
"Origins in stock today":["Origini disponibili oggi","Origines en stock aujourd'hui","Orígenes en stock hoy","Herkünfte aktuell auf Lager"],
"Offices: Milano, Mumbai, Bangkok":["Uffici: Milano, Mumbai, Bangkok","Bureaux : Milano, Mumbai, Bangkok","Oficinas: Milano, Mumbai, Bangkok","Büros: Milano, Mumbai, Bangkok"],
"We work with":["Collaboriamo con","Nous travaillons avec","Trabajamos con","Wir arbeiten mit"],
"Visit us or write to us.":["Vieni a trovarci o scrivici.","Rendez-nous visite ou écrivez-nous.","Visítenos o escríbanos.","Besuchen Sie uns oder schreiben Sie uns."],
"Tell us what you are looking for and we will come back with options, with certificates and videos.":["Dicci cosa cerchi e torneremo da te con alcune proposte, complete di certificati e video.","Dites-nous ce que vous cherchez et nous reviendrons vers vous avec des propositions, certificats et vidéos à l'appui.","Cuéntenos qué busca y le responderemos con opciones, con certificados y vídeos.","Sagen Sie uns, wonach Sie suchen, und wir melden uns mit Optionen samt Zertifikaten und Videos."],
"WhatsApp us":["Scrivici su WhatsApp","Écrivez-nous sur WhatsApp","Escríbanos por WhatsApp","Schreiben Sie uns auf WhatsApp"],
"Company":["Azienda","Société","Empresa","Unternehmen"],
"Offices":["Uffici","Bureaux","Oficinas","Büros"],
"Milano address":["Indirizzo di Milano","Adresse de Milano","Dirección de Milano","Adresse Milano"],
"Stones":["Pietre","Pierres","Piedras","Steine"],
"Calibrated melee and certified natural diamonds":["Melee calibrati e diamanti naturali certificati","Mêlée calibrée et diamants naturels certifiés","Melee calibrado y diamantes naturales certificados","Kalibrierte Melee- und zertifizierte Naturdiamanten"],
"Enquire on WhatsApp":["Scrivici su WhatsApp","Écrivez-nous sur WhatsApp","Escríbanos por WhatsApp","Anfrage per WhatsApp"],
"GIA & IGI certified":["Certificati GIA e IGI","Certifiés GIA et IGI","Certificados GIA e IGI","GIA- und IGI-zertifiziert"],
"Natural diamonds ":["","","",""],
"Calibrated. Certified. Natural.":["Calibrati. Certificati. Naturali.","Calibrés. Certifiés. Naturels.","Calibrados. Certificados. Naturales.","Kalibriert. Zertifiziert. Natürlich."],
"We offer perfectly calibrated melee sizes up to 0.70mm and we also supply certified diamonds above 0.30ct.":["Offriamo melee perfettamente calibrati fino a 0,70 mm e forniamo anche diamanti certificati sopra 0,30 ct.","Nous proposons des mêlées parfaitement calibrées jusqu'à 0,70 mm et fournissons également des diamants certifiés de plus de 0,30 ct.","Ofrecemos melee perfectamente calibrado hasta 0,70 mm y también suministramos diamantes certificados de más de 0,30 ct.","Wir bieten perfekt kalibrierte Melee-Größen bis 0,70 mm und liefern außerdem zertifizierte Diamanten über 0,30 ct."],
"0.70mm":["0,70 mm","0,70 mm","0,70 mm","0,70 mm"],
"0.30ct+":["0,30 ct+","0,30 ct+","0,30 ct+","0,30 ct+"],
"Calibrated melee":["Melee calibrati","Mêlée calibrée","Melee calibrado","Kalibrierte Melee"],
"Perfectly calibrated melee sizes up to 0.70mm.":["Melee perfettamente calibrati fino a 0,70 mm.","Mêlées parfaitement calibrées jusqu'à 0,70 mm.","Melee perfectamente calibrado hasta 0,70 mm.","Perfekt kalibrierte Melee-Größen bis 0,70 mm."],
"Certified diamonds":["Diamanti certificati","Diamants certifiés","Diamantes certificados","Zertifizierte Diamanten"],
"Certified diamonds above 0.30ct, with the laboratory report.":["Diamanti certificati sopra 0,30 ct, con rapporto di laboratorio.","Diamants certifiés de plus de 0,30 ct, avec rapport de laboratoire.","Diamantes certificados de más de 0,30 ct, con informe de laboratorio.","Zertifizierte Diamanten über 0,30 ct, mit Laborbericht."],
"Certificates":["Certificati","Certificats","Certificados","Zertifikate"],
"Reports you can trust.":["Rapporti affidabili.","Des rapports de confiance.","Informes en los que confiar.","Berichte, denen Sie vertrauen können."],
"Our promise":["La nostra promessa","Notre engagement","Nuestro compromiso","Unser Versprechen"],
"Full traceability":["Piena tracciabilità","Traçabilité complète","Trazabilidad total","Lückenlose Rückverfolgbarkeit"],
"Every stone has a record. Before you buy, we tell you what the diamond is, who graded it, and what we know about where it came from.":["Ogni pietra ha una scheda. Prima di acquistare ti diciamo che diamante è, chi lo ha classificato e cosa sappiamo della sua provenienza.","Chaque pierre a son dossier. Avant votre achat, nous vous disons ce qu'est le diamant, qui l'a gradué et ce que nous savons de son origine.","Cada piedra tiene su registro. Antes de comprar, le decimos qué es el diamante, quién lo clasificó y qué sabemos sobre su procedencia.","Jeder Stein hat eine Akte. Vor dem Kauf sagen wir Ihnen, was der Diamant ist, wer ihn begutachtet hat und was wir über seine Herkunft wissen."],
"Identified":["Identificato","Identifié","Identificado","Identifiziert"],
"Each certified diamond is tied to its own laboratory report, so the stone and the paper always match.":["Ogni diamante certificato è legato al proprio rapporto di laboratorio, così pietra e documento corrispondono sempre.","Chaque diamant certifié est lié à son propre rapport de laboratoire : la pierre et le document correspondent toujours.","Cada diamante certificado va unido a su propio informe de laboratorio, de modo que la piedra y el documento siempre coinciden.","Jeder zertifizierte Diamant ist seinem eigenen Laborbericht zugeordnet, sodass Stein und Dokument immer übereinstimmen."],
"Documented":["Documentato","Documenté","Documentado","Dokumentiert"],
"We keep records for every parcel and share the origin information we hold on request.":["Conserviamo la documentazione di ogni lotto e, su richiesta, condividiamo le informazioni sull'origine in nostro possesso.","Nous conservons les dossiers de chaque parcelle et communiquons sur demande les informations d'origine dont nous disposons.","Conservamos registros de cada lote y, previa solicitud, compartimos la información de origen de que disponemos.","Wir führen Aufzeichnungen zu jeder Partie und teilen auf Anfrage die uns vorliegenden Herkunftsinformationen."],
"Disclosed":["Dichiarato","Communiqué","Declarado","Offengelegt"],
"Natural origin and any treatment are stated up front, in writing.":["Origine naturale ed eventuali trattamenti sono dichiarati subito, per iscritto.","L'origine naturelle et tout traitement sont indiqués d'emblée, par écrit.","El origen natural y cualquier tratamiento se declaran desde el principio, por escrito.","Natürliche Herkunft und jede Behandlung werden vorab schriftlich angegeben."],
"Ask us for the documents on any stone":["Chiedici i documenti di qualsiasi pietra","Demandez-nous les documents de n'importe quelle pierre","Solicítenos los documentos de cualquier piedra","Fragen Sie uns nach den Unterlagen zu jedem Stein"],
"Tell us what you need":["Dicci cosa ti serve","Dites-nous ce dont vous avez besoin","Díganos qué necesita","Sagen Sie uns, was Sie brauchen"],
"Send us the size, quantity or carat weight you are looking for and we will come back with options.":["Inviaci la dimensione, la quantità o il peso in carati che cerchi e ti proporremo delle opzioni.","Envoyez-nous la taille, la quantité ou le poids en carats recherchés et nous vous proposerons des options.","Envíenos el tamaño, la cantidad o el peso en quilates que busca y le responderemos con opciones.","Senden Sie uns Größe, Menge oder Karatgewicht, die Sie suchen, und wir melden uns mit Optionen."],
"The collection":["La collezione","La collection","La colección","Die Kollektion"],
"Search":["Cerca","Recherche","Buscar","Suche"],
"Stone":["Pietra","Pierre","Piedra","Stein"],
"All stones":["Tutte le pietre","Toutes les pierres","Todas las piedras","Alle Steine"],
"Size":["Dimensione","Taille","Tamaño","Größe"],
"All sizes":["Tutte le dimensioni","Toutes les tailles","Todos los tamaños","Alle Größen"],
"Origin":["Origine","Origine","Origen","Herkunft"],
"All origins":["Tutte le origini","Toutes les origines","Todos los orígenes","Alle Herkünfte"],
"Heat":["Trattamento termico","Traitement thermique","Tratamiento térmico","Hitzebehandlung"],
"All":["Tutti","Tous","Todos","Alle"],
"Sort":["Ordina","Trier","Ordenar","Sortieren"],
"Default":["Predefinito","Par défaut","Predeterminado","Standard"],
"Price low to high":["Prezzo crescente","Prix croissant","Precio de menor a mayor","Preis aufsteigend"],
"Price high to low":["Prezzo decrescente","Prix décroissant","Precio de mayor a menor","Preis absteigend"],
"Carat low to high":["Carati crescenti","Carats croissants","Quilates de menor a mayor","Karat aufsteigend"],
"Carat high to low":["Carati decrescenti","Carats décroissants","Quilates de mayor a menor","Karat absteigend"],
"Reset":["Azzera","Réinitialiser","Restablecer","Zurücksetzen"],
"No stones match these filters.":["Nessuna pietra corrisponde ai filtri.","Aucune pierre ne correspond à ces filtres.","Ninguna piedra coincide con estos filtros.","Keine Steine entsprechen diesen Filtern."],
"Stock no., stone, shape":["N. stock, pietra, forma","N° de stock, pierre, forme","N.º de stock, piedra, forma","Lagernr., Stein, Form"],
"Treatment":["Trattamento","Traitement","Tratamiento","Behandlung"],
"Shape":["Forma","Forme","Forma","Form"],
"Colour":["Colore","Couleur","Color","Farbe"],
"Certificate":["Certificato","Certificat","Certificado","Zertifikat"],
"Heated":["Riscaldato","Chauffé","Con tratamiento térmico","Erhitzt"],
"Heat ":["","","",""],
"No heat":["Non riscaldato","Non chauffé","Sin tratamiento térmico","Unerhitzt"],
"Ruby":["Rubino","Rubis","Rubí","Rubin"],
"Sapphire":["Zaffiro","Saphir","Zafiro","Saphir"],
"Cushion":["Cuscino","Coussin","Cojín","Kissen"],"Cush":["Cuscino","Coussin","Cojín","Kissen"],"cush":["Cuscino","Coussin","Cojín","Kissen"],
"Oval":["Ovale","Ovale","Ovalado","Oval"],"Heart":["Cuore","Cœur","Corazón","Herz"],
"Burma":["Birmania","Birmanie","Birmania","Birma"],"Mozambique":["Mozambico","Mozambique","Mozambique","Mosambik"],"Madagascar":["Madagascar","Madagascar","Madagascar","Madagaskar"],"Africa":["Africa","Afrique","África","Afrika"],"N/A":["N/D","N/D","N/D","k. A."],
"Blue":["Blu","Bleu","Azul","Blau"],"Red":["Rosso","Rouge","Rojo","Rot"],"RED":["Rosso","Rouge","Rojo","Rot"],"Deep Red":["Rosso profondo","Rouge profond","Rojo profundo","Tiefrot"],"Intense Red":["Rosso intenso","Rouge intense","Rojo intenso","Intensives Rot"],"Pigeon Blood":["Sangue di piccione","Sang de pigeon","Sangre de paloma","Taubenblut"],"Cornflower Blue":["Blu fiordaliso","Bleu bleuet","Azul aciano","Kornblumenblau"],"Royal Blue":["Blu reale","Bleu roi","Azul real","Königsblau"],"Reddish purple":["Viola rossastro","Violet rougeâtre","Violeta rojizo","Rötlich-violett"],
"Natural Diamonds - Natural Diam Milano":["Diamanti naturali - Natural Diam Milano","Diamants naturels - Natural Diam Milano","Diamantes naturales - Natural Diam Milano","Naturdiamanten - Natural Diam Milano"],
"Natural Diam Milano - Certified Rubies and Sapphires":["Natural Diam Milano - Rubini e zaffiri certificati","Natural Diam Milano - Rubis et saphirs certifiés","Natural Diam Milano - Rubíes y zafiros certificados","Natural Diam Milano - Zertifizierte Rubine und Saphire"],
"Contact - Natural Diam":["Contatti - Natural Diam","Contact - Natural Diam","Contacto - Natural Diam","Kontakt - Natural Diam"],
"Tell us what you are looking for. Stones, sizes, certificates or prices: we reply quickly, from Milano, Mumbai and Bangkok.":["Dicci cosa cerchi. Pietre, dimensioni, certificati o prezzi: rispondiamo rapidamente, da Milano, Mumbai e Bangkok.","Dites-nous ce que vous cherchez. Pierres, tailles, certificats ou prix : nous répondons rapidement, depuis Milano, Mumbai et Bangkok.","Cuéntenos qué busca. Piedras, tamaños, certificados o precios: respondemos con rapidez, desde Milano, Mumbai y Bangkok.","Sagen Sie uns, wonach Sie suchen. Steine, Größen, Zertifikate oder Preise: Wir antworten schnell, aus Milano, Mumbai und Bangkok."],
"Fastest way":["Il modo più rapido","Le plus rapide","La forma más rápida","Der schnellste Weg"],
"Message us on WhatsApp":["Scrivici su WhatsApp","Écrivez-nous sur WhatsApp","Escríbanos por WhatsApp","Schreiben Sie uns auf WhatsApp"],
"Send the stone number or your requirements. We answer with availability, video and price.":["Invia il numero della pietra o le tue richieste. Rispondiamo con disponibilità, video e prezzo.","Envoyez le numéro de la pierre ou vos besoins. Nous répondons avec disponibilité, vidéo et prix.","Envíe el número de la piedra o sus requisitos. Respondemos con disponibilidad, vídeo y precio.","Senden Sie die Steinnummer oder Ihre Anforderungen. Wir antworten mit Verfügbarkeit, Video und Preis."],
"General enquiries":["Richieste generali","Demandes générales","Consultas generales","Allgemeine Anfragen"],
"Certificates & reports":["Certificati e rapporti","Certificats et rapports","Certificados e informes","Zertifikate und Berichte"],
"Our offices":["I nostri uffici","Nos bureaux","Nuestras oficinas","Unsere Büros"],
"Office":["Ufficio","Bureau","Oficina","Büro"],
"Italy":["Italia","Italie","Italia","Italien"],"India":["India","Inde","India","Indien"],"Thailand":["Thailandia","Thaïlande","Tailandia","Thailand"]
};
var H1={"d_h1":["Diamanti<br>Naturali","Diamants<br>Naturels","Diamantes<br>Naturales","Natürliche<br>Diamanten"]};
var COUNT=[["$1 di $2 pietre","$1 sur $2 pierres","$1 de $2 piedras","$1 von $2 Steinen"]];
var lang='en',store=new WeakMap(),hstore=new WeakMap(),obs;
function norm(s){return s.replace(/\s+/g,' ').trim()}
function find(key,i){var e=D[key];if(e&&e[i]!==undefined&&e[i]!=='')return e[i];
 if(key.indexOf(' / ')>0){var p=key.split(' / '),ok=false,o=p.map(function(x){var f=D[x];if(f&&f[i]){ok=true;return f[i]}return x});if(ok)return o.join(' / ')}
 var m=key.match(/^(\d+) of (\d+) stones$/);if(m)return COUNT[0][i].replace('$1',m[1]).replace('$2',m[2]);
 return null}
function tNode(n){
 var orig=store.get(n);if(orig===undefined){orig=n.nodeValue;store.set(n,orig)}
 var i=LANGS.indexOf(lang)-1,key=norm(orig),out=orig;
 if(i>=0&&key){var r=find(key,i);if(r!==null){var l=orig.match(/^\s*/)[0],t=orig.match(/\s*$/)[0];out=l+r+t}}
 var p=n.parentNode;if(p&&p.nodeName==='OPTION'&&!p.hasAttribute('value'))p.setAttribute('value',norm(orig));
 if(n.nodeValue!==out)n.nodeValue=out}
function walk(root){
 if(root.nodeType===3){if(root.parentNode&&/^(SCRIPT|STYLE)$/.test(root.parentNode.nodeName))return;if(root.parentNode&&root.parentNode.closest&&root.parentNode.closest('[data-i18n],.lang'))return;tNode(root);return}
 if(root.nodeType!==1)return;
 if(/^(SCRIPT|STYLE)$/.test(root.nodeName)||root.classList.contains('lang'))return;
 var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,a=[];
 while(n=w.nextNode()){var p=n.parentNode;if(/^(SCRIPT|STYLE)$/.test(p.nodeName))continue;if(p.closest('[data-i18n],.lang'))continue;a.push(n)}
 a.forEach(tNode);
 var els=root.querySelectorAll?root.querySelectorAll('[placeholder],[aria-label]'):[];
 for(var k=0;k<els.length;k++)tAttr(els[k]);
 if(root.hasAttribute&&(root.hasAttribute('placeholder')||root.hasAttribute('aria-label')))tAttr(root)}
function tAttr(el){if(el.closest&&el.closest('.lang'))return;['placeholder','aria-label'].forEach(function(a){var cur=el.getAttribute(a);if(cur===null)return;var dk='data-o-'+a,o=el.getAttribute(dk);if(o===null){o=cur;el.setAttribute(dk,o)}var i=LANGS.indexOf(lang)-1,r=i>=0?find(norm(o),i):null;el.setAttribute(a,r!==null?r:o)})}
function tH1(){var els=document.querySelectorAll('[data-i18n]');for(var k=0;k<els.length;k++){var e=els[k],key=e.getAttribute('data-i18n');if(!hstore.has(e))hstore.set(e,e.innerHTML);var i=LANGS.indexOf(lang)-1;e.innerHTML=(i>=0&&H1[key])?H1[key][i]:hstore.get(e)}}
var TITLE=document.title;
function apply(){
 if(obs)obs.disconnect();
 document.documentElement.setAttribute('lang',lang);
 var i=LANGS.indexOf(lang)-1,r=i>=0?find(norm(TITLE),i):null;document.title=r!==null?r:TITLE;
 tH1();walk(document.body);
 var b=document.querySelectorAll('.lang button');for(var k=0;k<b.length;k++){b[k].setAttribute('aria-pressed',b[k].getAttribute('data-l')===lang?'true':'false')}
 observe()}
function observe(){
 if(!obs){obs=new MutationObserver(function(ms){
  obs.disconnect();
  ms.forEach(function(m){if(m.type==='childList'){for(var k=0;k<m.addedNodes.length;k++)walk(m.addedNodes[k])}else if(m.type==='characterData'){var n=m.target;if(n.nodeType===3&&!(n.parentNode&&n.parentNode.closest&&n.parentNode.closest('.lang,[data-i18n]'))){store.delete(n);tNode(n)}}});
  obs.takeRecords();observe()})}
 obs.observe(document.body,{childList:true,subtree:true,characterData:true})}
function set(l){if(LANGS.indexOf(l)<0)l='en';lang=l;try{localStorage.setItem('nd_lang',l)}catch(e){}apply()}
function build(){
 var css=document.createElement('style');css.textContent='nav li.lang{display:flex;align-items:center;gap:2px}nav .lang button{background:none!important;border:0!important;color:inherit!important;font:500 11px Montserrat,sans-serif!important;letter-spacing:.12em;padding:6px 6px!important;min-height:0!important;width:auto!important;height:auto!important;opacity:.5;cursor:pointer;text-transform:uppercase;border-radius:0!important}nav .lang button[aria-pressed=true]{opacity:1;border-bottom:1px solid currentColor!important}nav .lang button:hover{opacity:1}@media(max-width:820px){nav ul li.lang{padding:10px 10px;gap:6px}}@media(min-width:821px){html:not([lang=en]) .strip{font-size:clamp(12px,1.25vw,18px)!important;letter-spacing:.13em!important}html:not([lang=en]) .strip span{margin:0 14px!important}}';
 document.head.appendChild(css);
 var uls=document.querySelectorAll('nav ul');
 for(var k=0;k<uls.length;k++){var li=document.createElement('li');li.className='lang';li.setAttribute('translate','no');
  LANGS.forEach(function(c){var b=document.createElement('button');b.type='button';b.setAttribute('data-l',c);b.textContent=NAMES[c];b.setAttribute('aria-label',{en:'English',it:'Italiano',fr:'Français',es:'Español',de:'Deutsch'}[c]);li.appendChild(b)});
  li.addEventListener('click',function(e){e.stopPropagation();var b=e.target.closest('button');if(b){set(b.getAttribute('data-l'));var nav=b.closest('nav');if(nav)nav.classList.remove('open')}});
  uls[k].appendChild(li)}}
function init(){build();var q=location.search.match(/[?&]lang=(\w\w)/),s=null;try{s=localStorage.getItem('nd_lang')}catch(e){}
 var l=q?q[1]:s;if(LANGS.indexOf(l)>0){set(l)}else{lang='en';apply()}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
