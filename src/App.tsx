import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { RoleProvider, SiteProvider, ToastProvider, useRole, useToast } from "./lib/store";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

import Gate from "./pages/Gate";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import Brief from "./pages/Brief";
import CustomPage from "./pages/CustomPage";
import AdminLayout from "./admin/AdminLayout";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}

function ToastHost() {
  const { toasts } = useToast();

  return (
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

function Shell() {
  const { role } = useRole();
  const loc = useLocation();

  if (role === null) return <Gate />;

  const isAdmin = loc.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/services/:serviceId/brief" element={<Brief />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/p/:slug" element={<CustomPage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdmin && <Footer />}
      <WhatsAppFloat />
    </>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <RoleProvider>
        <ToastProvider>
          <HashRouter>
            <Shell />
            <ToastHost />
          </HashRouter>
        </ToastProvider>
      </RoleProvider>
    </SiteProvider>
  );
}