import { useState } from "react";
// استيراد أيقونات الإجراءات والتحكم بالخدمات من مكتبة Lucide
import { ClipboardList, Eye, EyeOff, Pause, Pencil, Play, Plus, Save } from "lucide-react";
// استيراد دوال التنسيق المالي والمعرفات وإدارة الحالة العامة والتنبيهات
import { fmtPrice, uid, useSite, useToast } from "../lib/store";
import type { Service } from "../lib/types";
// استيراد عناصر واجهة المستخدم الموحدة للوحة التحكم
import { AddBtn, Card, DeleteBtn, Field, ImagePicker, Modal, MoveBtns, PageHead, moveBy } from "./ui";
// استيراد مكون التبديل الثنائي (Toggle)
import { Toggle } from "../components/ui";

// قائمة مقترحات افتراضية لوحدات التسعير
const PRICE_UNITS = ["شهريًا", "للمشروع", "للفيديو", "للموقع", "للقطعة"];

// دالة مساعدة لإنشاء كائن خدمة جديدة بقيم افتراضية أولية
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
  // جلب بيانات الموقع الحالية ودوال الحفظ، الحذف، وإعادة الترتيب من المتجر العام
  const { state, save, remove, reorder } = useSite();
  // خطاف لعرض رسائل التنبيه والتأكيد
  const { toast } = useToast();
  
  // حالة الخدمة الجاري تعديلها أو إنشاؤها (null عند إغلاق النافذة المنبثقة)
  const [editing, setEditing] = useState<Service | null>(null);

  // حالة مؤقتة لحقول النصوص متعددة الأسطر (الوصف الكامل والمزايا)
  const [form, setForm] = useState<{ full: string; features: string }>({ full: "", features: "" });

  // دالة فتح نافذة التعديل وتجهيز النصوص متعددة الأسطر من المصفوفات
  const openEditor = (s: Service) => {
    setEditing(s);
    setForm({ full: s.full.join("\n\n"), features: s.features.join("\n") });
  };

  // دالة بدء إنشاء خدمة جديدة واختيار أول صورة متوفرة كصورة افتراضية
  const startNew = () => openEditor(emptyService(state.services[0]?.image ?? ""));

  // دالة حفظ التعديلات على الخدمة (جديدة أو معدّلة)
  const persist = () => {
    if (!editing) return;
    
    // التحقق من تعبئة عنوان الخدمة
    if (!editing.title.trim()) {
      toast("أدخل عنوان الخدمة أولًا", "warn");
      return;
    }
    
    // تحويل نصوص الفقرات والمزايا إلى مصفوفات نظيفة وتجاهل الأسطر الفارغة
    const full = form.full.split(/\n\s*\n|\n/).map((x) => x.trim()).filter(Boolean);
    const features = form.features.split("\n").map((x) => x.trim()).filter(Boolean);
    
    save("services", { ...editing, full, features });
    toast("تم حفظ الخدمة");
    setEditing(null); // إغلاق نافذة التعديل
  };

  // دالة لتغيير ترتيب الخدمة في القائمة للأعلى أو للأسفل
  const move = (index: number, delta: number) => {
    reorder("services", moveBy(state.services, index, delta).map((s) => s.id));
  };

  return (
    <div>
      {/* رأس الصفحة مع زر إضافة خدمة جديدة */}
      <PageHead
        title="إدارة الخدمات"
        sub="أضف وعدّل الخدمات، الأسعار، الصور، وحالات التوفر — تنعكس مباشرة على الموقع."
        action={
          <AddBtn onClick={startNew}>
            <Plus className="h-4 w-4" /> إضافة خدمة
          </AddBtn>
        }
      />

      {/* =========================================================
          قائمة بطاقات الخدمات الحالية
          ========================================================= */}
      <div className="space-y-3">
        {state.services.map((s, i) => (
          <Card key={s.id} className="!p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* أزرار إعادة الترتيب للأعلى والأسفل */}
              <MoveBtns
                onUp={() => move(i, -1)}
                onDown={() => move(i, 1)}
                disableUp={i === 0}
                disableDown={i === state.services.length - 1}
              />
              
              {/* صورة مصغرة للخدمة */}
              <img src={s.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              
              {/* تفاصيل الخدمة والسعر والأوسمة التوضيحية */}
              <div className="min-w-40 flex-1">
                <h3 className="text-sm font-black text-ink">{s.title}</h3>
                <p className="mt-0.5 text-xs font-bold text-royal">
                  <span className="font-latin">{fmtPrice(s.price)}</span> ر.س / {s.priceUnit}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {/* وسم حالة التوفر (متاحة / متوقفة) */}
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${s.status === "available" ? "bg-neon/25 text-[#3d6300]" : "bg-amber-100 text-amber-700"}`}>
                    {s.status === "available" ? "متاحة" : "متوقفة مؤقتًا"}
                  </span>
                  {/* وسم الإخفاء إذا كانت الخدمة مخفية عن الموقع */}
                  {s.hidden && (
                    <span className="rounded-full bg-ink/8 px-2.5 py-0.5 text-[10px] font-extrabold text-ink/50">مخفية</span>
                  )}
                  {/* وسم يوضح عدد أسئلة البريف المرتبطة بهذه الخدمة */}
                  <span className="rounded-full bg-royal/8 px-2.5 py-0.5 text-[10px] font-extrabold text-royal">
                    بريف: {s.questions.length} سؤال
                  </span>
                </div>
              </div>

              {/* أزرار التحكم السريع المباشرة في كل خدمة */}
              <div className="flex flex-wrap items-center gap-2">
                {/* زر التبديل المباشر بين حالة التوفر والإيقاف المؤقت */}
                <button
                  onClick={() => save("services", { ...s, status: s.status === "available" ? "unavailable" : "available" })}
                  title={s.status === "available" ? "إيقاف مؤقت" : "تفعيل"}
                  className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${
                    s.status === "available"
                      ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                      : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {s.status === "available" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>

                {/* زر التبديل المباشر بين إظهار وإخفاء الخدمة من الموقع */}
                <button
                  onClick={() => save("services", { ...s, hidden: !s.hidden })}
                  title={s.hidden ? "إظهار" : "إخفاء"}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 bg-white text-ink/55 transition-colors hover:border-royal hover:text-royal"
                >
                  {s.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>

                {/* زر فتح نافذة التعديل الكامل */}
                <button
                  onClick={() => openEditor(s)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 bg-white text-ink/55 transition-colors hover:border-royal hover:text-royal"
                  title="تعديل"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                {/* زر حذف الخدمة مع نافذة التأكيد */}
                <DeleteBtn onConfirm={() => { remove("services", s.id); toast("تم حذف الخدمة"); }} />
              </div>
            </div>
          </Card>
        ))}

        {/* رسالة افتراضية عند خلو القائمة من الخدمات */}
        {state.services.length === 0 && (
          <Card className="py-16 text-center text-sm font-bold text-ink/40">لا توجد خدمات بعد — أضف أول خدمة.</Card>
        )}
      </div>

      {/* تنبيه إرشادي يوجه المسؤول لصفحة بناء البريف */}
      <p className="mt-4 flex items-center gap-2 text-xs font-bold text-ink/40">
        <ClipboardList className="h-4 w-4" />
        لتخصيص أسئلة البريف الخاصة بكل خدمة، انتقل إلى تبويب «بناء البريف».
      </p>

      {/* =========================================================
          النافذة المنبثقة (Modal) لإنشاء أو تعديل تفاصيل الخدمة
          ========================================================= */}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing && state.services.some((x) => x.id === editing.id) ? "تعديل خدمة" : "خدمة جديدة"} wide>
        {editing && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* حقل اسم الخدمة */}
            <Field label="اسم الخدمة" className="md:col-span-2">
              <input className="inp" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="مثال: إدارة السوشيال ميديا" />
            </Field>

            {/* حقل الوصف المختصر للبطاقة */}
            <Field label="وصف مختصر (يظهر في البطاقة)" className="md:col-span-2">
              <textarea rows={2} className="inp resize-y" value={editing.short} onChange={(e) => setEditing({ ...editing, short: e.target.value })} />
            </Field>

            {/* حقل الوصف الكامل والمفصل */}
            <Field label="الوصف الكامل (سطر لكل فقرة)" className="md:col-span-2">
              <textarea rows={4} className="inp resize-y" value={form.full} onChange={(e) => setForm({ ...form, full: e.target.value })} />
            </Field>

            {/* حقل مزايا الخدمة وبنودها */}
            <Field label="المزايا (سطر لكل ميزة)" className="md:col-span-2">
              <textarea rows={4} className="inp resize-y" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
            </Field>

            {/* حقل السعر الرقمي */}
            <Field label="السعر (رقم)">
              <input
                type="number"
                min={0}
                className="inp font-latin"
                value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
              />
            </Field>

            {/* حقل وحدة السعر مع قائمة مقترحات تلقائية */}
            <Field label="وحدة السعر">
              <input className="inp" list="price-units" value={editing.priceUnit} onChange={(e) => setEditing({ ...editing, priceUnit: e.target.value })} />
              <datalist id="price-units">
                {PRICE_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </Field>

            {/* حقل اختيار حالة توفر الخدمة */}
            <Field label="حالة التوفر">
              <select
                className="inp"
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as Service["status"] })}
              >
                <option value="available">متاحة</option>
                <option value="unavailable">متوقفة مؤقتًا</option>
              </select>
            </Field>

            {/* مفتاح التبديل لإخفاء الخدمة من الموقع */}
            <div className="flex items-end justify-between gap-3 pb-1">
              <span className="lbl !mb-0">إخفاء الخدمة من الموقع</span>
              <Toggle checked={editing.hidden} onChange={(v) => setEditing({ ...editing, hidden: v })} />
            </div>

            {/* مكون اختيار صورة غلاف الخدمة */}
            <Field label="صورة الخدمة" className="md:col-span-2">
              <ImagePicker value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} />
            </Field>

            {/* زر الحفظ النهائي لبيانات الخدمة */}
            <button
              onClick={persist}
              className="chamfer-sm glow-neon mt-2 inline-flex items-center justify-center gap-2 bg-neon px-6 py-3.5 text-sm font-extrabold text-ink md:col-span-2"
            >
              <Save className="h-4 w-4" /> حفظ الخدمة
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}