/* =============================================================================
   cards.js — قوالب الكروت والعناصر المتكرّرة

   كل شكل بصري يتكرّر في أكثر من صفحة مكتوب هنا مرة واحدة فقط:
   عنوان القسم، كرت التصنيف، كرت المنتج، كرت رأي الزبونة،
   عنصر المسار البصري المتعرّج، كرت الإحصائية، صورة المعرض، ومكان الفيديو.
   ============================================================================= */

window.SheModa = window.SheModa || {};

/* ---------------------------------------------------------------------------
   نص السعر — يتعامل مع السعر الرقمي والعروض الخاصة والسعر غير المحدّد
   --------------------------------------------------------------------------- */
SheModa.priceLabel = function (product) {
  if (product.priceText) return product.priceText;
  if (product.price === null || product.price === undefined) return 'السعر عند الاستفسار';
  return product.price + ' شيكل';
};

/* ---------------------------------------------------------------------------
   نص عدد الألوان — بديل أنيق عن دوائر الألوان الصغيرة في التصميم القديم
   --------------------------------------------------------------------------- */
SheModa.colorsLabel = function (count) {
  if (!count) return '';
  if (count === 2) return 'متوفر بلونين';
  if (count <= 10) return 'متوفر بـ ' + count + ' ألوان';
  return 'متوفر بعدة ألوان';
};

/* ---------------------------------------------------------------------------
   صياغة عدد القطع بالعربية الصحيحة: قطعة واحدة / قطعتان / 5 قطع / 31 قطعة
   --------------------------------------------------------------------------- */
SheModa.piecesLabel = function (count) {
  if (count === 1) return 'قطعة واحدة';
  if (count === 2) return 'قطعتان';
  if (count <= 10) return count + ' قطع';
  return count + ' قطعة';
};

/* ---------------------------------------------------------------------------
   كرت تصنيف — صورة + اسم القسم + عدد القطع + زر صغير يظهر عند المرور
   --------------------------------------------------------------------------- */
SheModa.categoryCard = function (category) {
  var count = SheModa.productsOf(category.slug).length;

  return (
    '<a href="products.html#' +
    category.slug +
    '" data-reveal ' +
    'class="group relative block overflow-hidden rounded-[26px] bg-blush-50 shadow-soft ring-1 ring-blush-100 transition-all duration-500 ' +
    'hover:-translate-y-2 hover:shadow-lift hover:ring-blush-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-300 ' +
    'motion-reduce:transition-none motion-reduce:hover:translate-y-0">' +
    /* الصورة */
    '<img src="' +
    SheModa.esc(category.image) +
    '" alt="قسم ' +
    SheModa.esc(category.name) +
    ' في متجر She Moda" loading="lazy" decoding="async" ' +
    'class="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none">' +
    /* تدرّج داكن أسفل الصورة ليبقى النص مقروءًا */
    '<span class="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/25 to-transparent transition-opacity duration-500 group-hover:from-ink-900/90" aria-hidden="true"></span>' +
    /* المحتوى */
    '<div class="absolute inset-x-0 bottom-0 p-5">' +
    '<h3 class="text-lg font-extrabold text-white drop-shadow-sm sm:text-xl">' +
    SheModa.esc(category.name) +
    '</h3>' +
    (count
      ? '<p class="mt-1 text-[13px] font-medium text-blush-100/90">' +
        SheModa.piecesLabel(count) +
        '</p>'
      : '') +
    /* الزر ظاهر دائمًا على الهاتف (لا يوجد Hover)، ويظهر عند المرور على الشاشات الكبيرة */
    '<span class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-[13px] font-bold text-blush-600 opacity-100 transition-all duration-500 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">' +
    'اكتشفي القسم' +
    SheModa.icon('chevronStart', 'w-3.5 h-3.5') +
    '</span></div></a>'
  );
};

/* ---------------------------------------------------------------------------
   كرت منتج — صورة قابلة للتكبير + الاسم + المقاسات + السعر + زر استفسار
   --------------------------------------------------------------------------- */
SheModa.productCard = function (product, index) {
  var category = SheModa.findCategory(product.category);
  var categoryName = category ? category.name : '';
  var alt = product.name + ' — ' + categoryName + ' من متجر She Moda';
  var price = SheModa.priceLabel(product);
  var colors = SheModa.colorsLabel(product.colors);

  /* رسالة واتساب مخصّصة لهذا المنتج بالذات */
  var message =
    'مرحبًا She Moda، أريد الاستفسار عن «' + product.name + '» من قسم ' + categoryName + '.';

  return (
    '<article data-reveal ' +
    'class="group flex flex-col overflow-hidden rounded-[26px] bg-white shadow-soft ring-1 ring-blush-100/80 transition-all duration-500 ' +
    'hover:-translate-y-1.5 hover:shadow-lift hover:ring-blush-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0">' +
    /* الصورة — الضغط عليها يفتحها بالحجم الكامل */
    '<div class="relative overflow-hidden bg-blush-50/70">' +
    '<button type="button" class="block w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blush-300" ' +
    'data-lightbox data-lightbox-group="products" data-lightbox-index="' +
    (index || 0) +
    '" data-lightbox-src="' +
    SheModa.esc(product.image) +
    '" data-lightbox-caption="' +
    SheModa.esc(product.name + ' — ' + price) +
    '">' +
    '<img src="' +
    SheModa.esc(product.image) +
    '" alt="' +
    SheModa.esc(alt) +
    '" loading="lazy" decoding="async" ' +
    'class="aspect-[3/4] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07] motion-reduce:transition-none">' +
    /* طبقة تظهر عند المرور على الشاشات الكبيرة */
    '<span class="absolute inset-0 hidden items-center justify-center bg-ink-900/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100 sm:flex" aria-hidden="true">' +
    '<span class="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-blush-600 shadow-lift">' +
    SheModa.icon('zoom', 'w-4 h-4') +
    'عرض التفاصيل</span></span>' +
    /* إشارة تكبير ظاهرة دائمًا على الهاتف حيث لا يوجد Hover */
    '<span class="absolute bottom-3 start-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-blush-600 shadow-soft transition-opacity duration-500 sm:opacity-0" aria-hidden="true">' +
    SheModa.icon('zoom', 'w-4 h-4') +
    '</span>' +
    '<span class="sr-only">عرض صورة ' +
    SheModa.esc(product.name) +
    ' بالحجم الكامل</span>' +
    '</button>' +
    /* شارة عدد الألوان — بديل دوائر الألوان القديمة */
    (colors
      ? '<span class="absolute end-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-blush-600 shadow-soft ring-1 ring-blush-100">' +
        SheModa.esc(colors) +
        '</span>'
      : '') +
    '</div>' +
    /* التفاصيل */
    '<div class="flex flex-1 flex-col p-5">' +
    '<h3 class="text-base font-bold leading-7 text-ink-900 sm:text-[17px]">' +
    SheModa.esc(product.name) +
    '</h3>' +
    (product.sizes
      ? '<p class="mt-1.5 text-sm text-ink-500">المقاسات: ' + SheModa.esc(product.sizes) + '</p>'
      : '') +
    '<div class="mt-5 flex items-center justify-between gap-3 border-t border-blush-100 pt-4">' +
    '<span class="text-[15px] font-extrabold text-blush-600">' +
    SheModa.esc(price) +
    '</span>' +
    /* زر الاستفسار — رسالة واتساب جاهزة باسم هذا المنتج تحديدًا */
    '<a href="' +
    SheModa.whatsappLink(message) +
    '" target="_blank" rel="noopener" ' +
    'class="inline-flex h-11 min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-blush-500 px-4 text-[13px] font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-blush-600 hover:shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0">' +
    SheModa.icon('whatsapp', 'w-4 h-4') +
    '<span>استفسري</span></a>' +
    '</div></div></article>'
  );
};

/* ---------------------------------------------------------------------------
   كرت رأي زبونة — نجوم + النص + حرف أول داخل دائرة بدل الصورة الشخصية
   --------------------------------------------------------------------------- */
SheModa.testimonialCard = function (item) {
  var stars = '';
  for (var i = 0; i < 5; i++) {
    stars += SheModa.icon('star', 'w-4 h-4 ' + (i < item.rating ? 'text-blush-400' : 'text-ink-200'));
  }

  /* حرف أول داخل شارة وردية فاتحة — إشارة تعريفية بسيطة، ليست صورة شخصية */
  var initial = item.name.replace(/^أ?م\s+/, '').charAt(0) || item.name.charAt(0);

  return (
    '<article class="relative flex h-full flex-col overflow-hidden rounded-[26px] bg-white p-7 shadow-soft ring-1 ring-blush-100/80 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0">' +
    /* علامة اقتباس زخرفية */
    '<span class="pointer-events-none absolute -top-4 end-4 select-none font-display text-8xl leading-none text-blush-100" aria-hidden="true">”</span>' +
    '<div class="relative flex items-center gap-1" role="img" aria-label="التقييم ' +
    item.rating +
    ' من 5 نجوم">' +
    stars +
    '</div>' +
    '<p class="relative mt-5 flex-1 text-[15px] leading-9 text-ink-600">' +
    SheModa.esc(item.text) +
    '</p>' +
    '<footer class="relative mt-6 flex items-center gap-3 border-t border-blush-100 pt-5">' +
    '<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush-50 text-lg font-extrabold text-blush-500 ring-1 ring-blush-100" aria-hidden="true">' +
    SheModa.esc(initial) +
    '</span>' +
    '<div><p class="text-[15px] font-bold text-ink-900">' +
    SheModa.esc(item.name) +
    '</p>' +
    '<p class="text-xs text-ink-400">زبونة She Moda</p></div>' +
    '</footer></article>'
  );
};

/* ---------------------------------------------------------------------------
   المسار البصري المتعرّج — كروت تتبادل يمين/يسار على خط رفيع يربطها

   items       : عناصر تحتوي على { icon, title, text }
   renderItem  : دالة اختيارية لبناء محتوى مخصّص بدل الكرت الافتراضي
   --------------------------------------------------------------------------- */
SheModa.visualPath = function (items, renderItem) {
  var body = items
    .map(function (item, index) {
      var isStart = index % 2 === 0; // زوجي = جهة البداية (اليمين في RTL)

      var content =
        renderItem ||
        function (data) {
          return (
            '<div class="rounded-[26px] bg-white p-7 shadow-soft ring-1 ring-blush-100/80 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8">' +
            '<span class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blush-50 text-blush-500 ring-1 ring-blush-100">' +
            SheModa.icon(data.icon || 'sparkle', 'w-6 h-6') +
            '</span>' +
            '<h3 class="mt-5 text-xl font-extrabold text-ink-900">' +
            SheModa.esc(data.title) +
            '</h3>' +
            '<p class="mt-3 text-[15px] leading-9 text-ink-500">' +
            SheModa.esc(data.text) +
            '</p></div>'
          );
        };

      return (
        '<li class="relative mb-8 last:mb-0 md:mb-14 md:grid md:grid-cols-2 md:gap-x-16" data-reveal>' +
        /* نقطة العنصر على الخط الرابط — التوسيط بـ left-1/2 يعمل في RTL و LTR معًا */
        '<span class="absolute left-1/2 top-12 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-blush-400 ring-[6px] ring-white md:block" aria-hidden="true"></span>' +
        /* الكرت — يتبادل بين العمودين مع إزاحة رأسية خفيفة */
        '<div class="' +
        (isStart ? 'md:col-start-1' : 'md:col-start-2 md:mt-16') +
        '">' +
        content(item, index) +
        '</div></li>'
      );
    })
    .join('');

  return (
    '<ol class="relative mx-auto max-w-5xl list-none">' +
    /* الخط الرأسي الرابط بين العناصر */
    '<span class="absolute inset-y-6 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-blush-200 to-transparent md:block" aria-hidden="true"></span>' +
    body +
    '</ol>'
  );
};

/* ---------------------------------------------------------------------------
   كرت إحصائية — يعرض شرطة بدل الرقم إلى أن تُضاف الأرقام الحقيقية
   --------------------------------------------------------------------------- */
SheModa.statCard = function (stat) {
  var hasValue = stat.value !== null && stat.value !== undefined;

  return (
    '<div data-reveal class="rounded-3xl bg-white p-6 text-center shadow-soft ring-1 ring-blush-100/80 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0">' +
    '<p class="font-display text-4xl font-bold ' +
    (hasValue ? 'text-blush-500' : 'text-blush-200') +
    ' sm:text-5xl">' +
    (hasValue ? SheModa.esc(stat.value) : '—') +
    '</p>' +
    '<p class="mt-2 text-sm font-semibold text-ink-500">' +
    SheModa.esc(stat.label) +
    '</p></div>'
  );
};

/* ---------------------------------------------------------------------------
   صورة داخل معرض الصور — الضغط عليها يفتحها بالحجم الكامل
   --------------------------------------------------------------------------- */
SheModa.galleryItem = function (item, index) {
  /* الصور العريضة تأخذ عمودين لإعطاء إحساس Masonry */
  var span = item.span === 'wide' ? 'sm:col-span-2 aspect-[16/10]' : 'aspect-[4/5]';

  return (
    '<button type="button" data-reveal ' +
    'data-lightbox data-lightbox-group="gallery" data-lightbox-index="' +
    index +
    '" data-lightbox-src="' +
    SheModa.esc(item.image) +
    '" data-lightbox-caption="' +
    SheModa.esc(item.alt) +
    '" ' +
    'class="group relative block overflow-hidden rounded-[22px] bg-blush-50 shadow-soft ring-1 ring-blush-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-300 ' +
    span +
    '">' +
    '<img src="' +
    SheModa.esc(item.image) +
    '" alt="' +
    SheModa.esc(item.alt) +
    '" loading="lazy" decoding="async" ' +
    'class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07] motion-reduce:transition-none">' +
    '<span class="absolute inset-0 flex items-center justify-center bg-ink-900/35 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true">' +
    '<span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-blush-600 shadow-lift">' +
    SheModa.icon('zoom', 'w-5 h-5') +
    '</span></span>' +
    '<span class="sr-only">تكبير الصورة: ' +
    SheModa.esc(item.alt) +
    '</span></button>'
  );
};

/* ---------------------------------------------------------------------------
   مكان فيديو — يعرض شكلًا توضيحيًا أنيقًا ما دام حقل src فارغًا،
   ويتحوّل تلقائيًا إلى مشغّل فيديو حقيقي بمجرد وضع اسم ملف الفيديو
   --------------------------------------------------------------------------- */
SheModa.videoCard = function (video) {
  /* الحالة الأولى: يوجد ملف فيديو فعلي */
  if (video.src) {
    return (
      '<figure data-reveal class="overflow-hidden rounded-[26px] bg-ink-900 shadow-soft ring-1 ring-blush-100">' +
      '<video controls preload="none" playsinline ' +
      (video.poster ? 'poster="' + SheModa.esc(video.poster) + '" ' : '') +
      'class="aspect-video w-full bg-ink-900">' +
      '<source src="' +
      SheModa.esc(video.src) +
      '" type="video/mp4">' +
      'متصفحك لا يدعم تشغيل الفيديو.' +
      '</video>' +
      '<figcaption class="bg-white p-5 text-center text-[15px] font-bold text-ink-900">' +
      SheModa.esc(video.title) +
      '</figcaption></figure>'
    );
  }

  /* الحالة الثانية: مكان محجوز للفيديو — بصورة معاينة إن وُجدت */
  var preview = video.poster
    ? '<img src="' +
      SheModa.esc(video.poster) +
      '" alt="معاينة: ' +
      SheModa.esc(video.title) +
      '" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover opacity-35">'
    : '';

  return (
    '<figure data-reveal class="overflow-hidden rounded-[26px] bg-white shadow-soft ring-1 ring-blush-100/80">' +
    '<div class="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-blush-100 via-blush-50 to-white">' +
    preview +
    '<div class="relative flex flex-col items-center px-6 text-center">' +
    '<span class="flex h-16 w-16 items-center justify-center rounded-full bg-white text-blush-500 shadow-lift ring-1 ring-blush-100">' +
    SheModa.icon('play', 'w-7 h-7') +
    '</span>' +
    '<p class="mt-4 text-sm font-bold text-ink-700">' +
    SheModa.esc(video.hint) +
    '</p>' +
    '<p class="mt-1 text-xs text-ink-400">مكان محجوز للفيديو</p>' +
    '</div></div>' +
    '<figcaption class="flex items-center justify-between gap-3 bg-white p-5">' +
    '<span class="text-[15px] font-bold text-ink-900">' +
    SheModa.esc(video.title) +
    '</span>' +
    '<span class="inline-flex items-center gap-1.5 rounded-full bg-blush-50 px-3 py-1.5 text-[11px] font-bold text-blush-500 ring-1 ring-blush-100">' +
    SheModa.icon('video', 'w-3.5 h-3.5') +
    'قريبًا</span>' +
    '</figcaption></figure>'
  );
};
