import { useMemo, useState } from "react";
// استيراد الأيقونات المساعدة من مكتبة Lucide لتوضيح واجهات حقول الإدخال والتحكم
import { ExternalLink, ListChecks, Pencil, Plus, Save, SlidersHorizontal, TextCursorInput, ToggleLeft } from "lucide-react";
// استيراد دوال إدارة الحالة العامة والتوست (التنبيهات السريعة)
import { uid, useSite, useToast } from "../lib/store";
import type { BriefQuestion, FieldType } from "../lib/types";
// استيراد مكون التبديل الثنائي (Toggle Switch) لخيارات نعم/لا
import { Toggle } from "../components/ui";
// استيراد عناصر واجهة المستخدم المشتركة للوحة التحكم
import { AddBtn, Card, DeleteBtn, Field, Modal, MoveBtns, PageHead, moveBy } from "./ui";

// خريطة تعريفية لربط كل نوع حقل إدخال بالاسم العربي والأيقونة المناسبة له
const TYPE_META: Record<FieldType, { label: string; icon: typeof ListChecks }> = {
  choice: { label: "اختيار واحد", icon: ToggleLeft },
  checkbox: { label: "اختيارات متعددة", icon: ListChecks },
  slider: { label: "منزلق رقمي", icon: SlidersHorizontal },
  text: { label: "نص حر", icon: TextCursorInput },
};

export default function BriefBuilder() {
  // جلب بيانات الموقع الحالية ودالة الحفظ من المتجر العام
  const { state, save } = useSite();
  // خطاف لعرض رسائل التنبيه التفاعلية للمستخدم
  const { toast } = useToast();
  
  const services = state.services;
  // تحديد الخدمة النشطة حالياً (تلقائياً يتم اختيار الخدمة الأولى في القائمة)
  const [serviceId, setServiceId] = useState<string>(services[0]?.id ?? "");
  // حالة السؤال الجاري تعديله أو إنشاؤه حالياً (تكون null في حال عدم وجود تعديل نشط)
  const [editing, setEditing] = useState<BriefQuestion | null>(null);
  // حالة مؤقتة للاحتفاظ بالخيارات المكتوبة داخل مربع النص (كل خيار في سطر جديد)
  const [optionsText, setOptionsText] = useState("");

  // استخراج تفاصيل الخدمة النشطة بناءً على معرفها المختار
  const service = useMemo(
    () => services.find((s) => s.id === serviceId) ?? services[0],
    [services, serviceId]
  );

  // حماية للواجهة: إذا لم يكن هناك خدمات مضافة بعد، يُطلب من المستخدم إضافتها أولاً
  if (!service) {
    return (
      <div>
        <PageHead title="بناء البريف" sub="ابنِ نموذج بريف مخصصًا لكل خدمة." />
        <Card className="py-16 text-center text-sm font-bold text-ink/40">
          أضف خدمة أولًا من تبويب «الخدمات».
        </Card>
      </div>
    );
  }

  // دالة لحفظ وتحديث مصفوفة الأسئلة الخاصة بالخدمة الحالية وتخزينها
  const persistQuestions = (questions: BriefQuestion[]) => {
    save("services", { ...service, questions });
  };

  // دالة لنقل ترتيب السؤال للأعلى أو للأسفل في مصفوفة الأسئلة
  const move = (index: number, delta: number) => {
    persistQuestions(moveBy(service.questions, index, delta));
  };

  // دالة لفتح نافذة تعديل سؤال حالي مع تعبئة بياناته السابقة
  const openEditor = (q: BriefQuestion) => {
    setEditing(q);
    setOptionsText((q.options ?? []).join("\n"));
  };

  // دالة لبدء إنشاء سؤال جديد كلياً وتعبئة قيمه الافتراضية الأولية
  const startNew = () =>
    openEditor({
      id: uid(),
      type: "choice",
      label: "",
      required: true,
      options: ["خيار أول", "خيار ثاني"],
      allowCustom: true
    });

  // دالة الحفظ النهائي للسؤال (سواء كان جديداً أو بعد التعديل)
  const persistQuestion = () => {
    if (!editing) return;
    
    // التحقق من تعبئة عنوان السؤال لمنع الحفظ الفارغ
    if (!editing.label.trim()) {
      toast("أدخل نص السؤال أولًا", "warn");
      return;
    }
    
    let q: BriefQuestion = { ...editing };
    
    // معالجة البيانات بناءً على نوع الحقل المختار لتجنب تخزين حقول غير متوافقة
    if (q.type === "choice" || q.type === "checkbox") {
      // تحويل النص متعدد الأسطر إلى مصفوفة خيارات مع تجاهل الأسطر الفارغة
      const options = optionsText.split("\n").map((x) => x.trim()).filter(Boolean);
      if (options.length < 1) {
        toast("أضف خيارًا واحدًا على الأقل", "warn");
        return;
      }
      // تنظيف الخصائص غير المتعلقة بنوع حقول الاختيار
      q = { ...q, options, min: undefined, max: undefined, step: undefined, unit: undefined, placeholder: undefined };
    } else if (q.type === "slider") {
      // تنظيف الخصائص غير المتعلقة بنوع حقل المنزلق الرقمي وتعيين القيم الافتراضية
      q = {
        ...q,
        options: undefined,
        allowCustom: undefined,
        placeholder: undefined,
        min: q.min ?? 0,
        max: q.max ?? 100,
        step: q.step ?? 1,
      };
    } else {
      // تنظيف الخصائص في حال كان الحقل نصياً حراً
      q = { ...q, options: undefined, allowCustom: undefined, min: undefined, max: undefined, step: undefined, unit: undefined };
    }

    // فحص ما إذا كان المعرف موجوداً مسبقاً (عملية تعديل) أو غير موجود (إضافة جديد)
    const exists = service.questions.some((x) => x.id === q.id);
    persistQuestions(exists ? service.questions.map((x) => (x.id === q.id ? q : x)) : [...service.questions, q]);
    
    toast("تم حفظ السؤال");
    setEditing(null); // إغلاق نافذة التعديل المنبثقة
  };

  return (
    <div>
      {/* رأس الصفحة مع زر إضافة سؤال جديد */}
      <PageHead
        title="بناء البريف"
        sub="لكل خدمة نموذجها الخاص: أسئلة اختيارية وإجبارية، خيارات، منزلقات، وحقول نصية."
        action={
          <AddBtn onClick={startNew}>
            <Plus className="h-4 w-4" /> إضافة سؤال
          </AddBtn>
        }
      />

      {/* صندوق اختيار الخدمة النشطة + زر الانتقال للمعاينة الحية */}
      <Card className="mb-6 !p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-60 flex-1">
            <label className="lbl">الخدمة</label>
            <select className="inp" value={service.id} onChange={(e) => setServiceId(e.target.value)}>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
          <a
            href={`#/services/${service.id}/brief`}
            target="_blank"
            rel="noreferrer"
            className="chamfer-sm mt-5 inline-flex items-center gap-2 border border-royal px-5 py-2.5 text-sm font-extrabold text-royal transition-colors hover:bg-royal hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            معاينة النموذج كما يراه العميل
          </a>
        </div>
      </Card>

      {/* قائمة الأسئلة الحالية المضافة لهذه الخدمة */}
      <div className="space-y-3">
        {service.questions.map((q, i) => {
          const Meta = TYPE_META[q.type];
          return (
            <Card key={q.id} className="!p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* أزرار تغيير الترتيب (أعلى / أسفل) مع تعطيلها عند الوصول للحدود */}
                <MoveBtns onUp={() => move(i, -1)} onDown={() => move(i, 1)} disableUp={i === 0} disableDown={i === service.questions.length - 1} />
                
                {/* رقم السؤال الترتيبي */}
                <span className="chamfer-sm grid h-9 w-9 shrink-0 place-items-center bg-royal font-latin text-xs font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                
                {/* تفاصيل السؤال ونوعه وخصائصه كأوسمة ملونة */}
                <div className="min-w-44 flex-1">
                  <h3 className="text-sm font-black text-ink">{q.label}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {/* وسم نوع الإدخال ومعه الأيقونة التعبيرية */}
                    <span className="inline-flex items-center gap-1 rounded-full bg-royal/8 px-2.5 py-0.5 text-[10px] font-extrabold text-royal">
                      <Meta.icon className="h-3 w-3" /> {Meta.label}
                    </span>
                    {/* وسم حالة الإلزام (إجباري / اختياري) */}
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${q.required ? "bg-neon/25 text-[#3d6300]" : "bg-ink/8 text-ink/45"}`}>
                      {q.required ? "إجباري" : "اختياري"}
                    </span>
                    {/* وسم السماح بالإجابة المخصصة */}
                    {q.allowCustom && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700">
                        يسمح بإجابة مخصصة
                      </span>
                    )}
                    {/* وسم تفاصيل المنزلق الرقمي إن وجد */}
                    {q.type === "slider" && (
                      <span className="rounded-full bg-ink/8 px-2.5 py-0.5 font-latin text-[10px] font-extrabold text-ink/50">
                        {q.min}–{q.max} {q.unit}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* أزرار الإجراءات (تعديل / حذف) على كل سؤال */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditor(q)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 text-ink/55 transition-colors hover:border-royal hover:text-royal"
                    title="تعديل"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <DeleteBtn small onConfirm={() => { persistQuestions(service.questions.filter((x) => x.id !== q.id)); toast("تم حذف السؤال"); }} />
                </div>
              </div>
            </Card>
          );
        })}
        
        {/* شاشة افتراضية تظهر عند خلو الخدمة الحالية من أي أسئلة */}
        {service.questions.length === 0 && (
          <Card className="py-16 text-center text-sm font-bold text-ink/40">
            لا توجد أسئلة لهذه الخدمة بعد — أضف أول سؤال.
          </Card>
        )}
      </div>

      {/* النافذة المنبثقة (Modal) لإنشاء وتعديل تفاصيل السؤال */}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing && service.questions.some((x) => x.id === editing.id) ? "تعديل سؤال" : "سؤال جديد"}>
        {editing && (
          <div className="space-y-4">
            {/* حقل إدخال عنوان أو نص السؤال الموجه للعميل */}
            <Field label="نص السؤال">
              <input className="inp" value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="مثال: ما الميزانية المتوقعة؟" />
            </Field>
            
            {/* اختيار نوع السؤال والتحكم في الخصائص التي تتبع كل نوع */}
            <Field label="نوع الإجابة">
              <select
                className="inp"
                value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value as FieldType })}
              >
                {(Object.keys(TYPE_META) as FieldType[]).map((t) => (
                  <option key={t} value={t}>{TYPE_META[t].label}</option>
                ))}
              </select>
            </Field>

            {/* الخصائص الإضافية لخيارات الإدخال (تظهر فقط عند اختيار نوع اختيار واحد أو متعدد) */}
            {(editing.type === "choice" || editing.type === "checkbox") && (
              <>
                <Field label="الخيارات (سطر لكل خيار)">
                  <textarea rows={5} className="inp resize-y" value={optionsText} onChange={(e) => setOptionsText(e.target.value)} />
                </Field>
                <div className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
                  <span className="text-sm font-extrabold text-ink/60">السماح بإجابة مخصصة («أخرى — أكتب بنفسي»)</span>
                  <Toggle checked={Boolean(editing.allowCustom)} onChange={(v) => setEditing({ ...editing, allowCustom: v })} />
                </div>
              </>
            )}

            {/* الخصائص الإضافية للمنزلق الرقمي (تظهر فقط عند اختيار نوع منزلق رقمي) */}
            {editing.type === "slider" && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="الحد الأدنى">
                  <input type="number" className="inp font-latin" value={editing.min ?? 0} onChange={(e) => setEditing({ ...editing, min: Number(e.target.value) })} />
                </Field>
                <Field label="الحد الأقصى">
                  <input type="number" className="inp font-latin" value={editing.max ?? 100} onChange={(e) => setEditing({ ...editing, max: Number(e.target.value) })} />
                </Field>
                <Field label="خطوة التنقّل">
                  <input type="number" className="inp font-latin" value={editing.step ?? 1} onChange={(e) => setEditing({ ...editing, step: Number(e.target.value) })} />
                </Field>
                <Field label="الوحدة (مثل: ر.س)">
                  <input className="inp" value={editing.unit ?? ""} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
                </Field>
              </div>
            )}

            {/* الخصائص الإضافية للحقل النصي (تظهر فقط عند اختيار نوع نص حر) */}
            {editing.type === "text" && (
              <Field label="النص الإرشادي (placeholder)">
                <input className="inp" value={editing.placeholder ?? ""} onChange={(e) => setEditing({ ...editing, placeholder: e.target.value })} />
              </Field>
            )}

            {/* خيار التبديل للتحكم في إلزامية تعبئة السؤال قبل الإرسال */}
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
              <span className="text-sm font-extrabold text-ink/60">سؤال إجباري</span>
              <Toggle checked={editing.required} onChange={(v) => setEditing({ ...editing, required: v })} />
            </div>

            {/* زر الحفظ النهائي وإجراء الفحص للبيانات المدخلة في الـ Modal */}
            <button
              onClick={persistQuestion}
              className="chamfer-sm glow-neon flex w-full items-center justify-center gap-2 bg-neon px-6 py-3.5 text-sm font-extrabold text-ink"
            >
              <Save className="h-4 w-4" /> حفظ السؤال
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}