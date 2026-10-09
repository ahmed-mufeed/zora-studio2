// استيراد أدوات التوجيه والتنقل بين الصفحات من مكتبة React Router
import { Link, useNavigate } from "react-router-dom";

// استيراد الأيقونات التوضيحية من مكتبة Lucide (تمت إزالة أيقونة Zap بنجاح)
import { Mail, Phone, ShieldCheck } from "lucide-react";

// استيراد المكونات الفرعية الخاصة بالشعار، خلفية البرق، وأيقونات التواصل
import Logo from "./Logo";
import Lightning from "./Lightning";
import { SocialIcon, type SocialName } from "./ui";

// استيراد خطافات إدارة الحالة ودالة توليد رابط الواتساب
import { useRole, useSite, waLink } from "../lib/store";

// المكوّن الرئيسي لتذييل الموقع (Footer)
export default function Footer() {
  // جلب بيانات الموقع العامة (الإعدادات، المحتوى، الصفحات، الخدمات)
  const { state } = useSite();
  // جلب دالة تعيين الدور (لتمكين الدخول كمسؤول)
  const { choose } = useRole();
  // أداة الانتقال البرمجي بين الصفحات
  const navigate = useNavigate();
  // استخراج الإعدادات والنصوص المخصصة
  const { settings, content } = state;

  // مصفوفة حسابات التواصل الاجتماعي مع تصفية واستبعاد الحسابات التي لم يُدخل لها رابط
  const socials = (
    [
      { name: "instagram", href: settings.instagram, label: "انستقرام" },
      { name: "tiktok", href: settings.tiktok, label: "تيك توك" },
      { name: "x", href: settings.x, label: "إكس" },
      { name: "linkedin", href: settings.linkedin, label: "لينكدإن" },
    ] as { name: SocialName; href: string; label: string }[]
  ).filter((s) => s.href.trim() !== "");

  // دالة تحويل المستخدم مباشرة إلى لوحة تحكم المسؤول
  const enterAdmin = () => {
    choose("admin");
    navigate("/admin");
  };

  return (
    <footer className="relative overflow-hidden bg-ink">
      {/* خلفية جمالية تفاعلية تحوي صواعق البرق */}
      <Lightning className="opacity-70" />

      {/* المحتوى الرئيسي للفوتر مقسم إلى شبكة من الأعمدة */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          
          {/* العمود الأول: الهوية، النبذة التعريفية، وحسابات التواصل الاجتماعي */}
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm font-semibold leading-7 text-paper/55">
              {content.footerAbout}
            </p>
            {/* أزرار منصات التواصل الاجتماعي المتاحة */}
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

          {/* العمود الثاني: روابط سريعة للتنقل داخل الموقع والصفحات الإضافية */}
          <div>
            <h4 className="mb-5 text-sm font-black tracking-wide text-neon">
              روابط سريعة
            </h4>
            <ul className="space-y-3 text-sm font-bold text-paper/60">
              <li><Link className="transition-colors hover:text-neon" to="/">الرئيسية</Link></li>
              <li><Link className="transition-colors hover:text-neon" to="/services">خدماتنا</Link></li>
              <li><Link className="transition-colors hover:text-neon" to="/portfolio">أعمالنا</Link></li>
              {/* توليد روابط ديناميكية للصفحات الإضافية النشطة/المرئية */}
              {state.pages.filter((p) => p.visible).map((p) => (
                <li key={p.id}>
                  <Link className="transition-colors hover:text-neon" to={`/p/${p.slug}`}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الثالث: قائمة الخدمات المتاحة (يتم جلب أول 6 خدمات غير مخفية) */}
          <div>
            <h4 className="mb-5 text-sm font-black tracking-wide text-neon">
              خدماتنا
            </h4>
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

          {/* العمود الرابع: بيانات التواصل المباشر ورابط الواتساب */}
          <div>
            <h4 className="mb-5 text-sm font-black tracking-wide text-neon">
              تواصل معنا
            </h4>
            <ul className="space-y-3.5 text-sm font-bold text-paper/65">
              {/* رقم الهاتف الأول */}
              <li className="flex items-center gap-3">
                <span className="chamfer-sm grid h-9 w-9 shrink-0 place-items-center bg-white/5 text-neon">
                  <Phone className="h-4 w-4" />
                </span>
                <span dir="ltr" className="font-latin font-semibold">{settings.phone}</span>
              </li>
              {/* رقم الهاتف الثاني */}
              <li className="flex items-center gap-3">
                <span className="chamfer-sm grid h-9 w-9 shrink-0 place-items-center bg-white/5 text-neon">
                  <Phone className="h-4 w-4" />
                </span>
                <span dir="ltr" className="font-latin font-semibold">{settings.phone2}</span>
              </li>
              {/* البريد الإلكتروني */}
              <li className="flex items-center gap-3">
                <span className="chamfer-sm grid h-9 w-9 shrink-0 place-items-center bg-white/5 text-neon">
                  <Mail className="h-4 w-4" />
                </span>
                <span dir="ltr" className="font-latin font-semibold">{settings.email}</span>
              </li>
            </ul>
            {/* زر فتح محادثة واتساب فورية مع رسالة ترحيبية معدّة مسبقاً */}
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

      {/* الشريط السفلي للحقوق وزر وصول المسؤول */}
      <div className="relative z-10 border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs font-bold text-paper/40">
          {/* حقوق النشر مع حساب السنة الحالية تلقائياً */}
          <span>
            © {new Date().getFullYear()} زورا استوديو — جميع الحقوق محفوظة.
            <span className="mr-1 opacity-70">(نموذج تجريبي تفاعلي)</span>
          </span>
          {/* زر التبديل السريع إلى لوحة التحكم */}
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