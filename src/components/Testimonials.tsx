import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Stars } from "./ui";
import { useSite } from "../lib/store";

export default function Testimonials() {
  const { state } = useSite();
  const list = state.testimonials.filter((t) => t.visible);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx((i) => (list.length === 0 ? 0 : i % Math.max(1, list.length)));
  }, [list.length]);

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % list.length), 6500);
    return () => clearInterval(id);
  }, [list.length]);

  if (list.length === 0) return null;
  const currentIdx = idx % list.length;
  const t = list[currentIdx];

  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <span className="chamfer-sm mx-auto grid h-14 w-14 place-items-center bg-royal text-neon glow-royal">
        <Quote className="h-6 w-6 fill-neon" />
      </span>

      <div className="mt-8 min-h-[220px] md:min-h-[190px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -26, filter: "blur(6px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="text-xl font-bold leading-[2] text-ink md:text-2xl md:leading-[2]">
              "{t.text}"
            </blockquote>

            <figcaption className="mt-6 flex flex-col items-center gap-3">
              <Stars rating={t.rating} />
              
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-royal text-lg font-black text-white">
                  {t.name.trim().charAt(0)}
                </span>
                <span className="text-right">
                  <span className="block text-sm font-black text-ink">{t.name}</span>
                  <span className="block text-xs font-bold text-ink/50">
                    {t.role} — {t.company}
                  </span>
                </span>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          onClick={() => setIdx((i) => (i - 1 + list.length) % list.length)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-ink/15 text-ink transition-all hover:border-royal hover:bg-royal hover:text-white"
          aria-label="السابق"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {list.map((x, i) => (
            <button
              key={x.id}
              onClick={() => setIdx(i)}
              aria-label={`رأي ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-400 ${
                i === currentIdx ? "w-9 bg-royal" : "w-2 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setIdx((i) => (i + 1) % list.length)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-ink/15 text-ink transition-all hover:border-royal hover:bg-royal hover:text-white"
          aria-label="التالي"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}