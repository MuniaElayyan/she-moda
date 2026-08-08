/* =============================================================================
   layout.js — الهيدر والفوتر وزر واتساب العائم

   الهيدر والفوتر يُبنيان من هنا مرة واحدة ويُحقنان في كل صفحة، بدل تكرار
   نفس الـ HTML في خمس صفحات. أي تعديل على القائمة أو الفوتر يتم هنا فقط.
   ============================================================================= */

window.SheModa = window.SheModa || {};

/* ---------------------------------------------------------------------------
   أصناف الأزرار الموحّدة — مصدر واحد لشكل كل أزرار الموقع
   variant: primary (وردي ممتلئ) | ghost (أبيض بإطار) | dark (فحمي) | plain
   size   : sm | md | lg
   --------------------------------------------------------------------------- */
SheModa.btn = function (variant, size) {
  var base =
    'group/btn inline-flex items-center justify-center gap-2 rounded-full font-semibold ' +
    'transition-all duration-300 ease-out select-none ' +
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-300/70 ' +
    'motion-reduce:transition-none motion-reduce:hover:translate-y-0';

  var variants = {
    primary:
      'bg-blush-500 text-white shadow-soft hover:bg-blush-600 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0',
    ghost:
      'bg-white text-blush-700 ring-1 ring-blush-200 hover:ring-blush-400 hover:bg-blush-50 hover:-translate-y-0.5 active:translate-y-0',
    dark: 'bg-ink-900 text-white hover:bg-ink-800 hover:-translate-y-0.5 active:translate-y-0',
    plain: 'text-blush-600 hover:text-blush-700 hover:gap-3',
  };

  var sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3 text-[15px]',
    lg: 'px-8 py-4 text-base',
  };

  return (
    base +
    ' ' +
    (variants[variant] || variants.primary) +
    ' ' +
    (variant === 'plain' ? '' : sizes[size] || sizes.md)
  );
};

/* ---------------------------------------------------------------------------
   معرفة الصفحة المفتوحة حاليًا — تُستخدم لتفعيل الرابط النشط في القائمة
   --------------------------------------------------------------------------- */
SheModa.currentPage = function () {
  var file = window.location.pathname.split('/').pop();
  return file && file.length ? file : 'index.html';
};

/* ---------------------------------------------------------------------------
   بناء الهيدر: شعار + قائمة سطح المكتب + زر واتساب + قائمة الهاتف
   --------------------------------------------------------------------------- */
SheModa.renderHeader = function (mount) {
  if (!mount) return;

  var current = SheModa.currentPage();
  var site = SheModa.site;

  /* رابط واحد في قائمة سطح المكتب */
  function desktopLink(page) {
    var active = page.href === current;
    return (
      '<li>' +
      '<a href="' +
      page.href +
      '" ' +
      (active ? 'aria-current="page" ' : '') +
      'class="relative block rounded-full px-4 py-2 text-[15px] font-semibold transition-colors duration-300 ' +
      (active ? 'text-blush-600' : 'text-ink-600 hover:text-blush-600') +
      '">' +
      SheModa.esc(page.label) +
      '<span class="pointer-events-none absolute inset-x-4 bottom-1 h-px rounded-full bg-blush-500 transition-transform duration-300 ' +
      (active ? 'scale-x-100' : 'scale-x-0') +
      '"></span>' +
      '</a></li>'
    );
  }

  /* رابط واحد في قائمة الهاتف — مساحة لمس مريحة */
  function mobileLink(page) {
    var active = page.href === current;
    return (
      '<li>' +
      '<a href="' +
      page.href +
      '" ' +
      (active ? 'aria-current="page" ' : '') +
      'class="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors ' +
      (active ? 'bg-blush-50 text-blush-600' : 'text-ink-700 hover:bg-blush-50 hover:text-blush-600') +
      '">' +
      '<span>' +
      SheModa.esc(page.label) +
      '</span>' +
      SheModa.icon('chevronStart', 'w-4 h-4 text-blush-300') +
      '</a></li>'
    );
  }

  var links = SheModa.pages;

  mount.innerHTML =
    /* رابط تخطي للوصولية — يظهر عند التنقل بلوحة المفاتيح فقط */
    '<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[60] focus:rounded-full focus:bg-blush-500 focus:px-5 focus:py-3 focus:text-white focus:shadow-lift">' +
    'تخطّي إلى المحتوى</a>' +
    '<header id="site-header" class="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-white/70 backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-out">' +
    '<div class="mx-auto max-w-content px-4 sm:px-6 lg:px-8">' +
    '<div class="flex h-[72px] items-center justify-between gap-5 sm:h-20 lg:gap-10">' +
    /* الشعار واسم البراند */
    '<a href="index.html" class="group flex shrink-0 items-center gap-2.5 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-300/70" aria-label="' +
    SheModa.esc(site.name) +
    ' — الصفحة الرئيسية">' +
    '<img src="' +
    site.logo +
    '" alt="شعار ' +
    SheModa.esc(site.name) +
    '" width="56" height="56" decoding="async" ' +
    'class="h-10 w-10 object-contain transition-transform duration-500 group-hover:scale-110 sm:h-12 sm:w-12">' +
    '<span class="font-brand text-[26px] leading-none sm:text-3xl">' +
    '<span class="text-blush-500">She</span> <span class="text-ink-900">Moda</span></span>' +
    '</a>' +
    /* قائمة سطح المكتب — تأخذ المساحة الوسطى ولا تلتصق بالشعار */
    '<nav class="hidden min-w-0 flex-1 justify-center lg:flex" aria-label="القائمة الرئيسية">' +
    '<ul class="flex items-center gap-0.5 xl:gap-2">' +
    links.map(desktopLink).join('') +
    '</ul></nav>' +
    /* أزرار الجهة المقابلة */
    '<div class="flex shrink-0 items-center gap-2">' +
    '<a href="' +
    SheModa.whatsappLink() +
    '" target="_blank" rel="noopener" class="' +
    SheModa.btn('primary', 'sm') +
    ' hidden sm:inline-flex">' +
    SheModa.icon('whatsapp', 'w-4 h-4') +
    '<span>اسألي عن منتج</span></a>' +
    /* زر القائمة للهاتف */
    '<button type="button" id="menu-btn" aria-expanded="false" aria-controls="mobile-menu" ' +
    'class="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-ink-800 ring-1 ring-blush-200 transition-colors hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-300/70 lg:hidden">' +
    '<span class="sr-only">فتح القائمة</span>' +
    '<span data-menu-icon>' +
    SheModa.icon('menu', 'w-6 h-6') +
    '</span></button>' +
    '</div></div></div>' +
    /* لوحة قائمة الهاتف
       الفتح والإغلاق يتمّان بتحريك ارتفاع الشبكة من 0fr إلى 1fr، وهذا يعطي
       حركة انسيابية في الاتجاهين بدل الظهور والاختفاء المفاجئ.
       السمة inert تمنع الوصول للروابط بلوحة المفاتيح وقارئ الشاشة وهي مغلقة. */
    '<div id="mobile-menu" inert ' +
    'class="grid grid-rows-[0fr] overflow-hidden border-t border-transparent bg-white/95 opacity-0 backdrop-blur-xl transition-all duration-500 ease-out motion-reduce:transition-none lg:hidden">' +
    '<div class="min-h-0">' +
    '<nav class="mx-auto max-w-content px-4 pb-5 pt-4 sm:px-6" aria-label="قائمة الهاتف">' +
    '<ul class="flex flex-col gap-1">' +
    links.map(mobileLink).join('') +
    '</ul>' +
    '<a href="' +
    SheModa.whatsappLink() +
    '" target="_blank" rel="noopener" class="' +
    SheModa.btn('primary', 'md') +
    ' mt-4 w-full">' +
    SheModa.icon('whatsapp', 'w-5 h-5') +
    '<span>تواصلي عبر واتساب</span></a>' +
    '</nav></div></div>' +
    '</header>' +
    /* مساحة تعويض ارتفاع الهيدر الثابت حتى لا يغطي أول قسم */
    '<div class="h-[72px] sm:h-20" aria-hidden="true"></div>';
};

/* ---------------------------------------------------------------------------
   بناء الفوتر: البراند + روابط الصفحات + الأقسام + معلومات التواصل
   --------------------------------------------------------------------------- */
SheModa.renderFooter = function (mount) {
  if (!mount) return;

  var site = SheModa.site;

  /* روابط التواصل الاجتماعي */
  function socialLink(href, iconName, label) {
    return (
      '<a href="' +
      href +
      '" target="_blank" rel="noopener" aria-label="' +
      label +
      '" ' +
      'class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-blush-100 transition-all duration-300 hover:-translate-y-1 hover:bg-blush-500 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush-300/50">' +
      SheModa.icon(iconName, 'w-5 h-5') +
      '</a>'
    );
  }

  /* عمود روابط بسيط */
  function linkColumn(title, items) {
    return (
      '<div>' +
      '<h3 class="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-blush-300">' +
      title +
      '</h3>' +
      '<ul class="space-y-3">' +
      items
        .map(function (item) {
          return (
            '<li><a href="' +
            item.href +
            '" class="inline-flex items-center gap-2 text-[15px] text-ink-200 transition-all duration-300 hover:gap-3 hover:text-blush-300">' +
            '<span class="h-px w-3 bg-blush-400/60"></span>' +
            SheModa.esc(item.label) +
            '</a></li>'
          );
        })
        .join('') +
      '</ul></div>'
    );
  }

  /* أبرز الأقسام — تُقرأ من ملف التصنيفات */
  var topCategories = SheModa.categories.slice(0, 6).map(function (category) {
    return { href: 'products.html#' + category.slug, label: category.name };
  });

  mount.innerHTML =
    '<footer class="relative mt-24 overflow-hidden bg-ink-900 text-white">' +
    /* توهج وردي خفيف في الخلفية */
    '<div class="pointer-events-none absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-blush-500/20 blur-3xl" aria-hidden="true"></div>' +
    '<div class="relative mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8 lg:py-20">' +
    '<div class="grid gap-12 lg:grid-cols-12">' +
    /* عمود البراند */
    '<div class="lg:col-span-4">' +
    '<div class="flex items-center gap-3">' +
    '<img src="' +
    site.logo +
    '" alt="شعار ' +
    SheModa.esc(site.name) +
    '" width="56" height="56" loading="lazy" decoding="async" class="h-14 w-14 object-contain">' +
    '<span class="font-brand text-4xl leading-none"><span class="text-blush-400">She</span> <span class="text-white">Moda</span></span>' +
    '</div>' +
    '<p class="mt-5 max-w-sm text-[15px] leading-8 text-ink-200">' +
    SheModa.esc(site.tagline) +
    ' ✨<br>وجهتكِ لكل ما يخص الأناقة والموضة في عتيل - طولكرم.</p>' +
    '<div class="mt-7 flex items-center gap-3">' +
    socialLink(SheModa.whatsappLink(), 'whatsapp', 'تواصلي معنا عبر واتساب') +
    socialLink(site.links.instagram, 'instagram', 'صفحتنا على إنستغرام') +
    socialLink(site.links.facebook, 'facebook', 'صفحتنا على فيسبوك') +
    socialLink('tel:+' + site.phoneDigits, 'phone', 'اتصلي بنا') +
    '</div></div>' +
    /* أعمدة الروابط */
    '<div class="lg:col-span-2">' +
    linkColumn('الموقع', SheModa.pages) +
    '</div>' +
    '<div class="lg:col-span-3">' +
    linkColumn('أقسامنا', topCategories) +
    '</div>' +
    /* عمود التواصل */
    '<div class="lg:col-span-3">' +
    '<h3 class="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-blush-300">تواصلي معنا</h3>' +
    '<ul class="space-y-4 text-[15px] text-ink-200">' +
    '<li class="flex gap-3">' +
    '<span class="mt-0.5 shrink-0 text-blush-400">' +
    SheModa.icon('location', 'w-5 h-5') +
    '</span>' +
    '<span class="leading-7">' +
    SheModa.esc(site.address) +
    '</span></li>' +
    '<li class="flex gap-3">' +
    '<span class="shrink-0 text-blush-400">' +
    SheModa.icon('phone', 'w-5 h-5') +
    '</span>' +
    '<a href="tel:+' +
    site.phoneDigits +
    '" dir="ltr" class="transition-colors hover:text-blush-300">' +
    SheModa.esc(site.phone) +
    '</a></li>' +
    '</ul>' +
    /* الرابط يُملأ من js/main.js، ويُخفى الزر تلقائيًا ما دام رابط الخريطة غير متوفر */
    '<a data-maps class="' +
    SheModa.btn('ghost', 'sm') +
    ' mt-6 cursor-pointer">' +
    SheModa.icon('location', 'w-4 h-4') +
    '<span>افتحي الموقع على الخريطة</span></a>' +
    '</div></div>' +
    /* الشريط السفلي */
    '<div class="mt-14 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-center text-sm text-ink-300 sm:flex-row sm:justify-between sm:text-start">' +
    '<p>جميع الحقوق محفوظة © ' +
    SheModa.esc(site.name) +
    '</p>' +
    '<p class="flex items-center gap-1.5">صُنع بحبّ ' +
    SheModa.icon('heart', 'w-4 h-4 text-blush-400') +
    ' لكل سيدة أنيقة</p>' +
    '</div></div></footer>';
};

/* ---------------------------------------------------------------------------
   زر واتساب العائم — يظهر أسفل الشاشة ويتوسّع عند المرور عليه
   --------------------------------------------------------------------------- */
SheModa.renderFloatingWhatsApp = function () {
  var wrap = document.createElement('div');
  wrap.className = 'fixed bottom-5 left-5 z-40 print:hidden';
  wrap.innerHTML =
    '<a href="' +
    SheModa.whatsappLink() +
    '" target="_blank" rel="noopener" ' +
    'class="group flex items-center gap-0 rounded-full bg-[#25D366] py-3.5 ps-4 pe-4 text-white shadow-lift transition-all duration-500 hover:gap-2.5 hover:pe-5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40">' +
    SheModa.icon('whatsapp', 'w-6 h-6 shrink-0') +
    '<span class="max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-semibold opacity-0 transition-all duration-500 group-hover:max-w-[12rem] group-hover:opacity-100">' +
    'اسألي عن منتج</span>' +
    '<span class="sr-only">تواصلي معنا عبر واتساب</span></a>';

  document.body.appendChild(wrap);
};
