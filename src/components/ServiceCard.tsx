// استيراد أداة الروابط الداخلية من React Router
import { Link } from "react-router-dom";
// استيراد الأيقونات المستخدمة في البطاقة (سهم التفاصيل + أيقونة الإيقاف المؤقت)
import { ArrowLeft, PauseCircle } from "lucide-react";
// استيراد دالة تنسيق الأسعار
import { fmtPrice } from "../lib/store";
// استيراد مكوّن الظهور التدريجي عند التمرير
import { Reveal } from "./ui";
import type { Service } from "../lib/types";

// مكوّن بطاقة الخدمة: يستقبل بيانات الخدمة وترتيبها لحساب تأخير حركة الظهور
export default function ServiceCard({ service: s, index = 0 }: { service: Service; index?: number }) {
  return (
    // غلاف حركة الظهور مع تأخير متدرج حسب ترتيب البطاقة
    <Reveal delay={0.07 * index} className="h-full">
      {/* البطاقة بالكامل رابط ينقل إلى صفحة تفاصيل الخدمة */}
      <Link
        to={`/services/${s.id}`}
        className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white text-ink shadow-sm hover:shadow-2xl hover:shadow-royal/15"
      >
        {/* =========================================================
            القسم العلوي: صورة الخدمة مع الشارات
            ========================================================= */}
        <div className="relative h-52 shrink-0 overflow-hidden">
          {/* صورة الخدمة: تتكبر عند التحويم وتصبح رمادية إذا كانت الخدمة متوقفة */}
          <img
            src={s.image}
            alt={s.title}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110 ${
              s.status === "unavailable" ? "grayscale" : ""
            }`}
          />

          {/* طبقة تدرج داكن أسفل الصورة لإبراز شارة السعر */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />

          {/* شارة "غير متاحة مؤقتًا" تظهر فقط عند إيقاف الخدمة */}
          {s.status === "unavailable" && (
            <span className="chamfer-sm absolute right-3 top-3 inline-flex items-center gap-1.5 bg-ink/85 px-3 py-1.5 text-[11px] font-extrabold text-paper backdrop-blur">
              <PauseCircle className="h-3.5 w-3.5" />
              غير متاحة مؤقتًا
            </span>
          )}

          {/* شارة السعر: الرقم المنسق + العملة + وحدة السعر */}
          <span className="chamfer-sm absolute bottom-3 right-3 bg-neon px-3 py-1.5 text-[15px] font-black text-ink">
            <span className="font-latin">{fmtPrice(s.price)}</span>{" "}
            <span className="text-[10px] font-extrabold opacity-75">ر.س / {s.priceUnit}</span>
          </span>
        </div>

        {/* =========================================================
            القسم السفلي: اسم الخدمة والوصف ورابط التفاصيل
            ========================================================= */}
        <div className="flex flex-1 flex-col p-5">
          {/* اسم الخدمة: يتحول للون الملكي عند التحويم */}
          <h3 className="text-lg font-black transition-colors duration-300 group-hover:text-royal">{s.title}</h3>

          {/* الوصف المختصر: يتمدد لملء المساحة حتى تتساوى البطاقات في الارتفاع */}
          <p className="mt-2 flex-1 text-sm font-semibold leading-7 text-ink/55">{s.short}</p>

          {/* رابط التفاصيل مع سهم يتحرك لليسار عند التحويم */}
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-royal">
            التفاصيل والطلب
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}