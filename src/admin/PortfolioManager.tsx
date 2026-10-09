import { useState } from "react";
// استيراد الأيقونات من مكتبة Lucide لأزرار التنقل والإجراءات
import { FolderOpen, Images, Pencil, Plus, Save } from "lucide-react";
// استيراد دوال توليد المعرفات وإدارة الحالة العامة والتنبيهات
import { uid, useSite, useToast } from "../lib/store";
import type { PortfolioItem } from "../lib/types";
// استيراد مكونات واجهة المستخدم الموحدة للوحة التحكم ومكون التبديل الثنائي
import { AddBtn, Card, DeleteBtn, Field, ImagePicker, Modal, PageHead } from "./ui";
import { Toggle } from "../components/ui";

// دالة مساعدة لإنشاء كائن عمل جديد بقيم أولية افتراضية
const emptyItem = (image: string): PortfolioItem => ({
  id: uid(),
  title: "",
  client: "",
  categoryId: "",
  image,
  tags: [],
  year: String(new Date().getFullYear()),
  aspectRatio: "auto",
  customWidth: 1920,
  customHeight: 1080,
  lockAspectRatio: true,
});

// دالة مساعدة لتحويل معرف مقاس الصورة إلى كلاس CSS للتنسيق في لوحة التحكم
const getAspectPreviewClass = (w: PortfolioItem) => {
  if (w.aspectRatio === "custom" && w.customWidth && w.customHeight) {
    return ""; // للتحكم الفردي سيعتمد على التنسيق المالي بالأسفل
  }
  const classes: Record<string, string> = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-[4/3]",
    widescreen: "aspect-[16/9]",
    story: "aspect-[9/16]",
    banner: "aspect-[3/1]",
  };
  return classes[w.aspectRatio ?? "auto"] ?? "aspect-auto h-36";
};

// جلب الـ Inline style الخاص بالمقاسات المعروضة في لوحة التحكم
const getAspectPreviewStyle = (w: PortfolioItem): React.CSSProperties => {
  if (w.aspectRatio === "custom" && w.customWidth && w.customHeight) {
    return { aspectRatio: `${w.customWidth} / ${w.customHeight}` };
  }
  return {};
};

export default function PortfolioManager() {
  const { state, save, remove } = useSite();
  const { toast } = useToast();

  const [tab, setTab] = useState<"items" | "cats">("items");
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [tagsText, setTagsText] = useState("");
  const [newCat, setNewCat] = useState("");

  const clients = Array.from(new Set(state.portfolio.map((w) => w.client))).filter(Boolean);
  const catName = (id: string) => state.categories.find((c) => c.id === id)?.name ?? "بدون فئة";

  const openEditor = (w: PortfolioItem) => {
    setEditing({
      ...w,
      customWidth: w.customWidth ?? 1920,
      customHeight: w.customHeight ?? 1080,
      lockAspectRatio: w.lockAspectRatio ?? true,
    });
    setTagsText(w.tags.join("، "));
  };

  // معالجة تغيير العرض مع قفل نسبة الطول ديناميكياً
  const handleWidthChange = (w: number) => {
    if (!editing) return;
    if (editing.lockAspectRatio && editing.customWidth && editing.customHeight) {
      const ratio = editing.customWidth / editing.customHeight;
      setEditing({
        ...editing,
        customWidth: w,
        customHeight: Math.round(w / ratio),
      });
    } else {
      setEditing({ ...editing, customWidth: w });
    }
  };

  // معالجة تغيير الارتفاع مع قفل نسبة العرض ديناميكياً
  const handleHeightChange = (h: number) => {
    if (!editing) return;
    if (editing.lockAspectRatio && editing.customWidth && editing.customHeight) {
      const ratio = editing.customWidth / editing.customHeight;
      setEditing({
        ...editing,
        customHeight: h,
        customWidth: Math.round(h * ratio),
      });
    } else {
      setEditing({ ...editing, customHeight: h });
    }
  };

  const persistItem = () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast("أدخل عنوان العمل أولًا", "warn");
      return;
    }
    const tags = tagsText.split(/[,،]/).map((x) => x.trim()).filter(Boolean);
    save("portfolio", { ...editing, tags });
    toast("تم حفظ العمل");
    setEditing(null);
  };

  return (
    <div>
      <PageHead
        title="إدارة الأعمال"
        sub="معرض الأعمال، الفئات، والعملاء — كل ما يظهر في صفحة أعمالنا."
        action={
          tab === "items" ? (
            <AddBtn onClick={() => openEditor(emptyItem(state.portfolio[0]?.image ?? ""))}>
              <Plus className="h-4 w-4" /> إضافة عمل
            </AddBtn>
          ) : undefined
        }
      />

      <div className="mb-6 inline-flex rounded-2xl border border-ink/10 bg-white p-1.5">
        {(
          [
            { t: "items", label: "الأعمال", icon: Images },
            { t: "cats", label: "الفئات", icon: FolderOpen },
          ] as const
        ).map(({ t, label, icon: Icon }) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-extrabold transition-all ${
              tab === t ? "bg-royal text-white" : "text-ink/50 hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "items" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.portfolio.map((w) => (
            <Card key={w.id} className="!p-3">
              <div className="relative overflow-hidden rounded-xl bg-paper">
                <img
                  src={w.image}
                  alt={w.title}
                  style={getAspectPreviewStyle(w)}
                  className={`w-full object-cover ${getAspectPreviewClass(w)}`}
                />
                <span className="absolute right-2 top-2 rounded-lg bg-ink/80 px-2.5 py-1 text-[10px] font-extrabold text-neon backdrop-blur">
                  {catName(w.categoryId)}
                </span>
              </div>
              
              <div className="flex items-start justify-between gap-2 p-2">
                <div>
                  <h3 className="text-sm font-black text-ink">{w.title}</h3>
                  <p className="mt-0.5 text-xs font-bold text-ink/45">
                    {w.client} · <span className="font-latin">{w.year}</span>
                  </p>
                  <span className="mt-1 inline-block rounded bg-royal/10 px-1.5 py-0.5 text-[9px] font-bold text-royal">
                    مقاس: {w.aspectRatio === "auto" ? "تلقائي" : w.aspectRatio === "square" ? "مربع" : w.aspectRatio === "portrait" ? "طولي" : w.aspectRatio === "landscape" ? "عرضي" : w.aspectRatio === "widescreen" ? "16:9 شاشة" : w.aspectRatio === "story" ? "9:16 ريلز" : w.aspectRatio === "banner" ? "3:1 بنر" : `مخصص (${w.customWidth}x${w.customHeight})`}
                  </span>
                </div>
                
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => openEditor(w)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-ink/10 text-ink/55 transition-colors hover:border-royal hover:text-royal"
                    title="تعديل"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <DeleteBtn small onConfirm={() => { remove("portfolio", w.id); toast("تم حذف العمل"); }} />
                </div>
              </div>
            </Card>
          ))}
          {state.portfolio.length === 0 && (
            <Card className="col-span-full py-16 text-center text-sm font-bold text-ink/40">لا توجد أعمال بعد.</Card>
          )}
        </div>
      ) : (
        <div className="max-w-2xl space-y-4">
          <Card className="!p-4">
            <div className="flex gap-3">
              <input
                className="inp"
                placeholder="اسم فئة جديدة — مثال: تصوير منتجات"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCat.trim()) {
                    save("categories", { id: uid(), name: newCat.trim() });
                    setNewCat("");
                    toast("تمت إضافة الفئة");
                  }
                }}
              />
              <AddBtn
                onClick={() => {
                  if (!newCat.trim()) return;
                  save("categories", { id: uid(), name: newCat.trim() });
                  setNewCat("");
                  toast("تمت إضافة الفئة");
                }}
              >
                <Plus className="h-4 w-4" /> إضافة
              </AddBtn>
            </div>
          </Card>
          {state.categories.map((c) => {
            const count = state.portfolio.filter((w) => w.categoryId === c.id).length;
            return (
              <Card key={c.id} className="!p-4">
                <div className="flex items-center gap-3">
                  <input
                    className="inp"
                    value={c.name}
                    onChange={(e) => save("categories", { ...c, name: e.target.value })}
                  />
                  <span className="shrink-0 rounded-full bg-royal/8 px-3 py-1 text-[11px] font-extrabold text-royal">
                    <span className="font-latin">{count}</span> عمل
                  </span>
                  <DeleteBtn
                    small
                    onConfirm={() => {
                      if (count > 0) {
                        toast(`لا يمكن حذف «${c.name}» — مرتبطة بـ ${count} عمل`, "warn");
                        return;
                      }
                      remove("categories", c.id);
                      toast("تم حذف الفئة");
                    }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* modal */}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing && state.portfolio.some((x) => x.id === editing.id) ? "تعديل عمل" : "عمل جديد"} wide>
        {editing && (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="عنوان العمل" className="md:col-span-2">
              <input className="inp" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>

            <Field label="الفئة">
              <select
                className="inp"
                value={editing.categoryId}
                onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}
              >
                <option value="">— اختر فئة —</option>
                {state.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label="نسبة ومقاس الصورة">
              <select
                className="inp font-sans"
                value={editing.aspectRatio ?? "auto"}
                onChange={(e) => setEditing({ ...editing, aspectRatio: e.target.value as PortfolioItem["aspectRatio"] })}
              >
                <option value="auto">تلقائي (الأبعاد الأصلية للصورة)</option>
                <option value="square">مربع (1:1)</option>
                <option value="portrait">طولي (4:5)</option>
                <option value="landscape">عرضي (4:3)</option>
                <option value="widescreen">شاشة عريضة (16:9)</option>
                <option value="story">عمودي ريلز/ستوري (9:16)</option>
                <option value="banner">بنر عرضي عريض (3:1)</option>
                <option value="custom">مقاس يدوي بالبكسل ✎</option>
              </select>
            </Field>

            {/* عرض الحقول اليدوية فقط عند اختيار "مقاس مخصص" */}
            {editing.aspectRatio === "custom" && (
              <div className="col-span-2 grid grid-cols-2 gap-4 rounded-xl border border-black/5 bg-paper p-4">
                <Field label="العرض بالبكسل">
                  <input
                    type="number"
                    min={10}
                    className="inp font-latin"
                    value={editing.customWidth ?? 1920}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                  />
                </Field>
                <Field label="الارتفاع بالبكسل">
                  <input
                    type="number"
                    min={10}
                    className="inp font-latin"
                    value={editing.customHeight ?? 1080}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                  />
                </Field>
                <div className="col-span-2 flex items-center justify-between border-t border-black/5 pt-3">
                  <span className="text-xs font-extrabold text-ink/60">تثبيت نسبة التناسب (تناسب طردي ذكي)</span>
                  <Toggle
                    checked={Boolean(editing.lockAspectRatio)}
                    onChange={(v) => setEditing({ ...editing, lockAspectRatio: v })}
                  />
                </div>
              </div>
            )}

            <Field label="العميل">
              <input className="inp" list="clients" value={editing.client} onChange={(e) => setEditing({ ...editing, client: e.target.value })} placeholder="اسم العميل" />
              <datalist id="clients">
                {clients.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>

            <Field label="السنة">
              <input className="inp font-latin" value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
            </Field>

            <Field label="وسوم (افصل بفاصلة)">
              <input className="inp" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="شعار، مطبوعات" />
            </Field>

            <Field label="صورة العمل" className="md:col-span-2">
              <ImagePicker value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} />
            </Field>

            <button
              onClick={persistItem}
              className="chamfer-sm glow-neon mt-2 inline-flex items-center justify-center gap-2 bg-neon px-6 py-3.5 text-sm font-extrabold text-ink md:col-span-2"
            >
              <Save className="h-4 w-4" /> حفظ العمل
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}