import { useMemo, useRef, useState, type CSSProperties, type ReactNode, forwardRef } from "react";
// استيراد أدوات التوجيه واستخراج معاملات الرابط من React Router
import { Link, useParams } from "react-router-dom";
// استيراد أدوات التحريك والتأثيرات الانتقالية من Framer Motion
import { AnimatePresence, motion } from "framer-motion";
// استيراد الأيقونات المساعدة من مكتبة Lucide
import {
  Check,
  ClipboardList,
  FileDown,
  Loader2,
  MoveRight,
  PartyPopper,
  X,
  Eye,
} from "lucide-react";
// استيراد مكون خلفية البرق ومكونات الواجهة المشتركة
import Lightning from "../components/Lightning";
import { Chip, Reveal, SocialIcon } from "../components/ui";
// استيراد دوال المتجر العام وتوليد رابط الواتساب وأداة تصدير الـ PDF
import { fmtPrice, useSite, useToast, waLink } from "../lib/store";
import { exportElementToPdf } from "../lib/pdf";
import type { BriefQuestion, Service, Settings } from "../lib/types";

// استيراد الصورة الرسمية لشعار زورا استوديو
import zoraLogoImg from "../logos/zora-logo.png";
// 🔴 استيراد صورة الخلفية الكاملة من مجلد assets
import pdfBgImg from "../assets/pdf-bg.jpg";

// نوع يمثل كائن إجابات البريف (معرف السؤال -> الإجابة كنص أو مصفوفة أو رقم)
type Answers = Record<string, string | string[] | number>;

// دالة تهيئة الإجابات الافتراضية بناءً على نوع كل سؤال
const initAnswers = (qs: BriefQuestion[]): Answers =>
  Object.fromEntries(
    qs.map((q) => [
      q.id,
      q.type === "slider" ? (q.min ?? 0) : q.type === "checkbox" ? ([] as string[]) : "",
    ])
  );

export default function Brief() {
  // استخراج معرّف الخدمة من رابط الصفحة الحالية
  const { serviceId } = useParams();
  const { state } = useSite();
  
  // البحث عن الخدمة المطلوبة من قائمة الخدمات المخزنة
  const service = state.services.find((s) => s.id === serviceId);

  // شاشة حماية: تظهر في حال كانت الخدمة غير موجودة أو تم إخفاؤها من لوحة التحكم
  if (!service || service.hidden) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-5">
        <div className="text-center">
          <h1 className="text-3xl font-black text-paper">البريف غير متوفر</h1>
          <p className="mt-3 text-sm font-semibold text-paper/50">الخدمة المطلوبة غير موجودة أو مخفية حاليًا.</p>
          <Link to="/services" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-neon">
            <MoveRight className="h-4 w-4" /> العودة إلى الخدمات
          </Link>
        </div>
      </main>
    );
  }

  // تمرير مفتاح فريد لضمان إعادة تهيئة النموذج بالكامل عند التبديل بين الخدمات
  return <BriefForm key={service.id} service={service} settings={state.settings} />;
}

/* ==================================================================
   المكون الرئيسي لنموذج تعبئة واستخراج البريف
   ================================================================== */

function BriefForm({ service, settings }: { service: Service; settings: Settings }) {
  const { toast } = useToast();
  const qs = service.questions; // مصفوفة أسئلة هذه الخدمة
  
  // الحالات التفاعلية للنموذج
  const [answers, setAnswers] = useState<Answers>(() => initAnswers(qs));
  const [customMode, setCustomMode] = useState<Record<string, boolean>>({}); // تفعيل خيار كتابة إجابة مخصصة
  const [customText, setCustomText] = useState<Record<string, string>>({}); // النصوص المكتوبة يدوياً
  const [attempted, setAttempted] = useState(false); // هل حاول المستخدم التصدير؟
  const [exporting, setExporting] = useState(false); // حالة تحميل جاري إنشاء الـ PDF
  const [done, setDone] = useState(false); // حالة فتح نافذة النجاح بعد التصدير
  const [showPreview, setShowPreview] = useState(false); // حالة إظهار معاينة الـ PDF لايف
  const pdfRef = useRef<HTMLDivElement>(null); // مرجع لعنصر الـ PDF لتصييره

  // فحص ما إذا كان السؤال قد تمت الإجابة عليه فعلياً
  const isAnswered = (q: BriefQuestion): boolean => {
    if (q.type === "slider") return true;
    if (q.type === "choice") {
      return customMode[q.id] ? Boolean(customText[q.id]?.trim()) : Boolean(answers[q.id]);
    }
    if (q.type === "checkbox") {
      const arr = (answers[q.id] as string[]) ?? [];
      return arr.length > 0 || Boolean(q.allowCustom && customText[q.id]?.trim());
    }
    return Boolean((answers[q.id] as string)?.trim());
  };

  // فحص صلاحية السؤال (صالح إذا كان اختيارياً أو إذا تمت الإجابة عليه)
  const valid = (q: BriefQuestion) => !q.required || isAnswered(q);
  
  // حساب عدد الأسئلة المجاب عنها لحساب شريط التقدم
  const answeredCount = useMemo(() => qs.filter((q) => isAnswered(q)).length, [answers, customMode, customText, qs]);

  // دالة تنسيق الإجابة وتحويلها لنص مقروء لعرضه داخل مستند الـ PDF
  const formatAnswer = (q: BriefQuestion): string => {
    if (q.type === "slider") return `${((answers[q.id] as number) ?? 0).toLocaleString("en-US")} ${q.unit ?? ""}`.trim();
    if (q.type === "choice") return customMode[q.id] ? customText[q.id]?.trim() || "—" : (answers[q.id] as string) || "—";
    if (q.type === "checkbox") {
      const arr = [...(((answers[q.id] as string[]) ?? []) as string[])];
      if (q.allowCustom && customText[q.id]?.trim()) arr.push(customText[q.id].trim());
      return arr.join("، ") || "—";
    }
    return ((answers[q.id] as string) ?? "").trim() || "—";
  };

  // دالة فحص وتصدير ملف الـ PDF
  const doExport = async () => {
    setAttempted(true);
    
    // البحث عن أول سؤال إجباري غير مكتمل
    const firstInvalid = qs.find((q) => !valid(q));
    if (firstInvalid) {
      // التمرير السلس بالصفحة نحو السؤال الناقص
      document.getElementById(`q-${firstInvalid.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast("أكمل الأسئلة الإجبارية أولًا", "warn");
      return;
    }
    
    if (!pdfRef.current) return;
    setExporting(true);
    
    try {
      // انتظار بسيط لضمان اكتمال تصيير الخطوط والصور
      await new Promise((r) => setTimeout(r, 150));
      // توليد ملف الـ PDF وتنزيله
      await exportElementToPdf(pdfRef.current, `zora-brief-${service.id}.pdf`);
      setDone(true); // فتح نافذة النجاح
    } catch {
      toast("تعذّر إنشاء الملف — حاول مرة أخرى", "warn");
    } finally {
      setExporting(false);
    }
  };

  // تحديث إجابة سؤال معين
  const set = (qid: string, v: string | string[] | number) => setAnswers((a) => ({ ...a, [qid]: v }));

  return (
    <main className="bg-ink">
      {/* =========================================================
          هيدر الصفحة التعريفي
          ========================================================= */}
      <section className="relative overflow-hidden pb-16 pt-36">
        <Lightning />
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <Chip>بريف الخدمة</Chip>
          <h1 className="mx-auto mt-6 max-w-2xl text-3xl font-black leading-[1.25] text-paper md:text-5xl md:leading-[1.2]">
            بريف <span className="text-neon">{service.title}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-8 text-paper/55 md:text-base">
            أجب على الأسئلة التالية بدقّة — كلما كان البريف أوضح، كان تنفيذنا أسرع وأدقّ. عند الانتهاء صدّر الملف PDF وأرسله لنا واتساب.
          </p>
        </div>
      </section>

      {/* =========================================================
          جسم النموذج: قائمة الأسئلة + الشريط الجانبي للملخص
          ========================================================= */}
      <section className="slant-r bg-paper pb-28 pt-20 text-ink md:pt-24">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-5 lg:grid-cols-[1fr_350px]">
          
          {/* قسم بطاقات الأسئلة التفاعلية */}
          <div className="space-y-5">
            {qs.map((q, i) => {
              const invalid = attempted && !valid(q);
              return (
                <Reveal key={q.id} delay={0.03 * Math.min(i, 10)}>
                  <div
                    id={`q-${q.id}`}
                    className={`rounded-2xl border bg-white p-6 shadow-sm transition-colors md:p-7 ${
                      invalid ? "border-rose-400" : "border-black/5"
                    }`}
                  >
                    {/* ترويسة السؤال */}
                    <div className="mb-5 flex items-start gap-4">
                      <span className="chamfer-sm grid h-9 w-9 shrink-0 place-items-center bg-royal font-latin text-sm font-bold text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-base font-black leading-7 md:text-lg">{q.label}</h3>
                        <span className={`mt-1 inline-block text-[11px] font-extrabold ${q.required ? "text-royal" : "text-ink/35"}`}>
                          {q.required ? "إجباري" : "اختياري"}
                        </span>
                      </div>
                    </div>

                    {/* حقل الاختيار المفرد (Choice) */}
                    {q.type === "choice" && (
                      <div className="flex flex-wrap gap-2.5">
                        {(q.options ?? []).map((opt) => {
                          const active = !customMode[q.id] && answers[q.id] === opt;
                          return (
                            <OptionBtn
                              key={opt}
                              active={active}
                              onClick={() => {
                                set(q.id, opt);
                                setCustomMode((m) => ({ ...m, [q.id]: false }));
                              }}
                            >
                              {opt}
                            </OptionBtn>
                          );
                        })}
                        {q.allowCustom && (
                          <OptionBtn
                            active={Boolean(customMode[q.id])}
                            onClick={() => setCustomMode((m) => ({ ...m, [q.id]: true }))}
                          >
                            أخرى — أكتب بنفسي
                          </OptionBtn>
                        )}
                        {q.allowCustom && customMode[q.id] && (
                          <input
                            autoFocus
                            className="inp mt-1"
                            placeholder="اكتب إجابتك هنا…"
                            value={customText[q.id] ?? ""}
                            onChange={(e) => setCustomText((t) => ({ ...t, [q.id]: e.target.value }))}
                          />
                        )}
                      </div>
                    )}

                    {/* حقل الاختيارات المتعددة (Checkbox) */}
                    {q.type === "checkbox" && (
                      <div className="flex flex-wrap gap-2.5">
                        {(q.options ?? []).map((opt) => {
                          const arr = ((answers[q.id] as string[]) ?? []) as string[];
                          const active = arr.includes(opt);
                          return (
                            <OptionBtn
                              key={opt}
                              active={active}
                              square
                              onClick={() =>
                                set(q.id, active ? arr.filter((x) => x !== opt) : [...arr, opt])
                              }
                            >
                              {opt}
                            </OptionBtn>
                          );
                        })}
                        {q.allowCustom && (
                          <input
                            className="inp !w-full sm:!w-72"
                            placeholder="خيار آخر؟ اكتبه هنا (اختياري)"
                            value={customText[q.id] ?? ""}
                            onChange={(e) => setCustomText((t) => ({ ...t, [q.id]: e.target.value }))}
                          />
                        )}
                      </div>
                    )}

                    {/* حقل المنزلق الرقمي (Slider) */}
                    {q.type === "slider" && (
                      <SliderField
                        q={q}
                        value={(answers[q.id] as number) ?? q.min ?? 0}
                        onChange={(v) => set(q.id, v)}
                      />
                    )}

                    {/* حقل النص الحر (Text) */}
                    {q.type === "text" && (
                      <textarea
                        rows={3}
                        className="inp resize-y"
                        placeholder={q.placeholder ?? "اكتب إجابتك…"}
                        value={(answers[q.id] as string) ?? ""}
                        onChange={(e) => set(q.id, e.target.value)}
                      />
                    )}

                    {invalid && (
                      <p className="mt-3 text-xs font-extrabold text-rose-600">هذا السؤال إجباري — أضِف إجابتك للمتابعة.</p>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* الشريط الجانبي الثابت: ملخص الخدمة وزر التصدير */}
          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="relative h-36">
                <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute bottom-3 right-4 text-sm font-black text-white">{service.title}</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-black/5 pb-4">
                  <span className="text-xs font-bold text-ink/45">يبدأ السعر من</span>
                  <span className="font-latin text-xl font-bold text-royal">
                    {fmtPrice(service.price)}
                    <span className="mr-1 font-sans text-[10px] font-extrabold text-ink/50">ر.س / {service.priceUnit}</span>
                  </span>
                </div>

                <div className="py-4">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-ink/45">اكتمال البريف</span>
                    <span className="font-latin text-royal">
                      {answeredCount}/{qs.length}
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-ink/8">
                    <div
                      className="h-full rounded-full bg-royal transition-all duration-500"
                      style={{ width: `${(answeredCount / Math.max(1, qs.length)) * 100}%` }}
                    />
                  </div>
                </div>

                {service.status !== "available" && (
                  <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-extrabold leading-6 text-amber-700">
                    هذه الخدمة متوقفة مؤقتًا — يمكنك تعبئة البريف كمسودة، لكن يُفضّل التواصل معنا أولًا للتأكد من التوفر.
                  </div>
                )}
                
                {/* زر معاينة التصميم لايف */}
                <button
                  onClick={() => setShowPreview(true)}
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neon bg-neon/10 px-6 py-3.5 text-sm font-extrabold text-neon transition-colors hover:bg-neon hover:text-ink"
                >
                  <Eye className="h-5 w-5" /> معاينة تصميم الـ PDF لايف
                </button>

                {/* زر تصدير وتنزيل ملف البريف PDF */}
                <button
                  onClick={doExport}
                  disabled={exporting || service.status !== "available"}
                  className="chamfer-sm glow-neon flex w-full items-center justify-center gap-2 bg-neon px-6 py-4 text-sm font-extrabold text-ink transition-transform duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 disabled:saturate-50"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> جارٍ إنشاء الملف…
                    </>
                  ) : (
                    <>
                      <FileDown className="h-5 w-5" /> تصدير البريف PDF
                    </>
                  )}
                </button>
                
                <p className="mt-3.5 flex items-start gap-2 text-[11px] font-bold leading-5 text-ink/45">
                  <ClipboardList className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  بعد التصدير، أرسل الملف الذي تم تنزيله إلينا عبر واتساب وسنبدأ فورًا.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* =========================================================
          مستند الـ PDF المنفصل للمعاينة وللتصدير بدون انحراف أو صفحات زائدة
          ========================================================= */}
      {showPreview ? (
        /* وضع المعاينة التفاعلية */
        <div className="fixed inset-0 z-[100] flex justify-center overflow-y-auto bg-black/80 py-10 backdrop-blur-sm">
          <button
            onClick={() => setShowPreview(false)}
            className="fixed right-6 top-6 z-[101] flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-rose-600 shadow-lg transition-colors hover:bg-rose-50"
          >
            <X className="h-4 w-4" /> إغلاق المعاينة
          </button>

          <div className="shadow-2xl">
            <BriefPdf
              ref={pdfRef}
              service={service}
              settings={settings}
              rows={qs.map((q) => ({ q, value: formatAnswer(q) }))}
            />
          </div>
        </div>
      ) : (
        /* وضع التصدير المخفي بوضعية متناسقة مع أبعاد الصفحة */
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <BriefPdf
            ref={pdfRef}
            service={service}
            settings={settings}
            rows={qs.map((q) => ({ q, value: formatAnswer(q) }))}
          />
        </div>
      )}

      {/* =========================================================
          النافذة المنبثقة للنجاح والتوجيه للواتساب
          ========================================================= */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-ink/80 px-5 backdrop-blur-sm"
            onClick={() => setDone(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 text-center text-ink shadow-2xl"
            >
              <button
                onClick={() => setDone(false)}
                className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-xl text-ink/40 transition-colors hover:bg-ink/5"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
              
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-neon/20 text-royal">
                <PartyPopper className="h-8 w-8" />
              </span>
              
              <h3 className="mt-5 text-2xl font-black">تم تصدير البريف بنجاح!</h3>
              <p className="mt-3 text-sm font-semibold leading-8 text-ink/55">
                الخطوة الأخيرة: أرسل ملف الـ PDF الذي تم تنزيله إلى واتساب زورا استوديو، وسيتواصل معك فريقنا في أقرب وقت لبدء مشروعك.
              </p>
              
              <a
                href={waLink(
                  settings.whatsapp,
                  `مرحبًا زورا استوديو! أكملت تعبئة بريف خدمة «${service.title}» وسأرسل ملف PDF الآن.`
                )}
                target="_blank"
                rel="noreferrer"
                className="chamfer-sm glow-neon mt-6 flex items-center justify-center gap-2.5 bg-neon px-6 py-4 text-sm font-extrabold text-ink transition-transform hover:-translate-y-0.5"
              >
                <SocialIcon name="whatsapp" className="h-5 w-5" />
                إرسال البريف عبر واتساب
              </a>
              
              <button onClick={() => setDone(false)} className="mt-3 text-xs font-extrabold text-ink/40 hover:text-ink">
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ==================================================================
   مكونات الأزرار والمنزلق
   ================================================================== */

function OptionBtn({ active, onClick, children, square = false }: { active: boolean; onClick: () => void; children: ReactNode; square?: boolean; }) {
  return (
    <button type="button" onClick={onClick} className={`chamfer-sm flex items-center gap-2 px-4 py-2.5 text-sm font-extrabold transition-all duration-200 ${ active ? "bg-royal text-white glow-royal" : "border border-ink/15 bg-white text-ink/60 hover:border-royal/50 hover:text-royal" }`}>
      <span className={`grid h-4 w-4 shrink-0 place-items-center border-2 transition-colors ${ square ? "rounded-[5px]" : "rounded-full" } ${active ? "border-neon bg-neon" : "border-ink/25"}`}>
        {active && (square ? <Check className="h-3 w-3 text-ink" strokeWidth={3.5} /> : <span className="h-1.5 w-1.5 rounded-full bg-ink" />)}
      </span>
      {children}
    </button>
  );
}

function SliderField({ q, value, onChange }: { q: BriefQuestion; value: number; onChange: (v: number) => void; }) {
  const min = q.min ?? 0;
  const max = q.max ?? 100;
  const pct = ((value - min) / (max - min)) * 100; 
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="font-latin text-xs font-bold text-ink/40">{min.toLocaleString("en-US")}</span>
        <span className="chamfer-sm bg-neon px-4 py-1.5 font-latin text-lg font-bold text-ink">
          {value.toLocaleString("en-US")}<span className="mr-1.5 font-sans text-[11px] font-extrabold">{q.unit}</span>
        </span>
        <span className="font-latin text-xs font-bold text-ink/40">{max.toLocaleString("en-US")}</span>
      </div>
      <input type="range" min={min} max={max} step={q.step ?? 1} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ "--fill": `${pct}%` } as CSSProperties} />
    </div>
  );
}

/* ==================================================================
   هيكل وتصميم مستند الـ PDF المنشأ بمقاس A4 القياسي الدقيق (794px × 1123px)
   ================================================================== */

const BriefPdf = forwardRef<
  HTMLDivElement,
  {
    service: Service;
    settings: Settings;
    rows: { q: BriefQuestion; value: string }[];
  }
>(function BriefPdf({ service, settings, rows }, ref) {
  const date = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" });
  
  return (
    <div
      ref={ref}
      dir="rtl"
      style={{
        position: "relative",
        width: "794px",
        minHeight: "1123px",
        background: "#F5F6FB",
        color: "#131319",
        fontFamily: "'Cairo', sans-serif",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* 🔴 1. صورة الخلفية الكلية المأخوذة من مجلد assets */}
      <img
        src={pdfBgImg}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* 🔴 2. محتوى الصفحة مصفوف فوق الخلفية مع زيف الشفافية */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "1123px",
          boxSizing: "border-box",
        }}
      >
        {/* هيدر المستند */}
        <div
          style={{
            padding: "28px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <img
              src={zoraLogoImg}
              alt="Zora Studio"
              style={{ width: "52px", height: "52px", objectFit: "contain", display: "block", opacity: "0%", borderRadius: "8px", padding: "6px" }}
            />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#526aba", fontSize: "14px", fontWeight: 800 }}>بريف عميل جديد</div>
            <div style={{ color: "#8f93ad", fontSize: "12px", fontWeight: 700, marginTop: "4px" }}>
              {date}
            </div>
          </div>
        </div>

        {/* 🔴 شريط تفاصيل الخدمة (تم تفريغ خلفيته الصلبة ليصبح شفافاً ويبرز خلفية assets) */}
        <div
          style={{
            background: "transparent",
            color: "#ffffff",
            padding: "18px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: 900, textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}>
            {service.title}
          </div>
          <div style={{ background: "#ADFF2B", borderRadius: "5px", color: "#131319", padding: "6px 14px", fontSize: "14px", fontWeight: 900 }}>
            يبدأ من {service.price.toLocaleString("en-US")} ر.س / {service.priceUnit}
          </div>
        </div>

        {/* مساحة الأسئلة (تتمدد بسلاسة لتملأ الصفحة) */}
        <div style={{ padding: "30px 40px", flex: 1, boxSizing: "border-box" }}>
          {rows.map((r, i) => (
            <div
              key={r.q.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e4e6f2",
                borderRight: "5px solid #332cb1",
                padding: "16px 20px",
                marginBottom: "12px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#332cb1", marginBottom: "6px" }}>
                {String(i + 1).padStart(2, "0")} — {r.q.label}
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: r.value === "—" ? "#9a9db4" : "#131319",
                  lineHeight: 1.8,
                  borderRadius: "5px",
                  background: r.q.type === "slider" ? "#edf9db" : "transparent",
                  display: "inline-block",
                  padding: r.q.type === "slider" ? "3px 12px" : 0,
                }}
              >
                {r.value}
              </div>
            </div>
          ))}
        </div>

        {/* الفوتر ومربع الواتساب (ملتصق دائماً بأسفل الصفحة) */}
        <div style={{ padding: "0 40px 28px 40px", marginTop: "auto", boxSizing: "border-box" }}>
          <div
            style={{
              background: "#131319",
              color: "#F5F6FB",
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 800 }}>
              أرسل هذا الملف عبر واتساب لبدء مشروعك فورًا
            </div>
            <div style={{ color: "#ADFF2B", fontSize: "16px", fontWeight: 900, direction: "ltr" }}>
              {settings.whatsapp}
            </div>
          </div>
          
          <div style={{ marginTop: "12px", fontSize: "10px", fontWeight: 700, color: "#9a9db4", textAlign: "center" }}>
            zora.studio — إبداعٌ يضرب كالصاعقة
          </div>
        </div>
      </div>
    </div>
  );
});

BriefPdf.displayName = "BriefPdf";