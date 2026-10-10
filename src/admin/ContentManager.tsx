import { Plus } from "lucide-react";
import { useSite } from "../lib/store";
import type { Feature } from "../lib/types";
import { AddBtn, Card, DeleteBtn, Field, PageHead } from "./ui";

const FEATURE_ICONS: { id: Feature["icon"]; label: string }[] = [
  { id: "zap", label: "صاعقة (سرعة)" },
  { id: "gem", label: "جوهرة (جودة)" },
  { id: "percent", label: "نسبة (أسعار)" },
  { id: "chat", label: "محادثة (تواصل)" },
];

export default function ContentManager() {
  const { state, updateContent } = useSite();
  const c = state.content;

  const setStat = (i: number, key: "value" | "label", v: string) => {
    const stats = c.stats.map((s, j) => (j === i ? { ...s, [key]: v } : s));
    updateContent({ stats });
  };

  const setFeature = (i: number, patch: Partial<Feature>) => {
    const features = c.features.map((f, j) => (j === i ? { ...f, ...patch } : f));
    updateContent({ features });
  };

  return (
    <div>
      <PageHead title="إدارة المحتوى" sub="كل نص يظهر على الموقع — الحفظ تلقائي فوراً." />

      <div className="space-y-6">
        <Card>
          <h2 className="mb-5 text-lg font-black">قسم البطل (الواجهة الرئيسية)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field className="md:col-span-2" label="الشارة العلوية">
              <input className="inp" value={c.heroBadge} onChange={(e) => updateContent({ heroBadge: e.target.value })} />
            </Field>
            <Field label="العنوان — الجزء الأول">
              <input className="inp" value={c.heroTitleA} onChange={(e) => updateContent({ heroTitleA: e.target.value })} />
            </Field>
            <Field label="العنوان — الجزء المميز (صندوق النيون)">
              <input className="inp" value={c.heroTitleB} onChange={(e) => updateContent({ heroTitleB: e.target.value })} />
            </Field>
            <Field className="md:col-span-2" label="الوصف">
              <textarea rows={2} className="inp resize-y" value={c.heroSubtitle} onChange={(e) => updateContent({ heroSubtitle: e.target.value })} />
            </Field>
            <Field label="نص الزر الرئيسي">
              <input className="inp" value={c.ctaPrimary} onChange={(e) => updateContent({ ctaPrimary: e.target.value })} />
            </Field>
            <Field label="نص الزر الثانوي">
              <input className="inp" value={c.ctaSecondary} onChange={(e) => updateContent({ ctaSecondary: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black">الأرقام والإحصاءات</h2>
            <AddBtn onClick={() => updateContent({ stats: [...c.stats, { value: "+0", label: "إحصاء جديد" }] })}>
              <Plus className="h-4 w-4" /> إضافة رقم
            </AddBtn>
          </div>
          <div className="space-y-3">
            {c.stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <input className="inp !w-32 font-latin" value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} />
                <input className="inp" value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} />
                <DeleteBtn small onConfirm={() => updateContent({ stats: c.stats.filter((_, j) => j !== i) })} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 text-lg font-black">قسم «لماذا زورا»</h2>
          <div className="grid gap-4 mb-6">
            <Field label="العنوان">
              <input className="inp" value={c.aboutTitle} onChange={(e) => updateContent({ aboutTitle: e.target.value })} />
            </Field>
            <Field label="النص التعريفي">
              <textarea rows={2} className="inp resize-y" value={c.aboutText} onChange={(e) => updateContent({ aboutText: e.target.value })} />
            </Field>
          </div>

          <div className="flex items-center justify-between mb-4 border-t border-black/5 pt-4">
            <h3 className="text-sm font-black text-ink/60">بطاقات المزايا</h3>
            <AddBtn onClick={() => updateContent({ features: [...c.features, { icon: "zap", title: "ميزة جديدة", text: "وصف الميزة…" }] })}>
              <Plus className="h-4 w-4" /> إضافة ميزة
            </AddBtn>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {c.features.map((f, i) => (
              <div key={i} className="rounded-2xl border border-black/5 bg-paper p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <select className="inp !w-auto !py-1" value={f.icon} onChange={(e) => setFeature(i, { icon: e.target.value as Feature["icon"] })}>
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-5 text-lg font-black">قسم الدعوة الختامية</h2>
            <div className="space-y-4">
              <Field label="العنوان">
                <input className="inp" value={c.ctaTitle} onChange={(e) => updateContent({ ctaTitle: e.target.value })} />
              </Field>
              <Field label="النص">
                <textarea rows={2} className="inp resize-y" value={c.ctaSubtitle} onChange={(e) => updateContent({ ctaSubtitle: e.target.value })} />
              </Field>
            </div>
          </Card>
          <Card>
            <h2 className="mb-5 text-lg font-black">نبذة الفوتر</h2>
            <Field label="النص التعريفي أسفل الشعار">
              <textarea rows={5} className="inp resize-y" value={c.footerAbout} onChange={(e) => updateContent({ footerAbout: e.target.value })} />
            </Field>
          </Card>
        </div>
      </div>
    </div>
  );
}