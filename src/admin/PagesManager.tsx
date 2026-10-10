import { useState } from "react";
import { ExternalLink, Pencil, Plus, Save } from "lucide-react";
import { uid, useSite, useToast } from "../lib/store";
import type { CustomPage } from "../lib/types";
import { Toggle } from "../components/ui";
import { AddBtn, Card, DeleteBtn, Field, Modal, PageHead } from "./ui";

const emptyPage = (): CustomPage => ({
  id: uid(),
  title: "",
  slug: `page-${Date.now().toString(36)}`,
  body: "",
  visible: true,
});

export default function PagesManager() {
  const { state, save, remove } = useSite();
  const { toast } = useToast();
  const [editing, setEditing] = useState<CustomPage | null>(null);

  const persist = () => {
    if (!editing) return;
    if (!editing.title.trim()) return toast("أدخل عنوان الصفحة", "warn");

    const slug = editing.slug.trim().replace(/\s+/g, "-") || `page-${Date.now().toString(36)}`;
    save("pages", { ...editing, slug });
    toast("تم حفظ الصفحة");
    setEditing(null);
  };

  return (
    <div className="max-w-3xl">
      <PageHead
        title="إدارة الصفحات"
        sub="أنشئ صفحات مستقلة (سياسة الخصوصية، الشروط...) تظهر تلقائياً بالكامل."
        action={<AddBtn onClick={() => setEditing(emptyPage())}><Plus className="h-4 w-4" /> صفحة جديدة</AddBtn>}
      />

      <div className="space-y-3">
        {state.pages.map((p) => (
          <Card key={p.id} className="!p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="chamfer-sm grid h-11 w-11 shrink-0 place-items-center bg-royal/10 text-sm font-black text-royal">صف</span>
              <div className="min-w-40 flex-1">
                <h3 className="text-sm font-black text-ink">{p.title}</h3>
                <p className="mt-0.5 font-latin text-xs font-bold text-ink/40" dir="ltr">/p/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`#/p/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 text-ink/55 transition-colors hover:border-royal hover:text-royal"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setEditing(p)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 text-ink/55 transition-colors hover:border-royal hover:text-royal"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <DeleteBtn small onConfirm={() => { remove("pages", p.id); toast("تم حذف الصفحة"); }} />
                <Toggle checked={p.visible} onChange={(v) => save("pages", { ...p, visible: v })} />
              </div>
            </div>
          </Card>
        ))}
        {state.pages.length === 0 && (
          <Card className="py-16 text-center text-sm font-bold text-ink/40">لا توجد صفحات مخصصة بعد.</Card>
        )}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing && state.pages.some((x) => x.id === editing.id) ? "تعديل صفحة" : "صفحة جديدة"} wide>
        {editing && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="عنوان الصفحة">
                <input className="inp" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="مثال: من نحن" />
              </Field>
              <Field label="الرابط (slug)">
                <input className="inp font-latin" dir="ltr" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </Field>
            </div>
            <Field label="محتوى الصفحة">
              <textarea rows={8} className="inp resize-y" value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
            </Field>
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
              <span className="text-sm font-extrabold text-ink/60">ظاهرة على الموقع</span>
              <Toggle checked={editing.visible} onChange={(v) => setEditing({ ...editing, visible: v })} />
            </div>
            <button onClick={persist} className="chamfer-sm glow-neon flex w-full items-center justify-center gap-2 bg-neon px-6 py-3.5 text-sm font-extrabold text-ink">
              <Save className="h-4 w-4" /> حفظ الصفحة
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}