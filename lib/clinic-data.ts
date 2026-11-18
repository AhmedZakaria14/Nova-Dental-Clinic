export type BranchId = 'fifth-settlement' | 'nasr-city';

export type ServiceCategory = 'all' | 'cosmetic' | 'implants' | 'ortho' | 'endo';

export interface ClinicBranch {
  id: BranchId;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  openHour: number;
  closeHour: number;
}

export interface DentalService {
  id: string;
  slug: string;
  number: string;
  category: Exclude<ServiceCategory, 'all'>;
  categoryLabelAr: string;
  categoryLabelEn: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  detailsAr: string;
  detailsEn: string;
  technologyAr: string;
  technologyEn: string;
  highlightsAr: string[];
  highlightsEn: string[];
  durationMinutes: number;
  iconKey: 'sparkles' | 'shield' | 'smile' | 'zap' | 'microscope' | 'stethoscope';
}

export interface DoctorProfile {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  specialtyAr: string;
  specialtyEn: string;
  credentialsAr: string;
  credentialsEn: string;
  bioAr: string;
  bioEn: string;
  imageSrc: string;
  initials: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  excerptAr: string;
  excerptEn: string;
  paragraphsAr: string[];
  paragraphsEn: string[];
  imageKey: 'hero' | 'suite' | 'smile';
  readMinutes: number;
}

export interface PatientTestimonial {
  id: string;
  patientNameAr: string;
  patientNameEn: string;
  treatmentAr: string;
  treatmentEn: string;
  quoteAr: string;
  quoteEn: string;
}

export interface FaqItem {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

export interface TechStandard {
  id: string;
  number: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

export interface GalleryItem {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageKey: 'smile' | 'clinicDoctor';
}

export const CLINIC_BRANCHES: ClinicBranch[] = [
  {
    id: 'fifth-settlement',
    nameAr: 'نوفا لطب الأسنان — التجمع الخامس',
    nameEn: 'NOVA Dental Clinic — Fifth Settlement',
    addressAr: 'مركز أوزون الطبي، التجمع الخامس، القاهرة الجديدة، مصر.',
    addressEn: 'Ozone Medical Center, Fifth Settlement, New Cairo, Egypt.',
    phone: '01031235562',
    openHour: 12,
    closeHour: 21,
  },
  {
    id: 'nasr-city',
    nameAr: 'نوفا لطب الأسنان — مدينة نصر',
    nameEn: 'NOVA Dental Clinic — Nasr City',
    addressAr: 'فرع مدينة نصر، القاهرة، مصر.',
    addressEn: 'Nasr City Branch, Cairo, Egypt.',
    phone: '01555277054',
    openHour: 12,
    closeHour: 21,
  },
];

export const SERVICE_CATEGORIES: {
  id: ServiceCategory;
  labelAr: string;
  labelEn: string;
}[] = [
  { id: 'all', labelAr: 'جميع التخصصات', labelEn: 'All Specialties' },
  { id: 'cosmetic', labelAr: 'تجميل الأسنان', labelEn: 'Cosmetic Dentistry' },
  { id: 'implants', labelAr: 'زراعة الأسنان', labelEn: 'Dental Implants' },
  { id: 'ortho', labelAr: 'التقويم الشفاف', labelEn: 'Clear Aligners' },
  { id: 'endo', labelAr: 'علاج الجذور والوقاية', labelEn: 'Endodontics & Care' },
];

export const DENTAL_SERVICES: DentalService[] = [
  {
    id: 'veneers-dsd',
    slug: 'cosmetic-veneers-dsd',
    number: '01.',
    category: 'cosmetic',
    categoryLabelAr: 'تجميل الأسنان',
    categoryLabelEn: 'Cosmetic Dentistry',
    titleAr: 'تصميم الابتسامة والفينيرز',
    titleEn: 'Smile Design & Veneers',
    summaryAr:
      'عدسات خزفية فائقة الرقة تُصمَّم رقمياً لتلائم ملامح الوجه ولون البشرة بمظهر طبيعي متناسق.',
    summaryEn:
      'Ultra-thin ceramic veneers digitally crafted to harmonize with your facial proportions and natural enamel tone.',
    detailsAr:
      'يعتمد تصميم الابتسامة في NOVA Dental Clinic على المسح الرقمي الدقيق لمعاينة التعديلات المقترحة قبل التنفيذ، مما يحافظ على بنية الأسنان الطبيعية ويمنح ثباتاً لونياً طويل الأمد.',
    detailsEn:
      'Digital Smile Design at NOVA Dental Clinic utilizes precise intraoral scanning so you can preview your smile contours before treatment begins while preserving healthy enamel structure.',
    technologyAr: 'تصميم رقمي DSD ومسح ثلاثي الأبعاد',
    technologyEn: 'Digital Smile Design & 3D Scanning',
    highlightsAr: [
      'معاينة رقمية لشكل الابتسامة قبل البدء',
      'الحفاظ على طبقة المينا الطبيعية بأقل تحضير ممكن',
      'تدرج لوني طبيعي ينسجم مع ملامح الوجه',
    ],
    highlightsEn: [
      'Digital smile preview prior to final fabrication',
      'Conservative enamel preservation',
      'Natural translucency and balanced tooth proportions',
    ],
    durationMinutes: 60,
    iconKey: 'sparkles',
  },
  {
    id: 'immediate-implants',
    slug: 'dental-implants',
    number: '02.',
    category: 'implants',
    categoryLabelAr: 'زراعة الأسنان',
    categoryLabelEn: 'Dental Implants',
    titleAr: 'زراعة الأسنان الموجهة رقمياً',
    titleEn: 'Guided Dental Implants',
    summaryAr:
      'تعويض الأسنان المفقودة بدقة حاسوبية عبر الأشعة ثلاثية الأبعاد لاستعادة المضغ والمظهر الطبيعي.',
    summaryEn:
      'Computer-guided implant placement using 3D CBCT diagnostics to restore chewing function and natural aesthetics.',
    detailsAr:
      'نستخدم التصوير المقطعي ثلاثي الأبعاد لتخطيط موضع الغرسة بدقة متناهية بعيداً عن الأعصاب، مما يقلل التورم ويسرع فترة التعافي بعد الإجراء.',
    detailsEn:
      'Three-dimensional CBCT imaging guides exact implant positioning and angulation, minimizing surgical trauma and supporting predictable long-term integration.',
    technologyAr: 'أشعة 3D CBCT وقوالب جراحية رقمية',
    technologyEn: '3D CBCT & Digital Surgical Guides',
    highlightsAr: [
      'تخطيط ثلاثي الأبعاد لعظام الفك قبل الإجراء',
      'راحة أكبر وفترة تعافٍ أسرع بفضل الدقة الرقمية',
      'تركيبات خزفية تحاكي الأسنان الطبيعية في القوة والشكل',
    ],
    highlightsEn: [
      'Pre-operative 3D bone and nerve mapping',
      'Minimally invasive guided placement',
      'Custom ceramic crowns matched to adjacent teeth',
    ],
    durationMinutes: 60,
    iconKey: 'shield',
  },
  {
    id: 'clear-aligners',
    slug: 'clear-aligners-orthodontics',
    number: '03.',
    category: 'ortho',
    categoryLabelAr: 'التقويم الشفاف',
    categoryLabelEn: 'Clear Aligners',
    titleAr: 'التقويم الشفاف الرقمي',
    titleEn: 'Digital Clear Aligners',
    summaryAr:
      'قوالب شفافة قابلة للإزالة لتصحيح اصطفاف الأسنان وإطباق الفكين براحة تامة ودون أسلاك.',
    summaryEn:
      'Removable transparent aligners engineered to straighten teeth comfortably without metal brackets.',
    detailsAr:
      'من خلال المسح الرقمي السريع بدون مقاسات عجينية مزعجة، نصمم سلسلة قوالب شفافة مخصصة تتحرك معها الأسنان تدريجياً وفق خطة زمنية واضحة.',
    detailsEn:
      'Using fast digital scanning instead of traditional putty impressions, we design custom transparent aligner trays with a clear progression timeline.',
    technologyAr: 'ماسح رقمي ثلاثي الأبعاد بدون مقاسات عجينية',
    technologyEn: 'Impression-Free 3D Intraoral Scanning',
    highlightsAr: [
      'قوالب شفافة غير ملحوظة أثناء الحديث والعمل',
      'سهولة الإزالة عند تناول الطعام وتنظيف الأسنان',
      'محاكاة رقمية لمراحل حركة الأسنان',
    ],
    highlightsEn: [
      'Discreet transparent trays for daily confidence',
      'Removable for comfortable meals and brushing',
      'Digital movement simulation from the first visit',
    ],
    durationMinutes: 45,
    iconKey: 'smile',
  },
  {
    id: 'laser-whitening',
    slug: 'teeth-whitening',
    number: '04.',
    category: 'cosmetic',
    categoryLabelAr: 'تجميل الأسنان',
    categoryLabelEn: 'Cosmetic Dentistry',
    titleAr: 'تبييض الأسنان الطبي',
    titleEn: 'Clinical Teeth Whitening',
    summaryAr:
      'جلسة تفتيح آمنة للأسنان مع حماية كاملة للثة وتقليل الحساسية لمنح إشراقة واضحة.',
    summaryEn:
      'Safe clinical whitening protocol with gingival protection and sensitivity-minimizing care.',
    detailsAr:
      'يسبق جلسة التبييض فحص دقيق للأسنان وتنظيف سطحي لإزالة التصبغات الخارجية، ثم تُطبق مادة التبييض تحت إشراف طبي كامل لضمان نتيجة متجانسة.',
    detailsEn:
      'Each whitening session begins with surface polishing and gum barrier protection, followed by clinically supervised whitening for an even, bright tone.',
    technologyAr: 'تقنية التبييض البارد الآمن وحماية اللثة',
    technologyEn: 'Cold-Light Safe Whitening Protocol',
    highlightsAr: [
      'حماية مخصصة لأنسجة اللثة قبل الجلسة',
      'إزالة التصبغات السطحية الناتجة عن القهوة والشاي',
      'إرشادات عناية منزلية للحفاظ على النتيجة',
    ],
    highlightsEn: [
      'Dedicated gum barrier protection throughout',
      'Lifts deep coffee and lifestyle staining',
      'Aftercare guidance for lasting brightness',
    ],
    durationMinutes: 45,
    iconKey: 'zap',
  },
  {
    id: 'micro-endo',
    slug: 'microscopic-endodontics',
    number: '05.',
    category: 'endo',
    categoryLabelAr: 'علاج الجذور والوقاية',
    categoryLabelEn: 'Endodontics & Care',
    titleAr: 'علاج الجذور والحشوات التجميلية',
    titleEn: 'Root Canal & Aesthetic Fillings',
    summaryAr:
      'علاج عصب دقيق وتخفيف فوري للألم باستخدام التكبير البصري والحشوات المطابقة للون السن.',
    summaryEn:
      'Precise root canal care and tooth-colored composite restorations focused on comfort and tooth preservation.',
    detailsAr:
      'نركز في علاج الجذور على القضاء التام على الالتهاب وحفظ الضرس الطبيعي بتخدير مريح وغلق ثلاثي الأبعاد للقنوات الجذرية.',
    detailsEn:
      'Our endodontic care relieves pain promptly while preserving your natural tooth using comfortable local anesthesia and three-dimensional canal sealing.',
    technologyAr: 'تخدير مريح وعزل مطاطي قياسي',
    technologyEn: 'Comfort Anesthesia & Rubber Dam Isolation',
    highlightsAr: [
      'عزل كامل للسن لضمان بيئة معقمة أثناء العلاج',
      'حشوات تجميلية متينة مطابقة للون السن الطبيعي',
      'خطة ترميم متكاملة لحماية الضرس على المدى الطويل',
    ],
    highlightsEn: [
      'Full rubber-dam isolation for sterile precision',
      'Seamless shade-matched composite restorations',
      'Long-term crown or onlay protection planning',
    ],
    durationMinutes: 60,
    iconKey: 'microscope',
  },
  {
    id: 'checkup-airflow',
    slug: 'preventive-checkup-cleaning',
    number: '06.',
    category: 'endo',
    categoryLabelAr: 'علاج الجذور والوقاية',
    categoryLabelEn: 'Endodontics & Care',
    titleAr: 'الفحص الشامل وتنظيف الجير',
    titleEn: 'General Care & Dental Hygiene',
    summaryAr:
      'كشف دوري متكامل وإزالة الجير والتصبغات بلطف للحفاظ على صحة اللثة ومينا الأسنان.',
    summaryEn:
      'Routine comprehensive oral examination and gentle ultrasonic scaling to protect gums and enamel.',
    detailsAr:
      'يساعد الفحص المنتظم كل ستة أشهر في الاكتشاف المبكر لأي تسوس بسيط أو التهاب لثوي قبل تفاقمه، مع تنظيف لطيف وتلميع لأسطح الأسنان.',
    detailsEn:
      'Regular checkups every six months detect early enamel changes or gum inflammation early, paired with gentle scaling and polishing.',
    technologyAr: 'فحص رقمي وتنظيف بالموجات فوق الصوتية',
    technologyEn: 'Digital Exam & Ultrasonic Scaling',
    highlightsAr: [
      'فحص شامل للأسنان واللثة والأنسجة الفموية',
      'إزالة الرواسب الجيرية دون الإضرار بطبقة المينا',
      'خطة وقاية مخصصة لكل فرد من أفراد الأسرة',
    ],
    highlightsEn: [
      'Thorough teeth, gum, and bite screening',
      'Enamel-safe ultrasonic tartar removal',
      'Tailored preventive routine for every patient',
    ],
    durationMinutes: 45,
    iconKey: 'stethoscope',
  },
];

export const DOCTORS: DoctorProfile[] = [
  {
    id: 'nova-specialist',
    slug: 'dental-specialist',
    nameAr: 'طبيب الأسنان المختص',
    nameEn: 'NOVA Dental Specialist',
    titleAr: 'طب وجراحة وتجميل الأسنان — عيادة نوفا لطب الأسنان',
    titleEn: 'Restorative, Cosmetic & Implant Dentistry — NOVA Dental Clinic',
    specialtyAr: 'طب وتجميل وزراعة الأسنان',
    specialtyEn: 'Cosmetic, Implant & Restorative Dentistry',
    credentialsAr: 'رعاية تخصصية شاملة في فروع التجمع الخامس ومدينة نصر — NOVA Dental Clinic',
    credentialsEn: 'Comprehensive Dental Care across Fifth Settlement & Nasr City — NOVA Dental Clinic',
    bioAr:
      'رعاية سنية دقيقة تجمع بين التشخيص الرقمي ثلاثي الأبعاد، تصميم الابتسامة الطبيعي، وزراعة الأسنان وعلاج الجذور في بيئة علاجية هادئة ومريحة.',
    bioEn:
      'Precision clinical care combining 3D digital diagnostics, natural smile design, dental implants, and gentle endodontic treatment in a calm clinic setting.',
    imageSrc: '/assets/aistudio/FB_IMG_1795021187745_7991af86.jpg',
    initials: 'NOVA',
  },
];

export const PATIENT_TESTIMONIALS: PatientTestimonial[] = [
  {
    id: 't-1',
    patientNameAr: 'طارق عبد الرحمن',
    patientNameEn: 'Tarek Abdelrahman',
    treatmentAr: 'زراعة أسنان موجهة',
    treatmentEn: 'Guided Dental Implant',
    quoteAr:
      'الالتزام بالموعد والشرح التفصيلي على الأشعة قبل البدء أزال كل القلق. التجربة داخل مركز أوزون الطبي كانت هادئة ومريحة للغاية.',
    quoteEn:
      'Being seen right on time and walking through the 3D scan before treatment removed all anxiety. The visit at Ozone Medical Center was remarkably calm.',
  },
  {
    id: 't-2',
    patientNameAr: 'ندى شريف',
    patientNameEn: 'Nada Sherif',
    treatmentAr: 'تصميم الابتسامة والفينيرز',
    treatmentEn: 'Smile Design & Veneers',
    quoteAr:
      'أكثر ما أعجبني هو الاستماع لكل تفصيلة طلبتها ومعاينة الشكل التجريبي قبل التنفيذ، مع عناية فائقة بالنظافة والتعقيم.',
    quoteEn:
      'I truly appreciated how carefully the doctor listened and let me preview the smile design first, with spotless hygiene throughout the clinic.',
  },
  {
    id: 't-3',
    patientNameAr: 'حازم المغربي',
    patientNameEn: 'Hazem El-Maghraby',
    treatmentAr: 'علاج الجذور والوقاية',
    treatmentEn: 'Endodontic Care',
    quoteAr:
      'حجزت أونلاين وتواصل معي الاستقبال للتأكيد سريعاً. تم علاج الضرس بهدوء وبدون ألم مع شرح واضح لخطوات المتابعة.',
    quoteEn:
      'Booking online was effortless and reception confirmed promptly. Treatment was gentle and pain-free with clear aftercare instructions.',
  },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'art-1',
    slug: 'caring-for-porcelain-veneers',
    titleAr: 'كيف تحافظ على عدسات الفينيرز وإشراقة ابتسامتك يومياً؟',
    titleEn: 'How to Care for Your Porcelain Veneers Every Day',
    categoryAr: 'تجميل الأسنان',
    categoryEn: 'Cosmetic Care',
    excerptAr:
      'خطوات بسيطة للعناية اليومية، اختيار معجون الأسنان المناسب، وأهمية الفحص الدوري للحفاظ على لمعان الفينيرز.',
    excerptEn:
      'Simple daily hygiene habits, non-abrasive toothpaste selection, and checkup intervals to keep porcelain veneers radiant.',
    paragraphsAr: [
      'تُصمَّم عدسات الفينيرز الخزفية لتمنح ابتسامة متجانسة ومقاومة للتصبغات، إلا أن العناية اليومية المنتظمة تظل الأساس للحفاظ على صحة اللثة المحيطة بها.',
      'ينصح أطباء NOVA Dental Clinic باستخدام فرشاة ناعمة ومعجون قليل الكشط مرتين يومياً، إلى جانب استخدام خيط الأسنان الطبي بلطف لتنظيف المسافات البينية.',
      'كما يفضَّل تجنب قضم الأجسام الصلبة مباشرة على القواطع الأمامية، والالتزام بزيارة الفحص والتلميع الدورية كل ستة أشهر في فرعي التجمع الخامس ومدينة نصر.',
    ],
    paragraphsEn: [
      'Porcelain veneers are crafted for stain resistance and natural translucency, while consistent daily oral hygiene keeps the surrounding gum tissue healthy.',
      'Our clinicians at NOVA Dental Clinic recommend brushing twice daily with a soft-bristled brush and low-abrasion toothpaste, paired with gentle daily flossing.',
      'Avoid biting hard objects with front teeth and schedule routine six-month hygiene polishing visits at our Fifth Settlement or Nasr City clinic.',
    ],
    imageKey: 'smile',
    readMinutes: 3,
  },
  {
    id: 'art-2',
    slug: 'digital-3d-guided-implants-guide',
    titleAr: 'ما الذي يميز زراعة الأسنان الموجهة بالأشعة ثلاثية الأبعاد؟',
    titleEn: 'What Makes 3D Digitally Guided Dental Implants Different?',
    categoryAr: 'زراعة الأسنان',
    categoryEn: 'Implantology',
    excerptAr:
      'كيف يسهم التصوير المقطعي 3D CBCT في التخطيط الآمن لموضع الغرسة وتقليل الانزعاج بعد الجلسة.',
    excerptEn:
      'How 3D CBCT imaging enables safer implant positioning, predictable restoration, and gentler recovery.',
    paragraphsAr: [
      'تبدأ زراعة الأسنان الناجحة من التخطيط الدقيق قبل الجلسة وليس فقط أثناء التنفيذ؛ حيث يتيح التصوير ثلاثي الأبعاد قياس كثافة العظم ومواقع الأعصاب بدقة مليمتريه.',
      'استناداً إلى هذه البيانات الرقمية، يختار الاستشاري زاوية وعمق الغرسة المناسبة لكل حالة بما يضمن ثبات التاج النهائي وتناغمه مع بقية الأسنان.',
      'هذه المنهجية الرقمية تقلل من التدخل الجراحي التقليدي وتمنح المراجع وضوحاً كاملاً حول خطوات العلاج منذ الزيارة الأولى.',
    ],
    paragraphsEn: [
      'Predictable dental implant outcomes begin with thorough digital planning—3D CBCT scanning maps bone volume and anatomical landmarks to the millimeter.',
      'Using those exact measurements, the consultant determines optimal implant angulation and depth so the final crown aligns harmoniously with neighboring teeth.',
      'Digital guidance minimizes surgical invasiveness and gives patients transparent clarity about every step from their very first consultation.',
    ],
    imageKey: 'suite',
    readMinutes: 4,
  },
  {
    id: 'art-3',
    slug: 'clear-aligners-daily-routine',
    titleAr: 'نصائح أساسية أثناء استخدام التقويم الشفاف لنتيجة أسرع',
    titleEn: 'Essential Daily Habits During Clear Aligner Treatment',
    categoryAr: 'التقويم الشفاف',
    categoryEn: 'Orthodontics',
    excerptAr:
      'مدة الارتداء اليومية الموصى بها، طريقة تنظيف القوالب الشفافة، ومتابعة مراحل تحرك الأسنان.',
    excerptEn:
      'Recommended daily wear duration, keeping transparent trays crystal clear, and tracking tooth alignment milestones.',
    paragraphsAr: [
      'يعتمد نجاح التقويم الشفاف على الانتظام في ارتداء القوالب للمدة المحددة يومياً وفق خطة الطبيب، مع إزالتها فقط وقت الطعام والمشروبات الساخنة.',
      'يُنصح بشطف القالب بماء فاتر وتنظيف الأسنان قبل إعادة تركيبه لضمان بقاء القوالب شفافة ومنع تراكم البلاك.',
      'تتيح الزيارات الدورية في عيادة نوفا متابعة تطابق حركة الأسنان مع الخطة الرقمية وتسلّم المجموعة التالية من القوالب بيسر.',
    ],
    paragraphsEn: [
      'Clear aligner progress depends on consistent daily wear as advised by your orthodontist, removing trays only for meals and warm beverages.',
      'Rinse aligners with lukewarm water and brush your teeth before reinserting trays to keep them clear and protect enamel.',
      'Scheduled follow-up visits at NOVA Dental Clinic verify that tooth movement stays on track with your digital simulation.',
    ],
    imageKey: 'hero',
    readMinutes: 3,
  },
];

export const TECH_STANDARDS: TechStandard[] = [
  {
    id: 'itero',
    number: '01.',
    titleAr: 'ماسح رقمي ثلاثي الأبعاد',
    titleEn: '3D Intraoral Digital Scanner',
    detailAr:
      'التقاط نموذج رقمي دقيق للأسنان واللثة خلال دقائق دون الحاجة إلى قوالب القياس العجينية التقليدية.',
    detailEn:
      'Captures precise 3D digital tooth and gum models within minutes without uncomfortable putty impressions.',
  },
  {
    id: 'cbct',
    number: '02.',
    titleAr: 'التصوير المقطعي ثلاثي الأبعاد',
    titleEn: '3D CBCT Diagnostic Imaging',
    detailAr:
      'فحص تفصيلي لعظام الفك والجذور والأعصاب بأقل جرعة إشعاعية لدعم دقة الزراعة وعلاج الجذور.',
    detailEn:
      'Detailed bone, root, and nerve visualization at low radiation dose for implant and endodontic precision.',
  },
  {
    id: 'autoclave',
    number: '03.',
    titleAr: 'نظام تعقيم أوروبي Class-B',
    titleEn: 'European Class-B Sterilization',
    detailAr:
      'دورات تعقيم متكاملة مع تغليف محكم لكل أداة في عبوة معقمة أحادية الاستخدام تُفتح أمام المريض.',
    detailEn:
      'Validated vacuum autoclave cycles sealing every instrument in individual sterile pouches opened chairside.',
  },
  {
    id: 'dsd',
    number: '04.',
    titleAr: 'تصميم الابتسامة الرقمي DSD',
    titleEn: 'Digital Smile Design (DSD)',
    detailAr:
      'تخطيط وتجربة أبعاد الابتسامة رقمياً بما يتناسب مع تناسق الوجه قبل البدء في التنفيذ النهائي.',
    detailEn:
      'Digital proportion planning and previewing aligned with facial symmetry before final restorations.',
  },
];

export const CLINIC_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    questionAr: 'أين تقع فروع عيادة نوفا لطب الأسنان (NOVA Dental Clinic)؟',
    questionEn: 'Where are NOVA Dental Clinic branches located?',
    answerAr:
      'تتوفر عيادة نوفا في فرعين: فرع التجمع الخامس في مركز أوزون الطبي، القاهرة الجديدة، وفرع مدينة نصر بالقاهرة. يمكنك فتح اتجاهات الخريطة أو اختيار الفرع المناسب عند حجز موعدك.',
    answerEn:
      'NOVA Dental Clinic serves you across two Cairo locations: our Fifth Settlement branch at Ozone Medical Center (New Cairo) and our Nasr City branch. You can select your preferred branch when booking online.',
  },
  {
    id: 'faq-2',
    questionAr: 'كيف يمكنني حجز موعد أو تعديله؟',
    questionEn: 'How can I book or manage an appointment?',
    answerAr:
      'يمكنك حجز موعدك مباشرة من خلال صفحة حجز المواعيد على الموقع، أو الاتصال مباشرة على الرقم الرئيسي 01031235562 كما يمكنك مراجعة مواعيدك المسجلة من نافذة «حجوزاتي المسجلة».',
    answerEn:
      'You can book directly through our online Appointment page or call our primary phone line at 01031235562. Booked appointments can also be reviewed from the My Bookings drawer.',
  },
  {
    id: 'faq-3',
    questionAr: 'هل تتوفر أرقام اتصال إضافية للاستفسارات؟',
    questionEn: 'Are additional phone numbers available for inquiries?',
    answerAr:
      'نعم، بالإضافة إلى الرقم الرئيسي 01031235562 (+20 10 31235562)، يمكنك التواصل عبر الأرقام 01555277054 و 01555077056 أو البريد الإلكتروني absclinic54@gmail.com.',
    answerEn:
      'Yes. Alongside our primary number 01031235562 (+20 10 31235562), you can reach us at 01555277054 and 01555077056 or email absclinic54@gmail.com.',
  },
  {
    id: 'faq-4',
    questionAr: 'ما معايير التعقيم ومكافحة العدوى المطبقة في العيادة؟',
    questionEn: 'What sterilization standards does the clinic follow?',
    answerAr:
      'تُطبق العيادة بروتوكولات تعقيم صارمة باستخدام أجهزة Class-B وتغليف الأدوات في عبوات معقمة أحادية الاستخدام تُفتح أمام كل مراجع.',
    answerEn:
      'We follow strict European Class-B autoclave sterilization cycles and individually sealed sterile instrument pouches opened in front of every patient.',
  },
  {
    id: 'faq-5',
    questionAr: 'هل يمكنني معاينة خطة العلاج قبل البدء بأي إجراء تجميلي؟',
    questionEn: 'Can I preview my treatment plan before cosmetic procedures?',
    answerAr:
      'نعم، يبدأ كل إجراء تجميلي أو علاجي بفحص شامل وشرح واضح للخطة والخطوات المقترحة، مع معاينة رقمية في حالات تصميم الابتسامة والتقويم الشفاف.',
    answerEn:
      'Yes. Every cosmetic and restorative procedure begins with a full diagnostic review and clear explanation, including digital previews for Smile Design and Clear Aligners.',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    titleAr: 'ابتسامة طبيعية متناغمة',
    titleEn: 'Natural Smile Aesthetics',
    categoryAr: 'تجميل الأسنان',
    categoryEn: 'Aesthetics',
    descriptionAr: 'نتائج تحاكي شفافية وتدرج مينا الأسنان الطبيعي.',
    descriptionEn: 'Restorative aesthetics designed to mirror natural enamel translucency.',
    imageKey: 'smile',
  },
  {
    id: 'gal-2',
    titleAr: 'داخل غرفة العلاج في عيادة نوفا',
    titleEn: 'Inside NOVA Dental Clinic Suite',
    categoryAr: 'الرعاية السريرية',
    categoryEn: 'Clinical Care',
    descriptionAr: 'متابعة سريرية دقيقة بأحدث وحدات وأدوات طب الأسنان.',
    descriptionEn: 'Dedicated chairside clinical evaluation with modern dental instruments.',
    imageKey: 'clinicDoctor',
  },
];
