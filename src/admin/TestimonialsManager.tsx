import { useState } from "react";
// استيراد أيقونات الإجراءات (تعديل، إضافة، حفظ) من مكتبة Lucide
import { Pencil, Plus, Save } from "lucide-react";
// استيراد دوال توليد المعرفات وإدارة الحالة العامة والتنبيهات
import { uid, useSite, useToast } from "../lib/store";
import type { Testimonial } from "../lib/types";
// استيراد مكونات واجهة المستخدم التفاعلية (عرض النجوم ومفتاح التبديل)
import { Stars, Toggle } from "../components/ui";
// استيراد عناصر واجهة لوحة التحكم المشتركة
import { AddBtn, Card, DeleteBtn, Field, Modal, PageHead } from "./ui";

// قائمة خيارات التقييم المتاحة (من 3 إلى 5 مع أنصاف النجوم)
const RATINGS = ["5", "4.5", "4", "3.5", "3"];

// دالة مساعدة لإنشاء كائن رأي عميل جديد بقيم افتراضية أولية
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
  // جلب بيانات الموقع ودوال الحفظ والحذف من المتجر العام
  const { state, save, remove } = useSite();
  // خطاف لعرض رسائل التنبيه والتأكيد
  const { toast } = useToast();
  // حالة الرأي الجاري تعديله أو إنشاؤه (null في حال إغلاق النافذة المنبثقة)
  const [editing, setEditing] = useState<Testimonial | null>(null);

  // دالة حفظ الرأي (إضافة جديد أو تعديل حالي) مع التحقق من صحة البيانات
  const persist = () => {
    if (!editing) return;
    
    // منع الحفظ في حال عدم تعبئة اسم العميل أو نص الشهادة
    if (!editing.name.trim() || !editing.text.trim()) {
      toast("أدخل اسم العميل ونص الرأي", "warn");
      return;
    }
    
    save("testimonials", editing);
    toast("تم حفظ الرأي");
    setEditing(null); // إغلاق النافذة المنبثقة بعد الحفظ
  };

  return (
    <div>
      {/* رأس الصفحة مع زر إضافة رأي جديد */}
      <PageHead
        title="آراء العملاء"
        sub="اعتماد وإظهار وإخفاء شهادات العملاء — المعتمدة فقط تظهر على الموقع."
        action={
          <AddBtn onClick={() => setEditing(emptyT())}>
            <Plus className="h-4 w-4" /> إضافة رأي
          </AddBtn>
        }
      />

      {/* =========================================================
          شبكة عرض بطاقات آراء العملاء الحالية
          ========================================================= */}
      <div className="grid gap-4 lg:grid-cols-2">
        {state.testimonials.map((t) => (
          <Card key={t.id} className="!p-5">
            {/* الهيدر العلوي للبطاقة: شارة الاسم + بيانات العميل + مفتاح الإظهار */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* شارة دائرية تستخرج الحرف الأول من اسم العميل */}
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-royal text-lg font-black text-white">
                  {t.name.trim().charAt(0) || "؟"}
                </span>
                <div>
                  <h3 className="text-sm font-black text-ink">{t.name}</h3>
                  <p className="text-xs font-bold text-ink/45">
                    {t.role} — {t.company}
                  </p>
                  {/* عرض التقييم بالنجوم */}
                  <div className="mt-1">
                    <Stars rating={t.rating} />
                  </div>
                </div>
              </div>
              {/* مفتاح تبديل الاعتماد والظهور المباشر على الموقع */}
              <Toggle checked={t.visible} onChange={(v) => save("testimonials", { ...t, visible: v })} />
            </div>

            {/* نص الشهادة مع قصه في سطرين في وضع المعاينة */}
            <p className="mt-3 line-clamp-2 text-sm font-semibold leading-7 text-ink/55">"{t.text}"</p>

            {/* أزرار التعديل والحذف في أسفل البطاقة */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditing(t)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-ink/10 px-3 text-xs font-extrabold text-ink/55 transition-colors hover:border-royal hover:text-royal"
              >
                <Pencil className="h-3.5 w-3.5" /> تعديل
              </button>
              <DeleteBtn onConfirm={() => { remove("testimonials", t.id); toast("تم حذف الرأي"); }} />
            </div>
          </Card>
        ))}

        {/* رسالة افتراضية عند خلو القائمة من الآراء */}
        {state.testimonials.length === 0 && (
          <Card className="col-span-full py-16 text-center text-sm font-bold text-ink/40">لا توجد آراء بعد — أضف أول رأي.</Card>
        )}
      </div>

      {/* =========================================================
          النافذة المنبثقة (Modal) لإنشاء أو تعديل رأي العميل
          ========================================================= */}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing && state.testimonials.some((x) => x.id === editing.id) ? "تعديل رأي عميل" : "رأي عميل جديد"}>
        {editing && (
          <div className="space-y-4">
            {/* حقل اسم العميل */}
            <Field label="اسم العميل">
              <input className="inp" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>

            {/* حقول المنصب والشركة جنباً إلى جنب */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="المنصب">
                <input className="inp" value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="مديرة التسويق" />
              </Field>
              <Field label="الشركة">
                <input className="inp" value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} placeholder="اسم الشركة" />
              </Field>
            </div>

            {/* القائمة المنسدلة لاختيار التقييم بالنجوم */}
            <Field label="التقييم">
              <select
                className="inp font-latin"
                value={String(editing.rating)}
                onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
              >
                {RATINGS.map((r) => (
                  <option key={r} value={r}>{r} / 5</option>
                ))}
              </select>
            </Field>

            {/* حقل كتابة نص رأي العميل */}
            <Field label="نص الرأي">
              <textarea rows={4} className="inp resize-y" value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} />
            </Field>

            {/* مفتاح اعتماد الرأي وإظهاره على الموقع */}
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
              <span className="text-sm font-extrabold text-ink/60">معتمد وظاهر على الموقع</span>
              <Toggle checked={editing.visible} onChange={(v) => setEditing({ ...editing, visible: v })} />
            </div>

            {/* زر الحفظ النهائي لبيانات الرأي */}
            <button
              onClick={persist}
              className="chamfer-sm glow-neon flex w-full items-center justify-center gap-2 bg-neon px-6 py-3.5 text-sm font-extrabold text-ink"
            >
              <Save className="h-4 w-4" /> حفظ الرأي
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}