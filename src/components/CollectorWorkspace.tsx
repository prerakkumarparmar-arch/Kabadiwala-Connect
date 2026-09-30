import React, { useState, useEffect } from 'react';
import {
  Cpu,
  BatteryCharging,
  Cable,
  Flame,
  Scale,
  CheckCircle2,
  Clock,
  Check,
  Smartphone,
  Factory,
  ArrowRight,
  MapPin,
  FileText,
  ShieldCheck,
  AlertCircle,
  X,
  Printer,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { Language, UserLocation, Lot } from '../types';
import { getStoredLots, saveNewLot } from '../lotStore';
import SpokenPriceBoard from './SpokenPriceBoard';
import AIValuationAndAnomalyGuard from './AIValuationAndAnomalyGuard';
import MobileFrameWrapper from './MobileFrameWrapper';
import CollectorMobileScreen from './CollectorMobileScreen';
import PricePreview from './PricePreview';
import FindRecyclerSection from './FindRecyclerSection';
import SellMaterialModal from './SellMaterialModal';
import backendApi from '../backendApi';

interface CollectorWorkspaceProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
  onBackToRoleSelection: () => void;
  onSwitchToRecycler: () => void;
}

interface ScrapCategoryOption {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  category: string;
  categoryHi: string;
  categoryMr: string;
  minPrice: number;
  maxPrice: number;
  unit: string;
  unitHi: string;
  unitMr: string;
  icon: typeof Cpu;
  badgeEn: string;
  badgeHi: string;
  badgeMr: string;
}

const SCRAP_CATEGORIES: ScrapCategoryOption[] = [
  {
    id: 'pcb',
    name: 'PCBs & Motherboards',
    hindiName: 'मदरबोर्ड व सर्किट बोर्ड',
    marathiName: 'मदरबोर्ड व सर्किट बोर्ड',
    category: 'Circuit Boards',
    categoryHi: 'सर्किट बोर्ड',
    categoryMr: 'सर्किट बोर्ड',
    minPrice: 140,
    maxPrice: 165,
    unit: 'kg',
    unitHi: 'किग्रा',
    unitMr: 'किलो',
    icon: Cpu,
    badgeEn: 'High Value',
    badgeHi: 'ज्यादा भाव',
    badgeMr: 'उच्च दर',
  },
  {
    id: 'battery',
    name: 'Batteries (Li-ion/Lead)',
    hindiName: 'लिथियम व लेड बैटरी',
    marathiName: 'लिथियम व लेड बॅटरी',
    category: 'Energy Storage',
    categoryHi: 'बैटरी स्टोरेज',
    categoryMr: 'बॅटरी साठा',
    minPrice: 60,
    maxPrice: 70,
    unit: 'kg',
    unitHi: 'किग्रा',
    unitMr: 'किलो',
    icon: BatteryCharging,
    badgeEn: 'Regulated',
    badgeHi: 'सुरक्षित रिसाइक्लिंग',
    badgeMr: 'सुरक्षित रिसायकलिंग',
  },
  {
    id: 'copper-cable',
    name: 'Copper Cables & Wires',
    hindiName: 'तांबे के तार व केबल',
    marathiName: 'तांब्याची वायर व केबल',
    category: 'Wiring',
    categoryHi: 'वायरिंग व केबल',
    categoryMr: 'वायरिंग व केबल',
    minPrice: 68,
    maxPrice: 76,
    unit: 'kg',
    unitHi: 'किग्रा',
    unitMr: 'किलो',
    icon: Cable,
    badgeEn: 'Fast Cash',
    badgeHi: 'तुरंत नकद',
    badgeMr: 'त्वरित रोख',
  },
  {
    id: 'al-heatsink',
    name: 'Aluminium Heat Sinks',
    hindiName: 'एल्युमिनियम मेटल व हीटसिंक',
    marathiName: 'अ‍ॅल्युमिनियम धातू व हीटसिंक',
    category: 'Metals',
    categoryHi: 'धातु व मेटल',
    categoryMr: 'धातू व हीटसिंक',
    minPrice: 110,
    maxPrice: 128,
    unit: 'kg',
    unitHi: 'किग्रा',
    unitMr: 'किलो',
    icon: Flame,
    badgeEn: 'Metal Grade',
    badgeHi: 'धातु ग्रेड',
    badgeMr: 'मेटल ग्रेड',
  },
];

const STRINGS = {
  en: {
    appTitle: 'E-Nexus',
    portalBadge: 'Collector Portal',
    changeRole: 'Change Role',
    switchToRecycler: 'Switch to Recycler',
    changeLoc: 'Change',
    title: 'Collector Handover Portal',
    subtitle: 'Create a scrap handover batch, lock in daily fair market rates, and get instant digital payout.',
    step1: '1. Pick Scrap Category',
    step2: '2. Input Weight',
    weightUnit: 'KG',
    scaleBenchmark: 'Digital Scale Verified Benchmark',
    estimatedFairValue: 'ESTIMATED FAIR VALUE',
    zeroMiddleman: 'Fair GPCB registered market rates · Zero middleman cut',
    collectorDetails: '3. Collector Details & Payout',
    collectorName: 'Collector Name',
    payoutMode: 'Payout Mode',
    modeUpi: 'UPI / PhonePe',
    modeCash: 'Cash',
    createHandoverBtn: 'Create Handover Lot',
    successToast: 'Handover lot created successfully! Sent to Authorized Recycler verification queue.',
    recentLotsTitle: 'My Recent Handover Lots',
    recentLotsSub: 'Real-time status updates from digital scales at authorized recycling hubs',
    statusVerified: 'VERIFIED & COMPLETE',
    statusReady: 'READY FOR PICKUP',
    statusNew: 'NEW',
    btnSlip: 'View Settlement Slip',
    slipTitle: 'Official Settlement Slip',
    slipPaid: 'TRANSACTION VERIFIED & PAID',
    slipStamp: 'Digital Scale Stamp: Scale #04 (GPCB #AHM-09)',
    slipLotId: 'Lot Identifier:',
    slipMaterial: 'Material / Category:',
    slipWeight: 'Net Verified Weight:',
    slipCollector: 'Collector:',
    slipRecycler: 'Verified Recycler:',
    slipRecyclerVal: 'GPCB Reg Recycler #AHM-09',
    slipClose: 'Close Slip',
    noLots: 'No lots created yet. Fill the form to create your first handover lot!',
    weightLabel: 'Weight',
    estLabel: 'Estimated Value',
  },
  hi: {
    appTitle: 'ई-नेक्सस',
    portalBadge: 'कबाड़ीवाला पटल',
    changeRole: 'भूमिका बदलें',
    switchToRecycler: 'रिसाइक्लर पटल पर जाएं',
    changeLoc: 'स्थान बदलें',
    title: 'कबाड़ीवाला स्क्रैप हैंडओवर पटल',
    subtitle: 'स्क्रैप हैंडओवर बैच बनाएं, सरकारी उचित बाजार भाव लॉक करें और तुरंत डिजिटल भुगतान पाएं।',
    step1: '1. स्क्रैप सामान श्रेणी चुनें',
    step2: '2. वजन दर्ज करें',
    weightUnit: 'किग्रा',
    scaleBenchmark: 'डिजिटल कांटे द्वारा प्रमाणित बेंचमार्क',
    estimatedFairValue: 'अनुमानित उचित मूल्य',
    zeroMiddleman: 'जीपीसीबी अधिकृत बाजार दरें · बिना किसी दलाली के पूरा भुगतान',
    collectorDetails: '3. कबाड़ीवाला विवरण व भुगतान माध्यम',
    collectorName: 'कबाड़ीवाला का नाम',
    payoutMode: 'भुगतान का माध्यम',
    modeUpi: 'यूपीआई / फोनपे',
    modeCash: 'नकद',
    createHandoverBtn: 'हैंडओवर लॉट बनाएं',
    successToast: 'हैंडओवर लॉट सफलतापूर्वक बनाया गया! अधिकृत रिसाइक्लर सत्यापन सूची में भेजा गया।',
    recentLotsTitle: 'मेरे हालिया हैंडओवर लॉट',
    recentLotsSub: 'अधिकृत रीसाइक्लिंग केंद्रों से डिजिटल कांटे का लाइव स्टेटस',
    statusVerified: 'सत्यापित एवं संपन्न',
    statusReady: 'पिकअप हेतु तैयार',
    statusNew: 'नया',
    btnSlip: 'भुगतान पर्ची देखें',
    slipTitle: 'आधिकारिक ई-कचरा भुगतान पर्ची',
    slipPaid: 'लेन-देन सत्यापित एवं भुगतान संपन्न',
    slipStamp: 'डिजिटल कांटा मुहर: स्केल #04 (जीपीसीबी #AHM-09)',
    slipLotId: 'लॉट क्रमांक:',
    slipMaterial: 'सामग्री / श्रेणी:',
    slipWeight: 'सत्यापित कुल वजन:',
    slipCollector: 'कबाड़ीवाला:',
    slipRecycler: 'अधिकृत रिसाइक्लर:',
    slipRecyclerVal: 'जीपीसीबी अधिकृत रिसाइक्लर #AHM-09',
    slipClose: 'पर्ची बंद करें',
    noLots: 'अभी तक कोई लॉट नहीं बनाया गया है। नया हैंडओवर लॉट बनाने के लिए फॉर्म भरें!',
    weightLabel: 'वजन',
    estLabel: 'अनुमानित मूल्य',
  },
  mr: {
    appTitle: 'ई-नेक्सस',
    portalBadge: 'संकलक पटल',
    changeRole: 'भूमिका बदला',
    switchToRecycler: 'रिसायकलर पटलावर जा',
    changeLoc: 'स्थान बदला',
    title: 'कचरा संकलक ई-कचरा हस्तांतरण पटल',
    subtitle: 'ई-कचरा हस्तांतरण बॅच तयार करा, दैनंदिन योग्य बाजारभाव निश्चित करा आणि त्वरित डिजिटल पैसे मिळवा.',
    step1: '१. भंगार प्रकार निवडा',
    step2: '२. वजन टाका',
    weightUnit: 'किलो',
    scaleBenchmark: 'डिजिटल वजन काट्यानुसार प्रमाणित दर',
    estimatedFairValue: 'अंदाजे योग्य मूल्य',
    zeroMiddleman: 'प्रदूषण नियंत्रण मंडळ अधिकृत दर · कोणतीही दलाली कपात नाही',
    collectorDetails: '३. संकलकाचे नाव व पैसे मिळवण्याची पद्धत',
    collectorName: 'संकलकाचे नाव',
    payoutMode: 'पैसे मिळवण्याची पद्धत',
    modeUpi: 'UPI / फोनपे',
    modeCash: 'रोख (Cash)',
    createHandoverBtn: 'हस्तांतरण लॉट तयार करा',
    successToast: 'हस्तांतरण लॉट यशस्वीरित्या तयार झाला! अधिकृत रिसायकलरकडे पडताळणीसाठी पाठवला आहे.',
    recentLotsTitle: 'माझे अलिकडचे लॉट्स',
    recentLotsSub: 'अधिकृत केंद्रांमधील डिजिटल काट्यावरून थेट स्थिती',
    statusVerified: 'पडताळणी व व्यवहार पूर्ण',
    statusReady: 'पिकअपसाठी तयार',
    statusNew: 'नवीन',
    btnSlip: 'पावती पहा',
    slipTitle: 'अधिकृत ई-कचरा पावती',
    slipPaid: 'व्यवहार पडताळणी व रक्कम अदा',
    slipStamp: 'डिजिटल काटा शिक्का: स्केल #०४ (नोंदणीकृत #AHM-09)',
    slipLotId: 'लॉट क्रमांक:',
    slipMaterial: 'सामग्री / प्रकार:',
    slipWeight: 'एकूण पडताळलेले वजन:',
    slipCollector: 'संकलक:',
    slipRecycler: 'अधिकृत रिसायकलर:',
    slipRecyclerVal: 'नोंदणीकृत रिसायकलर #AHM-09',
    slipClose: 'पावती बंद करा',
    noLots: 'अद्याप कोणतेही लॉट तयार केलेले नाही. पहिला लॉट तयार करण्यासाठी फॉर्म भरा!',
    weightLabel: 'वजन',
    estLabel: 'अंदाजे मूल्य',
  },
};

// Helper for clean single-language material names
function getCleanLocalizedItem(rawItem: string, lang: Language): string {
  const lower = rawItem.toLowerCase();
  if (lower.includes('pcb') || lower.includes('motherboard') || rawItem.includes('मदरबोर्ड') || rawItem.includes('सर्किट')) {
    return lang === 'mr' ? 'मदरबोर्ड व सर्किट बोर्ड' : lang === 'hi' ? 'मदरबोर्ड व सर्किट बोर्ड' : 'PCBs & Motherboards';
  }
  if (lower.includes('battery') || rawItem.includes('बैटरी') || rawItem.includes('बॅटरी') || rawItem.includes('लिथियम')) {
    return lang === 'mr' ? 'लिथियम व लेड बॅटरी' : lang === 'hi' ? 'लिथियम व लेड बैटरी' : 'Batteries (Lithium & Lead)';
  }
  if (lower.includes('copper') || lower.includes('cable') || lower.includes('wire') || rawItem.includes('तांबे') || rawItem.includes('केबल')) {
    return lang === 'mr' ? 'तांब्याची वायर व केबल' : lang === 'hi' ? 'तांबे के तार व केबल' : 'Copper Cables & Wires';
  }
  if (lower.includes('heatsink') || lower.includes('metal') || lower.includes('aluminium') || rawItem.includes('एल्युमिनियम')) {
    return lang === 'mr' ? 'अ‍ॅल्युमिनियम धातू व हीटसिंक' : lang === 'hi' ? 'एल्युमिनियम मेटल व हीटसिंक' : 'Aluminium Heat Sinks';
  }
  return rawItem.replace(/\s*\(.*?\)/g, '').trim();
}

function getCleanLocalizedWeight(rawWeight: string, lang: Language): string {
  const num = rawWeight.replace(/[^0-9.]/g, '');
  const unit = lang === 'mr' ? 'किलो' : lang === 'hi' ? 'किग्रा' : 'kg';
  return `${num} ${unit}`;
}

export default function CollectorWorkspace({
  currentLang,
  onLanguageChange,
  selectedLocation,
  onChangeLocation,
  onBackToRoleSelection,
  onSwitchToRecycler,
}: CollectorWorkspaceProps) {
  const isHi = currentLang === 'hi';
  const isMr = currentLang === 'mr';
  const t = isMr ? STRINGS.mr : isHi ? STRINGS.hi : STRINGS.en;

  const [selectedCatId, setSelectedCatId] = useState<string>('pcb');
  const [weightKg, setWeightKg] = useState<number>(15);
  const [collectorName, setCollectorName] = useState<string>(isMr ? 'बाबू लाल' : isHi ? 'बाबू लाल' : 'Babu Lal');
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'cash'>('upi');
  const [lots, setLots] = useState<Lot[]>([]);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [selectedSlipLot, setSelectedSlipLot] = useState<Lot | null>(null);
  const [assistantTab, setAssistantTab] = useState<'spoken' | 'ai'>('spoken');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // Navigation tab state
  const [workspaceView, setWorkspaceView] = useState<'handover' | 'prices' | 'recyclers'>('handover');
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [sellModalRecyclerId, setSellModalRecyclerId] = useState<string | undefined>(undefined);
  const [sellModalMaterialId, setSellModalMaterialId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLots(getStoredLots());
    const handleUpdate = (e: CustomEvent<Lot[]>) => {
      setLots(e.detail || getStoredLots());
    };
    window.addEventListener('enexus_lots_updated' as any, handleUpdate);
    return () => {
      window.removeEventListener('enexus_lots_updated' as any, handleUpdate);
    };
  }, []);

  const selectedCategory = SCRAP_CATEGORIES.find((c) => c.id === selectedCatId) || SCRAP_CATEGORIES[0];
  const estimatedMin = Math.round(selectedCategory.minPrice * (weightKg || 0));
  const estimatedMax = Math.round(selectedCategory.maxPrice * (weightKg || 0));

  const handleSetLang = (lang: Language) => {
    onLanguageChange(lang);
    try {
      localStorage.setItem('enexus_user_lang', lang);
    } catch {
      // ignore
    }
  };

  const handleCreateHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    const cityCode = (selectedLocation.city || 'AHM').slice(0, 3).toUpperCase();
    const lotNum = Math.floor(1000 + Math.random() * 9000);
    const newLotId = `LOT-${cityCode}-${lotNum}`;

    const newLot: Lot = {
      id: newLotId,
      collectorName: collectorName.trim() || (isMr ? 'अधिकृत कचरा संकलक' : isHi ? 'अधिकृत संग्रहकर्ता' : 'Authorized Collector'),
      phone: '+91 98251 44820',
      area: selectedLocation.area
        ? `${selectedLocation.area}, ${selectedLocation.city}`
        : `${selectedLocation.city} Scrap Catchment`,
      items: isMr ? selectedCategory.marathiName : isHi ? selectedCategory.hindiName : selectedCategory.name,
      materialId: selectedCategory.id,
      weightKg: weightKg,
      weight: `${weightKg} ${isMr ? 'किलो' : isHi ? 'किग्रा' : 'kg'}`,
      estValue: `₹${estimatedMin.toLocaleString('en-IN')} – ₹${estimatedMax.toLocaleString('en-IN')}`,
      postedAgo: isMr ? 'आत्ताच' : isHi ? 'अभी-अभी' : 'Just now',
      createdAt: Date.now(),
      status: 'Ready for Pickup',
      handoverMethod: 'center',
      paymentPreference: payoutMethod,
      assignedRecycler: 'GPCB Authorized Hub #04',
      isSynced: typeof navigator !== 'undefined' ? navigator.onLine : true,
    };

    // Push into offline sync queue and backendApi dataset
    try {
      await backendApi.queueLotForSync({
        localTempId: newLotId,
        collectorId: 'COL-CURRENT-USER',
        collectorName: newLot.collectorName,
        collectorPhone: newLot.phone || '+91 98251 44820',
        materialId: selectedCategory.id,
        materialName: newLot.items,
        estimatedWeightKg: weightKg,
        conditionGrade: 'A_INTACT',
        userLocation: {
          state: selectedLocation.state,
          city: selectedLocation.city,
          area: selectedLocation.area || selectedLocation.city,
        },
        handoverMethod: 'center',
        paymentPreference: payoutMethod,
        quotedExpectedRateInr: selectedCategory.maxPrice,
        createdAtTimestamp: Date.now(),
      });

      if (typeof navigator !== 'undefined' && navigator.onLine) {
        await backendApi.processSyncQueue();
      }
    } catch (err) {
      console.error('Queue sync error', err);
    }

    const updated = saveNewLot(newLot);
    setLots(updated);
    setSuccessBanner(`${t.successToast} (${newLotId})`);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 6000);
  };

  const locationText = selectedLocation.area
    ? `${selectedLocation.area}, ${selectedLocation.city}`
    : `${selectedLocation.city}, ${selectedLocation.state}`;

  if (isPhoneFrame) {
    return (
      <div className="relative min-h-screen bg-slate-950">
        {/* Floating Top Exit Control */}
        <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPhoneFrame(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black shadow-2xl border border-slate-600 cursor-pointer transition-all active:scale-95"
            title="Exit Android Frame Simulation"
          >
            <span>✕</span>
            <span>{isMr ? 'डेस्कटॉप दृश्य' : isHi ? 'डेस्कटॉप दृश्य' : 'Exit Phone Frame'}</span>
          </button>
        </div>

        <MobileFrameWrapper>
          <CollectorMobileScreen
            currentLang={currentLang}
            selectedLocation={selectedLocation}
            onChangeLocation={onChangeLocation}
            onSwitchToRecycler={() => {
              setIsPhoneFrame(false);
              onSwitchToRecycler();
            }}
            onBackToHome={() => setIsPhoneFrame(false)}
          />
        </MobileFrameWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc] text-slate-900 font-sans pb-16">
      
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand + Role Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-xs">
              <Scale className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                  {t.appTitle}
                </span>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {t.portalBadge}
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Change Role, Switch View, Location, Language */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Change Role Button */}
            <button
              type="button"
              onClick={onBackToRoleSelection}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition-all border border-slate-300/80 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.changeRole}</span>
            </button>

            {/* Switch to Recycler */}
            <button
              type="button"
              onClick={onSwitchToRecycler}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Factory className="w-3.5 h-3.5 text-slate-300" />
              <span>{t.switchToRecycler}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* Location Badge */}
            <button
              type="button"
              onClick={onChangeLocation}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950 text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
              title={locationText}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="max-w-[130px] truncate">{locationText}</span>
              <span className="text-[11px] text-emerald-700 font-bold underline ml-0.5">
                {t.changeLoc}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleSetLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-white text-emerald-950 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleSetLang('hi')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentLang === 'hi'
                    ? 'bg-emerald-700 text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleSetLang('mr')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentLang === 'mr'
                    ? 'bg-emerald-700 text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Phone Frame Simulator Toggle */}
            <button
              type="button"
              onClick={() => setIsPhoneFrame(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title={isMr ? 'स्मार्टफोन फ्रेममध्ये पहा' : isHi ? 'एंड्रॉयड फोन फ्रेम में देखें' : 'Simulate Android Mobile Phone'}
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-700" />
              <span className="hidden sm:inline">{isMr ? 'फोन फ्रेम' : isHi ? 'फोन फ्रेम' : 'Phone Frame'}</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        
        {/* Success Alert Banner */}
        {successBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-900 text-white border border-emerald-600 shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 font-black">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm font-bold leading-snug">
                {successBanner}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessBanner(null)}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Workspace Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setWorkspaceView('handover')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                workspaceView === 'handover'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📱 {isMr ? 'हस्तांतरण व सक्रिय लॉट' : isHi ? 'हस्तांतरण व सक्रिय लॉट' : 'Handover & Active Lots'}
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceView('prices')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                workspaceView === 'prices'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 {isMr ? 'थेट दर बोर्ड (CPCB)' : isHi ? 'लाइव दर बोर्ड (CPCB)' : 'Live Price Board'}
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceView('recyclers')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                workspaceView === 'recyclers'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏭 {isMr ? 'अधिकृत रिसायकलर्स' : isHi ? 'अधिकृत रिसाइकलर्स' : 'Authorized Recyclers'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsSellModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>+ {isMr ? 'नवीन लॉट नोंदवा' : isHi ? 'नया लॉट बनाएं' : 'Create New Lot'}</span>
          </button>
        </div>

        {workspaceView === 'prices' ? (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <PricePreview
              currentLang={currentLang}
              selectedLocation={selectedLocation}
              onChangeLocation={onChangeLocation}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              onOpenRecyclerModal={onSwitchToRecycler}
            />
          </div>
        ) : workspaceView === 'recyclers' ? (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <FindRecyclerSection
              currentLang={currentLang}
              selectedLocation={selectedLocation}
              onChangeLocation={onChangeLocation}
              onOpenSellModal={(recId) => {
                setSellModalRecyclerId(recId);
                setIsSellModalOpen(true);
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-md">
            
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  {t.title}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleCreateHandover} className="space-y-6">
              
              {/* Step 1: Pick Scrap Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  {t.step1}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SCRAP_CATEGORIES.map((cat) => {
                    const isSelected = selectedCatId === cat.id;
                    const IconComp = cat.icon;
                    const itemName = isMr ? cat.marathiName : isHi ? cat.hindiName : cat.name;
                    const itemCat = isMr ? cat.categoryMr : isHi ? cat.categoryHi : cat.category;
                    const itemUnit = isMr ? cat.unitMr : isHi ? cat.unitHi : cat.unit;
                    const itemBadge = isMr ? cat.badgeMr : isHi ? cat.badgeHi : cat.badgeEn;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCatId(cat.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-100'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {itemBadge}
                          </span>
                        </div>

                        <div>
                          <div className="text-sm font-black text-slate-950 leading-tight">
                            {itemName}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {itemCat}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-emerald-900 font-mono">
                            ₹{cat.minPrice} – ₹{cat.maxPrice} / {itemUnit}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Input Weight */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t.step2}
                  </label>
                  <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                    {selectedCategory.minPrice} – ₹{selectedCategory.maxPrice} / {isMr ? selectedCategory.unitMr : isHi ? selectedCategory.unitHi : selectedCategory.unit}
                  </span>
                </div>

                {/* Weight Input + Stepper */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWeightKg((w) => Math.max(1, w - 5))}
                    className="w-12 h-12 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-black text-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  >
                    -5
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      value={weightKg}
                      onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full text-center py-2.5 px-4 bg-white border border-slate-300 rounded-xl text-2xl font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                    <span className="absolute right-3 top-3.5 text-xs font-black text-slate-400">
                      {t.weightUnit}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWeightKg((w) => w + 5)}
                    className="w-12 h-12 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-black text-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  >
                    +5
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  {[5, 10, 15, 25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWeightKg(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        weightKg === preset
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                      }`}
                    >
                      {preset} {t.weightUnit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Estimated Fair Value Card */}
              <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800 shadow-md">
                <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
                  <span className="font-bold uppercase tracking-wider">{t.estimatedFairValue}</span>
                  <span className="text-[11px] bg-emerald-900/90 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                    {t.scaleBenchmark}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white mb-2">
                  ₹{estimatedMin.toLocaleString('en-IN')} – ₹{estimatedMax.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-emerald-200/90 font-medium">
                  {t.zeroMiddleman}
                </p>
              </div>

              {/* Step 4: Collector Details & Payout */}
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t.collectorName}
                  </label>
                  <input
                    type="text"
                    required
                    value={collectorName}
                    onChange={(e) => setCollectorName(e.target.value)}
                    placeholder={isMr ? 'आपले नाव टाका' : isHi ? 'अपना नाम दर्ज करें' : 'Enter collector name'}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-950 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t.payoutMode}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('upi')}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        payoutMethod === 'upi'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-100'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {t.modeUpi}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('cash')}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        payoutMethod === 'cash'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-100'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {t.modeCash}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black text-base py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>{t.createHandoverBtn}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </form>
          </div>

          {/* Right Column: Recent Handover Lots & Live Spoken Rates / AI Guardian (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Assistant Mode Toggle (Audio Price Board vs AI Valuation Guardian) */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setAssistantTab('spoken')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  assistantTab === 'spoken'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🔊</span>
                <span>{isMr ? 'बोलणारे दर' : isHi ? 'बोलने वाला भाव' : 'Spoken Rates'}</span>
              </button>
              <button
                type="button"
                onClick={() => setAssistantTab('ai')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  assistantTab === 'ai'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isMr ? 'एआय मूल्य संरक्षक' : isHi ? 'एआई वैल्यूएशन गार्ड' : 'AI Price Guardian'}</span>
              </button>
            </div>

            {/* Active Assistant Component */}
            {assistantTab === 'spoken' ? (
              <SpokenPriceBoard />
            ) : (
              <AIValuationAndAnomalyGuard />
            )}

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                    {t.recentLotsTitle}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {t.recentLotsSub}
                  </p>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  {lots.length}
                </span>
              </div>

              {lots.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 font-medium">
                  {t.noLots}
                </div>
              ) : (
                <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                  {lots.slice(0, 8).map((lot) => {
                    const isVerified =
                      lot.status === 'Verified & Complete' ||
                      lot.status === 'Verified & Certified' ||
                      lot.status === 'Completed';

                    const cleanItem = getCleanLocalizedItem(lot.items, currentLang);
                    const cleanWeight = getCleanLocalizedWeight(lot.weight, currentLang);

                    return (
                      <div
                        key={lot.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isVerified
                            ? 'bg-emerald-50/40 border-emerald-300/80 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-950 font-mono">
                              {lot.id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              · {lot.postedAgo}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isVerified
                                ? 'bg-emerald-600 text-white'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isVerified ? t.statusVerified : t.statusReady}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-slate-900 mb-1">
                          {cleanItem}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100">
                          <span className="font-semibold">{t.weightLabel}: {cleanWeight}</span>
                          <span className="font-extrabold text-emerald-900 font-mono">{lot.estValue}</span>
                        </div>

                        {isVerified && (
                          <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{t.slipStamp}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedSlipLot(lot)}
                              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                            >
                              {t.btnSlip}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
        )}

      </main>

      {/* Official Settlement Slip Modal */}
      {selectedSlipLot && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  {t.slipPaid}
                </span>
                <h3 className="text-lg font-black text-white">
                  {t.slipTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlipLot(null)}
                className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  {t.slipLotId}
                </div>
                <div className="text-xl font-black text-slate-950 font-mono">
                  {selectedSlipLot.id}
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{t.slipMaterial}</span>
                  <span className="text-slate-900 font-bold">{getCleanLocalizedItem(selectedSlipLot.items, currentLang)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{t.slipWeight}</span>
                  <span className="text-slate-900 font-black font-mono">{getCleanLocalizedWeight(selectedSlipLot.weight, currentLang)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{t.slipCollector}</span>
                  <span className="text-slate-900 font-bold">{selectedSlipLot.collectorName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{t.slipRecycler}</span>
                  <span className="text-slate-900 font-bold">{t.slipRecyclerVal}</span>
                </div>
              </div>

              {/* Digital Scale Stamp */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wide">
                  ✓ {t.slipStamp}
                </span>
              </div>

              {/* Close Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlipLot(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
                >
                  {t.slipClose}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Lot Selling / Creation Modal */}
      <SellMaterialModal
        isOpen={isSellModalOpen}
        onClose={() => {
          setIsSellModalOpen(false);
          setSellModalRecyclerId(undefined);
          setSellModalMaterialId(undefined);
        }}
        currentLang={currentLang}
        selectedLocation={selectedLocation}
        preSelectedRecyclerId={sellModalRecyclerId}
        preSelectedMaterialId={sellModalMaterialId}
        onOpenRecyclerDashboard={onSwitchToRecycler}
        onViewLedger={() => {
          setIsSellModalOpen(false);
          setWorkspaceView('prices');
        }}
      />

    </div>
  );
}
