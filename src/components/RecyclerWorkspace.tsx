import { useState, useEffect } from 'react';
import {
  Factory,
  Scale,
  Search,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Smartphone,
  X,
  Printer,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Filter,
  CheckCircle
} from 'lucide-react';
import { Language, UserLocation, Lot } from '../types';
import { getStoredLots, verifyAndCompleteLotInStorage } from '../lotStore';

interface RecyclerWorkspaceProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
  onBackToRoleSelection: () => void;
  onSwitchToCollector: () => void;
}

const STRINGS = {
  en: {
    appTitle: 'E-Nexus',
    portalBadge: 'Authorized Recycler Desk',
    regBadge: 'GPCB #AHM-09',
    changeRole: 'Change Role',
    switchToCollector: 'Switch to Collector',
    changeLoc: 'Change',
    scaleOnline: 'Digital Scale #04 Online',
    title: 'Recycler Intake & Scale Verification Desk',
    subtitle: 'Verify incoming scrap lots from local collectors, calibrate digital scale readings, and issue official settlement slips.',
    metricPending: 'Pending Verification',
    metricVerified: 'Completed & Certified',
    metricTotalWeight: 'Total Intake Weight',
    metricScale: 'Active Scale',
    searchPlaceholder: 'Search lot ID, material, or collector...',
    tabAll: 'All Lots',
    tabPending: 'Pending',
    tabVerified: 'Completed',
    noLotsFound: 'No handover lots found matching your search criteria.',
    btnVerify: 'Verify on Digital Scale',
    btnSlip: 'View Official Slip',
    statusVerified: 'VERIFIED & COMPLETE',
    statusReady: 'READY FOR VERIFICATION',
    collectorLabel: 'Collector',
    weightLabel: 'Net Weight',
    estLabel: 'Estimated Value',
    verifiedSuccess: 'Lot verified on Digital Scale #04! Official Settlement Slip generated.',
    slipTitle: 'Official E-Waste Settlement Slip',
    slipPaid: 'TRANSACTION VERIFIED & SETTLED',
    slipStamp: 'Digital Scale Stamp: Scale #04 (GPCB #AHM-09)',
    slipLotId: 'Lot Identifier:',
    slipMaterial: 'Material / Category:',
    slipWeight: 'Net Verified Weight:',
    slipCollector: 'Authorized Collector:',
    slipRecycler: 'Verified Facility:',
    slipRecyclerVal: 'Gujarat Pollution Control Board Registered Recycler (GPCB #AHM-09)',
    slipClose: 'Close Slip',
    printBtn: 'Print Slip',
  },
  hi: {
    appTitle: 'ई-नेक्सस',
    portalBadge: 'अधिकृत रिसाइक्लर डेस्क',
    regBadge: 'जीपीसीबी #AHM-09',
    changeRole: 'भूमिका बदलें',
    switchToCollector: 'कबाड़ीवाला पटल पर जाएं',
    changeLoc: 'स्थान बदलें',
    scaleOnline: 'डिजिटल कांटा #04 चालू',
    title: 'रिसाइक्लर आवक एवं कांटा सत्यापन पटल',
    subtitle: 'कबाड़ीवालों से आने वाले स्क्रैप लॉट की जांच करें, डिजिटल कांटे पर वजन मापें और 1-क्लिक में आधिकारिक भुगतान पर्ची जारी करें।',
    metricPending: 'सत्यापन लंबित',
    metricVerified: 'सत्यापित एवं संपन्न',
    metricTotalWeight: 'कुल आवक वजन',
    metricScale: 'सक्रिय कांटा',
    searchPlaceholder: 'लॉट क्रमांक, सामग्री या कबाड़ीवाला खोजें...',
    tabAll: 'सभी लॉट',
    tabPending: 'लंबित',
    tabVerified: 'सत्यापित',
    noLotsFound: 'खोज के अनुसार कोई हैंडओवर लॉट नहीं मिला।',
    btnVerify: 'डिजिटल कांटे पर वजन जांचें',
    btnSlip: 'आधिकारिक रसीद देखें',
    statusVerified: 'सत्यापित एवं संपन्न',
    statusReady: 'सत्यापन हेतु तैयार',
    collectorLabel: 'कबाड़ीवाला',
    weightLabel: 'कुल वजन',
    estLabel: 'अनुमानित मूल्य',
    verifiedSuccess: 'डिजिटल कांटा #04 पर लॉट सत्यापित हुआ! आधिकारिक पर्ची जारी की गई।',
    slipTitle: 'आधिकारिक ई-कचरा भुगतान पर्ची',
    slipPaid: 'लेन-देन सत्यापित एवं भुगतान संपन्न',
    slipStamp: 'डिजिटल कांटा मुहर: स्केल #04 (जीपीसीबी #AHM-09)',
    slipLotId: 'लॉट क्रमांक:',
    slipMaterial: 'सामग्री / श्रेणी:',
    slipWeight: 'सत्यापित कुल वजन:',
    slipCollector: 'अधिकृत कबाड़ीवाला:',
    slipRecycler: 'सत्यापित केंद्र:',
    slipRecyclerVal: 'गुजरात प्रदूषण नियंत्रण बोर्ड अधिकृत रिसाइक्लर (जीपीसीबी #AHM-09)',
    slipClose: 'पर्ची बंद करें',
    printBtn: 'पर्ची प्रिंट करें',
  },
  mr: {
    appTitle: 'ई-नेक्सस',
    portalBadge: 'अधिकृत रिसायकलर डेस्क',
    regBadge: 'एमपीसीबी / जीपीसीबी #AHM-09',
    changeRole: 'भूमिका बदला',
    switchToCollector: 'कचरा संकलक पटलावर जा',
    changeLoc: 'स्थान बदला',
    scaleOnline: 'डिजिटल काटा #०४ सक्रिय',
    title: 'रिसायकलर आवक व डिजिटल काटा पडताळणी पटल',
    subtitle: 'संकलकांकडून आलेल्या भंगार लॉटची तपासणी करा, डिजिटल काट्यावर वजन मोजा आणि १-क्लिकमध्ये अधिकृत पावती द्या.',
    metricPending: 'पडताळणी प्रलंबित',
    metricVerified: 'पडताळणी पूर्ण',
    metricTotalWeight: 'एकूण आवक वजन',
    metricScale: 'सक्रिय डिजिटल काटा',
    searchPlaceholder: 'लॉट क्रमांक, सामग्री किंवा संकलकाचे नाव शोधा...',
    tabAll: 'सर्व लॉट्स',
    tabPending: 'प्रलंबित',
    tabVerified: 'पडताळणी पूर्ण',
    noLotsFound: 'दिलेल्या निकषांनुसार कोणताही हस्तांतरण लॉट सापडला नाही.',
    btnVerify: 'डिजिटल काट्यावर वजन पडताळा',
    btnSlip: 'अधिकृत पावती पहा',
    statusVerified: 'पडताळणी व व्यवहार पूर्ण',
    statusReady: 'पडताळणीसाठी तयार',
    collectorLabel: 'संकलक',
    weightLabel: 'एकूण वजन',
    estLabel: 'अंदाजे मूल्य',
    verifiedSuccess: 'डिजिटल काटा #०४ वर लॉट यशस्वीरित्या पडताळला! अधिकृत पावती तयार झाली.',
    slipTitle: 'अधिकृत ई-कचरा हस्तांतरण पावती',
    slipPaid: 'व्यवहार पडताळणी व रक्कम अदा',
    slipStamp: 'डिजिटल काटा शिक्का: स्केल #०४ (नोंदणीकृत #AHM-09)',
    slipLotId: 'लॉट क्रमांक:',
    slipMaterial: 'सामग्री / श्रेणी:',
    slipWeight: 'पडताळलेले एकूण वजन:',
    slipCollector: 'अधिकृत संकलक:',
    slipRecycler: 'पडताळलेले केंद्र:',
    slipRecyclerVal: 'प्रदूषण नियंत्रण मंडळ अधिकृत रिसायकलर (#AHM-09)',
    slipClose: 'पावती बंद करा',
    printBtn: 'पावती प्रिंट करा',
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

export default function RecyclerWorkspace({
  currentLang,
  onLanguageChange,
  selectedLocation,
  onChangeLocation,
  onBackToRoleSelection,
  onSwitchToCollector,
}: RecyclerWorkspaceProps) {
  const isHi = currentLang === 'hi';
  const isMr = currentLang === 'mr';
  const t = isMr ? STRINGS.mr : isHi ? STRINGS.hi : STRINGS.en;

  const [lots, setLots] = useState<Lot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [completedLotSlip, setCompletedLotSlip] = useState<Lot | null>(null);
  const [verifiedToast, setVerifiedToast] = useState<string | null>(null);

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

  const handleSetLang = (lang: Language) => {
    onLanguageChange(lang);
    try {
      localStorage.setItem('enexus_user_lang', lang);
    } catch {
      // ignore
    }
  };

  const handleVerifyLot = (lotId: string) => {
    const updated = verifyAndCompleteLotInStorage(
      lotId,
      'Gujarat Pollution Control Board Registered Recycler (GPCB #AHM-09)'
    );
    setLots(updated);

    const verified = updated.find((l) => l.id === lotId);
    if (verified) {
      setCompletedLotSlip(verified);
      setVerifiedToast(`${t.verifiedSuccess} (${lotId})`);
      setTimeout(() => {
        setVerifiedToast(null);
      }, 5000);
    }
  };

  // Metrics
  const pendingLots = lots.filter(
    (l) =>
      l.status !== 'Verified & Complete' &&
      l.status !== 'Verified & Certified' &&
      l.status !== 'Completed'
  );
  const completedLots = lots.filter(
    (l) =>
      l.status === 'Verified & Complete' ||
      l.status === 'Verified & Certified' ||
      l.status === 'Completed'
  );

  const totalWeightKg = lots.reduce((acc, l) => {
    const num = parseFloat(l.weight.replace(/[^0-9.]/g, '')) || 0;
    return acc + num;
  }, 0);

  // Filtered lots
  const filteredLots = lots.filter((lot) => {
    const isCompleted =
      lot.status === 'Verified & Complete' ||
      lot.status === 'Verified & Certified' ||
      lot.status === 'Completed';

    if (activeTab === 'pending' && isCompleted) return false;
    if (activeTab === 'completed' && !isCompleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = lot.id.toLowerCase().includes(q);
      const matchItem = lot.items.toLowerCase().includes(q);
      const matchCollector = lot.collectorName.toLowerCase().includes(q);
      return matchId || matchItem || matchCollector;
    }

    return true;
  });

  const locationText = selectedLocation.area
    ? `${selectedLocation.area}, ${selectedLocation.city}`
    : `${selectedLocation.city}, ${selectedLocation.state}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans pb-16">
      
      {/* Top Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand + Role Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-xs">
              <Factory className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  {t.appTitle}
                </span>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                  {t.portalBadge}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {t.regBadge}
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Change Role, Switch View, Scale status, Location, Language */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Scale Online Pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-400 font-mono">{t.scaleOnline}</span>
            </div>

            {/* Change Role Button */}
            <button
              type="button"
              onClick={onBackToRoleSelection}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
              <span>{t.changeRole}</span>
            </button>

            {/* Switch to Collector */}
            <button
              type="button"
              onClick={onSwitchToCollector}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
              <span>{t.switchToCollector}</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
            </button>

            {/* Location Badge */}
            <button
              type="button"
              onClick={onChangeLocation}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
              title={locationText}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="max-w-[130px] truncate">{locationText}</span>
              <span className="text-[11px] text-emerald-400 font-bold underline ml-0.5">
                {t.changeLoc}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleSetLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-emerald-700 text-white shadow-2xs font-extrabold'
                    : 'text-slate-400 hover:text-white'
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
                    : 'text-slate-400 hover:text-white'
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
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                मराठी
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
        
        {/* Verification Success Toast */}
        {verifiedToast && (
          <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-600 shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 font-black">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm font-bold leading-snug">
                {verifiedToast}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVerifiedToast(null)}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t.metricPending}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {pendingLots.length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t.metricVerified}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
              {completedLots.length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t.metricTotalWeight}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
              {totalWeightKg.toFixed(0)} {isHi ? 'किग्रा' : 'kg'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t.metricScale}
            </div>
            <div className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Scale #04</span>
            </div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-950 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabAll} ({lots.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-100 text-amber-950 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabPending} ({pendingLots.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-emerald-100 text-emerald-950 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabVerified} ({completedLots.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-950 placeholder:text-slate-400 font-semibold"
            />
          </div>

        </div>

        {/* Intake Lots Stream */}
        <div className="space-y-3">
          {filteredLots.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <p className="text-sm font-semibold text-slate-500">
                {t.noLotsFound}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLots.map((lot) => {
                const isCompleted =
                  lot.status === 'Verified & Complete' ||
                  lot.status === 'Verified & Certified' ||
                  lot.status === 'Completed';

                const cleanItem = getCleanLocalizedItem(lot.items, currentLang);
                const cleanWeight = getCleanLocalizedWeight(lot.weight, currentLang);

                return (
                  <div
                    key={lot.id}
                    className={`bg-white rounded-2xl p-5 border transition-all shadow-2xs hover:shadow-md flex flex-col justify-between ${
                      isCompleted ? 'border-emerald-200/90 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      {/* Lot Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black font-mono text-slate-950">
                            {lot.id}
                          </span>
                          <span className="text-xs text-slate-400">
                            · {lot.postedAgo}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {isCompleted ? t.statusVerified : t.statusReady}
                        </span>
                      </div>

                      {/* Material Title */}
                      <div className="text-base font-black text-slate-950 mb-3">
                        {cleanItem}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            {t.collectorLabel}
                          </span>
                          <span className="font-bold text-slate-900 truncate block">
                            {lot.collectorName}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {lot.area}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            {t.weightLabel}
                          </span>
                          <span className="font-black text-slate-900 font-mono block">
                            {cleanWeight}
                          </span>
                          <span className="text-[11px] font-extrabold text-emerald-900 font-mono block">
                            {lot.estValue}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      {isCompleted ? (
                        <>
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{t.slipStamp}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setCompletedLotSlip(lot)}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                          >
                            {t.btnSlip}
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                            <Scale className="w-4 h-4 text-slate-400" />
                            <span>Scale #04 Ready</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleVerifyLot(lot.id)}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>{t.btnVerify}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* Official Settlement Slip Modal */}
      {completedLotSlip && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {t.slipPaid}
                </span>
                <h3 className="text-lg font-black text-white">
                  {t.slipTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCompletedLotSlip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
                  {completedLotSlip.id}
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{t.slipMaterial}</span>
                  <span className="text-slate-900 font-bold">{getCleanLocalizedItem(completedLotSlip.items, currentLang)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{t.slipWeight}</span>
                  <span className="text-slate-900 font-black font-mono">{getCleanLocalizedWeight(completedLotSlip.weight, currentLang)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{t.slipCollector}</span>
                  <span className="text-slate-900 font-bold">{completedLotSlip.collectorName}</span>
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

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.printBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCompletedLotSlip(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-xs"
                >
                  {t.slipClose}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
