import { useRef, useState } from "react";
// استيراد أيقونات الإضافة والصورة من Lucide
import { ImagePlus, Plus, Trash2 } from "lucide-react";
// استيراد دوال توليد المعرفات وإدارة الحالة العامة والتنبيهات
import { uid, useSite, useToast } from "../lib/store";
// استيراد مكونات واجهة المستخدم الموحدة للوحة التحكم
import { AddBtn, Card, DeleteBtn, MoveBtns, PageHead, moveBy } from "./ui";

export default function PartnersManager() {
  const { state, save, remove, reorder } = useSite();
  const { toast } = useToast();

  // حقول إضافة شريك جديد
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(""); // Base64 أو URL
  const fileRef = useRef<HTMLInputElement>(null);

  // تحويل ملف الصورة إلى Base64 لتخزينه مباشرة
  const readImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      // حماية بسيطة: نقبل الصور فقط ونحدد حجمًا معقولًا
      if (!file.type.startsWith("image/")) {
        reject(new Error("الملف يجب أن يكون صورة"));
        return;
      }
      if (file.size > 1.5 * 1024 * 1024) {
        reject(new Error("حجم الشعار كبير — يفضّل أقل من 1.5MB"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("تعذّر قراءة الصورة"));
      reader.readAsDataURL(file);
    });

  // رفع شعار عند إضافة شريك جديد
  const onNewLogo = async (file?: File | null) => {
    if (!file) return;
    try {
      const data = await readImage(file);
      setLogo(data);
    } catch (err) {
      toast(err instanceof Error ? err.message : "تعذّر رفع الشعار", "warn");
    }
  };

  // رفع/تغيير شعار لشريك موجود
  const onExistingLogo = async (partnerId: string, current: { id: string; name: string; logo?: string }, file?: File | null) => {
    if (!file) return;
    try {
      const data = await readImage(file);
      save("partners", { ...current, logo: data });
      toast("تم تحديث شعار الشريك");
    } catch (err) {
      toast(err instanceof Error ? err.message : "تعذّر رفع الشعار", "warn");
    }
  };

  // إضافة شريك جديد
  const add = () => {
    if (!name.trim()) {
      toast("اكتب اسم الشريك أولًا", "warn");
      return;
    }

    save("partners", {
      id: uid(),
      name: name.trim(),
      logo: logo || undefined,
    });

    setName("");
    setLogo("");
    if (fileRef.current) fileRef.current.value = "";
    toast("تمت إضافة الشريك");
  };

  // إعادة ترتيب
  const move = (index: number, delta: number) => {
    reorder(
      "partners",
      moveBy(state.partners, index, delta).map((p) => p.id)
    );
  };

  return (
    <div className="max-w-2xl">
      <PageHead
        title="شركاء النجاح"
        sub="تظهر هذه الأسماء والشعارات في الشريط المتحرك أعلى الصفحة الرئيسية — أعد ترتيبها بالأسهم."
      />

      {/* =========================================================
          صندوق الإضافة السريعة لشريك جديد + شعار
          ========================================================= */}
      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* معاينة/رفع الشعار */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="chamfer-sm relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden border border-dashed border-ink/20 bg-ink/5 text-ink/45 transition-colors hover:border-royal/40 hover:text-royal"
              title="رفع شعار الشريك"
            >
              {logo ? (
                <img src={logo} alt="شعار الشريك" className="h-full w-full object-contain p-1" />
              ) : (
                <ImagePlus className="h-5 w-5" />
              )}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onNewLogo(e.target.files?.[0])}
            />

            {logo && (
              <button
                type="button"
                onClick={() => {
                  setLogo("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="text-xs font-extrabold text-rose-600 hover:underline"
              >
                إزالة الشعار
              </button>
            )}
          </div>

          {/* الاسم + زر الإضافة */}
          <div className="flex min-w-0 flex-1 gap-3">
            <input
              className="inp"
              placeholder="اسم شريك جديد…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <AddBtn onClick={add}>
              <Plus className="h-4 w-4" /> إضافة
            </AddBtn>
          </div>
        </div>

        <p className="mt-3 text-[11px] font-bold leading-5 text-ink/40">
          اختياري: ارفع شعار الشريك (PNG شفاف أفضل). إن لم ترفع شعارًا سيظهر الحرف الأول من الاسم.
        </p>
      </Card>

      {/* =========================================================
          قائمة الشركاء الحالية
          ========================================================= */}
      <div className="mt-4 space-y-3">
        {state.partners.map((p, i) => (
          <Card key={p.id} className="!p-4">
            <div className="flex items-center gap-4">
              <MoveBtns
                onUp={() => move(i, -1)}
                onDown={() => move(i, 1)}
                disableUp={i === 0}
                disableDown={i === state.partners.length - 1}
              />

              {/* شعار الشريك أو الحرف الأول */}
              <label
                className="chamfer-sm relative grid h-11 w-11 shrink-0 cursor-pointer place-items-center overflow-hidden bg-royal/10 text-lg font-black text-royal transition-opacity hover:opacity-80"
                title="تغيير الشعار"
              >
                {p.logo ? (
                  <img src={p.logo} alt={p.name} className="h-full w-full object-contain p-1" />
                ) : (
                  <span>{p.name.trim().charAt(0) || "?"}</span>
                )}

                {/* input مخفي لتغيير شعار شريك موجود */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onExistingLogo(p.id, p, e.target.files?.[0])}
                />
              </label>

              {/* تعديل الاسم */}
              <input
                className="inp"
                value={p.name}
                onChange={(e) => save("partners", { ...p, name: e.target.value })}
              />

              {/* إزالة الشعار فقط (إن وجد) */}
              {p.logo && (
                <button
                  type="button"
                  onClick={() => {
                    save("partners", { ...p, logo: undefined });
                    toast("تم حذف شعار الشريك");
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg text-ink/35 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  title="حذف الشعار"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              {/* حذف الشريك بالكامل */}
              <DeleteBtn
                small
                onConfirm={() => {
                  remove("partners", p.id);
                  toast("تم حذف الشريك");
                }}
              />
            </div>
          </Card>
        ))}

        {state.partners.length === 0 && (
          <Card className="py-14 text-center text-sm font-bold text-ink/40">
            لا يوجد شركاء بعد — أضف أول شريك.
          </Card>
        )}
      </div>
    </div>
  );
}