// استيراد خطاف معرفة المسار الحالي للصفحة من React Router
import { useLocation } from "react-router-dom";
// استيراد مكون أيقونة التواصل لرسم شعار الواتساب بدقة
import { SocialIcon } from "./ui";
// استيراد خطاف حالة الموقع ودالة توليد رابط محادثة الواتساب
import { useSite, waLink } from "../lib/store";

export default function WhatsAppFloat() {
  // جلب بيانات وإعدادات الموقع العامة من المتجر
  const { state } = useSite();
  // معرفة رابط الصفحة المفتوحة حالياً
  const loc = useLocation();

  // إخفاء الزر العائم تماماً إذا كان المستخدم داخل صفحات لوحة التحكم (/admin)
  if (loc.pathname.startsWith("/admin")) return null;

  return (
    // الحاوية الثابتة للزر العائم في أسفل يسار الشاشة
    <a
      href={waLink(state.settings.whatsapp, "مرحبًا زورا استوديو! أريد الاستفسار عن خدماتكم.")}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      className="group fixed bottom-6 left-6 z-40 flex items-center gap-3"
    >
      {/* التلميح النصي: يظهر ويتحرك بنعومة عند تحويم الماوس فوق الزر */}
      <span className="pointer-events-none translate-x-2 rounded-xl border border-white/10 bg-ink px-3 py-2 text-xs font-bold text-paper opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        تحدث معنا الآن
      </span>

      {/* الحاوية الدائرية المشعة للأيقونة بلون نيون مميز وتأثير نبض متكرر */}
      <span className="pulse-glow grid h-14 w-14 place-items-center rounded-2xl bg-neon text-ink shadow-2xl transition-transform duration-300 group-hover:scale-105">
        <SocialIcon name="whatsapp" className="h-7 w-7" />
      </span>
    </a>
  );
}