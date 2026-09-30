import { Leaf, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  currentLang: Language;
}

export default function Footer({ currentLang }: FooterProps) {
  const isHi = currentLang === 'hi';
  const isMr = currentLang === 'mr';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                E-Nexus
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              {isHi
                ? 'कबाड़ियों और अनौपचारिक संग्राहकों को अधिकृत रीसायकलर्स से जोड़ने वाला एक सुरक्षित और पारदर्शी मंच।'
                : isMr
                ? 'अनौपचारिक संकलक आणि अधिकृत रिसायकलर्स यांना जोडणारा एक सुरक्षित व पारदर्शक मंच.'
                : 'A simple digital bridge connecting informal e-waste collectors with authorized recyclers.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Connecting Informal Collectors with Authorized Recyclers</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#hero" className="hover:text-emerald-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#price-preview" className="hover:text-emerald-400 transition-colors">
                  Today’s Prices
                </a>
              </li>
              <li>
                <a href="#find-recycler" className="hover:text-emerald-400 transition-colors">
                  Find Recycler
                </a>
              </li>
              <li>
                <a href="#safety-guide" className="hover:text-emerald-400 transition-colors">
                  Safety Guide
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  About E-Nexus
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Commodity Grades */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Indicative Prices
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Copper Cable (₹68–₹76/kg)</li>
              <li>PCB Boards (₹140–₹165/kg)</li>
              <li>Batteries (₹60–₹70/kg)</li>
              <li>Al Heatsinks (₹110–₹128/kg)</li>
              <li>SMPS Supplies (₹34–₹42/kg)</li>
            </ul>
          </div>

          {/* Col 4: National Hub & Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              National Support & Inquiries
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>India-Wide Rollout · Selected Demo Location: Ahmedabad, Gujarat</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Support Line: 1800-890-3927</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@enexus.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} E-Nexus. All rights reserved. Built for safe, fair, and authorized e-waste circularity across India.
          </p>
          <p>
            India E-Waste (Management) Rules, 2022 · No open burning · Calibrated digital scales · Cash or digital payout.
          </p>
        </div>

      </div>
    </footer>
  );
}
