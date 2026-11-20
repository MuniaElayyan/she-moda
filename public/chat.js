// شات بوت She Moda — يجيب عن المحل فقط. محلي بالكامل، ويستخدم Claude تلقائيًا إذا فُعّل على السيرفر.
(()=>{
const norm=t=>String(t||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).toLowerCase().replace(/[\u064B-\u0652ـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\u0621-\u064Aa-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const has=(t,ws)=>ws.some(w=>t.includes(norm(w)));
const CATW={jalabib:['جلباب','جلابيب'],abayat:['عباي','عبايه','عبايات'],dresses:['فستان','فساتين'],caftan:['قفطان','قفاطين','قفتان'],'formal-sets':['طقم','اطقم','تقم'],shirts:['قميص','قمصان'],blouses:['بلوز','بلايز'],pants:['بنطال','بناطيل','بنطلون'],skirts:['تنور'],'hijab-accessories':['حجاب','مكملات','معاصم','بيسك','شباح','قبه'],'prayer-sets':['صلاه'],pajamas:['بيجام','نوم'],underwear:['داخلي','كلوت','ستيان'],beauty:['عطر','كوزمتكس','لوشن','كريم','سبلاش','مكياج','عنايه'],coats:['معطف','معاطف','بالطو','جاكيت','كاب']};
const COL={اسود:['اسود','سود'],بني:['بني'],رمادي:['رمادي','رصاصي'],اخضر:['اخضر','زيتي'],كحلي:['كحلي'],موف:['موف','ليلكي'],بنفسجي:['بنفسجي'],بيج:['بيج'],وردي:['وردي'],ازرق:['ازرق'],احمر:['احمر'],ابيض:['ابيض'],عنابي:['عنابي']};
const W=()=>D.shop||{},ph=()=>W().phone||'+970 569 909 305',wa=()=>'https://wa.me/'+ph().replace(/\D/g,'');
const price=p=>p.price?p.price+'₪':(p.priceText||'السعر عند الاستفسار'),catName=id=>D.categories.find(c=>c.id===id)?.name||'';
const range=l=>{const n=l.map(p=>p.price).filter(Boolean);return n.length?(Math.min(...n)===Math.max(...n)?Math.min(...n)+'₪':'من '+Math.min(...n)+'₪ إلى '+Math.max(...n)+'₪'):''};
let ctx={},hist=[];
function filters(t){const f={};
if(has(t,['صلاه'])&&has(t,['طقم','اطقم']))f.cat='prayer-sets';else for(const[id,ws]of Object.entries(CATW))if(has(t,ws)){f.cat=id;break}
if(has(t,['شتوي','شتويه','شتاء','برد','دافي','دافيه','مخمل']))f.winter=1;
for(const[c,ws]of Object.entries(COL))if(has(t,ws)){f.color=ws;break}
const n=[...t.matchAll(/\d{2,4}/g)].map(m=>+m[0]);
if(n.length>=2&&has(t,['بين']))f.min=Math.min(n[0],n[1]),f.max=Math.max(n[0],n[1]);else if(n.length){if(has(t,['اكثر من','فوق']))f.min=n[0];else f.max=n[0]}
if(has(t,['ارخص','رخيص','اقل سعر','اوفر','توفير']))f.sort='asc';if(has(t,['اغلي','فاخر','فخم']))f.sort='desc';
if(has(t,['سهره','حفله','عرس','خطوبه','مناسبه','عيد','زفاف']))f.occ=['dresses','caftan','formal-sets'];
if(has(t,['دوام','جامعه','يومي','كل يوم','شغل']))f.occ=['jalabib','abayat','formal-sets','shirts','pants'];
return f}
function pick(f){let l=D.products.slice();
if(f.cat)l=l.filter(p=>p.category===f.cat);else if(f.occ)l=l.filter(p=>f.occ.includes(p.category));
if(f.winter)l=l.filter(p=>p.winter);
if(f.color){const m=l.filter(p=>f.color.some(c=>norm(p.name).includes(c)));if(m.length)l=m;else f.colorMiss=1}
if(f.max)l=l.filter(p=>p.price&&p.price<=f.max);if(f.min)l=l.filter(p=>p.price&&p.price>=f.min);
if(f.sort==='asc')l.sort((a,b)=>(a.price||9e9)-(b.price||9e9));else if(f.sort==='desc')l.sort((a,b)=>(b.price||0)-(a.price||0));
return l}
function bot(raw){const t=norm(raw);if(!t)return{text:'اكتبي سؤالكِ وأنا بساعدك 💗'};
const f=filters(t),hasF=f.cat||f.winter||f.color||f.max||f.min||f.occ||f.sort;
if(has(t,['شكرا','يعطيك','مشكور','تسلمي','يسلمو']))return{text:'العفو حبيبتي 💗 أنا هون لأي سؤال ثاني.'};
if(has(t,['مع السلامه','باي','بحفظ الله'])&&!hasF)return{text:'بانتظاركِ في She Moda دايمًا 💗 مع السلامة!'};
if(!/\d/.test(t)&&!has(t,['بدي','ابغي','محتاجه','رشح','اقترح','للدوام','ميزانيه','طقم','عباي','فستان','جلباب'])&&has(t,['ساعات','دوام','مفتوح','مفتوحين','مغلق','مسكر','تسكرو','تفتحو','اوقات','متي تفتح','متي بتفتح','الجمعه','السبت','الاحد','الاثنين','الاتنين','الثلاثاء','التلاتاء','الاربعاء','الخميس','العطله','بكره','بكرا'])){
 const sc=W().sched,DM={'الاحد':0,'الاثنين':1,'الاتنين':1,'الثلاثاء':2,'التلاتاء':2,'الاربعاء':3,'الخميس':4,'الجمعه':5,'السبت':6},wl=[['💬 واتساب',wa()]];
 if(!sc)return{text:W().hours?'⏰ '+W().hours:'ما عندي ساعات الدوام مسجّلة حاليًا 🙏 تواصلي معنا على واتساب '+ph(),links:wl};
 const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Hebron'})),td=now.getDay(),mn=now.getHours()*60+now.getMinutes(),tm=s=>{const[h,m]=s.split(':').map(Number);return h*60+m},info=i=>sc.closed.includes(i)?'مغلق':'مفتوح من '+fmtT(sc.from)+' إلى '+fmtT(sc.to);
 const dn=Object.keys(DM).find(k=>t.includes(k));
 if(dn)return{text:'📅 يوم '+DN[DM[dn]]+': '+info(DM[dn])+(sc.closed.length&&!sc.closed.includes(DM[dn])?'\n(عطلتنا: '+sc.closed.map(i=>DN[i]).join('، ')+')':''),links:wl};
 if(has(t,['بكره','بكرا'])){const i=(td+1)%7;return{text:'📅 بكرة ('+DN[i]+'): '+info(i),links:wl}}
 if(has(t,['الان','هلا','حاليا','اليوم','مفتوح','مفتوحين','مغلق','مسكر'])){const op=!sc.closed.includes(td)&&mn>=tm(sc.from)&&mn<tm(sc.to);let nx='';if(!op){for(let k=0;k<8;k++){const i=(td+k)%7;if(sc.closed.includes(i))continue;if(k===0&&mn>=tm(sc.to))continue;nx=(k===0?'اليوم':k===1?'بكرة ('+DN[i]+')':'يوم '+DN[i])+' الساعة '+fmtT(sc.from);break}}
  return{text:op?'✅ مفتوحين الآن، وبنسكر الساعة '+fmtT(sc.to)+'.':'🔒 المحل مغلق حاليًا.\nبنفتح '+nx+'.',links:wl}}
 return{text:'⏰ '+(W().hours||hoursText(sc)),links:wl}}
if(has(t,['وين','موقع','عنوان','مكان','اين','خريطه','طريق','كيف اوصل','فين']))return{text:'📍 '+(W().address||'طولكرم - عتيل - الشارع الرئيسي - بجانب البنك الإسلامي العربي'),links:[['🗺️ افتحي الخريطة','https://maps.app.goo.gl/PvVxTwg3WAmebi9SA']]};
if(has(t,['رقم','واتس','واتساب','تواصل','هاتف','اتصال','انستا','انستغرام','فيس','فيسبوك']))return{text:'📞 '+ph()+'\nنسعد بتواصلكِ في أي وقت.',links:[['💬 واتساب',wa()],['Instagram','https://www.instagram.com/she.moda.group'],['Facebook','https://www.facebook.com/She.Moda.Group']]};
if(has(t,['كيف اطلب','كيف اشتري','طريقه الطلب','كيف احجز','اطلب']))return{text:'🛍️ سهل جدًا:\n1) اضغطي «أضيفي للعربة» على القطعة\n2) افتحي أيقونة العربة وراجعي الكمية والسعر\n3) اضغطي «تأكيد الطلب» وعبّي الاسم والمدينة والرقم ووصف المكان\n💵 الدفع عند الاستلام.'};
if(has(t,['دفع','كاش','توصيل','شحن','استلام','تحويل','توصلو','بتوصلو'])&&!f.cat)return{text:'💵 الدفع عند الاستلام.'+(W().notes&&!/^الدفع عند الاستلام\.?$/.test(W().notes)?'\n'+W().notes:'')+'\nلتفاصيل التوصيل لمنطقتكِ تواصلي معنا على واتساب '+ph(),links:[['💬 واتساب',wa()]]};
if(has(t,['مقاس','سايز','قياس'])){const p=pick(f)[0];return{text:'المقاسات تختلف حسب القطعة، وبتلاقيها في بطاقة المنتج إذا كانت محددة. لمقاس معيّن اسألي على واتساب '+ph()+' ونتأكد لكِ من التوفر.',links:[['💬 واتساب',wa()]]}}
if(has(t,['اقسام','اسعار','سعر','بكم','ايش عندكم','شو عندكم','ماذا عندكم','انواع','تشكيله','المنتجات','شو بتبيعو','شو في'])&&!f.cat){const u=D.categories.map(c=>({c,l:D.products.filter(p=>p.category===c.id)})).filter(x=>x.l.length);return{text:'أقسامنا ✨\n'+u.map(x=>'• '+x.c.name+' ('+x.l.length+(x.l.length>2&&x.l.length<11?' قطع':' قطعة')+(range(x.l)?' — '+range(x.l):'')+')').join('\n')+(D.products.some(p=>p.winter)?'\n❄️ وعندنا بضاعة شتوية جديدة!':'')+'\nاسأليني عن أي قسم وبرشّحلك.'}}
const rec=has(t,['رشح','اقترح','بدي','ابغي','محتاجه','دوري','ابحث','اريد','عندكم','فيه','في عندكم','وريني','شوفي']);
if(hasF||rec){
 let g={...f};const keep=!f.cat&&!f.occ&&ctx.cat&&(f.max||f.min||f.color||f.winter||f.sort);if(keep){g.cat=ctx.cat}
 if(!hasF&&!keep)return{text:'أكيد ✨ احكيلي شوي أكثر عشان أرشّحلك الأنسب:\n• نوع القطعة؟ (عباية، فستان، طقم، جلباب…)\n• الميزانية تقريبًا؟\n• للمناسبة أو للدوام اليومي؟ شتوي أو عادي؟',chips:['عباية شتوية','فستان لمناسبة','طقم أقل من 150','أرخص قطعة']};
 if(g.cat)ctx.cat=g.cat;else if(g.occ)ctx.cat=null;
 const l=pick(g);
 if(!l.length)return{text:'ما لقيت قطعة بهالمواصفات بالضبط 😔 جرّبي ترفعي الميزانية شوي أو تغيّري النوع، أو راسلينا على واتساب '+ph()+' ونشوف لكِ.',links:[['💬 واتساب',wa()]]};
 const head=g.cat?catName(g.cat):(g.winter?'البضاعة الشتوية':'قطع مناسبة'),pr=range(l);
 return{text:(has(t,['سعر','اسعار','بكم','كم'])?'💰 ':'✨ ')+head+(g.winter&&g.cat?' الشتوية':'')+': لقيت '+l.length+' قطعة'+(pr?' ('+pr+')':'')+(g.colorMiss?'\n(اللون يختلف حسب المتوفر — اسألي على واتساب للتأكد)':'')+(l.length>4?'\nهاي أبرز 4 منها 👇':'👇'),ids:l.slice(0,4).map(p=>p.id)}}
if(has(t,['مرحبا','اهلا','هلا','السلام','صباح','مساء','هاي','هلو']))return{text:'أهلًا وسهلًا بكِ 💗 شو بتحبي تعرفي عن She Moda؟',chips:chips()};
return{text:'أنا مساعدة She Moda 💗 وبجاوب فقط عن المحل: الأقسام والقطع والأسعار والدوام والموقع وطريقة الطلب. جرّبي تسأليني عن شي منهم!',chips:chips()}}
const chips=()=>['ساعات الدوام ⏰','وين موقعكم؟ 📍','البضاعة الشتوية ❄️','رشّحي لي قطعة ✨','الأسعار 💰','كيف أطلب؟ 🛍️'];
// ----- الواجهة
const logo=document.querySelector('.logo img').src;
document.body.insertAdjacentHTML('beforeend',`<button id="chBtn" aria-label="اسألي She Moda"><img src="${logo}" alt=""><i></i></button><div id="chTip">هل أساعدك؟ 💬</div><section id="chat" aria-label="مساعدة She Moda"><header><img src="${logo}" alt=""><div><b>She Moda</b><small>● مساعدتكِ للأزياء</small></div><button id="chX" aria-label="إغلاق">✕</button></header><div id="chMsg" role="log" aria-live="polite"></div><div id="chChips"></div><form id="chF"><input id="chI" placeholder="اكتبي سؤالكِ هنا…" autocomplete="off" maxlength="300"><button aria-label="إرسال">➤</button></form></section>`);
const M=$('#chMsg');let opened=false,busy=false;
function card(id){const p=D.products.find(x=>x.id===id);return p?`<div class="pc"><img src="${src(p.image)}" alt="" data-v="${p.id}"><b>${esc(p.name)}</b><span>${price(p)}</span>${p.price?`<button data-ad="${p.id}">أضيفي للعربة</button>`:''}</div>`:''}
function add(who,r){const d=document.createElement('div');d.className='m '+who;let h=esc(r.text||'').replace(/\n/g,'<br>');
if(r.ids?.length)h+='<div class="pcs">'+r.ids.map(card).join('')+'</div>';if(r.links)h+='<div class="lk">'+r.links.map(([n,u])=>`<a target="_blank" rel="noopener" href="${esc(u)}">${esc(n)}</a>`).join('')+'</div>';
d.innerHTML=h;M.append(d);M.scrollTop=M.scrollHeight;if(r.chips)setChips(r.chips)}
function setChips(c){$('#chChips').innerHTML=(c||[]).map(x=>`<button>${esc(x)}</button>`).join('')}
function typing(){const d=document.createElement('div');d.className='m bot ty';d.innerHTML='<span></span><span></span><span></span>';M.append(d);M.scrollTop=M.scrollHeight;return d}
async function ask(q){if(busy||!q.trim())return;busy=true;add('me',{text:q});hist.push({role:'user',content:q});setChips([]);const ty=typing();let r;
 if(D.chat){try{const j=await api('chat','POST',{messages:hist});const ids=[...j.text.matchAll(/\[\[(\w+)\]\]/g)].map(m=>m[1]);r={text:j.text.replace(/\[\[\w+\]\]/g,'').trim(),ids:ids.slice(0,4),chips:[]}}catch(e){r=null}}
 if(!r)r=bot(q);await new Promise(s=>setTimeout(s,D.chat?0:450+Math.random()*350));ty.remove();add('bot',r);hist.push({role:'assistant',content:r.text});if(!r.chips&&!D.chat)setChips(['ساعات الدوام ⏰','الأسعار 💰','البضاعة الشتوية ❄️']);busy=false}
function open(o){$('#chat').classList.toggle('on',o);$('#chBtn').classList.toggle('hide',o);$('#chTip').classList.remove('on');if(o&&!opened){opened=true;const ty=typing();setTimeout(()=>{ty.remove();add('bot',{text:'أهلًا وسهلًا بكِ في She Moda 💗\nأنا مساعدتكِ، بقدر أجاوبك عن الأقسام والقطع والأسعار والدوام والموقع، وأرشّحلك قطعة تناسب ذوقكِ وميزانيتكِ ✨\nشو بتحبي تسألي؟',chips:chips()})},700)}if(o)setTimeout(()=>$('#chI').focus({preventScroll:true}),300)}
$('#chBtn').onclick=()=>open(true);$('#chX').onclick=()=>open(false);
$('#chF').onsubmit=e=>{e.preventDefault();const v=$('#chI').value;$('#chI').value='';ask(v)};
$('#chChips').onclick=e=>{const b=e.target.closest('button');if(b)ask(b.textContent.replace(/[⏰📍❄️✨💰🛍️]/g,'').trim())};
M.onclick=e=>{const a=e.target.closest('[data-ad]'),v=e.target.closest('[data-v]');if(a){const c=cart.find(x=>x.id===a.dataset.ad);c?c.qty++:cart.push({id:a.dataset.ad,qty:1});save();toast('أُضيفت للعربة ✓')}if(v){const p=D.products.find(x=>x.id===v.dataset.v);modal(`<img src="${src(p.image)}" style="border-radius:14px;margin:auto;max-height:70vh"><h3 style="margin-top:12px">${esc(p.name)} — ${price(p)}</h3>`)}};
setTimeout(()=>{if(!opened)$('#chTip').classList.add('on')},6000);setTimeout(()=>$('#chTip').classList.remove('on'),14000);
})();
