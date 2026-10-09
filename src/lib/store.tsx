import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
// استيراد الحالة الابتدائية للموقع
import { initialState } from "./data";
import type { CollKey, SiteContent, SiteState, Settings } from "./types";

/* ================================================================== */
/* 1. الدوال المساعدة العامة (Helper Utilities)                       */
/* ================================================================== */

// توليد معرّف فريد يعتمد على الوقت الحالي وأرقام عشوائية بصيغة Base36
export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// تنسيق الأرقام والأسعار بإضافة فواصل الآلاف (مثال: 1,500)
export const fmtPrice = (n: number) => n.toLocaleString("en-US");

// توليد رابط محادثة واتساب مباشر مع تنظيف الرقم من أي رموز وتشفير نص الرسالة
export const waLink = (num: string, text: string) =>
  `https://wa.me/${num.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

// مفتاح التخزين الموحد في الذاكرة المحلية للمتصفح
const STORAGE_KEY = "zora-cms-v1";

// نوع يضمن أن أي عنصر في المجموعات يمتلك خاصية المعرف الفريد
type Entity = { id: string };

// دالة مساعدة لتحديث عنصر إذا كان موجوداً مسبقاً أو إضافته في نهاية المصفوفة إن كان جديداً
function upsert<T extends Entity>(arr: T[], item: T): T[] {
  const i = arr.findIndex((x) => x.id === item.id);
  if (i === -1) return [...arr, item];
  const next = arr.slice();
  next[i] = item;
  return next;
}

// دالة تحميل البيانات المخزنة من المتصفح مع دمجها بالأصل الافتراضي لتفادي أخطاء الحقول المفقودة
function loadState(): SiteState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const stored = JSON.parse(raw) as Partial<SiteState>;
    return {
      ...initialState,
      ...stored,
      content: { ...initialState.content, ...(stored.content ?? {}) },
      settings: {
        ...initialState.settings,
        ...(stored.settings ?? {}),
        sections: { ...initialState.settings.sections, ...(stored.settings?.sections ?? {}) },
      },
    };
  } catch {
    // في حال حدوث أي خطأ في قراءة الذاكرة يتم الرجوع للحالة الافتراضية
    return initialState;
  }
}

/* ================================================================== */
/* 2. مزود حالة الموقع المركزي (Site Store Context)                   */
/* ================================================================== */

// تعريف واجهة الدوال والبيانات المتاحة لمكونات الموقع
interface SiteApi {
  state: SiteState;
  updateContent: (patch: Partial<SiteContent>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  save: <K extends CollKey>(coll: K, item: SiteState[K][number]) => void;
  remove: (coll: CollKey, id: string) => void;
  reorder: (coll: CollKey, ids: string[]) => void;
  resetAll: () => void;
  persisted: boolean;
}

const SiteCtx = createContext<SiteApi | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  // حالة الموقع الشاملة مع تعيين القيمة الابتدائية من دالة loadState
  const [state, setState] = useState<SiteState>(loadState);
  // حالة مراقبة نجاح الحفظ في التخزين المحلي
  const [persisted, setPersisted] = useState(true);

  // حفظ تلقائي في localStorage عند حدوث أي تعديل على الحالة
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setPersisted(true);
    } catch {
      // تفشل العملية في حال امتلاء الذاكرة المحلية في المتصفح
      setPersisted(false);
    }
  }, [state]);

  // دالة تحديث النصوص والمحتوى بشكل جزئي
  const updateContent = useCallback(
    (patch: Partial<SiteContent>) => setState((s) => ({ ...s, content: { ...s.content, ...patch } })),
    []
  );

  // دالة تحديث إعدادات الموقع وقنوات التواصل
  const updateSettings = useCallback(
    (patch: Partial<Settings>) =>
      setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
    []
  );

  // دالة حفظ أو تعديل عنصر داخل أي مجموعة (خدمات، أعمال، شركاء، آراء...)
  const save = useCallback(
    <K extends CollKey>(coll: K, item: SiteState[K][number]) =>
      setState((s) => ({ ...s, [coll]: upsert(s[coll] as Entity[], item as Entity) }) as SiteState),
    []
  );

  // دالة حذف عنصر من مجموعة معينة بواسطة معرفه الفريد
  const remove = useCallback(
    (coll: CollKey, id: string) =>
      setState(
        (s) =>
          ({
            ...s,
            [coll]: (s[coll] as Entity[]).filter((x) => x.id !== id),
          }) as SiteState
      ),
    []
  );

  // دالة إعادة ترتيب عناصر مجموعة معينة بناءً على مصفوفة معرّفات مرتبة
  const reorder = useCallback(
    (coll: CollKey, ids: string[]) =>
      setState((s) => {
        const items = s[coll] as Entity[];
        const sorted = [...items].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
        return { ...s, [coll]: sorted } as SiteState;
      }),
    []
  );

  // استعادة ضبط المصنع وحذف التعديلات المحفوظة
  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, []);

  // تجميع دوال ومخرجات السياق مع تحسين الأداء عبر useMemo
  const api = useMemo(
    () => ({ state, updateContent, updateSettings, save, remove, reorder, resetAll, persisted }),
    [state, updateContent, updateSettings, save, remove, reorder, resetAll, persisted]
  );

  return <SiteCtx.Provider value={api}>{children}</SiteCtx.Provider>;
}

// خطاف مخصص لاستهلاك بيانات الموقع في أي مكوّن
export function useSite() {
  const ctx = useContext(SiteCtx);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

/* ================================================================== */
/* 3. نظام محاكاة الصلاحيات والأدوار (Role Auth Simulation)           */
/* ================================================================== */

export type Role = "visitor" | "admin" | null;

interface RoleApi {
  role: Role;
  choose: (r: Exclude<Role, null>) => void;
  exit: () => void;
}

const RoleCtx = createContext<RoleApi | null>(null);
const ROLE_KEY = "zora-role";

export function RoleProvider({ children }: { children: ReactNode }) {
  // جلب الدور المخزن في sessionStorage عند فتح الصفحة
  const [role, setRole] = useState<Role>(() => {
    try {
      const r = sessionStorage.getItem(ROLE_KEY);
      return r === "admin" || r === "visitor" ? r : null;
    } catch {
      return null;
    }
  });

  // تعيين الدور الحالي وحفظه في جلسة التصفح
  const choose = useCallback((r: Exclude<Role, null>) => {
    setRole(r);
    try {
      sessionStorage.setItem(ROLE_KEY, r);
    } catch {
      /* في حال وضع التصفح الخفي المتشدد */
    }
  }, []);

  // تسجيل الخروج وإلغاء الدور
  const exit = useCallback(() => {
    setRole(null);
    try {
      sessionStorage.removeItem(ROLE_KEY);
    } catch {
      /* تجاهل الأخطاء */
    }
  }, []);

  const api = useMemo(() => ({ role, choose, exit }), [role, choose, exit]);
  return <RoleCtx.Provider value={api}>{children}</RoleCtx.Provider>;
}

// خطاف مخصص لاستهلاك حالة الدور والصلاحية
export function useRole() {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}

/* ================================================================== */
/* 4. نظام التنبيهات والإشعارات السريعة (Toast System)                */
/* ================================================================== */

interface Toast {
  id: string;
  msg: string;
  tone: "ok" | "warn";
}

interface ToastApi {
  toasts: Toast[];
  toast: (msg: string, tone?: "ok" | "warn") => void;
}

const ToastCtx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // دالة إطلاق إشعار جديد مع حصر القائمة بآخر 3 إشعارات وتفعيل مؤقت الإخفاء
  const toast = useCallback((msg: string, tone: "ok" | "warn" = "ok") => {
    const id = uid();
    setToasts((t) => [...t.slice(-3), { id, msg, tone }]);
    
    // إزالة التنبيه تلقائياً بعد مرور 3.2 ثانية
    const timer = setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
    timers.current.push(timer);
  }, []);

  const api = useMemo(() => ({ toasts, toast }), [toasts, toast]);
  return <ToastCtx.Provider value={api}>{children}</ToastCtx.Provider>;
}

// خطاف مخصص لإطلاق التنبيهات من أي صفحة أو مكوّن
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}