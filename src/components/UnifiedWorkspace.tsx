import { useState, useEffect } from 'react';
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
  Search,
  MapPin,
  FileText,
  ShieldCheck,
  Coins,
  AlertCircle,
  X,
  Printer,
  Languages,
  CheckCircle
} from 'lucide-react';
import { Language, UserLocation, Lot } from '../types';
import { getStoredLots, saveNewLot, verifyAndCompleteLotInStorage } from '../lotStore';

interface UnifiedWorkspaceProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
}

interface ScrapCategoryOption {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  categoryHi: string;
  minPrice: number;
  maxPrice: number;
  unit: string;
  unitHi: string;
  icon: typeof Cpu;
  badgeEn: string;
  badgeHi: string;
}

const SCRAP_CATEGORIES: ScrapCategoryOption[] = [
  {
    id: 'pcb',
    name: 'PCBs & Motherboards',
    hindiName: 'मदरबोर्ड व सर्किट बोर्ड',
    category: 'Circuit Boards',
    categoryHi: 'सर्किट बोर्ड',
    minPrice: 140,
    maxPrice: 165,
    unit: 'kg',
    unitHi: 'किलो',
    icon: Cpu,
    badgeEn: 'High Value',
    badgeHi: 'ज्यादा भाव',
  },
  {
    id: 'battery',
    name: 'Batteries (Li-ion/Lead)',
    hindiName: 'लिथियम व लेड बैटरी',
    category: 'Energy Storage',
    categoryHi: 'बैटरी स्टोरेज',
    minPrice: 60,
    maxPrice: 70,
    unit: 'kg',
    unitHi: 'किलो',
    icon: BatteryCharging,
    badgeEn: 'Regulated',
    badgeHi: 'सुरक्षित रिसाइक्लिंग',
  },
  {
    id: 'copper-cable',
    name: 'Copper Cables & Wires',
    hindiName: 'तांबे के तार व केबल',
    category: 'Wiring',
    categoryHi: 'वायरिंग व केबल',
    minPrice: 68,
    maxPrice: 76,
    unit: 'kg',
    unitHi: 'किलो',
    icon: Cable,
    badgeEn: 'Fast Cash',
    badgeHi: 'तुरंत नकद',
  },
  {
    id: 'al-heatsink',
    name: 'Aluminium Heat Sinks',
    hindiName: 'एल्युमिनियम मेटल व हीटसिंक',
    category: 'Metals',
    categoryHi: 'धातु व मेटल',
    minPrice: 110,
    maxPrice: 128,
    unit: 'kg',
    unitHi: 'किलो',
    icon: Flame,
    badgeEn: 'Metal Grade',
    badgeHi: 'धातु ग्रेड',
  },
];

const UI_TEXT = {
  en: {
    appTitle: 'E-Nexus',
    tagline: 'Unified Desk',
    headerDesc: 'Kabadiwala Handover Creation & Authorized Recycler Scale Verification',
    changeLoc: 'Change',
    scaleOnline: 'Scale #04 Online',
    step1: 'STEP 1',
    step2: 'STEP 2',
    collectorTitle: 'I am a Collector / Kabadiwala',
    collectorSub: 'Create scrap handover batch & get fair market rates',
    pickCategory: '1. Pick Scrap Category',
    inputWeight: '2. Input Weight',
    weightUnit: 'KG',
    scaleVerifiedNote: 'Digital Scale Verified Benchmark',
    estimatedFairValue: 'ESTIMATED FAIR VALUE',
    zeroMiddleman: 'Fair GPCB registered market rates · Zero middleman cut',
    collectorName: 'Collector Name',
    payoutMode: 'Payout Mode',
    modeUpi: 'UPI / PhonePe',
    modeCash: 'Cash',
    createHandoverBtn: 'Create Handover',
    recyclerTitle: 'I am an Authorized Recycler / Aggregator',
    recyclerSub: 'Verify weight on digital scale & complete settlement',
    pendingVerification: 'Pending Verification',
    filterAll: 'All',
    filterPending: 'Pending',
    filterCompleted: 'Completed',
    searchPlaceholder: 'Search lot ID or material...',
    noLotsFound: 'No lots matching criteria. Use the Collector form on the left to create a handover lot!',
    badgeVerified: '✓ VERIFIED & COMPLETE',
    badgeReady: 'READY FOR PICKUP',
    badgeNew: 'NEW',
    btnSlip: 'View Slip',
    btnVerify: 'Verify & Complete',
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
    bannerSuccess: 'Handover created successfully! Lot is live in the Recycler queue on the right.',
    collectorLabel: 'Collector',
    weightLabel: 'Weight',
    estLabel: 'Est',
    selectLangTitle: 'Select Language',
  },
  hi: {
    appTitle: 'ई-नेक्सस',
    tagline: 'एकीकृत पटल',
    headerDesc: 'कबाड़ीवाला स्क्रैप हैंडओवर निर्माण एवं अधिकृत रिसाइक्लर वजन सत्यापन',
    changeLoc: 'स्थान बदलें',
    scaleOnline: 'डिजिटल कांटा #04 चालू',
    step1: 'चरण 1',
    step2: 'चरण 2',
    collectorTitle: 'कबाड़ीवाला पटल',
    collectorSub: 'स्क्रैप हैंडओवर बनाएं और सरकारी उचित बाजार दर प्राप्त करें',
    pickCategory: '1. स्क्रैप सामान श्रेणी चुनें',
    inputWeight: '2. वजन दर्ज करें',
    weightUnit: 'किग्रा',
    scaleVerifiedNote: 'डिजिटल कांटे द्वारा प्रमाणित बेंचमार्क',
    estimatedFairValue: 'अनुमानित उचित मूल्य',
    zeroMiddleman: 'जीपीसीबी अधिकृत बाजार दरें · बिना किसी दलाली के पूरा भुगतान',
    collectorName: 'कबाड़ीवाला का नाम',
    payoutMode: 'भुगतान का माध्यम',
    modeUpi: 'यूपीआई / फोनपे',
    modeCash: 'नकद',
    createHandoverBtn: 'हैंडओवर लॉट बनाएं',
    recyclerTitle: 'अधिकृत रिसाइक्लर पटल',
    recyclerSub: 'डिजिटल कांटे पर वजन जांचें और 1-क्लिक में रसीद जारी करें',
    pendingVerification: 'सत्यापन बाकी',
    filterAll: 'सभी',
    filterPending: 'लंबित',
    filterCompleted: 'सत्यापित',
    searchPlaceholder: 'लॉट क्रमांक या सामग्री खोजें...',
    noLotsFound: 'कोई लॉट नहीं मिला। बाईं ओर कबाड़ीवाला फॉर्म से नया लॉट जोड़ें!',
    badgeVerified: '✓ सत्यापित एवं संपन्न',
    badgeReady: 'पिकअप हेतु तैयार',
    badgeNew: 'नया',
    btnSlip: 'रसीद देखें',
    btnVerify: 'वजन जांचें व पूर्ण करें',
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
    bannerSuccess: 'हैंडओवर सफलतापूर्वक बनाया गया! लॉट दाईं ओर सत्यापन सूची में तैयार है।',
    collectorLabel: 'कबाड़ीवाला',
    weightLabel: 'वजन',
    estLabel: 'अनुमानित',
    selectLangTitle: 'भाषा चुनें',
  },
  mr: {
    appTitle: 'ई-नेक्सस',
    tagline: 'एकत्रित पटल',
    headerDesc: 'कचरा संकलक ई-कचरा हस्तांतरण आणि अधिकृत रिसायकलर डिजिटल काटा पडताळणी',
    changeLoc: 'बदला',
    scaleOnline: 'डिजिटल काटा #०४ सक्रिय',
    step1: 'टप्पा १',
    step2: 'टप्पा २',
    collectorTitle: 'मी कचरा संकलक आहे',
    collectorSub: 'ई-कचरा हस्तांतरण बॅच तयार करा व योग्य बाजारभाव मिळवा',
    pickCategory: '१. भंगार प्रकार निवडा',
    inputWeight: '२. वजन टाका',
    weightUnit: 'किलो',
    scaleVerifiedNote: 'डिजिटल काट्यानुसार प्रमाणित दर',
    estimatedFairValue: 'अंदाजे योग्य मूल्य',
    zeroMiddleman: 'प्रदूषण नियंत्रण मंडळ अधिकृत दर · कोणतीही दलाली कपात नाही',
    collectorName: 'संकलकाचे नाव',
    payoutMode: 'पैसे मिळवण्याची पद्धत',
    modeUpi: 'UPI / फोनपे',
    modeCash: 'रोख (Cash)',
    createHandoverBtn: 'हस्तांतरण लॉट तयार करा',
    recyclerTitle: 'मी अधिकृत रिसायकलर आहे',
    recyclerSub: 'डिजिटल काट्यावर वजन पडताळा आणि त्वरित व्यवहार पूर्ण करा',
    pendingVerification: 'पडताळणी प्रलंबित',
    filterAll: 'सर्व',
    filterPending: 'प्रलंबित',
    filterCompleted: 'पूर्ण',
    searchPlaceholder: 'लॉट क्रमांक किंवा सामग्री शोधा...',
    noLotsFound: 'कोणताही लॉट सापडला नाही. नवीन लॉट तयार करण्यासाठी डावीकडील फॉर्म वापरा!',
    badgeVerified: '✓ पडताळणी व व्यवहार पूर्ण',
    badgeReady: 'पिकअपसाठी तयार',
    badgeNew: 'नवीन',
    btnSlip: 'पावती पहा',
    btnVerify: 'पडताळा व पूर्ण करा',
    slipTitle: 'अधिकृत हस्तांतरण पावती',
    slipPaid: 'व्यवहार पडताळणी व रक्कम अदा',
    slipStamp: 'डिजिटल काटा शिक्का: स्केल #०४ (नोंदणीकृत #AHM-09)',
    slipLotId: 'लॉट क्रमांक:',
    slipMaterial: 'सामग्री / प्रकार:',
    slipWeight: 'एकूण पडताळलेले वजन:',
    slipCollector: 'संकलक:',
    slipRecycler: 'अधिकृत रिसायकलर:',
    slipRecyclerVal: 'नोंदणीकृत रिसायकलर #AHM-09',
    slipClose: 'पावती बंद करा',
    bannerSuccess: 'हस्तांतरण लॉट यशस्वीरित्या तयार झाला! उजवीकडील रिसायकलर यादीत लॉट उपलब्ध आहे.',
    collectorLabel: 'संकलक',
    weightLabel: 'वजन',
    estLabel: 'अंदाजे',
    selectLangTitle: 'भाषा निवडा',
  }
};

// Helper function to guarantee only ONE language is displayed for lot items
function getCleanLocalizedItem(rawItem: string, isHi: boolean): string {
  const lower = rawItem.toLowerCase();
  if (lower.includes('pcb') || lower.includes('motherboard') || rawItem.includes('मदरबोर्ड') || rawItem.includes('सर्किट')) {
    return isHi ? 'मदरबोर्ड व सर्किट बोर्ड' : 'PCBs & Motherboards';
  }
  if (lower.includes('battery') || rawItem.includes('बैटरी') || rawItem.includes('लिथियम')) {
    return isHi ? 'लिथियम व लेड बैटरी' : 'Batteries (Lithium & Lead)';
  }
  if (lower.includes('copper') || lower.includes('cable') || lower.includes('wire') || rawItem.includes('तांबे') || rawItem.includes('केबल')) {
    return isHi ? 'तांबे के तार व केबल' : 'Copper Cables & Wires';
  }
  if (lower.includes('heatsink') || lower.includes('metal') || lower.includes('aluminium') || rawItem.includes('एल्युमिनियम')) {
    return isHi ? 'एल्युमिनियम मेटल व हीटसिंक' : 'Aluminium Heat Sinks';
  }
  if (lower.includes('smps') || rawItem.includes('एसएमपीएस')) {
    return isHi ? 'एसएमपीएस पावर सप्लाई' : 'SMPS Power Supply';
  }

  if (isHi) {
    const match = rawItem.match(/[\u0900-\u097F\s\u0964\u0965]+/);
    if (match && match[0].trim().length > 2) {
      return match[0].trim().replace(/^\(|\)$/g, '');
    }
  } else {
    const cleaned = rawItem
      .replace(/\s*\([\u0900-\u097F\s\u0964\u0965]+\)/g, '')
      .replace(/\s*\/\s*[\u0900-\u097F\s\u0964\u0965]+/g, '')
      .trim();
    if (cleaned) return cleaned;
  }
  return rawItem;
}

function getCleanLocalizedWeight(rawWeight: string, isHi: boolean): string {
  const num = rawWeight.replace(/[^0-9.]/g, '');
  if (!num) return rawWeight;
  return isHi ? `${num} किग्रा` : `${num} kg`;
}

function getCleanLocalizedCollector(rawName: string, isHi: boolean): string {
  if (isHi) {
    return rawName
      .replace(/Ramesh Bhai/i, 'रमेश भाई')
      .replace(/Sample Collector 1/i, 'संग्रहकर्ता 1')
      .replace(/Sample Scrap Point/i, 'स्क्रैप केंद्र')
      .replace(/Sample Collector 2/i, 'संग्रहकर्ता 2')
      .replace(/\(UPI\)/i, '(यूपीआई)')
      .replace(/\(CASH\)/i, '(नकद)');
  } else {
    return rawName
      .replace(/रमेश भाई/g, 'Ramesh Bhai')
      .replace(/संग्रहकर्ता 1/g, 'Sample Collector 1')
      .replace(/स्क्रैप केंद्र/g, 'Sample Scrap Point')
      .replace(/संग्रहकर्ता 2/g, 'Sample Collector 2')
      .replace(/\(यूपीआई\)/g, '(UPI)')
      .replace(/\(नकद\)/g, '(CASH)');
  }
}

export default function UnifiedWorkspace({
  currentLang = 'en',
  onLanguageChange,
  selectedLocation,
  onChangeLocation,
}: UnifiedWorkspaceProps) {
  // Language State: 'en', 'hi', or 'mr'
  const [selectedLang, setSelectedLang] = useState<Language>(currentLang || 'en');

  useEffect(() => {
    if (currentLang) {
      setSelectedLang(currentLang);
    }
  }, [currentLang]);

  const handleLanguageSelect = (newLang: Language) => {
    setSelectedLang(newLang);
    if (newLang === 'hi' || newLang === 'mr') {
      if (collectorName === 'Ramesh Bhai' || !collectorName.trim()) {
        setCollectorName('रमेश भाई');
      }
    } else {
      if (collectorName === 'रमेश भाई' || !collectorName.trim()) {
        setCollectorName('Ramesh Bhai');
      }
    }
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    try {
      localStorage.setItem('enexus_user_lang', newLang);
    } catch {
      // ignore
    }
  };

  const t = selectedLang === 'mr' ? UI_TEXT.mr : selectedLang === 'hi' ? UI_TEXT.hi : UI_TEXT.en;

  // Collector Form State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('pcb');
  const [weightKg, setWeightKg] = useState<number>(15);
  const [collectorName, setCollectorName] = useState<string>(
    selectedLang === 'hi' ? 'रमेश भाई' : 'Ramesh Bhai'
  );
  const [collectorPhone, setCollectorPhone] = useState<string>('98251 XXXXX');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('upi');
  const [lastCreatedLotId, setLastCreatedLotId] = useState<string | null>(null);

  // Recycler State
  const [lots, setLots] = useState<Lot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [completedLotSlip, setCompletedLotSlip] = useState<Lot | null>(null);
  const [justVerifiedId, setJustVerifiedId] = useState<string | null>(null);

  // Sync lots on mount and listen to storage events
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

  const selectedCategory =
    SCRAP_CATEGORIES.find((c) => c.id === selectedCategoryId) || SCRAP_CATEGORIES[0];

  const estimatedMin = Math.round(weightKg * selectedCategory.minPrice);
  const estimatedMax = Math.round(weightKg * selectedCategory.maxPrice);

  // Handler: Create Handover Lot (Collector action)
  const handleCreateHandover = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (weightKg <= 0) return;

    const isHi = selectedLang === 'hi';
    const newId = `LOT-AHM-${Math.floor(1000 + Math.random() * 9000)}`;
    const displayItem = isHi ? selectedCategory.hindiName : selectedCategory.name;
    const modeLabel = isHi ? (paymentMode === 'upi' ? 'यूपीआई' : 'नकद') : paymentMode.toUpperCase();

    const newLot: Lot = {
      id: newId,
      items: displayItem,
      materialId: selectedCategory.id,
      weightKg: weightKg,
      weight: `${weightKg} ${isHi ? 'किग्रा' : 'kg'}`,
      area: selectedLocation.area || `${selectedLocation.city}, ${selectedLocation.state}`,
      collectorName: `${collectorName} (${modeLabel})`,
      phone: collectorPhone,
      estValue: `₹${estimatedMin.toLocaleString('en-IN')} – ₹${estimatedMax.toLocaleString('en-IN')}`,
      postedAgo: isHi ? 'अभी-अभी' : 'Just now',
      status: 'Ready for Pickup',
      paymentPreference: paymentMode,
      createdAt: Date.now(),
    };

    const updated = saveNewLot(newLot);
    setLots(updated);
    setLastCreatedLotId(newId);

    setTimeout(() => {
      setLastCreatedLotId(null);
    }, 6000);
  };

  // Handler: Verify & Complete Lot (Recycler action)
  const handleVerifyAndComplete = (lotId: string) => {
    const updated = verifyAndCompleteLotInStorage(
      lotId,
      'Gujarat Pollution Control Board Registered Recycler (GPCB #AHM-09)'
    );
    setLots(updated);
    setJustVerifiedId(lotId);

    const completed = updated.find((l) => l.id === lotId);
    if (completed) {
      setCompletedLotSlip(completed);
    }

    setTimeout(() => {
      setJustVerifiedId(null);
    }, 4000);
  };

  // Filter lots
  const filteredLots = lots.filter((lot) => {
    const isCompleted =
      lot.status === 'Verified & Complete' ||
      lot.status === 'Verified & Certified' ||
      lot.status === 'Completed';

    if (statusFilter === 'pending' && isCompleted) return false;
    if (statusFilter === 'completed' && !isCompleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = lot.id.toLowerCase().includes(q);
      const matchItem = lot.items.toLowerCase().includes(q);
      const matchCollector = lot.collectorName.toLowerCase().includes(q);
      return matchId || matchItem || matchCollector;
    }
    return true;
  });

  const pendingCount = lots.filter(
    (l) =>
      l.status !== 'Verified & Complete' &&
      l.status !== 'Verified & Certified' &&
      l.status !== 'Completed'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-16">
      
      {/* AUTHORITATIVE HEADER (Single unified tab header with Language Switcher) */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-xs">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {t.appTitle}
                </h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {t.tagline}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {t.headerDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs">
            
            {/* PROMINENT LANGUAGE SELECTOR: ENGLISH & HINDI */}
            <div
              id="language-selector-control"
              className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 shadow-inner"
              title={t.selectLangTitle}
            >
              <div className="flex items-center gap-1 text-slate-400 px-1.5 py-0.5">
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  id="btn-lang-english"
                  onClick={() => handleLanguageSelect('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedLang === 'en'
                      ? 'bg-emerald-600 text-white shadow-xs font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  aria-pressed={selectedLang === 'en'}
                >
                  English
                </button>
                <button
                  type="button"
                  id="btn-lang-hindi"
                  onClick={() => handleLanguageSelect('hi')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedLang === 'hi'
                      ? 'bg-emerald-600 text-white shadow-xs font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  aria-pressed={selectedLang === 'hi'}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  id="btn-lang-marathi"
                  onClick={() => handleLanguageSelect('mr')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedLang === 'mr'
                      ? 'bg-emerald-600 text-white shadow-xs font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  aria-pressed={selectedLang === 'mr'}
                >
                  मराठी
                </button>
              </div>
            </div>

            {/* Location pill */}
            <button
              type="button"
              onClick={onChangeLocation}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedLocation.city}, {selectedLocation.state}</span>
              <span className="text-emerald-400 font-bold underline ml-1">{t.changeLoc}</span>
            </button>

            {/* Digital Scale Status */}
            <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/80 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold font-mono">{t.scaleOnline}</span>
            </div>
          </div>

        </div>
      </header>

      {/* SUCCESS BANNER WHEN A LOT IS CREATED */}
      {lastCreatedLotId && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-center font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-100" />
          <span>
            {t.bannerSuccess} (ID: <strong>{lastCreatedLotId}</strong>)
          </span>
        </div>
      )}

      {/* MAIN UNIFIED CONTAINER (2 COLUMNS IN ONE SINGLE SCREEN) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =========================================================
              LEFT COLUMN: I AM A COLLECTOR / KABADIWALA (कबाड़ीवाला)
              ========================================================= */}
          <section className="lg:col-span-5 bg-white rounded-3xl border-2 border-emerald-600/30 shadow-md p-5 sm:p-6 relative">
            
            {/* Collector Panel Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    {t.collectorTitle}
                  </h2>
                  <div className="text-xs text-emerald-800 font-bold">
                    {t.collectorSub}
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-950 font-black px-2 py-0.5 rounded-full border border-emerald-300">
                {t.step1}
              </span>
            </div>

            <form onSubmit={handleCreateHandover} className="space-y-4">
              
              {/* Step 1: Pick Scrap Category */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wide mb-1.5">
                  {t.pickCategory}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SCRAP_CATEGORIES.map((cat) => {
                    const isSelected = cat.id === selectedCategoryId;
                    const Icon = cat.icon;
                    const isHi = selectedLang === 'hi';
                    const itemName = isHi ? cat.hindiName : cat.name;
                    const itemCategory = isHi ? cat.categoryHi : cat.category;
                    const badgeText = isHi ? cat.badgeHi : cat.badgeEn;
                    const unitText = isHi ? cat.unitHi : cat.unit;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-700 ring-2 ring-emerald-600/30 shadow-xs'
                            : 'bg-slate-50 hover:bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span
                            className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {badgeText}
                          </span>
                        </div>
                        <div className="text-xs font-black text-slate-950 truncate">
                          {itemName}
                        </div>
                        <div className={`text-[10px] font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {itemCategory}
                        </div>
                        <div className="text-[11px] font-black text-slate-900 mt-0.5">
                          ₹{cat.minPrice}–₹{cat.maxPrice}/{unitText}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Weight Stepper */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wide mb-1.5">
                  {t.inputWeight} ({t.weightUnit})
                </label>
                
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setWeightKg((prev) => Math.max(1, prev - 5))}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-black text-lg text-slate-800 hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    -
                  </button>

                  <div className="text-center">
                    <div className="text-2xl font-black text-slate-950 font-mono">
                      {weightKg} <span className="text-sm font-bold text-slate-600">{t.weightUnit}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold">
                      {t.scaleVerifiedNote}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWeightKg((prev) => prev + 5)}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-black text-lg text-slate-800 hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    +
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[5, 15, 30, 50].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWeightKg(preset)}
                      className={`py-1 text-xs font-black rounded-lg border cursor-pointer transition-colors ${
                        weightKg === preset
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {preset} {t.weightUnit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Instant Price Estimation Box */}
              <div className="bg-emerald-950 text-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-1">
                  <span>{t.estimatedFairValue}</span>
                  <Coins className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  ₹{estimatedMin.toLocaleString('en-IN')} – ₹{estimatedMax.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-300/90 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.zeroMiddleman}</span>
                </div>
              </div>

              {/* Step 4: Collector Name & Payment Preference */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.collectorName}
                  </label>
                  <input
                    type="text"
                    value={collectorName}
                    onChange={(e) => setCollectorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.payoutMode}
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('upi')}
                      className={`py-1.5 rounded-lg font-black border text-center cursor-pointer ${
                        paymentMode === 'upi'
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {t.modeUpi}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('cash')}
                      className={`py-1.5 rounded-lg font-black border text-center cursor-pointer ${
                        paymentMode === 'cash'
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {t.modeCash}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button: Create Handover */}
              <button
                type="submit"
                id="create-handover-unified-btn"
                className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.createHandoverBtn}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

            </form>

          </section>

          {/* =========================================================
              RIGHT COLUMN: I AM AN AUTHORIZED RECYCLER / AGGREGATOR
              ========================================================= */}
          <section className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-800/20 shadow-md p-5 sm:p-6">
            
            {/* Recycler Panel Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Factory className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black text-slate-900">
                      {t.recyclerTitle}
                    </h2>
                    <span className="text-[10px] bg-slate-900 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      {t.step2}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    {t.recyclerSub}
                  </div>
                </div>
              </div>

              {/* Pending Count Badge */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="bg-amber-100 text-amber-950 font-black text-xs px-2.5 py-1 rounded-xl border border-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{pendingCount} {t.pendingVerification}</span>
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                    statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {t.filterAll} ({lots.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                    statusFilter === 'pending' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {t.filterPending} ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                    statusFilter === 'completed' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {t.filterCompleted} ({lots.length - pendingCount})
                </button>
              </div>

              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Live Lots List */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredLots.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  {t.noLotsFound}
                </div>
              ) : (
                filteredLots.map((lot) => {
                  const isCompleted =
                    lot.status === 'Verified & Complete' ||
                    lot.status === 'Verified & Certified' ||
                    lot.status === 'Completed';
                  const isJustVerified = justVerifiedId === lot.id;
                  const isJustCreated = lastCreatedLotId === lot.id;

                  return (
                    <div
                      key={lot.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isJustCreated
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                          : isJustVerified
                          ? 'bg-emerald-50/80 border-emerald-400 shadow-sm'
                          : isCompleted
                          ? 'bg-slate-50/70 border-slate-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900">
                              {lot.id}
                            </span>
                            {isJustCreated && (
                              <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                                {t.badgeNew}
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {isCompleted ? t.badgeVerified : t.badgeReady}
                            </span>
                          </div>

                          <div className="font-black text-slate-950 text-xs mt-1">
                            {getCleanLocalizedItem(lot.items, selectedLang === 'hi')}
                          </div>

                          <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex flex-wrap gap-x-2">
                            <span>{t.collectorLabel}: <strong className="text-slate-800">{getCleanLocalizedCollector(lot.collectorName, selectedLang === 'hi')}</strong></span>
                            <span>·</span>
                            <span>{t.weightLabel}: <strong className="text-slate-800">{getCleanLocalizedWeight(lot.weight, selectedLang === 'hi')}</strong></span>
                            <span>·</span>
                            <span>{t.estLabel}: <strong className="text-emerald-900">{lot.estValue}</strong></span>
                          </div>
                        </div>

                        {/* Verification Action Button */}
                        <div className="shrink-0 flex items-center gap-1.5">
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={() => setCompletedLotSlip(lot)}
                              className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{t.btnSlip}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              id={`verify-unified-${lot.id}`}
                              onClick={() => handleVerifyAndComplete(lot.id)}
                              className="bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs px-3.5 py-2 rounded-xl cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>{t.btnVerify}</span>
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </section>

        </div>
      </main>

      {/* SETTLEMENT SLIP MODAL */}
      {completedLotSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-sm text-white">{t.slipTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setCompletedLotSlip(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">{t.slipPaid}</div>
                <div className="text-xl font-black text-emerald-950">{completedLotSlip.estValue}</div>
                <div className="text-[10px] text-emerald-700">{t.slipStamp}</div>
              </div>

              <div className="space-y-1.5 font-medium text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{t.slipLotId}</span>
                  <span className="font-mono font-bold text-slate-900">{completedLotSlip.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{t.slipMaterial}</span>
                  <span className="font-bold text-slate-900">{getCleanLocalizedItem(completedLotSlip.items, selectedLang === 'hi')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{t.slipWeight}</span>
                  <span className="font-bold text-slate-900">{getCleanLocalizedWeight(completedLotSlip.weight, selectedLang === 'hi')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{t.slipCollector}</span>
                  <span className="font-bold text-slate-900">{getCleanLocalizedCollector(completedLotSlip.collectorName, selectedLang === 'hi')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{t.slipRecycler}</span>
                  <span className="font-bold text-slate-900">{t.slipRecyclerVal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCompletedLotSlip(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                {t.slipClose}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

