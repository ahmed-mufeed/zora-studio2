import { useMemo, useState } from "react";
import { ExternalLink, ListChecks, Pencil, Plus, Save, SlidersHorizontal, TextCursorInput, ToggleLeft } from "lucide-react";
import { uid, useSite, useToast } from "../lib/store";
import type { BriefQuestion, FieldType } from "../lib/types";
import { Toggle } from "../components/ui";
import { AddBtn, Card, DeleteBtn, Field, Modal, MoveBtns, PageHead, moveBy } from "./ui";

const TYPE_META: Record<FieldType, { label: string; icon: any }> = {
  choice: { label: "اختيار واحد", icon: ToggleLeft },
  checkbox: { label: "اختيارات متعددة", icon: ListChecks },
  slider: { label: "منزلق رقمي", icon: SlidersHorizontal },
  text: { label: "نص حر", icon: TextCursorInput },
};

export default function BriefBuilder() {
  const { state, save } = useSite();
  const { toast } = useToast();
  const services = state.services;
  
  const [serviceId, setServiceId] = useState<string>(services[0]?.id ?? "");
  const [editing, setEditing] = useState<BriefQuestion | null>(null);
  const [optionsText, setOptionsText] = useState("");

  const service = useMemo(
    () => services.find((s) => s.id === serviceId) ?? services[0],
    [services, serviceId]
  );

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

  const persistQuestions = (questions: BriefQuestion[]) => {
    save("services", { ...service, questions });
  };

  const move = (index: number, delta: number) => {
    persistQuestions(moveBy(service.questions, index, delta));
  };

  const openEditor = (q: BriefQuestion) => {
    setEditing(q);
    setOptionsText((q.options ?? []).join("\n"));
  };

  const startNew = () =>
    openEditor({
      id: uid(),
      type: "choice",
      label: "",
      required: true,
      options: ["خيار أول", "خيار ثاني"],
      allowCustom: true
    });

  const persistQuestion = () => {
    if (!editing) return;
    if (!editing.label.trim()) return toast("أدخل نص السؤال أولًا", "warn");
    
    let q: BriefQuestion = { ...editing };
    
    if (q.type === "choice" || q.type === "checkbox") {
      const options = optionsText.split("\n").map(x => x.trim()).filter(Boolean);
      if (options.length < 1) return toast("أضف خيارًا واحدًا على الأقل", "warn");
      q = { ...q, options, min: undefined, max: undefined, step: undefined, unit: undefined, placeholder: undefined };
    } else if (q.type === "slider") {
      q = { ...q, options: undefined, allowCustom: undefined, placeholder: undefined, min: q.min ?? 0, max: q.max ?? 100, step: q.step ?? 1 };
    } else {
      q = { ...q, options: undefined, allowCustom: undefined, min: undefined, max: undefined, step: undefined, unit: undefined };
    }

    const exists = service.questions.some((x) => x.id === q.id);
    persistQuestions(exists ? service.questions.map((x) => (x.id === q.id ? q : x)) : [...service.questions, q]);
    
    toast("تم حفظ السؤال");
    setEditing(null);
  };

  return (
    <div>
      <PageHead
        title="بناء البريف"
        sub="لكل خدمة نموذجها الخاص بأسئلة مخصصة للعميل."
        action={<AddBtn onClick={startNew}><Plus className="h-4 w-4" /> إضافة سؤال</AddBtn>}
      />

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
            <ExternalLink className="h-4 w-4" /> معاينة النموذج للعميل
          </a>
        </div>
      </Card>

      <div className="space-y-3">
        {service.questions.map((q, i) => {
          const Meta = TYPE_META[q.type];
          return (
            <Card key={q.id} className="!p-4">
              <div className="flex flex-wrap items-center gap-4">
                <MoveBtns onUp={() => move(i, -1)} onDown={() => move(i, 1)} disableUp={i === 0} disableDown={i === service.questions.length - 1} />
                <span className="chamfer-sm grid h-9 w-9 shrink-0 place-items-center bg-royal font-latin text-xs font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-44 flex-1">
                  <h3 className="text-sm font-black text-ink">{q.label}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-royal/8 px-2.5 py-0.5 text-[10px] font-extrabold text-royal">
                      <Meta.icon className="h-3 w-3" /> {Meta.label}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${q.required ? "bg-neon/25 text-[#3d6300]" : "bg-ink/8 text-ink/45"}`}>
                      {q.required ? "إجباري" : "اختياري"}
                    </span>
                    {q.allowCustom && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700">إجابة مخصصة</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditor(q)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 text-ink/55 transition-colors hover:border-royal hover:text-royal"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <DeleteBtn small onConfirm={() => { persistQuestions(service.questions.filter((x) => x.id !== q.id)); toast("تم حذف السؤال"); }} />
                </div>
              </div>
            </Card>
          );
        })}
        {service.questions.length === 0 && (
          <Card className="py-16 text-center text-sm font-bold text-ink/40">لا توجد أسئلة بعد.</Card>
        )}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing && service.questions.some((x) => x.id === editing.id) ? "تعديل سؤال" : "سؤال جديد"}>
        {editing && (
          <div className="space-y-4">
            <Field label="نص السؤال">
              <input className="inp" value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="مثال: ما الميزانية المتوقعة؟" />
            </Field>
            <Field label="نوع الإجابة">
              <select className="inp" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as FieldType })}>
                {(Object.keys(TYPE_META) as FieldType[]).map((t) => (
                  <option key={t} value={t}>{TYPE_META[t].label}</option>
                ))}
              </select>
            </Field>

            {(editing.type === "choice" || editing.type === "checkbox") && (
              <>
                <Field label="الخيارات (سطر لكل خيار)">
                  <textarea rows={4} className="inp resize-y" value={optionsText} onChange={(e) => setOptionsText(e.target.value)} />
                </Field>
                <div className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
                  <span className="text-sm font-extrabold text-ink/60">السماح بإجابة مخصصة («أخرى»)</span>
                  <Toggle checked={Boolean(editing.allowCustom)} onChange={(v) => setEditing({ ...editing, allowCustom: v })} />
                </div>
              </>
            )}

            {editing.type === "slider" && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="الحد الأدنى"><input type="number" className="inp font-latin" value={editing.min ?? 0} onChange={(e) => setEditing({ ...editing, min: Number(e.target.value) })} /></Field>
                <Field label="الحد الأقصى"><input type="number" className="inp font-latin" value={editing.max ?? 100} onChange={(e) => setEditing({ ...editing, max: Number(e.target.value) })} /></Field>
                <Field label="خطوة التنقّل"><input type="number" className="inp font-latin" value={editing.step ?? 1} onChange={(e) => setEditing({ ...editing, step: Number(e.target.value) })} /></Field>
                <Field label="الوحدة (مثل: ر.س)"><input className="inp" value={editing.unit ?? ""} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} /></Field>
              </div>
            )}

            {editing.type === "text" && (
              <Field label="النص الإرشادي (placeholder)">
                <input className="inp" value={editing.placeholder ?? ""} onChange={(e) => setEditing({ ...editing, placeholder: e.target.value })} />
              </Field>
            )}

            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
              <span className="text-sm font-extrabold text-ink/60">سؤال إجباري</span>
              <Toggle checked={editing.required} onChange={(v) => setEditing({ ...editing, required: v })} />
            </div>

            <button onClick={persistQuestion} className="chamfer-sm glow-neon flex w-full items-center justify-center gap-2 bg-neon px-6 py-3.5 text-sm font-extrabold text-ink">
              <Save className="h-4 w-4" /> حفظ السؤال
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}