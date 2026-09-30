import { useState } from 'react';
import { useLotStore } from './lotStore';
import { CollectorMobileScreen } from './components/CollectorMobileScreen';
import { RecyclerDesktopDashboard } from './components/RecyclerDesktopDashboard';
import { NetworkStatusBanner } from './components/NetworkStatusBanner';
import { Smartphone, Monitor, ShieldCheck, Globe, User, Phone, MapPin } from 'lucide-react';

export function App() {
  const { userRole, setUserRole, logout, language, setLanguage } = useLotStore();

  // Local form state for login credentials
  const [selectedRole, setSelectedRole] = useState<'collector' | 'recycler' | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [validationError, setValidationError] = useState('');

  // Translations for the Login / Role Selection Screen
  const t = {
    en: {
      title: "Kabadiwala Connect",
      subtitle: "Formalizing E-Waste Recycling Chain (Ministry of Mines / JNARDDC — SIH 2026)",
      chooseRole: "Select Portal Type:",
      collectorRole: "Collector Mode (Mobile)",
      recyclerRole: "Recycler Portal (Desktop)",
      namePlaceholder: "Full Name (पूरा नाम)",
      phonePlaceholder: "Mobile Number (मोबाइल नंबर)",
      pincodePlaceholder: "Area Pincode (पिनकोड)",
      loginBtn: "Login & Proceed",
      backBtn: "Back to Role Selection",
      tagline: "Offline-First Architecture & EPR Compliant",
      validationAlert: "Please fill all valid details: Name, 10-digit Phone, 6-digit Pincode"
    },
    hi: {
      title: "कबाड़ीवाला कनेक्ट",
      subtitle: "ई-वेस्ट रीसाइक्लिंग इकोसिस्टम (खान मंत्रालय / JNARDDC — SIH 2026)",
      chooseRole: "पोर्टल का चयन करें:",
      collectorRole: "कलेक्टर मोड (मोबाइल)",
      recyclerRole: "रिसाइक्लर पोर्टल (डेस्कटॉप)",
      namePlaceholder: "पूरा नाम (Full Name)",
      phonePlaceholder: "मोबाइल नंबर (Mobile Number)",
      pincodePlaceholder: "एरिया पिनकोड (Pincode)",
      loginBtn: "लॉगिन करें और आगे बढ़ें",
      backBtn: "पीछे जाएं",
      tagline: "ऑफ़लाइन-फर्स्ट आर्किटेक्चर और EPR अनुपालन",
      validationAlert: "कृपया सभी विवरण सही ढंग से भरें: नाम, 10 अंकों का फोन नंबर, 6 अंकों का पिनकोड"
    },
    mr: {
      title: "कबाडीवाला कनेक्ट",
      subtitle: "ई-कचरा रीसायकलिंग इकोसिस्टम (खनिज मंत्रालय / JNARDDC — SIH 2026)",
      chooseRole: "पोर्टल निवडा:",
      collectorRole: "कलेक्टर्स मोड (मोबाइल)",
      recyclerRole: "रिसायकलर्स पोर्टल (डेस्कटॉप)",
      namePlaceholder: "पूर्ण नाव (Full Name)",
      phonePlaceholder: "मोबाइल नंबर (Mobile Number)",
      pincodePlaceholder: "पिनकोड (Pincode)",
      loginBtn: "लॉगिन करा आणि पुढे जा",
      backBtn: "मागे जा",
      tagline: "ऑफलाइन-फर्स्ट आर्किटेक्चर आणि EPR सुसंगत",
      validationAlert: "कृपया सर्व तपशील योग्यरित्या भरा: नाव, 10-अंकी फोन नंबर, 6-अंकी पिनकोड"
    }
  }[language || 'hi'];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    const cleanPincode = pincode.trim();
    if (!name.trim() || cleanPhone.length < 10 || cleanPincode.length < 6) {
      setValidationError(t.validationAlert);
      return;
    }
    setValidationError('');
    // Set role and pass custom credentials to store
    setUserRole(selectedRole, cleanPhone);
  };

  // 1. Login & Credential Input Screen (No tab switching allowed until logout)
  if (!userRole) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-800 text-center">
          
          {/* Language Switcher Pills */}
          <div className="flex justify-center items-center gap-1.5 mb-6 bg-slate-100 p-1 rounded-2xl">
            <Globe className="w-4 h-4 text-slate-500 ml-2" />
            <button 
              type="button"
              onClick={() => setLanguage('en')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              English
            </button>
            <button 
              type="button"
              onClick={() => setLanguage('hi')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${language === 'hi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              हिंदी
            </button>
            <button 
              type="button"
              onClick={() => setLanguage('mr')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${language === 'mr' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              मराठी
            </button>
          </div>

          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold shadow-inner">
            ♻️
          </div>
          <h1 className="text-xl font-black text-slate-800 mb-1">{t.title}</h1>
          <p className="text-[11px] text-slate-500 mb-6 font-medium">
            {t.subtitle}
          </p>

          {!selectedRole ? (
            // Step A: Choose Role First
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 mb-2">{t.chooseRole}</p>

              <button 
                type="button"
                onClick={() => setSelectedRole('collector')}
                className="w-full flex items-center justify-center gap-3 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/25 transition-all text-sm cursor-pointer"
              >
                <Smartphone className="w-5 h-5" />
                <span>{t.collectorRole}</span>
              </button>

              <button 
                type="button"
                onClick={() => setSelectedRole('recycler')}
                className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/25 transition-all text-sm cursor-pointer"
              >
                <Monitor className="w-5 h-5" />
                <span>{t.recyclerRole}</span>
              </button>
            </div>
          ) : (
            // Step B: Enter Credentials Form
            <form onSubmit={handleLoginSubmit} className="space-y-3 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Role: {selectedRole === 'collector' ? 'Collector' : 'Recycler'}
                </span>
                <button 
                  type="button" 
                  onClick={() => { setSelectedRole(null); setValidationError(''); }}
                  className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
                >
                  {t.backBtn}
                </button>
              </div>

              {validationError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {validationError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input 
                    type="tel" 
                    maxLength={10}
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pincode</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder={t.pincodePlaceholder}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all text-xs cursor-pointer"
              >
                {t.loginBtn}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t.tagline}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Collector View (Locked in, No Role-Switching Tabs)
  if (userRole === 'collector') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <NetworkStatusBanner />
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-between items-center text-xs text-slate-300">
          <span>📱 Collector: <strong className="text-emerald-400">{name || 'User'} ({phone || '9876543210'})</strong></span>
          <button 
            type="button"
            onClick={() => { logout(); setSelectedRole(null); }} 
            className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg font-medium hover:bg-red-500/30 transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'लॉग आउट' : language === 'mr' ? 'लॉग आउट' : 'Logout'}
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center p-2 sm:p-4">
          <div className="w-full max-w-[420px] h-[840px] bg-white rounded-[36px] shadow-2xl border-[6px] border-slate-800 overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-50"></div>
            <div className="flex-1 overflow-y-auto pt-5">
              <CollectorMobileScreen currentLang={language} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Recycler Desktop Dashboard View (Locked in, No Role-Switching Tabs)
  if (userRole === 'recycler') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏭</span>
            <div>
              <h2 className="font-bold text-sm">Authorized Recycler Portal — {name || 'HQ'} ({phone || 'Official'})</h2>
              <p className="text-[10px] text-slate-400">Jawaharlal Nehru Aluminium Research Development & Design Centre</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => { logout(); setSelectedRole(null); }} 
            className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all shadow cursor-pointer"
          >
            Logout Portal
          </button>
        </div>
        <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <RecyclerDesktopDashboard currentLang={language} />
        </div>
      </div>
    );
  }

  return null;
}

export default App;
