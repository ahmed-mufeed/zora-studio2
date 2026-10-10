import { useState } from "react";
import { Pencil, Plus, Save } from "lucide-react";
import { uid, useSite, useToast } from "../lib/store";
import type { Testimonial } from "../lib/types";
import { Stars, Toggle } from "../components/ui";
import { AddBtn, Card, DeleteBtn, Field, Modal, PageHead } from "./ui";

const RATINGS = ["5", "4.5", "4", "3.5", "3"];

const emptyT = (): Testimonial => ({
  id: uid(),
  name: "",
  role: "",
  company: "",
  rating: 5,
  text: "",
  visible: true,
});

export default function TestimonialsManager() {
  const { state, save, remove } = useSite();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const persist = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.text.trim()) return toast("أدخل اسم العميل ونص الرأي", "warn");
    save("testimonials", editing);
    toast("تم حفظ الرأي");
    setEditing(null);
  };

  return (
    <div>
      <PageHead
        title="آراء العملاء"
        sub="اعتماد وعرض تقييمات العملاء."
        action={<AddBtn onClick={() => setEditing(emptyT())}><Plus className="h-4 w-4" /> إضافة رأي</AddBtn>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {state.testimonials.map((t) => (
          <Card key={t.id} className="!p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-royal text-lg font-black text-white">
                  {t.name.trim().charAt(0) || "؟"}
                </span>
                <div>
                  <h3 className="text-sm font-black text-ink">{t.name}</h3>
                  <p className="text-xs font-bold text-ink/45">{t.role} — {t.company}</p>
                  <div className="mt-1"><Stars rating={t.rating} /></div>
                </div>
              </div>
              <Toggle checked={t.visible} onChange={(v) => save("testimonials", { ...t, visible: v })} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-ink/55">"{t.text}"</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditing(t)} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-ink/10 px-3 text-xs font-extrabold text-ink/55 hover:border-royal hover:text-royal"><Pencil className="h-3.5 w-3.5" /> تعديل</button>
              <DeleteBtn onConfirm={() => { remove("testimonials", t.id); toast("تم حذف الرأي"); }} />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="تعديل الرأي">
        {editing && (
          <div className="space-y-4">
            <Field label="اسم العميل"><input className="inp" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="المنصب"><input className="inp" value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></Field>
              <Field label="الشركة"><input className="inp" value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></Field>
            </div>
            <Field label="التقييم">
              <select className="inp font-latin" value={String(editing.rating)} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}>
                {RATINGS.map(r => <option key={r} value={r}>{r} / 5</option>)}
              </select>
            </Field>
            <Field label="نص الرأي"><textarea rows={4} className="inp" value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} /></Field>
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
              <span className="text-sm font-extrabold text-ink/60">معتمد وظاهر</span>
              <Toggle checked={editing.visible} onChange={(v) => setEditing({ ...editing, visible: v })} />
            </div>
            <button onClick={persist} className="chamfer-sm glow-neon flex w-full items-center justify-center gap-2 bg-neon px-6 py-3.5 text-sm font-extrabold text-ink">
              <Save className="h-4 w-4" /> حفظ الرأي
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}