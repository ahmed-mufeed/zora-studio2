import { Link } from "react-router-dom";
import { ArrowLeft, PauseCircle } from "lucide-react";
import { fmtPrice } from "../lib/store";
import { Reveal } from "./ui";
import type { Service } from "../lib/types";

export default function ServiceCard({ service: s, index = 0 }: { service: Service; index?: number }) {
  return (
    <Reveal delay={0.07 * index} className="h-full">
      <Link
        to={`/services/${s.id}`}
        className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white text-ink shadow-sm hover:shadow-2xl hover:shadow-royal/15"
      >
        <div className="relative h-52 shrink-0 overflow-hidden">
          <img
            src={s.image}
            alt={s.title}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110 ${
              s.status === "unavailable" ? "grayscale" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />

          {s.status === "unavailable" && (
            <span className="chamfer-sm absolute right-3 top-3 inline-flex items-center gap-1.5 bg-ink/85 px-3 py-1.5 text-[11px] font-extrabold text-paper backdrop-blur">
              <PauseCircle className="h-3.5 w-3.5" />
              غير متاحة مؤقتًا
            </span>
          )}

          <span className="chamfer-sm absolute bottom-3 right-3 bg-neon px-3 py-1.5 text-[15px] font-black text-ink">
            <span className="font-latin">{fmtPrice(s.price)}</span>{" "}
            <span className="text-[10px] font-extrabold opacity-75">ر.س / {s.priceUnit}</span>
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-black transition-colors duration-300 group-hover:text-royal">{s.title}</h3>
          <p className="mt-2 flex-1 text-sm font-semibold leading-7 text-ink/55">{s.short}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-royal">
            التفاصيل والطلب
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}