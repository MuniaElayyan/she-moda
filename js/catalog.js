/* =============================================================================
   catalog.js — منطق صفحة المنتجات

   الصفحة لها حالتان:
     1) عرض شبكة التصنيفات (الحالة الافتراضية).
     2) عرض منتجات تصنيف واحد عند فتح الرابط products.html#slug

   يعتمد على الـ hash في الرابط، وبذلك يعمل زر الرجوع في المتصفح ويمكن
   مشاركة رابط أي قسم مباشرة — وهو ما كان مفقودًا في النسخة القديمة.
   ============================================================================= */

window.SheModa = window.SheModa || {};

SheModa.initCatalog = function () {
  var categoriesView = document.getElementById('catalog-categories');
  var productsView = document.getElementById('catalog-products');
  if (!categoriesView || !productsView) return;

  var grid = document.getElementById('category-grid');
  var titleEl = document.getElementById('catalog-title');
  var countEl = document.getElementById('catalog-count');
  var productGrid = document.getElementById('product-grid');
  var chipsEl = document.getElementById('catalog-chips');
  var backBtn = document.getElementById('catalog-back');

  /* -------------------------------------------------------------------------
     بناء شبكة التصنيفات مرة واحدة عند تحميل الصفحة
     ------------------------------------------------------------------------- */
  grid.innerHTML = SheModa.categories.map(SheModa.categoryCard).join('');

  /* -------------------------------------------------------------------------
     شريط أقسام سريع يظهر داخل صفحة القسم للتنقل بين الأقسام دون العودة
     ------------------------------------------------------------------------- */
  function renderChips(activeSlug) {
    chipsEl.innerHTML = SheModa.categories
      .map(function (category) {
        var active = category.slug === activeSlug;
        return (
          '<a href="#' +
          category.slug +
          '" class="shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ' +
          (active
            ? 'bg-blush-500 text-white shadow-soft'
            : 'bg-white text-ink-600 ring-1 ring-blush-200 hover:bg-blush-50 hover:text-blush-600') +
          '">' +
          SheModa.esc(category.name) +
          '</a>'
        );
      })
      .join('');
  }

  /* -------------------------------------------------------------------------
     الحالة الأولى: عرض كل التصنيفات
     ------------------------------------------------------------------------- */
  function showCategories() {
    categoriesView.classList.remove('hidden');
    productsView.classList.add('hidden');
    document.title = 'المنتجات | She Moda';
  }

  /* -------------------------------------------------------------------------
     الحالة الثانية: عرض منتجات تصنيف واحد
     ------------------------------------------------------------------------- */
  function showProducts(category, shouldScroll) {
    var products = SheModa.productsOf(category.slug);

    titleEl.textContent = category.name;
    countEl.textContent = products.length
      ? SheModa.piecesLabel(products.length) + ' في هذا القسم'
      : 'سيتم إضافة قطع هذا القسم قريبًا';

    productGrid.innerHTML = products
      .map(function (product, index) {
        return SheModa.productCard(product, index);
      })
      .join('');

    renderChips(category.slug);

    categoriesView.classList.add('hidden');
    productsView.classList.remove('hidden');
    document.title = category.name + ' | She Moda';

    /* إظهار الكروت بحركة الظهور التدريجي */
    SheModa.revealWithin(productsView);

    if (shouldScroll) {
      productsView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* -------------------------------------------------------------------------
     قراءة الرابط وتحديد أي حالة تُعرض
     ------------------------------------------------------------------------- */
  function render(shouldScroll) {
    var slug = decodeURIComponent(window.location.hash.replace('#', ''));
    var category = slug ? SheModa.findCategory(slug) : null;

    if (category) {
      showProducts(category, shouldScroll);
    } else {
      showCategories();
    }
  }

  /* تغيّر الرابط عند الضغط على أي كرت قسم أو زر رجوع المتصفح */
  window.addEventListener('hashchange', function () {
    render(true);
  });

  /* زر «العودة للأقسام» — يفرّغ الـ hash فيعود العرض للحالة الأولى */
  backBtn.addEventListener('click', function () {
    window.location.hash = '';
    categoriesView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* أول تحميل: لا نمرّر الصفحة تلقائيًا حتى لا تقفز عند الفتح */
  render(false);
};
