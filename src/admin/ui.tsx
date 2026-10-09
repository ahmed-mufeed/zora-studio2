// استيراد أدوات التحريك والتأثيرات الانتقالية من مكتبة Framer Motion
import { AnimatePresence, motion } from "framer-motion";

// استيراد الأيقونات المساعدة لواجهة المستخدم من مكتبة Lucide
import { ImagePlus, Trash2, X } from "lucide-react";

// استيراد خطافات React الأساسية وتعريف نوع العناصر الأبناء ReactNode
import { useEffect, useRef, useState, type ReactNode } from "react";

// استيراد قائمة الصور والوسائط الافتراضية المدمجة مع النظام
import { BUILTIN_MEDIA } from "../lib/data";

// استيراد دوال إدارة الحالة، التنبيهات السريعة (Toast)، وتوليد المعرفات الفريدة
import { uid, useSite, useToast } from "../lib/store";

/* =========================================================
   1. مكوّن رأس الصفحة (PageHead)
   يعرض عنوان الصفحة، الوصف التوضيحي، وزر الإجراء الاختياري
   ========================================================= */
export function PageHead({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-ink md:text-3xl">{title}</h1>
        {sub && <p className="mt-1.5 text-sm font-semibold text-ink/45">{sub}</p>}
      </div>
      {/* عرض زر الإجراء الإضافي (مثل إضافة عنصر جديد) في حال تمريره */}
      {action}
    </div>
  );
}

/* =========================================================
   2. مكوّن البطاقة الحاضنة (Card)
   حاوية موحدة لتأطير المحتوى مع حدود خفيفة وظلال ناعمة
   ========================================================= */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-black/5 bg-white p-6 shadow-sm ${className}`}>{children}</div>
  );
}

/* =========================================================
   3. زر الإضافة المضيء (AddBtn)
   زر تفاعلي مخصص لعمليات الإضافة مع تأثير توهج لافت
   ========================================================= */
export function AddBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="chamfer-sm glow-neon inline-flex items-center gap-2 bg-neon px-5 py-2.5 text-sm font-extrabold text-ink transition-transform hover:-translate-y-0.5"
    >
      {children}
    </button>
  );
}

/* =========================================================
   4. زر الحذف الذكي ثنائي المراحل (DeleteBtn)
   يمنع الحذف الخاطئ عبر طلب الضغط مرتين متتاليتين للتأكيد
   ========================================================= */
export function DeleteBtn({ onConfirm, small = false }: { onConfirm: () => void; small?: boolean }) {
  // حالة التأهب والتسليح (تصبح true بعد أول نقرة)
  const [armed, setArmed] = useState(false);
  // مرجع لتخزين مؤقت الإلغاء التلقائي
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // تنظيف المؤقت الزمني عند مغادرة المكون لمنع استهلاك الذاكرة
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <button
      type="button"
      onClick={() => {
        if (armed) {
          // الضغطة الثانية: تنفيذ الحذف الفعلي وإلغاء التسليح
          onConfirm();
          setArmed(false);
        } else {
          // الضغطة الأولى: تفعيل حالة التأهب ومؤقت زمني لمدة 2.6 ثانية لإلغائها إن لم يؤكد
          setArmed(true);
          timer.current = setTimeout(() => setArmed(false), 2600);
        }
      }}
      // تغيير ألوان الزر بصرياً إلى الأحمر الفاقع عند تفعيل حالة التأهب
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border text-xs font-extrabold transition-all ${
        armed
          ? "border-rose-500 bg-rose-500 text-white"
          : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
      } ${small ? "h-8 w-8 px-0" : "h-9 px-3"}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
      {!small && (armed ? "تأكيد الحذف" : "حذف")}
    </button>
  );
}

/* =========================================================
   5. مكوّن حقل النموذج (Field)
   تغليف منظم يضع عنوان الحقل فوق عنصر الإدخال
   ========================================================= */
export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="lbl">{label}</label>
      {children}
    </div>
  );
}

/* =========================================================
   6. النافذة المنبثقة التفاعلية (Modal)
   نافذة عائمة لنماذج التعديل مع تأثيرات التعتيم وقفل التمرير
   ========================================================= */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  // تعطيل شريط تمرير الصفحة الخلفية عند فتح النافذة
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        // الخلفية المعتمة والضبابية المحيطة بالنافذة
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm md:p-8"
          onClick={onClose} // إغلاق النافذة عند النقر على الخلفية المعتمة
        >
          {/* جسم النافذة الرئيسي مع حركة الدخول التدريجية */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()} // منع إغلاق النافذة عند النقر داخل محتواها
            className={`my-auto w-full ${wide ? "max-w-3xl" : "max-w-xl"} rounded-3xl bg-white p-6 text-ink shadow-2xl md:p-8`}
          >
            {/* عنوان النافذة وزر الإغلاق العلوي */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black">{title}</h3>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-xl text-ink/40 transition-colors hover:bg-ink/5"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* المحتوى الداخلي الممرر للنافذة المنبثقة */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   7. منتقي الصور ورافع الملفات (ImagePicker)
   يتيح اختيار صورة من النظام أو استعراض المرفوعات أو رفع ملف جديد
   ========================================================= */
export function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const { state, save } = useSite(); // حالة الموقع وحفظ الوسائط
  const { toast } = useToast(); // إشعارات النظام
  const fileRef = useRef<HTMLInputElement>(null); // مرجع لحقل رفع الملفات المخفي
  const uploads = state.media ?? []; // قائمة الصور التي رفعها المستخدم

  // معالجة اختيار ملف صورة وتحويله إلى Base64 للحفظ المحلي
  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      const item = { id: uid(), url };
      save("media", item); // تخزين الصورة المرفوعة في المتجر
      onChange(url); // تعيين الرابط كصورة نشطة ومختارة فوراً
      toast("تم رفع الصورة");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* معاينة الصورة المحددة حالياً */}
      {value && (
        <div className="mb-3 overflow-hidden rounded-xl border border-black/10">
          <img src={value} alt="" className="h-36 w-full object-cover" />
        </div>
      )}

      {/* شبكة الصور المتاحة للاختيار السريع */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {/* استعراض الصور المدمجة افتراضياً مع النظام */}
        {BUILTIN_MEDIA.map((m) => (
          <button
            key={m.id}
            type="button"
            title={m.label}
            onClick={() => onChange(m.url)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
              value === m.url ? "border-neon glow-neon" : "border-transparent hover:border-royal/50"
            }`}
          >
            <img src={m.url} alt={m.label} className="h-full w-full object-cover" />
          </button>
        ))}

        {/* استعراض الصور التي قام المستخدم برفعها محلياً */}
        {uploads.map((m) => (
          <button
            key={m.id}
            type="button"
            title="صورة مرفوعة"
            onClick={() => onChange(m.url)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
              value === m.url ? "border-neon glow-neon" : "border-transparent hover:border-royal/50"
            }`}
          >
            <img src={m.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}

        {/* زر رفع ملف صورة جديدة من الجهاز */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="grid aspect-square place-items-center rounded-lg border-2 border-dashed border-ink/20 text-ink/40 transition-colors hover:border-royal hover:text-royal"
          title="رفع صورة جديدة"
        >
          <ImagePlus className="h-5 w-5" />
        </button>

        {/* حقل اختيار الملف المخفي */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = ""; // تصفير القيمة لإتاحة إعادة رفع نفس الصورة لاحقاً
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   8. أزرار إعادة ترتيب القوائم (MoveBtns)
   أزرار أسهم لنقل العناصر للأعلى أو للأسفل في الترتيب
   ========================================================= */
export function MoveBtns({
  onUp,
  onDown,
  disableUp,
  disableDown,
}: {
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      {/* زر نقل العنصر خطوة للأعلى */}
      <button
        onClick={onUp}
        disabled={disableUp}
        aria-label="أعلى"
        className="grid h-5 w-6 place-items-center rounded border border-ink/10 text-ink/50 transition-colors hover:border-royal hover:text-royal disabled:opacity-25"
      >
<svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth="3">
          <path d="m6 15 6-6 6 6" />
        </svg>

      </button>

      {/* زر نقل العنصر خطوة للأسفل */}
      <button
        onClick={onDown}
        disabled={disableDown}
        aria-label="أسفل"
        className="grid h-5 w-6 place-items-center rounded border border-ink/10 text-ink/50 transition-colors hover:border-royal hover:text-royal disabled:opacity-25"
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth="3"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      
    </div>
  );
}

/* =========================================================
   9. دالة تحريك العناصر المساعدة (moveBy)
   دالة نقية تنقل عنصراً داخل مصفوفة وفق فرق الإزاحة الممرر
   ========================================================= */
export function moveBy<T>(arr: T[], index: number, delta: number): T[] {
  const next = [...arr]; // إنشاء نسخة سطحية لتجنب تعديل المصفوفة الأصلية
  const j = index + delta; // حساب الموقع الجديد
  
  // التحقق من أن الموقع الجديد يقع ضمن حدود المصفوفة
  if (j < 0 || j >= next.length) return next;
  
  // استخراج العنصر ونقله للموقع الجديد
  const [item] = next.splice(index, 1);
  next.splice(j, 0, item);
  
  return next;
}