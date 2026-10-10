import { useLocation } from "react-router-dom";
import { SocialIcon } from "./ui";
import { useSite, waLink } from "../lib/store";

export default function WhatsAppFloat() {
  const { state } = useSite();
  const loc = useLocation();

  if (loc.pathname.startsWith("/admin")) return null;

  return (
    <a
      href={waLink(state.settings.whatsapp, "مرحبًا زورا استوديو! أريد الاستفسار عن خدماتكم.")}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      className="group fixed bottom-6 left-6 z-40 flex items-center gap-3"
    >
      <span className="pointer-events-none translate-x-2 rounded-xl border border-white/10 bg-ink px-3 py-2 text-xs font-bold text-paper opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        تحدث معنا الآن
      </span>

      <span className="pulse-glow grid h-14 w-14 place-items-center rounded-2xl bg-neon text-ink shadow-2xl transition-transform duration-300 group-hover:scale-105">
        <SocialIcon name="whatsapp" className="h-7 w-7" />
      </span>
    </a>
  );
}