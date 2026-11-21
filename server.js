import express from 'express';import multer from 'multer';import nodemailer from 'nodemailer';
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import seed from './seed.mjs';
const D=process.env.DATA_DIR||'data',DB=D+'/db.json',UP=D+'/uploads',OUT=D+'/outbox';
for(const d of[D,UP,OUT])fs.mkdirSync(d,{recursive:true});
const TO=(process.env.ORDER_EMAIL||'shemodagroup@gmail.com').split(',').map(x=>x.trim()).filter(Boolean).slice(0,2),SECRET=process.env.SECRET||'she-moda-'+(fs.existsSync(D+'/.s')?fs.readFileSync(D+'/.s','utf8'):(()=>{const s=crypto.randomBytes(16).toString('hex');fs.writeFileSync(D+'/.s',s);return s})());
const hash=(p,s)=>crypto.scryptSync(p,s,32).toString('hex');
let db=fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB,'utf8')):seed('olddata');
const OW=process.env.OWNERS_JSON?JSON.parse(process.env.OWNERS_JSON):fs.existsSync('owners.json')?JSON.parse(fs.readFileSync('owners.json','utf8')):[];
db.users=db.users.filter(u=>OW.some(o=>o.u===u.u));for(const o of OW)if(!db.users.some(u=>u.u===o.u))db.users.push(o);
if(!db.users.length)console.log('\n  ⚠️ لا يوجد مالكون. شغّلي:  node set-owners.mjs email1 email2 email3\n');
db.shop=db.shop||{phone:'+970 569 909 305',address:'طولكرم - عتيل - الشارع الرئيسي - بجانب البنك الإسلامي العربي',hours:'الدوام من السبت إلى الجمعة ما عدا الأربعاء، من 2:30 مساءً حتى 9:00 مساءً',sched:{closed:[3],from:'14:30',to:'21:00'},notes:'الدفع عند الاستلام.'};
const save=()=>fs.writeFileSync(DB,JSON.stringify(db,null,1));save();
const sign=u=>{const b=Buffer.from(JSON.stringify({u,e:Date.now()+864e5*7})).toString('base64url');return b+'.'+crypto.createHmac('sha256',SECRET).update(b).digest('base64url')};
const who=r=>{const[b,s]=(/tok=([^;]+)/.exec(r.headers.cookie||'')||[])[1]?.split('.')||[];if(!b||s!==crypto.createHmac('sha256',SECRET).update(b).digest('base64url'))return;const o=JSON.parse(Buffer.from(b,'base64url'));return o.e>Date.now()?o.u:undefined};
const auth=(q,s,n)=>who(q)?n():s.status(401).json({error:'سجّلي الدخول أولًا'});
const app=express();app.set('trust proxy',1);
const hits=new Map();const limit=(key,max,ms)=>(q,s,n)=>{const k=key+q.ip,now=Date.now(),a=(hits.get(k)||[]).filter(t=>now-t<ms);if(a.length>=max)return s.status(429).json({error:'محاولات كثيرة، حاولي بعد قليل'});a.push(now);hits.set(k,a);n()};app.use(express.json({limit:'1mb'}));
app.use('/uploads',express.static(UP));app.use(express.static('public'));
const up=multer({storage:multer.diskStorage({destination:UP,filename:(q,f,c)=>c(null,Date.now()+'-'+crypto.randomBytes(3).toString('hex')+path.extname(f.originalname||'.jpg').toLowerCase())}),fileFilter:(q,f,c)=>/^(image|video)\//.test(f.mimetype)?c(null,true):c(new Error('الصور والفيديو فقط')),limits:{fileSize:200e6}});
const id=()=>Date.now().toString(36)+crypto.randomBytes(2).toString('hex');
const pub=()=>({categories:db.categories,products:db.products.filter(p=>p.published).sort((a,b)=>b.created-a.created),reels:db.reels,shop:db.shop,chat:!!process.env.ANTHROPIC_API_KEY});
app.get('/api/data',(q,s)=>s.json(pub()));
app.post('/api/login',limit('l',8,15*60e3),(q,s)=>{const u=db.users.find(x=>x.u===String(q.body.u||'').trim().toLowerCase());if(u&&hash(String(q.body.p||''),u.s)===u.h){s.setHeader('Set-Cookie',`tok=${sign(u.u)}; HttpOnly; Path=/; SameSite=Lax;${q.secure?' Secure;':''} Max-Age=604800`);return s.json({ok:1,u:u.u})}s.status(401).json({error:'اسم المستخدم أو كلمة المرور غير صحيحة'})});
app.post('/api/logout',(q,s)=>{s.setHeader('Set-Cookie','tok=; Path=/; Max-Age=0');s.json({ok:1})});
app.get('/api/me',(q,s)=>s.json({u:who(q)||null}));
app.get('/api/admin',auth,(q,s)=>s.json({...db,users:db.users.map(u=>u.u)}));
app.post('/api/upload',auth,(q,s)=>up.single('file')(q,s,e=>e||!q.file?s.status(400).json({error:e?.message||'لا يوجد ملف'}):s.json({path:'uploads/'+q.file.filename})));
// CRUD عام للمنتجات والأقسام والعروض
for(const[k,pre]of[['products','p'],['categories','c'],['reels','r']]){
  app.post('/api/'+k,auth,(q,s)=>{const o={...q.body,id:(k==='categories'?'c':pre)+id()};if(k==='products'){o.created=Date.now();o.published=o.published!==false;o.price=o.price===''||o.price==null?null:+o.price}db[k].push(o);save();s.json(o)});
  app.put('/api/'+k+'/:id',auth,(q,s)=>{const i=db[k].findIndex(x=>x.id===q.params.id);if(i<0)return s.sendStatus(404);const b={...q.body,id:q.params.id};if(k==='products'){b.price=b.price===''||b.price==null?null:+b.price;b.created=db[k][i].created}db[k][i]=b;save();s.json(b)});
  app.delete('/api/'+k+'/:id',auth,(q,s)=>{db[k]=db[k].filter(x=>x.id!==q.params.id);save();s.json({ok:1})});
}
app.put('/api/shop',auth,(q,s)=>{const b=q.body;db.shop={sched:{closed:(b.sched?.closed||[]).map(Number).filter(n=>n>=0&&n<7),from:/^\d\d:\d\d$/.test(b.sched?.from)?b.sched.from:'14:30',to:/^\d\d:\d\d$/.test(b.sched?.to)?b.sched.to:'21:00'},phone:String(b.phone||'').slice(0,40),address:String(b.address||'').slice(0,300),hours:String(b.hours||'').slice(0,800),notes:String(b.notes||'').slice(0,800)};save();s.json(db.shop)});
app.post('/api/chat',limit('c',25,10*60e3),async(q,s)=>{const K=process.env.ANTHROPIC_API_KEY;if(!K)return s.status(404).json({error:'off'});
  const m=(Array.isArray(q.body.messages)?q.body.messages:[]).slice(-10).map(x=>({role:x.role==='assistant'?'assistant':'user',content:String(x.content||'').slice(0,600)}));if(!m.length||m[m.length-1].role!=='user')return s.status(400).json({error:'bad'});
  const cats=Object.fromEntries(db.categories.map(c=>[c.id,c.name])),P=db.products.filter(p=>p.published).map(p=>`${p.id}|${p.name}|${cats[p.category]||''}|${p.price?p.price+'₪':p.priceText||'السعر عند الاستفسار'}${p.winter?'|شتوي':''}${p.sizes?'|مقاسات: '+p.sizes:''}${p.desc?'|'+p.desc:''}`).join('\n');
  const sys=`أنتِ مساعدة متجر She Moda للأزياء النسائية في عتيل - طولكرم. تجاوبين بالعربية بلهجة ودودة ومختصرة، وفقط عن المحل ومنتجاته وأسعاره وموقعه ودوامه وطريقة الطلب. إذا سُئلتِ عن أي شيء خارج المحل اعتذري بلطف وأعيدي الحديث للمحل. لا تخترعي معلومات: استخدمي فقط البيانات هنا، وإذا المعلومة غير موجودة قولي إنها غير متوفرة واقترحي واتساب.\nالعنوان: ${db.shop.address}\nالهاتف/واتساب: ${db.shop.phone}\nالدوام: ${db.shop.hours||'غير محدد بعد'}\nملاحظات: ${db.shop.notes}\nالطلب من الموقع: إضافة للعربة ثم تأكيد الطلب، الدفع عند الاستلام.\nالمنتجات (id|الاسم|القسم|السعر):\n${P}\nعند ترشيح قطع اذكري الـid بين [[ ]] مثل [[p12]] (حتى 4 قطع) بعد وصف قصير.`;
  try{const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':K,'anthropic-version':'2023-06-01','content-type':'application/json'},body:JSON.stringify({model:process.env.CHAT_MODEL||'claude-haiku-5-5',max_tokens:500,system:sys,messages:m})});const j=await r.json();if(!r.ok)throw Error(JSON.stringify(j).slice(0,200));s.json({text:(j.content||[]).map(x=>x.text||'').join('')})}catch(e){console.error('chat',e.message);s.status(502).json({error:'chat failed'})}});
app.post('/api/password',auth,(q,s)=>{const u=db.users.find(x=>x.u===who(q));if(String(q.body.p||'').length<6)return s.status(400).json({error:'كلمة المرور 6 أحرف على الأقل'});u.s=crypto.randomBytes(8).toString('hex');u.h=hash(q.body.p,u.s);save();s.json({ok:1})});
const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function mail(o,lines,base=''){
  const http=!!(process.env.BREVO_API_KEY||process.env.RESEND_API_KEY),at=[];
  const imgUrl=p=>base+'/'+encodeURI(p).replace(/#/g,'%23');
  const rows=lines.map((l,i)=>{let img='';
    if(http){if(base)img=`<img src="${imgUrl(l.image)}" width="70" height="90" style="border-radius:10px;object-fit:cover">`}
    else{const f=l.image.startsWith('uploads/')?path.join(UP,l.image.slice(8)):path.join('public',l.image);
      if(fs.existsSync(f)){at.push({filename:path.basename(f),path:f,cid:'i'+i});img=`<img src="cid:i${i}" width="70" height="90" style="border-radius:10px;object-fit:cover">`}}
    return`<tr><td style="padding:10px;border-bottom:1px solid #f5d6e4">${img}</td><td style="padding:10px;border-bottom:1px solid #f5d6e4"><b style="color:#000000">${esc(l.name)}</b></td><td style="padding:10px;text-align:center;border-bottom:1px solid #f5d6e4;color:#000000">${l.qty}</td><td style="padding:10px;text-align:center;border-bottom:1px solid #f5d6e4;color:#000000">${l.price}₪</td><td style="padding:10px;text-align:center;border-bottom:1px solid #f5d6e4;color:#bb5182"><b>${l.price*l.qty}₪</b></td></tr>`}).join('');
  const html=`<div dir="rtl" bgcolor="#fff6f9" style="font-family:Tahoma,Arial,sans-serif;background:#fff6f9;color:#000000;padding:24px"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><div style="max-width:640px;margin:auto;background-color:#ffffff;color:#000000;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px #d46d9d33">
<div bgcolor="#7a2f55" style="background-color:#7a2f55;background-image:linear-gradient(135deg,#2a1420,#993f69);color:#ffffff;padding:28px;text-align:center"><div style="font-size:26px;letter-spacing:2px;color:#e8c98f">SHE MODA</div><div style="margin-top:6px">طلب جديد رقم #${o.no}</div></div>
<div style="padding:22px"><table width="100%" bgcolor="#fff6f9" style="background-color:#fff6f9;color:#000000;border-radius:12px;padding:12px;font-size:16px;line-height:1.9"><tr><td>👤 <b>الاسم:</b> ${esc(o.name)}</td></tr><tr><td>📞 <b>الهاتف:</b> ${esc(o.phone)}</td></tr><tr><td>🏙️ <b>المدينة:</b> ${esc(o.city)}</td></tr><tr><td>📍 <b>وصف المكان:</b> ${esc(o.address)}</td></tr>${o.note?`<tr><td>📝 <b>ملاحظة:</b> ${esc(o.note)}</td></tr>`:''}<tr><td>💵 <b>طريقة الدفع:</b> عند الاستلام</td></tr><tr><td>⭐ <b>تقييم الزبونة:</b> <span style="color:#e0a800;font-size:18px">${'★'.repeat(o.rating||0)}${'☆'.repeat(5-(o.rating||0))}</span> (${o.rating||0}/5)</td></tr></table>
<table width="100%" style="margin-top:18px;border-collapse:collapse;font-size:14px;color:#000000"><tr bgcolor="#bb5182" style="background-color:#bb5182;color:#ffffff"><th style="padding:10px"></th><th style="padding:10px;text-align:right">القطعة</th><th>الكمية</th><th>السعر</th><th>المجموع</th></tr>${rows}</table>
<div bgcolor="#993f69" style="margin-top:18px;background-color:#993f69;background-image:linear-gradient(135deg,#d46d9d,#993f69);color:#ffffff;border-radius:12px;padding:16px;text-align:center;font-size:20px">المبلغ النهائي: <b>${o.total}₪</b></div>
<p style="color:#333333;font-size:13px;text-align:center;margin-top:16px">شكرًا لاختياركِ She Moda 💖 — عتيل، طولكرم</p></div></div></div>`;
  fs.writeFileSync(`${OUT}/order-${o.no}.html`,html.replace(/cid:i(\d)/g,(m,n)=>'../'+(at[n]?.path||'')));
  const subject=`طلب جديد #${o.no} — ${o.name} — ${o.total}₪`;
  if(!TO.length){console.log('لا يوجد إيميل مستلم — حُفظ الإيميل في',OUT);return 'file'}
  if(process.env.BREVO_API_KEY){
    const r=await fetch(process.env.BREVO_URL||'https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':process.env.BREVO_API_KEY,'content-type':'application/json',accept:'application/json'},body:JSON.stringify({sender:{name:'She Moda',email:process.env.MAIL_FROM||TO[0]},to:TO.map(email=>({email})),subject,htmlContent:html})});
    if(!r.ok)throw Error('Brevo '+r.status+' '+(await r.text()).slice(0,300));return 'brevo'}
  if(process.env.RESEND_API_KEY){
    const r=await fetch(process.env.RESEND_URL||'https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'content-type':'application/json'},body:JSON.stringify({from:process.env.MAIL_FROM||'She Moda <onboarding@resend.dev>',to:TO,subject,html})});
    if(!r.ok)throw Error('Resend '+r.status+' '+(await r.text()).slice(0,300));return 'resend'}
  if(!process.env.SMTP_HOST){console.log('لم يُضبط مزوّد إيميل — حُفظ الإيميل في',OUT);return 'file'}
  const t=nodemailer.createTransport({host:process.env.SMTP_HOST,port:+(process.env.SMTP_PORT||465),secure:(process.env.SMTP_PORT||465)==465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
  await t.sendMail({from:`"She Moda" <${process.env.SMTP_USER}>`,to:TO.join(','),subject,html,attachments:at});return 'smtp'}
const baseOf=q=>process.env.SITE_URL||`${q.headers['x-forwarded-proto']||q.protocol}://${q.get('host')}`;
app.get('/api/mailtest',auth,async(q,s)=>{try{const p=db.products.find(x=>x.price)||db.products[0];const o={no:'TEST',name:'تجربة إيميل',phone:'0000000000',city:'عتيل',address:'هذه رسالة تجريبية من لوحة التحكم',note:'',rating:5,total:p.price||0};const via=await mail(o,[{name:p.name,image:p.image,price:p.price||0,qty:1}],baseOf(q));s.json({ok:true,via,to:TO})}catch(e){console.error('Mail test error',e.message);s.status(500).json({error:e.message})}});
app.post('/api/order',limit('o',6,10*60e3),async(q,s)=>{const b=q.body;
  const rt=Math.round(+b.rating);if(!(rt>=1&&rt<=5))return s.status(400).json({error:'التقييم بالنجوم إجباري'});
  if(!b.name||!b.phone||!b.city||!b.address||!Array.isArray(b.items)||!b.items.length)return s.status(400).json({error:'عبّي كل الحقول المطلوبة'});
  const lines=b.items.map(i=>{const p=db.products.find(x=>x.id===i.id);return p&&p.price?{id:p.id,name:p.name,image:p.image,price:p.price,qty:Math.max(1,Math.min(50,+i.qty||1))}:null}).filter(Boolean);
  if(!lines.length)return s.status(400).json({error:'السلة فارغة'});
  const o={no:db.orders.length+1001,date:new Date().toISOString(),name:b.name,phone:b.phone,city:b.city,address:b.address,note:b.note||'',rating:rt,items:lines,total:lines.reduce((a,l)=>a+l.price*l.qty,0),mailed:false};
  db.orders.push(o);save();
  try{const via=await mail(o,lines,baseOf(q));o.mailed=via!=='file';save()}catch(e){console.error('Mail error',e.message)}
  s.json({ok:1,no:o.no,total:o.total})});
app.listen(process.env.PORT||3000,()=>console.log('She Moda → http://localhost:'+(process.env.PORT||3000)));
