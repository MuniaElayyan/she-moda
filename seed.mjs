// يحوّل بيانات الموقع القديم إلى data/db.json (يعمل مرة واحدة تلقائيًا)
import vm from 'node:vm';import fs from 'node:fs';
export default function seed(src){
  const w={};const ctx={window:w,SheModa:undefined};w.window=w;vm.createContext(w);
  for(const f of ['categories','products'])vm.runInContext(fs.readFileSync(`${src}/${f}.js`,'utf8'),w);
  const S=w.SheModa,now=Date.now();
  const cats=[{id:'coats',name:'معاطف'},...S.categories.map(c=>({id:c.slug,name:c.name}))];
  const products=S.products.map((p,i)=>({id:'p'+i,name:p.name,category:p.category,image:p.image,price:p.price??null,priceText:p.priceText||'',sizes:p.sizes||'',desc:'',published:true,created:now-100000-i*1000}));
  const W=(n,c,f,pr,sz='')=>({name:n,category:c,image:'winter/'+f,price:pr,priceText:'',sizes:sz,desc:'',published:true,winter:true});
  const wp=[W('معطف جلد بفرو','coats','f0.jpg',320),W('طقم مخملي مع بالطو مطرز','formal-sets','f2.jpg',320),W('عباية شتوية بخط أبيض','abayat','f9.jpg',160),W('عباية بنية بخط أبيض','abayat','p3.jpg',160),W('عباية رمادية بأزرار','abayat','f8.jpg',160),W('عباية سوداء بأزرار','abayat','f5.jpg',160),W('جلباب أسود بأزرار لؤلؤ','jalabib','f6.jpg',160),W('فستان مخمل بياقة دانتيل','dresses','f7.jpg',160),W('فستان شتوي بني','dresses','f3.jpg',160),W('فستان بنفسجي بإكسسوار ذهبي','dresses','f11.jpg',160),W('فستان شتوي بنفسجي بأزرار','dresses','p2.jpg',160),W('طقم شتوي أخضر','formal-sets','p0.jpg',140),W('طقم شتوي كحلي','formal-sets','p1.jpg',140),W('طقم شتوي بني','formal-sets','p4.jpg',140),W('طقم شتوي موف','formal-sets','p5.jpg',140),W('طقم جاكيت وتنورة رمادي','formal-sets','p7.jpg',160)].map((p,i)=>({...p,id:'w'+i,created:now-i*1000}));
  products.push(...wp);
  const reels=[...[0,2,9,8,5,6,7,3,11].map(n=>({id:'rw'+n,type:'video',src:'winter/v'+n+'.mp4',poster:'winter/f'+n+'.jpg',title:'بضاعة الشتاء'})),{id:'r0',type:'video',src:'video/store-outside.mp4',poster:'images/مكان.png',title:'المتجر من الخارج'}];
  return{categories:cats,products,reels,users:[],orders:[]};
}
