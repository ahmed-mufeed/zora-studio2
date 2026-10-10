import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import Lightning from "./Lightning";
import { SocialIcon, type SocialName } from "./ui";
import { useRole, useSite, waLink } from "../lib/store";

export default function Footer() {
  const { state } = useSite();
  const { choose } = useRole();
  const navigate = useNavigate();
  const { settings, content } = state;

  const socials = (
    [
      { name: "instagram", href: settings.instagram, label: "انستقرام" },
      { name: "tiktok", href: settings.tiktok, label: "تيك توك" },
      { name: "x", href: settings.x, label: "إكس" },
      { name: "linkedin", href: settings.linkedin, label: "لينكدإن" },
    ] as { name: SocialName; href: string; label: string }[]
  ).filter((s) => s.href.trim() !== "");

  const enterAdmin = () => {
    choose("admin");
    navigate("/admin");
  };

  return (
    <footer className="relative overflow-hidden bg-ink">
      <Lightning className="opacity-70" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm font-semibold leading-7 text-paper/55">
              {content.footerAbout}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="chamfer-sm grid h-10 w-10 place-items-center border border-white/10 bg-white/5 text-paper/65 transition-all duration-300 hover:-translate-y-1 hover:border-neon hover:bg-neon hover:text-ink"
                >
                  <SocialIcon name={s.name} className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-black tracking-wide text-neon">روابط سريعة</h4>
            <ul className="space-y-3 text-sm font-bold text-paper/60">
              <li><Link className="transition-colors hover:text-neon" to="/">الرئيسية</Link></li>
              <li><Link className="transition-colors hover:text-neon" to="/services">خدماتنا</Link></li>
              <li><Link className="transition-colors hover:text-neon" to="/portfolio">أعمالنا</Link></li>
              {state.pages.filter((p) => p.visible).map((p) => (
                <li key={p.id}>
                  <Link className="transition-colors hover:text-neon" to={`/p/${p.slug}`}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-black tracking-wide text-neon">خدماتنا</h4>
            <ul className="space-y-3 text-sm font-bold text-paper/60">
              {state.services.filter((s) => !s.hidden).slice(0, 6).map((s) => (
                <li key={s.id}>
                  <Link className="transition-colors hover:text-neon" to={`/services/${s.id}`}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-black tracking-wide text-neon">تواصل معنا</h4>
            <ul className="space-y-3.5 text-sm font-bold text-paper/65">
              <li className="flex items-center gap-3">
                <span className="chamfer-sm grid h-9 w-9 shrink-0 place-items-center bg-white/5 text-neon">
                  <Phone className="h-4 w-4" />
                </span>
                <span dir="ltr" className="font-latin font-semibold">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="chamfer-sm grid h-9 w-9 shrink-0 place-items-center bg-white/5 text-neon">
                  <Phone className="h-4 w-4" />
                </span>
                <span dir="ltr" className="font-latin font-semibold">{settings.phone2}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="chamfer-sm grid h-9 w-9 shrink-0 place-items-center bg-white/5 text-neon">
                  <Mail className="h-4 w-4" />
                </span>
                <span dir="ltr" className="font-latin font-semibold">{settings.email}</span>
              </li>
            </ul>
            <a
              href={waLink(settings.whatsapp, "مرحبًا زورا استوديو! أريد الاستفسار عن خدماتكم.")}
              target="_blank"
              rel="noreferrer"
              className="chamfer-sm glow-neon mt-6 inline-flex items-center gap-2.5 bg-neon px-5 py-3 text-sm font-extrabold text-ink transition-transform duration-300 hover:-translate-y-0.5"
            >
              <SocialIcon name="whatsapp" className="h-5 w-5" />
              راسلنا على واتساب
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs font-bold text-paper/40">
          <span>
            © {new Date().getFullYear()} زورا استوديو — جميع الحقوق محفوظة.
          </span>
          <button
            onClick={enterAdmin}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 transition-colors hover:border-neon/40 hover:text-neon"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            دخول المسؤول
          </button>
        </div>
      </div>
    </footer>
  );
}