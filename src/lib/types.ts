export type FieldType = "choice" | "checkbox" | "slider" | "text";

export interface BriefQuestion {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
  allowCustom?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export interface Service {
  id: string;
  title: string;
  short: string;
  full: string[];
  price: number;
  priceUnit: string;
  image: string;
  status: "available" | "unavailable";
  hidden: boolean;
  features: string[];
  questions: BriefQuestion[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  categoryId: string;
  image: string;
  tags: string[];
  year: string;
  aspectRatio?: "auto" | "square" | "portrait" | "landscape" | "widescreen" | "story" | "banner" | "custom";
  customWidth?: number;
  customHeight?: number;
  lockAspectRatio?: boolean;
}

export interface PortfolioCategory {
  id: string;
  name: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  visible: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  body: string;
  visible: boolean;
}

export interface Feature {
  icon: "zap" | "gem" | "percent" | "chat";
  title: string;
  text: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SiteContent {
  heroBadge: string;
  heroTitleA: string;
  heroTitleB: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: Stat[];
  aboutTitle: string;
  aboutText: string;
  features: Feature[];
  ctaTitle: string;
  ctaSubtitle: string;
  footerAbout: string;
}

export type SectionKey =
  | "partners"
  | "services"
  | "portfolio"
  | "about"
  | "testimonials"
  | "cta"
  | "stats";

export interface Settings {
  whatsapp: string;
  phone: string;
  phone2: string;
  email: string;
  instagram: string;
  tiktok: string;
  x: string;
  linkedin: string;
  sections: Record<SectionKey, boolean>;
}

export interface MediaItem {
  id: string;
  url: string;
}

export interface SiteState {
  content: SiteContent;
  settings: Settings;
  services: Service[];
  portfolio: PortfolioItem[];
  categories: PortfolioCategory[];
  testimonials: Testimonial[];
  partners: Partner[];
  pages: CustomPage[];
  media: MediaItem[];
}

export type CollKey =
  | "services"
  | "portfolio"
  | "categories"
  | "testimonials"
  | "partners"
  | "pages"
  | "media";

export const SECTION_LABELS: Record<SectionKey, string> = {
  partners: "شريط شركاء النجاح",
  services: "قسم الخدمات",
  portfolio: "قسم الأعمال",
  about: "قسم لماذا زورا",
  testimonials: "قسم آراء العملاء",
  cta: "قسم الدعوة الختامية",
  stats: "الأرقام والإحصاءات",
};