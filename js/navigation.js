/* =============================================================================
   navigation.js — سلوك التنقل في الموقع

   يتولّى: فتح وإغلاق قائمة الهاتف، وإغلاقها عند الضغط خارجها أو على أحد
   الروابط أو على زر Escape، وتغيير شكل الهيدر عند التمرير للأسفل.
   ============================================================================= */

window.SheModa = window.SheModa || {};

SheModa.initNavigation = function () {
  var header = document.getElementById('site-header');
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');

  /* -------------------------------------------------------------------------
     قائمة الهاتف: فتح وإغلاق مع تبديل الأيقونة وحالة aria
     ------------------------------------------------------------------------- */
  if (menuBtn && menu) {
    var iconSlot = menuBtn.querySelector('[data-menu-icon]');

    /* أصناف حالة الفتح مقابل حالة الإغلاق — الانتقال بينهما يتحرّك بنعومة */
    var openClasses = ['grid-rows-[1fr]', 'opacity-100', 'border-blush-100'];
    var closedClasses = ['grid-rows-[0fr]', 'opacity-0', 'border-transparent'];

    function setMenu(open) {
      openClasses.forEach(function (name) {
        menu.classList.toggle(name, open);
      });
      closedClasses.forEach(function (name) {
        menu.classList.toggle(name, !open);
      });

      /* منع وصول لوحة المفاتيح وقارئ الشاشة للروابط والقائمة مغلقة */
      if (open) menu.removeAttribute('inert');
      else menu.setAttribute('inert', '');

      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.querySelector('.sr-only').textContent = open ? 'إغلاق القائمة' : 'فتح القائمة';
      if (iconSlot) {
        iconSlot.innerHTML = SheModa.icon(open ? 'close' : 'menu', 'w-6 h-6');
      }
    }

    function isOpen() {
      return menuBtn.getAttribute('aria-expanded') === 'true';
    }

    /* الضغط على زر القائمة */
    menuBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      setMenu(!isOpen());
    });

    /* الضغط خارج القائمة يغلقها */
    document.addEventListener('click', function (event) {
      if (!isOpen()) return;
      if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
        setMenu(false);
      }
    });

    /* اختيار أي صفحة يغلق القائمة */
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    /* زر Escape يغلق القائمة ويعيد التركيز إلى زر القائمة */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    /* العودة لعرض سطح المكتب تغلق قائمة الهاتف تلقائيًا */
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && isOpen()) setMenu(false);
    });
  }

  /* -------------------------------------------------------------------------
     الهيدر الثابت: يصبح أوضح ويكتسب ظلًا خفيفًا بمجرد التمرير للأسفل
     ------------------------------------------------------------------------- */
  if (header) {
    /* في الأعلى: شفاف وهادئ. بعد التمرير: أوضح قليلًا مع ظل ناعم وحد رفيع */
    var scrolledClasses = ['bg-white/90', 'shadow-soft', 'border-blush-100'];
    var topClasses = ['bg-white/70', 'border-transparent'];
    var ticking = false;

    function syncHeader() {
      var scrolled = window.scrollY > 24;
      scrolledClasses.forEach(function (name) {
        header.classList.toggle(name, scrolled);
      });
      topClasses.forEach(function (name) {
        header.classList.toggle(name, !scrolled);
      });
      ticking = false;
    }

    /* requestAnimationFrame يمنع تنفيذ الحساب عشرات المرات في الثانية */
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(syncHeader);
      },
      { passive: true }
    );

    syncHeader();
  }
};
