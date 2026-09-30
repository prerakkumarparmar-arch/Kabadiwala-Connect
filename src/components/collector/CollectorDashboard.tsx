import { useState, useEffect } from 'react';
import {
  PackagePlus,
  IndianRupee,
  Recycle,
  ClipboardList,
  Wallet,
  ArrowRight,
  MapPin,
  Check,
  CircleDot,
  Circle,
  AlertTriangle,
  Volume2,
  Cable,
  Cpu,
  Battery,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Factory
} from 'lucide-react';
import { Language, UserLocation, Lot } from '../../types';
import CollectorHeader from './CollectorHeader';
import CollectorBottomNav, { CollectorTab } from './CollectorBottomNav';
import {
  LotDetailModal,
  PricesModal,
  RecyclersModal,
  EarningsModal,
  SafetyModal,
  AccountModal,
} from './CollectorSubViews';
import { getStoredLots, verifyLotInStorage } from '../../lotStore';

interface CollectorDashboardProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
  onOpenSellModal: () => void;
  onExitToLanding: () => void;
  onOpenRecyclerModal?: () => void;
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

export default function CollectorDashboard({
  currentLang,
  onLanguageChange,
  selectedLocation,
  onChangeLocation,
  onOpenSellModal,
  onExitToLanding,
  onOpenRecyclerModal,
  currentRoute = '/collector',
  onNavigate,
}: CollectorDashboardProps) {
  const [lots, setLots] = useState<Lot[]>(getStoredLots());

  useEffect(() => {
    setLots(getStoredLots());
    const handleLotsUpdated = (e: CustomEvent<Lot[]>) => {
      setLots(e.detail || getStoredLots());
    };
    window.addEventListener('enexus_lots_updated' as any, handleLotsUpdated);
    return () => {
      window.removeEventListener('enexus_lots_updated' as any, handleLotsUpdated);
    };
  }, []);
  // Navigation & Sub-views state
  const [activeSubView, setActiveSubView] = useState<
    'none' | 'lotDetail' | 'allLots' | 'prices' | 'recyclers' | 'earnings' | 'safety' | 'account'
  >(() => {
    if (currentRoute === '/sell') return 'none';
    if (currentRoute === '/prices') return 'prices';
    if (currentRoute === '/recyclers') return 'recyclers';
    if (currentRoute === '/lots' || currentRoute === '/lots/EW1024') return 'lotDetail';
    if (currentRoute === '/earnings') return 'earnings';
    if (currentRoute === '/safety') return 'safety';
    if (currentRoute === '/account') return 'account';
    return 'none';
  });

  // Offline mode toggle
  const [isOnline, setIsOnline] = useState(true);

  // Audio Speech state for Safety reminder
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Active bottom navigation tab
  const getActiveTab = (): CollectorTab => {
    if (activeSubView === 'prices') return 'prices';
    if (activeSubView === 'lotDetail' || activeSubView === 'allLots') return 'lots';
    if (activeSubView === 'account') return 'account';
    return 'home';
  };

  const handleSelectTab = (tab: CollectorTab) => {
    if (tab === 'home') {
      setActiveSubView('none');
      if (onNavigate) onNavigate('/collector');
    } else if (tab === 'sell') {
      onOpenSellModal();
      if (onNavigate) onNavigate('/sell');
    } else if (tab === 'prices') {
      setActiveSubView('prices');
      if (onNavigate) onNavigate('/prices');
    } else if (tab === 'lots') {
      setActiveSubView('lotDetail');
      if (onNavigate) onNavigate('/lots');
    } else if (tab === 'account') {
      setActiveSubView('account');
      if (onNavigate) onNavigate('/account');
    }
  };

  const handleRouteNavigate = (route: string) => {
    if (onNavigate) onNavigate(route);
    if (route === '/sell') {
      onOpenSellModal();
    } else if (route === '/prices') {
      setActiveSubView('prices');
    } else if (route === '/recyclers') {
      setActiveSubView('recyclers');
    } else if (route === '/lots' || route === '/lots/EW1024') {
      setActiveSubView('lotDetail');
    } else if (route === '/earnings') {
      setActiveSubView('earnings');
    } else if (route === '/safety') {
      setActiveSubView('safety');
    } else if (route === '/account') {
      setActiveSubView('account');
    }
  };

  const formattedLocation = selectedLocation.area
    ? `${selectedLocation.area}, ${selectedLocation.city}, ${selectedLocation.state}`
    : `${selectedLocation.city}, ${selectedLocation.state}`;

  // Voice playback handler for safety reminder
  const handleListenSafety = () => {
    setIsAudioPlaying(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'Battery Safety: Do not puncture, crush or burn batteries.';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsAudioPlaying(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-24 md:pb-12 flex flex-col font-sans">
      
      {/* 1. COMPACT COLLECTOR APP HEADER */}
      <CollectorHeader
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        selectedLocation={selectedLocation}
        onChangeLocation={onChangeLocation}
        onExitToLanding={onExitToLanding}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
      />

      {/* Main Container */}
      <main className="w-full max-w-lg md:max-w-2xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 space-y-4">
        
        {/* ==================================================
            2. PRIMARY ACTION: SELL MATERIAL
           ================================================== */}
        <section aria-label="Primary Action">
          <div
            id="collector-sell-banner"
            onClick={() => handleRouteNavigate('/sell')}
            className="group relative bg-emerald-900 hover:bg-emerald-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden border border-emerald-800"
          >
            {/* Subtle decorative glow */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="space-y-1 sm:space-y-1.5 flex-1">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-300 block">
                  Quick Lot Dispatch
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  SELL MATERIAL
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                  Create a new e-waste lot
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRouteNavigate('/sell');
                    }}
                    className="inline-flex items-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs sm:text-sm py-2.5 px-4 sm:px-5 rounded-xl shadow-xs transition-all cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Create New Lot</span>
                    <ArrowRight className="w-4 h-4 text-emerald-800" />
                  </button>
                </div>
              </div>

              {/* Large Touch-friendly Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-800/80 border border-emerald-700/60 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <PackagePlus className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-300" />
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            3. QUICK ACTIONS (4 LARGE SHORTCUT CARDS)
           ================================================== */}
        <section aria-label="Quick Actions">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            
            {/* 1. Today's Prices */}
            <button
              type="button"
              id="quick-action-prices"
              onClick={() => handleRouteNavigate('/prices')}
              className="bg-white hover:bg-emerald-50/50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 shadow-2xs hover:shadow-sm text-left transition-all flex flex-col justify-between cursor-pointer min-h-[96px]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-2">
                <IndianRupee className="w-5 h-5 font-black" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  ₹ Today’s Prices
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                  Check indicative local rates
                </div>
              </div>
            </button>

            {/* 2. Find Recycler */}
            <button
              type="button"
              id="quick-action-recyclers"
              onClick={() => handleRouteNavigate('/recyclers')}
              className="bg-white hover:bg-emerald-50/50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 shadow-2xs hover:shadow-sm text-left transition-all flex flex-col justify-between cursor-pointer min-h-[96px]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-2">
                <Recycle className="w-5 h-5 font-black" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  ♻ Find Recycler
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                  Find authorized recyclers near you
                </div>
              </div>
            </button>

            {/* 3. My Lots */}
            <button
              type="button"
              id="quick-action-lots"
              onClick={() => handleRouteNavigate('/lots')}
              className="bg-white hover:bg-emerald-50/50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 shadow-2xs hover:shadow-sm text-left transition-all flex flex-col justify-between cursor-pointer min-h-[96px]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-2">
                <ClipboardList className="w-5 h-5 font-black" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  📦 My Lots
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                  Track active and completed lots
                </div>
              </div>
            </button>

            {/* 4. My Earnings */}
            <button
              type="button"
              id="quick-action-earnings"
              onClick={() => handleRouteNavigate('/earnings')}
              className="bg-white hover:bg-emerald-50/50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 shadow-2xs hover:shadow-sm text-left transition-all flex flex-col justify-between cursor-pointer min-h-[96px]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-2">
                <Wallet className="w-5 h-5 font-black" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  ₹ My Earnings
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                  View payments and transaction history
                </div>
              </div>
            </button>

          </div>
        </section>

        {/* ==================================================
            4. TODAY’S PRICE PREVIEW
           ================================================== */}
        <section
          aria-label="Today's Prices Preview"
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 leading-tight">
                Today’s Prices
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-600 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{formattedLocation}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full shrink-0">
              SAMPLE DATA
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium leading-normal">
            Prototype sample rates – not live market quotations.
          </p>

          {/* 3 Simple Material Cards */}
          <div className="grid grid-cols-3 gap-2">
            
            {/* Card 1: Copper Cable */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-center flex flex-col justify-between">
              <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center mb-1">
                <Cable className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Copper Cable
              </div>
              <div className="text-xs sm:text-sm font-black text-emerald-950 mt-1">
                ₹68–₹76/kg
              </div>
            </div>

            {/* Card 2: PCB */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-center flex flex-col justify-between">
              <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center mb-1">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                PCB
              </div>
              <div className="text-xs sm:text-sm font-black text-emerald-950 mt-1">
                ₹140–₹165/kg
              </div>
            </div>

            {/* Card 3: Battery */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-center flex flex-col justify-between">
              <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center mb-1">
                <Battery className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Battery
              </div>
              <div className="text-xs sm:text-sm font-black text-emerald-950 mt-1">
                ₹60–₹70/kg
              </div>
            </div>

          </div>

          {/* View All Prices Link */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => handleRouteNavigate('/prices')}
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer underline underline-offset-2"
            >
              <span>View All Prices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* ==================================================
            5. ACTIVE LOT (Dynamic from State & LocalStorage)
           ================================================== */}
        {(() => {
          const activeLot = lots.length > 0 ? lots[0] : null;
          const isVerified =
            activeLot &&
            (activeLot.status === 'Verified & Certified' || activeLot.status === 'Weighed & Certified');

          return (
            <section
              aria-label="Active Lot"
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3.5"
            >
              {/* Header with status badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isVerified ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'
                    }`}
                  />
                  <h3 className="text-base sm:text-lg font-black text-slate-950">
                    Active Lot
                  </h3>
                </div>
                {/* Status Badge */}
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                    isVerified
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {isVerified ? 'VERIFIED & CERTIFIED' : 'READY FOR PICKUP'}
                </span>
              </div>

              {/* Consistent Dynamic Data Grid */}
              <div className="bg-slate-50 rounded-2xl p-3 sm:p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Lot ID:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {activeLot ? activeLot.id : 'EW1024'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Material:</span>
                  <span className="font-bold text-slate-900">
                    {activeLot ? activeLot.items : 'PCB'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Approximate Weight:</span>
                  <span className="font-bold text-slate-900">
                    {activeLot ? activeLot.weight : '8.5 kg'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Estimated Value:</span>
                  <span className="font-extrabold text-emerald-950 text-sm">
                    {activeLot ? activeLot.estValue : '₹840–₹980'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/70">
                  <span className="text-slate-500 font-semibold">Assigned Recycler / Hub:</span>
                  <div className="text-right font-bold text-slate-900">
                    {activeLot?.assignedRecycler || 'GreenCycle Recycling'}
                    <span className="text-[10px] text-slate-500 block font-normal">
                      {isVerified ? 'Weighed & Certified' : 'Calibrated Scale Check Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini-Progress Indicator */}
              <div className="pt-1">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Lot Progress
                </div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  
                  {/* Step 1: Lot Created ✓ */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs mb-1">
                      ✓
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-tight">
                      Created
                    </span>
                  </div>

                  {/* Step 2: Recycler Matched ✓ */}
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs mb-1">
                      ✓
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-tight">
                      Matched
                    </span>
                  </div>

                  {/* Step 3: Scale Verification */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-2xs mb-1 ${
                        isVerified
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-white ring-2 ring-amber-200 animate-pulse'
                      }`}
                    >
                      {isVerified ? '✓' : '●'}
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] leading-tight ${
                        isVerified ? 'font-bold text-slate-900' : 'font-extrabold text-amber-950'
                      }`}
                    >
                      {isVerified ? 'Verified' : 'Verify'}
                    </span>
                  </div>

                  {/* Step 4: Handover & Payout */}
                  <div
                    className={`flex flex-col items-center ${
                      isVerified ? '' : 'opacity-50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                        isVerified
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isVerified ? '✓' : '○'}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 leading-tight">
                      {isVerified ? 'Certified' : 'Pending'}
                    </span>
                  </div>

                </div>
              </div>

              {/* Single Click Verify Button (for testing & instant recycler workflow) */}
              {!isVerified && activeLot && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = verifyLotInStorage(activeLot.id);
                      setLots(updated);
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>1-Click Verify Active Lot (Recycler Scale)</span>
                  </button>
                </div>
              )}

              {/* Action Buttons: Track Lot & View All Lots */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleRouteNavigate('/lots')}
                  className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Track Lot Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRouteNavigate('/prices')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition-all border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Price Ledger</span>
                </button>
              </div>
            </section>
          );
        })()}

        {/* ==================================================
            6. SAFETY REMINDER
           ================================================== */}
        <section
          aria-label="Safety Reminder"
          className="bg-amber-50/90 border border-amber-300/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-900">
              Safety Reminder
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-black text-amber-950">
              Battery Safety
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-amber-900/90 leading-relaxed">
              “Do not puncture, crush or burn batteries.”
            </p>
          </div>

          <div className="flex items-center gap-2.5 pt-3">
            <button
              type="button"
              onClick={handleListenSafety}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAudioPlaying
                  ? 'bg-amber-600 text-white shadow-xs animate-pulse'
                  : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-300/90'
              }`}
              title="Listen to safety reminder aloud"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-800" />
              <span>{isAudioPlaying ? 'Speaking...' : 'Listen'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRouteNavigate('/safety')}
              className="px-3 py-2 rounded-xl text-xs font-bold text-amber-950 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View Safety Guide</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>

        {/* ==================================================
            7. EARNINGS SUMMARY
           ================================================== */}
        <section
          aria-label="Earnings Summary"
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-950">
              Earnings
            </h3>
            <button
              type="button"
              onClick={() => handleRouteNavigate('/earnings')}
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
            >
              View Earnings
            </button>
          </div>

          {/* Cards: Total Earned, Pending, This Month */}
          <div className="grid grid-cols-3 gap-2 text-center">
            
            {/* Total Earned: ₹18,420 */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Total Earned
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-950 block mt-0.5">
                ₹18,420
              </span>
            </div>

            {/* Pending: ₹1,260 */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                Pending
              </span>
              <span className="text-sm sm:text-base font-black text-amber-950 block mt-0.5">
                ₹1,260
              </span>
            </div>

            {/* This Month: ₹3,840 */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                This Month
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                ₹3,840
              </span>
            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="font-medium">Sample transaction data</span>
            <button
              type="button"
              onClick={() => handleRouteNavigate('/earnings')}
              className="text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>History</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>

      </main>

      {/* ==================================================
          8. BOTTOM NAVIGATION
         ================================================== */}
      <CollectorBottomNav
        activeTab={getActiveTab()}
        onSelectTab={handleSelectTab}
      />

      {/* ==================================================
          SUB-VIEWS & MODALS
         ================================================== */}
      <LotDetailModal
        isOpen={activeSubView === 'lotDetail' || activeSubView === 'allLots'}
        onClose={() => {
          setActiveSubView('none');
          if (onNavigate) onNavigate('/collector');
        }}
        lotId="EW1024"
      />

      <PricesModal
        isOpen={activeSubView === 'prices'}
        onClose={() => {
          setActiveSubView('none');
          if (onNavigate) onNavigate('/collector');
        }}
        selectedLocation={selectedLocation}
        currentLang={currentLang}
        onOpenSellModal={onOpenSellModal}
      />

      <RecyclersModal
        isOpen={activeSubView === 'recyclers'}
        onClose={() => {
          setActiveSubView('none');
          if (onNavigate) onNavigate('/collector');
        }}
        selectedLocation={selectedLocation}
        currentLang={currentLang}
      />

      <EarningsModal
        isOpen={activeSubView === 'earnings'}
        onClose={() => {
          setActiveSubView('none');
          if (onNavigate) onNavigate('/collector');
        }}
      />

      <SafetyModal
        isOpen={activeSubView === 'safety'}
        onClose={() => {
          setActiveSubView('none');
          if (onNavigate) onNavigate('/collector');
        }}
      />

      <AccountModal
        isOpen={activeSubView === 'account'}
        onClose={() => {
          setActiveSubView('none');
          if (onNavigate) onNavigate('/collector');
        }}
        selectedLocation={selectedLocation}
        onChangeLocation={onChangeLocation}
        onExitToLanding={onExitToLanding}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
      />

    </div>
  );
}
