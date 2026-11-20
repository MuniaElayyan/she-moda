/* =============================================================================
   categories.js — تصنيفات المتجر الأربعة عشر

   slug   : المعرّف المستخدم في رابط الصفحة (products.html#slug)
   name   : الاسم الظاهر للزبونة
   image  : صورة التصنيف — الأسماء مطابقة تمامًا لملفات المشروع، ممنوع تغييرها
   blurb  : وصف قصير يظهر داخل الكرت
   feature: يظهر في قسم التصنيفات المختصر بالصفحة الرئيسية
   ============================================================================= */

window.SheModa = window.SheModa || {};

SheModa.categories = [
  {
    slug: 'jalabib',
    name: 'جلابيب',
    image: 'images/جلباب.png',
    blurb: 'جلابيب أنيقة بخامات مريحة',
    feature: true,
  },
  {
    slug: 'abayat',
    name: 'عبايات',
    image: 'images/عباية.png',
    blurb: 'تشكيلة عبايات كلاسيكية وعصرية',
    feature: true,
  },
  {
    slug: 'dresses',
    name: 'فساتين',
    image: 'images/فستان.png',
    blurb: 'فساتين للمناسبات والإطلالات اليومية',
    feature: true,
  },
  {
    slug: 'caftan',
    name: 'قفاطين',
    image: 'images/قفطان.png',
    blurb: 'قفاطين مغربية فاخرة',
    feature: false,
  },
  {
    slug: 'formal-sets',
    name: 'أطقم رسمية',
    image: 'images/طقم.png',
    blurb: 'أطقم رسمية بقصّات راقية',
    feature: true,
  },
  {
    slug: 'shirts',
    name: 'قمصان',
    image: 'images/قميص.png',
    blurb: 'قمصان بألوان وتصاميم متنوعة',
    feature: true,
  },
  {
    slug: 'blouses',
    name: 'بلايز',
    image: 'images/بلوزة.png',
    blurb: 'بلايز أساسية بألوان متعددة',
    feature: true,
  },
  {
    slug: 'pants',
    name: 'بناطيل',
    image: 'images/بنطلون.png',
    blurb: 'بناطيل أنيقة ومريحة',
    feature: true,
  },
  {
    slug: 'skirts',
    name: 'تنانير',
    image: 'images/تنورة.png',
    blurb: 'تنانير عصرية بقصّات ناعمة',
    feature: false,
  },
  {
    slug: 'hijab-accessories',
    name: 'مكملات الحجاب',
    image: 'images/معاصم.png',
    blurb: 'معاصم وقبّات وبيسك ولوازم الحجاب',
    feature: true,
  },
  {
    slug: 'prayer-sets',
    name: 'أطقم صلاة',
    image: 'images/اطقم صلاة.png',
    blurb: 'أطقم صلاة مطرزة وناعمة',
    feature: true,
  },
  {
    slug: 'pajamas',
    name: 'بيجامات',
    image: 'images/بيجامة.png',
    blurb: 'بيجامات قطنية مريحة',
    feature: true,
  },
  {
    slug: 'underwear',
    name: 'ملابس داخلية',
    image: 'images/ملابس داخلية.png',
    blurb: 'ملابس داخلية بخامات مريحة',
    feature: true,
  },
  {
    slug: 'beauty',
    name: 'عطور وكوزمتكس',
    image: 'images/عطر.png',
    blurb: 'عطور ومستحضرات عناية يومية',
    feature: true,
  },
];

/* البحث عن تصنيف واحد عبر المعرّف — تُستخدم في صفحة المنتجات */
SheModa.findCategory = function (slug) {
  return SheModa.categories.filter(function (c) {
    return c.slug === slug;
  })[0];
};
