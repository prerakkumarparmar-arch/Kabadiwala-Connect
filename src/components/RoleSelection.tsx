import { Truck, Factory, ArrowRight, CheckCircle2, ShieldCheck, Banknote, Sparkles, Scale, Smartphone } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface RoleSelectionProps {
  currentLang: Language;
  onSelectCollector: () => void;
  onSelectRecycler: () => void;
}

export default function RoleSelection({
  currentLang,
  onSelectCollector,
  onSelectRecycler,
}: RoleSelectionProps) {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="role-selection" className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with bilingual clarity */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3 border border-emerald-300/60">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Select Your Role / अपनी भूमिका चुनें</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
            Who Are You Today?
          </h2>
          <p className="text-base text-slate-600 font-medium">
            Choose your portal to get started immediately with fair rates and direct weighbridge access
          </p>
        </div>

        {/* Two Large Clickable Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: Collector / Kabadiwala */}
          <div
            id="role-card-collector"
            onClick={onSelectCollector}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-600/60 hover:border-emerald-700 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer ring-4 ring-emerald-50"
          >
            <div>
              {/* Header Icon + Role Pill */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center group-hover:scale-105 shadow-sm transition-all">
                  <Truck className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                    कबाड़ीवाला · Collector
                  </span>
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">Mobile View (मोबाइल ऐप)</div>
                </div>
              </div>

              {/* Title requested exactly: 'I am a Collector / Kabadiwala (कबाड़ीवाला)' */}
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2 group-hover:text-emerald-900 transition-colors leading-tight">
                I am a Collector / Kabadiwala (कबाड़ीवाला)
              </h3>

              {/* Hindi & English Simple Explainer for Low Literacy */}
              <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-200/70 mb-4 text-xs font-semibold text-emerald-950 leading-relaxed">
                👉 <span className="font-bold">स्क्रैप बेचें, आज का भाव देखें और सीधा हैंडओवर बनाएं</span>
                <br />
                <span className="text-slate-600 font-normal">Check daily scrap rates, calculate weight value, and create a pickup/drop-off handover.</span>
              </div>

              {/* Visual 3-step icons for low literacy */}
              <div className="grid grid-cols-3 gap-2 py-3 mb-4 bg-slate-50 rounded-2xl p-2.5 border border-slate-200/70 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-base">📦</span>
                  <span className="text-[11px] font-bold text-slate-800 mt-0.5">1. सामान चुनें</span>
                  <span className="text-[9px] text-slate-500">Select Scrap</span>
                </div>
                <div className="flex flex-col items-center border-x border-slate-200">
                  <span className="text-base">⚖️</span>
                  <span className="text-[11px] font-bold text-slate-800 mt-0.5">2. वजन डालें</span>
                  <span className="text-[9px] text-slate-500">Input Weight</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base">💵</span>
                  <span className="text-[11px] font-bold text-emerald-900 mt-0.5">3. नकद / UPI</span>
                  <span className="text-[9px] text-emerald-700 font-bold">Instant Payout</span>
                </div>
              </div>

              {/* Value Highlights */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fair CPCB daily scrap rates (कोई बिचौलिया कटौती नहीं)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Immediate digital weighbridge receipt on handover</span>
                </div>
              </div>
            </div>

            {/* Prominent Action Button */}
            <button
              id="btn-continue-collector"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCollector();
              }}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black text-base py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Smartphone className="w-5 h-5 text-emerald-200" />
              <span>I am a Collector / Kabadiwala (कबाड़ीवाला)</span>
              <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Recycler / Aggregator */}
          <div
            id="role-card-recycler"
            onClick={onSelectRecycler}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 hover:border-slate-800 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer ring-4 ring-slate-100"
          >
            <div>
              {/* Header Icon + Role Pill */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 shadow-sm transition-all">
                  <Factory className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800 border border-slate-300">
                    अधिकृत रिसाइक्लर · Recycler
                  </span>
                  <div className="text-[11px] text-slate-600 font-bold mt-1">Desktop Desk (डेस्कटॉप पैनल)</div>
                </div>
              </div>

              {/* Title requested exactly: 'I am an Authorized Recycler / Aggregator' */}
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2 group-hover:text-slate-900 transition-colors leading-tight">
                I am an Authorized Recycler / Aggregator
              </h3>

              {/* Hindi & English Simple Explainer for Low Literacy */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4 text-xs font-semibold text-slate-800 leading-relaxed">
                👉 <span className="font-bold">कबाड़ीवालों से लॉट स्वीकारें, कांटा वजन जांचें और रसीद दें</span>
                <br />
                <span className="text-slate-600 font-normal">Manage intake feed, calibrate scale readings, complete 1-click verification, and issue compliance slips.</span>
              </div>

              {/* Visual 3-step icons for low literacy */}
              <div className="grid grid-cols-3 gap-2 py-3 mb-4 bg-slate-50 rounded-2xl p-2.5 border border-slate-200/70 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-base">📋</span>
                  <span className="text-[11px] font-bold text-slate-800 mt-0.5">1. लॉट देखें</span>
                  <span className="text-[9px] text-slate-500">Live Intake</span>
                </div>
                <div className="flex flex-col items-center border-x border-slate-200">
                  <span className="text-base">⚖️</span>
                  <span className="text-[11px] font-bold text-slate-800 mt-0.5">2. वजन जांचें</span>
                  <span className="text-[9px] text-slate-500">Scale Verify</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base">📜</span>
                  <span className="text-[11px] font-bold text-emerald-900 mt-0.5">3. रसीद जारी करें</span>
                  <span className="text-[9px] text-emerald-700 font-bold">GPCB Certificate</span>
                </div>
              </div>

              {/* Value Highlights */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified traceability & GPCB compliance manifests</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time intake stream synced directly with local collectors</span>
                </div>
              </div>
            </div>

            {/* Prominent Action Button */}
            <button
              id="btn-continue-recycler"
              onClick={(e) => {
                e.stopPropagation();
                onSelectRecycler();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-base py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Factory className="w-5 h-5 text-slate-300" />
              <span>I am an Authorized Recycler / Aggregator</span>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Reassurance banner below cards */}
        <div className="mt-8 text-center text-xs text-slate-600 flex items-center justify-center gap-2 font-medium">
          <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Need to switch roles later? You can return to this screen at any time with the 'Back to Home' button.</span>
        </div>

      </div>
    </section>
  );
}

