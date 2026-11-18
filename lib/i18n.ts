export type Locale = 'ar' | 'en';

export interface Dictionary {
  meta: {
    siteName: string;
    homeTitle: string;
    homeDescription: string;
  };
  nav: {
    home: string;
    about: string;
    services: string;
    pages: string;
    doctors: string;
    gallery: string;
    technology: string;
    testimonials: string;
    faqs: string;
    blog: string;
    contact: string;
    appointment: string;
    bookAppointment: string;
    switchLangLabel: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    kicker: string;
    headlinePrefix: string;
    headlineAccent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    bottomSloganLabel: string;
    floatingDoctorBadge: string;
  };
  ctaStrip: {
    callTitle: string;
    callSubtitle: string;
    locationTitle: string;
    locationBtn: string;
    bookTitle: string;
    bookSubtitle: string;
    bookBtn: string;
  };
  about: {
    kicker: string;
    headingPrefix: string;
    headingAccent: string;
    description: string;
    bullets: string[];
    cta: string;
    rotatingBadgeText: string;
  };
  servicesSection: {
    kicker: string;
    headingPrefix: string;
    headingAccent: string;
    subtitle: string;
    readMore: string;
    viewAll: string;
    footerNotePrefix: string;
    footerNoteLink: string;
    filterAll: string;
  };
  visitClinic: {
    kicker: string;
    heading: string;
    cta: string;
  };
  counters: {
    items: {
      value: string;
      title: string;
      description: string;
    }[];
  };
  whyChoose: {
    kicker: string;
    headingPrefix: string;
    headingAccent: string;
    subtitle: string;
    leftItems: { title: string; description: string }[];
    rightItems: { title: string; description: string }[];
  };
  howItWork: {
    kicker: string;
    headingPrefix: string;
    headingAccent: string;
    subtitle: string;
    steps: { title: string; description: string }[];
    cta: string;
  };
  teamSection: {
    kicker: string;
    headingPrefix: string;
    headingAccent: string;
    subtitle: string;
    viewAll: string;
    bookDoctor: string;
    viewProfile: string;
  };
  testimonialsSection: {
    kicker: string;
    headingPrefix: string;
    headingAccent: string;
    subtitle: string;
    highlightBoxTitle: string;
    highlightBoxSubtitle: string;
    prevSlide: string;
    nextSlide: string;
    viewAll: string;
  };
  blogSection: {
    kicker: string;
    headingPrefix: string;
    headingAccent: string;
    subtitle: string;
    readMore: string;
    viewAll: string;
  };
  contactSection: {
    kicker: string;
    headingPrefix: string;
    headingAccent: string;
    subtitle: string;
    addressLabel: string;
    primaryPhoneLabel: string;
    additionalPhonesLabel: string;
    emailLabel: string;
    instagramLabel: string;
    directionsBtn: string;
    ctaBtn: string;
  };
  footer: {
    quickLinksTitle: string;
    socialTitle: string;
    contactTitle: string;
    copyright: string;
  };
  appointmentPage: {
    pageTitle: string;
    kicker: string;
    headingPrefix: string;
    headingAccent: string;
    subtitle: string;
    myBookingsBtn: string;
    branchLabel: string;
    serviceLabel: string;
    doctorLabel: string;
    anyDoctor: string;
    dateLabel: string;
    timeLabel: string;
    loadingSlots: string;
    bookedLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    summaryTitle: string;
    summaryNote: string;
    confirmedTitle: string;
    confirmedDesc: string;
    refLabel: string;
    bookAnother: string;
    manageBookings: string;
    drawerTitle: string;
    drawerSubtitle: string;
    noBookings: string;
    cancelBooking: string;
    statusConfirmed: string;
    statusCancelled: string;
  };
  contactPage: {
    pageTitle: string;
    formTitle: string;
    formSubtitle: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendBtn: string;
    sendingBtn: string;
    sentTitle: string;
    sentDesc: string;
    sendAnother: string;
  };
  notFound: {
    code: string;
    title: string;
    description: string;
    backHome: string;
  };
}

export const DICTIONARIES: Record<Locale, Dictionary> = {
  ar: {
    meta: {
      siteName: 'نوفا لطب الأسنان | NOVA Dental Clinic',
      homeTitle: 'نوفا لطب الأسنان | NOVA Dental Clinic — التجمع الخامس',
      homeDescription:
        'في NOVA Dental Clinic بمركز أوزون الطبي بالتجمع الخامس نهتم بصحة وجمال ابتسامتك من خلال تجربة علاجية مريحة ورعاية متخصصة.',
    },
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      services: 'الخدمات',
      pages: 'الصفحات',
      doctors: 'الأطباء',
      gallery: 'معرض الابتسامات',
      technology: 'التقنيات الطبية',
      testimonials: 'آراء المرضى',
      faqs: 'الأسئلة الشائعة',
      blog: 'المدونة الطبية',
      contact: 'تواصل معنا',
      appointment: 'المواعيد',
      bookAppointment: 'احجز موعدك',
      switchLangLabel: 'English',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
    },
    hero: {
      kicker: 'NOVA DENTAL CLINIC · التجمع الخامس',
      headlinePrefix: 'ابتسامتك تستحق',
      headlineAccent: 'أفضل رعاية',
      description:
        'في NOVA Dental Clinic، نهتم بصحة وجمال ابتسامتك من خلال تجربة علاجية مريحة ورعاية متخصصة في مركز أوزون الطبي بالتجمع الخامس.',
      primaryCta: 'احجز موعدك الآن',
      secondaryCta: 'اكتشف خدماتنا',
      bottomSloganLabel: 'ابتسامتك مصدر سعادتنا، خلّينا نحافظ على إشراقها.',
      floatingDoctorBadge: 'فريق استشاريي نوفا',
    },
    ctaStrip: {
      callTitle: 'تواصل معنا مباشرة',
      callSubtitle: 'اتصل لحجز أو تعديل موعدك',
      locationTitle: 'موقع العيادة',
      locationBtn: 'الاتجاهات على الخريطة',
      bookTitle: 'احجز استشارتك',
      bookSubtitle: 'تأكيد فوري عبر نظام المواعيد',
      bookBtn: 'احجز موعدك الآن',
    },
    about: {
      kicker: 'من نحن',
      headingPrefix: 'رحلتك نحو ابتسامة صحية ومشرقة',
      headingAccent: 'تبدأ من هنا',
      description:
        'نؤمن في NOVA Dental Clinic بأن كل مراجع يستحق خطة علاجية واضحة وبيئة علاجية هادئة تراعي راحته منذ لحظة الاستقبال وحتى المتابعة المستمرة.',
      bullets: [
        'رعاية مخصصة لكل مريض',
        'فريق متخصص وودود',
        'أحدث تقنيات الفحص الرقمي',
        'خطة علاجية واضحة قبل البدء',
      ],
      cta: 'تعرف على العيادة',
      rotatingBadgeText: 'NOVA DENTAL CLINIC · NEW CAIRO · ',
    },
    servicesSection: {
      kicker: 'خدماتنا الطبية',
      headingPrefix: 'خدمات عالية الجودة',
      headingAccent: 'لصحة وجمال أسنانك',
      subtitle:
        'نقدم باقة متكاملة من العلاجات التجميلية والوقائية والترميمية بإشراف أطباء متخصصين في مركز أوزون الطبي.',
      readMore: 'تفاصيل الخدمة',
      viewAll: 'جميع الخدمات',
      footerNotePrefix: 'نعتمد أحدث بروتوكولات التعقيم والفحص الرقمي.',
      footerNoteLink: 'استكشف جميع الخدمات',
      filterAll: 'جميع التخصصات',
    },
    visitClinic: {
      kicker: 'زيارة العيادة',
      heading: 'بيئة علاجية هادئة ومجهزة لراحتك في قلب التجمع الخامس',
      cta: 'احجز زيارتك الآن',
    },
    counters: {
      items: [
        {
          value: 'OZONE',
          title: 'مركز أوزون الطبي',
          description: 'موقع يسهل الوصول إليه في قلب التجمع الخامس بالقاهرة الجديدة.',
        },
        {
          value: '3D',
          title: 'تشخيص ومسح رقمي',
          description: 'اعتماد التصوير الرقمي لضمان دقة التشخيص ووضوح الخطة العلاجية.',
        },
        {
          value: 'Class-B',
          title: 'بروتوكول تعقيم صارم',
          description: 'تعقيم الأدوات بدورات معتمدة وتغليف أحادي الاستخدام لكل مراجع.',
        },
        {
          value: '1:1',
          title: 'اهتمام شخصي متكامل',
          description: 'مواعيد منظمة مسبقاً تمنحك وقتاً كافياً مع طبيبك دون انتظار.',
        },
      ],
    },
    whyChoose: {
      kicker: 'لماذا تختار نوفا',
      headingPrefix: 'ما يميز تجربتك في',
      headingAccent: 'نوفا لطب الأسنان',
      subtitle:
        'صُممت كل تفاصيل العيادة لتجمع بين الدقة الطبية والهدوء النفسي ووضوح التواصل.',
      leftItems: [
        {
          title: 'رعاية تخصصية شاملة',
          description: 'تغطي التجميل، الزراعة، التقويم الشفاف، وعلاج الجذور تحت سقف واحد.',
        },
        {
          title: 'تشخيص رقمي دقيق',
          description: 'معاينة الحالة بالأشعة والمسح ثلاثي الأبعاد لشرح الخيارات بوضوح.',
        },
        {
          title: 'تجربة علاجية مريحة',
          description: 'خطوات مدروسة لتقليل التوتر وجعل كل زيارة سلسة وهادئة.',
        },
      ],
      rightItems: [
        {
          title: 'مواعيد منظمة مسبقاً',
          description: 'نظام حجز إلكتروني مباشر يحترم وقتك ويؤكد موعدك فوراً.',
        },
        {
          title: 'التزام بمعايير مكافحة العدوى',
          description: 'غرف علاجية معقمة ومجهزة بأحدث وحدات العناية السنية.',
        },
        {
          title: 'متابعة مستمرة بعد الإجراء',
          description: 'إرشادات عناية واضحة وتواصل مباشر عبر فريق العيادة.',
        },
      ],
    },
    howItWork: {
      kicker: 'كيف نعمل',
      headingPrefix: 'خطوات بسيطة نحو',
      headingAccent: 'ابتسامة صحية',
      subtitle:
        'نتبع مساراً واضحاً ومنظماً يبدأ من حجز الموعد الإلكتروني وينتهي بمتابعة مريحة.',
      steps: [
        {
          title: 'احجز موعدك إلكترونياً أو هاتفياً',
          description:
            'اختر الخدمة والطبيب واليوم والساعة المناسبة لك عبر صفحة الحجز أو اتصل مباشرة على 01031235562.',
        },
        {
          title: 'الفحص الرقمي وشرح الخطة العلاجية',
          description:
            'يستمع الطبيب لهدفك من الزيارة ويجري الفحص اللازم لشرح الخيارات المتاحة بكل شفافية.',
        },
        {
          title: 'العلاج المريح والمتابعة المنتظمة',
          description:
            'تُنَفَّذ الجلسة في أجواء هادئة ومعقمة مع متابعة مستمرة للحفاظ على صحة وإشراق ابتسامتك.',
        },
      ],
      cta: 'احجز موعدك الآن',
    },
    teamSection: {
      kicker: 'الفريق الطبي',
      headingPrefix: 'نخبة أطباء',
      headingAccent: 'نوفا لطب الأسنان',
      subtitle:
        'فريق متخصص يحرص على راحتك وجودة النتيجة الطبية في كل تخصص من تخصصات طب الأسنان.',
      viewAll: 'عرض جميع الأطباء',
      bookDoctor: 'احجز مع الطبيب',
      viewProfile: 'عرض الملف الطبي',
    },
    testimonialsSection: {
      kicker: 'تجارب المراجعين',
      headingPrefix: 'كلمات ثقة من',
      headingAccent: 'مراجعي العيادة',
      subtitle:
        'انطباعات حقيقية تعكس اهتمامنا بالتفاصيل وجودة الرعاية وهدوء التجربة داخل العيادة.',
      highlightBoxTitle: 'NOVA',
      highlightBoxSubtitle: 'ابتسامتك مصدر سعادتنا، خلّينا نحافظ على إشراقها.',
      prevSlide: 'التجربة السابقة',
      nextSlide: 'التجربة التالية',
      viewAll: 'جميع آراء المرضى',
    },
    blogSection: {
      kicker: 'المدونة الطبية',
      headingPrefix: 'أحدث المقالات',
      headingAccent: 'والنصائح السنية',
      subtitle:
        'محتوى توعوي مبسط لمساعدتك على العناية اليومية بأسنانك وفهم الإجراءات العلاجية الحديثة.',
      readMore: 'اقرأ المقال',
      viewAll: 'عرض جميع المقالات',
    },
    contactSection: {
      kicker: 'تواصل معنا',
      headingPrefix: 'زُرنا في مركز أوزون الطبي',
      headingAccent: 'بالتجمع الخامس',
      subtitle:
        'يسعدنا استقبال استفساراتكم وحجز مواعيدكم عبر الهاتف أو من خلال نظام الحجز الإلكتروني المباشر.',
      addressLabel: 'العنوان',
      primaryPhoneLabel: 'الرقم الرئيسي',
      additionalPhonesLabel: 'أرقام إضافية للتواصل',
      emailLabel: 'البريد الإلكتروني',
      instagramLabel: 'حساب إنستغرام الرسمي',
      directionsBtn: 'الاتجاهات عبر Google Maps',
      ctaBtn: 'احجز موعدك الآن',
    },
    footer: {
      quickLinksTitle: 'روابط سريعة',
      socialTitle: 'الحساب الرسمي',
      contactTitle: 'بيانات التواصل',
      copyright: '© 2026 NOVA Dental Clinic — نوفا لطب الأسنان. جميع الحقوق محفوظة.',
    },
    appointmentPage: {
      pageTitle: 'حجز موعد',
      kicker: 'حجز المواعيد',
      headingPrefix: 'احجز موعدك في',
      headingAccent: 'نوفا لطب الأسنان',
      subtitle:
        'اختر الخدمة والطبيب والموعد المناسب لتسجيل زيارتك في مركز أوزون الطبي بالتجمع الخامس.',
      myBookingsBtn: 'حجوزاتي المسجلة',
      branchLabel: 'مقر العيادة',
      serviceLabel: 'الخدمة الطبية المطلوبة',
      doctorLabel: 'الطبيب المختص',
      anyDoctor: 'أول طبيب متخصص متاح',
      dateLabel: 'تاريخ الموعد',
      timeLabel: 'الساعة المتاحة',
      loadingSlots: 'جاري تحديث المواعيد...',
      bookedLabel: 'محجوز',
      nameLabel: 'الاسم الكامل',
      namePlaceholder: 'مثال: كريم أحمد مصطفى',
      phoneLabel: 'رقم الموبايل المصري',
      phonePlaceholder: '010XXXXXXXX',
      notesLabel: 'ملاحظات إضافية (اختياري)',
      notesPlaceholder: 'اكتب استفسارك أو الموعد المفضل للتواصل...',
      submitBtn: 'تأكيد حجز الموعد',
      submittingBtn: 'جاري تأكيد الحجز...',
      summaryTitle: 'ملخص الموعد المختار',
      summaryNote: 'يتم تأكيد الحجز عبر فريق الاستقبال على رقم 01031235562.',
      confirmedTitle: 'تم تأكيد موعدك بنجاح',
      confirmedDesc: 'تم تسجيل الحجز بنجاح وسيتم التواصل معك من فريق استقبال NOVA Dental Clinic لتأكيد تفاصيل الزيارة.',
      refLabel: 'رقم المرجع',
      bookAnother: 'حجز موعد آخر',
      manageBookings: 'إدارة حجوزاتي',
      drawerTitle: 'حجوزاتي المسجلة',
      drawerSubtitle: 'متابعة أو إلغاء المواعيد المحجوزة من هذا الجهاز',
      noBookings: 'لا توجد حجوزات مسجلة حالياً.',
      cancelBooking: 'إلغاء الموعد',
      statusConfirmed: 'مؤكد',
      statusCancelled: 'ملغى',
    },
    contactPage: {
      pageTitle: 'تواصل معنا',
      formTitle: 'أرسل استفسارك لفريق العيادة',
      formSubtitle: 'املأ البيانات التالية وسيتواصل معك فريق الاستقبال في أقرب وقت.',
      subjectLabel: 'موضوع الرسالة',
      subjectPlaceholder: 'استشارة تجميل / زراعة / حجز موعد',
      messageLabel: 'تفاصيل الرسالة',
      messagePlaceholder: 'اكتب استفسارك هنا...',
      sendBtn: 'إرسال الرسالة',
      sendingBtn: 'جاري الإرسال...',
      sentTitle: 'تم استلام رسالتك بنجاح',
      sentDesc: 'شكراً لتواصلك مع NOVA Dental Clinic، سيعاود فريقنا الاتصال بك على الرقم المسجل.',
      sendAnother: 'إرسال رسالة أخرى',
    },
    notFound: {
      code: '404',
      title: 'عذراً، الصفحة غير موجودة',
      description: 'يبدو أن الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله. يمكنك العودة إلى الصفحة الرئيسية أو حجز موعد مباشرة.',
      backHome: 'العودة للرئيسية',
    },
  },
  en: {
    meta: {
      siteName: 'NOVA Dental Clinic',
      homeTitle: 'NOVA Dental Clinic — Fifth Settlement, New Cairo',
      homeDescription:
        'At NOVA Dental Clinic in Ozone Medical Center, Fifth Settlement, New Cairo, your smile is our joy — experience specialized, comfortable dental care.',
    },
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      pages: 'Pages',
      doctors: 'Doctors',
      gallery: 'Gallery',
      technology: 'Technology',
      testimonials: 'Testimonials',
      faqs: 'FAQs',
      blog: 'Blog',
      contact: 'Contact Us',
      appointment: 'Appointment',
      bookAppointment: 'Book Appointment',
      switchLangLabel: 'العربية',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    hero: {
      kicker: 'NOVA DENTAL CLINIC · FIFTH SETTLEMENT',
      headlinePrefix: 'Your Smile Deserves',
      headlineAccent: 'the Finest Care',
      description:
        'At NOVA Dental Clinic, we care for the health and beauty of your smile through a comfortable treatment experience and specialized care at Ozone Medical Center, New Cairo.',
      primaryCta: 'Book Appointment Now',
      secondaryCta: 'Explore Our Services',
      bottomSloganLabel: 'Your smile is our joy, let us keep it shining.',
      floatingDoctorBadge: 'NOVA Clinical Team',
    },
    ctaStrip: {
      callTitle: 'Direct Clinic Line',
      callSubtitle: 'Call to book or confirm your visit',
      locationTitle: 'Clinic Location',
      locationBtn: 'Directions on Google Maps',
      bookTitle: 'Schedule Your Visit',
      bookSubtitle: 'Instant online appointment booking',
      bookBtn: 'Book Appointment',
    },
    about: {
      kicker: 'ABOUT US',
      headingPrefix: 'Your Journey to a Healthier Smile',
      headingAccent: 'Begins Here',
      description:
        'At NOVA Dental Clinic, we believe every patient deserves clear clinical guidance, calm surroundings, and attentive care from reception through follow-up.',
      bullets: [
        'Personalized Patient Care',
        'Specialized & Friendly Team',
        'Modern Digital Diagnostics',
        'Clear Treatment Planning',
      ],
      cta: 'About NOVA Clinic',
      rotatingBadgeText: 'NOVA DENTAL CLINIC · NEW CAIRO · ',
    },
    servicesSection: {
      kicker: 'OUR SERVICES',
      headingPrefix: 'High Quality Dental',
      headingAccent: 'Services for You',
      subtitle:
        'Comprehensive cosmetic, restorative, orthodontic, and preventive treatments delivered by specialized clinicians at Ozone Medical Center.',
      readMore: 'Read More',
      viewAll: 'All Services',
      footerNotePrefix: 'Every treatment follows strict digital planning and European sterilization.',
      footerNoteLink: 'View All Services',
      filterAll: 'All Specialties',
    },
    visitClinic: {
      kicker: 'VISIT CLINIC',
      heading: 'A Calm, Digitally Equipped Dental Studio in Fifth Settlement',
      cta: 'Book Your Visit',
    },
    counters: {
      items: [
        {
          value: 'OZONE',
          title: 'Ozone Medical Center',
          description: 'Accessible location in Fifth Settlement, New Cairo, Egypt.',
        },
        {
          value: '3D',
          title: 'Digital Diagnostics',
          description: 'Digital intraoral scanning and 3D imaging for clear planning.',
        },
        {
          value: 'Class-B',
          title: 'Strict Sterilization',
          description: 'European autoclave protocols with sealed single-use instrument packs.',
        },
        {
          value: '1:1',
          title: 'Scheduled Focus',
          description: 'Pre-booked appointments ensuring unhurried time with your doctor.',
        },
      ],
    },
    whyChoose: {
      kicker: 'WHY CHOOSE US',
      headingPrefix: 'The Difference at',
      headingAccent: 'NOVA Dental Clinic',
      subtitle:
        'Every detail of our Fifth Settlement clinic balances clinical precision with calm hospitality.',
      leftItems: [
        {
          title: 'Comprehensive Specialties',
          description: 'Cosmetic veneers, implants, clear aligners, and endodontics under one roof.',
        },
        {
          title: 'Accurate Digital Imaging',
          description: 'Clear 3D diagnostics so you can preview options before treatment begins.',
        },
        {
          title: 'Gentle Patient Experience',
          description: 'Thoughtful pain-minimized protocols designed for anxious visitors.',
        },
      ],
      rightItems: [
        {
          title: 'Online Appointment Scheduling',
          description: 'Live slot availability with instant reference confirmation.',
        },
        {
          title: 'Certified Infection Control',
          description: 'Hospital-grade sterilization cycles between every single visit.',
        },
        {
          title: 'Dedicated Follow-Up',
          description: 'Clear aftercare guidance and responsive phone support.',
        },
      ],
    },
    howItWork: {
      kicker: 'HOW IT WORKS',
      headingPrefix: 'Simple Steps to Your',
      headingAccent: 'Brightest Smile',
      subtitle:
        'An organized patient pathway from online scheduling to attentive post-visit care.',
      steps: [
        {
          title: 'Book Online or by Phone',
          description:
            'Select your service, doctor, and preferred date online or call us directly at 01031235562.',
        },
        {
          title: 'Digital Evaluation & Clear Plan',
          description:
            'Your dentist listens to your goals and walks you through transparent clinical options.',
        },
        {
          title: 'Comfortable Care & Follow-Up',
          description:
            'Treatment is delivered in a serene suite with clear aftercare to keep your smile shining.',
        },
      ],
      cta: 'Make an Appointment',
    },
    teamSection: {
      kicker: 'OUR TEAM',
      headingPrefix: 'Meet the NOVA',
      headingAccent: 'Dental Specialists',
      subtitle:
        'Experienced specialists collaborating across implantology, orthodontics, cosmetic veneers, and endodontics.',
      viewAll: 'View All Doctors',
      bookDoctor: 'Book With Doctor',
      viewProfile: 'View Profile',
    },
    testimonialsSection: {
      kicker: 'TESTIMONIALS',
      headingPrefix: 'Stories From Our',
      headingAccent: 'Clinic Patients',
      subtitle:
        'Patient experiences reflecting our commitment to calm care, clarity, and natural results.',
      highlightBoxTitle: 'NOVA',
      highlightBoxSubtitle: 'Your smile is our joy, let us keep it shining.',
      prevSlide: 'Previous testimonial',
      nextSlide: 'Next testimonial',
      viewAll: 'All Testimonials',
    },
    blogSection: {
      kicker: 'OUR BLOG',
      headingPrefix: 'Latest Dental Care',
      headingAccent: 'Articles & Guides',
      subtitle:
        'Practical dental hygiene insights and clear explanations of modern clinical procedures.',
      readMore: 'Read More',
      viewAll: 'View All Articles',
    },
    contactSection: {
      kicker: 'CONTACT US',
      headingPrefix: 'Visit Us at Ozone Medical Center',
      headingAccent: 'New Cairo',
      subtitle:
        'Reach our Fifth Settlement reception by phone, email, or schedule your appointment online.',
      addressLabel: 'Clinic Address',
      primaryPhoneLabel: 'Primary Phone',
      additionalPhonesLabel: 'Additional Contact Numbers',
      emailLabel: 'Email Address',
      instagramLabel: 'Official Instagram',
      directionsBtn: 'Open Google Maps Directions',
      ctaBtn: 'Book Appointment',
    },
    footer: {
      quickLinksTitle: 'Quick Links',
      socialTitle: 'Official Social',
      contactTitle: 'Contact Us',
      copyright: '© 2026 NOVA Dental Clinic. All Rights Reserved.',
    },
    appointmentPage: {
      pageTitle: 'Book Appointment',
      kicker: 'APPOINTMENT',
      headingPrefix: 'Schedule Your Visit at',
      headingAccent: 'NOVA Dental Clinic',
      subtitle:
        'Choose your desired dental service, specialist, date, and available time slot at Ozone Medical Center.',
      myBookingsBtn: 'My Bookings',
      branchLabel: 'Clinic Location',
      serviceLabel: 'Dental Service',
      doctorLabel: 'Preferred Specialist',
      anyDoctor: 'First Available Specialist',
      dateLabel: 'Preferred Date',
      timeLabel: 'Available Time Slots',
      loadingSlots: 'Updating available slots...',
      bookedLabel: 'Booked',
      nameLabel: 'Full Name',
      namePlaceholder: 'e.g. Karim Ahmed Mostafa',
      phoneLabel: 'Egyptian Mobile Number',
      phonePlaceholder: '010XXXXXXXX',
      notesLabel: 'Additional Notes (Optional)',
      notesPlaceholder: 'Share any questions or preferred follow-up notes...',
      submitBtn: 'Confirm Appointment',
      submittingBtn: 'Confirming...',
      summaryTitle: 'Appointment Summary',
      summaryNote: 'Our reception confirms details via 01031235562 before your visit.',
      confirmedTitle: 'Appointment Confirmed Successfully',
      confirmedDesc: 'Your booking has been registered. Our NOVA Dental Clinic reception team will follow up prior to your visit.',
      refLabel: 'Reference Code',
      bookAnother: 'Book Another Visit',
      manageBookings: 'View My Bookings',
      drawerTitle: 'My Scheduled Bookings',
      drawerSubtitle: 'Review or cancel appointments booked from this device',
      noBookings: 'No scheduled appointments found yet.',
      cancelBooking: 'Cancel Appointment',
      statusConfirmed: 'Confirmed',
      statusCancelled: 'Cancelled',
    },
    contactPage: {
      pageTitle: 'Contact Us',
      formTitle: 'Send a Message to Our Clinic',
      formSubtitle: 'Complete the form below and our reception team will get back to you promptly.',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Cosmetic Consultation / Implants / Scheduling',
      messageLabel: 'Message',
      messagePlaceholder: 'Write your question or inquiry here...',
      sendBtn: 'Send Message',
      sendingBtn: 'Sending...',
      sentTitle: 'Message Received',
      sentDesc: 'Thank you for reaching out to NOVA Dental Clinic. Our reception will contact you soon.',
      sendAnother: 'Send Another Message',
    },
    notFound: {
      code: '404',
      title: 'Page Not Found',
      description: 'The page you are looking for is unavailable or has moved. Return to the homepage or book an appointment directly.',
      backHome: 'Back to Home',
    },
  },
};
