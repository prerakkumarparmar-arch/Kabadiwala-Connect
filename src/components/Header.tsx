import { useState, useRef, useEffect } from 'react';
import { Leaf, Globe, Menu, X, ChevronDown, ShieldCheck, ArrowRight, MapPin, Factory } from 'lucide-react';
import { Language, UserLocation } from '../types';
import { TRANSLATIONS } from '../data';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSellModal: () => void;
  onOpenRecyclerModal?: () => void;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
}

export default function Header({
  currentLang,
  onLanguageChange,
  onOpenSellModal,
  onOpenRecyclerModal,
  selectedLocation,
  onChangeLocation,
}: HeaderProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLang];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '#hero' },
    { name: t.nav.howItWorks, href: '#how-it-works' },
    { name: t.nav.prices, href: '#price-preview' },
    { name: t.nav.findRecycler, href: '#find-recycler' },
    { name: t.nav.safetyGuide, href: '#safety-guide' },
    { name: t.nav.about, href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 transition-colors">
      {/* Top micro banner with platform clarity & collector location selector */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Connecting Informal Collectors with Authorized E-Waste Recyclers</span>
        </div>
        <div className="flex items-center gap-2 mx-auto sm:mx-0 text-emerald-200">
          <span className="flex items-center gap-1 font-semibold text-[11px] sm:text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>📍 {selectedLocation.area ? `${selectedLocation.area}, ` : ''}{selectedLocation.city}, {selectedLocation.state}</span>
          </span>
          <button
            type="button"
            onClick={onChangeLocation}
            className="text-[11px] font-bold text-emerald-300 hover:text-white underline underline-offset-2 cursor-pointer transition-colors"
          >
            [Change Location]
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Left: E-Nexus logo/name */}
          <a id="header-logo-link" href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-white shadow-sm shadow-emerald-950/20 group-hover:bg-emerald-800 transition-colors">
              <Leaf className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-emerald-950 leading-none">
                E-Nexus
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-wider uppercase mt-0.5">
                Safe E-Waste Network
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/70 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right: Location quick pill, Language dropdown & Primary action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Location button for fast location adjustment */}
            <button
              type="button"
              onClick={onChangeLocation}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl border border-slate-200 transition-all cursor-pointer"
              title="Change your catchment or city"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="max-w-[120px] truncate">{selectedLocation.city}</span>
            </button>

            {/* Language dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="language-dropdown-button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 rounded-xl transition-all border border-slate-200/80"
                aria-expanded={langDropdownOpen}
                aria-label="Select Language"
              >
                <Globe className="w-4 h-4 text-emerald-800" />
                <span className="font-semibold">
                  {languages.find((l) => l.code === currentLang)?.native}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Language / भाषा
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        currentLang === lang.code ? 'font-bold text-emerald-900 bg-emerald-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-xs text-slate-400">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recycler Hub Modal Button */}
            {onOpenRecyclerModal && (
              <button
                type="button"
                onClick={onOpenRecyclerModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl border border-slate-200 transition-all cursor-pointer"
                title="Open Recycler Dashboard & 1-Click Verification"
              >
                <Factory className="w-4 h-4 text-emerald-700" />
                <span>Recycler Hub</span>
              </button>
            )}

            {/* Primary button: Sell Material */}
            <button
              id="header-sell-btn"
              onClick={onOpenSellModal}
              className="bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{t.nav.sellBtn}</span>
              <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mobile menu toggle button */}
            <button
              id="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-emerald-900 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Location Badge & Change Link */}
          <div className="p-3 mb-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Collector Location:</span>
                <span className="font-bold text-slate-900">{selectedLocation.city}, {selectedLocation.state}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onChangeLocation();
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-950 underline underline-offset-2"
            >
              Change
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-base font-medium text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            {onOpenRecyclerModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRecyclerModal();
                }}
                className="w-full bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Factory className="w-4 h-4 text-emerald-400" />
                <span>Recycler Hub (1-Click Verify)</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellModal();
              }}
              className="w-full bg-emerald-900 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{t.nav.sellBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
