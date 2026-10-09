import { useEffect, useState } from "react";
// استيراد أدوات التوجيه والتنقل وتحديد المسار الحالي من React Router
import { Link, NavLink, useLocation } from "react-router-dom";
// استيراد أدوات التحريك والتأثيرات الانتقالية من Framer Motion
import { AnimatePresence, motion } from "framer-motion";
// استيراد الأيقونات من مكتبة Lucide (تمت إزالة أيقونة Zap بنجاح)
import { ArrowLeft, Menu, X } from "lucide-react";
// استيراد مكونات الشعار وأيقونات التواصل الاجتماعي
import Logo from "./Logo";
import { SocialIcon } from "./ui";
// استيراد خطاف حالة الموقع ودالة توليد رابط الواتساب
import { useSite, waLink } from "../lib/store";

// روابط التنقل الأساسية الثابتة في الموقع
const LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/services", label: "خدماتنا" },
  { to: "/portfolio", label: "أعمالنا" },
];

export default function Navbar() {
  // جلب بيانات الموقع العامة من المتجر
  const { state } = useSite();
  // حالة مراقبة تمرير الصفحة لتطبيق الخلفية الزجاجية
  const [scrolled, setScrolled] = useState(false);
  // حالة فتح وإغلاق قائمة الموبايل
  const [open, setOpen] = useState(false);
  // خطاف معرفة المسار الحالي للصفحة
  const loc = useLocation();

  // الاستماع لحدث تمرير الصفحة وتحديث الخلفية عند النزول أكثر من 24 بكسل
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // إغلاق قائمة الموبايل تلقائياً عند الانتقال إلى صفحة أخرى
  useEffect(() => setOpen(false), [loc.pathname]);

  // منع تمرير الصفحة الخلفية عند فتح قائمة الموبايل
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // جلب أول صفحتين مخصصتين مفعّلتين من لوحة التحكم لعرضهما في القائمة
  const pageLinks = state.pages
    .filter((p) => p.visible)
    .slice(0, 2)
    .map((p) => ({ to: `/p/${p.slug}`, label: p.title }));

  // دمج الروابط الثابتة مع الروابط الديناميكية المخصصة
  const allLinks = [...LINKS, ...pageLinks];

  return (
    <>
      {/* =========================================================
          الهيدر الرئيسي الثابت أعلى الشاشة
          ========================================================= */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-white/5 bg-ink/85 py-3 backdrop-blur-xl" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
          {/* الشعار مع رابط للعودة للرئيسية */}
          <Link to="/" aria-label="زورا استوديو">
            <Logo />
          </Link>

          {/* قائمة التنقل الخاصة بالشاشات الكبيرة (Desktop) */}
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
                    {/* خط نيون متحرك يظهر أسفل الرابط النشط */}
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

          {/* أزرار الإجراءات: زر طلب الخدمة للشاشات الكبيرة + زر القائمة للموبايل */}
          <div className="flex items-center gap-3">
            {/* زر طلب الخدمة الرئيسي (تمت إزالة أيقونة البرق منه) */}
            <Link
              to="/services"
              className="chamfer-sm glow-neon hidden items-center justify-center bg-neon px-5 py-2.5 text-sm font-extrabold text-ink transition-transform duration-300 hover:-translate-y-0.5 lg:inline-flex"
            >
              اطلب خدمتك
            </Link>

            {/* زر فتح قائمة الموبايل للشاشات الصغيرة */}
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

      {/* =========================================================
          قائمة التنقل المنبثقة للشاشات الصغيرة (Mobile Menu)
          ========================================================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink/[.98] backdrop-blur-xl lg:hidden"
          >
            {/* هيدر القائمة وزر الإغلاق */}
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

            {/* روابط التنقل داخل قائمة الموبايل مع تأثير حركة تدريجي لكل عنصر */}
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

            {/* الجزء السفلي من قائمة الموبايل: رقم الهاتف وزر الواتساب المباشر */}
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