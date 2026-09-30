import React, { useState } from 'react';
import { Truck, Factory, ArrowRight, CheckCircle2, ShieldCheck, Banknote, Smartphone, MapPin, Sparkles, Scale } from 'lucide-react';
import { Language, UserLocation } from '../types';
import PricePreview from './PricePreview';
import FindRecyclerSection from './FindRecyclerSection';
import SellMaterialModal from './SellMaterialModal';

interface RoleSelectScreenProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
  onSelectCollector: () => void;
  onSelectRecycler: () => void;
}

const STRINGS = {
  en: {
    appTitle: 'E-Nexus',
    appSubtitle: 'E-Waste Bridge',
    changeLoc: 'Change',
    badge: 'Select Your Portal',
    heading: 'Who Are You Today?',
    subheading: 'Choose your portal to get started with transparent fair rates and direct digital scale verification.',
    collectorTitle: 'Collector / Kabadiwala',
    collectorBadge: 'Informal Waste Collector',
    collectorDesc: 'Check daily benchmark scrap prices, calculate fair value by weight, and create instant digital handover lots.',
    collectorStep1: '1. Select Scrap',
    collectorStep2: '2. Input Weight',
    collectorStep3: '3. Instant Payout',
    collectorBenefit1: 'Fair CPCB daily market scrap rates',
    collectorBenefit2: 'Zero middleman deductions or commission',
    collectorBenefit3: 'Instant settlement via UPI or Cash',
    collectorBtn: 'Continue as Collector',
    recyclerTitle: 'Authorized Recycler',
    recyclerBadge: 'GPCB Registered Aggregator',
    recyclerDesc: 'Receive incoming scrap batches from collectors, verify weights on certified digital scales, and issue compliance slips.',
    recyclerStep1: '1. Live Intake',
    recyclerStep2: '2. Scale Verify',
    recyclerStep3: '3. Official Slip',
    recyclerBenefit1: 'GPCB authorized compliance manifests',
    recyclerBenefit2: 'Real-time collector handover stream',
    recyclerBenefit3: '1-click official digital settlement slips',
    recyclerBtn: 'Continue as Recycler',
    switchNote: 'You can switch between portals or change your role at any time.',
  },
  hi: {
    appTitle: 'ई-नेक्सस',
    appSubtitle: 'ई-कचरा डिजिटल सेतु',
    changeLoc: 'स्थान बदलें',
    badge: 'अपना पोर्टल चुनें',
    heading: 'आपकी भूमिका क्या है?',
    subheading: 'उचित सरकारी बाजार भाव और सीधे डिजिटल कांटा सत्यापन के लिए अपना पोर्टल चुनें।',
    collectorTitle: 'कबाड़ीवाला / स्क्रैप संग्रहकर्ता',
    collectorBadge: 'स्क्रैप संग्रहकर्ता',
    collectorDesc: 'दैनिक उचित बाजार दरें देखें, वजन के अनुसार सही मूल्य जानें और तुरंत डिजिटल हैंडओवर बनाएं।',
    collectorStep1: '1. सामान चुनें',
    collectorStep2: '2. वजन दर्ज करें',
    collectorStep3: '3. तुरंत भुगतान',
    collectorBenefit1: 'सरकारी अधिकृत दैनिक बाजार दरें',
    collectorBenefit2: 'बिना किसी दलाली या कमीशन कटौती के',
    collectorBenefit3: 'यूपीआई या नकद द्वारा तुरंत भुगतान',
    collectorBtn: 'कबाड़ीवाला के रूप में शुरू करें',
    recyclerTitle: 'अधिकृत रिसाइक्लर',
    recyclerBadge: 'जीपीसीबी पंजीकृत रिसाइक्लर',
    recyclerDesc: 'कबाड़ीवालों से लॉट प्राप्त करें, प्रमाणित डिजिटल कांटे पर वजन जांचें और रसीद जारी करें।',
    recyclerStep1: '1. आवक लॉट देखें',
    recyclerStep2: '2. कांटा जांचें',
    recyclerStep3: '3. पर्ची जारी करें',
    recyclerBenefit1: 'जीपीसीबी अधिकृत कानूनी अनुपालन रिकॉर्ड',
    recyclerBenefit2: 'कबाड़ीवालों से सीधा डिजिटल संपर्क',
    recyclerBenefit3: '1-क्लिक में आधिकारिक डिजिटल भुगतान पर्ची',
    recyclerBtn: 'रिसाइक्लर के रूप में शुरू करें',
    switchNote: 'आप किसी भी समय अपनी भूमिका बदल सकते हैं या दूसरे पोर्टल में जा सकते हैं।',
  },
  mr: {
    appTitle: 'ई-नेक्सस',
    appSubtitle: 'ई-कचरा डिजिटल सेतू',
    changeLoc: 'स्थान बदला',
    badge: 'आपले पोर्टल निवडा',
    heading: 'आज आपली भूमिका कोणती?',
    subheading: 'पारदर्शक योग्य सरकारी बाजारभाव आणि थेट डिजिटल वजन काटा पडताळणीसाठी आपले पोर्टल निवडा.',
    collectorTitle: 'कचरा वेचक / भंगार व्यावसायिक',
    collectorBadge: 'कचरा संकलक',
    collectorDesc: 'दैनंदिन योग्य बाजारभाव तपासा, वजनानुसार योग्य किंमत मोजा आणि त्वरित डिजिटल पावती तयार करा.',
    collectorStep1: '१. भंगार निवडा',
    collectorStep2: '२. वजन टाका',
    collectorStep3: '३. त्वरित पैसे मिळवा',
    collectorBenefit1: 'सरकारी अधिकृत दैनिक बाजार भाव',
    collectorBenefit2: 'कोणतीही मध्यस्थी किंवा कमिशन कपात नाही',
    collectorBenefit3: 'UPI किंवा रोख द्वारे त्वरित रक्कम',
    collectorBtn: 'संकलक म्हणून पुढे जा',
    recyclerTitle: 'अधिकृत रिसायकलर',
    recyclerBadge: 'नोंदणीकृत रिसायकलर',
    recyclerDesc: 'संकलकांकडून येणारे ई-कचरा लॉट स्वीकारा, प्रमाणित डिजिटल वजन काट्यावर पडताळणी करा आणि अधिकृत पावती द्या.',
    recyclerStep1: '१. आवक लॉट पहा',
    recyclerStep2: '२. वजन पडताळा',
    recyclerStep3: '३. अधिकृत पावती द्या',
    recyclerBenefit1: 'प्रदूषण नियंत्रण मंडळ अधिकृत कायदेशीर नोंदी',
    recyclerBenefit2: 'संकलकांशी थेट डिजिटल जोडणी',
    recyclerBenefit3: '१-क्लिकमध्ये अधिकृत डिजिटल पावती व व्यवहार',
    recyclerBtn: 'रिसायकलर म्हणून पुढे जा',
    switchNote: 'तुम्ही कधीही आपले पोर्टल बदलू शकता किंवा दुसऱ्या भूमिकेत जाऊ शकता.',
  },
};

export default function RoleSelectScreen({
  currentLang,
  onLanguageChange,
  selectedLocation,
  onChangeLocation,
  onSelectCollector,
  onSelectRecycler,
}: RoleSelectScreenProps) {
  const isHi = currentLang === 'hi';
  const isMr = currentLang === 'mr';
  const t = isMr ? STRINGS.mr : isHi ? STRINGS.hi : STRINGS.en;

  const [activeTab, setActiveTab] = useState<'portals' | 'prices' | 'recyclers'>('portals');
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [sellRecyclerId, setSellRecyclerId] = useState<string | undefined>(undefined);

  const handleSetLang = (lang: Language) => {
    onLanguageChange(lang);
    try {
      localStorage.setItem('enexus_user_lang', lang);
    } catch {
      // ignore
    }
  };

  const locationText = selectedLocation.area
    ? `${selectedLocation.area}, ${selectedLocation.city}`
    : `${selectedLocation.city}, ${selectedLocation.state}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc] text-slate-900 font-sans">
      
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-xs">
              <Scale className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                  {t.appTitle}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300/80">
                  {t.appSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls: Location & Language */}
          <div className="flex items-center gap-2.5">
            
            {/* Location Badge */}
            <button
              type="button"
              onClick={onChangeLocation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950 text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
              title={locationText}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="max-w-[130px] sm:max-w-[190px] truncate">{locationText}</span>
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

          </div>

        </div>
      </header>

      {/* Main Role Selection Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center">
        
        {/* Navigation Tabs for Explore vs Roles */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('portals')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'portals'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👥 {isMr ? 'भूमिका निवडा' : isHi ? 'पोर्टल चुनें' : 'Select Portal'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('prices')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'prices'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 {isMr ? 'दर फलक' : isHi ? 'मूल्य फलक' : 'Live Price Board'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('recyclers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'recyclers'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏭 {isMr ? 'अधिकृत रिसायकलर' : isHi ? 'अधिकृत रिसाइक्लर्स' : 'Authorized Recyclers'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsSellModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs py-1.5 px-3.5 rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>+ {isMr ? 'लॉट विक्री' : isHi ? 'लॉट बेचें' : 'Sell Material Lot'}</span>
          </button>
        </div>

        {activeTab === 'prices' ? (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <PricePreview
              currentLang={currentLang}
              selectedLocation={selectedLocation}
              onChangeLocation={onChangeLocation}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              onOpenRecyclerModal={onSelectRecycler}
            />
          </div>
        ) : activeTab === 'recyclers' ? (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <FindRecyclerSection
              currentLang={currentLang}
              selectedLocation={selectedLocation}
              onChangeLocation={onChangeLocation}
              onOpenSellModal={(recId) => {
                setSellRecyclerId(recId);
                setIsSellModalOpen(true);
              }}
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3 border border-emerald-300/80">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2.5 leading-tight">
                {t.heading}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                {t.subheading}
              </p>
            </div>

        {/* 2 Clear, Prominent Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Option 1: Collector */}
          <div
            id="role-option-collector"
            onClick={onSelectCollector}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-600/70 hover:border-emerald-700 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer ring-4 ring-emerald-50 hover:-translate-y-0.5"
          >
            <div>
              {/* Header Icon + Role Pill */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center group-hover:scale-105 shadow-sm transition-all">
                  <Truck className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {t.collectorBadge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-2 group-hover:text-emerald-900 transition-colors leading-tight">
                {t.collectorTitle}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed font-medium">
                {t.collectorDesc}
              </p>

              {/* 3 Step Visual */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 mb-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-base sm:text-lg">📦</span>
                  <span className="text-[11px] font-bold text-slate-800 mt-0.5">{t.collectorStep1}</span>
                </div>
                <div className="flex flex-col items-center border-x border-emerald-200">
                  <span className="text-base sm:text-lg">⚖️</span>
                  <span className="text-[11px] font-bold text-slate-800 mt-0.5">{t.collectorStep2}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base sm:text-lg">💵</span>
                  <span className="text-[11px] font-bold text-emerald-900 mt-0.5">{t.collectorStep3}</span>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.collectorBenefit1}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.collectorBenefit2}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.collectorBenefit3}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCollector();
              }}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base py-3.5 px-5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Smartphone className="w-4 h-4 text-emerald-200" />
              <span>{t.collectorBtn}</span>
              <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Option 2: Recycler */}
          <div
            id="role-option-recycler"
            onClick={onSelectRecycler}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 hover:border-slate-800 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer ring-4 ring-slate-100 hover:-translate-y-0.5"
          >
            <div>
              {/* Header Icon + Role Pill */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 shadow-sm transition-all">
                  <Factory className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-300">
                  {t.recyclerBadge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-2 group-hover:text-slate-900 transition-colors leading-tight">
                {t.recyclerTitle}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed font-medium">
                {t.recyclerDesc}
              </p>

              {/* 3 Step Visual */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 mb-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-base sm:text-lg">📋</span>
                  <span className="text-[11px] font-bold text-slate-800 mt-0.5">{t.recyclerStep1}</span>
                </div>
                <div className="flex flex-col items-center border-x border-slate-200">
                  <span className="text-base sm:text-lg">⚖️</span>
                  <span className="text-[11px] font-bold text-slate-800 mt-0.5">{t.recyclerStep2}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base sm:text-lg">📜</span>
                  <span className="text-[11px] font-bold text-emerald-900 mt-0.5">{t.recyclerStep3}</span>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.recyclerBenefit1}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.recyclerBenefit2}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.recyclerBenefit3}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectRecycler();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base py-3.5 px-5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Factory className="w-4 h-4 text-slate-300" />
              <span>{t.recyclerBtn}</span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Switch Note at bottom */}
        <div className="mt-6 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
          <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{t.switchNote}</span>
        </div>
        </>
        )}

      </main>

      {/* Lot Selling / Creation Modal */}
      <SellMaterialModal
        isOpen={isSellModalOpen}
        onClose={() => {
          setIsSellModalOpen(false);
          setSellRecyclerId(undefined);
        }}
        currentLang={currentLang}
        selectedLocation={selectedLocation}
        preSelectedRecyclerId={sellRecyclerId}
        onOpenRecyclerDashboard={onSelectRecycler}
        onViewLedger={() => {
          setIsSellModalOpen(false);
          setActiveTab('prices');
        }}
      />

    </div>
  );
}
