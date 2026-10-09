import { useMemo, useState, type ReactNode } from "react";
// استيراد أيقونات المجلد والمستخدم للتبديل بين وضعي الفلترة
import { FolderOpen, User } from "lucide-react";
// استيراد مكون خلفية البرق الجمالية
import Lightning from "../components/Lightning";
// استيراد مكونات الشارة وحركات الظهور
import { Chip, Reveal } from "../components/ui";
// استيراد خطاف حالة الموقع لجلب بيانات المشاريع والفئات
import { useSite } from "../lib/store";
import type { PortfolioItem } from "../lib/types";

// تحديد وضعي الفلترة المتاحين في الصفحة: حسب الفئة أو حسب العميل
type Mode = "category" | "client";

// دالة مساعدة لتحويل نسبة المقاس المحددة للمشروع إلى CSS Aspect Ratio ديناميكي
const getAspectStyle = (w: PortfolioItem): React.CSSProperties => {
  if (w.aspectRatio === "custom" && w.customWidth && w.customHeight) {
    return { aspectRatio: `${w.customWidth} / ${w.customHeight}` };
  }
  const ratios: Record<string, string> = {
    square: "1 / 1",
    portrait: "4 / 5",
    landscape: "4 / 3",
    widescreen: "16 / 9",
    story: "9 / 16",
    banner: "3 / 1",
  };
  if (w.aspectRatio && ratios[w.aspectRatio]) {
    return { aspectRatio: ratios[w.aspectRatio] };
  }
  return { aspectRatio: "auto" };
};

export default function Portfolio() {
  const { state } = useSite();
  const [mode, setMode] = useState<Mode>("category");
  const [filter, setFilter] = useState<string>("all");

  const clients = useMemo(
    () => Array.from(new Set(state.portfolio.map((w) => w.client))),
    [state.portfolio]
  );

  const options: { id: string; name: string }[] =
    mode === "category" ? state.categories : clients.map((c) => ({ id: c, name: c }));

  const works = useMemo(() => {
    if (filter === "all") return state.portfolio;
    return mode === "category"
      ? state.portfolio.filter((w) => w.categoryId === filter)
      : state.portfolio.filter((w) => w.client === filter);
  }, [state.portfolio, filter, mode]);

  const catName = (id: string) => state.categories.find((c) => c.id === id)?.name ?? "عام";

  const switchMode = (m: Mode) => {
    setMode(m);
    setFilter("all");
  };

  return (
    <main className="bg-ink">
      <section className="relative overflow-hidden pb-20 pt-40">
        <Lightning />
        <div className="relative z-10 mx-auto max-w-7xl px-5 text-center">
          <Chip>معرض أعمالنا</Chip>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-black leading-[1.2] text-paper md:text-6xl md:leading-[1.15]">
            أعمالٌ نفخر بها، <span className="text-neon">ونتائج تتحدث</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base font-semibold leading-8 text-paper/55 md:text-lg">
            تصفّح مشاريعنا حسب نوع العمل أو حسب العميل — كل مشروع قصة نجاح مختلفة.
          </p>

          <div className="mt-10 inline-flex rounded-2xl border border-white/10 bg-white/[.04] p-1.5 backdrop-blur">
            {(
              [
                { m: "category" as Mode, label: "حسب الفئة", icon: FolderOpen },
                { m: "client" as Mode, label: "حسب العميل", icon: User },
              ] as const
            ).map(({ m, label, icon: Icon }) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition-all duration-300 ${
                  mode === m ? "bg-neon text-ink glow-neon" : "text-paper/55 hover:text-paper"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="slant-r bg-paper pb-28 pt-20 text-ink md:pt-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              الكل <span className="font-latin text-[11px] opacity-70">({state.portfolio.length})</span>
            </FilterChip>
            {options.map((o) => {
              const count =
                mode === "category"
                  ? state.portfolio.filter((w) => w.categoryId === o.id).length
                  : state.portfolio.filter((w) => w.client === o.id).length;
              if (count === 0) return null;
              return (
                <FilterChip key={o.id} active={filter === o.id} onClick={() => setFilter(o.id)}>
                  {o.name} <span className="font-latin text-[11px] opacity-70">({count})</span>
                </FilterChip>
              );
            })}
          </div>

          {works.length === 0 ? (
            <p className="py-24 text-center text-lg font-bold text-ink/40">لا توجد أعمال مطابقة لهذا التصنيف.</p>
          ) : (
            <div key={`${mode}-${filter}`} className="mt-10 columns-2 gap-5 lg:columns-3 [&>*]:mb-5">
              {works.map((w, i) => (
                <Reveal key={w.id} delay={0.04 * Math.min(i, 8)} className="break-inside-avoid">
                  <article className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white">
                    <img
                      src={w.image}
                      alt={w.title}
                      loading="lazy"
                      style={getAspectStyle(w)}
                      className="w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/15 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="chamfer-sm bg-neon px-2.5 py-1 text-[10px] font-black text-ink">
                        {catName(w.categoryId)}
                      </span>
                      <p className="mt-2.5 text-xs font-bold text-paper/60">{w.client}</p>
                    </div>
                    <div className="flex items-start justify-between gap-3 p-5">
                      <div>
                        <h3 className="text-[15px] font-black leading-snug">{w.title}</h3>
                        <p className="mt-1 text-xs font-bold text-ink/45">
                          {w.client} · <span className="font-latin">{w.year}</span>
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`chamfer-sm px-4 py-2.5 text-sm font-extrabold transition-all duration-300 ${
        active ? "bg-royal text-white glow-royal" : "border border-ink/15 bg-white text-ink/60 hover:border-royal/50 hover:text-royal"
      }`}
    >
      {children}
    </button>
  );
}