// استيراد أدوات التوجيه واستخراج المتغيرات من الرابط عبر React Router
import { Link, useParams } from "react-router-dom";
// استيراد أيقونة السهم للرجوع للرئيسية
import { MoveRight } from "lucide-react";
// استيراد مكون خلفية البرق الجمالية
import Lightning from "../components/Lightning";
// استيراد مكونات واجهة المستخدم الموحدة (الشارة، زر الرابط الخارجي، وحركة الظهور)
import { Chip, CtaA, Reveal } from "../components/ui";
// استيراد خطاف حالة الموقع ودالة توليد رابط الواتساب
import { useSite, waLink } from "../lib/store";

export default function CustomPage() {
  // استخراج معرّف الرابط (slug) من الرابط الحالي
  const { slug } = useParams();
  // جلب بيانات الموقع من المتجر العام
  const { state } = useSite();
  
  // البحث عن الصفحة المطلوبة والتحقق من كونها مفعلة ومحددة كـ "ظاهرة"
  const page = state.pages.find((p) => p.slug === slug && p.visible);

  // =========================================================
  // شاشة الخطأ (404): تظهر في حال كانت الصفحة غير موجودة أو مخفية
  // =========================================================
  if (!page) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-5">
        <div className="text-center">
          <h1 className="text-3xl font-black text-paper">الصفحة غير موجودة</h1>
          {/* زر الرجوع إلى الصفحة الرئيسية */}
          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-neon">
            <MoveRight className="h-4 w-4" /> العودة للرئيسية
          </Link>
        </div>
      </main>
    );
  }

  // تقسيم المحتوى النصي إلى مصفوفة فقرات مستقلة بناءً على الفواصل والأسطر الفارغة
  const paragraphs = page.body.split(/\n\s*\n|\n/).filter((p) => p.trim() !== "");

  return (
    <main className="bg-ink">
      
      {/* =========================================================
          قسم الهيدر: عنوان الصفحة والشارة التوضيحية
          ========================================================= */}
      <section className="relative overflow-hidden pb-20 pt-40">
        <Lightning />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <Chip>زورا استوديو</Chip>
          <h1 className="mt-6 text-4xl font-black leading-[1.2] text-paper md:text-5xl">{page.title}</h1>
        </div>
      </section>

      {/* =========================================================
          قسم جسم الصفحة: عرض الفقرات وصندوق التواصل
          ========================================================= */}
      <section className="slant-r bg-paper pb-24 pt-20 text-ink md:pt-24">
        <div className="mx-auto max-w-3xl space-y-6 px-5">
          
          {/* عرض كل فقرة مع حركة ظهور تدريجية خاصة بها */}
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.04 * Math.min(i, 10)}>
              <p className="text-base font-semibold leading-9 text-ink/70 md:text-lg md:leading-10">{p}</p>
            </Reveal>
          ))}

          {/* بطاقة الدعوة للتواصل في نهاية الصفحة */}
          <Reveal>
            <div className="chamfer mt-10 bg-ink p-8 text-center text-paper">
              <h3 className="text-lg font-black">عندك استفسار؟</h3>
              <p className="mt-1.5 text-sm font-semibold text-paper/55">فريقنا جاهز للرد عليك في أي وقت.</p>
              
              {/* زر محادثة واتساب المباشرة مع رسالة مهيأة مسبقاً باسم الصفحة الحالية */}
              <CtaA
                className="mt-5"
                href={waLink(state.settings.whatsapp, `مرحبًا! قرأت صفحة «${page.title}» ولدي استفسار.`)}
              >
                تواصل واتساب
              </CtaA>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}