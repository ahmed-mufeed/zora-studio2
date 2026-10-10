// دالة cn مخصصة بديلة ومقاومة للأخطاء بدون استيراد مكتبات خارجية
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).map(str => str.trim()).join(" ");
}