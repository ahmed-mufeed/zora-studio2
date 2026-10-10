import { useRef, useState } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { uid, useSite, useToast } from "../lib/store";
import { AddBtn, Card, DeleteBtn, MoveBtns, PageHead, moveBy } from "./ui";

export default function PartnersManager() {
  const { state, save, remove, reorder } = useSite();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const readImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) return reject(new Error("الملف يجب أن يكون صورة"));
      if (file.size > 1.5 * 1024 * 1024) return reject(new Error("حجم الشعار كبير — يفضّل أقل من 1.5MB"));

      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("تعذّر قراءة الصورة"));
      reader.readAsDataURL(file);
    });

  const onNewLogo = async (file?: File | null) => {
    if (!file) return;
    try {
      const data = await readImage(file);
      setLogo(data);
    } catch (err) {
      toast(err instanceof Error ? err.message : "تعذّر رفع الشعار", "warn");
    }
  };

  const onExistingLogo = async (partner: any, file?: File | null) => {
    if (!file) return;
    try {
      const data = await readImage(file);
      save("partners", { ...partner, logo: data });
      toast("تم تحديث الشعار");
    } catch (err) {
      toast(err instanceof Error ? err.message : "تعذّر رفع الشعار", "warn");
    }
  };

  const add = () => {
    if (!name.trim()) return toast("اكتب اسم الشريك أولًا", "warn");
    save("partners", { id: uid(), name: name.trim(), logo: logo || undefined });
    setName("");
    setLogo("");
    if (fileRef.current) fileRef.current.value = "";
    toast("تمت إضافة الشريك");
  };

  const move = (index: number, delta: number) => {
    reorder("partners", moveBy(state.partners, index, delta).map((p) => p.id));
  };

  return (
    <div className="max-w-2xl">
      <PageHead title="شركاء النجاح" sub="تظهر الأسماء والشعارات في الشريط المتحرك بالصفحة الرئيسية." />

      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="chamfer-sm relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden border border-dashed border-ink/20 bg-ink/5 text-ink/45 hover:border-royal/40"
            >
              {logo ? <img src={logo} alt="" className="h-full w-full object-contain p-1" /> : <ImagePlus className="h-5 w-5" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onNewLogo(e.target.files?.[0])} />
            {logo && (
              <button type="button" onClick={() => { setLogo(""); if (fileRef.current) fileRef.current.value = ""; }} className="text-xs font-extrabold text-rose-600">
                إزالة
              </button>
            )}
          </div>

          <div className="flex min-w-0 flex-1 gap-3">
            <input className="inp" placeholder="اسم شريك جديد…" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
            <AddBtn onClick={add}><Plus className="h-4 w-4" /> إضافة</AddBtn>
          </div>
        </div>
      </Card>

      <div className="mt-4 space-y-3">
        {state.partners.map((p, i) => (
          <Card key={p.id} className="!p-4">
            <div className="flex items-center gap-4">
              <MoveBtns onUp={() => move(i, -1)} onDown={() => move(i, 1)} disableUp={i === 0} disableDown={i === state.partners.length - 1} />
              <label className="chamfer-sm relative grid h-11 w-11 shrink-0 cursor-pointer place-items-center overflow-hidden bg-royal/10 text-lg font-black text-royal">
                {p.logo ? <img src={p.logo} alt="" className="h-full w-full object-contain p-1" /> : <span>{p.name.charAt(0)}</span>}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onExistingLogo(p, e.target.files?.[0])} />
              </label>
              <input className="inp" value={p.name} onChange={(e) => save("partners", { ...p, name: e.target.value })} />
              {p.logo && (
                <button type="button" onClick={() => save("partners", { ...p, logo: undefined })} className="grid h-9 w-9 place-items-center rounded-lg text-ink/35 hover:text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <DeleteBtn small onConfirm={() => { remove("partners", p.id); toast("تم حذف الشريك"); }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}