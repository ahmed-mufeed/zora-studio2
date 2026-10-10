import { useState } from "react";
import { ClipboardList, Eye, EyeOff, Pause, Pencil, Play, Plus, Save } from "lucide-react";
import { fmtPrice, uid, useSite, useToast } from "../lib/store";
import type { Service } from "../lib/types";
import { AddBtn, Card, DeleteBtn, Field, ImagePicker, Modal, MoveBtns, PageHead, moveBy } from "./ui";
import { Toggle } from "../components/ui";

const PRICE_UNITS = ["شهريًا", "للمشروع", "للفيديو", "للقطعة"];

const emptyService = (image: string): Service => ({
  id: uid(),
  title: "",
  short: "",
  full: [],
  price: 0,
  priceUnit: "للمشروع",
  image,
  status: "available",
  hidden: false,
  features: [],
  questions: [],
});

export default function ServicesManager() {
  const { state, save, remove, reorder } = useSite();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ full: "", features: "" });

  const openEditor = (s: Service) => {
    setEditing(s);
    setForm({ full: s.full.join("\n\n"), features: s.features.join("\n") });
  };

  const persist = () => {
    if (!editing) return;
    if (!editing.title.trim()) return toast("أدخل عنوان الخدمة أولًا", "warn");
    
    const full = form.full.split(/\n\s*\n|\n/).map(x => x.trim()).filter(Boolean);
    const features = form.features.split("\n").map(x => x.trim()).filter(Boolean);
    
    save("services", { ...editing, full, features });
    toast("تم حفظ الخدمة");
    setEditing(null);
  };

  const move = (index: number, delta: number) => {
    reorder("services", moveBy(state.services, index, delta).map((s) => s.id));
  };

  return (
    <div>
      <PageHead
        title="إدارة الخدمات"
        sub="أضف وعدّل الخدمات والأسعار مباشرة."
        action={<AddBtn onClick={() => openEditor(emptyService(state.services[0]?.image ?? ""))}><Plus className="h-4 w-4" /> إضافة خدمة</AddBtn>}
      />

      <div className="space-y-3">
        {state.services.map((s, i) => (
          <Card key={s.id} className="!p-4">
            <div className="flex flex-wrap items-center gap-4">
              <MoveBtns onUp={() => move(i, -1)} onDown={() => move(i, 1)} disableUp={i === 0} disableDown={i === state.services.length - 1} />
              <img src={s.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-40 flex-1">
                <h3 className="text-sm font-black text-ink">{s.title}</h3>
                <p className="text-xs font-bold text-royal">{fmtPrice(s.price)} ر.س / {s.priceUnit}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => save("services", { ...s, status: s.status === "available" ? "unavailable" : "available" })}
                  className={`grid h-9 w-9 place-items-center rounded-xl border ${s.status === "available" ? "border-amber-200 text-amber-600" : "border-emerald-200 text-emerald-600"}`}
                >
                  {s.status === "available" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button onClick={() => save("services", { ...s, hidden: !s.hidden })} className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 text-ink/55">
                  {s.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button onClick={() => openEditor(s)} className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 text-ink/55"><Pencil className="h-4 w-4" /></button>
                <DeleteBtn onConfirm={() => { remove("services", s.id); toast("تم الحذف"); }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="تعديل الخدمة" wide>
        {editing && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="اسم الخدمة" className="md:col-span-2"><input className="inp" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="وصف البطاقة" className="md:col-span-2"><textarea rows={2} className="inp" value={editing.short} onChange={(e) => setEditing({ ...editing, short: e.target.value })} /></Field>
            <Field label="الوصف الكامل" className="md:col-span-2"><textarea rows={4} className="inp" value={form.full} onChange={(e) => setForm({ ...form, full: e.target.value })} /></Field>
            <Field label="المزايا" className="md:col-span-2"><textarea rows={4} className="inp" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></Field>
            <Field label="السعر"><input type="number" className="inp font-latin" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></Field>
            <Field label="وحدة السعر">
              <input className="inp" list="price-units" value={editing.priceUnit} onChange={(e) => setEditing({ ...editing, priceUnit: e.target.value })} />
              <datalist id="price-units">{PRICE_UNITS.map(u => <option key={u} value={u} />)}</datalist>
            </Field>
            <Field label="صورة الخدمة" className="md:col-span-2"><ImagePicker value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} /></Field>
            <button onClick={persist} className="chamfer-sm glow-neon mt-2 inline-flex items-center justify-center gap-2 bg-neon px-6 py-3.5 text-sm font-extrabold text-ink md:col-span-2">
              <Save className="h-4 w-4" /> حفظ الخدمة
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}