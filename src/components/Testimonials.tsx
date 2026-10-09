import { useEffect, useState } from "react";
// استيراد أدوات التحريك والتأثيرات الانتقالية من Framer Motion
import { AnimatePresence, motion } from "framer-motion";
// استيراد أيقونات التنقل والاقتباس من مكتبة Lucide
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
// استيراد مكون عرض النجوم
import { Stars } from "./ui";
// استيراد خطاف حالة الموقع لجلب بيانات الآراء
import { useSite } from "../lib/store";

export default function Testimonials() {
  // جلب بيانات الموقع من المتجر العام
  const { state } = useSite();
  // تصفية الآراء وجلب الآراء المحددة كـ "ظاهرة" فقط
  const list = state.testimonials.filter((t) => t.visible);
  // مؤشر الرأي النشط حالياً في السلايدر
  const [idx, setIdx] = useState(0);

  // إعادة ضبط المؤشر في حال تم حذف آراء أو تغير طول القائمة لتجنب أخطاء الفهرسة
  useEffect(() => {
    setIdx((i) => (list.length === 0 ? 0 : i % Math.max(1, list.length)));
  }, [list.length]);

  // مؤقت التبديل التلقائي: ينتقل للرأي التالي كل 6.5 ثوانٍ (إذا كان هناك أكثر من رأي)
  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % list.length), 6500);
    return () => clearInterval(id); // تنظيف المؤقت عند تغيير الرأي أو تفكيك المكون
  }, [idx, list.length]);

  // إخفاء المكون كلياً إذا لم تكن هناك أي آراء معتمدة
  if (list.length === 0) return null;
  // تحديد عنصر الرأي الحالي المعروض
  const t = list[idx % list.length];

  return (
    <div className="relative mx-auto max-w-3xl text-center">
      {/* أيقونة الاقتباس المركزية في رأس القسم */}
      <span className="chamfer-sm mx-auto grid h-14 w-14 place-items-center bg-royal text-neon glow-royal">
        <Quote className="h-6 w-6 fill-neon" />
      </span>

      {/* =========================================================
          منطقة عرض نص الرأي مع تأثيرات الحركة والضبابية
          ========================================================= */}
      <div className="mt-8 min-h-[220px] md:min-h-[190px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -26, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* نص الشهادة أو التقييم */}
            <blockquote className="text-xl font-bold leading-[2] text-ink md:text-2xl md:leading-[2]">
              "{t.text}"
            </blockquote>

            {/* تفاصيل العميل: النجوم، الشارة الرمزية، الاسم، والمنصب */}
            <figcaption className="mt-6 flex flex-col items-center gap-3">
              {/* عرض النجوم بناءً على التقييم */}
              <Stars rating={t.rating} />
              
              <div className="flex items-center gap-3">
                {/* شارة دائرية بالحرف الأول من اسم العميل */}
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-royal text-lg font-black text-white">
                  {t.name.trim().charAt(0)}
                </span>
                <span className="text-right">
                  <span className="block text-sm font-black text-ink">{t.name}</span>
                  <span className="block text-xs font-bold text-ink/50">
                    {t.role} — {t.company}
                  </span>
                </span>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* =========================================================
          أزرار التحكم والتنقل اليدوي (السابق، التالي، النقاط)
          ========================================================= */}
      <div className="mt-10 flex items-center justify-center gap-4">
        {/* زر الانتقال للرأي السابق */}
        <button
          onClick={() => setIdx((i) => (i - 1 + list.length) % list.length)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-ink/15 text-ink transition-all hover:border-royal hover:bg-royal hover:text-white"
          aria-label="السابق"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* نقاط المؤشرات (Bullets) مع تمييز وتوسيع النقطة النشطة */}
        <div className="flex items-center gap-2">
          {list.map((x, i) => (
            <button
              key={x.id}
              onClick={() => setIdx(i)}
              aria-label={`رأي ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-400 ${
                i === idx % list.length ? "w-9 bg-royal" : "w-2 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>

        {/* زر الانتقال للرأي التالي */}
        <button
          onClick={() => setIdx((i) => (i + 1) % list.length)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-ink/15 text-ink transition-all hover:border-royal hover:bg-royal hover:text-white"
          aria-label="التالي"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}