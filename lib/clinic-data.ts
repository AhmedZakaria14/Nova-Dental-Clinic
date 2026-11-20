export type BranchId = 'fifth-settlement' | 'nasr-city';

export type ServiceCategory =
  | 'all'
  | 'preventive'
  | 'cosmetic'
  | 'restorative'
  | 'ortho'
  | 'implants';

export type ServiceImageKey =
  | 'exam-diagnosis'
  | 'cleaning-polishing'
  | 'teeth-whitening'
  | 'dental-fillings'
  | 'cosmetic-fillings'
  | 'dental-veneers'
  | 'root-canal'
  | 'orthodontics'
  | 'dental-implants'
  | 'prosthetics-crowns'
  | 'cosmetic-dentistry'
  | 'dental-extractions';

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
  iconKey:
    | 'gem'
    | 'shield'
    | 'smile'
    | 'zap'
    | 'microscope'
    | 'stethoscope'
    | 'layers'
    | 'crown'
    | 'scissors';
  imageKey: ServiceImageKey;
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
  { id: 'all', labelAr: 'جميع الخدمات', labelEn: 'All Services' },
  { id: 'preventive', labelAr: 'الكشف والوقاية', labelEn: 'Exam & Hygiene' },
  { id: 'cosmetic', labelAr: 'التجميل والفينيرز', labelEn: 'Cosmetic & Veneers' },
  { id: 'restorative', labelAr: 'الحشوات وعلاج الجذور', labelEn: 'Fillings & Root Canal' },
  { id: 'ortho', labelAr: 'تقويم الأسنان', labelEn: 'Orthodontics' },
  { id: 'implants', labelAr: 'الزراعة والتركيبات والجراحة', labelEn: 'Implants, Prosthetics & Surgery' },
];

export const DENTAL_SERVICES: DentalService[] = [
  {
    id: 'comprehensive-exam',
    slug: 'exam-and-diagnosis',
    number: '01.',
    category: 'preventive',
    categoryLabelAr: 'الكشف والوقاية',
    categoryLabelEn: 'Exam & Hygiene',
    titleAr: 'كشف وتشخيص',
    titleEn: 'Examination & Diagnosis',
    summaryAr:
      'فحص سريري ورقمي شامل للأسنان واللثة وعظام الفك لوضع خطة علاج دقيقة وشفافة منذ الزيارة الأولى.',
    summaryEn:
      'Comprehensive clinical and digital diagnostic evaluation of teeth, gums, and bite to build a clear treatment plan.',
    detailsAr:
      'يبدأ كل علاج ناجح في NOVA Dental Clinic بتشخيص دقيق يجمع بين الفحص السريري والتصوير الرقمي والمسح ثلاثي الأبعاد لاكتشاف أي تسوس خفي أو التهاب لثوي مبكراً وشرح جميع الخيارات العلاجية بوضوح تام.',
    detailsEn:
      'Every successful treatment at NOVA Dental Clinic starts with thorough digital diagnostics combining intraoral imaging and clinical evaluation to detect subtle decay or gum issues early.',
    technologyAr: 'مسح رقمي ثلاثي الأبعاد وأشعة تشخيصية دقيقة',
    technologyEn: '3D Intraoral Scanning & Digital Radiographs',
    highlightsAr: [
      'فحص شامل للأسنان واللثة ومفصل الفك وإطباق الأسنان',
      'تصوير رقمي فوري لشرح الحالة على الشاشة بوضوح',
      'خطة علاجية وزمنية مكتوبة ومفصلة لكل مريض',
    ],
    highlightsEn: [
      'Complete tooth, gum, bite, and oral tissue screening',
      'Chairside digital imaging review for full clarity',
      'Transparent written treatment and timeline plan',
    ],
    durationMinutes: 30,
    iconKey: 'stethoscope',
    imageKey: 'exam-diagnosis',
  },
  {
    id: 'checkup-airflow',
    slug: 'cleaning-and-polishing',
    number: '02.',
    category: 'preventive',
    categoryLabelAr: 'الكشف والوقاية',
    categoryLabelEn: 'Exam & Hygiene',
    titleAr: 'تنظيف وتلميع الأسنان',
    titleEn: 'Teeth Cleaning & Polishing',
    summaryAr:
      'إزالة الرواسب الجيرية والبلاك وتصبغات السطح بلطف بالموجات فوق الصوتية لحماية اللثة وإعادة اللمعان الطبيعي.',
    summaryEn:
      'Gentle ultrasonic tartar removal and enamel polishing to protect gum health and restore natural surface luster.',
    detailsAr:
      'تزيل جلسة التنظيف والتلميع الرواسب الجيرية المتراكمة حول خط اللثة والتصبغات الناتجة عن القهوة والشاي دون الإضرار بطبقة المينا، مع نصائح عناية يومية مخصصة للحفاظ على انتعاش الفم وصحة اللثة.',
    detailsEn:
      'Our professional scaling and polishing session gently removes stubborn tartar buildup and everyday surface stains without harming enamel, leaving gums calmer and teeth smooth.',
    technologyAr: 'تقنية الموجات فوق الصوتية وتلميع المينا اللطيف',
    technologyEn: 'Ultrasonic Scaling & Gentle Enamel Polishing',
    highlightsAr: [
      'إزالة دقيقة للجير فوق وتحت خط اللثة بدون ألم',
      'تلميع سطحي يقلل تراكم البلاك والتصبغات مجدداً',
      'الوقاية من التهاب ونزيف اللثة ورائحة الفم غير المرغوبة',
    ],
    highlightsEn: [
      'Pain-free ultrasonic removal of plaque and calculus',
      'Smooth surface polishing that resists new staining',
      'Protects against gum inflammation and bleeding',
    ],
    durationMinutes: 40,
    iconKey: 'gem',
    imageKey: 'cleaning-polishing',
  },
  {
    id: 'laser-whitening',
    slug: 'teeth-whitening',
    number: '03.',
    category: 'cosmetic',
    categoryLabelAr: 'التجميل والفينيرز',
    categoryLabelEn: 'Cosmetic & Veneers',
    titleAr: 'تبييض الأسنان',
    titleEn: 'Teeth Whitening',
    summaryAr:
      'جلسة تفتيح طبي آمن بدرجات ملحوظة مع عازل حماية كامل للثة ومواد مخصصة لتقليل حساسية الأسنان.',
    summaryEn:
      'Safe clinical teeth whitening delivering noticeably brighter shades with full gum barrier protection and sensitivity care.',
    detailsAr:
      'يسبق جلسة التبييض فحص دقيق وتنظيف سطحي لإزالة التصبغات الخارجية، ثم تُطبق مادة التبييض الطبية مع الإضاءة الباردة تحت إشراف مباشر للطبيب لضمان إشراقة متجانسة وطبيعية في زيارة واحدة.',
    detailsEn:
      'Each whitening visit begins with enamel preparation and dedicated gingival barrier protection, followed by clinically supervised cold-light whitening for bright, uniform results in a single visit.',
    technologyAr: 'التبييض الطبي بالضوء البارد وحماية اللثة',
    technologyEn: 'Cold-Light Clinical Whitening & Gum Shield',
    highlightsAr: [
      'عزل وحماية كاملة لأنسجة اللثة قبل بدء التفتيح',
      'إزالة التصبغات العميقة الناتجة عن القهوة والشاي والتدخين',
      'جل مخصص لتقليل الحساسية وإرشادات للحفاظ على البياض',
    ],
    highlightsEn: [
      'Full gingival barrier protection throughout treatment',
      'Lifts deep coffee, tea, and lifestyle discoloration',
      'Desensitizing enamel care and aftercare guidance',
    ],
    durationMinutes: 45,
    iconKey: 'zap',
    imageKey: 'teeth-whitening',
  },
  {
    id: 'dental-fillings',
    slug: 'dental-fillings',
    number: '04.',
    category: 'restorative',
    categoryLabelAr: 'الحشوات وعلاج الجذور',
    categoryLabelEn: 'Fillings & Root Canal',
    titleAr: 'حشوات',
    titleEn: 'Dental Fillings',
    summaryAr:
      'إزالة التسوس بدقة وترميم الضروس والأسنان بحشوات طبية متينة تعيد قوة المضغ وتمنع امتداد التسوس للعصب.',
    summaryEn:
      'Precise decay removal and durable medical restorations that restore chewing strength and protect the tooth nerve.',
    detailsAr:
      'نستخدم مواد ترميم عالية الجودة وتقنيات عزل محكمة لإزالة التسوس بالكامل مع الحفاظ على أكبر قدر ممكن من بنية السن السليمة، وضبط الإطباق بدقة لضمان راحة تامة عند المضغ.',
    detailsEn:
      'We remove decay conservatively under clean isolation and place high-strength restorative fillings calibrated precisely to your natural bite for lasting chewing comfort.',
    technologyAr: 'عزل محكم وحشوات طبية عالية المقاومة وتصليب ضوئي',
    technologyEn: 'Moisture-Controlled Isolation & High-Strength Curing',
    highlightsAr: [
      'إزالة دقيقة للتسوس مع الحفاظ على أنسجة السن السليمة',
      'إغلاق محكم يمنع تسرب البكتيريا وتكرار التسوس',
      'ضبط دقيق للعضة لضمان راحة فورية أثناء الأكل',
    ],
    highlightsEn: [
      'Conservative decay removal preserving healthy tooth structure',
      'Tight marginal seal preventing recurrent decay',
      'Precision bite adjustment for immediate chewing comfort',
    ],
    durationMinutes: 45,
    iconKey: 'layers',
    imageKey: 'dental-fillings',
  },
  {
    id: 'cosmetic-fillings',
    slug: 'cosmetic-fillings',
    number: '05.',
    category: 'restorative',
    categoryLabelAr: 'الحشوات وعلاج الجذور',
    categoryLabelEn: 'Fillings & Root Canal',
    titleAr: 'حشوات تجميلية',
    titleEn: 'Cosmetic Composite Fillings',
    summaryAr:
      'حشوات كمبوزيت نانو-هجين مطابقة تماماً للون وشفافية السن الطبيعي لإصلاح الكسور والفراغات والأسنان الأمامية دون أثر مرئي.',
    summaryEn:
      'Shade-matched nano-hybrid aesthetic composite restorations that seamlessly repair chips, gaps, and cavities with invisible blending.',
    detailsAr:
      'تُبنى الحشوات التجميلية على طبقات دقيقة تحاكي شفافية ولمعان المينا الطبيعية، وهي مثالية لترميم الأسنان الأمامية وإغلاق الفراغات البسيطة وإصلاح الحواف المكسورة بنتيجة طبيعية لا تُميَّز عن السن الأصلي.',
    detailsEn:
      'Layered with multi-shade nano-hybrid composite resins, cosmetic fillings replicate natural enamel translucency to restore front teeth, close minor gaps, and repair chipped edges invisibly.',
    technologyAr: 'كمبوزيت نانو-هجين متعدد الدرجات اللونية',
    technologyEn: 'Multi-Shade Nano-Hybrid Aesthetic Composite',
    highlightsAr: [
      'تطابق لوني دقيق مع درجة وشفافية الأسنان المجاورة',
      'مثالية للأسنان الأمامية وإصلاح الكسور والفراغات البسيطة',
      'مقاومة عالية للتصبغ والتآكل مع تلميع يحاكي المينا',
    ],
    highlightsEn: [
      'Exact shade and translucency matching to adjacent teeth',
      'Ideal for front teeth, chipped edges, and small gaps',
      'Stain-resistant finish polished to natural enamel gloss',
    ],
    durationMinutes: 45,
    iconKey: 'gem',
    imageKey: 'cosmetic-fillings',
  },
  {
    id: 'veneers-dsd',
    slug: 'cosmetic-veneers-dsd',
    number: '06.',
    category: 'cosmetic',
    categoryLabelAr: 'التجميل والفينيرز',
    categoryLabelEn: 'Cosmetic & Veneers',
    titleAr: 'فينيرز الأسنان',
    titleEn: 'Dental Veneers',
    summaryAr:
      'عدسات خزفية فائقة الرقة تُصمَّم رقمياً لتصحيح اللون والشكل والتناسق ومنح ابتسامة مشرقة ثابتة اللون.',
    summaryEn:
      'Ultra-thin handcrafted porcelain veneers digitally designed to refine tooth shade, shape, and symmetry naturally.',
    detailsAr:
      'يعتمد تركيب فينيرز الأسنان في NOVA Dental Clinic على المسح الرقمي الدقيق ومعاينة الشكل التجريبي (Mock-up) قبل التنفيذ النهائي، مما يحافظ على طبقة المينا الطبيعية ويمنح ثباتاً لونياً ومظهراً طبيعياً طويل الأمد.',
    detailsEn:
      'Porcelain veneers at NOVA Dental Clinic are planned via 3D intraoral scanning with a chairside mock-up preview before final bonding, preserving healthy enamel for natural, stain-resistant aesthetics.',
    technologyAr: 'عدسات إيماكس الخزفية وتصميم رقمي DSD',
    technologyEn: 'E-max Porcelain & Digital Smile Design (DSD)',
    highlightsAr: [
      'معاينة تجريبية لشكل العدسات قبل التثبيت النهائي',
      'تحضير محافظ للغاية يحافظ على قوة وبنية السن الطبيعي',
      'مقاومة عالية للتصبغات وثبات لوني يدوم لسنوات طويلة',
    ],
    highlightsEn: [
      'Chairside mock-up preview before final bonding',
      'Conservative enamel-preserving preparation',
      'High stain resistance and lifelike ceramic translucency',
    ],
    durationMinutes: 60,
    iconKey: 'gem',
    imageKey: 'dental-veneers',
  },
  {
    id: 'micro-endo',
    slug: 'microscopic-endodontics',
    number: '07.',
    category: 'restorative',
    categoryLabelAr: 'الحشوات وعلاج الجذور',
    categoryLabelEn: 'Fillings & Root Canal',
    titleAr: 'علاج جذور',
    titleEn: 'Root Canal Treatment',
    summaryAr:
      'علاج عصب دقيق وتخفيف فوري للألم باستخدام التكبير البصري والأجهزة الدوارة لحفظ الضرس الطبيعي بأمان.',
    summaryEn:
      'Precision endodontic root canal therapy using optical magnification and rotary instruments to relieve pain and save natural teeth.',
    detailsAr:
      'نركز في علاج الجذور على القضاء التام على الالتهاب وحفظ الضرس الطبيعي في أقل عدد ممكن من الجلسات عبر التخدير المريح، والعزل المطاطي الكامل، والقياس الإلكتروني لأطوال القنوات، والغلق ثلاثي الأبعاد المحكم.',
    detailsEn:
      'Our endodontic protocol eliminates infection promptly and preserves your natural tooth using comfortable anesthesia, rubber-dam sterile isolation, electronic apex measurement, and 3D canal obturation.',
    technologyAr: 'أجهزة علاج جذور دوارة وعزل مطاطي وتكبير بصري',
    technologyEn: 'Rotary Endodontics, Rubber Dam & Optical Magnification',
    highlightsAr: [
      'تخدير موضعي مريح وتخفيف سريع لألم العصب الحاد',
      'عزل كامل للسن لضمان بيئة معقمة ومنع عودة الالتهاب',
      'تنظيف وحشو ثلاثي الأبعاد للقنوات الجذرية بدقة عالية',
    ],
    highlightsEn: [
      'Comfortable anesthesia for swift acute pain relief',
      'Sterile rubber-dam isolation against reinfection',
      'Precision 3D root canal cleaning and hermetic sealing',
    ],
    durationMinutes: 60,
    iconKey: 'microscope',
    imageKey: 'root-canal',
  },
  {
    id: 'clear-aligners',
    slug: 'clear-aligners-orthodontics',
    number: '08.',
    category: 'ortho',
    categoryLabelAr: 'تقويم الأسنان',
    categoryLabelEn: 'Orthodontics',
    titleAr: 'تقويم الأسنان',
    titleEn: 'Orthodontics',
    summaryAr:
      'خيارات متكاملة تشمل التقويم الشفاف الرقمي والتقويم الثابت المعدني والخزفي لتصحيح الاصطفاف وإطباق الفكين.',
    summaryEn:
      'Comprehensive orthodontic solutions including digital clear aligners and ceramic or metal braces for balanced alignment and bite.',
    detailsAr:
      'نقدم في عيادة نوفا خطط تقويم مخصصة لكل الأعمار تبدأ بالمسح الرقمي ثلاثي الأبعاد لمحاكاة حركة الأسنان، سواء عبر القوالب الشفافة القابلة للإزالة أو التقويم الخزفي والمعدني الدقيق بمتابعة دورية منتظمة.',
    detailsEn:
      'NOVA Dental Clinic offers tailored orthodontic plans for teens and adults starting with 3D digital scanning—covering discreet clear aligners as well as modern ceramic and self-ligating braces.',
    technologyAr: 'ماسح رقمي ثلاثي الأبعاد وتخطيط حركة الأسنان',
    technologyEn: '3D Digital Orthodontic Planning & Clear Aligners',
    highlightsAr: [
      'توافر التقويم الشفاف القابل للإزالة والتقويم الخزفي والمعدني',
      'معاينة رقمية لمراحل تحرك الأسنان والنتيجة المتوقعة',
      'تصحيح الازدحام والفراغات ومشاكل إطباق الفكين بدقة',
    ],
    highlightsEn: [
      'Clear aligners alongside aesthetic ceramic and metal braces',
      'Digital simulation of tooth movement from day one',
      'Corrects crowding, spacing, and bite imbalance reliably',
    ],
    durationMinutes: 45,
    iconKey: 'smile',
    imageKey: 'orthodontics',
  },
  {
    id: 'immediate-implants',
    slug: 'dental-implants',
    number: '09.',
    category: 'implants',
    categoryLabelAr: 'الزراعة والتركيبات والجراحة',
    categoryLabelEn: 'Implants, Prosthetics & Surgery',
    titleAr: 'زراعة الأسنان',
    titleEn: 'Dental Implants',
    summaryAr:
      'تعويض الأسنان المفقودة بغرسات تيتانيوم معتمدة وتخطيط ثلاثي الأبعاد لاستعادة المضغ والمظهر الطبيعي بثبات دائم.',
    summaryEn:
      'Certified titanium dental implants placed with 3D CBCT digital guidance to permanently restore chewing function and aesthetics.',
    detailsAr:
      'نستخدم التصوير المقطعي ثلاثي الأبعاد (3D CBCT) لتخطيط موضع وزاوية الغرسة بدقة متناهية بعيداً عن الأعصاب، مع غرسات عالمية معتمدة وتركيبات زيركون مخصصة تحاكي الأسنان الطبيعية في القوة والشكل.',
    detailsEn:
      'Using 3D CBCT bone mapping and digital surgical guides, we place certified international titanium implants with minimal trauma and restore them with custom zirconia crowns.',
    technologyAr: 'أشعة 3D CBCT وغرسات معتمدة وقوالب جراحية رقمية',
    technologyEn: '3D CBCT Diagnostics & Digitally Guided Implants',
    highlightsAr: [
      'تخطيط ثلاثي الأبعاد لكثافة العظم ومواقع الأعصاب قبل الزراعة',
      'تعويض سن واحد أو عدة أسنان دون برد الأسنان المجاورة',
      'راحة أكبر وتعافٍ أسرع مع تيجان زيركون مطابقة للون الأسنان',
    ],
    highlightsEn: [
      'Pre-operative 3D bone and anatomical nerve mapping',
      'Replaces missing teeth without grinding neighboring teeth',
      'Minimally invasive placement with custom zirconia crowns',
    ],
    durationMinutes: 60,
    iconKey: 'shield',
    imageKey: 'dental-implants',
  },
  {
    id: 'crowns-prosthetics',
    slug: 'fixed-and-removable-prosthetics',
    number: '10.',
    category: 'implants',
    categoryLabelAr: 'الزراعة والتركيبات والجراحة',
    categoryLabelEn: 'Implants, Prosthetics & Surgery',
    titleAr: 'تركيبات ثابتة ومتحركة',
    titleEn: 'Fixed & Removable Prosthetics',
    summaryAr:
      'تيجان وجسور الزيركون والإيماكس الثابتة، إلى جانب التركيبات المتحركة المرنة والمدعومة بالزرعات لراحة ومضغ مثاليين.',
    summaryEn:
      'Precision CAD/CAM fixed zirconia & E-max crowns and bridges alongside comfortable flexible and implant-supported removable dentures.',
    detailsAr:
      'نُصمّم التركيبات الثابتة والمتحركة باستخدام القياسات الرقمية الدقيقة لضمان انطباق مثالي على اللثة وتناسق طبيعي مع الأسنان المجاورة، مما يعيد كفاءة المضغ ونطق الحروف وثقة الابتسامة.',
    detailsEn:
      'Our prosthodontic restorations are digitally designed for accurate gingival fit and natural aesthetics—ranging from single zirconia crowns and fixed bridges to lightweight removable prostheses.',
    technologyAr: 'تصميم وتفريز رقمي CAD/CAM لتيجان الزيركون والإيماكس',
    technologyEn: 'CAD/CAM Digital Milling for Zirconia & Flexible Prosthetics',
    highlightsAr: [
      'تيجان وجسور زيركون وإيماكس عالية المتانة والشفافية',
      'تركيبات متحركة مرنة وخفيفة الوزن أو مدعومة بزرعات لثبات أكبر',
      'قياسات رقمية دقيقة لضمان راحة اللثة وثبات الإطباق',
    ],
    highlightsEn: [
      'Durable, natural-looking zirconia and E-max crowns & bridges',
      'Lightweight flexible partial dentures and implant-retained options',
      'Digital fit precision for gum comfort and balanced bite',
    ],
    durationMinutes: 60,
    iconKey: 'crown',
    imageKey: 'prosthetics-crowns',
  },
  {
    id: 'cosmetic-dentistry',
    slug: 'cosmetic-dentistry',
    number: '11.',
    category: 'cosmetic',
    categoryLabelAr: 'التجميل والفينيرز',
    categoryLabelEn: 'Cosmetic & Veneers',
    titleAr: 'تجميل الأسنان',
    titleEn: 'Cosmetic Dentistry',
    summaryAr:
      'برامج تجميل وتنسيق متكاملة للابتسامة تشمل تصميم الابتسامة الرقمي، وتحديد اللثة بالليزر، وتوحيد شكل ولون الأسنان.',
    summaryEn:
      'Comprehensive aesthetic smile makeovers combining Digital Smile Design, gentle gum contouring, and harmonious tooth refinement.',
    detailsAr:
      'لا يقتصر تجميل الأسنان على إجراء واحد، بل هو خطة متناغمة تدرس أبعاد الوجه وخط الشفاه واللثة لاختيار المزيج الأنسب بين تنسيق اللثة، والتبييض، والحشوات التجميلية، أو العدسات الخزفية بمظهر طبيعي راقٍ.',
    detailsEn:
      'Our cosmetic dentistry plans harmonize facial symmetry, gum line balance, and natural tooth proportions—combining laser gum contouring, whitening, bonding, or ceramics tailored to your features.',
    technologyAr: 'تصميم الابتسامة الرقمي DSD وتجميل اللثة بالليزر',
    technologyEn: 'Digital Smile Design (DSD) & Laser Gum Contouring',
    highlightsAr: [
      'تحليل رقمي شامل لتناسق الابتسامة مع ملامح الوجه',
      'تعديل وتجميل خط اللثة وعلاج الابتسامة اللثوية بلطف',
      'خطة تجميلية مخصصة توازن بين الجمال وصحة الأسنان الطبيعية',
    ],
    highlightsEn: [
      'Facial-proportion analysis for bespoke natural aesthetics',
      'Gentle gum line recontouring and gummy-smile refinement',
      'Conservative makeover plans prioritizing long-term tooth health',
    ],
    durationMinutes: 60,
    iconKey: 'gem',
    imageKey: 'cosmetic-dentistry',
  },
  {
    id: 'dental-extractions',
    slug: 'dental-extractions',
    number: '12.',
    category: 'implants',
    categoryLabelAr: 'الزراعة والتركيبات والجراحة',
    categoryLabelEn: 'Implants, Prosthetics & Surgery',
    titleAr: 'خلع الأسنان الجراحي والعادي',
    titleEn: 'Surgical & Simple Extractions',
    summaryAr:
      'خلع آمن ولطيف للأسنان المتضررة وضروس العقل المطمورة بتقنيات غير راضة تحافظ على عظم الفك وتسرّع الالتئام.',
    summaryEn:
      'Gentle, atraumatic simple extractions and surgical wisdom tooth removal preserving jawbone integrity for faster recovery.',
    detailsAr:
      'تُجرى جميع حالات الخلع العادي والجراحي وضروس العقل المدفونة بعد تقييم دقيق بالأشعة، مع تخدير موضعي فعّال وأدوات جراحية دقيقة غير راضة وتعقيم أوروبي Class-B لضمان تجربة هادئة وتعافٍ سريع بأقل تورم ممكن.',
    detailsEn:
      'Every routine or surgical extraction—including impacted wisdom teeth—is preceded by digital X-ray evaluation and performed with atraumatic instruments, effective local anesthesia, and Class-B sterility.',
    technologyAr: 'أدوات خلع غير راضة وتصوير رقمي وتعقيم Class-B',
    technologyEn: 'Atraumatic Surgical Instruments & Class-B Sterility',
    highlightsAr: [
      'خلع عادي سريع ولطيف بدون ألم تحت تخدير موضعي فعّال',
      'جراحة دقيقة لضروس العقل المطمورة والجذور المتبقية',
      'حفظ عظم الفك لتسهيل زراعة الأسنان مستقبلاً مع متابعة بعد الإجراء',
    ],
    highlightsEn: [
      'Calm, pain-free routine extractions under effective anesthesia',
      'Precision surgical removal of impacted wisdom teeth and roots',
      'Socket preservation supporting future implants with guided aftercare',
    ],
    durationMinutes: 45,
    iconKey: 'scissors',
    imageKey: 'dental-extractions',
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
