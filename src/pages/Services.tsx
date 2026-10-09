// استيراد أيقونة الاستفسار من مكتبة Lucide (تمت إزالة أيقونة البرق Zap بنجاح)
import { MessageCircleQuestion } from "lucide-react";
// استيراد مكون خلفية البرق الجمالية
import Lightning from "../components/Lightning";
// استيراد مكوّن بطاقة الخدمة الموحد
import ServiceCard from "../components/ServiceCard";
// استيراد مكونات الشارة وزر الرابط الخارجي
import { Chip, CtaA } from "../components/ui";
// استيراد خطاف حالة الموقع ودالة توليد رابط محادثة الواتساب
import { useSite, waLink } from "../lib/store";

export default function Services() {
  // جلب بيانات الموقع من المتجر العام
  const { state } = useSite();
  // تصفية الخدمات وجلب الخدمات غير المخفية فقط
  const services = state.services.filter((s) => !s.hidden);

  return (
    <main className="bg-ink">
      
      {/* =========================================================
          قسم الهيدر: عنوان صفحة الخدمات والوصف الترويجي
          ========================================================= */}
      <section className="relative overflow-hidden pb-24 pt-40">
        <Lightning />
        
        <div className="relative z-10 mx-auto max-w-7xl px-5 text-center">
          <Chip>خدماتنا</Chip>
          
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-black leading-[1.2] text-paper md:text-6xl md:leading-[1.15]">
            خدماتٌ تصنع <span className="text-neon">الفرق</span>
          </h1>
          
          <p className="mx-auto mt-5 max-w-xl text-base font-semibold leading-8 text-paper/55 md:text-lg">
            اختر خدمتك، أجب على بريف ذكي مصمّم خصيصًا لها، وصدّره PDF جاهزًا للإرسال — بهذه البساطة.
          </p>
        </div>
      </section>

      {/* =========================================================
          قسم شبكة الخدمات وصندوق الاستفسار عن خدمة مخصصة
          ========================================================= */}
      <section className="slant-r bg-paper pb-28 pt-24 text-ink md:pt-28">
        <div className="mx-auto max-w-7xl px-5">
          
          {/* عرض شبكة الخدمات أو رسالة الحالة الفارغة */}
          {services.length === 0 ? (
            <p className="py-24 text-center text-lg font-bold text-ink/40">لا توجد خدمات متاحة حاليًا.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          )}

          {/* =========================================================
              صندوق المساعدة: لطلب حلول مخصصة غير مدرجة بالقائمة
              ========================================================= */}
          <div className="chamfer relative mt-20 overflow-hidden bg-ink p-8 text-paper md:p-12">
            {/* دائرة توهج إضاءة خلفية ضبابية */}
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-royal/50 blur-3xl" />
            
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
              
              {/* تفاصيل الاستفسار والأيقونة */}
              <div className="flex items-center gap-4">
                <span className="chamfer-sm grid h-12 w-12 shrink-0 place-items-center bg-royal text-neon">
                  <MessageCircleQuestion className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-black">لم تجد ما تبحث عنه؟</h3>
                  <p className="mt-1 text-sm font-semibold text-paper/55">
                    نصمّم حلولًا مخصصة — أخبرنا بفكرتك وسنقترح الخطة الأنسب.
                  </p>
                </div>
              </div>

              {/* زر التواصل عبر واتساب لطلب خدمة مخصصة (تمت إزالة أيقونة البرق من داخله) */}
              <CtaA href={waLink(state.settings.whatsapp, "مرحبًا! أبحث عن خدمة مخصصة غير موجودة في القائمة.")}>
                اسأل عن خدمة مخصصة
              </CtaA>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}