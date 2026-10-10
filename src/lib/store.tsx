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
import { initialState } from "./data";
import type { CollKey, SiteContent, SiteState, Settings } from "./types";

export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const fmtPrice = (n: number) => n.toLocaleString("en-US");

export const waLink = (num: string, text: string) =>
  `https://wa.me/${num.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

const STORAGE_KEY = "zora-cms-v1";

type Entity = { id: string };

function upsert<T extends Entity>(arr: T[], item: T): T[] {
  const i = arr.findIndex((x) => x.id === item.id);
  if (i === -1) return [...arr, item];
  const next = arr.slice();
  next[i] = item;
  return next;
}

function loadState(): SiteState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const s = JSON.parse(raw) as Partial<SiteState>;
    return {
      ...initialState,
      ...s,
      content: { ...initialState.content, ...(s.content ?? {}) },
      settings: {
        ...initialState.settings,
        ...(s.settings ?? {}),
        sections: { ...initialState.settings.sections, ...(s.settings?.sections ?? {}) },
      },
      services: s.services?.length ? s.services : initialState.services,
      portfolio: s.portfolio?.length ? s.portfolio : initialState.portfolio,
      categories: s.categories?.length ? s.categories : initialState.categories,
      testimonials: s.testimonials?.length ? s.testimonials : initialState.testimonials,
      partners: s.partners?.length ? s.partners : initialState.partners,
    };
  } catch {
    return initialState;
  }
}

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
  const [state, setState] = useState<SiteState>(loadState);
  const [persisted, setPersisted] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setPersisted(true);
    } catch {
      setPersisted(false);
    }
  }, [state]);

  const updateContent = useCallback(
    (patch: Partial<SiteContent>) =>
      setState((s) => ({ ...s, content: { ...s.content, ...patch } })),
    []
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) =>
      setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
    []
  );

  const save = useCallback(
    <K extends CollKey>(coll: K, item: SiteState[K][number]) =>
      setState((s) => ({
        ...s,
        [coll]: upsert(s[coll] as Entity[], item as Entity),
      }) as SiteState),
    []
  );

  const remove = useCallback(
    (coll: CollKey, id: string) =>
      setState((s) => ({
        ...s,
        [coll]: (s[coll] as Entity[]).filter((x) => x.id !== id),
      }) as SiteState),
    []
  );

  const reorder = useCallback(
    (coll: CollKey, ids: string[]) =>
      setState((s) => {
        const order = new Map(ids.map((id, i) => [id, i]));
        const sorted = [...(s[coll] as Entity[])].sort(
          (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
        );
        return { ...s, [coll]: sorted } as SiteState;
      }),
    []
  );

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, []);

  const api = useMemo<SiteApi>(
    () => ({ state, updateContent, updateSettings, save, remove, reorder, resetAll, persisted }),
    [state, updateContent, updateSettings, save, remove, reorder, resetAll, persisted]
  );

  return <SiteCtx.Provider value={api}>{children}</SiteCtx.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteCtx);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

export type Role = "visitor" | "admin" | null;

interface RoleApi {
  role: Role;
  choose: (r: Exclude<Role, null>) => void;
  exit: () => void;
}

const RoleCtx = createContext<RoleApi | null>(null);
const ROLE_KEY = "zora-role";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    try {
      const r = sessionStorage.getItem(ROLE_KEY);
      return r === "admin" || r === "visitor" ? r : null;
    } catch {
      return null;
    }
  });

  const choose = useCallback((r: Exclude<Role, null>) => {
    setRole(r);
    try {
      sessionStorage.setItem(ROLE_KEY, r);
    } catch {
      /* */
    }
  }, []);

  const exit = useCallback(() => {
    setRole(null);
    try {
      sessionStorage.removeItem(ROLE_KEY);
    } catch {
      /* */
    }
  }, []);

  const api = useMemo(() => ({ role, choose, exit }), [role, choose, exit]);
  return <RoleCtx.Provider value={api}>{children}</RoleCtx.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}

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
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach(clearTimeout);
      t.clear();
    };
  }, []);

  const toast = useCallback((msg: string, tone: "ok" | "warn" = "ok") => {
    const id = uid();
    setToasts((t) => [...t.slice(-2), { id, msg, tone }]);

    const timer = setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
      timers.current.delete(timer);
    }, 3200);

    timers.current.add(timer);
  }, []);

  const api = useMemo(() => ({ toasts, toast }), [toasts, toast]);
  return <ToastCtx.Provider value={api}>{children}</ToastCtx.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}