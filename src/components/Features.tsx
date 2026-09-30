import { ShieldAlert, BadgeIndianRupee, Building2, FileCheck2, CheckCircle } from 'lucide-react';
import { Language } from '../types';
import { CORE_FEATURES, TRANSLATIONS } from '../data';

interface FeaturesProps {
  currentLang: Language;
}

export default function Features({ currentLang }: FeaturesProps) {
  const t = TRANSLATIONS[currentLang];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-emerald-800" />;
      case 'BadgeIndianRupee':
        return <BadgeIndianRupee className="w-6 h-6 text-emerald-800" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-emerald-800" />;
      case 'FileCheck2':
        return <FileCheck2 className="w-6 h-6 text-emerald-800" />;
      default:
        return <CheckCircle className="w-6 h-6 text-emerald-800" />;
    }
  };

  const getTitle = (feat: typeof CORE_FEATURES[0]) => {
    if (currentLang === 'hi') return feat.titleHi;
    if (currentLang === 'mr') return feat.titleMr;
    return feat.title;
  };

  const getDescription = (feat: typeof CORE_FEATURES[0]) => {
    if (currentLang === 'hi') return feat.descriptionHi;
    if (currentLang === 'mr') return feat.descriptionMr;
    return feat.description;
  };

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/70 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-3">
            Core Standards
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
            {t.features.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            {t.features.subtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl p-7 border border-slate-200/80 hover:border-emerald-700/50 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Feature Icon */}
                <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-900 group-hover:text-white transition-all">
                  {getIcon(feature.iconName)}
                </div>

                {/* Feature Title */}
                <h3 className="text-xl font-bold text-slate-950 mb-3 group-hover:text-emerald-950 transition-colors">
                  {getTitle(feature)}
                </h3>

                {/* Feature Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {getDescription(feature)}
                </p>
              </div>

              {/* Highlight Pill */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-start gap-2 text-xs font-semibold text-emerald-900">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feature.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
