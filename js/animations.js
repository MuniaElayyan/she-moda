/* =============================================================================
   animations.js — حركة ظهور العناصر عند التمرير (Scroll Reveal)

   أي عنصر يحمل السمة data-reveal يبدأ شفافًا ومزاحًا للأسفل قليلًا، ثم يظهر
   بنعومة عند وصوله إلى الشاشة. تُستخدم IntersectionObserver لأنها لا تستهلك
   المعالج مثل الاستماع لحدث التمرير.

   ملاحظتان مهمّتان:
     • إذا كان الزائر مفعّلًا خيار «تقليل الحركة» في نظامه، تظهر العناصر فورًا.
     • تُضاف حالة الإخفاء عبر JavaScript فقط، حتى لا يختفي المحتوى
       إذا تعطّل JavaScript لأي سبب.
   ============================================================================= */

window.SheModa = window.SheModa || {};

/* الأصناف التي تمثل حالة «قبل الظهور» و«بعد الظهور» */
SheModa.revealHidden = ['opacity-0', 'translate-y-6'];
SheModa.revealShown = ['opacity-100', 'translate-y-0'];
SheModa.revealBase = ['transition-all', 'duration-700', 'ease-out'];

/* تأخيرات متدرّجة تعطي إحساس ظهور الكروت واحدًا بعد الآخر */
SheModa.revealDelays = ['delay-0', 'delay-75', 'delay-150', 'delay-200', 'delay-300', 'delay-500'];

SheModa.initAnimations = function () {
  /* احترام تفضيل تقليل الحركة في نظام الزائر */
  var reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    return; // العناصر تبقى ظاهرة كما هي بدون أي حركة
  }

  SheModa.revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        el.classList.remove.apply(el.classList, SheModa.revealHidden);
        el.classList.add.apply(el.classList, SheModa.revealShown);
        SheModa.revealObserver.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );

  SheModa.revealWithin(document);
};

/* ---------------------------------------------------------------------------
   تسجيل عناصر جديدة للمراقبة — تُستدعى بعد بناء أي كروت بواسطة JavaScript
   root: العنصر الحاوي للعناصر الجديدة
   --------------------------------------------------------------------------- */
SheModa.revealWithin = function (root) {
  if (!SheModa.revealObserver || !root) return;

  var items = root.querySelectorAll('[data-reveal]');

  Array.prototype.forEach.call(items, function (el, i) {
    if (el.dataset.revealed === 'true') return;
    el.dataset.revealed = 'true';

    el.classList.add.apply(el.classList, SheModa.revealBase);
    el.classList.add.apply(el.classList, SheModa.revealHidden);
    el.classList.add(SheModa.revealDelays[i % SheModa.revealDelays.length]);

    SheModa.revealObserver.observe(el);
  });
};
