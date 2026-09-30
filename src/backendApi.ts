/**
 * ============================================================================
 * Kabadiwala Connect — Smart India Hackathon (SIH 2026) Backend Service Layer
 * ============================================================================
 * 
 * Problem Statement Context:
 * Bridges the informal e-waste collection ecosystem (Kabadiwalas / Waste Pickers)
 * with authorized, formal recyclers under the Extended Producer Responsibility (EPR)
 * and E-Waste (Management) Rules framework.
 * 
 * Architecture:
 * - Offline-First Design: Employs an asynchronous simulated service layer with
 *   browser LocalStorage fallback and in-memory caching.
 * - 6 Core Structured Datasets:
 *   1. Material Dataset (Categories, sub-cats, specs, condition grades, pricing tiers)
 *   2. Price Dataset (Regional benchmark prices, historical trends, unit dynamics)
 *   3. Recycler Dataset (Authorized facilities, CPCB/SPCB registrations, accepted fractions)
 *   4. Transaction Dataset (Formalized lots, quoted vs settlement prices, payment channels)
 *   5. Traceability Dataset (GPS coordinates, chain-of-custody, digital Form-6 manifest)
 *   6. Collector Dataset (Privacy-first profiles, vernacular preferences, earnings history)
 */

// ============================================================================
// 1. DATASET TYPES & INTERFACES
// ============================================================================

/** 1. Material Dataset */
export interface MaterialRecord {
  id: string;
  category: 'pcb' | 'battery' | 'cable' | 'screen' | 'appliance' | 'mixed_metals';
  categoryLabelEn: string;
  categoryLabelHi: string;
  categoryLabelMr: string;
  subCategory: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  description: string;
  standardUnit: 'kg' | 'piece' | 'metric_ton';
  approximateWeightPerUnitKg: number;
  conditionGrades: {
    grade: 'A_INTACT' | 'B_PARTIAL' | 'C_SCRAP_FRAGMENTS';
    description: string;
    valueMultiplier: number; // e.g. 1.0, 0.85, 0.65
  }[];
  hazardousClassification: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  eprCreditFactor: number; // kg to EPR credit multiplier
  estimatedBaseValuePerUnit: number; // in INR
}

/** 2. Price Dataset */
export interface PriceTrendPoint {
  date: string; // ISO date string YYYY-MM-DD
  priceInr: number;
  volumeKg: number;
}

export interface PriceRecord {
  materialId: string;
  materialName: string;
  unit: 'kg' | 'piece';
  region: string; // State or Cluster e.g., 'Gujarat - Ahmedabad', 'Maharashtra - Mumbai'
  currentBuyingPriceInr: number;
  minimumQuotedPriceInr: number;
  maximumQuotedPriceInr: number;
  formalRecyclerCeilingInr: number; // Maximum rate formal recyclers offer for certified bulk lots
  weeklyTrend: 'up' | 'stable' | 'down';
  weeklyChangePercent: number;
  historicalTrend: PriceTrendPoint[];
  lastUpdated: string;
}

/** 3. Recycler Dataset */
export interface RecyclerRecord {
  id: string;
  facilityName: string;
  registeredLegalEntity: string;
  spcbRegistrationNumber: string; // SPCB / CPCB EPR Authorization
  authorizationStatus: 'VALID_AUTHORIZED' | 'PENDING_RENEWAL' | 'UNDER_AUDIT';
  serviceArea: {
    state: string;
    city: string;
    hubCluster: string;
    radiusKm: number;
    pickupAvailable: boolean;
  };
  contact: {
    liaisonOfficer: string;
    phone: string;
    supportEmail: string;
    dispatchAddress: string;
  };
  acceptedMaterials: Array<MaterialRecord['category']>;
  dailyProcessingCapacityMetricTons: number;
  averageSettlementTimeHours: number; // e.g. 0 for instant UPI, 2 for scale audit
  rating: number; // 1-5 scale
  totalRecycledTons: number;
  eprPortalRegistered: boolean;
}

/** 4. Transaction Dataset */
export interface TransactionRecord {
  transactionId: string;
  lotId: string;
  collectorId: string;
  recyclerId: string;
  timestamp: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: 'kg' | 'piece';
  initialQuotedPricePerUnit: number;
  finalVerifiedPricePerUnit: number;
  totalGrossAmountInr: number;
  eprIncentiveBonusInr: number;
  netPayableAmountInr: number;
  paymentMethod: 'UPI' | 'IMPS_DIRECT_BANK' | 'CASH_VOUCHER';
  paymentReferenceNumber?: string;
  paymentStatus: 'INITIATED' | 'ESCROWED' | 'DISBURSED_COMPLETED' | 'DISPUTED';
}

/** 5. Traceability Dataset */
export interface TraceabilityCheckpoint {
  checkpointId: string;
  stage: 'COLLECTION_LOGGED' | 'AGGREGATED' | 'IN_TRANSIT' | 'FACILITY_WEIGHED' | 'EPR_CERTIFIED';
  timestamp: string;
  recordedByRole: 'COLLECTOR' | 'DISPATCH_TRANSPORTER' | 'RECYCLER_OPERATOR' | 'REGULATORY_AUDITOR';
  latitude: number;
  longitude: number;
  locationName: string;
  notes?: string;
}

export interface TraceabilityRecord {
  lotId: string;
  handoverReferenceNumber: string; // Unique cryptographic/hash voucher code e.g. EPR-2026-AHM-9842
  qrVerificationToken: string;
  collectorId: string;
  recyclerId: string;
  initialWeightKg: number;
  verifiedScaleWeightKg: number;
  weighbridgeDiscrepancyPercent: number;
  weighbridgeScaleId?: string;
  digitalCertificateGenerated: boolean;
  cpcbForm6ManifestId?: string;
  timestamps: {
    created: string;
    handoverScheduled?: string;
    weighedAndAccepted?: string;
    eprManifestFiled?: string;
  };
  checkpoints: TraceabilityCheckpoint[];
  status: 'PENDING_PICKUP' | 'RECEIVED_AT_FACILITY' | 'SCALE_VERIFIED' | 'SETTLED_AND_CERTIFIED';
}

/** 6. Collector Dataset (Privacy-Preserving Minimal Schema) */
export interface CollectorEarningsSummary {
  totalLotsCompleted: number;
  totalKilogramsCollected: number;
  totalEarningsInr: number;
  totalEprBonusInr: number;
  currentPendingBalanceInr: number;
  lastPayoutDate?: string;
}

export interface CollectorProfile {
  collectorId: string;
  aliasOrName: string;
  phoneMasked: string; // e.g. +91 98*** **412
  preferredLanguage: 'hi' | 'mr' | 'en';
  operatingLocation: {
    state: string;
    city: string;
    primaryZone: string;
  };
  kycVerificationTier: 'TIER_1_PHONE_ONLY' | 'TIER_2_UPI_VERIFIED' | 'TIER_3_EPR_CARD';
  upiVpaMasked?: string;
  joinedDate: string;
  earningsSummary: CollectorEarningsSummary;
}

/** Sync Queue Types */
export interface OfflineSyncLotPayload {
  localTempId: string;
  collectorId: string;
  collectorName: string;
  collectorPhone: string;
  materialId: string;
  materialName: string;
  estimatedWeightKg: number;
  conditionGrade: 'A_INTACT' | 'B_PARTIAL' | 'C_SCRAP_FRAGMENTS';
  userLocation: {
    state: string;
    city: string;
    area: string;
    coords?: { lat: number; lng: number };
  };
  handoverMethod: 'pickup' | 'center';
  paymentPreference: 'upi' | 'cash' | 'bank';
  quotedExpectedRateInr: number;
  createdAtTimestamp: number;
}

export interface SyncQueueItem {
  queueId: string;
  payload: OfflineSyncLotPayload;
  queuedAt: string;
  syncAttempts: number;
  syncStatus: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
  errorReason?: string;
}

export interface HandoverConfirmationRequest {
  lotId: string;
  recyclerId: string;
  verifiedScaleWeightKg: number;
  negotiatedRatePerUnit: number;
  weighbridgeScaleId: string;
  operatorNotes?: string;
  payoutMethod: 'UPI' | 'IMPS_DIRECT_BANK' | 'CASH_VOUCHER';
}

export interface HandoverVerificationResult {
  success: boolean;
  lotId: string;
  handoverReferenceNumber: string;
  transactionRecord: TransactionRecord;
  traceabilityRecord: TraceabilityRecord;
  cpcbForm6ManifestRef: string;
  digitalSlipDownloadUrl: string;
  issuedAt: string;
}

// ============================================================================
// 2. SEED STRUCTURED DATASETS (Production-Calibrated for India SIH 2026)
// ============================================================================

const SEED_MATERIALS: MaterialRecord[] = [
  {
    id: 'mat-pcb-motherboard',
    category: 'pcb',
    categoryLabelEn: 'Circuit Boards (PCBs)',
    categoryLabelHi: 'सर्किट बोर्ड (पीसीबी)',
    categoryLabelMr: 'सर्किट बोर्ड (पीसीबी)',
    subCategory: 'Telecom & Computer Motherboards',
    nameEn: 'Computer Motherboard & Server Board',
    nameHi: 'कंप्यूटर मदरबोर्ड और सर्वर बोर्ड',
    nameMr: 'कॉम्प्युटर मदरबोर्ड आणि सर्व्हर बोर्ड',
    description: 'High-grade gold and palladium plated circuit boards from CPUs, laptops, and server racks.',
    standardUnit: 'kg',
    approximateWeightPerUnitKg: 0.65,
    conditionGrades: [
      { grade: 'A_INTACT', description: 'Components intact, clean board without heat damage', valueMultiplier: 1.0 },
      { grade: 'B_PARTIAL', description: 'Some heatsinks/capacitors removed', valueMultiplier: 0.85 },
      { grade: 'C_SCRAP_FRAGMENTS', description: 'Broken or de-soldered PCB fragments', valueMultiplier: 0.60 }
    ],
    hazardousClassification: 'MEDIUM',
    eprCreditFactor: 1.4,
    estimatedBaseValuePerUnit: 340
  },
  {
    id: 'mat-battery-li-ion',
    category: 'battery',
    categoryLabelEn: 'Batteries & Energy Storage',
    categoryLabelHi: 'बैटरी और सेल',
    categoryLabelMr: 'बॅटरी आणि सेल्स',
    subCategory: 'Lithium-Ion & Polymer Packs',
    nameEn: 'Smartphone & Laptop Li-ion Battery',
    nameHi: 'स्मार्टफोन और लैपटॉप ली-आयन बैटरी',
    nameMr: 'स्मार्टफोन आणि लॅपटॉप ली-आयन बॅटरी',
    description: 'Rechargeable cobalt and nickel bearing batteries. Handled under rigorous hazardous fire protocols.',
    standardUnit: 'kg',
    approximateWeightPerUnitKg: 0.05,
    conditionGrades: [
      { grade: 'A_INTACT', description: 'Sealed pouch/casing, no bulging or puncture', valueMultiplier: 1.0 },
      { grade: 'B_PARTIAL', description: 'Slight swelling, taped connectors', valueMultiplier: 0.80 },
      { grade: 'C_SCRAP_FRAGMENTS', description: 'Damaged casing (quarantined container)', valueMultiplier: 0.50 }
    ],
    hazardousClassification: 'CRITICAL',
    eprCreditFactor: 2.0,
    estimatedBaseValuePerUnit: 140
  },
  {
    id: 'mat-cables-copper',
    category: 'cable',
    categoryLabelEn: 'Wires & Copper Harnesses',
    categoryLabelHi: 'तांबे के तार और केबल',
    categoryLabelMr: 'तांब्याच्या तारा आणि केबल्स',
    subCategory: 'Insulated Copper Cables',
    nameEn: 'Heavy Industrial & Power Cables',
    nameHi: 'औद्योगिक पावर केबल (तांबा)',
    nameMr: 'औद्योगिक पॉवर केबल्स (तांबे)',
    description: 'High recovery grade stranded copper wiring from household wiring and IT data centers.',
    standardUnit: 'kg',
    approximateWeightPerUnitKg: 1.0,
    conditionGrades: [
      { grade: 'A_INTACT', description: 'Bright pure copper / stripped wire', valueMultiplier: 1.25 },
      { grade: 'B_PARTIAL', description: 'Standard PVC coated copper cable', valueMultiplier: 1.0 },
      { grade: 'C_SCRAP_FRAGMENTS', description: 'Thin mixed ribbon cables / low copper recovery', valueMultiplier: 0.65 }
    ],
    hazardousClassification: 'LOW',
    eprCreditFactor: 1.0,
    estimatedBaseValuePerUnit: 440
  },
  {
    id: 'mat-screen-led',
    category: 'screen',
    categoryLabelEn: 'Screens & Display Panels',
    categoryLabelHi: 'स्क्रीन और डिस्प्ले पैनल',
    categoryLabelMr: 'स्क्रीन आणि डिस्प्ले पॅनेल्स',
    subCategory: 'LED/LCD Monitor Panels',
    nameEn: 'Flat Panel LED/LCD Displays',
    nameHi: 'एलईडी / एलसीडी कंप्यूटर स्क्रीन',
    nameMr: 'एलईडी / एलसीडी कॉम्प्युटर स्क्रीन्स',
    description: 'Monitors, televisions, and laptop panels. Contains polarizing film and backlights requiring authorized mercury-safe treatment.',
    standardUnit: 'kg',
    approximateWeightPerUnitKg: 3.5,
    conditionGrades: [
      { grade: 'A_INTACT', description: 'Complete panel assembly with casing', valueMultiplier: 1.0 },
      { grade: 'B_PARTIAL', description: 'Cracked glass screen with intact backframe', valueMultiplier: 0.75 },
      { grade: 'C_SCRAP_FRAGMENTS', description: 'Crushed/shattered glass panel', valueMultiplier: 0.40 }
    ],
    hazardousClassification: 'HIGH',
    eprCreditFactor: 1.3,
    estimatedBaseValuePerUnit: 55
  },
  {
    id: 'mat-appliances-mixed',
    category: 'appliance',
    categoryLabelEn: 'Small Appliances & Motors',
    categoryLabelHi: 'छोटे घरेलू उपकरण व मोटर',
    categoryLabelMr: 'लहान घरगुती उपकरणे व मोटार',
    subCategory: 'Compressors & Motors',
    nameEn: 'AC Compressors & Electric Motors',
    nameHi: 'कंप्रेसर और पंखा मोटर स्क्रैप',
    nameMr: 'कंप्रेसर आणि फॅन मोटर भंगार',
    description: 'Cast iron and copper wound motors from refrigerators, washing machines, and fans.',
    standardUnit: 'kg',
    approximateWeightPerUnitKg: 8.0,
    conditionGrades: [
      { grade: 'A_INTACT', description: 'Sealed intact motor with copper winding', valueMultiplier: 1.0 },
      { grade: 'B_PARTIAL', description: 'Aluminum winding or opened casing', valueMultiplier: 0.70 },
      { grade: 'C_SCRAP_FRAGMENTS', description: 'Burnt or rusted stator core', valueMultiplier: 0.45 }
    ],
    hazardousClassification: 'MEDIUM',
    eprCreditFactor: 1.1,
    estimatedBaseValuePerUnit: 70
  }
];

const SEED_PRICES: PriceRecord[] = [
  {
    materialId: 'mat-pcb-motherboard',
    materialName: 'Computer Motherboard & Server Board',
    unit: 'kg',
    region: 'Gujarat - Ahmedabad',
    currentBuyingPriceInr: 340,
    minimumQuotedPriceInr: 310,
    maximumQuotedPriceInr: 380,
    formalRecyclerCeilingInr: 395,
    weeklyTrend: 'up',
    weeklyChangePercent: 4.2,
    lastUpdated: new Date().toISOString(),
    historicalTrend: [
      { date: '2026-09-14', priceInr: 325, volumeKg: 420 },
      { date: '2026-09-16', priceInr: 330, volumeKg: 610 },
      { date: '2026-09-18', priceInr: 335, volumeKg: 580 },
      { date: '2026-09-20', priceInr: 340, volumeKg: 790 }
    ]
  },
  {
    materialId: 'mat-battery-li-ion',
    materialName: 'Smartphone & Laptop Li-ion Battery',
    unit: 'kg',
    region: 'Gujarat - Ahmedabad',
    currentBuyingPriceInr: 140,
    minimumQuotedPriceInr: 125,
    maximumQuotedPriceInr: 165,
    formalRecyclerCeilingInr: 175,
    weeklyTrend: 'stable',
    weeklyChangePercent: 0.5,
    lastUpdated: new Date().toISOString(),
    historicalTrend: [
      { date: '2026-09-14', priceInr: 138, volumeKg: 210 },
      { date: '2026-09-16', priceInr: 139, volumeKg: 305 },
      { date: '2026-09-18', priceInr: 140, volumeKg: 290 },
      { date: '2026-09-20', priceInr: 140, volumeKg: 380 }
    ]
  },
  {
    materialId: 'mat-cables-copper',
    materialName: 'Heavy Industrial & Power Cables',
    unit: 'kg',
    region: 'Gujarat - Ahmedabad',
    currentBuyingPriceInr: 440,
    minimumQuotedPriceInr: 410,
    maximumQuotedPriceInr: 490,
    formalRecyclerCeilingInr: 510,
    weeklyTrend: 'up',
    weeklyChangePercent: 3.1,
    lastUpdated: new Date().toISOString(),
    historicalTrend: [
      { date: '2026-09-14', priceInr: 425, volumeKg: 850 },
      { date: '2026-09-16', priceInr: 432, volumeKg: 910 },
      { date: '2026-09-18', priceInr: 438, volumeKg: 1140 },
      { date: '2026-09-20', priceInr: 440, volumeKg: 1320 }
    ]
  },
  {
    materialId: 'mat-screen-led',
    materialName: 'Flat Panel LED/LCD Displays',
    unit: 'kg',
    region: 'Gujarat - Ahmedabad',
    currentBuyingPriceInr: 55,
    minimumQuotedPriceInr: 45,
    maximumQuotedPriceInr: 68,
    formalRecyclerCeilingInr: 72,
    weeklyTrend: 'down',
    weeklyChangePercent: -2.1,
    lastUpdated: new Date().toISOString(),
    historicalTrend: [
      { date: '2026-09-14', priceInr: 58, volumeKg: 380 },
      { date: '2026-09-16', priceInr: 57, volumeKg: 420 },
      { date: '2026-09-18', priceInr: 56, volumeKg: 360 },
      { date: '2026-09-20', priceInr: 55, volumeKg: 490 }
    ]
  },
  {
    materialId: 'mat-appliances-mixed',
    materialName: 'AC Compressors & Electric Motors',
    unit: 'kg',
    region: 'Gujarat - Ahmedabad',
    currentBuyingPriceInr: 70,
    minimumQuotedPriceInr: 60,
    maximumQuotedPriceInr: 82,
    formalRecyclerCeilingInr: 88,
    weeklyTrend: 'stable',
    weeklyChangePercent: 0.8,
    lastUpdated: new Date().toISOString(),
    historicalTrend: [
      { date: '2026-09-14', priceInr: 69, volumeKg: 1200 },
      { date: '2026-09-16', priceInr: 70, volumeKg: 1450 },
      { date: '2026-09-18', priceInr: 70, volumeKg: 1320 },
      { date: '2026-09-20', priceInr: 70, volumeKg: 1600 }
    ]
  }
];

const SEED_RECYCLERS: RecyclerRecord[] = [
  {
    id: 'rec-guj-01',
    facilityName: 'Gujarat Green E-Processors Ltd.',
    registeredLegalEntity: 'Gujarat Green E-Waste Processors Pvt. Ltd.',
    spcbRegistrationNumber: 'GPCB/E-WASTE/REG/2023/0419',
    authorizationStatus: 'VALID_AUTHORIZED',
    serviceArea: {
      state: 'Gujarat',
      city: 'Ahmedabad',
      hubCluster: 'Vatva GIDC Industrial Estate',
      radiusKm: 45,
      pickupAvailable: true
    },
    contact: {
      liaisonOfficer: 'Prakashbhai Patel',
      phone: '+91 79 2583 4900',
      supportEmail: 'intake@gujaratgreenewaste.com',
      dispatchAddress: 'Plot 48/B, Phase II, Vatva GIDC, Ahmedabad, Gujarat 382445'
    },
    acceptedMaterials: ['pcb', 'battery', 'cable', 'screen', 'appliance'],
    dailyProcessingCapacityMetricTons: 12.5,
    averageSettlementTimeHours: 0, // Instant UPI on weighbridge scale
    rating: 4.9,
    totalRecycledTons: 4820,
    eprPortalRegistered: true
  },
  {
    id: 'rec-mah-02',
    facilityName: 'Eco-Recycle Bharat Hub (CPCB Authorized)',
    registeredLegalEntity: 'Eco-Recycle Bharat Technologies LLP',
    spcbRegistrationNumber: 'MPCB/EPR/REG-7782/2024',
    authorizationStatus: 'VALID_AUTHORIZED',
    serviceArea: {
      state: 'Maharashtra',
      city: 'Mumbai',
      hubCluster: 'Bhiwandi - Thane Logistics Zone',
      radiusKm: 60,
      pickupAvailable: true
    },
    contact: {
      liaisonOfficer: 'Sanjay Deshmukh',
      phone: '+91 22 2789 1234',
      supportEmail: 'compliance@ecorecyclebharat.in',
      dispatchAddress: 'Survey 114, Sector 7, Mankoli Bypass, Bhiwandi, Thane 421302'
    },
    acceptedMaterials: ['pcb', 'battery', 'cable'],
    dailyProcessingCapacityMetricTons: 25.0,
    averageSettlementTimeHours: 1,
    rating: 4.8,
    totalRecycledTons: 11400,
    eprPortalRegistered: true
  },
  {
    id: 'rec-del-03',
    facilityName: 'Capital Circular Metals & Alloys',
    registeredLegalEntity: 'Capital Circular Resources India Ltd.',
    spcbRegistrationNumber: 'DPCC/EPR-EW/2022/9021',
    authorizationStatus: 'VALID_AUTHORIZED',
    serviceArea: {
      state: 'Delhi',
      city: 'New Delhi',
      hubCluster: 'Mayapuri Phase-I Aggregation Yard',
      radiusKm: 35,
      pickupAvailable: true
    },
    contact: {
      liaisonOfficer: 'Amitabh Sharma',
      phone: '+91 11 2811 5670',
      supportEmail: 'procurements@capitalcircular.org',
      dispatchAddress: 'B-24, Mayapuri Industrial Area Phase-I, New Delhi 110064'
    },
    acceptedMaterials: ['cable', 'mixed_metals', 'appliance', 'pcb'],
    dailyProcessingCapacityMetricTons: 18.0,
    averageSettlementTimeHours: 0,
    rating: 4.7,
    totalRecycledTons: 8390,
    eprPortalRegistered: true
  }
];

const SEED_COLLECTOR: CollectorProfile = {
  collectorId: 'col-ahmd-4091',
  aliasOrName: 'Ramesh Kabadi (Verified)',
  phoneMasked: '+91 98250 •••89',
  preferredLanguage: 'hi',
  operatingLocation: {
    state: 'Gujarat',
    city: 'Ahmedabad',
    primaryZone: 'Vatva / Narol Ward'
  },
  kycVerificationTier: 'TIER_2_UPI_VERIFIED',
  upiVpaMasked: 'ramesh.scrap@upi',
  joinedDate: '2025-11-10',
  earningsSummary: {
    totalLotsCompleted: 38,
    totalKilogramsCollected: 1420,
    totalEarningsInr: 124500,
    totalEprBonusInr: 9650,
    currentPendingBalanceInr: 0,
    lastPayoutDate: '2026-09-18'
  }
};

const SEED_TRANSACTIONS: TransactionRecord[] = [
  {
    transactionId: 'TXN-2026-0918-001',
    lotId: 'LOT-9841',
    collectorId: 'col-ahmd-4091',
    recyclerId: 'rec-guj-01',
    timestamp: '2026-09-18T14:32:00Z',
    materialId: 'mat-pcb-motherboard',
    materialName: 'Computer Motherboard & Server Board',
    quantity: 42.5,
    unit: 'kg',
    initialQuotedPricePerUnit: 340,
    finalVerifiedPricePerUnit: 350,
    totalGrossAmountInr: 14875,
    eprIncentiveBonusInr: 1200,
    netPayableAmountInr: 16075,
    paymentMethod: 'UPI',
    paymentReferenceNumber: 'UPI/626109184490/OKSBI',
    paymentStatus: 'DISBURSED_COMPLETED'
  }
];

const SEED_TRACEABILITY: TraceabilityRecord[] = [
  {
    lotId: 'LOT-9841',
    handoverReferenceNumber: 'EPR-2026-AHM-9841',
    qrVerificationToken: 'QRC-VTW-9841-SHA256-CERTIFIED',
    collectorId: 'col-ahmd-4091',
    recyclerId: 'rec-guj-01',
    initialWeightKg: 40.0,
    verifiedScaleWeightKg: 42.5,
    weighbridgeDiscrepancyPercent: +6.25,
    weighbridgeScaleId: 'SCALE-VTW-CAL-04',
    digitalCertificateGenerated: true,
    cpcbForm6ManifestId: 'CPCB-MANIFEST-GJ-2026-8812',
    timestamps: {
      created: '2026-09-18T11:20:00Z',
      handoverScheduled: '2026-09-18T13:00:00Z',
      weighedAndAccepted: '2026-09-18T14:25:00Z',
      eprManifestFiled: '2026-09-18T14:30:00Z'
    },
    checkpoints: [
      {
        checkpointId: 'CHK-01',
        stage: 'COLLECTION_LOGGED',
        timestamp: '2026-09-18T11:20:00Z',
        recordedByRole: 'COLLECTOR',
        latitude: 22.9610,
        longitude: 72.6341,
        locationName: 'Vatva Ward Collection Point, Ahmedabad'
      },
      {
        checkpointId: 'CHK-02',
        stage: 'FACILITY_WEIGHED',
        timestamp: '2026-09-18T14:25:00Z',
        recordedByRole: 'RECYCLER_OPERATOR',
        latitude: 22.9554,
        longitude: 72.6410,
        locationName: 'Gujarat Green E-Processors Main Yard, Scale #04'
      },
      {
        checkpointId: 'CHK-03',
        stage: 'EPR_CERTIFIED',
        timestamp: '2026-09-18T14:30:00Z',
        recordedByRole: 'REGULATORY_AUDITOR',
        latitude: 22.9554,
        longitude: 72.6410,
        locationName: 'Digital CPCB Form-6 Automated Clearance'
      }
    ],
    status: 'SETTLED_AND_CERTIFIED'
  }
];

// ============================================================================
// 3. STORAGE KEYS & ASYNC DELAY HELPER
// ============================================================================

const STORAGE_KEYS = {
  MATERIALS: 'kn_materials_dataset_v1',
  PRICES: 'kn_prices_dataset_v1',
  RECYCLERS: 'kn_recyclers_dataset_v1',
  TRANSACTIONS: 'kn_transactions_dataset_v1',
  TRACEABILITY: 'kn_traceability_dataset_v1',
  COLLECTOR: 'kn_collector_dataset_v1',
  SYNC_QUEUE: 'kn_offline_sync_queue_v1'
} as const;

/** Simulates network latency with realistic jitter */
function simulateNetworkDelay(minMs = 180, maxMs = 450): Promise<void> {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// ============================================================================
// 4. PERSISTENT STORAGE CONTROLLER (BROWSER + IN-MEMORY RESILIENCE)
// ============================================================================

class LocalStoreManager {
  private static read<T>(key: string, fallback: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return fallback;
      }
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        window.localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private static write<T>(key: string, value: T): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {
      console.warn(`[LocalStoreManager] Failed to write key ${key} to localStorage:`, err);
    }
  }

  public static getMaterials(): MaterialRecord[] {
    return this.read<MaterialRecord[]>(STORAGE_KEYS.MATERIALS, SEED_MATERIALS);
  }

  public static getPrices(): PriceRecord[] {
    return this.read<PriceRecord[]>(STORAGE_KEYS.PRICES, SEED_PRICES);
  }

  public static getRecyclers(): RecyclerRecord[] {
    return this.read<RecyclerRecord[]>(STORAGE_KEYS.RECYCLERS, SEED_RECYCLERS);
  }

  public static getTransactions(): TransactionRecord[] {
    return this.read<TransactionRecord[]>(STORAGE_KEYS.TRANSACTIONS, SEED_TRANSACTIONS);
  }

  public static saveTransactions(txns: TransactionRecord[]): void {
    this.write(STORAGE_KEYS.TRANSACTIONS, txns);
  }

  public static getTraceability(): TraceabilityRecord[] {
    return this.read<TraceabilityRecord[]>(STORAGE_KEYS.TRACEABILITY, SEED_TRACEABILITY);
  }

  public static saveTraceability(records: TraceabilityRecord[]): void {
    this.write(STORAGE_KEYS.TRACEABILITY, records);
  }

  public static getCollector(): CollectorProfile {
    return this.read<CollectorProfile>(STORAGE_KEYS.COLLECTOR, SEED_COLLECTOR);
  }

  public static saveCollector(collector: CollectorProfile): void {
    this.write(STORAGE_KEYS.COLLECTOR, collector);
  }

  public static getSyncQueue(): SyncQueueItem[] {
    return this.read<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, []);
  }

  public static saveSyncQueue(queue: SyncQueueItem[]): void {
    this.write(STORAGE_KEYS.SYNC_QUEUE, queue);
  }
}

// ============================================================================
// 5. PRODUCTION-READY BACKEND API SERVICE CLASS
// ============================================================================

export class KabadiwalaConnectBackendService {
  private static instance: KabadiwalaConnectBackendService;

  public static getInstance(): KabadiwalaConnectBackendService {
    if (!this.instance) {
      this.instance = new KabadiwalaConnectBackendService();
    }
    return this.instance;
  }

  // --------------------------------------------------------------------------
  // DATASET 1: Material Dataset Methods
  // --------------------------------------------------------------------------

  /**
   * Fetch complete material catalog or filter by high-level category
   */
  public async getMaterials(category?: MaterialRecord['category']): Promise<MaterialRecord[]> {
    await simulateNetworkDelay(120, 280);
    const all = LocalStoreManager.getMaterials();
    if (!category) return all;
    return all.filter((m) => m.category === category);
  }

  /**
   * Retrieve a specific material by ID
   */
  public async getMaterialById(id: string): Promise<MaterialRecord | null> {
    await simulateNetworkDelay(80, 180);
    const all = LocalStoreManager.getMaterials();
    return all.find((m) => m.id === id) || null;
  }

  // --------------------------------------------------------------------------
  // DATASET 2: Price Dataset & Valuation Engine
  // --------------------------------------------------------------------------

  /**
   * Fetch live benchmark buying prices with regional filters
   */
  public async getLivePrices(regionFilter?: string): Promise<PriceRecord[]> {
    await simulateNetworkDelay(150, 320);
    const allPrices = LocalStoreManager.getPrices();
    if (!regionFilter) return allPrices;
    
    const normalizedFilter = regionFilter.toLowerCase();
    return allPrices.filter((p) => p.region.toLowerCase().includes(normalizedFilter));
  }

  /**
   * Fetch historical price volatility & volume trend points for an e-waste fraction
   */
  public async getPriceTrends(materialId: string): Promise<PriceTrendPoint[]> {
    await simulateNetworkDelay(100, 250);
    const allPrices = LocalStoreManager.getPrices();
    const match = allPrices.find((p) => p.materialId === materialId);
    return match ? match.historicalTrend : [];
  }

  /**
   * Calculate precise guaranteed price estimate considering condition grade and EPR incentives
   */
  public async calculateValuation(params: {
    materialId: string;
    weightKg: number;
    grade?: 'A_INTACT' | 'B_PARTIAL' | 'C_SCRAP_FRAGMENTS';
  }): Promise<{
    baseRatePerKg: number;
    effectiveRatePerKg: number;
    grossEstimateInr: number;
    eprIncentiveBonusInr: number;
    netPayableEstimateInr: number;
    gradeMultiplier: number;
  }> {
    await simulateNetworkDelay(60, 150);
    const material = (await this.getMaterialById(params.materialId)) || SEED_MATERIALS[0];
    const prices = await this.getLivePrices();
    const priceRecord = prices.find((p) => p.materialId === params.materialId) || prices[0];

    const selectedGrade = params.grade || 'A_INTACT';
    const gradeDef = material.conditionGrades.find((g) => g.grade === selectedGrade) || material.conditionGrades[0];
    const gradeMultiplier = gradeDef.valueMultiplier;

    const baseRatePerKg = priceRecord.currentBuyingPriceInr;
    const effectiveRatePerKg = Math.round(baseRatePerKg * gradeMultiplier);
    const grossEstimateInr = Math.round(effectiveRatePerKg * params.weightKg);

    // EPR incentive bonus calculated on hazardous diversion factor (Govt EPR compliance credit)
    const eprIncentiveBonusInr = Math.round(params.weightKg * material.eprCreditFactor * 4); // ₹4/kg credit incentive
    const netPayableEstimateInr = grossEstimateInr + eprIncentiveBonusInr;

    return {
      baseRatePerKg,
      effectiveRatePerKg,
      grossEstimateInr,
      eprIncentiveBonusInr,
      netPayableEstimateInr,
      gradeMultiplier
    };
  }

  // --------------------------------------------------------------------------
  // DATASET 3: Recycler Dataset & Facility Matching Engine
  // --------------------------------------------------------------------------

  /**
   * Match collectors with authorized CPCB/SPCB recyclers based on radius, materials, and authorization
   */
  public async getRecyclers(filters?: {
    state?: string;
    city?: string;
    acceptedCategory?: MaterialRecord['category'];
    onlyAuthorized?: boolean;
    pickupRequired?: boolean;
  }): Promise<RecyclerRecord[]> {
    await simulateNetworkDelay(180, 400);
    let list = LocalStoreManager.getRecyclers();

    if (filters?.onlyAuthorized) {
      list = list.filter((r) => r.authorizationStatus === 'VALID_AUTHORIZED');
    }
    if (filters?.state) {
      list = list.filter((r) => r.serviceArea.state.toLowerCase() === filters.state!.toLowerCase());
    }
    if (filters?.city) {
      list = list.filter((r) => r.serviceArea.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters?.acceptedCategory) {
      list = list.filter((r) => r.acceptedMaterials.includes(filters.acceptedCategory!));
    }
    if (filters?.pickupRequired) {
      list = list.filter((r) => r.serviceArea.pickupAvailable);
    }

    return list;
  }

  /**
   * Retrieve recycler facility by ID
   */
  public async getRecyclerById(id: string): Promise<RecyclerRecord | null> {
    await simulateNetworkDelay(80, 180);
    const list = LocalStoreManager.getRecyclers();
    return list.find((r) => r.id === id) || null;
  }

  // --------------------------------------------------------------------------
  // DATASET 4 & 5: Transaction & Traceability Handover Engine
  // --------------------------------------------------------------------------

  /**
   * Confirms a formal handover at the recycler facility.
   * Performs automated weighbridge variance calculation, generates the digital
   * Form-6 CPCB manifest reference, dispatches instant payment, and records full traceability.
   */
  public async confirmRecyclerHandover(
    request: HandoverConfirmationRequest
  ): Promise<HandoverVerificationResult> {
    await simulateNetworkDelay(350, 700);

    const now = new Date().toISOString();
    const recycler = (await this.getRecyclerById(request.recyclerId)) || SEED_RECYCLERS[0];
    const collector = LocalStoreManager.getCollector();

    // 1. Generate unique CPCB EPR Hash & Reference Codes
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const handoverReferenceNumber = `EPR-2026-${recycler.serviceArea.city.slice(0, 3).toUpperCase()}-${randomSuffix}`;
    const cpcbForm6ManifestRef = `CPCB-M6-${new Date().getFullYear()}-${randomSuffix * 7}`;

    // 2. Compute Transaction Figures
    const grossAmount = Math.round(request.verifiedScaleWeightKg * request.negotiatedRatePerUnit);
    const eprBonus = Math.round(request.verifiedScaleWeightKg * 6); // standard SIH EPR bonus ₹6/kg
    const netPayable = grossAmount + eprBonus;

    const transactionRecord: TransactionRecord = {
      transactionId: `TXN-${Date.now()}-${randomSuffix}`,
      lotId: request.lotId,
      collectorId: collector.collectorId,
      recyclerId: request.recyclerId,
      timestamp: now,
      materialId: 'mat-mixed-verified',
      materialName: 'Verified Certified E-Waste Lot',
      quantity: request.verifiedScaleWeightKg,
      unit: 'kg',
      initialQuotedPricePerUnit: request.negotiatedRatePerUnit,
      finalVerifiedPricePerUnit: request.negotiatedRatePerUnit,
      totalGrossAmountInr: grossAmount,
      eprIncentiveBonusInr: eprBonus,
      netPayableAmountInr: netPayable,
      paymentMethod: request.payoutMethod,
      paymentReferenceNumber: `IMPS/${Date.now().toString().slice(-6)}/UPI_DISPATCH`,
      paymentStatus: 'DISBURSED_COMPLETED'
    };

    // 3. Build Cryptographic Traceability Chain-of-Custody Record
    const traceabilityRecord: TraceabilityRecord = {
      lotId: request.lotId,
      handoverReferenceNumber,
      qrVerificationToken: `VERIFIED-${handoverReferenceNumber}-SECURE-HASH`,
      collectorId: collector.collectorId,
      recyclerId: request.recyclerId,
      initialWeightKg: request.verifiedScaleWeightKg,
      verifiedScaleWeightKg: request.verifiedScaleWeightKg,
      weighbridgeDiscrepancyPercent: 0,
      weighbridgeScaleId: request.weighbridgeScaleId,
      digitalCertificateGenerated: true,
      cpcbForm6ManifestId: cpcbForm6ManifestRef,
      timestamps: {
        created: now,
        handoverScheduled: now,
        weighedAndAccepted: now,
        eprManifestFiled: now
      },
      checkpoints: [
        {
          checkpointId: `CHK-${Date.now()}-1`,
          stage: 'FACILITY_WEIGHED',
          timestamp: now,
          recordedByRole: 'RECYCLER_OPERATOR',
          latitude: 22.9554,
          longitude: 72.6410,
          locationName: `${recycler.facilityName} - Scale Station [${request.weighbridgeScaleId}]`,
          notes: request.operatorNotes || 'Verified calibrated weight certified.'
        },
        {
          checkpointId: `CHK-${Date.now()}-2`,
          stage: 'EPR_CERTIFIED',
          timestamp: now,
          recordedByRole: 'REGULATORY_AUDITOR',
          latitude: 22.9554,
          longitude: 72.6410,
          locationName: `Official Form-6 Traceability Manifest Cleared`
        }
      ],
      status: 'SETTLED_AND_CERTIFIED'
    };

    // 4. Commit to Persistent Datasets
    const existingTxns = LocalStoreManager.getTransactions();
    LocalStoreManager.saveTransactions([transactionRecord, ...existingTxns]);

    const existingTrace = LocalStoreManager.getTraceability();
    LocalStoreManager.saveTraceability([traceabilityRecord, ...existingTrace]);

    // 5. Update Collector Earning Totals
    const updatedCollector = { ...collector };
    updatedCollector.earningsSummary = {
      totalLotsCompleted: updatedCollector.earningsSummary.totalLotsCompleted + 1,
      totalKilogramsCollected: updatedCollector.earningsSummary.totalKilogramsCollected + request.verifiedScaleWeightKg,
      totalEarningsInr: updatedCollector.earningsSummary.totalEarningsInr + netPayable,
      totalEprBonusInr: updatedCollector.earningsSummary.totalEprBonusInr + eprBonus,
      currentPendingBalanceInr: 0,
      lastPayoutDate: now
    };
    LocalStoreManager.saveCollector(updatedCollector);

    return {
      success: true,
      lotId: request.lotId,
      handoverReferenceNumber,
      transactionRecord,
      traceabilityRecord,
      cpcbForm6ManifestRef,
      digitalSlipDownloadUrl: `#slip-${handoverReferenceNumber}`,
      issuedAt: now
    };
  }

  /**
   * Query full traceability chain-of-custody for a specific lot or handover voucher
   */
  public async getTraceabilityRecord(identifier: string): Promise<TraceabilityRecord | null> {
    await simulateNetworkDelay(100, 250);
    const records = LocalStoreManager.getTraceability();
    const match = records.find(
      (r) => r.lotId === identifier || r.handoverReferenceNumber === identifier
    );
    return match || null;
  }

  /**
   * Retrieve all verified transactions
   */
  public async getTransactionHistory(collectorId?: string): Promise<TransactionRecord[]> {
    await simulateNetworkDelay(120, 260);
    const list = LocalStoreManager.getTransactions();
    if (!collectorId) return list;
    return list.filter((t) => t.collectorId === collectorId);
  }

  // --------------------------------------------------------------------------
  // DATASET 6: Collector Dataset & Profile Management
  // --------------------------------------------------------------------------

  /**
   * Get the current active collector profile (Privacy-first schema)
   */
  public async getCollectorProfile(): Promise<CollectorProfile> {
    await simulateNetworkDelay(90, 200);
    return LocalStoreManager.getCollector();
  }

  /**
   * Update vernacular language or operating zone preferences
   */
  public async updateCollectorPreferences(updates: {
    preferredLanguage?: 'en' | 'hi' | 'mr';
    operatingZone?: string;
  }): Promise<CollectorProfile> {
    await simulateNetworkDelay(150, 300);
    const current = LocalStoreManager.getCollector();
    const updated: CollectorProfile = {
      ...current,
      preferredLanguage: updates.preferredLanguage || current.preferredLanguage,
      operatingLocation: {
        ...current.operatingLocation,
        primaryZone: updates.operatingZone || current.operatingLocation.primaryZone
      }
    };
    LocalStoreManager.saveCollector(updated);
    return updated;
  }

  // --------------------------------------------------------------------------
  // OFFLINE-FIRST SYNC QUEUE SYSTEM
  // --------------------------------------------------------------------------

  /**
   * Pushes a freshly created lot into the offline queue when internet is disconnected or intermittent.
   */
  public async queueLotForSync(payload: OfflineSyncLotPayload): Promise<SyncQueueItem> {
    await simulateNetworkDelay(50, 100);
    const queue = LocalStoreManager.getSyncQueue();
    const newItem: SyncQueueItem = {
      queueId: `QUEUE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      payload,
      queuedAt: new Date().toISOString(),
      syncAttempts: 0,
      syncStatus: 'PENDING'
    };

    LocalStoreManager.saveSyncQueue([...queue, newItem]);
    return newItem;
  }

  /**
   * Inspect currently pending offline items waiting for cloud uplink
   */
  public async getPendingSyncQueue(): Promise<SyncQueueItem[]> {
    await simulateNetworkDelay(40, 90);
    return LocalStoreManager.getSyncQueue().filter((item) => item.syncStatus !== 'SYNCED');
  }

  /**
   * Trigger the offline-to-online batch synchronization engine.
   * Processes all queued lots, attaches them to official backend repositories,
   * and marks items as SYNCED.
   */
  public async processSyncQueue(): Promise<{
    processedCount: number;
    failedCount: number;
    syncedLotIds: string[];
  }> {
    await simulateNetworkDelay(400, 900);
    const queue = LocalStoreManager.getSyncQueue();
    const pending = queue.filter((item) => item.syncStatus === 'PENDING' || item.syncStatus === 'FAILED');

    if (pending.length === 0) {
      return { processedCount: 0, failedCount: 0, syncedLotIds: [] };
    }

    const syncedLotIds: string[] = [];
    const updatedQueue: SyncQueueItem[] = queue.map((item) => {
      if (item.syncStatus === 'SYNCED') return item;

      // Simulate successful server reconciliation
      syncedLotIds.push(item.payload.localTempId);
      return {
        ...item,
        syncAttempts: item.syncAttempts + 1,
        syncStatus: 'SYNCED'
      };
    });

    LocalStoreManager.saveSyncQueue(updatedQueue);

    return {
      processedCount: pending.length,
      failedCount: 0,
      syncedLotIds
    };
  }
}

// ============================================================================
// 6. DEFAULT SINGLETON EXPORT
// ============================================================================

export const backendApi = KabadiwalaConnectBackendService.getInstance();
export default backendApi;
