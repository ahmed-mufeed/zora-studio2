import { Plus } from "lucide-react";
// استيراد خطاف الحالة العامة للموقع (قراءة المحتوى وتحديثه)
import { useSite } from "../lib/store";
import type { Feature } from "../lib/types";
// استيراد عناصر واجهة المستخدم المشتركة للوحة التحكم
import { AddBtn, Card, DeleteBtn, Field, PageHead } from "./ui";

// قائمة الأيقونات المتاحة لبطاقات المزايا (المعرّف البرمجي + الاسم العربي الظاهر للمسؤول)
// ملاحظة: الرسم الفعلي لهذه الأيقونات يتم في مكوّن عرض المزايا بواجهة الموقع وليس هنا
const FEATURE_ICONS: { id: Feature["icon"]; label: string }[] = [
  { id: "zap", label: "صاعقة (سرعة)" },
  { id: "gem", label: "جوهرة (جودة)" },
  { id: "percent", label: "نسبة (أسعار)" },
  { id: "chat", label: "محادثة (تواصل)" },
];

export default function ContentManager() {
  // جلب حالة الموقع ودالة تحديث المحتوى النصي (الحفظ تلقائي عند كل تغيير)
  const { state, updateContent } = useSite();
  // اختصار للوصول إلى كائن المحتوى الحالي
  const c = state.content;

  // دالة لتعديل إحصاء معين حسب موقعه في المصفوفة (تعديل القيمة الرقمية أو التسمية)
  const setStat = (i: number, key: "value" | "label", v: string) => {
    const stats = c.stats.map((s, j) => (j === i ? { ...s, [key]: v } : s));
    updateContent({ stats });
  };

  // دالة لتعديل بطاقة ميزة معينة حسب موقعها مع دمج التغييرات الجزئية فقط
  const setFeature = (i: number, patch: Partial<Feature>) => {
    const features = c.features.map((f, j) => (j === i ? { ...f, ...patch } : f));
    updateContent({ features });
  };

  return (
    <div>
      {/* رأس الصفحة مع وصف يوضح أن الحفظ تلقائي */}
      <PageHead
        title="إدارة المحتوى"
        sub="كل نص يظهر على الموقع — عدّل وشاهد النتيجة فورًا. الحفظ تلقائي."
      />

      <div className="space-y-6">
        {/* =========================================================
            قسم البطل (Hero): النصوص الظاهرة في أعلى الصفحة الرئيسية
            ========================================================= */}
        <Card>
          <h2 className="mb-5 text-lg font-black">قسم البطل (الواجهة الرئيسية)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* الشارة الصغيرة فوق العنوان الرئيسي */}
            <Field className="md:col-span-2" label="الشارة العلوية">
              <input className="inp" value={c.heroBadge} onChange={(e) => updateContent({ heroBadge: e.target.value })} />
            </Field>
            {/* العنوان الرئيسي مقسوم إلى جزأين لتطبيق تنسيق مختلف على الجزء الثاني */}
            <Field label="العنوان — الجزء الأول">
              <input className="inp" value={c.heroTitleA} onChange={(e) => updateContent({ heroTitleA: e.target.value })} />
            </Field>
            <Field label="العنوان — الجزء المميز (داخل صندوق نيون)">
              <input className="inp" value={c.heroTitleB} onChange={(e) => updateContent({ heroTitleB: e.target.value })} />
            </Field>
            {/* الفقرة التعريفية أسفل العنوان */}
            <Field className="md:col-span-2" label="الوصف">
              <textarea rows={3} className="inp resize-y" value={c.heroSubtitle} onChange={(e) => updateContent({ heroSubtitle: e.target.value })} />
            </Field>
            {/* نصوص أزرار الدعوة لاتخاذ إجراء في قسم البطل */}
            <Field label="نص الزر الرئيسي">
              <input className="inp" value={c.ctaPrimary} onChange={(e) => updateContent({ ctaPrimary: e.target.value })} />
            </Field>
            <Field label="نص الزر الثانوي">
              <input className="inp" value={c.ctaSecondary} onChange={(e) => updateContent({ ctaSecondary: e.target.value })} />
            </Field>
          </div>
        </Card>

        {/* =========================================================
            قسم الأرقام والإحصاءات: أرقام الإنجازات مع تسمياتها
            ========================================================= */}
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black">الأرقام والإحصاءات</h2>
            {/* زر إضافة إحصاء جديد بقيم افتراضية */}
            <AddBtn onClick={() => updateContent({ stats: [...c.stats, { value: "+0", label: "إحصاء جديد" }] })}>
              <Plus className="h-4 w-4" /> إضافة رقم
            </AddBtn>
          </div>
          <div className="space-y-3">
            {/* صف لكل إحصاء: حقل الرقم + حقل التسمية + زر الحذف */}
            {c.stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <input className="inp !w-32 font-latin" value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} placeholder="+120" />
                <input className="inp" value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} placeholder="مشروع منجز" />
                <DeleteBtn small onConfirm={() => updateContent({ stats: c.stats.filter((_, j) => j !== i) })} />
              </div>
            ))}
          </div>
        </Card>

        {/* =========================================================
            قسم «لماذا زورا»: النبذة التعريفية + بطاقات المزايا
            ========================================================= */}
        <Card>
          <h2 className="mb-5 text-lg font-black">قسم «لماذا زورا»</h2>
          <div className="grid gap-4">
            {/* عنوان القسم ونصه التعريفي */}
            <Field label="العنوان">
              <input className="inp" value={c.aboutTitle} onChange={(e) => updateContent({ aboutTitle: e.target.value })} />
            </Field>
            <Field label="النص التعريفي">
              <textarea rows={3} className="inp resize-y" value={c.aboutText} onChange={(e) => updateContent({ aboutText: e.target.value })} />
            </Field>
          </div>

          {/* عنوان فرعي لبطاقات المزايا مع زر الإضافة */}
          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-sm font-black text-ink/60">بطاقات المزايا</h3>
            {/* إضافة بطاقة ميزة جديدة بقيم افتراضية */}
            <AddBtn onClick={() => updateContent({ features: [...c.features, { icon: "zap", title: "ميزة جديدة", text: "وصف الميزة…" }] })}>
              <Plus className="h-4 w-4" /> إضافة ميزة
            </AddBtn>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* بطاقة تحرير لكل ميزة: اختيار الأيقونة + العنوان + الوصف + زر الحذف */}
            {c.features.map((f, i) => (
              <div key={i} className="rounded-2xl border border-black/5 bg-paper p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  {/* قائمة منسدلة لاختيار أيقونة الميزة من القائمة المعرّفة أعلاه */}
                  <select
                    className="inp !w-auto !py-1.5 text-xs"
                    value={f.icon}
                    onChange={(e) => setFeature(i, { icon: e.target.value as Feature["icon"] })}
                  >
                    {FEATURE_ICONS.map((ic) => (
                      <option key={ic.id} value={ic.id}>{ic.label}</option>
                    ))}
                  </select>
                  <DeleteBtn small onConfirm={() => updateContent({ features: c.features.filter((_, j) => j !== i) })} />
                </div>
                <input className="inp mb-2" value={f.title} onChange={(e) => setFeature(i, { title: e.target.value })} placeholder="عنوان الميزة" />
                <textarea rows={2} className="inp resize-y text-xs" value={f.text} onChange={(e) => setFeature(i, { text: e.target.value })} placeholder="وصف الميزة" />
              </div>
            ))}
          </div>
        </Card>

        {/* =========================================================
            قسم الدعوة الختامية + نبذة الفوتر (جنباً إلى جنب في الشاشات الكبيرة)
            ========================================================= */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* شريط الدعوة لاتخاذ إجراء في نهاية الصفحة الرئيسية */}
          <Card>
            <h2 className="mb-5 text-lg font-black">قسم الدعوة الختامية</h2>
            <div className="space-y-4">
              <Field label="العنوان">
                <input className="inp" value={c.ctaTitle} onChange={(e) => updateContent({ ctaTitle: e.target.value })} />
              </Field>
              <Field label="النص">
                <textarea rows={3} className="inp resize-y" value={c.ctaSubtitle} onChange={(e) => updateContent({ ctaSubtitle: e.target.value })} />
              </Field>
            </div>
          </Card>
          {/* النص التعريفي القصير الظاهر في تذييل الموقع أسفل الشعار */}
          <Card>
            <h2 className="mb-5 text-lg font-black">نبذة الفوتر</h2>
            <Field label="النص التعريفي أسفل الشعار">
              <textarea rows={4} className="inp resize-y" value={c.footerAbout} onChange={(e) => updateContent({ footerAbout: e.target.value })} />
            </Field>
          </Card>
        </div>
      </div>
    </div>
  );
}