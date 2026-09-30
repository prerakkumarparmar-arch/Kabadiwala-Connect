import { PackagePlus, TrendingUp, ShieldCheck, Scale, Wallet, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { WORKFLOW_STEPS, TRANSLATIONS } from '../data';

interface HowItWorksProps {
  currentLang: Language;
  onOpenSellModal: () => void;
}

export default function HowItWorks({ currentLang, onOpenSellModal }: HowItWorksProps) {
  const t = TRANSLATIONS[currentLang];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'PackagePlus':
        return <PackagePlus className="w-6 h-6 text-emerald-800" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-800" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-800" />;
      case 'Scale':
        return <Scale className="w-6 h-6 text-emerald-800" />;
      case 'Wallet':
        return <Wallet className="w-6 h-6 text-emerald-800" />;
      default:
        return <PackagePlus className="w-6 h-6 text-emerald-800" />;
    }
  };

  const getTitle = (step: typeof WORKFLOW_STEPS[0]) => {
    if (currentLang === 'hi') return step.titleHi;
    if (currentLang === 'mr') return step.titleMr;
    return step.title;
  };

  const getDescription = (step: typeof WORKFLOW_STEPS[0]) => {
    if (currentLang === 'hi') return step.descriptionHi;
    if (currentLang === 'mr') return step.descriptionMr;
    return step.description;
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            Clear 5-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
            {t.howItWorks.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.number}
              className="relative bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-700/40 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Step number badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center font-black text-emerald-950 text-base shadow-xs group-hover:bg-emerald-900 group-hover:text-white transition-colors">
                    {step.number}
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                    {getIcon(step.iconName)}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 leading-snug group-hover:text-emerald-950 transition-colors">
                  {getTitle(step)}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {getDescription(step)}
                </p>
              </div>

              {/* Step Sub-hint */}
              <div className="mt-5 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                <span>{step.detailHint}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action strip */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenSellModal}
            className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>Start Step 1: Create a Lot Now</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>

      </div>
    </section>
  );
}
