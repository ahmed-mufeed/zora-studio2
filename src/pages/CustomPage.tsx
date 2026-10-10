import { Link, useParams } from "react-router-dom";
import { MoveRight } from "lucide-react";
import Lightning from "../components/Lightning";
import { Chip, CtaA, Reveal } from "../components/ui";
import { useSite, waLink } from "../lib/store";

export default function CustomPage() {
  const { slug } = useParams();
  const { state } = useSite();
  const page = state.pages.find((p) => p.slug === slug && p.visible);

  if (!page) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-5">
        <div className="text-center">
          <h1 className="text-3xl font-black text-paper">الصفحة غير موجودة</h1>
          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-neon">
            <MoveRight className="h-4 w-4" /> العودة للرئيسية
          </Link>
        </div>
      </main>
    );
  }

  const paragraphs = page.body.split(/\n\s*\n|\n/).filter((p) => p.trim() !== "");

  return (
    <main className="bg-ink">
      <section className="relative overflow-hidden pb-20 pt-40">
        <Lightning />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <Chip>زورا استوديو</Chip>
          <h1 className="mt-6 text-4xl font-black leading-[1.2] text-paper md:text-5xl">{page.title}</h1>
        </div>
      </section>

      <section className="slant-r bg-paper pb-24 pt-20 text-ink md:pt-24">
        <div className="mx-auto max-w-3xl space-y-6 px-5">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.04 * Math.min(i, 10)}>
              <p className="text-base font-semibold leading-9 text-ink/70 md:text-lg md:leading-10">{p}</p>
            </Reveal>
          ))}

          <Reveal>
            <div className="chamfer mt-10 bg-ink p-8 text-center text-paper">
              <h3 className="text-lg font-black">عندك استفسار؟</h3>
              <p className="mt-1.5 text-sm font-semibold text-paper/55">فريقنا جاهز للرد عليك في أي وقت.</p>
              <CtaA
                className="mt-5"
                href={waLink(state.settings.whatsapp, `مرحبًا! قرأت صفحة «${page.title}» ولدي استفسار.`)}
              >
                تواصل واتساب
              </CtaA>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}