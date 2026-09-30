import { Flame, BatteryWarning, ShieldAlert, HeartPulse, Check, XCircle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface SafetyGuideSectionProps {
  currentLang: Language;
}

export default function SafetyGuideSection({ currentLang }: SafetyGuideSectionProps) {
  const isHi = currentLang === 'hi';
  const isMr = currentLang === 'mr';

  const rules = [
    {
      icon: <Flame className="w-6 h-6 text-rose-600" />,
      title: isHi ? 'तारों को कभी न जलाएं' : isMr ? 'केबल्स कधीही जाळू नका' : 'Never burn cables.',
      doText: isHi
        ? 'तारों को वैसे ही बेचें। अधिकृत रीसायकलर्स उन्हें मशीनों से सुरक्षित छीलते हैं।'
        : isMr
        ? 'केबल्स तशाच विका. अधिकृत रिसायकलर्स मशीनने सुरक्षित सोलतात.'
        : 'Sell cables as they are. Authorized recyclers strip insulation safely with machines.',
      dontText: isHi
        ? 'खुले में तार कभी न जलाएं। काला धुआं फेफड़े खराब करता है और गैरकानूनी है।'
        : isMr
        ? 'उघड्यावर वायर जाळू नका. काळा धूर आरोग्यास हानी पोहोचवतो आणि बेकायदेशीर आहे.'
        : 'Never burn wires in open air. Toxic black smoke damages lungs and is illegal.',
      badge: isHi ? 'महत्वपूर्ण नियम' : isMr ? 'महत्त्वाचा नियम' : 'Core Rule 1'
    },
    {
      icon: <BatteryWarning className="w-6 h-6 text-amber-600" />,
      title: isHi ? 'बैटरी को न तोड़ें और न कुचलें' : isMr ? 'बॅटरी फोडू किंवा दाबू नका' : 'Do not puncture or crush batteries.',
      doText: isHi
        ? 'बैटरियों को सूखा और अलग बोरी या डिब्बे में रखें। दोनों सिरों पर टेप लगाएं।'
        : isMr
        ? 'बॅटऱ्या सुक्या आणि स्वतंत्र ठेवा. टोकांवर चिकटपट्टी लावा.'
        : 'Keep batteries dry, intact, and separated. Put tape over battery terminals.',
      dontText: isHi
        ? 'बैटरी पर हथौड़ा न मारें और न ही आग या पानी में फेंकें। इससे तुरंत आग लग सकती है।'
        : isMr
        ? 'बॅटरीवर हातोडा मारू नका किंवा आगीत टाकू नका. यामुळे आग लागू शकते.'
        : 'Never hit batteries with hammers, crush them, or throw them into fire.',
      badge: isHi ? 'आग से बचाव' : isMr ? 'आगीपासून बचाव' : 'Core Rule 2'
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-emerald-700" />,
      title: isHi ? 'सर्किट बोर्ड पर तेजाब या एसिड का प्रयोग न करें' : isMr ? 'सर्किट बोर्डवर अ‍ॅसिड वापरू नका' : 'Do not use acids to recover metals from PCBs.',
      doText: isHi
        ? 'सर्किट बोर्ड को साबुत रखें और सीधे अधिकृत रीसायकलर्स को दें।'
        : isMr
        ? 'सर्किट बोर्ड अखंड ठेवा आणि थेट अधिकृत रिसायकलर्सकडे द्या.'
        : 'Keep circuit boards whole and send them intact to an authorized recycler.',
      dontText: isHi
        ? 'घर पर तेजाब डालकर धातु निकालने की कोशिश न करें। यह गंभीर रूप से जला सकता है।'
        : isMr
        ? 'घरी अ‍ॅसिड टाकून धातू काढण्याचा प्रयत्न करू नका. यामुळे भाजण्याचा धोका असतो.'
        : 'Never use household acids to burn or strip boards. Acid fumes cause severe burns.',
      badge: isHi ? 'केमिकल चेतावनी' : isMr ? 'रासायनिक इशारा' : 'Core Rule 3'
    }
  ];

  return (
    <section id="safety-guide" className="py-16 sm:py-24 bg-white border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            <span>Health & Safety Guidance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
            {isHi ? 'सुरक्षा और स्वास्थ्य गाइड' : isMr ? 'सुरक्षा आणि आरोग्य मार्गदर्शक' : 'Collector Safety & Handling Guide'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            {isHi
              ? 'हानिकारक सामग्रियों को हमेशा अधिकृत रीसायकलर्स को भेजें। अपनी सेहत की रक्षा करें।'
              : isMr
              ? 'घातक वस्तू नेहमी अधिकृत रिसायकलर्सकडे पाठवा. आरोग्याची काळजी घ्या.'
              : 'Send hazardous materials to an authorized recycler. Protect your health and earn fair value.'}
          </p>
        </div>

        {/* Safety Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    {rule.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200">
                    {rule.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-950 mb-4 leading-snug">
                  {rule.title}
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  {/* DO */}
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-950">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-900 block mb-0.5">Recommended Safe Practice:</span>
                      <span className="text-slate-700">{rule.doText}</span>
                    </div>
                  </div>

                  {/* DONT */}
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/70 border border-rose-200/60 text-rose-950">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-900 block mb-0.5">Dangerous Practice:</span>
                      <span className="text-slate-700">{rule.dontText}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Requirement 6: Safety Before Selling Banner */}
        <div className="rounded-2xl bg-emerald-900 text-white p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-white">Safety Before Selling</div>
              <div className="text-xs sm:text-sm text-emerald-200">
                Follow simple handling guidance before handing material to an authorized recycler.
              </div>
            </div>
          </div>
          <a
            href="#safety-guide"
            className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0"
          >
            View Safety Guide
          </a>
        </div>

      </div>
    </section>
  );
}
