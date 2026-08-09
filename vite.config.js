/* =============================================================================
   vite.config.js — إعداد خادم التطوير وأمر البناء لموقع She Moda

   المشروع موقع ثابت متعدد الصفحات (5 صفحات HTML) يستخدم Tailwind عبر CDN
   وجافاسكربت عادي مقسّم إلى وحدات مرتّبة داخل مجلد js/.

   ما يفعله هذا الإعداد:
     • يعرّف الصفحات الخمس كنقاط دخول للبناء.
     • base: './' لتعمل كل المسارات نسبيًا — ضروري لنشر الموقع على
       GitHub Pages تحت مسار فرعي مثل username.github.io/she-moda/
     • ينسخ مجلد images/ ومجلد video/ إلى dist **بأسماء ملفاتهما الأصلية
       دون أي تغيير**، لأن أسماء الصور مكتوبة نصًا داخل ملفات البيانات
       (وبعضها بالعربية وفيه مسافات وأقواس) ولا يستطيع أداة البناء
       اكتشافها تلقائيًا.
     • ينسخ مجلد js/ كما هو، لأن سكربتات الموقع سكربتات عادية مرتّبة
       تتشارك متغيرًا عامًا واحدًا، وتحويلها إلى وحدات ESM يكسر ترتيب
       تحميلها. لذلك تُنسخ بلا تغيير وتبقى الصفحات تشير إليها كما هي.
     • يمنع إعادة تسمية الصور بإضافة hash حتى تبقى الأسماء مطابقة تمامًا
       لما هو مكتوب في ملفات البيانات.
   ============================================================================= */

import { defineConfig } from 'vite';
import { readdirSync, copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = process.cwd();

/* امتدادات الملفات التي تُنسخ كما هي إلى مجلد البناء */
const ASSET_PATTERN = /\.(png|jpe?g|gif|webp|svg|mp4|webm)$/i;

/* نسخ مجلد كامل بمحتوياته الفرعية — مع إمكانية قصر النسخ على امتدادات معيّنة */
function copyDir(from, to, pattern) {
  if (!existsSync(to)) mkdirSync(to, { recursive: true });
  let count = 0;
  for (const entry of readdirSync(from)) {
    const src = join(from, entry);
    const dest = join(to, entry);
    if (statSync(src).isDirectory()) count += copyDir(src, dest, pattern);
    else if (!pattern || pattern.test(entry)) {
      copyFileSync(src, dest);
      count++;
    }
  }
  return count;
}

/* ---------------------------------------------------------------------------
   إضافة صغيرة تنسخ مجلد images ومجلد video ومجلد js إلى dist بأسمائها الأصلية
   --------------------------------------------------------------------------- */
function copyOriginalAssets() {
  return {
    name: 'she-moda-copy-assets',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(root, 'dist');
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

      /* مجلدات الوسائط — تُنسخ كما هي بأسماء ملفاتها الأصلية */
      let media = 0;
      for (const dir of ['images', 'video']) {
        const from = resolve(root, dir);
        if (!existsSync(from)) continue;
        media += copyDir(from, resolve(outDir, dir), ASSET_PATTERN);
      }

      const scripts = copyDir(resolve(root, 'js'), resolve(outDir, 'js'));

      console.log(`\n  ✔ نُسخ ${media} ملف صورة/فيديو بأسمائه الأصلية`);
      console.log(`  ✔ نُسخ ${scripts} ملف جافاسكربت داخل مجلد js/`);
    },
  };
}

export default defineConfig({
  /* مسارات نسبية حتى يعمل الموقع من أي مجلد فرعي على GitHub Pages */
  base: './',

  plugins: [copyOriginalAssets()],

  server: {
    host: '127.0.0.1',
    port: 5173,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    /* الصور تبقى في جذر dist بأسمائها الأصلية بدل مجلد assets */
    assetsDir: '',
    /* منع تحويل الصور الصغيرة إلى base64 حتى تبقى ملفات مستقلة */
    assetsInlineLimit: 0,

    /* الصفحات الخمس — كل واحدة نقطة دخول مستقلة */
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        products: resolve(root, 'products.html'),
        customers: resolve(root, 'customers.html'),
        contact: resolve(root, 'contact.html'),
      },
      output: {
        /* الصور التي تكتشفها أداة البناء داخل صفحات HTML تُخرَج إلى مجلد
           images نفسه وبأسمائها كما هي بلا hash، حتى يبقى مسارها في dist
           مطابقًا تمامًا للمسار المكتوب في الصفحات وفي ملفات البيانات */
        assetFileNames: 'images/[name][extname]',
      },
    },
  },
});
