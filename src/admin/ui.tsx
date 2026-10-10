import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BUILTIN_MEDIA } from "../lib/data";
import { uid, useSite, useToast } from "../lib/store";

// 1. مكوّن رأس الصفحة
export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-ink md:text-3xl">{title}</h1>
        {sub && <p className="mt-1.5 text-sm font-semibold text-ink/45">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// 2. البطاقة الحاضنة
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-black/5 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// 3. زر الإضافة المضيء
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

// 4. زر الحذف ثنائي المراحل (محمي من تسريب الذاكرة)
export function DeleteBtn({ onConfirm, small = false }: { onConfirm: () => void; small?: boolean }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (armed) {
      onConfirm();
      cleanup();
    } else {
      setArmed(true);
      timer.current = window.setTimeout(() => setArmed(false), 2600);
    }
  };

  const cleanup = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setArmed(false);
  };

  useEffect(() => cleanup, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border text-xs font-extrabold transition-all duration-200 ${
        armed ? "border-rose-500 bg-rose-500 text-white" : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
      } ${small ? "h-8 w-8 px-0" : "h-9 px-3"}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
      {!small && (armed ? "تأكيد الحذف" : "حذف")}
    </button>
  );
}

// 5. حقل النموذج
export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="lbl">{label}</label>
      {children}
    </div>
  );
}

// 6. النافذة المنبثقة التفاعلية (سريعة الاستجابة ومعطلة التمرير بذكاء)
export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={`my-auto w-full ${wide ? "max-w-3xl" : "max-w-xl"} rounded-3xl bg-white p-6 text-ink shadow-2xl md:p-8`}
          >
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
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 7. منتقي الصور ورافع الملفات (فائق الخفة وبسيط التخزين)
export function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const { state, save } = useSite();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const uploads = state.media ?? [];

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      save("media", { id: uid(), url });
      onChange(url);
      toast("تم رفع الصورة بنجاح");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {value && (
        <div className="mb-3 overflow-hidden rounded-xl border border-black/10">
          <img src={value} alt="" className="h-36 w-full object-cover" />
        </div>
      )}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {BUILTIN_MEDIA.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.url)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
              value === m.url ? "border-neon glow-neon" : "border-transparent hover:border-royal/50"
            }`}
          >
            <img src={m.url} alt={m.label} className="h-full w-full object-cover" />
          </button>
        ))}
        {uploads.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.url)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
              value === m.url ? "border-neon glow-neon" : "border-transparent hover:border-royal/50"
            }`}
          >
            <img src={m.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="grid aspect-square place-items-center rounded-lg border-2 border-dashed border-ink/20 text-ink/40 transition-colors hover:border-royal hover:text-royal"
        >
          <ImagePlus className="h-5 w-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

// 8. أزرار إعادة الترتيب
export function MoveBtns({ onUp, onDown, disableUp, disableDown }: { onUp: () => void; onDown: () => void; disableUp?: boolean; disableDown?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={onUp}
        disabled={disableUp}
        className="grid h-5 w-6 place-items-center rounded border border-ink/10 text-ink/50 transition-colors hover:border-royal hover:text-royal disabled:opacity-25"
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth="3">
          <path d="m6 15 6-6 6 6" />
        </svg>
      </button>
      <button
        onClick={onDown}
        disabled={disableDown}
        className="grid h-5 w-6 place-items-center rounded border border-ink/10 text-ink/50 transition-colors hover:border-royal hover:text-royal disabled:opacity-25"
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth="3">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}

// 9. دالة تحريك العناصر المساعدة (نسخة نقية وسريعة جداً)
export function moveBy<T>(arr: T[], index: number, delta: number): T[] {
  const next = [...arr];
  const targetIndex = index + delta;
  if (targetIndex >= 0 && targetIndex < next.length) {
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
  }
  return next;
}