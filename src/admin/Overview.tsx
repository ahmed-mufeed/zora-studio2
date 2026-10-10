import { Link } from "react-router-dom";
import { ClipboardList, FilePlus2, Handshake, Images, Layers, MessageSquareQuote, Sparkles } from "lucide-react";
import { useSite } from "../lib/store";
import { SECTION_LABELS, type SectionKey } from "../lib/types";
import { Toggle } from "../components/ui";
import { Card, PageHead } from "./ui";

export default function Overview() {
  const { state, updateSettings } = useSite();
  const s = state;

  const stats = [
    { label: "الخدمات", value: s.services.length, sub: `${s.services.filter((x) => !x.hidden).length} ظاهرة`, icon: Layers },
    { label: "الأعمال", value: s.portfolio.length, sub: `${s.categories.length} فئات`, icon: Images },
    { label: "آراء العملاء", value: s.testimonials.length, sub: `${s.testimonials.filter((t) => t.visible).length} معروضة`, icon: MessageSquareQuote },
    { label: "شركاء النجاح", value: s.partners.length, sub: "في الشريط المتحرك", icon: Handshake },
    { label: "أسئلة البريف", value: s.services.reduce((a, x) => a + x.questions.length, 0), sub: "موزعة على الخدمات", icon: ClipboardList },
    { label: "الصفحات", value: s.pages.length, sub: "صفحات مخصصة", icon: FilePlus2 },
  ];

  return (
    <div>
      <PageHead title="مرحبًا بك في لوحة زورا" sub="تحكّم كامل وسهل تنعكس تعديلاته فوراً على الموقع." />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((st) => (
          <Card key={st.label} className="!p-5">
            <span className="chamfer-sm grid h-10 w-10 place-items-center bg-royal/10 text-royal">
              <st.icon className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <div className="mt-4 font-latin text-3xl font-bold text-ink">{st.value}</div>
            <div className="mt-0.5 text-sm font-extrabold text-ink/70">{st.label}</div>
            <div className="mt-0.5 text-[11px] font-bold text-ink/35">{st.sub}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-black">إظهار أقسام الصفحة الرئيسية</h2>
          <p className="mt-1 text-xs font-bold text-ink/40">أخفِ أو أظهر أي قسم بلمسة واحدة.</p>
          <div className="mt-5 space-y-2">
            {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
                <span className="text-sm font-extrabold text-ink/70">{SECTION_LABELS[key]}</span>
                <Toggle
                  checked={s.settings.sections[key]}
                  onChange={(v) => updateSettings({ sections: { ...s.settings.sections, [key]: v } })}
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-black">إجراءات سريعة</h2>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {[
                { to: "services", label: "إدارة الخدمات" },
                { to: "portfolio", label: "إضافة عمل" },
                { to: "testimonials", label: "إضافة رأي عميل" },
                { to: "briefs", label: "تعديل بريف" },
                { to: "pages", label: "صفحة جديدة" },
                { to: "settings", label: "رقم الواتساب" },
              ].map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="rounded-xl border border-ink/10 bg-paper px-4 py-3 text-center text-sm font-extrabold text-ink/65 transition-all hover:border-royal hover:text-royal"
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="!border-neon/60 !bg-[#f4ffe0]">
            <h2 className="flex items-center gap-2 text-base font-black text-ink">
              <Sparkles className="h-5 w-5 text-royal" /> نموذج تجريبي ذكي
            </h2>
            <p className="mt-2 text-sm font-semibold leading-7 text-ink/60">
              كل ما تعدّله هنا يُحفظ محليًا في متصفحك ويظهر فورًا على الموقع. يمكنك استعادة الحالة الافتراضية بأي وقت من صفحة الإعدادات.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}