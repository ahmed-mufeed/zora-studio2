import type { SiteState } from "./types";

import heroBg from "../assets/hero-bg.jpg";
import pBrand from "../assets/p-brand.jpg";
import pSocial from "../assets/p-social.jpg";
import pVideo from "../assets/p-video.jpg";
import pWeb from "../assets/p-web.jpg";
import pLogo from "../assets/p-logo.jpg";
import pCampaign from "../assets/p-campaign.jpg";
import pMotion from "../assets/p-motion.jpg";
import pApp from "../assets/p-app.jpg";
import pPackaging from "../assets/p-packaging.jpg";

export const IMG = {
  heroBg,
  pBrand,
  pSocial,
  pVideo,
  pWeb,
  pLogo,
  pCampaign,
  pMotion,
  pApp,
  pPackaging,
};

export const initialState: SiteState = {
  content: {
    heroBadge: "استوديو تسويق رقمي وتصميم",
    heroTitleA: "إبداعٌ يضرب",
    heroTitleB: "كالصاعقة",
    heroSubtitle: "زورا استوديو — نحوّل أفكارك إلى هويات وحملات ومحتوى يصنع حضورًا يستوقف الزحام، ويترك أثرًا لا يُنسى.",
    ctaPrimary: "ابدأ مشروعك",
    ctaSecondary: "استكشف أعمالنا",
    stats: [
      { value: "+120", label: "مشروع منجز" },
      { value: "+45", label: "شريك نجاح" },
      { value: "98%", label: "رضا العملاء" },
      { value: "+6", label: "سنوات خبرة" },
    ],
    aboutTitle: "لماذا زورا؟",
    aboutText: "لسنا مجرد منفّذين — نحن شركاء نجاحك. نفكر معك، نختبر، ونُسلّم عملًا نفخر به قبل أن تفخر أنت.",
    features: [
      { icon: "zap", title: "سرعة البرق في التنفيذ", text: "نلتزم بمواعيد دقيقة ونسلّم قبل الموعد — وقتك رأس مالنا." },
      { icon: "gem", title: "جودة بمعايير عالمية", text: "كل تفصيلة تمرّ بمراجعة صارمة قبل أن تصل إليك." },
      { icon: "percent", title: "أسعار تنافسية", text: "باقات مرنة تناسب الشركات الناشئة والعلامات الكبرى." },
      { icon: "chat", title: "تواصل مباشر وشفاف", text: "تتحدث مع صانع القرار مباشرة — بلا وسطاء وبلا انتظار." },
    ],
    ctaTitle: "جاهز نصنع صاعقتك القادمة؟",
    ctaSubtitle: "احجز استشارتك المجانية اليوم، ودعنا نرسم معًا خارطة طريق علامتك نحو الانتشار.",
    footerAbout: "زورا استوديو — استوديو تسويق رقمي وتصميم؛ نؤمن أنّ الفكرة الجريئة تصنع الفرق، وأنّ كل علامة تستحق أن تُرى.",
  },

  settings: {
    whatsapp: "966580720241",
    phone: "+966 58 072 0241",
    phone2: "+966 58 072 0241",
    email: "",
    instagram: "https://instagram.com/zora.adv",
    tiktok: "https://tiktok.com/@zora.adv",
    x: "#",
    linkedin: "#",
    sections: {
      partners: true,
      services: true,
      portfolio: true,
      about: true,
      testimonials: true,
      cta: true,
      stats: true,
    },
  },

  services: [
    {
      id: "social",
      title: "إدارة السوشيال ميديا",
      short: "استراتيجية، تصميم، نشر، وتفاعل — ندير حضورك اليومي باحتراف يُبقي جمهورك متّقدًا.",
      full: [
        "نبني لك استراتيجية محتوى شهرية مبنية على تحليل جمهورك ومنافسيك، ثم نتولّى التصميم والكتابة والنشر والردّ على التفاعلات.",
        "تشمل الباقة تقويم محتوى واضحًا، تصاميم متسقة مع هويتك، وريلز قصيرة مواكبة للترندات، مع تقرير أداء شهري بالأرقام.",
      ],
      price: 1200,
      priceUnit: "شهريًا",
      image: pSocial,
      status: "available",
      hidden: false,
      features: ["تقويم محتوى شهري", "12–20 منشورًا وتصميمًا", "ريلز مواكبة للترند", "تقرير أداء شهري", "إدارة التفاعل والردود"],
      questions: [
        { id: "q1", type: "checkbox", label: "ما المنصّات التي تريد التركيز عليها؟", required: true, options: ["انستقرام", "تيك توك", "إكس (تويتر)", "سناب شات", "لينكدإن"], allowCustom: true },
        { id: "q2", type: "choice", label: "كم منشورًا تحتاج شهريًا؟", required: true, options: ["12 منشورًا", "16 منشورًا", "20 منشورًا", "باقة مخصصة"], allowCustom: true },
        { id: "q3", type: "slider", label: "ميزانيتك الشهرية المتوقعة", required: true, min: 500, max: 10000, step: 100, unit: "ر.س" },
        { id: "q4", type: "choice", label: "هل لديك هوية بصرية جاهزة؟", required: true, options: ["نعم، جاهزة", "لا، أحتاج تصميمها", "لدي عناصر جزئية"], allowCustom: false },
        { id: "q5", type: "text", label: "صف نشاطك التجاري وجمهورك المستهدف", required: true, placeholder: "مثال: مقهى مختص يستهدف الشباب من 18–35 في الرياض…" },
        { id: "q6", type: "text", label: "روابط حساباتك الحالية", required: false, placeholder: "https://instagram.com/…" },
      ],
    },
    {
      id: "branding",
      title: "تصميم الهوية البصرية",
      short: "شعار وهوية متكاملة تعكس شخصية علامتك وتلتصق بالأذهان من أول نظرة.",
      full: [
        "نصمّم هوية بصرية متكاملة تبدأ من الفكرة والاستراتيجية: الشعار، الألوان، الخطوط، وأنظمة الاستخدام عبر كل الوسائط.",
        "تستلم ملف دليل هوية احترافي (Brand Guidelines) يضمن اتساق علامتك في كل نقطة تواصل مع جمهورك.",
      ],
      price: 2500,
      priceUnit: "للمشروع",
      image: pBrand,
      status: "available",
      hidden: false,
      features: ["3 مقترحات شعار أولية", "دليل هوية كامل", "مطبوعات وقرطاسية", "قوالب سوشيال ميديا", "ملفات مفتوحة المصدر"],
      questions: [
        { id: "q1", type: "text", label: "اسم العلامة التجارية ومجال عملها", required: true, placeholder: "مثال: نوفا — لمستحضرات تجميل طبيعية" },
        { id: "q2", type: "checkbox", label: "ما العناصر التي تحتاجها؟", required: true, options: ["شعار أساسي", "بطاقات أعمال", "ورق رسمي وأختام", "قوالب سوشيال", "دليل هوية كامل", "تغليف منتجات"], allowCustom: true },
        { id: "q3", type: "choice", label: "الأسلوب البصري المفضّل", required: true, options: ["عصري وجريء", "كلاسيكي فاخر", "بسيط وأنيق", "مرح وشبابي"], allowCustom: true },
        { id: "q4", type: "slider", label: "الميزانية المتوقعة", required: true, min: 1000, max: 15000, step: 250, unit: "ر.س" },
        { id: "q5", type: "text", label: "ألوان أو أعمال تعجبك كمرجع", required: false, placeholder: "ألوان، علامات، روابط…" },
      ],
    },
    {
      id: "video",
      title: "مونتاج وموشن جرافيك",
      short: "فيديوهات بإيقاع سينمائي وحركة بصرية تروي قصتك في ثوانٍ معدودة.",
      full: [
        "من الإعلانات القصيرة إلى الريلز والموشن جرافيك التعريفي — نحرّك صورك ولقطاتك بإيقاع يشدّ العين ويوصل الرسالة.",
        "نستخدم أحدث أدوات المونتاج والتحريك مع مكتبة موسيقى مرخّصة ومعالجة لونية سينمائية لكل مشروع.",
      ],
      price: 350,
      priceUnit: "للفيديو",
      image: pVideo,
      status: "available",
      hidden: false,
      features: ["مونتاج سينمائي احترافي", "موشن جرافيك ونصوص متحركة", "معالجة لونية", "موسيقى ومؤثرات مرخّصة", "نسخ بمقاسات كل المنصّات"],
      questions: [
        { id: "q1", type: "choice", label: "نوع الفيديو المطلوب", required: true, options: ["إعلان قصير", "ريلز / تيك توك", "موشن جرافيك", "فيديو تعريفي", "تغطية فعالية"], allowCustom: true },
        { id: "q2", type: "slider", label: "مدة الفيديو التقريبية", required: true, min: 15, max: 300, step: 15, unit: "ثانية" },
        { id: "q3", type: "choice", label: "هل تتوفر المواد الخام؟", required: true, options: ["نعم، لدي تصوير جاهز", "أحتاج خدمة تصوير", "مزيج من الاثنين"], allowCustom: false },
        { id: "q4", type: "checkbox", label: "إضافات مرغوبة", required: false, options: ["تعليق صوتي", "ترجمة نصية", "موسيقى مرخّصة", "شعار متحرك"], allowCustom: true },
        { id: "q5", type: "text", label: "اكتب فكرة الفيديو أو رسالته الأساسية", required: true, placeholder: "ما القصة التي تريد أن يحكيها الفيديو؟" },
      ],
    },
    {
      id: "web",
      title: "تصميم المواقع والمتاجر",
      short: "مواقع ومتاجر فائقة السرعة، أنيقة، ومصمّمة لتحويل الزوّار إلى عملاء.",
      full: [
        "نصمّم ونطوّر مواقع تعريفية ومتاجر إلكترونية وصفحات هبوط مبنية على تجربة مستخدم مدروسة ومعدّلات تحويل عالية.",
        "مواقع سريعة، متجاوبة مع كل الأجهزة، مهيأة لمحركات البحث، مع لوحة تحكم سهلة لإدارة محتواك بنفسك.",
      ],
      price: 3500,
      priceUnit: "للموقع",
      image: pWeb,
      status: "available",
      hidden: false,
      features: ["تصميم UX/UI مخصص", "متجاوب مع كل الأجهزة", "تهيئة SEO أساسية", "لوحة تحكم سهلة", "ربط الدفع والشحن للمتاجر"],
      questions: [
        { id: "q1", type: "choice", label: "نوع الموقع المطلوب", required: true, options: ["موقع تعريفي", "متجر إلكتروني", "صفحة هبوط", "منصة مخصصة"], allowCustom: true },
        { id: "q2", type: "checkbox", label: "الصفحات والمزايا المطلوبة", required: false, options: ["تعدد اللغات", "مدونة", "حجز مواعيد", "دفع إلكتروني", "ربط واتساب", "لوحة تحكم"], allowCustom: true },
        { id: "q3", type: "slider", label: "الميزانية المتوقعة", required: true, min: 1500, max: 30000, step: 500, unit: "ر.س" },
        { id: "q4", type: "choice", label: "هل لديك محتوى وصور جاهزة؟", required: true, options: ["نعم، كل شيء جاهز", "جزئيًا", "لا، أحتاج دعمًا كاملًا"], allowCustom: false },
        { id: "q5", type: "text", label: "وصف مختصر للمشروع", required: true, placeholder: "ما هدف الموقع؟ ومن جمهوره؟" },
        { id: "q6", type: "text", label: "موقع يعجبك كمرجع", required: false, placeholder: "روابط مواقع أعجبك أسلوبها" },
      ],
    },
    {
      id: "ads",
      title: "إدارة الإعلانات الممولة",
      short: "حملات مدروسة بالبيانات تحقّق أعلى عائد ممكن على كل ريال إعلاني.",
      full: [
        "نخطط ونطلق ونحسّن حملاتك على منصّات ميتا وجوجل وتيك توك وسناب شات باستهداف دقيق واختبارات A/B مستمرة.",
        "تحصل على لوحة متابعة شفافة وتقرير أسبوعي يوضح تكلفة الاستحواذ والعائد على الإنفاق الإعلاني بوضوح.",
      ],
      price: 900,
      priceUnit: "شهريًا",
      image: pCampaign,
      status: "unavailable",
      hidden: false,
      features: ["استراتيجية استهداف دقيقة", "اختبارات A/B مستمرة", "إعادة استهداف ذكية", "تقرير أداء أسبوعي", "تحسين مستمر للعائد ROAS"],
      questions: [
        { id: "q1", type: "checkbox", label: "المنصّات الإعلانية المستهدفة", required: true, options: ["جوجل", "ميتا (فيسبوك/انستقرام)", "تيك توك", "سناب شات", "إكس (تويتر)"], allowCustom: true },
        { id: "q2", type: "slider", label: "الميزانية الإعلانية الشهرية", required: true, min: 1000, max: 50000, step: 500, unit: "ر.س" },
        { id: "q3", type: "choice", label: "الهدف الرئيسي للحملة", required: true, options: ["مبيعات مباشرة", "وعي بالعلامة", "زيارات للموقع", "رسائل واستفسارات"], allowCustom: true },
        { id: "q4", type: "text", label: "المنتج أو الخدمة والجمهور المستهدف", required: true, placeholder: "ما الذي تبيعه؟ ولمن؟" },
      ],
    },
    {
      id: "content",
      title: "كتابة المحتوى الإبداعي",
      short: "كلمات تبيع وتُقنع، وتبني علاقة حقيقية بين علامتك وجمهورك.",
      full: [
        "من منشورات السوشيال إلى المقالات والنصوص الإعلانية وسيناريوهات الفيديو — نكتب بصوت علامتك وبأسلوب يلامس جمهورك.",
        "كل نص يمرّ بمراجعة لغوية دقيقة وتهيئة للكلمات المفتاحية عند الحاجة، مع مرونة كاملة في التعديل.",
      ],
      price: 150,
      priceUnit: "للقطعة",
      image: pLogo,
      status: "available",
      hidden: false,
      features: ["نبرة صوت مخصصة لعلامتك", "تهيئة SEO للمقالات", "سيناريوهات فيديو جاهزة", "مراجعة لغوية دقيقة", "تسليم سريع خلال 48 ساعة"],
      questions: [
        { id: "q1", type: "choice", label: "نوع المحتوى المطلوب", required: true, options: ["منشورات سوشيال", "مقالات مدونة", "نصوص إعلانية", "سيناريو فيديو", "محتوى موقع"], allowCustom: true },
        { id: "q2", type: "slider", label: "عدد القطع المطلوبة", required: true, min: 1, max: 50, step: 1, unit: "قطعة" },
        { id: "q3", type: "choice", label: "النبرة المفضّلة", required: true, options: ["رسمية ومهنية", "ودية وقريبة", "فكاهية", "حماسية وملهمة"], allowCustom: true },
        { id: "q4", type: "text", label: "عن نشاطك والكلمات المفتاحية المهمّة", required: true, placeholder: "مجالك، جمهورك، وكلمات لا يمكن تجاهلها…" },
      ],
    },
  ],

  categories: [
    { id: "brand", name: "هوية بصرية" },
    { id: "social", name: "سوشيال ميديا" },
    { id: "video", name: "موشن ومونتاج" },
    { id: "web", name: "موقع وتطبيقات" },
    { id: "ads", name: "حملات إعلانية" },
    { id: "pack", name: "تغليف ومنتجات" },
  ],

  portfolio: [
    { id: "w1", title: "هوية نوفا كوزمتكس", client: "نوفا كوزمتكس", categoryId: "brand", image: pBrand, tags: ["شعار", "دليل هوية"], year: "2025", aspectRatio: "portrait" },
    { id: "w2", title: "إدارة سوشيال ضيافة", client: "مطاعم ضيافة", categoryId: "social", image: pSocial, tags: ["محتوى", "تصاميم"], year: "2025", aspectRatio: "square" },
    { id: "w3", title: "فيلم إطلاق تك سبيد", client: "تك سبيد", categoryId: "video", image: pVideo, tags: ["مونتاج", "تصوير"], year: "2024", aspectRatio: "widescreen" },
    { id: "w4", title: "متجر فيتنس برو", client: "فيتنس برو", categoryId: "web", image: pWeb, tags: ["متجر إلكتروني", "UI/UX"], year: "2025", aspectRatio: "portrait" },
    { id: "w5", title: "شعار قهوة بُن", client: "قهوة بُن", categoryId: "brand", image: pLogo, tags: ["شعار"], year: "2024", aspectRatio: "square" },
    { id: "w6", title: "الحملة الليلية لأوزون", client: "متجر أوزون", categoryId: "ads", image: pCampaign, tags: ["إعلانات", "لوحات خارجية"], year: "2025", aspectRatio: "banner" },
    { id: "w7", title: "موشن تطبيق وصّلة", client: "تك سبيد", categoryId: "video", image: pMotion, tags: ["موشن جرافيك"], year: "2024", aspectRatio: "story" },
    { id: "w8", title: "تطبيق وصّلة للتوصيل", client: "تك سبيد", categoryId: "web", image: pApp, tags: ["تطبيق", "UI/UX"], year: "2025", aspectRatio: "square" },
    { id: "w9", title: "تغليف قهوة بُن المختصة", client: "قهوة بُن", categoryId: "pack", image: pPackaging, tags: ["تغليف", "مطبوعات"], year: "2025", aspectRatio: "landscape" },
  ],

  testimonials: [
    {
      id: "t1",
      name: "سارة العتيبي",
      role: "مديرة التسويق",
      company: "نوفا كوزمتكس",
      rating: 5,
      text: "تعاملنا مع زورا غيّر مفهومنا عن التسويق؛ هويتنا الجديدة رفعت مبيعاتنا 40% خلال ثلاثة أشهر فقط. فريق يفهم التفاصيل ويُصغي قبل أن يصمّم.",
      visible: true,
    },
    {
      id: "t2",
      name: "محمد الحربي",
      role: "المؤسس",
      company: "مطاعم ضيافة",
      rating: 5,
      text: "أسرع استوديو تعاملت معه. المحتوى الذي يصنعونه لحساباتنا جعل التفاعل يتضاعف، والعملاء صاروا يذكرون تصاميمنا بالاسم.",
      visible: true,
    },
    {
      id: "t3",
      name: "نورة القحطاني",
      role: "المؤسسة",
      company: "كافيه ليمون",
      rating: 4.5,
      text: "من الشعار إلى كوب القهوة، كل شيء جاء متسقًا وجميلًا. أحسست أنهم شركاء حقيقيون وليس مجرد منفّذين.",
      visible: true,
    },
    {
      id: "t4",
      name: "خالد الشمري",
      role: "مدير التسويق",
      company: "عقارات الديار",
      rating: 5,
      text: "حملاتهم الإعلانية خفّضت تكلفة العميل المحتمل إلى النصف. أرقام تتحدث عن نفسها، ومصداقية نادرة في هذا المجال.",
      visible: true,
    },
  ],

  partners: [
    { id: "p1", name: "نوفا" },
    { id: "p2", name: "ضيافة" },
    { id: "p3", name: "تك سبيد" },
    { id: "p4", name: "كافيه ليمون" },
    { id: "p5", name: "الديار العقارية" },
    { id: "p6", name: "فيتنس برو" },
    { id: "p7", name: "قهوة بُن" },
    { id: "p8", name: "أوزون" },
  ],

  pages: [],
  media: [],
};

export const BUILTIN_MEDIA: { id: string; url: string; label: string }[] = [
  { id: "m-hero", url: heroBg, label: "خلفية البطل" },
  { id: "m-brand", url: pBrand, label: "هوية بصرية" },
  { id: "m-social", url: pSocial, label: "سوشيال ميديا" },
  { id: "m-video", url: pVideo, label: "إنتاج فيديو" },
  { id: "m-web", url: pWeb, label: "تصميم موقع" },
  { id: "m-logo", url: pLogo, label: "تصميم شعار" },
  { id: "m-campaign", url: pCampaign, label: "حملة إعلانية" },
  { id: "m-motion", url: pMotion, label: "موشن جرافيك" },
  { id: "m-app", url: pApp, label: "تطبيق جوال" },
  { id: "m-pack", url: pPackaging, label: "تغليف منتجات" },
];