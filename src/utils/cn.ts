// استيراد مكتبة clsx لمعالجة الشروط المنطقية والمصفوفات لأسماء الفئات
import { clsx, type ClassValue } from "clsx";
// استيراد مكتبة tailwind-merge لحل تعارضات فئات Tailwind المكررة أو المتضاربة
import { twMerge } from "tailwind-merge";

/**
 * دالة مساعدة لدمج وتوحيد فئات CSS و Tailwind بشكل ديناميكي وآمن.
 * تتيح تمرير أي عدد من المدخلات (نصوص، شروط، مصفوفات، كائنات) وتخرج نص فئات نظيف وخالٍ من التعارضات.
 *
 * @param inputs - مصفوفة من الفئات أو الشروط المراد دمجها
 * @returns نص نهائي يحتوي على أسماء الفئات المدمجة بعد حل أي تضارب
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}