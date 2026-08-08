/* =============================================================================
   products.js — بيانات جميع منتجات المتجر

   ⚠ هذا هو الملف الوحيد الذي تعدّله لإضافة منتج أو تغيير سعر أو حذف منتج.
     كروت المنتجات تُبنى تلقائيًا من هنا، فلا حاجة لتكرار أي HTML.

   حقول المنتج:
     name      : اسم المنتج
     category  : معرّف التصنيف (slug) من ملف categories.js
     image     : اسم ملف الصورة تمامًا كما هو في مجلد المشروع — ممنوع تغييره
     price     : السعر بالشيكل (رقم) — أو null إذا كان السعر عند الاستفسار
     priceText : نص سعر خاص يحل محل price (مثل عروض «الواحد بـ ... والاثنان بـ ...»)
     sizes     : نص المقاسات المتوفرة — أو null
     colors    : عدد الألوان المتوفرة — يظهر كشارة نصية بدل دوائر الألوان القديمة

   ملاحظة: صور الأقسام التي تتوفر فيها عدة صور تُعرض كاملة كمنتجات مستقلة،
   بحيث ترى الزبونة القطعة بكل نسخها بصريًا بدل دوائر ألوان صغيرة.

   ---------------------------------------------------------------------------
   ⚠️ أسعار تجريبية تحتاج مراجعة — ابحث عن علامة ⚠️ داخل هذا الملف:
        • بلوزة هاينيك   (قسم بلايز)
        • بيجامة قطنية   (قسم بيجامات)
   هذان السعران وضعتهما مؤقتًا لإكمال شكل التصميم، وليسا الأسعار الحقيقية.
   ---------------------------------------------------------------------------
   ============================================================================= */

window.SheModa = window.SheModa || {};

SheModa.products = [
  /* ------------------------------- جلابيب ------------------------------- */
  {
    name: 'جلباب أنيق',
    category: 'jalabib',
    image: 'جلباب1.png',
    price: 150,
    sizes: 'من 1 إلى 5',
    colors: 3,
  },

  /* ------------------------------- عبايات ------------------------------- */
  { name: 'عباية كلاسيك', category: 'abayat', image: 'عباية1.png', price: 150 },
  { name: 'عباية فاخرة', category: 'abayat', image: 'عباية.png', price: 150 },
  { name: 'عباية ناعمة', category: 'abayat', image: 'عباية3.png', price: 150 },
  { name: 'عباية عملية', category: 'abayat', image: 'عباية4.png', price: 150 },
  { name: 'عباية مميزة', category: 'abayat', image: 'عباية5.png', price: 150 },
  { name: 'عباية ملكية', category: 'abayat', image: 'عباية6.png', price: 150 },
  { name: 'عباية راقية', category: 'abayat', image: 'عباية2.png', price: 150 },
  { name: 'عباية راقية', category: 'abayat', image: 'عباية7.png', price: 150, colors: 7 },

  /* ------------------------------- فساتين ------------------------------- */
  {
    name: 'فستان أنيق',
    category: 'dresses',
    image: 'فستان.png',
    price: 250,
    sizes: 'من 1 إلى 5',
  },
  { name: 'فستان أنيق', category: 'dresses', image: '4.jpg', price: 120 },
  { name: 'فستان شاليه', category: 'dresses', image: 'شاليه 1.png', price: 80 },
  { name: 'فستان شاليه', category: 'dresses', image: 'شاليه2.png', price: 80 },

  /* ------------------------------- قفاطين ------------------------------- */
  {
    name: 'قفطان مغربي فاخر',
    category: 'caftan',
    image: 'قفطان.png',
    price: 350,
    sizes: 'من 42 إلى 48',
    colors: 2,
  },

  /* ----------------------------- أطقم رسمية ----------------------------- */
  {
    name: 'طقم رسمي كلاسيك',
    category: 'formal-sets',
    image: 'طقم1.png',
    price: 150,
    sizes: 'من 38 إلى 42',
  },
  {
    name: 'طقم رسمي كلاسيك',
    category: 'formal-sets',
    image: 'طقم2.png',
    price: 150,
    sizes: 'من 38 إلى 42',
  },
  {
    name: 'طقم رسمي كلاسيك',
    category: 'formal-sets',
    image: 'طقم3.png',
    price: 150,
    sizes: 'من 38 إلى 42',
    colors: 3,
  },
  {
    name: 'طقم رسمي راقي',
    category: 'formal-sets',
    image: 'طقم4.png',
    price: 150,
    sizes: 'من 38 إلى 42',
  },
  {
    name: 'طقم رسمي راقي',
    category: 'formal-sets',
    image: 'طقم5.jpg',
    price: 150,
    sizes: 'من 38 إلى 42',
  },
  {
    name: 'طقم رسمي راقي',
    category: 'formal-sets',
    image: 'طقم6.jpg',
    price: 150,
    sizes: 'من 38 إلى 42',
  },
  {
    name: 'طقم رسمي راقي',
    category: 'formal-sets',
    image: 'طقم7.jpg',
    price: 150,
    sizes: 'من 38 إلى 42',
  },
  {
    name: 'طقم رسمي راقي',
    category: 'formal-sets',
    image: 'طقم8.jpg',
    price: 150,
    sizes: 'من 38 إلى 42',
  },
  {
    name: 'طقم مزخرف راقي',
    category: 'formal-sets',
    image: 'طقم مزخرف.png',
    price: 150,
    sizes: 'من 38 إلى 42',
  },

  /* -------------------------------- قمصان -------------------------------- */
  { name: 'قميص هادئ', category: 'shirts', image: '1 (5).jpg', price: 60 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (8).jpg', price: 60 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (22).jpg', price: 45 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (7).jpg', price: 45 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (20).jpg', price: 45 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (25).jpg', price: 35 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (6).jpg', price: 35 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (9).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (24).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (17).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '2 (2).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (4).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (12).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (27).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (1).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (10).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (2).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (19).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '3.jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (16).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (11).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (26).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '2 (1).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (23).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '2 (3).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (3).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (15).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (13).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (21).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (14).jpg', price: 80 },
  { name: 'قميص هادئ', category: 'shirts', image: '1 (18).jpg', price: 80 },

  /* -------------------------------- بلايز --------------------------------
     ⚠️ سعر تجريبي مؤقت — ليس السعر الحقيقي، يجب مراجعته وتعديله */
  {
    name: 'بلوزة هاينيك',
    category: 'blouses',
    image: 'بلوزة.png',
    price: 45, // ⚠️ سعر تجريبي — استبدله بالسعر الحقيقي
    colors: 8,
  },

  /* ------------------------------- بناطيل ------------------------------- */
  { name: 'بنطال أنيق', category: 'pants', image: 'بنطلون.png', price: 80, colors: 7 },

  /* ------------------------------- تنانير ------------------------------- */
  { name: 'تنورة عصرية', category: 'skirts', image: 'تنورة.png', price: 90, colors: 2 },

  /* --------------------------- مكملات الحجاب --------------------------- */
  { name: 'قبة قمصان', category: 'hijab-accessories', image: 'مكمل2.png', price: 35, colors: 2 },
  { name: 'قبة قمصان', category: 'hijab-accessories', image: 'مكمل6.png', price: 35 },
  { name: 'قبة قمصان', category: 'hijab-accessories', image: 'مكمل7.png', price: 35 },
  { name: 'قميص تنورة', category: 'hijab-accessories', image: 'مكمل5.png', price: 35, colors: 2 },
  { name: 'معاصم', category: 'hijab-accessories', image: 'معاصم.png', price: 5, colors: 3 },
  { name: 'معاصم', category: 'hijab-accessories', image: 'مكمل4.png', price: 5, colors: 2 },
  { name: 'بيسك طويل', category: 'hijab-accessories', image: 'مكمل1.png', price: 35, colors: 2 },
  { name: 'هاينيك بلوزة', category: 'hijab-accessories', image: 'مكمل3.png', price: 35, colors: 3 },

  /* ----------------------------- أطقم صلاة ----------------------------- */
  { name: 'طقم صلاة راقي', category: 'prayer-sets', image: 'اطقم صلاة.png', price: 35, colors: 2 },
  { name: 'طقم صلاة فاخر', category: 'prayer-sets', image: 'صلاة2.png', price: 35 },
  { name: 'طقم صلاة مطرز', category: 'prayer-sets', image: 'صلاة3.png', price: 35 },
  { name: 'طقم صلاة لايكرا', category: 'prayer-sets', image: 'صلاة1.png', price: 35, colors: 5 },

  /* ------------------------------ بيجامات ------------------------------
     ⚠️ سعر تجريبي مؤقت — ليس السعر الحقيقي، يجب مراجعته وتعديله */
  // ⚠️ سعر تجريبي — استبدله بالسعر الحقيقي
  { name: 'بيجامة قطنية مريحة', category: 'pajamas', image: 'بيجامة.png', price: 90 },

  /* --------------------------- ملابس داخلية --------------------------- */
  { name: 'بكج كلوتات', category: 'underwear', image: 'ملابس داخلية.png', price: 35 },
  {
    name: 'كلوتات',
    category: 'underwear',
    image: 'داخلي1.png',
    priceText: 'الواحد بـ 10 والاثنان بـ 15',
  },
  {
    name: 'كلوتات',
    category: 'underwear',
    image: 'داخلي4.png',
    priceText: 'الواحد بـ 10 والاثنان بـ 15',
  },
  {
    name: 'كلوتات',
    category: 'underwear',
    image: 'داخلي5.png',
    priceText: 'الواحد بـ 10 والاثنان بـ 15',
  },
  { name: 'ستيان ليزر', category: 'underwear', image: 'داخلي2png.png', price: 15 },
  { name: 'شبَّاح شيَّال عريض', category: 'underwear', image: 'داخلي3.png', price: 15 },
  { name: 'شبَّاح شيَّال رفيع', category: 'underwear', image: 'داخلي6.png', price: 10 },

  /* -------------------------- عطور وكوزمتكس -------------------------- */
  { name: 'سبلاش للجسم', category: 'beauty', image: 'عطر0.png', price: 50 },
  { name: 'سبلاش لامع', category: 'beauty', image: 'عطر1.png', price: 55 },
  { name: 'لوشن للجسم', category: 'beauty', image: 'عطر5.png', price: 40 },
  { name: 'كريم تفتيح للإبط', category: 'beauty', image: 'عطر4.png', price: 45 },
  { name: 'كريم لليدين', category: 'beauty', image: 'عطر2.png', price: null },
  { name: 'ليفة استحمام', category: 'beauty', image: 'عطر3.png', price: 12 },
  { name: 'شفرات حلاقة للجسم', category: 'beauty', image: 'شفرات.png', price: 20 },
  { name: 'فوط يومية نسائية', category: 'beauty', image: 'فوط.png', price: 15 },
  { name: 'مشط شعر', category: 'beauty', image: 'مشط.png', price: 18 },
  { name: 'مشط شعر', category: 'beauty', image: 'مشط1.png', price: 18 },
];

/* ---------------------------------------------------------------------------
   إرجاع منتجات تصنيف واحد — تُستخدم عند فتح أي قسم في صفحة المنتجات
   --------------------------------------------------------------------------- */
SheModa.productsOf = function (slug) {
  return SheModa.products.filter(function (product) {
    return product.category === slug;
  });
};
