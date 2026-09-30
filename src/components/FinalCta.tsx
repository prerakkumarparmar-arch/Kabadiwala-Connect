import { ArrowRight, PhoneCall, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface FinalCtaProps {
  currentLang: Language;
  onOpenSellModal: () => void;
}

export default function FinalCta({ currentLang, onOpenSellModal }: FinalCtaProps) {
  const t = TRANSLATIONS[currentLang];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-emerald-950 text-white p-8 sm:p-14 lg:p-16 shadow-2xl overflow-hidden text-center">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-800/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/90 border border-emerald-700/80 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Pickup & Instant Settlement</span>
            </div>

            {/* Exact Required CTA Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              “{t.finalCta.heading}”
            </h2>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-8 max-w-2xl">
              {t.finalCta.subheading}
            </p>

            {/* Exact Required Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <button
                id="final-cta-sell-btn"
                onClick={onOpenSellModal}
                className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-base sm:text-lg px-9 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>{t.finalCta.button}</span>
                <ArrowRight className="w-5 h-5 text-emerald-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-emerald-200 font-medium mb-6">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Calibrated digital scales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Immediate cash / UPI payout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Doorstep vehicle for 30kg+</span>
              </div>
            </div>

            {/* Hotline helpline */}
            <div className="text-xs text-emerald-300/80 flex items-center justify-center gap-2 pt-6 border-t border-emerald-900/80 w-full max-w-lg">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t.finalCta.hotline}</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
