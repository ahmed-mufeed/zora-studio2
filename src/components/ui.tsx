import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

/* ================================================================
   1. مكوّن الظهور التدريجي عند التمرير (Reveal) - مصحح وآمن 100%
   ================================================================ */

export function Reveal({
  children,
  delay = 0,
  y = 20,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01, margin: "0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   2. مكوّن الشارات والوسوم التمهيدية (Chip)
   ================================================================ */

export function Chip({
  children,
  tone = "neon",
  className = "",
}: {
  children: ReactNode;
  tone?: "neon" | "royal" | "ghost";
  className?: string;
}) {
  const styles = {
    neon: "bg-neon/10 text-neon border-neon/25",
    royal: "bg-royal/10 text-royal border-royal/20",
    ghost: "bg-white/5 text-paper/70 border-white/15",
  } as const;

  return (
    <span
      className={`chamfer-sm inline-flex items-center gap-1.5 border px-3.5 py-1.5 text-xs font-extrabold ${styles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ================================================================
   3. مكوّن ترويسة الأقسام (SectionHead)
   ================================================================ */

export function SectionHead({
  kicker,
  title,
  sub,
  light = false,
  center = false,
  className = "",
}: {
  kicker?: string;
  title: ReactNode;
  sub?: string;
  light?: boolean;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={`${center ? "text-center" : ""} ${className}`}>
      {kicker && <Chip tone={light ? "royal" : "neon"}>{kicker}</Chip>}
      
      <h2
        className={`mt-4 text-3xl font-black leading-[1.18] md:text-[2.9rem] md:leading-[1.15] ${
          light ? "text-ink" : "text-paper"
        }`}
      >
        {title}
      </h2>
      
      {sub && (
        <p
          className={`mt-4 max-w-2xl text-base font-semibold leading-relaxed md:text-lg ${
            light ? "text-ink/55" : "text-paper/55"
          } ${center ? "mx-auto" : ""}`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}

/* ================================================================
   4. أزرار وروابط الدعوة لاتخاذ إجراء (CTA Buttons)
   ================================================================ */

type Variant = "neon" | "ghost" | "royal" | "ink";

const VARIANTS: Record<Variant, string> = {
  neon: "bg-neon text-ink glow-neon hover:-translate-y-1",
  ghost: "border border-white/25 text-paper hover:bg-white/10 hover:-translate-y-1",
  royal: "bg-royal text-white glow-royal hover:-translate-y-1",
  ink: "bg-ink text-paper hover:bg-ink-2 hover:-translate-y-1",
};

export function CtaLink({
  to,
  variant = "neon",
  className = "",
  children,
}: {
  to: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`chamfer-sm inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-extrabold transition-all duration-300 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function CtaA({
  href,
  variant = "neon",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`chamfer-sm inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-extrabold transition-all duration-300 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

/* ================================================================
   5. مكوّن عرض تقييم النجوم (Stars)
   ================================================================ */

export function Stars({ rating, dark = false }: { rating: number; dark?: boolean }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const base = dark ? "fill-white/15 text-white/15" : "fill-ink/10 text-ink/10";
  
  const row = (filled: boolean) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${filled ? "fill-neon text-neon" : base}`} strokeWidth={1.5} />
      ))}
    </div>
  );

  return (
    <div className="relative inline-block" dir="ltr">
      {row(false)}
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {row(true)}
      </div>
    </div>
  );
}

/* ================================================================
   6. مكوّن مفتاح التبديل الثنائي (Toggle Switch)
   ================================================================ */

export function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      dir="ltr"
      aria-pressed={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
        checked ? "bg-neon" : "bg-ink/20"
      } ${disabled ? "opacity-40" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-[3px] h-[18px] w-[18px] rounded-full shadow transition-all duration-300 ${
          checked ? "left-[23px] bg-ink" : "left-[3px] bg-white"
        }`}
      />
    </button>
  );
}

/* ================================================================
   7. مكوّن أيقونات التواصل الاجتماعي المخصصة (SocialIcon)
   ================================================================ */

export type SocialName = "instagram" | "tiktok" | "x" | "linkedin" | "whatsapp";

export function SocialIcon({ name, className = "h-5 w-5" }: { name: SocialName; className?: string }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  const paths: Record<Exclude<SocialName, "instagram">, string> = {
    tiktok:
      "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
    x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    linkedin:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    whatsapp:
      "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  };

  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d={paths[name]} />
    </svg>
  );
}

/* ================================================================
   8. مكوّن الخطوط الهندسية المائلة (DiagonalStroke)
   ================================================================ */

export function DiagonalStroke({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M-10 90 L60 10 L82 10 L12 90 Z" fill="currentColor" opacity="0.35" />
      <path d="M40 100 L110 -10 L118 -10 L48 100 Z" fill="currentColor" opacity="0.2" />
    </svg>
  );
}