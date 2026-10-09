// استيراد أدوات التحريك والتأثيرات الانتقالية من مكتبة Framer Motion
import { motion } from "framer-motion";
// استيراد أداة التوجيه والانتقال بين الصفحات من React Router
import { useNavigate } from "react-router-dom";
// استيراد الأيقونات من مكتبة Lucide (تمت إزالة أيقونة البرق Zap بنجاح)
import { ArrowLeft, Eye, Info, LayoutDashboard } from "lucide-react";
// استيراد مكونات الشعار وخلفية البرق الجمالية
import Logo from "../components/Logo";
import Lightning from "../components/Lightning";
// استيراد بيانات الصور الافتراضية
import { IMG } from "../lib/data";
// استيراد خطاف تحديد الدور وإدارة الصلاحيات
import { useRole } from "../lib/store";
import type { Role } from "../lib/store";

export default function Gate() {
  // جلب دالة اختيار الدور من المتجر العام
  const { choose } = useRole();
  // خطاف الانتقال البرمجي بين الصفحات
  const navigate = useNavigate();

  // دالة تسجيل الدور وتوجيه المستخدم للصفحة المناسبة
  const enter = (role: Exclude<Role, null>) => {
    choose(role); // حفظ الدور في الذاكرة
    navigate(role === "admin" ? "/admin" : "/"); // التوجيه للوحة التحكم أو للموقع العام
  };

  return (
    // الحاوية الرئيسية لكامل الشاشة مع خلفية داكنة وتأثيرات بصرية
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5 py-16">
      
      {/* صورة الخلفية العامة مع تدرج لوني داكن */}
      <img src={IMG.heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/80 to-ink" />
      
      {/* خلفية الصواعق والخطوط الجمالية التفاعلية */}
      <Lightning />

      {/* البطاقة الترحيبية المركزية مع حركة دخول تدريجية */}
      <motion.div
        initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-3xl text-center"
      >
        {/* شارة أيقونة الرأس المشطوفة */}
        <div className="mb-8 flex justify-center">
          <span className="chamfer grid h-20 w-20 place-items-center bg-royal glow-royal">
          </span>
        </div>

        {/* شعار الموقع الرسمي */}
        <div className="mb-3 flex justify-center">
          <Logo />
        </div>

        {/* العنوان الترحيبي والفقرة التوضيحية */}
        <h1 className="text-3xl font-black leading-snug text-paper md:text-4xl">
          مرحبًا بك في استوديو الإبداع
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-paper/55 md:text-base">
          اختر طريقة الدخول لمتابعة التجربة — النموذج التجريبي كامل وتفاعلي بالكامل.
        </p>

        {/* =========================================================
            شبكة بطاقتي الاختيار: الدخول كزائر أو كمسؤول
            ========================================================= */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          
          {/* البطاقة الأولى: الدخول كزائر لاستكشاف الموقع */}
          <button
            onClick={() => enter("visitor")}
            className="card-lift group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-7 text-right backdrop-blur-sm hover:border-neon/50"
          >
            {/* أيقونة العين المضيئة بلون نيون */}
            <span className="chamfer-sm mb-5 grid h-12 w-12 place-items-center bg-neon text-ink">
              <Eye className="h-6 w-6" />
            </span>
            <span className="block text-xl font-black text-paper">متابعة كزائر</span>
            <span className="mt-2 block text-sm font-semibold leading-6 text-paper/50">
              استكشف الموقع، الأعمال، الخدمات، وجرّب نموذج البريف التفاعلي.
            </span>
            {/* رابط توجيهي يظهر بنعومة عند التحويم */}
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-neon opacity-0 transition-all duration-300 group-hover:opacity-100">
              دخول الموقع <ArrowLeft className="h-4 w-4" />
            </span>
          </button>

          {/* البطاقة الثانية: الدخول كمسؤول لتجربة لوحة التحكم */}
          <button
            onClick={() => enter("admin")}
            className="card-lift group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-7 text-right backdrop-blur-sm hover:border-royal-2/70"
          >
            {/* أيقونة لوحة التحكم باللون الملكي */}
            <span className="chamfer-sm mb-5 grid h-12 w-12 place-items-center bg-royal text-paper">
              <LayoutDashboard className="h-6 w-6" />
            </span>
            <span className="block text-xl font-black text-paper">متابعة كمسؤول</span>
            <span className="mt-2 block text-sm font-semibold leading-6 text-paper/50">
              لوحة تحكم كاملة لإدارة المحتوى والخدمات والأعمال ونماذج البريف.
            </span>
            {/* رابط توجيهي يظهر بنعومة عند التحويم */}
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-royal-2 opacity-0 transition-all duration-300 group-hover:text-neon group-hover:opacity-100">
              لوحة التحكم <ArrowLeft className="h-4 w-4" />
            </span>
          </button>
        </div>

        {/* تنبيه يوضح طبيعة المحاكاة التجريبية */}
        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-[11px] font-bold text-paper/40">
          <Info className="h-3.5 w-3.5 shrink-0 text-neon" />
          تسجيل الدخول محاكاة لأغراض العرض التجريبي فقط — لا يتم طلب أو تخزين أي بيانات حقيقية.
        </p>

        {/* تمت إزالة أيقونة البرق الخلفية بنجاح من هنا */}
      </motion.div>
    </div>
  );
}