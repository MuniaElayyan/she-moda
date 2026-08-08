/* =============================================================================
   main.js — نقطة تشغيل الموقع

   يجمع كل الوحدات السابقة ويشغّلها بالترتيب الصحيح:
     1) تجهيز مراقب حركة الظهور.
     2) بناء الهيدر والفوتر وزر واتساب العائم.
     3) تفعيل التنقل وعارض الصور.
     4) ملء الأقسام التي تُبنى من البيانات (لا يُملأ إلا الموجود في الصفحة).
     5) تسجيل كل ما بُني حديثًا في حركة الظهور.
   ============================================================================= */

window.SheModa = window.SheModa || {};

/* ---------------------------------------------------------------------------
   إدراج محتوى داخل عنصر إن كان موجودًا في الصفحة الحالية
   هذا ما يجعل ملفًا واحدًا يخدم كل الصفحات دون أخطاء
   --------------------------------------------------------------------------- */
SheModa.mount = function (id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
};

/* ---------------------------------------------------------------------------
   بناء كل الأقسام التي تعتمد على البيانات
   --------------------------------------------------------------------------- */
SheModa.renderCollections = function () {
  /* التصنيفات المميزة في الصفحة الرئيسية */
  SheModa.mount(
    'featured-categories',
    SheModa.categories
      .filter(function (category) {
        return category.feature;
      })
      .map(SheModa.categoryCard)
      .join('')
  );

  /* مميزات المتجر — بنمط المسار البصري المتعرّج */
  SheModa.mount('features-path', SheModa.visualPath(SheModa.features));

  /* قيم المتجر في صفحة «من نحن» — بالنمط نفسه */
  SheModa.mount('values-path', SheModa.visualPath(SheModa.values));

  /* أرقام المتجر — تبقى شرطات حتى تُضاف الأرقام الحقيقية في content.js */
  SheModa.mount('stats-grid', SheModa.stats.map(SheModa.statCard).join(''));

  /* معرض الصور */
  SheModa.mount(
    'gallery-grid',
    SheModa.gallery
      .map(function (item, index) {
        return SheModa.galleryItem(item, index);
      })
      .join('')
  );

  /* أماكن الفيديوهات */
  SheModa.mount('videos-grid', SheModa.videos.map(SheModa.videoCard).join(''));

  /* آراء الزبائن كاملة — بنمط المسار البصري */
  SheModa.mount(
    'testimonials-path',
    SheModa.visualPath(SheModa.testimonials, SheModa.testimonialCard)
  );

  /* ثلاثة آراء مختصرة في الصفحة الرئيسية */
  SheModa.mount(
    'testimonials-preview',
    SheModa.testimonials
      .slice(0, 3)
      .map(function (item) {
        return '<div data-reveal class="h-full">' + SheModa.testimonialCard(item) + '</div>';
      })
      .join('')
  );
};

/* ---------------------------------------------------------------------------
   ربط الروابط المكتوبة في HTML ببيانات المتجر

   بدل تكرار رقم الهاتف ورابط الخريطة في خمس صفحات، تُكتب في HTML سمة
   وصفية فقط (data-whatsapp / data-tel / data-maps) ويُملأ الرابط من هنا.
   وبذلك يبقى رقم المتجر مكتوبًا في مكان واحد: js/data/site.js
   --------------------------------------------------------------------------- */
SheModa.bindLinks = function () {
  /* روابط واتساب — مع إمكانية رسالة مخصّصة لكل زر */
  SheModa.each('[data-whatsapp]', function (el) {
    el.setAttribute('href', SheModa.whatsappLink(el.getAttribute('data-whatsapp-text')));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* روابط الاتصال الهاتفي */
  SheModa.each('[data-tel]', function (el) {
    el.setAttribute('href', 'tel:+' + SheModa.site.phoneDigits);
  });

  /* روابط فتح الموقع على الخريطة
     ما دام الرابط الحقيقي غير متوفر في site.js يُخفى الزر بالكامل،
     فلا يظهر للزائرة زر لا يعمل ولا يوضع رابط بديل. */
  SheModa.each('[data-maps]', function (el) {
    if (!SheModa.site.links.maps) {
      el.classList.add('hidden');
      return;
    }
    el.setAttribute('href', SheModa.site.links.maps);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* نصوص تُقرأ من بيانات المتجر: data-site-text="phone" أو "address" */
  SheModa.each('[data-site-text]', function (el) {
    var key = el.getAttribute('data-site-text');
    if (SheModa.site[key]) el.textContent = SheModa.site[key];
  });
};

/* اختصار للمرور على عناصر الصفحة */
SheModa.each = function (selector, callback) {
  Array.prototype.forEach.call(document.querySelectorAll(selector), callback);
};

/* ---------------------------------------------------------------------------
   الخريطة التفاعلية داخل صفحة تواصل معنا

   تُبنى من links.mapsEmbed في js/data/site.js. إن كانت القيمة null يظهر
   مربّع توضيحي أنيق بدل الخريطة، فلا يبقى إطار فارغ أو مكسور في الصفحة.
   الإطار كسول التحميل (lazy) حتى لا يُثقل الصفحة قبل الوصول إليه.
   --------------------------------------------------------------------------- */
SheModa.renderMap = function () {
  var mount = document.getElementById('map-embed');
  if (!mount) return;

  var url = SheModa.site.links.mapsEmbed;

  /* لا يوجد رابط تضمين بعد — نعرض مكانًا محجوزًا واضحًا */
  if (!url) {
    mount.innerHTML =
      '<div class="rounded-3xl border-2 border-dashed border-blush-200 bg-white/60 p-6 text-center">' +
      '<p class="text-sm font-bold text-ink-600">مكان محجوز للخريطة التفاعلية</p>' +
      '<p class="mt-1.5 text-xs text-ink-400">أضف رابط التضمين في js/data/site.js لتظهر الخريطة هنا.</p>' +
      '</div>';
    return;
  }

  mount.innerHTML =
    '<div class="overflow-hidden rounded-3xl shadow-soft ring-1 ring-blush-100">' +
    '<iframe src="' +
    SheModa.esc(url) +
    '" title="موقع متجر She Moda على الخريطة" loading="lazy" allowfullscreen ' +
    'referrerpolicy="no-referrer-when-downgrade" ' +
    'class="block aspect-[4/3] w-full border-0 sm:aspect-video"></iframe>' +
    '</div>';
};

/* ---------------------------------------------------------------------------
   التشغيل
   --------------------------------------------------------------------------- */
SheModa.init = function () {
  /* 1) تجهيز مراقب الظهور قبل بناء أي محتوى */
  SheModa.initAnimations();

  /* 2) الهيكل المشترك بين كل الصفحات */
  SheModa.renderHeader(document.getElementById('site-header-root'));
  SheModa.renderFooter(document.getElementById('site-footer-root'));
  SheModa.renderFloatingWhatsApp();

  /* 3) السلوك التفاعلي */
  SheModa.initNavigation();
  SheModa.initLightbox();

  /* 4) المحتوى المبني من البيانات */
  SheModa.renderCollections();
  SheModa.bindLinks();
  SheModa.renderMap(); // يعمل في صفحة التواصل فقط ويخرج فورًا في غيرها
  SheModa.initCatalog(); // يعمل في صفحة المنتجات فقط ويخرج فورًا في غيرها

  /* 5) تسجيل العناصر الجديدة في حركة الظهور */
  SheModa.revealWithin(document);
};

document.addEventListener('DOMContentLoaded', SheModa.init);
