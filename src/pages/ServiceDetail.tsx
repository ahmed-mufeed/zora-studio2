// استيراد أدوات التوجيه واستخراج المعاملات من React Router
import { Link, useParams } from "react-router-dom";
// استيراد الأيقونات المساعدة من مكتبة Lucide
import { ArrowLeft, CheckCircle2, ClipboardList, MoveRight, PauseCircle } from "lucide-react";
// استيراد مكون خلفية البرق الجمالية
import Lightning from "../components/Lightning";
// استيراد مكونات الشارة، زر الرابط، وحركات الظهور
import { Chip, CtaA, Reveal } from "../components/ui";
// استيراد دوال المتجر العام وتنسيق الأسعار وروابط الواتساب
import { fmtPrice, useSite, waLink } from "../lib/store";

// خريطة لربط معرّف كل خدمة بفئة الأعمال المقابلة لها في معرض المشاريع
const SERVICE_TO_CATEGORY: Record<string, string> = {
  social: "social",
  branding: "brand",
  video: "video",
  web: "web",
  ads: "ads",
  content: "brand",
};

export default function ServiceDetail() {
  // استخراج معرّف الخدمة من رابط الصفحة
  const { id } = useParams();
  // جلب بيانات الموقع من المتجر العام
  const { state } = useSite();
  
  // البحث عن الخدمة المطلوبة والتحقق من أنها غير مخفية
  const service = state.services.find((s) => s.id === id && !s.hidden);

  // =========================================================
  // شاشة الخطأ: تظهر إذا كانت الخدمة غير موجودة أو تم إخفاؤها
  // =========================================================
  if (!service) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-5">
        <div className="text-center">
          <h1 className="text-3xl font-black text-paper">الخدمة غير موجودة</h1>
          <p className="mt-3 text-sm font-semibold text-paper/50">ربما تم حذفها أو إخفاؤها مؤقتًا.</p>
          <Link to="/services" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-neon">
            <MoveRight className="h-4 w-4" /> العودة إلى الخدمات
          </Link>
        </div>
      </main>
    );
  }

  // تصفية وجلب أول 3 مشاريع سابقة تنتمي لنفس فئة هذه الخدمة
  const related = state.portfolio.filter((w) => w.categoryId === SERVICE_TO_CATEGORY[service.id]).slice(0, 3);
  // فحص حالة توفر الخدمة (متاحة أم متوقفة مؤقتاً)
  const available = service.status === "available";

  return (
    <main className="bg-ink">
      
      {/* =========================================================
          قسم الهيدر: تفاصيل الخدمة، المزايا، الأسعار، وأزرار الطلب
          ========================================================= */}
      <section className="relative overflow-hidden pb-24 pt-36">
        <Lightning />
        
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2">
          
          {/* العمود الأول: النصوص، المزايا، والأسعار */}
          <div>
            {/* زر العودة لكافة الخدمات */}
            <Link to="/services" className="inline-flex items-center gap-2 text-xs font-bold text-paper/45 transition-colors hover:text-neon">
              <MoveRight className="h-4 w-4" /> كل الخدمات
            </Link>

            {/* شارات الخدمة وحالة التوفر */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Chip>خدمة زورا</Chip>
              {!available && (
                <span className="chamfer-sm inline-flex items-center gap-1.5 border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-extrabold text-paper/60">
                  <PauseCircle className="h-3.5 w-3.5" /> غير متاحة مؤقتًا
                </span>
              )}
            </div>

            {/* عنوان الخدمة الرئيسي */}
            <h1 className="mt-5 text-4xl font-black leading-[1.2] text-paper md:text-5xl md:leading-[1.15]">
              {service.title}
            </h1>

            {/* فقرة الوصف الأولى أو النبذة المختصرة */}
            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-paper/60 md:text-lg md:leading-9">
              {service.full[0] ?? service.short}
            </p>

            {/* باقي فقرات الوصف الكامل للخدمة */}
            {service.full.slice(1).map((p, i) => (
              <p key={i} className="mt-4 max-w-xl text-sm font-semibold leading-8 text-paper/50">
                {p}
              </p>
            ))}

            {/* قائمة بنود ومزايا الباقة */}
            {service.features.length > 0 && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm font-bold text-paper/75">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-neon" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {/* صندوق عرض السعر المبدئي ووحدة الحساب */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <div className="chamfer-sm border border-white/12 bg-white/[.04] px-6 py-4">
                <span className="block text-[11px] font-bold text-paper/45">يبدأ السعر من</span>
                <span className="mt-0.5 block font-latin text-3xl font-bold text-neon">
                  {fmtPrice(service.price)}
                  <span className="mr-2 font-sans text-xs font-extrabold text-paper/55">
                    ر.س / {service.priceUnit}
                  </span>
                </span>
              </div>
            </div>

            {/* أزرار الإجراءات: طلب البريف + الاستفسار عبر واتساب */}
            <div className="mt-8 flex flex-wrap gap-4">
              {available ? (
                /* زر بدء تعبئة البريف في حال توفر الخدمة */
                <Link
                  to={`/services/${service.id}/brief`}
                  className="chamfer-sm glow-neon inline-flex items-center gap-2 bg-neon px-7 py-3.5 text-sm font-extrabold text-ink transition-transform duration-300 hover:-translate-y-1"
                >
                  <ClipboardList className="h-4 w-4" strokeWidth={2.5} />
                  اطلب هذه الخدمة — املأ البريف
                </Link>
              ) : (
                /* زر معطل في حال كانت الخدمة متوقفة مؤقتاً */
                <span className="chamfer-sm inline-flex cursor-not-allowed items-center gap-2 border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-extrabold text-paper/40">
                  <PauseCircle className="h-4 w-4" />
                  متوقفة مؤقتًا — لا يمكن الطلب حاليًا
                </span>
              )}

              {/* زر الاستفسار السريع عبر واتساب */}
              <CtaA
                variant="ghost"
                href={waLink(state.settings.whatsapp, `مرحبًا! لدي استفسار عن خدمة «${service.title}».`)}
              >
                استفسر واتساب
              </CtaA>
            </div>
          </div>

          {/* العمود الثاني: صورة الخدمة الكبيرة والشارة السعرية */}
          <Reveal className="relative">
            <div className="chamfer relative overflow-hidden border border-white/10">
              <img
                src={service.image}
                alt={service.title}
                className={`h-[420px] w-full object-cover md:h-[480px] ${available ? "" : "grayscale"}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              
              {/* شارة السعر المثبتة فوق الصورة */}
              <span className="chamfer-sm absolute bottom-5 right-5 bg-neon px-4 py-2 font-latin text-lg font-bold text-ink">
                {fmtPrice(service.price)}
                <span className="mr-1 font-sans text-[10px] font-extrabold">ر.س / {service.priceUnit}</span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          قسم الأعمال ذات الصلة من المعرض
          ========================================================= */}
      {related.length > 0 && (
        <section className="slant-r bg-paper pb-28 pt-24 text-ink md:pt-28">
          <div className="mx-auto max-w-7xl px-5">
            <Reveal>
              <h2 className="text-2xl font-black md:text-3xl">أعمال ذات صلة من المعرض</h2>
            </Reveal>

            {/* شبكة الأعمال المرتبطة بالخدمة */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((w, i) => (
                <Reveal key={w.id} delay={0.06 * i}>
                  <Link to="/portfolio" className="card-lift group block overflow-hidden rounded-2xl border border-black/5 bg-white">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={w.image}
                        alt={w.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-[15px] font-black">{w.title}</h3>
                      <p className="mt-1 text-xs font-bold text-ink/45">{w.client}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            {/* شريط الدعوة لاتخاذ إجراء السفلي (يظهر فقط إذا كانت الخدمة متاحة) */}
            {available && (
              <Reveal className="mt-14">
                <div className="chamfer relative overflow-hidden bg-royal p-8 text-white md:p-10">
                  <Lightning variant="royal" />
                  
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-black md:text-2xl">جاهز تبدأ مشروعك؟</h3>
                      <p className="mt-1.5 text-sm font-semibold text-paper/70">
                        املأ بريف «{service.title}» في دقيقتين وصدّره PDF فورًا.
                      </p>
                    </div>

                    <Link
                      to={`/services/${service.id}/brief`}
                      className="chamfer-sm glow-neon inline-flex items-center gap-2 bg-neon px-7 py-3.5 text-sm font-extrabold text-ink transition-transform hover:-translate-y-1"
                    >
                      ابدأ البريف الآن <ArrowLeft className="h-4 w-4" strokeWidth={2.75} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}
    </main>
  );
}