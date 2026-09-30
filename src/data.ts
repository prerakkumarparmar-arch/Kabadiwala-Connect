import { PriceItem, StepItem, FeatureItem, RecyclerPartner, MockLot } from './types';

export const TODAY_PRICES: PriceItem[] = [
  {
    id: 'copper-cable',
    name: 'Copper Cable',
    nameHi: 'कॉपर केबल (तांबा तार)',
    nameMr: 'तांब्याची केबल (कॉपर वायर)',
    category: 'Cables & Wiring',
    priceRange: '₹68–₹76/kg',
    minPrice: 68,
    maxPrice: 76,
    unit: 'kg',
    trend: 'up',
    trendText: '+₹2.5/kg this week',
    gradeNotes: 'Insulated telecom & domestic copper wire, stripped or mixed',
    iconType: 'cable'
  },
  {
    id: 'pcb',
    name: 'PCB',
    nameHi: 'पीसीबी (सर्किट बोर्ड)',
    nameMr: 'पीसीबी (सर्किट बोर्ड)',
    category: 'Circuit Boards',
    priceRange: '₹140–₹165/kg',
    minPrice: 140,
    maxPrice: 165,
    unit: 'kg',
    trend: 'up',
    trendText: '+₹5.0/kg this week',
    gradeNotes: 'Motherboards, mobile boards, green/blue telecom circuits without heavy chassis',
    iconType: 'pcb'
  },
  {
    id: 'battery',
    name: 'Battery',
    nameHi: 'बैटरी (ली-आयन / लेड-एसिड)',
    nameMr: 'बॅटरी (ली-आयन / लेड-अॅसिड)',
    category: 'Energy Storage',
    priceRange: '₹60–₹70/kg',
    minPrice: 60,
    maxPrice: 70,
    unit: 'kg',
    trend: 'stable',
    trendText: 'Stable market rate',
    gradeNotes: 'Intact lithium phone/laptop cells & sealed lead batteries (non-leaking)',
    iconType: 'battery'
  },
  // Additional extended prices available when user clicks "View All Prices"
  {
    id: 'al-heatsink',
    name: 'Aluminium Heat Sinks',
    nameHi: 'एल्यूमीनियम हीट सिंक',
    nameMr: 'अ‍ॅल्युमिनियम हीट सिंक',
    category: 'Metals',
    priceRange: '₹110–₹128/kg',
    minPrice: 110,
    maxPrice: 128,
    unit: 'kg',
    trend: 'stable',
    trendText: 'Stable',
    gradeNotes: 'Clean server & CPU extruded heatsinks without iron pins',
    iconType: 'metal'
  },
  {
    id: 'smps-power',
    name: 'SMPS Power Supply',
    nameHi: 'एसएमपीएस पावर सप्लाई',
    nameMr: 'एसएमपीएस पॉवर सप्लाय',
    category: 'Components',
    priceRange: '₹34–₹42/kg',
    minPrice: 34,
    maxPrice: 42,
    unit: 'kg',
    trend: 'up',
    trendText: '+₹1.5/kg',
    gradeNotes: 'Desktop computer power supplies with wires intact',
    iconType: 'mixed'
  },
  {
    id: 'mixed-escrap',
    name: 'Mixed Shredder E-Scrap',
    nameHi: 'मिश्रित ई-कचरा (मिक्स्ड)',
    nameMr: 'मिश्र ई-कचरा',
    category: 'Bulk Unsorted',
    priceRange: '₹28–₹36/kg',
    minPrice: 28,
    maxPrice: 36,
    unit: 'kg',
    trend: 'stable',
    trendText: 'Fair lot benchmark',
    gradeNotes: 'Printers, DVD players, modems, plastic-metal mixed housings',
    iconType: 'mixed'
  },
  {
    id: 'ram-goldpins',
    name: 'RAM & Gold Finger Pins',
    nameHi: 'रैम व गोल्ड पिन चिप्स',
    nameMr: 'रॅम व गोल्ड पिन चिप्स',
    category: 'High Grade PCB',
    priceRange: '₹850–₹1,150/kg',
    minPrice: 850,
    maxPrice: 1150,
    unit: 'kg',
    trend: 'up',
    trendText: '+₹40/kg',
    gradeNotes: 'High-density gold plated memory sticks (DDR2/3/4/5)',
    iconType: 'pcb'
  }
];

export const WORKFLOW_STEPS: StepItem[] = [
  {
    number: 1,
    title: 'Create a Lot',
    titleHi: 'लॉट बनाएं (सामग्री चुनें)',
    titleMr: 'लॉट तयार करा (वस्तू निवडा)',
    description: 'Group your collected cables, boards, or batteries into a simple lot with estimated weight.',
    descriptionHi: 'अपने एकत्रित तार, सर्किट बोर्ड या बैटरियों को अनुमानित वजन के साथ एक लॉट में जोड़ें।',
    descriptionMr: 'गोळा केलेल्या केबल्स, सर्किट बोर्ड किंवा बॅटऱ्या अंदाजे वजनासह एका लॉटमध्ये जोडा.',
    iconName: 'PackagePlus',
    detailHint: 'Takes less than 60 seconds on mobile'
  },
  {
    number: 2,
    title: 'Check Fair Value',
    titleHi: 'उचित मूल्य जानें',
    titleMr: 'योग्य किंमत तपासा',
    description: 'View estimated fair prices and indicative market price ranges for your selected location.',
    descriptionHi: 'अपने चुने गए स्थान के लिए अनुमानित उचित मूल्य और सांकेतिक बाजार दरें देखें।',
    descriptionMr: 'निवडलेल्या ठिकाणासाठी अंदाजे योग्य दर आणि बाजारभाव श्रेणी तपासा.',
    iconName: 'TrendingUp',
    detailHint: 'Transparent Price Comparison'
  },
  {
    number: 3,
    title: 'Compare Authorized Recyclers',
    titleHi: 'अधिकृत रीसायकलर्स की तुलना करें',
    titleMr: 'अधिकृत रिसायकलर्सची तुलना करा',
    description: 'Connect directly with authorized recycling facilities offering pickup or center handover.',
    descriptionHi: 'अधिकृत रीसाइक्लिंग केंद्रों से सीधे जुड़ें और हैंडओवर या पिकअप विकल्प देखें।',
    descriptionMr: 'मान्यताप्राप्त परवानाधारक रिसायकलर्सकडून थेट ऑफर्स आणि पिकअप मिळवा.',
    iconName: 'ShieldCheck',
    detailHint: 'Recycler authorization status displayed'
  },
  {
    number: 4,
    title: 'Complete Handover',
    titleHi: 'सुरक्षित हैंडओवर पूरा करें',
    titleMr: 'सुरक्षित हस्तांतरण पूर्ण करा',
    description: 'Material is weighed on calibrated digital scales at your spot or center with clear digital slips.',
    descriptionHi: 'डिजिटल कांटे पर सही वजन और रसीद के साथ सुरक्षित व साफ सुथरा हैंडओवर करें।',
    descriptionMr: 'कॅलिब्रेटेड डिजिटल वजन काट्यावर पारदर्शक वजन आणि पावतीसह सुरक्षित हस्तांतरण.',
    iconName: 'Scale',
    detailHint: 'Digital weigh slip & transparent record'
  },
  {
    number: 5,
    title: 'Track Earnings',
    titleHi: 'कमाई और रिकॉर्ड ट्रैक करें',
    titleMr: 'कमाई आणि नोंदी ट्रॅक करा',
    description: 'Receive direct payout (Cash / UPI / Bank Transfer) and keep a transparent history of your sales in INR.',
    descriptionHi: 'सीधे नकद / यूपीआई / बैंक ट्रांसफर में भुगतान पाएं और अपनी कुल बिक्री का ब्योरा रखें।',
    descriptionMr: 'थेट रोख, यूपीआय किंवा बँक खात्यात रक्कम मिळवा आणि विक्रीचा इतिहास पाहा.',
    iconName: 'Wallet',
    detailHint: 'Instant receipt & direct payout in INR'
  }
];

export const CORE_FEATURES: FeatureItem[] = [
  {
    id: 'safe-handling',
    title: 'Safe Handling',
    titleHi: 'सुरक्षित रखरखाव (Safe Handling)',
    titleMr: 'सुरक्षित हाताळणी (Safe Handling)',
    description: 'Simple safety guidance to prevent health risks, chemical burns, and battery fire hazards. Protect your health while earning.',
    descriptionHi: 'धुएं, एसिड और बैटरी आग से बचाव के सरल सुरक्षा दिशा-निर्देश। स्वास्थ्य की सुरक्षा, पूरी कमाई।',
    descriptionMr: 'विषारी धूर, आम्ल आणि बॅटरीच्या आगीपासून संरक्षणासाठी साध्या सुरक्षा सूचना. आरोग्याची काळजी आणि मोबदला.',
    highlight: 'Never burn cables. Keep batteries safe.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'fair-pricing',
    title: 'Fair Pricing',
    titleHi: 'उचित व पारदर्शी मूल्य (Fair Pricing)',
    titleMr: 'योग्य व पारदर्शक दर (Fair Pricing)',
    description: 'Indicative market price ranges and estimated fair value based on material categories and clean recovery benchmarks.',
    descriptionHi: 'सामग्री श्रेणियों और धातु रिकवरी पर आधारित सांकेतिक बाजार दरें व अनुमानित उचित मूल्य।',
    descriptionMr: 'वस्तूंच्या प्रकारानुसार पारदर्शक दर श्रेणी आणि अंदाजे योग्य बाजारभाव.',
    highlight: 'Transparent Price Comparison with clear ranges.',
    iconName: 'BadgeIndianRupee'
  },
  {
    id: 'authorized-recyclers',
    title: 'Authorized Recyclers',
    titleHi: 'अधिकृत रीसायकलर्स (Authorized Recyclers)',
    titleMr: 'अधिकृत रिसायकलर्स (Authorized Recyclers)',
    description: 'Browse listings of authorized recyclers under India E-Waste Management Rules with transparent authorization status shown.',
    descriptionHi: 'भारत के ई-कचरा प्रबंधन नियमों के तहत अधिकृत रीसायकलर्स की सूची और स्थिति देखें।',
    descriptionMr: 'ई-कचरा व्यवस्थापन नियमांनुसार अधिकृत रिसायकलर्सची माहिती आणि परवाना स्थिती तपासा.',
    highlight: 'Recycler authorization status displayed.',
    iconName: 'Building2'
  },
  {
    id: 'traceable-handover',
    title: 'Traceable Handover',
    titleHi: 'ट्रेसेबल हैंडओवर (Traceable Handover)',
    titleMr: 'मागोवा घेण्यायोग्य हस्तांतरण (Traceable Handover)',
    description: 'Each lot receives a digital lot summary and weigh slip, ensuring clarity and an honest record for both parties.',
    descriptionHi: 'हर लॉट को डिजिटल वजन रसीद और ट्रैकिंग आईडी मिलती है, जिससे आपका लेन-देन स्पष्ट और सुरक्षित रहता है।',
    descriptionMr: 'प्रत्येक लॉटसाठी डिजिटल वजन पावती आणि ट्रॅकिंग आयडी, ज्यामुळे व्यवहार पारदर्शक राहतो.',
    highlight: 'Digital weigh slip & verifiable handover record.',
    iconName: 'FileCheck2'
  }
];

export const SAMPLE_RECYCLERS: RecyclerPartner[] = [
  {
    id: 'rec-1',
    name: 'EcoGreen Resources (Prototype Demo)',
    licenseNumber: 'SAMPLE-GPCB-001',
    facilityArea: 'Naroda Industrial Zone, Ahmedabad',
    rating: 4.9,
    dailyCapacity: '8,500 kg/day',
    materialsAccepted: ['PCB', 'Copper Cable', 'Lithium Batteries', 'SMPS'],
    verifiedBadges: ['Authorization Status Displayed', 'Digital Scale', 'Cash / UPI'],
    phone: '+91 98000 00001'
  },
  {
    id: 'rec-2',
    name: 'Clean Metal Dismantlers (Prototype Demo)',
    licenseNumber: 'SAMPLE-GPCB-002',
    facilityArea: 'Vatva Industrial Phase, Ahmedabad',
    rating: 4.8,
    dailyCapacity: '12,000 kg/day',
    materialsAccepted: ['Copper Cable', 'Aluminium Heatsinks', 'Transformers', 'Bulk Lots'],
    verifiedBadges: ['Direct Bank Transfer / Cash', 'Vehicle Pickup Support', 'Sample Listing'],
    phone: '+91 98000 00002'
  },
  {
    id: 'rec-3',
    name: 'Circular Materials Co. (Prototype Demo)',
    licenseNumber: 'SAMPLE-CPCB-003',
    facilityArea: 'Sanand Corridor, Ahmedabad',
    rating: 4.9,
    dailyCapacity: '6,000 kg/day',
    materialsAccepted: ['All Grades PCB', 'Cellular Batteries', 'Display Units', 'Server Scrap'],
    verifiedBadges: ['Competitive Grade Offer', 'Calibrated Scale Certified', 'Cash or Digital'],
    phone: '+91 98000 00003'
  }
];

export const RECENT_SAMPLE_LOTS: MockLot[] = [
  {
    id: 'LOT-DEMO-101',
    collectorName: 'Sample Collector 1',
    area: 'Sample Area 1',
    items: 'Copper Cables & 15 SMPS',
    weight: '38.5 kg',
    estValue: '₹2,840',
    postedAgo: '15 mins ago',
    status: 'Ready for Pickup'
  },
  {
    id: 'LOT-DEMO-102',
    collectorName: 'Sample Scrap Point',
    area: 'Sample Area 2',
    items: 'Mixed Motherboards & PCB',
    weight: '24.0 kg',
    estValue: '₹3,720',
    postedAgo: '40 mins ago',
    status: 'Under Offer'
  },
  {
    id: 'LOT-DEMO-103',
    collectorName: 'Sample Collector 2',
    area: 'Sample Area 3',
    items: 'Intact Battery Packs (Isolated)',
    weight: '16.2 kg',
    estValue: '₹1,050',
    postedAgo: '1 hour ago',
    status: 'Weighed & Certified'
  }
];

export const TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      howItWorks: 'How It Works',
      prices: "Today's Prices",
      findRecycler: 'Find Recycler',
      safetyGuide: 'Safety Guide',
      about: 'About',
      sellBtn: 'Sell Material'
    },
    hero: {
      title: 'E-Nexus',
      tagline: 'Fair Prices. Authorized Recyclers. Safe E-Waste.',
      description: 'A simple digital bridge connecting informal e-waste collectors with authorized recyclers.',
      ctaPrimary: 'Sell Material',
      ctaSecondary: 'View Today’s Prices',
      badgeStatus: 'India-Wide Platform · Sample Location: Ahmedabad',
      stat1Number: '₹68–₹165',
      stat1Label: 'Indicative Market Price Range',
      stat2Number: 'Listed',
      stat2Label: 'Authorized Recycler Listings',
      stat3Number: 'Clear',
      stat3Label: 'Transparent Price Comparison'
    },
    roles: {
      title: 'Choose How You Want to Participate',
      subtitle: 'E-Nexus supports both frontline collectors and authorized recyclers across India.',
      role1Title: 'Collector / Kabadiwala',
      role1Desc: 'Check fair prices, sell collected material and connect with authorized recyclers.',
      role1Btn: 'Continue as Collector',
      role1Badges: ['Indicative Local Rates', 'Cash / UPI / Bank Transfer', 'Pickup or Center Drop-off'],
      role2Title: 'Recycler / Aggregator',
      role2Desc: 'View material lots, send offers and manage traceable handovers.',
      role2Btn: 'Continue as Recycler',
      role2Badges: ['Verified Sourcing', 'Traceable Manifests', 'Transparent INR Transactions']
    },
    howItWorks: {
      title: 'How E-Nexus Works',
      subtitle: '5 simple steps designed for simple mobile usage and transparent transactions.'
    },
    features: {
      title: 'Built for Safety, Dignity & Compliance',
      subtitle: 'Connecting the informal e-scrap community with formal authorized recycling channels.'
    },
    prices: {
      title: "Today’s Prices",
      subtitle: 'Indicative market price ranges for common e-waste grades. Prototype sample rates – not live market quotations.',
      cityBadge: 'Sample Location',
      viewAllBtn: 'View All Prices',
      sellThis: 'Sell This'
    },
    finalCta: {
      heading: 'Have material ready to sell?',
      subheading: 'Get honest weights, transparent prices, and connect with nearby authorized recyclers.',
      button: 'Sell Material',
      hotline: 'A simple digital bridge connecting informal collectors with formal authorized recycling channels across India.'
    }
  },
  hi: {
    nav: {
      home: 'होम',
      howItWorks: 'यह कैसे काम करता है',
      prices: 'आज के भाव',
      findRecycler: 'रीसायकलर खोजें',
      safetyGuide: 'सुरक्षा मार्गदर्शिका',
      about: 'हमारे बारे में',
      sellBtn: 'सामग्री बेचें'
    },
    hero: {
      title: 'E-Nexus',
      tagline: 'उचित मूल्य। अधिकृत रीसायकलर्स। सुरक्षित ई-कचरा।',
      description: 'कबाड़ियों और अनौपचारिक ई-कचरा संग्राहकों को अधिकृत रीसायकलर्स से जोड़ने वाला एक सरल डिजिटल सेतु।',
      ctaPrimary: 'सामग्री बेचें',
      ctaSecondary: 'आज के भाव देखें',
      badgeStatus: 'अखिल भारतीय मंच · डेमो स्थान: अहमदाबाद',
      stat1Number: '₹68–₹165',
      stat1Label: 'सांकेतिक बाजार दर दायरा',
      stat2Number: 'सूचीबद्ध',
      stat2Label: 'अधिकृत रीसायकलर सूची',
      stat3Number: 'स्पष्ट',
      stat3Label: 'पारदर्शी मूल्य तुलना'
    },
    roles: {
      title: 'अपनी भूमिका चुनें',
      subtitle: 'ई-नेक्सस संग्राहकों और अधिकृत रीसायकलर दोनों के लिए सरल मंच प्रदान करता है।',
      role1Title: 'कलेक्टर / कबाड़ीवाला',
      role1Desc: 'उचित भाव जांचें, एकत्र की गई सामग्री बेचें और अधिकृत रीसायकलर्स से सीधे जुड़ें।',
      role1Btn: 'कलेक्टर के रूप में आगे बढ़ें',
      role1Badges: ['स्थानीय सांकेतिक भाव', 'नकद / यूपीआई / बैंक ट्रांसफर', 'पिकअप या सेंटर ड्रॉप-ऑफ'],
      role2Title: 'रीसायकलर / एग्रीगेटर',
      role2Desc: 'सामग्री लॉट देखें, ऑफर भेजें और ट्रेसेबल हैंडओवर प्रबंधित करें।',
      role2Btn: 'रीसायकलर के रूप में आगे बढ़ें',
      role2Badges: ['प्रमाणित सोर्सिंग', 'डिजिटल रसीद', 'पारदर्शी INR लेनदेन']
    },
    howItWorks: {
      title: 'E-Nexus कैसे काम करता है',
      subtitle: 'सरल मोबाइल उपयोग और निष्पक्ष व्यापार के लिए 5 आसान चरण।'
    },
    features: {
      title: 'सुरक्षा, सम्मान और पारदर्शिता',
      subtitle: 'अनौपचारिक कबाड़ क्षेत्र को औपचारिक अधिकृत रीसाइक्लिंग चैनलों से जोड़ना।'
    },
    prices: {
      title: 'आज के भाव',
      subtitle: 'सामान्य ई-कचरा श्रेणियों के लिए सांकेतिक बाजार दरें। प्रोटोटाइप नमूना दरें – लाइव बाजार उद्धरण नहीं।',
      cityBadge: 'नमूना स्थान',
      viewAllBtn: 'सभी भाव देखें',
      sellThis: 'यह सामग्री बेचें'
    },
    finalCta: {
      heading: 'क्या आपके पास बेचने के लिए सामग्री तैयार है?',
      subheading: 'सही वजन, पारदर्शी दाम और सीधे पास के अधिकृत रीसायकलर्स से जुड़ें।',
      button: 'सामग्री बेचें',
      hotline: 'पूरे भारत में अनौपचारिक संग्राहकों को अधिकृत रीसाइक्लिंग चैनलों से जोड़ने वाला सरल डिजिटल सेतु।'
    }
  },
  mr: {
    nav: {
      home: 'मुख्यपृष्ठ',
      howItWorks: 'कसे कार्य करते',
      prices: 'आजचे दर',
      findRecycler: 'रिसायकलर शोधा',
      safetyGuide: 'सुरक्षा मार्गदर्शक',
      about: 'आमच्याबद्दल',
      sellBtn: 'माल विका'
    },
    hero: {
      title: 'E-Nexus',
      tagline: 'योग्य भाव. अधिकृत रिसायकलर्स. सुरक्षित ई-कचरा.',
      description: 'अनौपचारिक ई-कचरा संकलक (कबाडीवाले) आणि अधिकृत रिसायकलर्स यांना जोडणारा एक सोपा डिजिटल सेतू.',
      ctaPrimary: 'माल विका',
      ctaSecondary: 'आजचे भाव तपासा',
      badgeStatus: 'अखिल भारतीय मंच · नमुना ठिकाण: अहमदाबाद',
      stat1Number: '₹68–₹165',
      stat1Label: 'सांकेतिक बाजारभाव श्रेणी',
      stat2Number: 'सूचीबद्ध',
      stat2Label: 'अधिकृत रिसायकलर यादी',
      stat3Number: 'स्पष्ट',
      stat3Label: 'पारदर्शक दर तुलना'
    },
    roles: {
      title: 'तुमची भूमिका निवडा',
      subtitle: 'ई-नेक्सस संकलक आणि परवानाधारक रिसायकलर्स दोघांसाठी पारदर्शक व्यासपीठ देते.',
      role1Title: 'कलेक्टर / कबाडीवाला',
      role1Desc: 'योग्य दर तपासा, गोळा केलेला माल विका आणि थेट अधिकृत रिसायकलर्सशी संपर्क साधा.',
      role1Btn: 'कलेक्टर म्हणून पुढे जा',
      role1Badges: ['स्थानिक थेट दर', 'रोख / यूपीआय / बँक ट्रान्सफर', 'पिकअप किंवा सेंटर ड्रॉप-ऑफ'],
      role2Title: 'रिसायकलर / अ‍ॅग्रीगेटर',
      role2Desc: 'उपलब्ध लॉट तपासा, खरेदी ऑफर पाठवा आणि पारदर्शक वजन हस्तांतरण व्यवस्थापित करा.',
      role2Btn: 'रिसायकलर म्हणून पुढे जा',
      role2Badges: ['नोंदणीकृत पुरवठा', 'डिजिटल पावती', 'पारदर्शक INR व्यवहार']
    },
    howItWorks: {
      title: 'E-Nexus कसे कार्य करते',
      subtitle: 'सोप्या मोबाईल वापरासाठी आणि पारदर्शक व्यवहारासाठी ५ टप्पे.'
    },
    features: {
      title: 'सुरक्षितता, सन्मान आणि पारदर्शकता',
      subtitle: 'अनौपचारिक ई-कचरा संकलनाला औपचारिक अधिकृत रिसायकलिंगशी जोडणे.'
    },
    prices: {
      title: 'आजचे दर',
      subtitle: 'सामान्य ई-कचरा प्रकारांसाठी सांकेतिक बाजारभाव श्रेणी. प्रोटोटाइप नमुना दर – थेट बाजाराचे कोटेशन्स नाहीत.',
      cityBadge: 'नमुना ठिकाण',
      viewAllBtn: 'सर्व दर तपासा',
      sellThis: 'हा माल विका'
    },
    finalCta: {
      heading: 'तुमच्याकडे विकण्यासाठी माल तयार आहे का?',
      subheading: 'अधिकृत रिसायकलर्सकडून खरे वजन, पारदर्शक दर आणि सुलभ हस्तांतरण मिळवा.',
      button: 'माल विका',
      hotline: 'संपूर्ण भारतात अनौपचारिक संकलकांना अधिकृत रिसायकलिंग चॅनेलशी जोडणारा डिजिटल सेतू.'
    }
  }
};
