/* =============================================================================
   lightbox.js — نافذة عرض الصور بالحجم الكامل

   تعمل مع أي عنصر يحمل السمة data-lightbox، سواء كان كرت منتج أو صورة معرض.
   السمات المطلوبة على العنصر:
     data-lightbox-src     : مسار الصورة
     data-lightbox-caption : الوصف الظاهر أسفل الصورة
     data-lightbox-group   : اسم المجموعة للتنقل بين صور القسم نفسه
   ============================================================================= */

window.SheModa = window.SheModa || {};

SheModa.initLightbox = function () {
  var triggers = []; // أزرار المجموعة المفتوحة حاليًا
  var index = 0;
  var lastFocused = null;

  /* بناء هيكل النافذة مرة واحدة فقط وإضافته لنهاية الصفحة */
  var overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-[70] hidden items-center justify-center bg-ink-900/90 p-4 opacity-0 backdrop-blur-sm ' +
    'transition-opacity duration-300 ease-out motion-reduce:transition-none sm:p-8';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'عارض الصور');

  overlay.innerHTML =
    '<figure class="relative flex max-h-full w-full max-w-4xl flex-col items-center gap-4">' +
    '<img data-lb-image alt="" class="max-h-[74vh] w-auto max-w-full rounded-2xl object-contain shadow-lift">' +
    '<figcaption data-lb-caption class="text-center text-[15px] font-semibold text-white"></figcaption>' +
    '</figure>' +
    /* زر الإغلاق */
    '<button type="button" data-lb-close aria-label="إغلاق عارض الصور" ' +
    'class="absolute end-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40">' +
    SheModa.icon('close', 'w-6 h-6') +
    '</button>' +
    /* أزرار التنقل بين صور المجموعة
       في الاتجاه RTL: «السابق» على اليمين بسهم يشير يمينًا،
       و«التالي» على اليسار بسهم يشير يسارًا */
    '<button type="button" data-lb-prev aria-label="الصورة السابقة" ' +
    'class="absolute start-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:flex">' +
    SheModa.icon('chevronEnd', 'w-6 h-6') +
    '</button>' +
    '<button type="button" data-lb-next aria-label="الصورة التالية" ' +
    'class="absolute end-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:flex">' +
    SheModa.icon('chevronStart', 'w-6 h-6') +
    '</button>' +
    /* عدّاد الصور */
    '<p data-lb-counter class="absolute bottom-4 start-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white" dir="ltr"></p>';

  document.body.appendChild(overlay);

  var imageEl = overlay.querySelector('[data-lb-image]');
  var captionEl = overlay.querySelector('[data-lb-caption]');
  var counterEl = overlay.querySelector('[data-lb-counter]');
  var closeBtn = overlay.querySelector('[data-lb-close]');
  var prevBtn = overlay.querySelector('[data-lb-prev]');
  var nextBtn = overlay.querySelector('[data-lb-next]');

  /* ------------------------------------------------------------------------
     عرض الصورة رقم i من المجموعة الحالية
     ------------------------------------------------------------------------ */
  function show(i) {
    if (!triggers.length) return;

    /* التنقل دائري: بعد آخر صورة نعود للأولى */
    index = (i + triggers.length) % triggers.length;
    var trigger = triggers[index];

    imageEl.src = trigger.getAttribute('data-lightbox-src');
    imageEl.alt = trigger.getAttribute('data-lightbox-caption') || '';
    captionEl.textContent = trigger.getAttribute('data-lightbox-caption') || '';

    var many = triggers.length > 1;
    counterEl.textContent = many ? index + 1 + ' / ' + triggers.length : '';
    counterEl.classList.toggle('hidden', !many);
    prevBtn.classList.toggle('sm:flex', many);
    nextBtn.classList.toggle('sm:flex', many);
  }

  function open(trigger) {
    var group = trigger.getAttribute('data-lightbox-group');

    /* تجميع كل أزرار المجموعة نفسها لتمكين التنقل بينها */
    triggers = group
      ? Array.prototype.slice.call(
          document.querySelectorAll('[data-lightbox][data-lightbox-group="' + group + '"]')
        )
      : [trigger];

    lastFocused = document.activeElement;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.classList.add('overflow-hidden');

    show(triggers.indexOf(trigger));

    /* إطار واحد قبل تغيير الشفافية حتى ينفّذ المتصفح حركة الظهور */
    window.requestAnimationFrame(function () {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
    });

    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    document.body.classList.remove('overflow-hidden');
    if (lastFocused) lastFocused.focus();

    /* الإخفاء الفعلي بعد انتهاء حركة الاختفاء */
    window.setTimeout(function () {
      if (overlay.classList.contains('opacity-0')) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        imageEl.removeAttribute('src');
      }
    }, 300);
  }

  function isOpen() {
    return !overlay.classList.contains('hidden');
  }

  /* ------------------------------------------------------------------------
     مستمع واحد على مستوى الصفحة يخدم كل الأزرار الحالية والمستقبلية
     (بدل ربط مستمع لكل كرت على حدة)
     ------------------------------------------------------------------------ */
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-lightbox]');
    if (trigger) {
      event.preventDefault();
      open(trigger);
    }
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () {
    show(index - 1);
  });
  nextBtn.addEventListener('click', function () {
    show(index + 1);
  });

  /* الضغط على الخلفية السوداء يغلق النافذة */
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) close();
  });

  /* اختصارات لوحة المفاتيح — الأسهم معكوسة لأن الموقع بالاتجاه RTL */
  document.addEventListener('keydown', function (event) {
    if (!isOpen()) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(index + 1);
    if (event.key === 'ArrowRight') show(index - 1);
  });
};
