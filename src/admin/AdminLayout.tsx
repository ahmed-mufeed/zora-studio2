// استيراد أدوات التوجيه والتنقل بين المسارات من مكتبة React Router
import { NavLink, Route, Routes, useNavigate, Link } from "react-router-dom";

// استيراد الأيقونات التوضيحية من مكتبة Lucide (تمت إزالة أيقونة البرق Zap بنجاح)
import {
  ClipboardList,
  CloudOff,
  Eye,
  FilePlus2,
  Handshake,
  Images,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  PenLine,
  Settings,
  ShieldCheck,
} from "lucide-react";

// استيراد مكون شعار الموقع الرئيسي
import Logo from "../components/Logo";

// استيراد دوال التحكم في الحالة العامة (رتبة المستخدم وحالة حفظ البيانات)
import { useRole, useSite } from "../lib/store";

// استيراد المكونات (الصفحات الفرعية) التي يتم عرضها داخل لوحة التحكم
import Overview from "./Overview";
import ContentManager from "./ContentManager";
import ServicesManager from "./ServicesManager";
import PortfolioManager from "./PortfolioManager";
import PartnersManager from "./PartnersManager";
import TestimonialsManager from "./TestimonialsManager";
import BriefBuilder from "./BriefBuilder";
import PagesManager from "./PagesManager";
import SettingsManager from "./SettingsManager";

// تعريف مصفوفة روابط القائمة الجانبية لتسهيل الصيانة والتعديل مستقبلاً
// تحتوي كل قائمة على: رابط المسار، النص البرمجي، الأيقونة الخاصة، وتفعيل التطابق التام للمسار
export const ADMIN_NAV = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, end: true },
  { to: "/admin/content", label: "المحتوى والنصوص", icon: PenLine },
  { to: "/admin/services", label: "الخدمات", icon: Layers },
  { to: "/admin/portfolio", label: "الأعمال", icon: Images },
  { to: "/admin/partners", label: "شركاء النجاح", icon: Handshake },
  { to: "/admin/testimonials", label: "آراء العملاء", icon: MessageSquareQuote },
  { to: "/admin/briefs", label: "بناء البريف", icon: ClipboardList },
  { to: "/admin/pages", label: "الصفحات", icon: FilePlus2 },
  { to: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminLayout() {
  // جلب رتبة المستخدم الحالية، ودالة تغيير الرتبة، ودالة خروج المستخدم من النظام
  const { role, choose, exit } = useRole();
  
  // التحقق مما إذا كانت البيانات قد تم حفظها بنجاح في التخزين المحلي دون مشاكل سعة
  const { persisted } = useSite();
  
  // خطاف برميجي للتنقل بين الصفحات والروابط داخلياً
  const navigate = useNavigate();

  // =========================================================
  // شاشة الحماية: تظهر للمستخدم إذا لم يكن مسجلاً كمسؤول (Admin)
  // =========================================================
  if (role !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-ink px-5">
        <div className="max-w-sm text-center">
          {/* أيقونة درع الحماية للدلالة على منطقة مقيدة */}
          <span className="chamfer mx-auto grid h-16 w-16 place-items-center bg-royal">
            <ShieldCheck className="h-8 w-8 text-neon" />
          </span>
          
          <h1 className="mt-6 text-2xl font-black text-paper">منطقة خاصة بالمسؤول</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-paper/50">
            هذه المحاكاة لا تتطلب كلمة مرور — أكّد فقط أنك تريد تجربة لوحة التحكم.
          </p>
          
          {/* زر محاكاة الدخول كمسؤول (تمت إزالة أيقونة البرق من داخله) */}
          <button
            onClick={() => choose("admin")}
            className="chamfer-sm glow-neon mt-7 inline-flex items-center justify-center gap-2 bg-neon px-7 py-3.5 text-sm font-extrabold text-ink"
          >
            الدخول كمسؤول
          </button>
          
          {/* رابط سريع للعودة لواجهة الموقع العامة */}
          <Link to="/" className="mt-4 block text-xs font-bold text-paper/40 hover:text-neon">
            العودة للموقع
          </Link>
        </div>
      </div>
    );
  }

  // دالة تسجيل الخروج: تقوم بإنهاء الجلسة وتوجيه المستخدم فوراً للرئيسية
  const logout = () => {
    exit();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* =========================================================
          الشريط الجانبي الثابت (يظهر فقط في الشاشات الكبيرة LG فما فوق)
          ========================================================= */}
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 flex-col bg-ink text-paper lg:flex">
        {/* قسم الهيدر للشريط الجانبي ويحتوي على الشعار */}
        <div className="flex h-20 items-center border-b border-white/8 px-6">
          <Logo />
        </div>

        {/* روابط التنقل الداخلية مع تفعيل تأثيرات التحويم والتنشيط الفعال */}
        <nav className="scroll-thin flex-1 space-y-1 overflow-y-auto p-4">
          {ADMIN_NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                  isActive ? "bg-royal text-white" : "text-paper/55 hover:bg-white/5 hover:text-paper"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* خط التنشيط المتوهج على يمين الرابط الفعّال */}
                  <span
                    className={`absolute right-0 h-6 w-1 rounded-full bg-neon transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                  />
                  {/* أيقونة التبويب الفرعي */}
                  <n.icon className={`h-[18px] w-[18px] ${isActive ? "text-neon" : ""}`} strokeWidth={2.25} />
                  {n.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* القسم السفلي للشريط الجانبي (عرض الموقع + تسجيل الخروج) */}
        <div className="space-y-2 border-t border-white/8 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-paper/55 transition-colors hover:bg-white/5 hover:text-paper"
          >
            <Eye className="h-[18px] w-[18px]" /> عرض الموقع
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-rose-300/80 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-[18px] w-[18px]" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* =========================================================
          الشريط العلوي المرن (يظهر فقط في الشاشات الصغيرة والمتوسطة)
          ========================================================= */}
      <div className="sticky top-0 z-40 border-b border-white/8 bg-ink text-paper lg:hidden">
        {/* شريط الهيدر الرئيسي للهواتف */}
        <div className="flex items-center justify-between px-5 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/" className="grid h-10 w-10 place-items-center rounded-xl border border-white/15" aria-label="عرض الموقع">
              <Eye className="h-5 w-5" />
            </Link>
            <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl border border-rose-400/30 text-rose-300" aria-label="خروج">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* قائمة تصفح أفقية قابلة للتمرير يميناً ويساراً مخصصة للموبايل */}
        <nav className="scroll-thin flex gap-2 overflow-x-auto px-4 pb-3">
          {ADMIN_NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-colors ${
                  isActive ? "bg-neon text-ink" : "border border-white/15 text-paper/60"
                }`
              }
            >
              <n.icon className="h-3.5 w-3.5" />
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* =========================================================
          منطقة عرض المحتوى الحركي والصفحات الفرعية للوحة التحكم
          ========================================================= */}
      <div className="lg:mr-64">
        <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
          
          {/* إشعار تحذيري يظهر للمسؤول في حال امتلاء الذاكرة المؤقتة للمتصفح */}
          {!persisted && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-extrabold text-amber-700">
              <CloudOff className="h-4 w-4 shrink-0" />
              تجاوز حجم البيانات حدّ التخزين المحلي — التعديلات الأخيرة مؤقتة لهذه الجلسة فقط.
            </div>
          )}

          {/* نظام المسارات الداخلي لعرض الصفحة المطلوبة حسب الرابط */}
          <Routes>
            <Route path="" element={<Overview />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="portfolio" element={<PortfolioManager />} />
            <Route path="partners" element={<PartnersManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="briefs" element={<BriefBuilder />} />
            <Route path="pages" element={<PagesManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}