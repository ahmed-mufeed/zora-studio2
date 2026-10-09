import { useEffect } from "react";
// استيراد أدوات التوجيه والتنقل وتحديد المسار من React Router
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
// استيراد أدوات التحريك والتأثيرات الانتقالية من Framer Motion
import { AnimatePresence, motion } from "framer-motion";
// استيراد أيقونات الإشعارات والتنبيهات من مكتبة Lucide
import { AlertTriangle, CheckCircle2 } from "lucide-react";

// استيراد مزودات السياق والخطافات لإدارة الحالة العامة للنظام
import { RoleProvider, SiteProvider, ToastProvider, useRole, useToast } from "./lib/store";

// استيراد المكونات المشتركة للواجهة العامة
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

// استيراد صفحات الموقع العامة ولوحة التحكم
import Gate from "./pages/Gate";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import Brief from "./pages/Brief";
import CustomPage from "./pages/CustomPage";
import AdminLayout from "./admin/AdminLayout";

/* ==================================================================
   1. مكوّن إعادة التمرير للأعلى تلقائياً (ScrollToTop)
   يقوم بنقل موضع الشاشة إلى أعلى نقطة فور الانتقال إلى مسار جديد
   ================================================================== */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // التمرير اللحظي لأعلى يسار الصفحة عند تغير المسار
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null; // مكون وظيفي لا يرسم عناصر بصرية
}

/* ==================================================================
   2. مكوّن مضيف التنبيهات والإشعارات العائمة (ToastHost)
   يعرض رسائل التأكيد والتحذير في الركن السفلي مع حركات انسيابية
   ================================================================== */
function ToastHost() {
  const { toasts } = useToast();

  return (
    // حاوية عائمة ثابتة في أسفل يمين الشاشة مع تعطيل تفاعل الماوس لعدم حجب ما تحتها
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`chamfer-sm flex items-center gap-2 border px-4 py-3 text-sm font-extrabold shadow-2xl ${
              t.tone === "ok" ? "border-neon/40 bg-ink text-paper" : "border-amber-400/50 bg-ink text-amber-200"
            }`}
          >
            {/* أيقونة النجاح (CheckCircle2) أو التحذير (AlertTriangle) بحسب نوع الرسالة */}
            {t.tone === "ok" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-neon" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            )}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ==================================================================
   3. هيكل التطبيق وقواعد المسارات (Shell)
   يتحكم في إظهار شاشة البوابة أو واجهة الموقع والمسارات التابعة لها
   ================================================================== */
function Shell() {
  const { role } = useRole();
  const loc = useLocation();

  // فحص حالة الدخول: إذا لم يختر المستخدم دوره بعد، تظهر بوابة الاختيار Gate
  if (role === null) return <Gate />;

  // التحقق مما إذا كان المستخدم يتصفح إحدى صفحات لوحة التحكم
  const isAdmin = loc.pathname.startsWith("/admin");

  return (
    <>
      {/* إعادة التمرير للأعلى عند كل انتقال */}
      <ScrollToTop />

      {/* إظهار شريط التنقل العلوي فقط في الصفحات العامة وحجبه عن لوحة التحكم */}
      {!isAdmin && <Navbar />}

      {/* خريطة توجيه المسارات وعرض الصفحة المقابلة لكل رابط */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/services/:serviceId/brief" element={<Brief />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/p/:slug" element={<CustomPage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        {/* إعادة توجيه أي رابط خاطئ إلى الصفحة الرئيسية تلقائياً */}
        <Route path="*" element={<Home />} />
      </Routes>

      {/* إظهار الفوتر وزر الواتساب في الصفحات العامة فقط */}
      {!isAdmin && <Footer />}
      <WhatsAppFloat />
    </>
  );
}

/* ==================================================================
   4. المكون الجذري للتطبيق (App Root Component)
   تغليف المشروع بمزودات الحالة العامة ونظام التوجيه
   ================================================================== */
export default function App() {
  return (
    <SiteProvider>
      <RoleProvider>
        <ToastProvider>
          {/* استخدام HashRouter لتوافق كامل مع الاستضافات الثابتة */}
          <HashRouter>
            <Shell />
            <ToastHost />
          </HashRouter>
        </ToastProvider>
      </RoleProvider>
    </SiteProvider>
  );
}