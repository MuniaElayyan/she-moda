// يولّد public/data-static.json (نسخة ثابتة للعرض عند الرفع على GitHub Pages)
import seed from './seed.mjs';import fs from 'node:fs';
const db=seed('olddata');const cats=db.categories;
fs.writeFileSync('public/data-static.json',JSON.stringify({categories:cats,products:db.products.sort((a,b)=>b.created-a.created),reels:db.reels,shop:{phone:'+970 569 909 305',address:'طولكرم - عتيل - الشارع الرئيسي - بجانب البنك الإسلامي العربي',hours:'الدوام من السبت إلى الجمعة ما عدا الأربعاء، من 2:30 مساءً حتى 9:00 مساءً',sched:{closed:[3],from:'14:30',to:'21:00'},notes:'الدفع عند الاستلام.'},chat:false}));
