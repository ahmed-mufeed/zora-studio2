// استيراد دوال معالجة المسارات من مكتبة Node.js القياسية
import path from "path";
// استيراد دالة تحويل مسارات الـ URL إلى مسارات ملفات محلية تدعم نظام ESM
import { fileURLToPath } from "url";
// استيراد إضافة معالجة وتكامل Tailwind CSS (الإصدار 4) مع Vite
import tailwindcss from "@tailwindcss/vite";
// استيراد إضافة دعم React والتحديث اللحظي للكود (HMR)
import react from "@vitejs/plugin-react";
// استيراد دالة تعريف إعدادات Vite مع دعم الإكمال التلقائي لـ TypeScript
import { defineConfig } from "vite";
// استيراد إضافة دمج كامل مخرجات المشروع في ملف HTML واحد مستقل
import { viteSingleFile } from "vite-plugin-singlefile";

// استخراج المسار الكامل للملف الحالي والمجلد الجذري لضمان التوافق مع نظام ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================================================
// تصدير إعدادات أداة البناء Vite
// ==========================================================================
// https://vite.dev/config/
export default defineConfig({
  /* مصفوفة الإضافات النشطة لمعالجة الأكواد والأنماط وبناء المشروع */
  plugins: [
    react(),          // معالجة ملفات React وتحديث الواجهات فورياً
    tailwindcss(),    // معالجة وتجميع فئات وأكواد Tailwind CSS
    viteSingleFile(), // تجميع الناتج النهائي بالكامل في ملف HTML واحد مستقل
  ],

  /* إعدادات استكشاف المسارات والأسماء المستعارة */
  resolve: {
    alias: {
      // تعيين الرمز @ ليشير مباشرة إلى مجلد الأكواد src
      "@": path.resolve(__dirname, "src"),
    },
  },
});