import type { CSSProperties } from "react";
import { useSite } from "../lib/store";

export default function Partners({ className = "" }: { className?: string }) {
  const { state } = useSite();
  const items = state.partners;

  if (items.length === 0) return null;

  const copies = items.length >= 6 ? 2 : 4;
  const loop = Array.from({ length: copies }).flatMap(() => items);

  return (
    <div className={`marquee-root relative ${className}`} dir="ltr">
      <div
        className="marquee-track gap-4 px-2 py-1"
        style={{ "--marquee-t": `${Math.max(18, items.length * 4)}s` } as CSSProperties}
      >
        {loop.map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            className="chamfer-sm flex shrink-0 items-center gap-3 border border-white/10 bg-white/[.045] px-7 py-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-neon/40"
          >
            {p.logo ? (
              <img
                src={p.logo}
                alt={p.name}
                className="h-9 w-auto max-w-[120px] object-contain"
              />
            ) : (
              <span className="chamfer-sm grid h-9 w-9 place-items-center bg-neon/15 text-base font-black text-neon">
                {p.name.trim().charAt(0)}
              </span>
            )}
            <span className="whitespace-nowrap text-lg font-extrabold text-paper/85">{p.name}</span>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}