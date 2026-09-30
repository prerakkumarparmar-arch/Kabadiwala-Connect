import { Sparkles, ShieldCheck, Scale, Cpu, BatteryCharging, Cable, ArrowRight, TrendingUp, Smartphone, Factory } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface HeroProps {
  currentLang: Language;
  onOpenSellModal: () => void;
  onScrollToPrices: () => void;
  onSelectCollector?: () => void;
  onSelectRecycler?: () => void;
}

export default function Hero({
  currentLang,
  onOpenSellModal,
  onScrollToPrices,
  onSelectCollector,
  onSelectRecycler,
}: HeroProps) {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="hero" className="relative pt-8 pb-14 md:pt-14 md:pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/60">
      {/* Subtle ecological backdrop grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Core Messaging */}
          <div className="lg:col-span-7 flex flex-col text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-950 text-xs font-semibold w-fit mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{t.hero.badgeStatus}</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] mb-3">
              <span className="text-emerald-950">E-Nexus</span>
            </h1>

            {/* Tagline */}
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight mb-4">
              “{t.hero.tagline}”
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl leading-relaxed mb-6">
              “{t.hero.description}”
            </p>

            {/* Two Direct Role Selection Big Buttons for Low Literacy */}
            <div className="bg-white/90 p-4 sm:p-5 rounded-3xl border-2 border-emerald-800/20 shadow-lg mb-8 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Direct Role Portals / अपनी भूमिका चुनें:</span>
                <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Easy Tap</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Role 1 Button */}
                <button
                  type="button"
                  id="hero-role-collector-btn"
                  onClick={onSelectCollector || onOpenSellModal}
                  className="bg-emerald-700 hover:bg-emerald-600 active:scale-[0.99] text-white p-3.5 sm:p-4 rounded-2xl shadow-sm text-left flex items-center justify-between group transition-all cursor-pointer border border-emerald-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-900 text-white flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-white leading-tight">
                        I am a Collector / Kabadiwala (कबाड़ीवाला)
                      </div>
                      <div className="text-[11px] text-emerald-200 mt-0.5">
                        📱 Open Mobile Collector Screen
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* Role 2 Button */}
                <button
                  type="button"
                  id="hero-role-recycler-btn"
                  onClick={onSelectRecycler}
                  className="bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white p-3.5 sm:p-4 rounded-2xl shadow-sm text-left flex items-center justify-between group transition-all cursor-pointer border border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                      <Factory className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-white leading-tight">
                        I am an Authorized Recycler / Aggregator
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        💻 Open Recycler Dashboard
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>

            {/* Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
              <button
                id="hero-view-prices-btn"
                onClick={onScrollToPrices}
                className="bg-white hover:bg-emerald-50 text-emerald-950 font-semibold text-sm px-5 py-2.5 rounded-xl border border-slate-300 shadow-xs hover:border-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>{t.hero.ctaSecondary} (Today's Benchmark Rates)</span>
              </button>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-slate-200/90">
              <div>
                <div className="text-lg sm:text-2xl font-bold text-slate-900">{t.hero.stat1Number}</div>
                <div className="text-xs text-slate-600 font-medium">{t.hero.stat1Label}</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-emerald-800">{t.hero.stat2Number}</div>
                <div className="text-xs text-slate-600 font-medium">{t.hero.stat2Label}</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-slate-900">{t.hero.stat3Number}</div>
                <div className="text-xs text-slate-600 font-medium">{t.hero.stat3Label}</div>
              </div>
            </div>

          </div>

          {/* Right Column: E-waste / Recycling Themed Visual Area */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white border border-emerald-900/15 shadow-xl p-5 sm:p-6 overflow-hidden">
              
              {/* Card top bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Authorized Recycler Network</div>
                    <div className="text-xs text-emerald-700 font-medium">Sample Location: Ahmedabad</div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Sample Rates
                </span>
              </div>

              {/* Visual Stream of Clean E-Waste Recovery */}
              <div className="space-y-3 mb-5">
                
                {/* Copper item */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Cable className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Copper Cable (तांबा तार)</div>
                      <div className="text-xs text-slate-500">Stripped & insulated telecom wire</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-900">₹68–₹76</div>
                    <div className="text-[11px] font-medium text-emerald-600">per kg</div>
                  </div>
                </div>

                {/* PCB item */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">PCB Motherboards (सर्किट बोर्ड)</div>
                      <div className="text-xs text-slate-500">Mobile, computer & green boards</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-900">₹140–₹165</div>
                    <div className="text-[11px] font-medium text-emerald-600">per kg</div>
                  </div>
                </div>

                {/* Battery item */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                      <BatteryCharging className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Batteries (ली-आयन / लेड)</div>
                      <div className="text-xs text-slate-500">Intact sealed cells & packs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-900">₹60–₹70</div>
                    <div className="text-[11px] font-medium text-emerald-600">per kg</div>
                  </div>
                </div>

              </div>

              {/* Handover Quality Badge Footer */}
              <div className="p-3.5 rounded-2xl bg-emerald-950 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Traceable Digital Handover</div>
                    <div className="text-[11px] text-emerald-200">Safe handling · Calibrated digital scales</div>
                  </div>
                </div>
                <button
                  onClick={onOpenSellModal}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  Create Lot
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
