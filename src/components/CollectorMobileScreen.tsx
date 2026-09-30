import { useState, useEffect } from 'react';
import {
  Cpu,
  BatteryCharging,
  Cable,
  Flame,
  Scale,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles,
  RefreshCw,
  Plus,
  Minus,
  ShieldCheck,
  Check,
  FileText,
  Smartphone,
  Info,
  Calculator,
  AlertTriangle,
} from 'lucide-react';
import { Language, UserLocation, Lot } from '../types';
import { getStoredLots, saveNewLot } from '../lotStore';
import { SpokenPriceBoard } from './SpokenPriceBoard';
import { AIValuationAndAnomalyGuard } from './AIValuationAndAnomalyGuard';

interface ScrapCategoryOption {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  unit: string;
  icon: typeof Cpu;
  badge: string;
  description: string;
}

const SCRAP_CATEGORIES: ScrapCategoryOption[] = [
  {
    id: 'pcb',
    name: 'PCBs & Motherboards',
    hindiName: 'मदरबोर्ड व सर्किट',
    marathiName: 'मदरबोर्ड व सर्किट बोर्ड',
    category: 'Circuit Boards',
    minPrice: 140,
    maxPrice: 165,
    unit: 'kg',
    icon: Cpu,
    badge: 'High Value / जास्त भाव',
    description: 'Telecom boards, mobile circuits, and green computer motherboards',
  },
  {
    id: 'battery',
    name: 'Batteries (Li-ion/Lead)',
    hindiName: 'लिथियम व लेड बैटरी',
    marathiName: 'लिथियम व लेड बॅटरी',
    category: 'Energy Storage',
    minPrice: 60,
    maxPrice: 70,
    unit: 'kg',
    icon: BatteryCharging,
    badge: 'Regulated / सुरक्षित',
    description: 'Intact laptop & mobile battery packs, sealed lead batteries',
  },
  {
    id: 'copper-cable',
    name: 'Copper Cables & Wires',
    hindiName: 'तांबे के तार व केबल',
    marathiName: 'तांब्याची वायर व केबल',
    category: 'Wiring',
    minPrice: 68,
    maxPrice: 76,
    unit: 'kg',
    icon: Cable,
    badge: 'Fast Moving / त्वरित रोख',
    description: 'Insulated domestic wiring, communication and power copper cables',
  },
  {
    id: 'al-heatsink',
    name: 'Aluminium Heat Sinks',
    hindiName: 'एल्युमिनियम मेटल',
    marathiName: 'अ‍ॅल्युमिनियम धातू व हीटसिंक',
    category: 'Metals',
    minPrice: 110,
    maxPrice: 128,
    unit: 'kg',
    icon: Flame,
    badge: 'Metal Grade / धातू ग्रेड',
    description: 'Clean extruded aluminium cooling fins and heatsinks from PCs',
  },
];

// Helper for category names in a single language at a time
const getCategoryDisplayName = (cat: ScrapCategoryOption, lang: Language) => {
  if (lang === 'hi') return cat.hindiName;
  if (lang === 'mr') return cat.marathiName;
  return cat.name;
};

const getCategoryBadge = (id: string, lang: Language) => {
  if (lang === 'hi') {
    switch (id) {
      case 'pcb': return 'उच्च मूल्य';
      case 'battery': return 'सुरक्षित';
      case 'copper-cable': return 'त्वरित रोख';
      case 'al-heatsink': return 'धातु ग्रेड';
      default: return 'प्रमाणित';
    }
  }
  if (lang === 'mr') {
    switch (id) {
      case 'pcb': return 'जास्त भाव';
      case 'battery': return 'सुरक्षित';
      case 'copper-cable': return 'त्वरित रोख';
      case 'al-heatsink': return 'धातू ग्रेड';
      default: return 'प्रमाणित';
    }
  }
  switch (id) {
    case 'pcb': return 'High Value';
    case 'battery': return 'Regulated';
    case 'copper-cable': return 'Fast Moving';
    case 'al-heatsink': return 'Metal Grade';
    default: return 'Certified';
  }
};

const UI_TEXT = {
  en: {
    collectorTitle: 'Collector',
    backToHome: '← Back to Home',
    switchToRecycler: 'Switch to Recycler →',
    recyclerTab: 'Recycler Tab',
    change: 'Change',
    step1Title: 'Pick Scrap Category',
    step1Count: '4 Market Grades',
    step2Title: 'Input Weight (kg)',
    step2Scale: 'Digital Scale Ready',
    approxWeight: 'approximate dry weight',
    step3Title: 'Instant Price Estimation & Benchmark Guard',
    benchmark: 'CPCB Benchmark Rate',
    calculatedFor: 'Calculated for',
    handoverMode: 'Handover Mode:',
    hubDropoff: 'Hub Drop-off',
    pickup: 'Pickup',
    createHandover: 'Create Handover',
    storageSync: 'Saves directly to device & syncs with Recycler',
    recentLedger: 'Device Handovers Ledger',
    liveSync: 'Live Sync',
    handoverSaved: 'Handover Saved to Local Storage',
    viewInRecycler: 'View in Recycler Tab',
    fairPriceLabel: 'Fair Mid-Point Price',
    handoverPriceLabel: 'Handover Agreed / Quoted Price',
    setFairPriceBtn: 'Set In-Between Price',
    inBetweenBadge: '✅ Price is in between benchmark rates (Fair Market Value)',
    belowMinBadge: '⚠️ Price is below benchmark range (Underpriced). Tap to set in-between price.',
    aboveMaxBadge: '⚠️ Price is above standard benchmark ceiling. Tap to set in-between price.',
    settlementAmountApprox: 'Settlement Amount (Approx)',
  },
  hi: {
    collectorTitle: 'कलेक्टर',
    backToHome: '← मुख्य पृष्ठ',
    switchToRecycler: 'रीसाइक्लर पर जाएं →',
    recyclerTab: 'रीसाइक्लर टैब',
    change: 'बदलें',
    step1Title: 'स्क्रैप श्रेणी चुनें',
    step1Count: '4 बाज़ार ग्रेड',
    step2Title: 'वज़न दर्ज करें (किग्रा)',
    step2Scale: 'डिजिटल तराजू तैयार',
    approxWeight: 'अनुमानित सूखा वज़न',
    step3Title: 'त्वरित मूल्य अनुमान और बेंचमार्क गार्ड',
    benchmark: 'CPCB मानक दर',
    calculatedFor: 'गणना की गई:',
    handoverMode: 'हस्तांतरण मोड:',
    hubDropoff: 'हब ड्रॉप-ऑफ',
    pickup: 'पिकअप',
    createHandover: 'हैंडओवर लॉट बनाएं',
    storageSync: 'डिवाइस में सुरक्षित और रीसाइक्लर के साथ सिंक',
    recentLedger: 'डिवाइस हैंडओवर खाता',
    liveSync: 'लाइव सिंक',
    handoverSaved: 'हैंडओवर डिवाइस में सुरक्षित किया गया',
    viewInRecycler: 'रीसाइक्लर में देखें',
    fairPriceLabel: 'उचित मध्य दर (Fair Mid Price)',
    handoverPriceLabel: 'हस्तांतरण कोटेड / सहमत मूल्य',
    setFairPriceBtn: 'उचित मध्य दर चुनें',
    inBetweenBadge: '✅ कीमत मानक दरों के बीच में है (सत्यापित उचित बाज़ार मूल्य)',
    belowMinBadge: '⚠️ कीमत मानक सीमा से कम है (नुकसान से बचें)। उचित मध्य दर सेट करें।',
    aboveMaxBadge: '⚠️ कीमत मानक सीमा से अधिक है। उचित मध्य दर सेट करें।',
    settlementAmountApprox: 'निपटान राशि (लगभग)',
  },
  mr: {
    collectorTitle: 'कलेक्टर',
    backToHome: '← मुख्य पृष्ठ',
    switchToRecycler: 'रिसायकलर कडे जा →',
    recyclerTab: 'रिसायकलर टॅब',
    change: 'बदला',
    step1Title: 'कचरा प्रकार निवडा',
    step1Count: '4 बाजार भाव',
    step2Title: 'वजन टाका (किग्रॅ)',
    step2Scale: 'डिजिटल काटा सज्ज',
    approxWeight: 'अंदाजे कोरडे वजन',
    step3Title: 'त्वरित दर अंदाज आणि बेंचमार्क तपासणी',
    benchmark: 'CPCB बेंचमार्क दर',
    calculatedFor: 'हिशोब केला:',
    handoverMode: 'हस्तांतरण पद्धत:',
    hubDropoff: 'हबवर जमा करा',
    pickup: 'पिकअप',
    createHandover: 'हस्तांतरण लॉट तयार करा',
    storageSync: 'डिव्हाइसवर सेव्ह आणि रिसायकलरसह सिंक',
    recentLedger: 'हस्तांतरण नोंदवही',
    liveSync: 'लाइव्ह सिंक',
    handoverSaved: 'लॉट डिव्हाइसवर सुरक्षित झाला',
    viewInRecycler: 'रिसायकलरमध्ये पहा',
    fairPriceLabel: 'योग्य मध्यम दर (Fair Mid Price)',
    handoverPriceLabel: 'हस्तांतरण कोटेड / मान्य दर',
    setFairPriceBtn: 'योग्य मध्यम दर सेट करा',
    inBetweenBadge: '✅ किंमत बेंचमार्क दरांच्या दरम्यान आहे (योग्य दर)',
    belowMinBadge: '⚠️ किंमत मानक मर्यादेपेक्षा कमी आहे. योग्य मध्यम दर निवडा.',
    aboveMaxBadge: '⚠️ किंमत मानक मर्यादेपेक्षा जास्त आहे. योग्य मध्यम दर निवडा.',
    settlementAmountApprox: 'तडजोड रक्कम (अंदाजे)',
  },
};

export interface CollectorMobileScreenProps {
  currentLang?: Language;
  selectedLocation?: UserLocation;
  onChangeLocation?: () => void;
  onSwitchToRecycler?: () => void;
  onBackToHome?: () => void;
}

export function CollectorMobileScreen({
  currentLang = 'en',
  selectedLocation = { city: 'Mumbai', state: 'Maharashtra', area: 'Kurla West' },
  onChangeLocation,
  onSwitchToRecycler,
  onBackToHome,
}: CollectorMobileScreenProps) {
  const t = UI_TEXT[currentLang] || UI_TEXT.en;
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('pcb');
  const [weightKg, setWeightKg] = useState<number>(5);
  const [customQuotedPrice, setCustomQuotedPrice] = useState<number | null>(null);
  const [handoverType, setHandoverType] = useState<'pickup' | 'hub'>('hub');
  const [collectorName, setCollectorName] = useState<string>('Babu Lal (Authorized Collector)');
  const [contactPhone, setContactPhone] = useState<string>('+91 98251 44820');
  const [createdLot, setCreatedLot] = useState<Lot | null>(null);
  const [recentLots, setRecentLots] = useState<Lot[]>([]);
  const [isSuccessBannerOpen, setIsSuccessBannerOpen] = useState(false);

  // Sync lots from storage
  useEffect(() => {
    setRecentLots(getStoredLots());
    const handleUpdate = (e: CustomEvent<Lot[]>) => {
      setRecentLots(e.detail || getStoredLots());
    };
    window.addEventListener('enexus_lots_updated' as any, handleUpdate);
    return () => {
      window.removeEventListener('enexus_lots_updated' as any, handleUpdate);
    };
  }, []);

  const selectedCategory =
    SCRAP_CATEGORIES.find((c) => c.id === selectedCategoryId) || SCRAP_CATEGORIES[0];

  const estimatedMin = Math.round(selectedCategory.minPrice * (weightKg || 0));
  const estimatedMax = Math.round(selectedCategory.maxPrice * (weightKg || 0));
  // Exact fair price in between min and max benchmark rates
  const inBetweenFairPrice = Math.round((estimatedMin + estimatedMax) / 2);

  // Effective price used for the handover: defaults automatically to the in-between fair price
  const effectivePrice = customQuotedPrice !== null ? customQuotedPrice : inBetweenFairPrice;
  const isPriceInBetween = effectivePrice >= estimatedMin && effectivePrice <= estimatedMax;
  const isBelowMin = effectivePrice < estimatedMin;
  const isAboveMax = effectivePrice > estimatedMax;

  const handleAdjustWeight = (delta: number) => {
    setWeightKg((prev) => Math.max(1, Math.min(2000, prev + delta)));
    setCustomQuotedPrice(null);
  };

  const handleSetQuickWeight = (val: number) => {
    setWeightKg(val);
    setCustomQuotedPrice(null);
  };

  const handleCreateHandover = (e: React.FormEvent) => {
    e.preventDefault();

    const cityCode = (selectedLocation.city || 'AHM').slice(0, 3).toUpperCase();
    const lotNum = Math.floor(1000 + Math.random() * 9000);
    const newLotId = `LOT-${cityCode}-${lotNum}`;

    const newLot: Lot = {
      id: newLotId,
      collectorName: collectorName.trim() || 'Local Collector',
      phone: contactPhone.trim() || '+91 98251 44820',
      area: selectedLocation.area
        ? `${selectedLocation.area}, ${selectedLocation.city}`
        : `${selectedLocation.city} Scrap Catchment`,
      items: selectedCategory.name,
      materialId: selectedCategory.id,
      category: selectedCategory.category,
      weightKg: weightKg,
      weight: `${weightKg} kg`,
      estimatedValue: effectivePrice,
      estValue: `Approx ₹${estimatedMin.toLocaleString('en-IN')} – ₹${estimatedMax.toLocaleString('en-IN')}`,
      minPrice: estimatedMin,
      maxPrice: estimatedMax,
      postedAgo: 'Just now',
      createdAt: Date.now(),
      status: 'Ready for Pickup',
      handoverMethod: handoverType === 'pickup' ? 'pickup' : 'center',
      paymentPreference: 'cash',
      assignedRecycler: 'GPCB Authorized E-Waste Hub',
    };

    saveNewLot(newLot);
    setCreatedLot(newLot);
    setIsSuccessBannerOpen(true);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-100 min-h-screen border-x border-slate-200 shadow-sm flex flex-col font-sans pb-16">
      
      {/* Top Role & Navigation Banner */}
      {(onBackToHome || onSwitchToRecycler) && (
        <div className="bg-emerald-950 text-emerald-200 text-xs px-4 py-2 flex items-center justify-between border-b border-emerald-900">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-1 text-white hover:text-emerald-300 font-bold cursor-pointer transition-colors bg-emerald-900/80 hover:bg-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-700/60"
            >
              <span>{t.backToHome}</span>
            </button>
          )}

          {onSwitchToRecycler && (
            <button
              type="button"
              onClick={onSwitchToRecycler}
              className="text-emerald-300 hover:text-white font-semibold underline text-[11px] cursor-pointer ml-auto"
            >
              {t.switchToRecycler}
            </button>
          )}
        </div>
      )}

      {/* Mobile Top App Bar */}
      <div className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black text-sm shadow-2xs">
            <Smartphone className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black tracking-tight text-white">{t.collectorTitle}</h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <button
              type="button"
              onClick={onChangeLocation}
              className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{selectedLocation.city}, {selectedLocation.state}</span>
              <span className="text-emerald-400 font-bold underline ml-0.5">{t.change}</span>
            </button>
          </div>
        </div>

        {/* Recycler Tab Switch Button */}
        {onSwitchToRecycler && (
          <button
            type="button"
            onClick={onSwitchToRecycler}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold py-1.5 px-2.5 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
            title="Open Recycler Dashboard"
          >
            <span>{t.recyclerTab}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Interactive Form */}
      <form onSubmit={handleCreateHandover} className="p-3.5 sm:p-4 space-y-4 flex-1">
        
        {/* Success Alert Banner when lot is created */}
        {isSuccessBannerOpen && createdLot && (
          <div className="bg-emerald-950 text-white p-4 rounded-2xl border border-emerald-600 shadow-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wide">
                    {t.handoverSaved}
                  </span>
                  <div className="text-base font-black text-white">{createdLot.id}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSuccessBannerOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
              {createdLot.weight} • {createdLot.items}
            </p>

            <div className="mt-3 pt-3 border-t border-emerald-800 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs text-white font-black block">
                  Settlement Amount: Approx ₹{createdLot.minPrice?.toLocaleString('en-IN') || estimatedMin.toLocaleString('en-IN')} – ₹{createdLot.maxPrice?.toLocaleString('en-IN') || estimatedMax.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold block">
                  Fair Midpoint Value: ₹{createdLot.estimatedValue?.toLocaleString('en-IN') || inBetweenFairPrice.toLocaleString('en-IN')}
                </span>
              </div>
              {onSwitchToRecycler && (
                <button
                  type="button"
                  onClick={onSwitchToRecycler}
                  className="bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                >
                  <span>{t.viewInRecycler}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-800" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* SPOKEN PRICE BOARD: Real-time Audio-Guided E-Waste Rates */}
        <SpokenPriceBoard initialLanguage={currentLang === 'hi' ? 'hi' : currentLang === 'mr' ? 'mr' : 'en'} />

        {/* AI VALUATION & ANOMALY GUARD */}
        <AIValuationAndAnomalyGuard />

        {/* STEP 1: PICK SCRAP CATEGORY */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-900 text-white text-xs font-black flex items-center justify-center">
                1
              </div>
              <h2 className="text-sm font-black text-slate-900">
                {t.step1Title}
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {t.step1Count}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {SCRAP_CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setCustomQuotedPrice(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-700 ring-2 ring-emerald-600/30 shadow-xs'
                      : 'bg-slate-50 hover:bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-emerald-200 text-emerald-950'
                          : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {getCategoryBadge(cat.id, currentLang)}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-black text-slate-950 leading-tight">
                      {getCategoryDisplayName(cat, currentLang)}
                    </div>
                    <div className="text-xs font-black text-slate-900 mt-1">
                      ₹{cat.minPrice}–₹{cat.maxPrice}/{cat.unit}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-tight flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">{getCategoryDisplayName(selectedCategory, currentLang)}:</strong> {selectedCategory.description}
            </span>
          </p>
        </div>

        {/* STEP 2: INPUT WEIGHT */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-900 text-white text-xs font-black flex items-center justify-center">
                2
              </div>
              <h2 className="text-sm font-black text-slate-900">
                {t.step2Title}
              </h2>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              {t.step2Scale}
            </span>
          </div>

          {/* Stepper & Number Input */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleAdjustWeight(-1)}
              className="w-11 h-11 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 active:scale-95 text-slate-800 flex items-center justify-center font-black shadow-2xs transition-all cursor-pointer"
              aria-label="Decrease weight by 1 kg"
            >
              <Minus className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex-1 text-center">
              <div className="flex items-baseline justify-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value) || 1))}
                  className="w-24 text-3xl font-black text-slate-950 text-center bg-transparent focus:outline-none focus:ring-0"
                />
                <span className="text-sm font-extrabold text-slate-500">kg</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">{t.approxWeight}</div>
            </div>

            <button
              type="button"
              onClick={() => handleAdjustWeight(1)}
              className="w-11 h-11 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 active:scale-95 text-slate-800 flex items-center justify-center font-black shadow-2xs transition-all cursor-pointer"
              aria-label="Increase weight by 1 kg"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {[5, 15, 25, 50].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSetQuickWeight(preset)}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                  weightKg === preset
                    ? 'bg-emerald-900 text-white border-emerald-900'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {preset} kg
              </button>
            ))}
          </div>
        </div>

        {/* STEP 3: INSTANT PRICE ESTIMATION & BENCHMARK GUARD */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 border border-emerald-800 shadow-md space-y-3.5">
          <div className="flex items-center justify-between text-emerald-300 text-xs">
            <span className="font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.step3Title}</span>
            </span>
            <span className="bg-emerald-900/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700/60">
              {t.benchmark}
            </span>
          </div>

          {/* Benchmark Range & In-Between Fair Mid-Point */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-3 rounded-xl border border-emerald-800/60">
            <div>
              <span className="text-[10px] text-emerald-300/80 font-bold block uppercase tracking-wide">
                {t.settlementAmountApprox}
              </span>
              <div className="text-sm font-black text-slate-200 mt-0.5">
                Approx ₹{estimatedMin.toLocaleString('en-IN')} – ₹{estimatedMax.toLocaleString('en-IN')}
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                {t.calculatedFor} {weightKg} kg @ ₹{selectedCategory.minPrice}–₹{selectedCategory.maxPrice}/kg
              </span>
            </div>

            <div className="border-l border-emerald-800/60 pl-3">
              <span className="text-[10px] text-emerald-400 font-extrabold block uppercase tracking-wide">
                {t.fairPriceLabel}
              </span>
              <div className="text-base font-black text-emerald-300 mt-0.5 flex items-center gap-1">
                <span>₹{inBetweenFairPrice.toLocaleString('en-IN')}</span>
                <span className="text-[9px] bg-emerald-700/50 text-emerald-200 px-1.5 py-0.2 rounded font-semibold">Mid</span>
              </div>
              <span className="text-[9px] text-emerald-200/70 block mt-0.5">
                Exact in-between benchmark
              </span>
            </div>
          </div>

          {/* Handover Quoted Offer Price Input */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-emerald-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.handoverPriceLabel}</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomQuotedPrice(inBetweenFairPrice)}
                className="text-[10px] bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-lg border border-emerald-500/40 cursor-pointer transition-colors shadow-2xs"
                title="Reset to exact in-between fair benchmark price"
              >
                {t.setFairPriceBtn} (₹{inBetweenFairPrice.toLocaleString('en-IN')})
              </button>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-400 font-black text-base">
                ₹
              </span>
              <input
                type="number"
                min={1}
                value={effectivePrice}
                onChange={(e) => setCustomQuotedPrice(Math.max(1, Number(e.target.value) || 0))}
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-emerald-600/70 rounded-xl text-white font-black text-lg focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>

            {/* In-Between Price Verification Status */}
            <div className={`p-2.5 rounded-xl text-[11px] font-bold flex items-start gap-2 ${
              isPriceInBetween 
                ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/50' 
                : isBelowMin
                ? 'bg-amber-950/80 text-amber-200 border border-amber-500/60'
                : 'bg-indigo-950/80 text-indigo-200 border border-indigo-500/60'
            }`}>
              {isPriceInBetween ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              )}
              <div className="flex-1">
                <span>
                  {isPriceInBetween
                    ? `${t.inBetweenBadge} (Approx ₹${estimatedMin.toLocaleString('en-IN')} – ₹${estimatedMax.toLocaleString('en-IN')})`
                    : isBelowMin
                    ? t.belowMinBadge
                    : t.aboveMaxBadge}
                </span>
                {!isPriceInBetween && (
                  <button
                    type="button"
                    onClick={() => setCustomQuotedPrice(inBetweenFairPrice)}
                    className="block mt-1 text-xs font-black underline text-emerald-300 hover:text-white cursor-pointer"
                  >
                    👉 Click to apply Fair In-Between Price: ₹{inBetweenFairPrice.toLocaleString('en-IN')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STEP 4: PRIMARY ACTION: 'CREATE HANDOVER' */}
        <div className="space-y-2 pt-1">
          <button
            type="submit"
            id="create-handover-btn"
            className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-[0.99] text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.createHandover}</span>
            <span className="bg-emerald-900/80 px-2 py-0.5 rounded-lg text-emerald-200 text-xs font-mono font-bold">
              Approx ₹{estimatedMin.toLocaleString('en-IN')} – ₹{estimatedMax.toLocaleString('en-IN')}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.storageSync}</span>
          </p>
        </div>

        {/* RECENT LOCAL HANDOVERS STREAM */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-800" />
              <span>{t.recentLedger} ({recentLots.length})</span>
            </div>
            <span className="text-[10px] text-slate-500">{t.liveSync}</span>
          </div>

          <div className="space-y-2">
            {recentLots.slice(0, 3).map((lot) => {
              const isCompleted =
                lot.status === 'Verified & Complete' ||
                lot.status === 'Verified & Certified' ||
                lot.status === 'Completed';

              return (
                <div
                  key={lot.id}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">{lot.id}</span>
                      <span className="text-[10px] text-slate-400 font-sans">{lot.postedAgo}</span>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {lot.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{lot.items} ({lot.weight})</span>
                    <span className="text-emerald-950 font-black">
                      {lot.estValue.includes('Approx') ? lot.estValue : `Approx ${lot.estValue}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Change Role or Return to Home Switcher */}
        {(onBackToHome || onSwitchToRecycler) && (
          <div className="pt-4 border-t border-slate-200 text-center space-y-2.5">
            <div className="text-xs text-slate-600 font-semibold">
              Change role or return to home? / भूमिका बदलें:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition-colors"
                >
                  <span>← Back to Home</span>
                </button>
              )}
              {onSwitchToRecycler && (
                <button
                  type="button"
                  onClick={onSwitchToRecycler}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition-colors"
                >
                  <span>Recycler Desk →</span>
                </button>
              )}
            </div>
          </div>
        )}

      </form>
    </div>
  );
}

export default CollectorMobileScreen;
