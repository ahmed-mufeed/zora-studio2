import { useState } from "react";
// استيراد الأيقونات المستخدمة في أزرار الإجراءات (فتح، تعديل، إضافة، حفظ)
import { ExternalLink, Pencil, Plus, Save } from "lucide-react";
// استيراد مولّد المعرفات الفريدة وخطافي الحالة العامة والتنبيهات
import { uid, useSite, useToast } from "../lib/store";
import type { CustomPage } from "../lib/types";
// استيراد مكون التبديل الثنائي (Toggle Switch)
import { Toggle } from "../components/ui";
// استيراد عناصر واجهة المستخدم المشتركة للوحة التحكم
import { AddBtn, Card, DeleteBtn, Field, Modal, PageHead } from "./ui";

// دالة تُنشئ كائن صفحة جديدة بقيم افتراضية فارغة ورابط مؤقت فريد مبني على الوقت الحالي
const emptyPage = (): CustomPage => ({
  id: uid(),
  title: "",
  slug: `page-${Date.now().toString(36)}`,
  body: "",
  visible: true,
});

export default function PagesManager() {
  // جلب حالة الموقع ودالتي الحفظ والحذف من المتجر العام
  const { state, save, remove } = useSite();
  // خطاف لعرض رسائل التنبيه التفاعلية
  const { toast } = useToast();
  // حالة الصفحة الجاري تعديلها أو إنشاؤها (null عند عدم وجود نافذة تعديل مفتوحة)
  const [editing, setEditing] = useState<CustomPage | null>(null);

  // دالة الحفظ النهائي للصفحة (جديدة أو معدّلة)
  const persist = () => {
    if (!editing) return;

    // منع الحفظ بدون عنوان
    if (!editing.title.trim()) {
      toast("أدخل عنوان الصفحة", "warn");
      return;
    }

    // تنظيف الرابط: إزالة الفراغات الطرفية واستبدال المسافات الداخلية بشرطات
    // وفي حال كان فارغاً يُولّد رابط افتراضي فريد
    const slug = editing.slug.trim().replace(/\s+/g, "-") || `page-${Date.now().toString(36)}`;

    save("pages", { ...editing, slug });
    toast("تم حفظ الصفحة");
    setEditing(null); // إغلاق نافذة التعديل
  };

  return (
    <div className="max-w-3xl">
      {/* رأس الصفحة مع زر إنشاء صفحة جديدة */}
      <PageHead
        title="إدارة الصفحات"
        sub="أنشئ صفحات بسيطة (عن الاستوديو، سياسة الخصوصية…) تظهر تلقائيًا في القائمة والفوتر."
        action={
          <AddBtn onClick={() => setEditing(emptyPage())}>
            <Plus className="h-4 w-4" /> صفحة جديدة
          </AddBtn>
        }
      />

      {/* =========================================================
          قائمة الصفحات المخصصة الحالية
          ========================================================= */}
      <div className="space-y-3">
        {state.pages.map((p) => (
          <Card key={p.id} className="!p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* شارة تعريفية ثابتة تدل على أن العنصر صفحة */}
              <span className="chamfer-sm grid h-11 w-11 shrink-0 place-items-center bg-royal/10 text-sm font-black text-royal">
                صف
              </span>

              {/* عنوان الصفحة ورابطها النهائي */}
              <div className="min-w-40 flex-1">
                <h3 className="text-sm font-black text-ink">{p.title}</h3>
                <p className="mt-0.5 font-latin text-xs font-bold text-ink/40" dir="ltr">/p/{p.slug}</p>
              </div>

              {/* أزرار الإجراءات: فتح الصفحة، تعديل، حذف، ومفتاح الإظهار */}
              <div className="flex items-center gap-2">
                {/* فتح الصفحة في تبويب جديد كما يراها الزائر */}
                <a
                  href={`#/p/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 text-ink/55 transition-colors hover:border-royal hover:text-royal"
                  title="فتح الصفحة"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                {/* فتح نافذة التعديل محمّلة ببيانات الصفحة */}
                <button
                  onClick={() => setEditing(p)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 text-ink/55 transition-colors hover:border-royal hover:text-royal"
                  title="تعديل"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {/* حذف الصفحة بعد التأكيد */}
                <DeleteBtn small onConfirm={() => { remove("pages", p.id); toast("تم حذف الصفحة"); }} />
                {/* إظهار/إخفاء الصفحة مباشرة من القائمة دون فتح نافذة التعديل */}
                <Toggle checked={p.visible} onChange={(v) => save("pages", { ...p, visible: v })} />
              </div>
            </div>
          </Card>
        ))}

        {/* رسالة افتراضية تظهر عند عدم وجود أي صفحات مخصصة */}
        {state.pages.length === 0 && (
          <Card className="py-16 text-center text-sm font-bold text-ink/40">
            لا توجد صفحات مخصصة — أنشئ أول صفحة بنقرة واحدة.
          </Card>
        )}
      </div>

      {/* =========================================================
          النافذة المنبثقة (Modal) لإنشاء أو تعديل صفحة
          العنوان يتغير حسب كون الصفحة موجودة مسبقاً أم جديدة
          ========================================================= */}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing && state.pages.some((x) => x.id === editing.id) ? "تعديل صفحة" : "صفحة جديدة"} wide>
        {editing && (
          <div className="space-y-4">
            {/* عنوان الصفحة + الرابط المختصر جنباً إلى جنب */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="عنوان الصفحة">
                <input className="inp" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="مثال: من نحن" />
              </Field>
              {/* حقل الرابط باتجاه من اليسار لليمين لأنه بأحرف لاتينية */}
              <Field label="الرابط (slug)">
                <input className="inp font-latin" dir="ltr" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="about-us" />
              </Field>
            </div>

            {/* محرر نص المحتوى الكامل للصفحة */}
            <Field label="محتوى الصفحة (افصل الفقرات بسطر فارغ)">
              <textarea rows={10} className="inp resize-y" value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} placeholder="اكتب محتوى الصفحة هنا…" />
            </Field>

            {/* مفتاح التحكم في ظهور الصفحة للزوار */}
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
              <span className="text-sm font-extrabold text-ink/60">ظاهرة على الموقع</span>
              <Toggle checked={editing.visible} onChange={(v) => setEditing({ ...editing, visible: v })} />
            </div>

            {/* زر الحفظ النهائي مع التحقق من البيانات */}
            <button
              onClick={persist}
              className="chamfer-sm glow-neon flex w-full items-center justify-center gap-2 bg-neon px-6 py-3.5 text-sm font-extrabold text-ink"
            >
              <Save className="h-4 w-4" /> حفظ الصفحة
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}