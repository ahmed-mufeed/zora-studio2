import { Link } from "react-router-dom";
import { ArrowLeft, BadgePercent, ChevronDown, Gem, MessagesSquare, Sparkles, type LucideIcon } from "lucide-react";
import Lightning from "../components/Lightning";
import Partners from "../components/Partners";
import ServiceCard from "../components/ServiceCard";
import Testimonials from "../components/Testimonials";
import { Chip, CtaLink, SectionHead, Reveal } from "../components/ui";
import { IMG } from "../lib/data";
import { useSite } from "../lib/store";
import type { Feature, PortfolioItem } from "../lib/types";

const FEATURE_ICONS: Record<Feature["icon"], LucideIcon> = {
  zap: Sparkles,
  gem: Gem,
  percent: BadgePercent,
  chat: MessagesSquare,
};

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

export default function Home() {
  const { state } = useSite();
  const { content, settings, services, portfolio, categories } = state;
  const visibleServices = services.filter((s) => !s.hidden);
  const previewWorks = portfolio.slice(0, 6);
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

  return (
    <main className="bg-ink">
      {/* ============================ HERO ============================ */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <img src={IMG.heroBg} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink" />
        <Lightning />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-36 pt-36">
          <Reveal>
            <Chip>{content.heroBadge}</Chip>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="mt-7 max-w-3xl text-[2.9rem] font-black leading-[1.18] text-paper sm:text-6xl lg:text-[4.6rem] lg:leading-[1.12]">
              {content.heroTitleA}{" "}
              <span className="chamfer-sm relative mt-2 inline-block -rotate-1 bg-neon px-4 pb-2 text-ink sm:mt-0">
                {content.heroTitleB}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-7 max-w-xl text-base font-semibold leading-8 text-paper/60 md:text-lg md:leading-9">
              {content.heroSubtitle}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CtaLink to="/services">
                {content.ctaPrimary}
                <ArrowLeft className="h-4 w-4" strokeWidth={2.75} />
              </CtaLink>
              <CtaLink to="/portfolio" variant="ghost">
                {content.ctaSecondary}
              </CtaLink>
            </div>
          </Reveal>

          {settings.sections.stats && (
            <Reveal delay={0.42}>
              <dl className="mt-20 grid max-w-3xl grid-cols-2 gap-y-8 md:grid-cols-4">
                {content.stats.map((s, i) => (
                  <div key={i} className={`${i > 0 ? "border-r border-white/10 pr-6" : ""}`}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-latin text-3xl font-bold text-neon md:text-4xl">{s.value}</dd>
                    <dd className="mt-1 text-sm font-bold text-paper/45">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>

        <ChevronDown className="absolute bottom-8 right-1/2 z-10 h-6 w-6 translate-x-1/2 animate-bounce text-paper/40" />
      </section>

      {/* ======================== PARTNERS ======================== */}
      {settings.sections.partners && (
        <section className="slant-r relative border-y border-white/5 bg-ink-2/70 py-16 md:py-20">
          <div className="mx-auto mb-8 flex max-w-7xl items-center justify-between px-5">
            <span className="text-xs font-black tracking-[0.35em] text-paper/40">شركاء النجاح</span>
            <span className="hidden text-xs font-bold text-paper/30 sm:block">علامات وثقت بنا في رحلة النمو</span>
          </div>
          <Partners />
        </section>
      )}

      {/* ======================== SERVICES ======================== */}
      {settings.sections.services && visibleServices.length > 0 && (
        <section className="slant-r relative bg-paper pb-28 pt-28 text-ink md:pt-32">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead
                light
                kicker="خدماتنا"
                title={
                  <>
                    حلول متكاملة <span className="text-royal">لعلامتك</span>
                  </>
                }
                sub="من الفكرة الأولى حتى آخر بكسل — فريق واحد يصنع لك كل ما يحتاجه حضورك الرقمي."
              />
              <Reveal>
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 border-b-2 border-royal pb-1 text-sm font-extrabold text-royal"
                >
                  عرض كل الخدمات
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleServices.slice(0, 3).map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================== PORTFOLIO ======================== */}
      {settings.sections.portfolio && previewWorks.length > 0 && (
        <section className="slant-r relative overflow-hidden bg-ink pb-28 pt-28 md:pt-32">
          <Lightning className="opacity-60" />
          <div className="relative z-10 mx-auto max-w-7xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead
                kicker="أعمالنا"
                title={
                  <>
                    كل مشروع… <span className="text-neon">قصة نجاح</span>
                  </>
                }
                sub="مختارات من أعمال صنعناها بشغف لعلامات نفخر بشراكتها."
              />
              <Reveal>
                <Link
                  to="/portfolio"
                  className="group inline-flex items-center gap-2 border-b-2 border-neon pb-1 text-sm font-extrabold text-neon"
                >
                  استكشاف المعرض كاملًا
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Reveal>
            </div>

            <div className="mt-14 columns-2 gap-5 lg:columns-3 [&>*]:mb-5">
              {previewWorks.map((w, i) => (
                <Reveal key={w.id} delay={0.05 * i} className="break-inside-avoid">
                  <Link
                    to="/portfolio"
                    className="group relative block overflow-hidden rounded-2xl border border-white/10 transition-colors duration-300 hover:border-neon/50"
                  >
                    <img
                      src={w.image}
                      alt={w.title}
                      loading="lazy"
                      style={getAspectStyle(w)}
                      className="w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="chamfer-sm bg-neon px-2.5 py-1 text-[10px] font-black text-ink">{catName(w.categoryId)}</span>
                      <h3 className="mt-2.5 text-base font-black text-paper leading-snug">{w.title}</h3>
                      <p className="mt-0.5 text-xs font-bold text-paper/55">{w.client}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================== WHY US ======================== */}
      {settings.sections.about && (
        <section className="slant-r relative bg-paper pb-28 pt-28 text-ink md:pt-32">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2">
            <div>
              <SectionHead light kicker="لماذا زورا؟" title={content.aboutTitle} sub={content.aboutText} />
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {content.features.map((f, i) => {
                  const Icon = FEATURE_ICONS[f.icon] ?? Sparkles;
                  return (
                    <Reveal key={i} delay={0.07 * i}>
                      <div className="card-lift h-full rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                        <span className="chamfer-sm grid h-11 w-11 place-items-center bg-royal/10 text-royal">
                          <Icon className="h-5 w-5" strokeWidth={2.25} />
                        </span>
                        <h3 className="mt-4 text-[15px] font-black">{f.title}</h3>
                        <p className="mt-2 text-sm font-semibold leading-7 text-ink/55">{f.text}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            <Reveal className="relative hidden lg:block">
              <div className="chamfer relative overflow-hidden">
                <img src={IMG.pMotion} alt="أعمال زورا" className="h-[520px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-royal/70 via-transparent to-transparent" />
              </div>
              <div className="chamfer-sm glow-neon absolute -bottom-6 right-8 bg-neon px-6 py-4 text-ink float-y">
                <span className="block font-latin text-3xl font-bold leading-none">
                  {content.stats[0]?.value ?? "+120"}
                </span>
                <span className="mt-1 block text-xs font-extrabold">{content.stats[0]?.label ?? "مشروع منجز"}</span>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===================== TESTIMONIALS ===================== */}
      {settings.sections.testimonials && (
        <section className="slant-r relative bg-white pb-28 pt-28 text-ink md:pt-32">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead center light kicker="آراء العملاء" title="ثقة شركائنا وسامٌ نعتزّ به" className="mb-16" />
            <Reveal>
              <Testimonials />
            </Reveal>
          </div>
        </section>
      )}

      {/* =========================== CTA =========================== */}
      {settings.sections.cta && (
        <section className="slant-r relative overflow-hidden bg-royal pb-28 pt-28 text-paper md:pt-32">
          <Lightning variant="royal" />

          <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
            <Reveal>
              <Chip tone="ghost">ابدأ الآن</Chip>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 text-3xl font-black leading-[1.2] md:text-5xl md:leading-[1.18]">
                {content.ctaTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-5 max-w-xl text-base font-semibold leading-8 text-paper/70 md:text-lg">
                {content.ctaSubtitle}
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <CtaLink to="/services">
                  اطلب خدمة الآن
                  <ArrowLeft className="h-4 w-4" strokeWidth={2.75} />
                </CtaLink>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </main>
  );
}