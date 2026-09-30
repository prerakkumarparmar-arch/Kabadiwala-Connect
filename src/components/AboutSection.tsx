import { Recycle, CheckCircle2, ShieldCheck, Scale, Sparkles, HeartHandshake } from 'lucide-react';
import { Language } from '../types';

interface AboutSectionProps {
  currentLang: Language;
}

export default function AboutSection({ currentLang }: AboutSectionProps) {
  const isHi = currentLang === 'hi';
  const isMr = currentLang === 'mr';

  return (
    <section id="about" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-4">
              <Recycle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Platform Mission</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight mb-4">
              {isHi
                ? 'अनौपचारिक कबाड़ियों और औपचारिक रीसाइक्लिंग उद्योग के बीच एक मजबूत सेतु'
                : isMr
                ? 'अनौपचारिक संकलक आणि अधिकृत रिसायकलर यांच्यातील विश्वासार्ह सेतू'
                : 'Bridging the Informal Scrap Workforce with Authorized Recyclers Across India'}
            </h2>

            <p className="text-base text-slate-700 leading-relaxed mb-4">
              {isHi
                ? 'भारत में अधिकांश ई-कचरा स्थानीय कबाड़ियों और अनौपचारिक संग्राहकों द्वारा इकट्ठा किया जाता है। E-Nexus उन्हें पारदर्शी मूल्य, डिजिटल वजन और अधिकृत रीसायकलर्स से सीधे जोड़ने के लिए डिज़ाइन किया गया एक डिजिटल मंच है।'
                : isMr
                ? 'भारतातील बहुतांश ई-कचरा स्थानिक कबाडीवाले गोळा करतात. E-Nexus त्यांना योग्य दर, पारदर्शक वजन आणि अधिकृत रिसायकलर्सशी जोडण्यासाठी तयार केलेले डिजिटल व्यासपीठ आहे.'
                : 'Over 90% of India’s electrical scrap is collected by grassroots kabadiwalas and informal aggregators. E-Nexus is designed as a digital bridge connecting this frontline workforce directly with authorized recyclers.'}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {isHi
                ? 'पारदर्शी सांकेतिक मूल्य और सुरक्षित रखरखाव मार्गदर्शन प्रदान करके, E-Nexus सुरक्षित निपटान और उचित आजीविका को बढ़ावा देता है।'
                : isMr
                ? 'पारदर्शक बाजारभाव आणि सुरक्षित हाताळणी मार्गदर्शनाद्वारे, E-Nexus सुरक्षित पुनर्प्रक्रिया आणि योग्य मोबदल्यास पाठबळ देते.'
                : 'By providing indicative market price ranges, simple safety advice, and transparent weight verification, E-Nexus supports safe e-waste circularity and honest earnings across India.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>India E-Waste Management Framework</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent Price Comparison</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash / UPI / Bank Transfer Options</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Calibrated Weight Verification</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            {/* Mission Design Pillars - Replaces fake real-world impact statistics */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />
              
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                Core Design Pillars
              </div>
              <div className="text-2xl font-black text-slate-900 mb-6">
                How E-Nexus Supports Circularity
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 mt-0.5">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 mb-0.5">
                      Direct Recycler Access
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Connects informal collectors with authorized recycling centers capable of safe, compliant dismantling.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 mb-0.5">
                      Fair & Transparent Pricing
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Provides indicative market price ranges and calibrated digital weigh slips to ensure transparent valuation.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 mb-0.5">
                      Safe Handling & Dignity
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Shares simple, clear guidance against open burning and chemical hazards, protecting collector health.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 text-center">
                Built to support informal collectors and authorized recyclers across India.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
