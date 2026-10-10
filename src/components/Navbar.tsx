import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { SocialIcon } from "./ui";
import { useSite, waLink } from "../lib/store";

const LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/services", label: "خدماتنا" },
  { to: "/portfolio", label: "أعمالنا" },
  { to: "/AboutUs", label: "من أنا؟" },
];

export default function Navbar() {
  const { state } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const pageLinks = state.pages
    .filter((p) => p.visible)
    .slice(0, 2)
    .map((p) => ({ to: `/p/${p.slug}`, label: p.title }));

  const allLinks = [...LINKS, ...pageLinks];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-white/5 bg-ink/85 py-3 backdrop-blur-xl" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
          <Link to="/" aria-label="زورا استوديو">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {allLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `relative text-sm font-bold transition-colors duration-300 ${
                    isActive ? "text-neon" : "text-paper/70 hover:text-paper"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={`absolute -bottom-2 right-0 h-[2.5px] bg-neon transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/services"
              className="chamfer-sm glow-neon hidden items-center justify-center bg-neon px-5 py-2.5 text-sm font-extrabold text-ink transition-transform duration-300 hover:-translate-y-0.5 lg:inline-flex"
            >
              اطلب خدمتك
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 text-paper lg:hidden"
              aria-label="القائمة"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink/[.98] backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 text-paper"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {allLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `group flex items-center justify-between border-b border-white/8 py-5 text-2xl font-black transition-colors ${
                        isActive ? "text-neon" : "text-paper"
                      }`
                    }
                  >
                    {l.label}
                    <ArrowLeft className="h-5 w-5 text-neon opacity-0 transition-opacity group-hover:opacity-100" />
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between px-8 pb-10"
            >
              <span className="text-xs font-bold text-paper/40">{state.settings.phone}</span>
              <a
                href={waLink(state.settings.whatsapp, "مرحبًا زورا استوديو!")}
                target="_blank"
                rel="noreferrer"
                className="grid h-12 w-12 place-items-center rounded-2xl bg-neon text-ink"
                aria-label="واتساب"
              >
                <SocialIcon name="whatsapp" className="h-6 w-6" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}