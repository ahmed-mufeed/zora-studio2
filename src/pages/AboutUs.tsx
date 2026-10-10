import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  GraduationCap,
  Mail,
  MoveRight,
} from "lucide-react";

import Lightning from "../components/Lightning";
import { Chip, CtaA, Reveal } from "../components/ui";

// عدّل هذه البيانات حسب سيرتك الذاتية
const EXPERIENCES = [
  {
    role: "مصمم جرافيك -فريلانسر",
    company: "الخاطر للمقاولات",
    period: "6 أشهر",
    description: "",
  },
  {
    role: "مصمم جرافيك -فريلانسر",
    company: "أبواب المنزل",
    period: "4 أشهر",
    description: "",
  },
];

const EDUCATION = [
  {
    degree: "دبلوم برمجــــة تطبيقات الاجهزة ذكية",
    institution: "اسم الجامعة أو المؤسسة التعليمية",
    period: "2020 — 2024",
    description: "أضف التخصص أو أهم المعلومات المتعلقة بمؤهلك الدراسي.",
  },
];

const SKILL_GROUPS = [
  {
    title: "المهارات التقنية",
    skills: ["المهارة الأولى", "المهارة الثانية", "المهارة الثالثة"],
  },
  {
    title: "المهارات الشخصية",
    skills: ["التواصل", "حل المشكلات", "إدارة الوقت"],
  },
  {
    title: "الأدوات والبرامج",
    skills: ["البرنامج الأول", "البرنامج الثاني", "البرنامج الثالث"],
  },
];

const ACHIEVEMENTS = [
  {
    title: "اسم الشهادة أو الإنجاز",
    issuer: "الجهة المانحة",
    year: "2025",
  },
  {
    title: "اسم الشهادة أو الإنجاز",
    issuer: "الجهة المانحة",
    year: "2024",
  },
  {
    title: "اسم الشهادة أو الإنجاز",
    issuer: "الجهة المانحة",
    year: "2023",
  },
];

export default function AboutUs() {
  return (
    <main className="bg-ink">
      {/* القسم الرئيسي: التعريف الشخصي */}
      <section className="relative overflow-hidden pb-24 pt-36">
        <Lightning />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-paper/45 transition-colors hover:text-neon"
            >
              <MoveRight className="h-4 w-4" />
              العودة للرئيسية
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Chip>السيرة ذاتية</Chip>

              <span className="chamfer-sm inline-flex items-center border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-extrabold text-paper/60">
                مبرمج ومصمم جرافيك
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[1.2] text-paper md:text-5xl md:leading-[1.15]">
              أنا <span className="text-neon"> أحمد مفيد الدهان</span>
            </h1>

            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-paper/60 md:text-lg md:leading-9">
              حديث تخرج من جامعة عبد الرحمن بن فيصل (جامعة الدمام)
              املك خبرة تمتد لأكثر من 10 سنوات في مجال التصميم الجرافيكي والمونتاج طموح وشغوف بالتقنية وفي سعي دائم لتطوير مهاراتي بنيت هذا الموقع بنظام ال(vibe-coding) واستعنت بخبرتي اللتي اكتسبتها من دراستي الجامعية.            </p>

            <p className="mt-4 max-w-xl text-sm font-semibold leading-8 text-paper/50">
             أنا حاليًا متاح للعمل وأبحث عن وظيفة في تخصصي او بمهارات التصميم التي املكها.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Chip>التخصص: برمجة تطبيقات الأجهزة الذكية</Chip>
              <Chip>الموقع: السعودية -القطيف</Chip>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/portfolio"
                className="chamfer-sm glow-neon inline-flex items-center gap-2 bg-neon px-7 py-3.5 text-sm font-extrabold text-ink transition-transform duration-300 hover:-translate-y-1"
              >
                استعرض أعمالي
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
              </Link>

              <CtaA
                variant="ghost"
                href="mailto:your-ahmdoh666@gmail.com"
              >
                <Mail className="h-4 w-4" />
                تواصل معي
              </CtaA>
            </div>
          </div>

          {/* مساحة الصورة الشخصية */}
          <Reveal className="relative">
            <div className="chamfer relative flex min-h-[420px] items-center justify-center overflow-hidden border border-white/10 bg-royal md:min-h-[480px]">
              <Lightning variant="royal" />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

              <div className="relative z-10 p-8 text-center">
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-neon/40 bg-ink/60 text-4xl font-black text-neon shadow-[0_0_45px_rgba(0,255,170,0.12)]">
                  <img src= "PROFAIL.png" alt=""/>
                </div>

                <h2 className="mt-7 text-2xl font-black text-paper">
                  اسمك الكامل
                </h2>

                <p className="mt-2 text-sm font-semibold text-paper/50">
                  المسمى المهني أو التخصص
                </p>

                <div className="mx-auto mt-6 h-1 w-16 bg-neon" />
                <p className="mt-5 text-xs font-bold text-paper/40">
                  استبدل هذا العنصر بصورتك الشخصية

                  
                </p>
              </div>

              <span className="chamfer-sm absolute bottom-5 right-5 border border-white/10 bg-ink/70 px-4 py-2 text-xs font-extrabold text-paper/75">
                السيرة الذاتية
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* القسم الثاني: من أنا */}
      <section className="slant-r bg-paper pb-24 pt-24 text-ink md:pt-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <span className="text-xs font-black uppercase tracking-widest text-ink/45">
              ABOUT ME
            </span>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              من أنا؟
            </h2>

            <p className="mt-6 max-w-4xl text-sm font-semibold leading-8 text-ink/65 md:text-base md:leading-9">
              اكتب هنا نبذة أوسع عن شخصيتك ومسيرتك. تحدث عن خلفيتك،
              واهتماماتك، وطريقة عملك، والأمور التي تسعى إلى تطويرها.
              يمكنك تقسيم النص إلى أكثر من فقرة حسب الحاجة.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "رؤيتي",
                description: "اكتب هنا رؤيتك وتطلعاتك المستقبلية.",
              },
              {
                number: "02",
                title: "ما أتميز به",
                description: "اكتب هنا أبرز نقاط قوتك وما يميز أسلوب عملك.",
              },
              {
                number: "03",
                title: "أهدافي",
                description: "اكتب هنا أهدافك المهنية وما تسعى إلى تحقيقه.",
              },
            ].map((item, index) => (
              <Reveal key={item.number} delay={0.06 * index}>
                <div className="card-lift h-full border border-black/5 bg-white p-7">
                  <span className="font-latin text-3xl font-black text-ink/15">
                    {item.number}
                  </span>

                  <h3 className="mt-5 text-lg font-black">{item.title}</h3>

                  <p className="mt-3 text-sm font-semibold leading-7 text-ink/55">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* القسم الثالث: المهارات */}
      <section className="pb-24 pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <span className="text-xs font-black uppercase tracking-widest text-neon">
              SKILLS
            </span>

            <h2 className="mt-3 text-3xl font-black text-paper md:text-4xl">
              المهارات والخبرات
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-semibold leading-8 text-paper/50">
              أضف المهارات والأدوات التي تتقنها، ونظّمها في مجموعات لتسهيل
              الاطلاع عليها.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SKILL_GROUPS.map((group, index) => (
              <Reveal key={group.title} delay={0.06 * index}>
                <div className="chamfer h-full border border-white/10 bg-white/[.035] p-7 transition-colors hover:border-neon/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center border border-neon/20 bg-neon/10 text-neon">
                      <Code2 className="h-5 w-5" />
                    </div>

                    <h3 className="text-base font-black text-paper">
                      {group.title}
                    </h3>
                  </div>

                  <ul className="mt-7 space-y-4">
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-3 text-sm font-bold text-paper/65"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-neon" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* القسم الرابع: الخبرات العملية */}
      <section className="slant-r bg-paper pb-24 pt-24 text-ink md:pt-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <span className="text-xs font-black uppercase tracking-widest text-ink/45">
              EXPERIENCE
            </span>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              الخبرات العملية
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-semibold leading-8 text-ink/55">
              اعرض خبراتك من الأحدث إلى الأقدم، مع توضيح المسمى الوظيفي
              والجهة والفترة وأهم مسؤولياتك.
            </p>
          </Reveal>

          <div className="relative mt-12 space-y-6 before:absolute before:bottom-5 before:right-[21px] before:top-5 before:w-px before:bg-black/10 md:before:right-[25px]">
            {EXPERIENCES.map((experience, index) => (
              <Reveal key={`${experience.role}-${index}`} delay={0.06 * index}>
                <div className="relative pr-14 md:pr-16">
                  <div className="absolute right-3 top-7 flex h-5 w-5 items-center justify-center rounded-full border-4 border-paper bg-neon md:right-4" />

                  <div className="card-lift border border-black/5 bg-white p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black md:text-xl">
                          {experience.role}
                        </h3>

                        <p className="mt-2 text-sm font-bold text-ink/55">
                          {experience.company}
                        </p>
                      </div>

                      <span className="chamfer-sm border border-black/5 bg-ink/[.04] px-3 py-2 text-xs font-extrabold text-ink/55">
                        {experience.period}
                      </span>
                    </div>

                    <p className="mt-5 text-sm font-semibold leading-8 text-ink/60">
                      {experience.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* القسم الخامس: التعليم */}
      <section className="pb-24 pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <span className="text-xs font-black uppercase tracking-widest text-neon">
              EDUCATION
            </span>

            <div className="mt-3 flex items-center gap-3">
              <GraduationCap className="h-7 w-7 text-neon" />

              <h2 className="text-3xl font-black text-paper md:text-4xl">
                التعليم والمؤهلات
              </h2>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {EDUCATION.map((education, index) => (
              <Reveal key={`${education.degree}-${index}`} delay={0.06 * index}>
                <div className="chamfer h-full border border-white/10 bg-white/[.035] p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-paper">
                        {education.degree}
                      </h3>

                      <p className="mt-3 text-sm font-bold text-neon">
                        {education.institution}
                      </p>
                    </div>

                    <GraduationCap className="h-6 w-6 shrink-0 text-paper/30" />
                  </div>

                  <span className="mt-5 inline-block text-xs font-extrabold text-paper/40">
                    {education.period}
                  </span>

                  <p className="mt-4 text-sm font-semibold leading-7 text-paper/55">
                    {education.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* القسم السادس: الشهادات والإنجازات */}
      <section className="slant-r bg-paper pb-24 pt-24 text-ink md:pt-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <span className="text-xs font-black uppercase tracking-widest text-ink/45">
              ACHIEVEMENTS
            </span>

            <div className="mt-3 flex items-center gap-3">
              <Award className="h-7 w-7 text-ink/70" />

              <h2 className="text-3xl font-black md:text-4xl">
                الشهادات والإنجازات
              </h2>
            </div>

            <p className="mt-4 max-w-2xl text-sm font-semibold leading-8 text-ink/55">
              أضف الشهادات المهنية والدورات التدريبية والجوائز أو الإنجازات
              التي ترغب في إبرازها.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ACHIEVEMENTS.map((achievement, index) => (
              <Reveal key={`${achievement.title}-${index}`} delay={0.06 * index}>
                <div className="card-lift h-full border border-black/5 bg-white p-6">
                  <div className="flex h-12 w-12 items-center justify-center border border-black/5 bg-ink/[.04]">
                    <Award className="h-6 w-6 text-ink/70" />
                  </div>

                  <h3 className="mt-5 text-base font-black">
                    {achievement.title}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-ink/50">
                    {achievement.issuer}
                  </p>

                  <span className="mt-5 inline-block text-xs font-extrabold text-ink/35">
                    {achievement.year}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* القسم الأخير: التواصل */}
      <section className="pb-24 pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <div className="chamfer relative overflow-hidden border border-white/10 bg-royal p-8 md:p-12">
              <Lightning variant="royal" />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <span className="text-xs font-black uppercase tracking-widest text-neon">
                    GET IN TOUCH
                  </span>

                  <h2 className="mt-3 text-2xl font-black text-paper md:text-3xl">
                    لنتواصل ونتبادل الأفكار
                  </h2>

                  <p className="mt-4 text-sm font-semibold leading-8 text-paper/60">
                    اكتب هنا رسالة ختامية قصيرة توضّح نوع الفرص أو مجالات
                    التعاون التي تهتم بها.
                  </p>
                </div>

                <CtaA
                  variant="ghost"
                  href="mailto:your-email@example.com"
                >
                  تواصل معي
                  <ArrowLeft className="h-4 w-4" />
                </CtaA>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}