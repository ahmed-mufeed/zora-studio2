import type { CSSProperties } from "react";
// استيراد خطاف حالة الموقع العامة لجلب بيانات شركاء النجاح
import { useSite } from "../lib/store";

// المكوّن الرئيسي لشريط شركاء النجاح المتحرك
export default function Partners({ className = "" }: { className?: string }) {
  // استخراج قائمة الشركاء من المتجر العام
  const { state } = useSite();
  const items = state.partners;

  // إخفاء المكون بالكامل في حال عدم وجود أي شريك مسجل
  if (items.length === 0) return null;

  // تحديد عدد النسخ المطلوبة للمصفوفة لضمان استمرار حركة الشريط دون انقطاع
  // إذا كان العدد 6 فأكثر نكتفي بنسختين، وإذا كان أقل نكررها 4 مرات لملء الشاشة
  const copies = items.length >= 6 ? 2 : 4;
  
  // دمج النسخ المكررة في مصفوفة واحدة للحركة اللانهائية
  const loop = Array.from({ length: copies }).flatMap(() => items);

  return (
    // الحاوية الأساسية للشريط مع تحديد اتجاه الحركة من اليسار لليمين LTR
    <div className={`marquee-root relative ${className}`} dir="ltr">
      
      {/* مسار الحركة: يحتوي على متغير CSS للتحكم في سرعة دوران الشريط بناءً على عدد العناصر */}
      <div
        className="marquee-track gap-4 px-2 py-1"
        style={{ "--marquee-t": `${Math.max(18, items.length * 4)}s` } as CSSProperties}
      >
        {loop.map((p, i) => (
          // بطاقة كل شريك مع تأثيرات التعتيم والتحويم
          <div
            key={`${p.id}-${i}`}
            className="chamfer-sm flex shrink-0 items-center gap-3 border border-white/10 bg-white/[.045] px-7 py-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-neon/40"
          >
            {/* عرض شعار الشريك بأبعاد متناسقة، أو شارة الحرف الأول في حال عدم رفع شعار */}
            {p.logo ? (
              <img
                src={p.logo}
                alt={p.name}
                className="h-9 w-auto max-w-[120px] object-contain"
              />
            ) : (
              <span className="chamfer-sm grid h-9 w-9 place-items-center bg-neon/15 text-base font-black text-neon">
                {p.name.trim().charAt(0)}
              </span>
            )}
            
            {/* اسم الشريك مع منع التفاف النص لسطر جديد */}
            <span className="whitespace-nowrap text-lg font-extrabold text-paper/85">{p.name}</span>
          </div>
        ))}
      </div>

      {/* تدرج لوني جانبي أيسر لتلاشي العناصر بنعومة عند طرف الشاشة */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      
      {/* تدرج لوني جانبي أيمن لتلاشي العناصر بنعومة عند طرف الشاشة */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}