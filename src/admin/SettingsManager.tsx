import { useState } from "react";
// استيراد الأيقونات التوضيحية من مكتبة Lucide لأقسام الإعدادات وأزرار الإجراءات
import { Info, Mail, Phone, RotateCcw, Share2 } from "lucide-react";
// استيراد خطافي الحالة العامة للموقع (تحديث الإعدادات وإعادة التعيين الشامل) والتنبيهات
import { useSite, useToast } from "../lib/store";
// استيراد مسميات الأقسام وأنواعها البرمجية
import { SECTION_LABELS, type SectionKey } from "../lib/types";
// استيراد المكونات المشتركة: أيقونات التواصل ومفتاح التبديل
import { SocialIcon, Toggle } from "../components/ui";
// استيراد عناصر واجهة لوحة التحكم (البطاقات، الحقول، رأس الصفحة)
import { Card, Field, PageHead } from "./ui";

export default function SettingsManager() {
  // جلب بيانات الموقع، دالة تحديث الإعدادات الجزئية، ودالة استعادة الحالة الافتراضية
  const { state, updateSettings, resetAll } = useSite();
  // خطاف لعرض رسائل التأكيد والإشعارات
  const { toast } = useToast();
  
  // حالة أمان لزر إعادة التعيين (تتطلب النقر المزدوج للتأكيد لتفادي الحذف الخاطئ)
  const [armed, setArmed] = useState(false);
  
  // اختصار للوصول إلى كائن الإعدادات الحالي
  const s = state.settings;

  return (
    <div className="max-w-3xl">
      {/* رأس الصفحة التعريفي */}
      <PageHead title="الإعدادات العامة" sub="بيانات التواصل، الروابط الاجتماعية، وإظهار أقسام الموقع." />

      <div className="space-y-6">
        {/* =========================================================
            قسم أرقام التواصل والبريد الإلكتروني وواتساب
            ========================================================= */}
        <Card>
          <h2 className="mb-1 flex items-center gap-2 text-lg font-black">
            <Phone className="h-5 w-5 text-royal" /> أرقام التواصل وواتساب
          </h2>
          <p className="mb-5 text-xs font-bold text-ink/40">
            رقم الواتساب يُستخدم في: الزر العائم، الفوتر، ورسالة تأكيد البريف — بالصيغة الدولية بدون (+).
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* حقل رقم الواتساب الدولي */}
            <Field label="رقم الواتساب (دولي)">
              <input className="inp font-latin" dir="ltr" value={s.whatsapp} onChange={(e) => updateSettings({ whatsapp: e.target.value })} placeholder="9665XXXXXXXX" />
            </Field>
            
            {/* حقل البريد الإلكتروني الرسمي */}
            <Field label="البريد الإلكتروني">
              <input className="inp font-latin" dir="ltr" value={s.email} onChange={(e) => updateSettings({ email: e.target.value })} />
            </Field>
            
            {/* حقل رقم الهاتف الأول */}
            <Field label="الهاتف المعروض ١">
              <input className="inp font-latin" dir="ltr" value={s.phone} onChange={(e) => updateSettings({ phone: e.target.value })} placeholder="+966 55 000 0000" />
            </Field>
            
            {/* حقل رقم الهاتف الثاني (الاحتياطي) */}
            <Field label="الهاتف المعروض ٢">
              <input className="inp font-latin" dir="ltr" value={s.phone2} onChange={(e) => updateSettings({ phone2: e.target.value })} placeholder="+966 11 000 0000" />
            </Field>
          </div>
        </Card>

        {/* =========================================================
            قسم روابط حسابات التواصل الاجتماعي
            ========================================================= */}
        <Card>
          <h2 className="mb-1 flex items-center gap-2 text-lg font-black">
            <Share2 className="h-5 w-5 text-royal" /> روابط التواصل الاجتماعي
          </h2>
          <p className="mb-5 text-xs font-bold text-ink/40">اترك الحقل فارغًا لإخفاء الأيقونة من الفوتر.</p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                { key: "instagram", label: "انستقرام" },
                { key: "tiktok", label: "تيك توك" },
                { key: "x", label: "إكس (تويتر)" },
                { key: "linkedin", label: "لينكدإن" },
              ] as const
            ).map((f) => (
              <Field key={f.key} label={f.label}>
                <div className="relative">
                  {/* أيقونة المنصة التعبيرية تظهر كخلفية داخل حقل الإدخال */}
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/35">
                    <SocialIcon name={f.key} className="h-4 w-4" />
                  </span>
                  <input
                    className="inp font-latin !pr-11"
                    dir="ltr"
                    value={s[f.key]}
                    onChange={(e) => updateSettings({ [f.key]: e.target.value } as Partial<typeof s>)}
                    placeholder="https://…"
                  />
                </div>
              </Field>
            ))}
          </div>
        </Card>

        {/* =========================================================
            قسم التحكم في إظهار وإخفاء أقسام الصفحة الرئيسية
            ========================================================= */}
        <Card>
          <h2 className="mb-1 text-lg font-black">إظهار أقسام الصفحة الرئيسية</h2>
          <p className="mb-5 text-xs font-bold text-ink/40">تحكّم فوري في ما يظهر للزوّار.</p>
          
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
                <span className="text-sm font-extrabold text-ink/65">{SECTION_LABELS[key]}</span>
                <Toggle
                  checked={s.sections[key]}
                  onChange={(v) => updateSettings({ sections: { ...s.sections, [key]: v } })}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* =========================================================
            بطاقة توضيحية حول بيئة العمل التجريبية والتخزين المحلي
            ========================================================= */}
        <Card className="!border-royal/15 !bg-royal/[.03]">
          <h2 className="flex items-center gap-2 text-base font-black">
            <Info className="h-5 w-5 text-royal" /> عن هذا النموذج
          </h2>
          <p className="mt-2 text-sm font-semibold leading-7 text-ink/60">
            زورا استوديو — نموذج تجريبي تفاعلي بالكامل: لا خادم، لا قاعدة بيانات، ولا تسجيل دخول حقيقي. تُحفظ
            تعديلاتك في التخزين المحلي لهذا المتصفح لإعطاء تجربة CMS واقعية أثناء العرض التقديمي.
          </p>
        </Card>

        {/* =========================================================
            منطقة الخطر: استعادة الضبط الافتراضي ومسح كافة التعديلات
            ========================================================= */}
        <Card className="!border-rose-200">
          <h2 className="flex items-center gap-2 text-base font-black text-rose-600">
            <Mail className="h-5 w-5" /> إعادة تعيين المحتوى
          </h2>
          <p className="mt-2 text-sm font-semibold leading-7 text-ink/55">
            يسترجع كل المحتوى الافتراضي (الخدمات، الأعمال، الآراء، الإعدادات…) ويحذف كل تعديلاتك.
          </p>
          
          {/* زر إعادة التعيين المحمي بآلية النقر المزدوج في غضون 3 ثوانٍ */}
          <button
            onClick={() => {
              if (armed) {
                resetAll();
                setArmed(false);
                toast("تمت إعادة تعيين كل المحتوى للوضع الافتراضي");
              } else {
                setArmed(true);
                // إلغاء التأهب تلقائياً بعد مرور 3 ثوانٍ إذا لم يتم النقر للتأكيد
                setTimeout(() => setArmed(false), 3000);
              }
            }}
            className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-extrabold transition-all ${
              armed ? "border-rose-500 bg-rose-500 text-white" : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            {armed ? "اضغط مرة أخرى للتأكيد" : "إعادة تعيين كل شيء"}
          </button>
        </Card>
      </div>
    </div>
  );
}