// استيراد ملف صورة الشعار الرسمي من مجلد الشعارات
import zoraLogoImg from "../logos/zora-logo.png";

// مكوّن الشعار الموحد للموقع ولوحة التحكم
export default function Logo({
  className = "", // فئات CSS إضافية لتعديل المظهر الخارجي أو الهوامش
}: {
  compact?: boolean; // خاصية اختيارية للتوافق العكسي مع المكونات التي قد تمررها
  className?: string;
}) {
  return (
    // حاوية مرنة تضمن المحاذاة العمودية وتمنع تحديد الصورة بالماوس
    <div className={`flex items-center select-none ${className}`}>
      {/* 
        - w-[50px]: تحديد عرض الصورة بدقة 50 بكسل
        - h-auto: جعل الارتفاع تلقائياً للحفاظ على نسبة العرض إلى الارتفاع الأصلية
        - object-contain: الحفاظ على أبعاد الشعار ومنع حدوث أي تشوه بصري
      */}
      <img
        src={zoraLogoImg}
        alt="Zora Studio Logo"
        className="h-auto w-[50px] object-contain"
      />
    </div>
  );
}