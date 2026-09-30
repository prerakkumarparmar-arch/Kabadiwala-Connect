export type Language = 'en' | 'hi' | 'mr';

export interface UserLocation {
  state: string;
  city: string;
  area?: string;
}

export interface PriceItem {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  category: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  unit: string;
  trend: 'up' | 'stable' | 'down';
  trendText: string;
  gradeNotes: string;
  iconType: 'cable' | 'pcb' | 'battery' | 'monitor' | 'metal' | 'mixed';
}

export interface StepItem {
  number: number;
  title: string;
  titleHi: string;
  titleMr: string;
  description: string;
  descriptionHi: string;
  descriptionMr: string;
  iconName: string;
  detailHint: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  titleHi: string;
  titleMr: string;
  description: string;
  descriptionHi: string;
  descriptionMr: string;
  highlight: string;
  iconName: string;
}

export interface RecyclerPartner {
  id: string;
  name: string;
  licenseNumber: string;
  facilityArea: string;
  rating: number;
  dailyCapacity: string;
  materialsAccepted: string[];
  verifiedBadges: string[];
  phone: string;
}

export interface MockLot {
  id: string;
  collectorName: string;
  phone?: string;
  area: string;
  items: string;
  materialId?: string;
  category?: string;
  subCategory?: string;
  weightKg?: number;
  weight: string;
  estValue: string;
  estimatedValue?: number;
  postedAgo: string;
  images?: string[];
  location?: string;
  createdAt?: number | string;
  status:
    | 'Ready for Pickup'
    | 'Under Offer'
    | 'Verified & Certified'
    | 'Weighed & Certified'
    | 'Verified & Complete'
    | 'Completed'
    | 'PENDING_PICKUP'
    | 'COMPLETED_FORMAL_RECYCLING';
  minPrice?: number;
  maxPrice?: number;
  handoverMethod?: 'pickup' | 'center';
  paymentPreference?: 'cash' | 'upi' | 'bank';
  verifiedAt?: string;
  verifiedBy?: string;
  assignedRecycler?: string;
  isSynced?: boolean;
}

export type Lot = MockLot;
