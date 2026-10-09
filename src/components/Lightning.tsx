// مكوّن خلفية جمالية تفاعلية تعرض خطوط صواعق وبرق متحركة (SVG) وتأثيرات توهج ضبابية
export default function Lightning({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light" | "royal"; // خيارات مظهر الخلفية: داكن (افتراضي)، فاتح، أو ملكي
  className?: string; // فئات CSS مخصصة إضافية
}) {
  // تحديد درجة شفافية اللون النيوني للصواعق بحسب المظهر
  const neonOp = variant === "dark" ? 0.35 : 0.25;
  
  // تحديد لون الخطوط المائلة (داكن للوضع الفاتح وأبيض فاتح للوضع الداكن)
  const lineStroke = variant === "light" ? "#332cb1" : "#F5F6FB";
  
  // تحديد شفافية الخطوط المائلة الخلفية
  const lineOp = variant === "light" ? 0.07 : 0.05;

  return (
    // حاوية العنصر: معطلة التفاعل عبر الماوس ومخفية عن قارئات الشاشة لأنه عنصر زخرفي فقط
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      
      {/* رسم المتجهات SVG الذي يحتوي على مسارات البرق والخطوط المتوازية */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 900" fill="none">
        
        {/* مسار الصاعقة الأولى المتوهجة باللون النيوني الأخضر */}
        <path
          d="M1200 -60 L760 480 L980 480 L520 960"
          stroke="#ADFF2B"
          strokeOpacity={neonOp}
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="bolt-path"
        />

        {/* مسار صاعقة ثانية رفيعة مع تأخير زمني في الحركة مدته 1.5 ثانية */}
        <path
          d="M1420 100 L1070 560 L1260 560 L880 980"
          stroke="#ADFF2B"
          strokeOpacity={neonOp * 0.55}
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="bolt-path"
          style={{ animationDelay: "1.5s" }}
        />

        {/* مسار صاعقة بلون أزرق/ملكي تنطلق بالاتجاه المعاكس مع تأخير زمني 2.8 ثانية */}
        <path
          d="M-80 720 L340 260 L150 260 L600 -120"
          stroke={variant === "light" ? "#332cb1" : "#332cb1"}
          strokeOpacity={variant === "light" ? 0.22 : 0.55}
          strokeWidth="2"
          strokeLinejoin="round"
          className="bolt-path"
          style={{ animationDelay: "2.8s" }}
        />

        {/* توليد 9 خطوط مائلة متوازية في الجانب الأيسر لإضفاء نمط شبكي جمالي */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={i}
            x1={-200 + i * 90}
            y1={940}
            x2={500 + i * 90}
            y2={-80}
            stroke={lineStroke}
            strokeOpacity={lineOp}
            strokeWidth="1.5"
          />
        ))}

        {/* توليد 6 خطوط مائلة متوازية في الجانب الأيمن من الشاشة */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`r${i}`}
            x1={900 + i * 110}
            y1={980}
            x2={1600 + i * 110}
            y2={-60}
            stroke={lineStroke}
            strokeOpacity={lineOp * 1.4}
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* دوائر التوهج والإضاءة الخلفية الضبابية (تظهر فقط في الأنماط غير الفاتحة) */}
      {variant !== "light" && (
        <>
          {/* دائرة توهج ملونة علوية في أقصى اليسار */}
          <div className="absolute -top-44 -left-44 h-[480px] w-[480px] rounded-full bg-royal/45 blur-[140px]" />
          
          {/* دائرة توهج ملونة سفلية في الجهة اليمنى */}
          <div className="absolute -bottom-24 right-[12%] h-[320px] w-[560px] rounded-full bg-royal-2/25 blur-[120px]" />
        </>
      )}
    </div>
  );
}