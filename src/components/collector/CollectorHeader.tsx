import { useState, useRef, useEffect } from 'react';
import { Leaf, MapPin, Globe, ChevronDown, Wifi, WifiOff, ArrowLeft } from 'lucide-react';
import { Language, UserLocation } from '../../types';

interface CollectorHeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
  onExitToLanding: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
}

export default function CollectorHeader({
  currentLang,
  onLanguageChange,
  selectedLocation,
  onChangeLocation,
  onExitToLanding,
  isOnline,
  onToggleOnline,
}: CollectorHeaderProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const formattedLocation = selectedLocation.area
    ? `${selectedLocation.area}, ${selectedLocation.city}, ${selectedLocation.state}`
    : `${selectedLocation.city}, ${selectedLocation.state}`;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      {/* Network Status micro banner if offline */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs py-1.5 px-4 font-semibold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>Offline Mode: Changes will sync when connection returns.</span>
          <button
            type="button"
            onClick={onToggleOnline}
            className="ml-2 underline text-amber-100 hover:text-white text-[11px] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main compact collector header */}
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: E-Nexus Logo + Return link */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExitToLanding}
              className="w-9 h-9 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition-colors"
              title="Return to Public Landing Page"
              aria-label="Return to Public Landing Page"
            >
              <Leaf className="w-5 h-5 text-emerald-400" />
            </button>
            <div className="flex flex-col">
              <span className="text-base font-black text-emerald-950 leading-none">
                E-Nexus
              </span>
              <button
                type="button"
                onClick={onExitToLanding}
                className="text-[10px] text-slate-500 hover:text-emerald-800 flex items-center gap-0.5 mt-0.5 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-2.5 h-2.5" />
                <span>Landing Page</span>
              </button>
            </div>
          </div>

          {/* Center: Greeting & Collector ID */}
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
              <span>Hello</span>
              <span className="text-sm">👋</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
              Collector KBD1024
            </div>
          </div>

          {/* Right: Network status badge & Language */}
          <div className="flex items-center gap-2">
            {/* Online / Offline status badge (clickable to toggle for testing) */}
            <button
              type="button"
              onClick={onToggleOnline}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
              title="Click to toggle Online/Offline simulation"
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="hidden sm:inline text-[11px]">Online</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span className="hidden sm:inline text-[11px]">Offline</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all border border-slate-200 cursor-pointer"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                <span>{languages.find((l) => l.code === currentLang)?.native}</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in duration-150">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 cursor-pointer ${
                        currentLang === lang.code ? 'font-bold text-emerald-900 bg-emerald-50/70' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-400">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Selected Location Strip */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate font-semibold text-slate-900">
              {formattedLocation}
            </span>
          </div>
          <button
            type="button"
            onClick={onChangeLocation}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 shrink-0 cursor-pointer"
          >
            [ Change ]
          </button>
        </div>

      </div>
    </header>
  );
}
