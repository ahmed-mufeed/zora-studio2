import { useState, useEffect } from "react";
import { Info, Phone, RotateCcw, Share2 } from "lucide-react";
import { useSite, useToast } from "../lib/store";
import { SECTION_LABELS, type SectionKey, type Settings } from "../lib/types";
import { SocialIcon, Toggle, type SocialName } from "../components/ui";
import { Card, Field, PageHead } from "./ui";

// تعريف دقيق وصارم للحقول لتفادي أخطاء الـ TypeScript
interface SocialField {
  key: "instagram" | "tiktok" | "x" | "linkedin";
  label: string;
}

const SOCIAL_FIELDS: SocialField[] = [
  { key: "instagram", label: "انستقرام" },
  { key: "tiktok", label: "تيك توك" },
  { key: "x", label: "إكس" },
  { key: "linkedin", label: "لينكدإن" }
];

export default function SettingsManager() {
  const { state, updateSettings, resetAll } = useSite();
  const { toast } = useToast();
  const [armed, setArmed] = useState(false);
  const s = state.settings;

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <div className="max-w-3xl">
      <PageHead title="الإعدادات العامة" sub="بيانات التواصل، الروابط الاجتماعية، والأقسام." />

      <div className="space-y-6">
        {/* أرقام التواصل */}
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
            <Phone className="h-5 w-5 text-royal" /> أرقام التواصل
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="رقم الواتساب (دولي)">
              <input 
                className="inp font-latin" 
                dir="ltr" 
                value={s.whatsapp} 
                onChange={(e) => updateSettings({ whatsapp: e.target.value })} 
              />
            </Field>
            <Field label="البريد الإلكتروني">
              <input 
                className="inp font-latin" 
                dir="ltr" 
                value={s.email} 
                onChange={(e) => updateSettings({ email: e.target.value })} 
              />
            </Field>
            <Field label="الهاتف المعروض ١">
              <input 
                className="inp font-latin" 
                dir="ltr" 
                value={s.phone} 
                onChange={(e) => updateSettings({ phone: e.target.value })} 
              />
            </Field>
            <Field label="الهاتف المعروض ٢">
              <input 
                className="inp font-latin" 
                dir="ltr" 
                value={s.phone2} 
                onChange={(e) => updateSettings({ phone2: e.target.value })} 
              />
            </Field>
          </div>
        </Card>

        {/* منصات التواصل الاجتماعي */}
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
            <Share2 className="h-5 w-5 text-royal" /> منصات التواصل
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SOCIAL_FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/35">
                    <SocialIcon name={f.key as SocialName} className="h-4 w-4" />
                  </span>
                  <input 
                    className="inp font-latin !pr-11" 
                    dir="ltr" 
                    value={s[f.key] || ""} 
                    onChange={(e) => updateSettings({ [f.key]: e.target.value } as Partial<Settings>)} 
                  />
                </div>
              </Field>
            ))}
          </div>
        </Card>

        {/* أقسام الصفحة الرئيسية */}
        <Card>
          <h2 className="mb-4 text-lg font-black font-sans">أقسام الصفحة الرئيسية</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-black/5 bg-paper px-4 py-3">
                <span className="text-sm font-extrabold text-ink/65">{SECTION_LABELS[key]}</span>
                <Toggle 
                  checked={s.sections[key] ?? false} 
                  onChange={(v) => updateSettings({ sections: { ...s.sections, [key]: v } })} 
                />
              </div>
            ))}
          </div>
        </Card>

        {/* منطقة الخطر */}
        <Card className="!border-rose-200">
          <h2 className="text-base font-black text-rose-600">منطقة الخطر: إعادة التعيين</h2>
          <p className="text-xs text-ink/50 mt-1">مسح شامل لكافة الخدمات والأعمال والآراء واسترجاع البيانات الأولية للموقع.</p>
          <button
            onClick={() => {
              if (armed) {
                resetAll();
                setArmed(false);
                toast("تم استرجاع الضبط الافتراضي");
              } else {
                setArmed(true);
              }
            }}
            className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-extrabold transition-all ${
              armed 
                ? "bg-rose-500 text-white border-rose-500 animate-pulse" 
                : "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200"
            }`}
          >
            <RotateCcw className="h-4 w-4" /> {armed ? "اضغط مرة أخرى للتأكيد قطعيًا" : "إعادة تعيين المحتوى بالكامل"}
          </button>
        </Card>
      </div>
    </div>
  );
}