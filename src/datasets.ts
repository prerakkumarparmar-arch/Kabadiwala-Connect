/**
 * ============================================================================
 * Kabadiwala Connect — Datasets Architecture (Smart India Hackathon 2026)
 * ============================================================================
 *
 * Government Problem Statement:
 * Establishing structured, verifiable datasets to bridge informal scrap collectors
 * (Kabadiwalas) with formal, registered e-waste recyclers under the Extended
 * Producer Responsibility (EPR) and E-Waste (Management) Rules.
 *
 * This file contains the complete TypeScript interfaces and production-grade
 * mock datasets for the 6 mandatory data schemas:
 * 1. Material Dataset
 * 2. Price Dataset
 * 3. Recycler Dataset
 * 4. Transaction Dataset
 * 5. Traceability Dataset
 * 6. Collector Dataset
 */

// ============================================================================
// 1. MATERIAL DATASET INTERFACES & MOCK DATA
// ============================================================================

export type MaterialCategory = 'PCBs' | 'Cables' | 'Batteries' | 'CRT' | 'Appliance' | 'Screens';
export type MaterialCondition = 'Intact' | 'Semi-Dismantled' | 'Scrap Fragments' | 'Burned' | 'Mixed';

export interface MaterialItem {
  id: string;
  category: MaterialCategory;
  subCategory: string;
  description: string;
  imageUrl: string;
  approximateWeight: number; // in kg or piece equivalent
  condition: MaterialCondition;
  sourceID: string; // Origin reference e.g., 'SRC-MUM-DHARAVI-01'
  estimatedValue: number; // Base valuation in INR
  unit: 'kg' | 'pieces';
  hazardousLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  nameVernacular: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const mockMaterialDataset: MaterialItem[] = [
  {
    id: 'MAT-PCB-001',
    category: 'PCBs',
    subCategory: 'High-Grade Telecom & Computer Motherboards',
    description: 'Gold and silver plated printed circuit boards salvaged from desktops, servers, and telecom switches.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    approximateWeight: 0.65,
    condition: 'Intact',
    sourceID: 'SRC-MUM-KURLA-04',
    estimatedValue: 360,
    unit: 'kg',
    hazardousLevel: 'MEDIUM',
    nameVernacular: {
      en: 'Computer Motherboard / Server PCB',
      hi: 'कंप्यूटर मदरबोर्ड / पीसीबी प्लेट',
      mr: 'संगणक मदरबोर्ड / सर्किट प्लेट'
    }
  },
  {
    id: 'MAT-CAB-002',
    category: 'Cables',
    subCategory: 'Insulated Copper Power Harnesses',
    description: 'Heavy gauge copper wiring from household demolition, industrial panels, and discarded server racks.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    approximateWeight: 1.0,
    condition: 'Intact',
    sourceID: 'SRC-MUM-DHARAVI-12',
    estimatedValue: 460,
    unit: 'kg',
    hazardousLevel: 'LOW',
    nameVernacular: {
      en: 'Heavy Copper Cable / Wiring Harness',
      hi: 'मोटा तांबे का केबल वायर',
      mr: 'जाड तांब्याची वायर / केबल्स'
    }
  },
  {
    id: 'MAT-BAT-003',
    category: 'Batteries',
    subCategory: 'Lithium-Ion Pouch & Cylindrical 18650 Cells',
    description: 'Rechargeable battery packs extracted from defunct laptops, smartphones, and electric two-wheelers.',
    imageUrl: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
    approximateWeight: 0.08,
    condition: 'Semi-Dismantled',
    sourceID: 'SRC-PUN-PIMPRI-07',
    estimatedValue: 150,
    unit: 'kg',
    hazardousLevel: 'CRITICAL',
    nameVernacular: {
      en: 'Smartphone & Laptop Li-ion Battery',
      hi: 'मोबाइल व लैपटॉप ली-आयन बैटरी',
      mr: 'मोबाईल आणि लॅपटॉप ली-आयन बॅटरी'
    }
  },
  {
    id: 'MAT-CRT-004',
    category: 'CRT',
    subCategory: 'Cathode Ray Tube Glass with Lead Funnel',
    description: 'Legacy bulky television and oscilloscope monitor funnels containing high leaded silicate glass.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    approximateWeight: 12.0,
    condition: 'Intact',
    sourceID: 'SRC-THN-BHIWANDI-02',
    estimatedValue: 35,
    unit: 'kg',
    hazardousLevel: 'HIGH',
    nameVernacular: {
      en: 'CRT Monitor & Old TV Glass',
      hi: 'सीआरटी मॉनिटर व पुराना टीवी कांच',
      mr: 'सीआरटी मॉनिटर आणि जुना टीव्ही'
    }
  },
  {
    id: 'MAT-APP-005',
    category: 'Appliance',
    subCategory: 'Sealed Refrigerator & AC Compressors',
    description: 'Hermetically sealed iron motor housings with high-grade copper windings and internal pump mechanisms.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    approximateWeight: 9.5,
    condition: 'Intact',
    sourceID: 'SRC-MUM-ANDHERI-09',
    estimatedValue: 75,
    unit: 'kg',
    hazardousLevel: 'MEDIUM',
    nameVernacular: {
      en: 'Fridge / AC Motor Compressor',
      hi: 'फ्रिज व एसी कंप्रेसर मोटर',
      mr: 'फ्रिज आणि एसी कॉम्प्रेसर मोटर'
    }
  },
  {
    id: 'MAT-SCR-006',
    category: 'Screens',
    subCategory: 'Flat Panel Backlit LCD & LED Assemblies',
    description: 'Cracked or non-functional flat screens requiring specialized mercury cold-cathode fluorescent lamp handling.',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    approximateWeight: 4.2,
    condition: 'Scrap Fragments',
    sourceID: 'SRC-NAVI-VASHI-03',
    estimatedValue: 55,
    unit: 'kg',
    hazardousLevel: 'HIGH',
    nameVernacular: {
      en: 'Flat Panel LED / LCD Displays',
      hi: 'फ्लैट कंप्यूटर स्क्रीन / डिस्प्ले',
      mr: 'फ्लॅट कॉम्प्युटर स्क्रीन पॅनेल'
    }
  }
];

// ============================================================================
// 2. PRICE DATASET INTERFACES & MOCK DATA
// ============================================================================

export interface HistoricalPriceTrendPoint {
  date: string;
  price: number;
  marketVolumeKg: number;
}

export interface PriceRecord {
  materialId: string;
  category: MaterialCategory;
  location: string;
  timestamp: string;
  buyingPrice: number; // Current spot rate in INR
  quotedPrice: number; // Typical broker quoted benchmark
  unit: 'kg' | 'pieces';
  recyclerName: string;
  historicalTrend: HistoricalPriceTrendPoint[];
}

export const mockPriceDataset: PriceRecord[] = [
  {
    materialId: 'MAT-PCB-001',
    category: 'PCBs',
    location: 'Maharashtra - Mumbai / Thane Cluster',
    timestamp: '2026-09-20T08:30:00Z',
    buyingPrice: 360,
    quotedPrice: 385,
    unit: 'kg',
    recyclerName: 'Maharashtra Eco-Smart Recovery Hub (MPCB/EPR)',
    historicalTrend: [
      { date: '2026-09-14', price: 340, marketVolumeKg: 1200 },
      { date: '2026-09-16', price: 348, marketVolumeKg: 1450 },
      { date: '2026-09-18', price: 355, marketVolumeKg: 1380 },
      { date: '2026-09-20', price: 360, marketVolumeKg: 1620 }
    ]
  },
  {
    materialId: 'MAT-CAB-002',
    category: 'Cables',
    location: 'Maharashtra - Mumbai / Dharavi Hub',
    timestamp: '2026-09-20T08:30:00Z',
    buyingPrice: 460,
    quotedPrice: 495,
    unit: 'kg',
    recyclerName: 'Bharat Copper & Refining Industries',
    historicalTrend: [
      { date: '2026-09-14', price: 440, marketVolumeKg: 2800 },
      { date: '2026-09-16', price: 450, marketVolumeKg: 3100 },
      { date: '2026-09-18', price: 455, marketVolumeKg: 2950 },
      { date: '2026-09-20', price: 460, marketVolumeKg: 3400 }
    ]
  },
  {
    materialId: 'MAT-BAT-003',
    category: 'Batteries',
    location: 'Maharashtra - Pune / Pimpri Auto Cluster',
    timestamp: '2026-09-20T08:30:00Z',
    buyingPrice: 150,
    quotedPrice: 175,
    unit: 'kg',
    recyclerName: 'Sahyadri Hazardous E-Waste Solutions',
    historicalTrend: [
      { date: '2026-09-14', price: 142, marketVolumeKg: 850 },
      { date: '2026-09-16', price: 145, marketVolumeKg: 910 },
      { date: '2026-09-18', price: 148, marketVolumeKg: 890 },
      { date: '2026-09-20', price: 150, marketVolumeKg: 1100 }
    ]
  },
  {
    materialId: 'MAT-CRT-004',
    category: 'CRT',
    location: 'Maharashtra - Bhiwandi Logistics Corridor',
    timestamp: '2026-09-20T08:30:00Z',
    buyingPrice: 35,
    quotedPrice: 42,
    unit: 'kg',
    recyclerName: 'Western India Safe Disposal & Smelting',
    historicalTrend: [
      { date: '2026-09-14', price: 38, marketVolumeKg: 450 },
      { date: '2026-09-16', price: 36, marketVolumeKg: 420 },
      { date: '2026-09-18', price: 35, marketVolumeKg: 390 },
      { date: '2026-09-20', price: 35, marketVolumeKg: 510 }
    ]
  },
  {
    materialId: 'MAT-APP-005',
    category: 'Appliance',
    location: 'Maharashtra - Mumbai Suburban',
    timestamp: '2026-09-20T08:30:00Z',
    buyingPrice: 75,
    quotedPrice: 85,
    unit: 'kg',
    recyclerName: 'Metro Green Aggregators LLP',
    historicalTrend: [
      { date: '2026-09-14', price: 72, marketVolumeKg: 3200 },
      { date: '2026-09-16', price: 74, marketVolumeKg: 3400 },
      { date: '2026-09-18', price: 74, marketVolumeKg: 3100 },
      { date: '2026-09-20', price: 75, marketVolumeKg: 3800 }
    ]
  }
];

// ============================================================================
// 3. RECYCLER DATASET INTERFACES & MOCK DATA
// ============================================================================

export interface RecyclerContactInfo {
  phone: string;
  email: string;
  contactPerson: string;
  whatsappNumber?: string;
}

export interface RecyclerFacility {
  recyclerId: string;
  facilityName: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    gpsCoordinates: {
      latitude: number;
      longitude: number;
    };
  };
  materialsAccepted: MaterialCategory[];
  authorizationDetails: string; // MPCB / CPCB EPR License Registration number
  authorizationStatus: 'VERIFIED' | 'PENDING';
  contactInfo: RecyclerContactInfo;
  offeredRate: Record<string, number>; // Maps material category or ID to default offer in INR/kg
  pickupAvailability: boolean;
  serviceArea: string; // Description of service boundary & radius
  dailyCapacityTons: number;
  instantDigitalPaymentEnabled: boolean;
}

export const mockRecyclerDataset: RecyclerFacility[] = [
  {
    recyclerId: 'REC-MH-BHIWANDI-01',
    facilityName: 'Maharashtra Eco-Smart Recovery Hub',
    location: {
      address: 'Gala 14-18, Mankoli Logistic Park, Dapoda Road, Bhiwandi',
      city: 'Bhiwandi (Thane)',
      state: 'Maharashtra',
      pincode: '421302',
      gpsCoordinates: {
        latitude: 19.2968,
        longitude: 73.0631
      }
    },
    materialsAccepted: ['PCBs', 'Cables', 'Batteries', 'Screens'],
    authorizationDetails: 'MPCB/RO-THANE/E-WASTE/REG/2024/0819',
    authorizationStatus: 'VERIFIED',
    contactInfo: {
      phone: '+91 22 2844 9100',
      email: 'operations@ecosmartmaharashtra.in',
      contactPerson: 'Sanjay Tukaram Jadhav',
      whatsappNumber: '+91 98201 44512'
    },
    offeredRate: {
      PCBs: 385,
      Cables: 490,
      Batteries: 170,
      Screens: 60
    },
    pickupAvailability: true,
    serviceArea: 'Greater Mumbai, Navi Mumbai, Thane & Bhiwandi Industrial belt (50 km radius)',
    dailyCapacityTons: 15.0,
    instantDigitalPaymentEnabled: true
  },
  {
    recyclerId: 'REC-MH-DHARAVI-02',
    facilityName: 'Bharat Copper & Circular Refining Hub',
    location: {
      address: 'Plot 72, 90 Feet Road, Near Kamraj Memorial, Dharavi',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400017',
      gpsCoordinates: {
        latitude: 19.0434,
        longitude: 72.8562
      }
    },
    materialsAccepted: ['Cables', 'Appliance', 'PCBs'],
    authorizationDetails: 'CPCB/EPR-MUM/CIRCULAR/2023/4102',
    authorizationStatus: 'VERIFIED',
    contactInfo: {
      phone: '+91 98192 33410',
      email: 'intake@bharatcopperrefining.com',
      contactPerson: 'Arif Mohammad Khan',
      whatsappNumber: '+91 98192 33410'
    },
    offeredRate: {
      Cables: 495,
      Appliance: 85,
      PCBs: 375
    },
    pickupAvailability: false, // Walk-in aggregation yard with certified digital scales
    serviceArea: 'Dharavi, Sion, Kurla, Bandra & Central Mumbai aggregation wards',
    dailyCapacityTons: 8.5,
    instantDigitalPaymentEnabled: true
  },
  {
    recyclerId: 'REC-MH-PUNE-03',
    facilityName: 'Sahyadri Hazardous E-Waste Solutions',
    location: {
      address: 'Plot F-9, MIDC Industrial Area, Bhosari, Pimpri-Chinchwad',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411026',
      gpsCoordinates: {
        latitude: 18.6275,
        longitude: 73.8441
      }
    },
    materialsAccepted: ['Batteries', 'PCBs', 'CRT', 'Screens'],
    authorizationDetails: 'MPCB/PUNE/HAZ-WASTE/2024/1109',
    authorizationStatus: 'VERIFIED',
    contactInfo: {
      phone: '+91 20 2712 8900',
      email: 'compliance@sahyadri-ewaste.org',
      contactPerson: 'Dr. Anand Deshpande',
      whatsappNumber: '+91 94220 18944'
    },
    offeredRate: {
      Batteries: 175,
      PCBs: 390,
      CRT: 42,
      Screens: 65
    },
    pickupAvailability: true,
    serviceArea: 'Pune Metropolitan Region, Pimpri-Chinchwad, Talegaon & Chakan (70 km radius)',
    dailyCapacityTons: 20.0,
    instantDigitalPaymentEnabled: true
  },
  {
    recyclerId: 'REC-MH-TURBHE-04',
    facilityName: 'Navi Mumbai Green Tech Processors',
    location: {
      address: 'TTC Industrial Area, MIDC Turbhe, Navi Mumbai',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400705',
      gpsCoordinates: {
        latitude: 19.0760,
        longitude: 73.0125
      }
    },
    materialsAccepted: ['PCBs', 'Cables', 'Appliance', 'CRT'],
    authorizationDetails: 'MPCB/EPR-RENEW/2025/0024',
    authorizationStatus: 'PENDING',
    contactInfo: {
      phone: '+91 22 2761 4050',
      email: 'contact@navimumbaigreentech.in',
      contactPerson: 'Milind Sawant'
    },
    offeredRate: {
      PCBs: 360,
      Cables: 460,
      Appliance: 75,
      CRT: 35
    },
    pickupAvailability: true,
    serviceArea: 'Navi Mumbai, Panvel, Vashi & Belapur belts',
    dailyCapacityTons: 6.0,
    instantDigitalPaymentEnabled: false
  }
];

// ============================================================================
// 4. TRANSACTION DATASET INTERFACES & MOCK DATA
// ============================================================================

export interface TransactionRecord {
  lotId: string;
  collectorId: string;
  materialCategory: MaterialCategory;
  quantityWeight: number; // in kg or units
  quotedPrice: number; // Base rate offered prior to scale inspection (INR/kg)
  finalPrice: number; // Settled rate post calibration check (INR/kg)
  recyclerId: string;
  collectionLocation: string;
  handoverLocation: string;
  dateTime: string;
  paymentStatus: 'PAID' | 'PENDING';
  transactionStatus: 'COMPLETED' | 'PENDING_PICKUP';
  grossAmountInr: number;
  eprBonusInr: number;
  netDisbursedInr: number;
  paymentMode: 'UPI' | 'DIRECT_IMPS' | 'CASH_VOUCHER';
  payoutTxnRef?: string;
}

export const mockTransactionDataset: TransactionRecord[] = [
  {
    lotId: 'LOT-MUM-2026-081',
    collectorId: 'COL-MUM-7701',
    materialCategory: 'PCBs',
    quantityWeight: 38.5,
    quotedPrice: 360,
    finalPrice: 375,
    recyclerId: 'REC-MH-BHIWANDI-01',
    collectionLocation: 'Dharavi 90-Feet Transit Shed, Mumbai',
    handoverLocation: 'Maharashtra Eco-Smart Hub, Bhiwandi Scale #2',
    dateTime: '2026-09-18T14:40:00Z',
    paymentStatus: 'PAID',
    transactionStatus: 'COMPLETED',
    grossAmountInr: 14437.5,
    eprBonusInr: 1155, // Government EPR incentive
    netDisbursedInr: 15592.5,
    paymentMode: 'UPI',
    payoutTxnRef: 'UPI/626118491022/OKSBI'
  },
  {
    lotId: 'LOT-MUM-2026-082',
    collectorId: 'COL-MUM-7701',
    materialCategory: 'Cables',
    quantityWeight: 52.0,
    quotedPrice: 460,
    finalPrice: 480,
    recyclerId: 'REC-MH-DHARAVI-02',
    collectionLocation: 'Kurla West Scrap Yard, Mumbai',
    handoverLocation: 'Bharat Copper Refining Counter, Dharavi',
    dateTime: '2026-09-19T11:15:00Z',
    paymentStatus: 'PAID',
    transactionStatus: 'COMPLETED',
    grossAmountInr: 24960,
    eprBonusInr: 1560,
    netDisbursedInr: 26520,
    paymentMode: 'UPI',
    payoutTxnRef: 'UPI/626119882314/PAYTM'
  },
  {
    lotId: 'LOT-MUM-2026-083',
    collectorId: 'COL-MUM-7702',
    materialCategory: 'Batteries',
    quantityWeight: 24.0,
    quotedPrice: 150,
    finalPrice: 150,
    recyclerId: 'REC-MH-PUNE-03',
    collectionLocation: 'Bhosari Industrial Gate 4, Pune',
    handoverLocation: 'Sahyadri Hazardous Waste Intake Bay, Bhosari',
    dateTime: '2026-09-20T07:20:00Z',
    paymentStatus: 'PENDING',
    transactionStatus: 'PENDING_PICKUP',
    grossAmountInr: 3600,
    eprBonusInr: 480,
    netDisbursedInr: 4080,
    paymentMode: 'DIRECT_IMPS'
  }
];

// ============================================================================
// 5. TRACEABILITY DATASET INTERFACES & MOCK DATA
// ============================================================================

export interface TraceabilityRecord {
  lotId: string;
  photographs: string[];
  weight: number; // In calibrated kilograms
  timestamp: string;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
  };
  handoverReferenceNumber: string; // Cryptographic transfer voucher e.g., EPR-MH-2026-7819
  recyclerConfirmation: boolean;
  subsequentTransactionStatus:
    | 'COLLECTION_VERIFIED'
    | 'IN_TRANSIT_MANIFESTED'
    | 'FACILITY_WEIGHBRIDGE_ACCEPTED'
    | 'PROCESSED_SMELTING'
    | 'EPR_PORTAL_REGISTERED';
  calibratedScaleId: string;
  cpcbForm6ManifestNumber: string; // Form-6 hazardous waste transfer document
  operatorNotes: string;
}

export const mockTraceabilityDataset: TraceabilityRecord[] = [
  {
    lotId: 'LOT-MUM-2026-081',
    photographs: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80'
    ],
    weight: 38.5,
    timestamp: '2026-09-18T14:38:00Z',
    gpsCoordinates: {
      latitude: 19.2968,
      longitude: 73.0631
    },
    handoverReferenceNumber: 'EPR-MH-THN-2026-9811',
    recyclerConfirmation: true,
    subsequentTransactionStatus: 'EPR_PORTAL_REGISTERED',
    calibratedScaleId: 'WEIGHBRIDGE-BHW-04-CAL',
    cpcbForm6ManifestNumber: 'CPCB-FORM6-MH-2026-004812',
    operatorNotes: 'Grade-A server boards inspected. Zero battery contamination. Settled over UPI in 4 minutes.'
  },
  {
    lotId: 'LOT-MUM-2026-082',
    photographs: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    ],
    weight: 52.0,
    timestamp: '2026-09-19T11:12:00Z',
    gpsCoordinates: {
      latitude: 19.0434,
      longitude: 72.8562
    },
    handoverReferenceNumber: 'EPR-MH-MUM-2026-1044',
    recyclerConfirmation: true,
    subsequentTransactionStatus: 'PROCESSED_SMELTING',
    calibratedScaleId: 'SCALE-DHARAVI-DESK-01',
    cpcbForm6ManifestNumber: 'CPCB-FORM6-MH-2026-005119',
    operatorNotes: 'Copper purity strip test passed (recovery rating: 94.2%). Transferred to secondary furnace.'
  },
  {
    lotId: 'LOT-MUM-2026-083',
    photographs: [
      'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80'
    ],
    weight: 24.0,
    timestamp: '2026-09-20T07:20:00Z',
    gpsCoordinates: {
      latitude: 18.6275,
      longitude: 73.8441
    },
    handoverReferenceNumber: 'EPR-MH-PUN-2026-4490',
    recyclerConfirmation: false,
    subsequentTransactionStatus: 'IN_TRANSIT_MANIFESTED',
    calibratedScaleId: 'PENDING_PHYSICAL_ARRIVAL',
    cpcbForm6ManifestNumber: 'CPCB-FORM6-PENDING',
    operatorNotes: 'Dispatched via electric logistics van (MH-14-GH-8812). GPS live-tracking active.'
  }
];

// ============================================================================
// 6. COLLECTOR DATASET INTERFACES & MOCK DATA
// ============================================================================

export interface CollectorEarningsHistory {
  totalEarned: number; // Cumulative earned in INR
  pendingDues: number; // In-transit or pending payment in INR
  currency: string;
  totalLotsCompleted: number;
  totalKgAggregated: number;
  lastSettlementDate: string;
}

export interface CollectorProfile {
  collectorId: string;
  aliasOrName: string;
  phoneMasked: string; // Privacy protection for vulnerable informal workers
  preferredLanguage: 'hi' | 'mr' | 'en';
  generalOperatingLocation: string; // e.g. 'Dharavi & Sion, Mumbai'
  transactionHistory: string[]; // Array of lotIds
  earningsHistory: CollectorEarningsHistory;
  kycBadge: 'SELF_REGISTERED' | 'EPR_CARD_VERIFIED' | 'AADHAAR_LINKED';
  upiVpaMasked?: string;
  emergencySosContact?: string;
}

export const mockCollectorDataset: CollectorProfile[] = [
  {
    collectorId: 'COL-MUM-7701',
    aliasOrName: 'Santosh Kumar (संतोष कुमार)',
    phoneMasked: '+91 98204 •••12',
    preferredLanguage: 'hi',
    generalOperatingLocation: 'Dharavi Sector 5, Mahim & Kurla West, Mumbai',
    transactionHistory: ['LOT-MUM-2026-081', 'LOT-MUM-2026-082'],
    earningsHistory: {
      totalEarned: 42112.5,
      pendingDues: 0,
      currency: 'INR',
      totalLotsCompleted: 2,
      totalKgAggregated: 90.5,
      lastSettlementDate: '2026-09-19'
    },
    kycBadge: 'EPR_CARD_VERIFIED',
    upiVpaMasked: 'santosh.kabadi@okhdfcbank'
  },
  {
    collectorId: 'COL-MUM-7702',
    aliasOrName: 'Balasaheb Shinde (बाळासाहेब शिंदे)',
    phoneMasked: '+91 94221 •••88',
    preferredLanguage: 'mr',
    generalOperatingLocation: 'Pimpri-Chinchwad, Bhosari MIDC & Nigdi, Pune',
    transactionHistory: ['LOT-MUM-2026-083'],
    earningsHistory: {
      totalEarned: 18450.0,
      pendingDues: 4080.0,
      currency: 'INR',
      totalLotsCompleted: 1,
      totalKgAggregated: 24.0,
      lastSettlementDate: '2026-09-15'
    },
    kycBadge: 'EPR_CARD_VERIFIED',
    upiVpaMasked: 'balasaheb.shinde@upi'
  },
  {
    collectorId: 'COL-MUM-7703',
    aliasOrName: 'Vinod Gaikwad (विनोद गायकवाड)',
    phoneMasked: '+91 98920 •••45',
    preferredLanguage: 'mr',
    generalOperatingLocation: 'Turbhe Naka, Vashi & APMC Market, Navi Mumbai',
    transactionHistory: [],
    earningsHistory: {
      totalEarned: 0,
      pendingDues: 0,
      currency: 'INR',
      totalLotsCompleted: 0,
      totalKgAggregated: 0,
      lastSettlementDate: 'None'
    },
    kycBadge: 'SELF_REGISTERED'
  }
];

// ============================================================================
// 7. CONSOLIDATED REPOSITORY HELPER FUNCTIONS
// ============================================================================

/**
 * Quick query helper for retrieving prices by material ID
 */
export function getPriceByMaterialId(materialId: string): PriceRecord | undefined {
  return mockPriceDataset.find((p) => p.materialId === materialId);
}

/**
 * Recycler match filter matching accepted categories and pickup criteria
 */
export function findMatchingRecyclers(params: {
  category?: MaterialCategory;
  requirePickup?: boolean;
  cityOrState?: string;
}): RecyclerFacility[] {
  return mockRecyclerDataset.filter((recycler) => {
    if (params.category && !recycler.materialsAccepted.includes(params.category)) {
      return false;
    }
    if (params.requirePickup && !recycler.pickupAvailability) {
      return false;
    }
    if (params.cityOrState) {
      const query = params.cityOrState.toLowerCase();
      const matchCity = recycler.location.city.toLowerCase().includes(query);
      const matchState = recycler.location.state.toLowerCase().includes(query);
      const matchArea = recycler.serviceArea.toLowerCase().includes(query);
      if (!matchCity && !matchState && !matchArea) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Retrieve complete traceability timeline with verification status
 */
export function getTraceabilityByLotId(lotId: string): TraceabilityRecord | undefined {
  return mockTraceabilityDataset.find((trace) => trace.lotId === lotId);
}

/**
 * Retrieve collector profile by ID
 */
export function getCollectorById(collectorId: string): CollectorProfile | undefined {
  return mockCollectorDataset.find((c) => c.collectorId === collectorId);
}
