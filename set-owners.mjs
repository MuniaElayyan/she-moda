// الاستخدام:  node set-owners.mjs email1 [email2] [email3]
// يضيف المالكين الجدد (حتى 3 في المجموع) دون تغيير كلمات مرور الموجودين.
import fs from 'node:fs';import crypto from 'node:crypto';
const have=fs.existsSync('owners.json')?JSON.parse(fs.readFileSync('owners.json','utf8')):[];
const emails=process.argv.slice(2).map(e=>e.trim().toLowerCase());
if(!emails.length||emails.some(e=>!/^\S+@\S+\.\S+$/.test(e))){console.log('أعطيني إيميلًا صحيحًا واحدًا على الأقل');process.exit(1)}
const ch='abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789',gen=()=>Array.from(crypto.randomBytes(14),b=>ch[b%ch.length]).join('');
for(const u of emails){if(have.some(o=>o.u===u)){console.log(u,'  موجود مسبقًا (لم تتغير كلمة مروره)');continue}
 if(have.length>=3){console.log('الحد الأقصى 3 حسابات — تم تجاهل',u);continue}
 const p=gen(),s=crypto.randomBytes(8).toString('hex');have.push({u,s,h:crypto.scryptSync(p,s,32).toString('hex')});console.log(u,'  ←  ',p)}
fs.writeFileSync('owners.json',JSON.stringify(have,null,1));console.log('\nالحسابات المسموحة الآن:',have.map(o=>o.u).join(' , '));
