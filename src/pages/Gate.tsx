import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Info, LayoutDashboard } from "lucide-react";
import Logo from "../components/Logo";
import Lightning from "../components/Lightning";
import { IMG } from "../lib/data";
import { useRole, type Role } from "../lib/store";

export default function Gate() {
  const { choose } = useRole();
  const navigate = useNavigate();

  const enter = (role: Exclude<Role, null>) => {
    choose(role);
    navigate(role === "admin" ? "/admin" : "/");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5 py-16">
      <img src={IMG.heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/80 to-ink" />
      <Lightning />

      <motion.div
        initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-3xl text-center"
      >
        <div className="mb-3 flex justify-center">
          <Logo />
        </div>

        <h1 className="text-3xl font-black leading-snug text-paper md:text-4xl">
          مرحبًا بك في استوديو الإبداع
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-paper/55 md:text-base">
          اختر طريقة الدخول لمتابعة التجربة — النموذج التجريبي كامل وتفاعلي بالكامل.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => enter("visitor")}
            className="card-lift group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-7 text-right backdrop-blur-sm hover:border-neon/50"
          >
            <span className="chamfer-sm mb-5 grid h-12 w-12 place-items-center bg-neon text-ink">
              <Eye className="h-6 w-6" />
            </span>
            <span className="block text-xl font-black text-paper">متابعة كزائر</span>
            <span className="mt-2 block text-sm font-semibold leading-6 text-paper/50">
              استكشف الموقع، الأعمال، الخدمات، وجرّب نموذج البريف التفاعلي.
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-neon opacity-0 transition-all duration-300 group-hover:opacity-100">
              دخول الموقع <ArrowLeft className="h-4 w-4" />
            </span>
          </button>

          <button
            onClick={() => enter("admin")}
            className="card-lift group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-7 text-right backdrop-blur-sm hover:border-royal-2/70"
          >
            <span className="chamfer-sm mb-5 grid h-12 w-12 place-items-center bg-royal text-paper">
              <LayoutDashboard className="h-6 w-6" />
            </span>
            <span className="block text-xl font-black text-paper">متابعة كمسؤول</span>
            <span className="mt-2 block text-sm font-semibold leading-6 text-paper/50">
              لوحة تحكم كاملة لإدارة المحتوى والخدمات والأعمال ونماذج البريف.
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-royal-2 opacity-0 transition-all duration-300 group-hover:text-neon group-hover:opacity-100">
              لوحة التحكم <ArrowLeft className="h-4 w-4" />
            </span>
          </button>
        </div>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-[11px] font-bold text-paper/40">
          <Info className="h-3.5 w-3.5 shrink-0 text-neon" />
          تسجيل الدخول محاكاة لأغراض العرض التجريبي فقط — لا يتم طلب أو تخزين أي بيانات حقيقية.
        </p>
      </motion.div>
    </div>
  );
}