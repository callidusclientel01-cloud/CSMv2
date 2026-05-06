const fs = require('fs');

const addHomeTranslations = (lang, newHomeObj) => {
  const path = `messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.Home = newHomeObj;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

const enHome = {
  hero: {
    badge: "World-Class Healthcare",
    title1: "Get World-Class Treatment at ",
    title2: "Affordable Costs",
    subtitle: "Personalized medical travel support for international patients. From consultation to recovery, we guide you every step of the way.",
    btnPlan: "Get Free Treatment Plan",
    btnExpert: "Talk to Medical Expert"
  },
  form: {
    title: "Inquire About Treatment",
    name: "Full Name",
    namePlaceholder: "Your Name",
    country: "Country",
    whatsapp: "WhatsApp",
    whatsappPlaceholder: "Phone Number...",
    condition: "Medical Condition",
    conditionPlaceholder: "e.g. Cardiac Surgery",
    humanCheck: "Human Check: {num1} + {num2} = ?",
    answerPlaceholder: "Answer",
    btnSending: "Sending...",
    btnComplete: "Complete Inquiry",
    successMsg: "Thank you! Your inquiry has been sent. We will contact you shortly.",
    errorMath: "Incorrect math answer. Please try again.",
    errorGeneric: "Something went wrong. Please try again."
  },
  search: {
    placeholder: "Search by Treatment...",
    filterDest: "Filter by Destination",
    btnFind: "Find Hospital"
  },
  howItWorks: {
    badge: "How It Works",
    title: "Your Journey to Recovery",
    subtitle: "We handle everything, so you can focus on healing. A step-by-step guidance.",
    step1Title: "1. Consultation",
    step1Desc: "Send your medical reports for a free evaluation by our partnering specialists.",
    step2Title: "2. Travel & Visa",
    step2Desc: "We organize your entire trip, including visa letters, flights, and accommodation.",
    step3Title: "3. Treatment",
    step3Desc: "Receive world-class care at top accredited hospitals with dedicated interpreters.",
    step4Title: "4. Recovery",
    step4Desc: "Enjoy a safe recovery and continuous post-treatment follow-ups back home."
  },
  packages: {
    badge: "Curated Healthcare",
    title: "Promotional Medical Packages",
    subtitle: "All-inclusive healthcare bundles designed for your peace of mind.",
    btnExplore: "Explore All Packages",
    offer: "Offer",
    priceLabel: "Package Price"
  },
  hospitals: {
    title: "Elite Accredited Hospitals",
    subtitle: "Global centers of excellence with JCI and ISO certifications, specifically chosen for our African patients.",
    btnDetails: "View Details"
  },
  destinations: {
    title: "Top Medical Destinations",
    subtitle: "Experience world-class care in the world's leading medical hubs with complete concierge support.",
    btnExplore: "Explore Treatments"
  },
  treatments: {
    badge: "Centers of Excellence",
    title: "Specialty Treatments",
    startingAt: "Starting at",
    btnViewAll: "View All 30+ Specialties"
  },
  stories: {
    badge: "Real Experiences",
    title: "Patient Stories & Virtual Tours",
    subtitle: "Hear from families across Africa who chose CureSureMedico for their life-changing treatments. Take a virtual walk through our partner JCI-accredited facilities.",
    btnWatchAll: "Watch All Testimonials",
    close: "Close"
  },
  advantage: {
    title: "The CureSureMedico Advantage",
    adv1Title: "Verified JCI-Accredited Hospitals",
    adv1Desc: "We only partner with hospitals that meet the gold standard of international healthcare. Each facility is personally vetted by our medical board.",
    adv2Title: "Transparent Pricing",
    adv2Desc: "No hidden costs. Get detailed medical quotes and financial breakdown before you leave your home country.",
    adv3Title: "Africa Support Network",
    adv3Desc: "Local support offices in Lagos, Nairobi, and Addis Ababa for seamless pre-travel coordination.",
    adv4Title: "24/7 Dedicated Case Manager",
    adv4Desc: "Your personal advocate in the hospital who speaks your language and understands your cultural needs.",
    adv4Item1: "24/7 Bedside support",
    adv4Item2: "Linguistic assistance",
    adv4Item3: "Discharge planning"
  }
};

const frHome = {
  hero: {
    badge: "Soins de Santé de Classe Mondiale",
    title1: "Obtenez des soins de classe mondiale à des ",
    title2: "Coûts Abordables",
    subtitle: "Accompagnement personnalisé pour les patients internationaux. De la consultation à la guérison, nous vous guidons à chaque étape.",
    btnPlan: "Obtenir un plan de traitement gratuit",
    btnExpert: "Parler à un expert médical"
  },
  form: {
    title: "Demande de traitement",
    name: "Nom complet",
    namePlaceholder: "Votre nom",
    country: "Pays",
    whatsapp: "WhatsApp",
    whatsappPlaceholder: "Numéro de téléphone...",
    condition: "Condition Médicale",
    conditionPlaceholder: "ex: Chirurgie Cardiaque",
    humanCheck: "Vérification Humaine : {num1} + {num2} = ?",
    answerPlaceholder: "Réponse",
    btnSending: "Envoi...",
    btnComplete: "Compléter la demande",
    successMsg: "Merci ! Votre demande a été envoyée. Nous vous contacterons sous peu.",
    errorMath: "Réponse mathématique incorrecte. Veuillez réessayer.",
    errorGeneric: "Une erreur est survenue. Veuillez réessayer."
  },
  search: {
    placeholder: "Rechercher un traitement...",
    filterDest: "Filtrer par destination",
    btnFind: "Trouver un hôpital"
  },
  howItWorks: {
    badge: "Comment ça marche",
    title: "Votre parcours vers la guérison",
    subtitle: "Nous nous occupons de tout pour que vous puissiez vous concentrer sur votre guérison. Un accompagnement étape par étape.",
    step1Title: "1. Consultation",
    step1Desc: "Envoyez vos rapports médicaux pour une évaluation gratuite par nos spécialistes partenaires.",
    step2Title: "2. Voyage & Visa",
    step2Desc: "Nous organisons l'intégralité de votre voyage, y compris les lettres de visa, les vols et l'hébergement.",
    step3Title: "3. Traitement",
    step3Desc: "Recevez des soins de classe mondiale dans les meilleurs hôpitaux accrédités avec des interprètes dédiés.",
    step4Title: "4. Rétablissement",
    step4Desc: "Profitez d'un rétablissement sûr et de suivis continus après le traitement de retour chez vous."
  },
  packages: {
    badge: "Soins sur mesure",
    title: "Forfaits Médicaux Promotionnels",
    subtitle: "Des forfaits de soins complets conçus pour votre tranquillité d'esprit.",
    btnExplore: "Explorer tous les forfaits",
    offer: "Offre",
    priceLabel: "Prix du forfait"
  },
  hospitals: {
    title: "Hôpitaux d'élite accrédités",
    subtitle: "Centres d'excellence mondiaux certifiés JCI et ISO, spécifiquement choisis pour nos patients africains.",
    btnDetails: "Voir les détails"
  },
  destinations: {
    title: "Top Destinations Médicales",
    subtitle: "Faites l'expérience de soins de classe mondiale dans les principaux centres médicaux du monde avec un service de conciergerie complet.",
    btnExplore: "Explorer les traitements"
  },
  treatments: {
    badge: "Centres d'excellence",
    title: "Traitements Spécialisés",
    startingAt: "À partir de",
    btnViewAll: "Voir les 30+ spécialités"
  },
  stories: {
    badge: "Expériences Réelles",
    title: "Histoires de patients & Visites Virtuelles",
    subtitle: "Écoutez des familles de toute l'Afrique qui ont choisi CureSureMedico pour leurs traitements qui ont changé leur vie. Faites une promenade virtuelle dans nos établissements partenaires accrédités JCI.",
    btnWatchAll: "Voir tous les témoignages",
    close: "Fermer"
  },
  advantage: {
    title: "L'Avantage CureSureMedico",
    adv1Title: "Hôpitaux vérifiés accrédités JCI",
    adv1Desc: "Nous ne travaillons qu'avec des hôpitaux qui respectent la norme d'or des soins de santé internationaux. Chaque établissement est personnellement contrôlé par notre conseil médical.",
    adv2Title: "Tarification Transparente",
    adv2Desc: "Aucun coût caché. Obtenez des devis médicaux détaillés et une ventilation financière avant de quitter votre pays.",
    adv3Title: "Réseau de soutien en Afrique",
    adv3Desc: "Bureaux d'assistance locaux à Lagos, Nairobi et Addis-Abeba pour une coordination fluide avant le voyage.",
    adv4Title: "Gestionnaire de cas dédié 24/7",
    adv4Desc: "Votre avocat personnel à l'hôpital qui parle votre langue et comprend vos besoins culturels.",
    adv4Item1: "Soutien au chevet 24/7",
    adv4Item2: "Assistance linguistique",
    adv4Item3: "Planification de la sortie"
  }
};

const arHome = {
  hero: {
    badge: "رعاية صحية عالمية المستوى",
    title1: "احصل على علاج عالمي المستوى بـ ",
    title2: "تكاليف معقولة",
    subtitle: "دعم شخصي للسفر الطبي للمرضى الدوليين. من الاستشارة إلى الشفاء، نرشدك في كل خطوة.",
    btnPlan: "احصل على خطة علاج مجانية",
    btnExpert: "تحدث إلى خبير طبي"
  },
  form: {
    title: "استفسر عن العلاج",
    name: "الاسم الكامل",
    namePlaceholder: "اسمك",
    country: "الدولة",
    whatsapp: "واتساب",
    whatsappPlaceholder: "رقم الهاتف...",
    condition: "الحالة الطبية",
    conditionPlaceholder: "مثال: جراحة القلب",
    humanCheck: "تحقق بشري: {num1} + {num2} = ؟",
    answerPlaceholder: "الإجابة",
    btnSending: "جارٍ الإرسال...",
    btnComplete: "إكمال الاستفسار",
    successMsg: "شكراً لك! تم إرسال استفسارك. سنتصل بك قريباً.",
    errorMath: "إجابة رياضية غير صحيحة. يرجى المحاولة مرة أخرى.",
    errorGeneric: "حدث خطأ ما. يرجى المحاولة مرة أخرى."
  },
  search: {
    placeholder: "البحث عن طريق العلاج...",
    filterDest: "تصفية حسب الوجهة",
    btnFind: "البحث عن مستشفى"
  },
  howItWorks: {
    badge: "كيف يعمل",
    title: "رحلتك إلى الشفاء",
    subtitle: "نحن نتعامل مع كل شيء، حتى تتمكن من التركيز على الشفاء. إرشادات خطوة بخطوة.",
    step1Title: "1. الاستشارة",
    step1Desc: "أرسل تقاريرك الطبية لتقييم مجاني من قبل المتخصصين الشركاء لنا.",
    step2Title: "2. السفر والتأشيرة",
    step2Desc: "نحن ننظم رحلتك بأكملها، بما في ذلك رسائل التأشيرة ورحلات الطيران والإقامة.",
    step3Title: "3. العلاج",
    step3Desc: "احصل على رعاية عالمية المستوى في أفضل المستشفيات المعتمدة مع مترجمين مخصصين.",
    step4Title: "4. التعافي",
    step4Desc: "تمتع بتعافي آمن ومتابعة مستمرة بعد العلاج في بلدك."
  },
  packages: {
    badge: "رعاية صحية منسقة",
    title: "الباقات الطبية الترويجية",
    subtitle: "حزم رعاية صحية شاملة مصممة لراحة بالك.",
    btnExplore: "استكشاف جميع الباقات",
    offer: "عرض",
    priceLabel: "سعر الباقة"
  },
  hospitals: {
    title: "مستشفيات النخبة المعتمدة",
    subtitle: "مراكز التميز العالمية الحاصلة على شهادات JCI و ISO، والمختارة خصيصًا لمرضانا الأفارقة.",
    btnDetails: "عرض التفاصيل"
  },
  destinations: {
    title: "أفضل الوجهات الطبية",
    subtitle: "جرب الرعاية العالمية في المراكز الطبية الرائدة في العالم مع دعم الكونسيرج الكامل.",
    btnExplore: "استكشاف العلاجات"
  },
  treatments: {
    badge: "مراكز التميز",
    title: "العلاجات المتخصصة",
    startingAt: "تبدأ من",
    btnViewAll: "عرض جميع التخصصات (30+)"
  },
  stories: {
    badge: "تجارب حقيقية",
    title: "قصص المرضى والجولات الافتراضية",
    subtitle: "استمع إلى عائلات من جميع أنحاء إفريقيا اختاروا CureSureMedico لعلاجاتهم التي غيرت حياتهم. قم بجولة افتراضية في منشآتنا الشريكة المعتمدة من JCI.",
    btnWatchAll: "شاهد جميع الشهادات",
    close: "إغلاق"
  },
  advantage: {
    title: "ميزة CureSureMedico",
    adv1Title: "مستشفيات معتمدة من JCI وموثقة",
    adv1Desc: "نحن نتشارك فقط مع المستشفيات التي تفي بالمعيار الذهبي للرعاية الصحية الدولية. يتم فحص كل منشأة شخصيًا من قبل مجلسنا الطبي.",
    adv2Title: "تسعير شفاف",
    adv2Desc: "لا توجد تكاليف خفية. احصل على عروض أسعار طبية مفصلة وتحليل مالي قبل مغادرة بلدك الأصلي.",
    adv3Title: "شبكة الدعم في إفريقيا",
    adv3Desc: "مكاتب دعم محلية في لاغوس ونيروبي وأديس أبابا لتنسيق سلس قبل السفر.",
    adv4Title: "مدير حالة مخصص على مدار 24/7",
    adv4Desc: "المدافع الشخصي الخاص بك في المستشفى الذي يتحدث لغتك ويفهم احتياجاتك الثقافية.",
    adv4Item1: "دعم بجانب السرير 24/7",
    adv4Item2: "المساعدة اللغوية",
    adv4Item3: "تخطيط الخروج"
  }
};

addHomeTranslations('en', enHome);
addHomeTranslations('fr', frHome);
addHomeTranslations('ar', arHome);

console.log('Translations added successfully.');
