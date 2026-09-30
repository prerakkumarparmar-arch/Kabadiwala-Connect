import { useState, useMemo } from 'react';
import { X, MapPin, Search, ChevronDown, Check, Loader2, Navigation } from 'lucide-react';
import { UserLocation, Language } from '../types';

interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: UserLocation;
  onSelectLocation: (location: UserLocation) => void;
  currentLang: Language;
}

const MODAL_STRINGS = {
  en: {
    title: 'Where are you collecting from?',
    subtitle: 'Set your location to view relevant indicative prices and authorized recyclers.',
    detecting: 'Detecting your location...',
    useCurrent: '📍 Use My Current Location',
    or: 'or',
    searchPlaceholder: 'Search city, area or locality...',
    matching: 'Matching Localities',
    noMatches: 'No exact match found. Choose from the dropdowns below.',
    selectBtn: 'Select',
    quickSelect: 'Quick Select Areas',
    stateLabel: 'State',
    cityLabel: 'City / District',
    areaLabel: 'Area / Locality (Optional)',
    otherArea: 'Other / General City Catchment',
    selectedLocationLabel: 'Selected Location',
    confirmBtn: 'Confirm Location',
  },
  hi: {
    title: 'आप कहाँ से स्क्रैप एकत्र कर रहे हैं?',
    subtitle: 'अपने क्षेत्र की सही बाजार दरें एवं अधिकृत रिसाइक्लर देखने के लिए स्थान चुनें।',
    detecting: 'स्थान की पहचान की जा रही है...',
    useCurrent: '📍 मेरे वर्तमान स्थान का उपयोग करें',
    or: 'या',
    searchPlaceholder: 'शहर, क्षेत्र या इलाका खोजें...',
    matching: 'मिलते-जुलते क्षेत्र',
    noMatches: 'कोई सीधा मिलान नहीं मिला। नीचे दी गई सूची में से चुनें।',
    selectBtn: 'चुनें',
    quickSelect: 'त्वरित चयन क्षेत्र',
    stateLabel: 'राज्य',
    cityLabel: 'शहर / ज़िला',
    areaLabel: 'क्षेत्र / इलाका (वैकल्पिक)',
    otherArea: 'अन्य / सामान्य शहर क्षेत्र',
    selectedLocationLabel: 'चुना गया स्थान',
    confirmBtn: 'स्थान की पुष्टि करें',
  },
  mr: {
    title: 'तुम्ही कुठून ई-कचरा संकलन करत आहात?',
    subtitle: 'आपल्या परिसरातील योग्य बाजारभाव व अधिकृत रिसायकलर पाहण्यासाठी स्थान निवडा.',
    detecting: 'आपले स्थान शोधत आहे...',
    useCurrent: '📍 माझे चालू स्थान वापरा',
    or: 'किंवा',
    searchPlaceholder: 'शहर, परिसर किंवा औद्योगिक क्षेत्र शोधा...',
    matching: 'जुळणारे परिसर',
    noMatches: 'थेट जुळणारा परिसर सापडला नाही. खालील यादीतून निवडा.',
    selectBtn: 'निवडा',
    quickSelect: 'पटकन निवडण्याचे प्रमुख परिसर',
    stateLabel: 'राज्य',
    cityLabel: 'शहर / जिल्हा',
    areaLabel: 'परिसर / औद्योगिक क्षेत्र (पर्यायी)',
    otherArea: 'इतर / सर्वसाधारण शहर परिसर',
    selectedLocationLabel: 'निवडलेले स्थान',
    confirmBtn: 'स्थान निश्चित करा',
  },
};

interface StateData {
  name: string;
  cities: {
    name: string;
    clusters: string[];
  }[];
}

const LOCATION_DATABASE: StateData[] = [
  {
    name: 'Gujarat',
    cities: [
      {
        name: 'Ahmedabad',
        clusters: ['Naroda GIDC', 'Vatva GIDC', 'Odhav Industrial Area', 'Danilimda Scrap Hub', 'Kalupur Market', 'Sanand Corridor', 'Changodar']
      },
      {
        name: 'Surat',
        clusters: ['Sachin GIDC', 'Pandesara GIDC', 'Udhna Industrial Area', 'Katargam']
      },
      {
        name: 'Vadodara',
        clusters: ['Makarpura GIDC', 'Manjusar GIDC', 'Gorwa']
      },
      {
        name: 'Rajkot',
        clusters: ['Aji GIDC', 'Metoda GIDC', 'Bhakti Nagar']
      }
    ]
  },
  {
    name: 'Maharashtra',
    cities: [
      {
        name: 'Mumbai',
        clusters: ['Kurla LBS Marg', 'Dharavi Scrap Hub', 'Mankhurd Scrap Yard', 'Bhiwandi Aggregation Hub', 'Andheri East MIDC']
      },
      {
        name: 'Pune',
        clusters: ['Pimpri-Chinchwad (Bhosari MIDC)', 'Hadapsar Industrial Estate', 'Chakan MIDC', 'Marketyard']
      },
      {
        name: 'Nagpur',
        clusters: ['Hingna MIDC', 'Wadi Scrap Market', 'Kalmeshwar']
      },
      {
        name: 'Thane',
        clusters: ['Wagle Industrial Estate', 'Kalyan-Dombivli', 'Rabale MIDC']
      }
    ]
  },
  {
    name: 'Delhi NCR',
    cities: [
      {
        name: 'Delhi',
        clusters: ['Mayapuri Scrap Yard', 'Seelampur Electronics Cluster', 'Mandoli Industrial Area', 'Okhla Phase I & II', 'Wazirpur Industrial Area']
      },
      {
        name: 'Noida',
        clusters: ['Sector 63 Industrial Area', 'Sector 80 Industrial Cluster', 'Phase II Extension']
      },
      {
        name: 'Gurugram',
        clusters: ['Udyog Vihar Phase 1-5', 'Manesar Industrial Estate', 'Sector 37 Pace City']
      },
      {
        name: 'Faridabad',
        clusters: ['Sector 24 & 25 MIDC', 'Mathura Road Aggregation Yard']
      }
    ]
  },
  {
    name: 'Karnataka',
    cities: [
      {
        name: 'Bengaluru',
        clusters: ['Peenya Industrial Area', 'Nayandahalli Scrap Yard', 'Bommasandra Industrial Area', 'Whitefield Industrial Corridor']
      }
    ]
  },
  {
    name: 'Tamil Nadu',
    cities: [
      {
        name: 'Chennai',
        clusters: ['Guindy Industrial Estate', 'Ambattur Industrial Estate', 'Royapuram Metal Market']
      }
    ]
  },
  {
    name: 'Telangana',
    cities: [
      {
        name: 'Hyderabad',
        clusters: ['Sanath Nagar', 'Balanagar Industrial Area', 'Kattedan Scrap Hub']
      }
    ]
  },
  {
    name: 'West Bengal',
    cities: [
      {
        name: 'Kolkata',
        clusters: ['Howrah Scrap Line', 'Tangra Industrial Area', 'Taratala Scrap Yard']
      }
    ]
  }
];

export default function LocationSelectionModal({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
  currentLang
}: LocationSelectionModalProps) {
  const t = currentLang === 'mr' ? MODAL_STRINGS.mr : currentLang === 'hi' ? MODAL_STRINGS.hi : MODAL_STRINGS.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [tempState, setTempState] = useState(selectedLocation.state || 'Gujarat');
  const [tempCity, setTempCity] = useState(selectedLocation.city || 'Ahmedabad');
  const [tempArea, setTempArea] = useState(selectedLocation.area || 'Naroda GIDC');
  const [isDetecting, setIsDetecting] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  // Quick Select Area options requested by user
  const quickSelectAreas = [
    { city: 'Ahmedabad', state: 'Gujarat', area: 'Naroda GIDC' },
    { city: 'Mumbai', state: 'Maharashtra', area: 'Kurla LBS Marg' },
    { city: 'Delhi', state: 'Delhi NCR', area: 'Mayapuri Scrap Yard' },
    { city: 'Pune', state: 'Maharashtra', area: 'Pimpri-Chinchwad (Bhosari MIDC)' },
  ];

  // Search filtering
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    const matches: { state: string; city: string; area: string }[] = [];

    LOCATION_DATABASE.forEach((s) => {
      s.cities.forEach((c) => {
        c.clusters.forEach((cl) => {
          if (
            cl.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q)
          ) {
            matches.push({
              state: s.name,
              city: c.name,
              area: cl
            });
          }
        });
      });
    });
    return matches.slice(0, 8);
  }, [searchTerm]);

  if (!isOpen) return null;

  const currentStateObj = LOCATION_DATABASE.find((s) => s.name === tempState) || LOCATION_DATABASE[0];
  const currentCityObj = currentStateObj.cities.find((c) => c.name === tempCity) || currentStateObj.cities[0];

  const handleApply = () => {
    onSelectLocation({
      state: tempState,
      city: tempCity,
      area: tempArea
    });
    onClose();
  };

  const handleQuickSelect = (city: string, state: string, area: string) => {
    setTempState(state);
    setTempCity(city);
    setTempArea(area);
    setSearchTerm('');
    setGeoMessage(null);
  };

  const handleUseCurrentLocation = () => {
    setIsDetecting(true);
    setGeoMessage(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          // In actual production, reverse geocode lat/long. For the prototype demo, set nearby Ahmedabad hub:
          const { latitude } = position.coords;
          if (latitude > 25) {
            // Northern latitude
            handleQuickSelect('Delhi', 'Delhi NCR', 'Mayapuri Scrap Yard');
            setGeoMessage(currentLang === 'hi' ? 'स्थान प्राप्त हुआ (उत्तर भारत क्लस्टर)' : 'Location detected (Northern India Cluster)');
          } else if (latitude < 19) {
            // Southern/Pune region
            handleQuickSelect('Pune', 'Maharashtra', 'Pimpri-Chinchwad (Bhosari MIDC)');
            setGeoMessage(currentLang === 'hi' ? 'स्थान प्राप्त हुआ (पुणे क्लस्टर)' : 'Location detected (Pune Catchment)');
          } else {
            // Western region
            handleQuickSelect('Ahmedabad', 'Gujarat', 'Naroda GIDC');
            setGeoMessage(currentLang === 'hi' ? 'स्थान प्राप्त हुआ (अहमदाबाद क्लस्टर)' : 'Location detected (Ahmedabad Catchment)');
          }
        },
        (_error) => {
          setIsDetecting(false);
          // Fallback to Ahmedabad demo location gracefully if permission dismissed or unavailable in iframe
          handleQuickSelect('Ahmedabad', 'Gujarat', 'Naroda GIDC');
          setGeoMessage(currentLang === 'hi' ? 'डिफ़ॉल्ट स्थान: नरोदा जीआईडीसी, अहमदाबाद' : 'Set to default catchment: Naroda GIDC, Ahmedabad');
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetecting(false);
      handleQuickSelect('Ahmedabad', 'Gujarat', 'Naroda GIDC');
      setGeoMessage(currentLang === 'hi' ? 'डिफ़ॉल्ट स्थान: नरोदा जीआईडीसी, अहमदाबाद' : 'Set to default catchment: Naroda GIDC, Ahmedabad');
    }
  };

  // Formatted string of selected location
  const formattedSelectedLocation = tempArea
    ? `${tempArea}, ${tempCity}, ${tempState}`
    : `${tempCity}, ${tempState}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header with Close */}
        <div className="px-5 pt-5 sm:px-6 sm:pt-6 pb-2 flex items-start justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
              {t.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1 -mt-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 pt-3 space-y-4 max-h-[78vh] overflow-y-auto">
          
          {/* [ 📍 Use My Current Location ] */}
          <div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isDetecting}
              className="w-full bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-4 h-4 text-emerald-800 animate-spin" />
                  <span className="text-xs sm:text-sm">{t.detecting}</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-emerald-800 group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm">{t.useCurrent}</span>
                </>
              )}
            </button>
            {geoMessage && (
              <div className="mt-1.5 text-[11px] text-emerald-800 font-semibold text-center animate-in fade-in">
                ✓ {geoMessage}
              </div>
            )}
          </div>

          {/* or divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 font-medium lowercase shrink-0">
              {t.or}
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* [ Search city, area or locality... ] */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold p-0.5"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Search Matches Dropdown / Results */}
          {searchTerm.trim() && (
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 animate-in fade-in">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                {t.matching} ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="text-xs text-slate-500 py-2 px-2 text-center">
                  {t.noMatches}
                </div>
              ) : (
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        handleQuickSelect(res.city, res.state, res.area);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200/80 text-xs flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-bold text-slate-900">{res.area}</span>
                        <span className="text-slate-500 text-[11px]">({res.city}, {res.state})</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold shrink-0">{t.selectBtn}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Select Areas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t.quickSelect}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickSelectAreas.map((item) => {
                const isActive = tempCity === item.city;
                return (
                  <button
                    key={item.city}
                    type="button"
                    onClick={() => handleQuickSelect(item.city, item.state, item.area)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    [ {item.city} ]
                  </button>
                );
              })}
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.stateLabel}
            </label>
            <div className="relative">
              <select
                value={tempState}
                onChange={(e) => {
                  const newState = e.target.value;
                  setTempState(newState);
                  const stateObj = LOCATION_DATABASE.find((s) => s.name === newState);
                  if (stateObj && stateObj.cities.length > 0) {
                    const firstCity = stateObj.cities[0];
                    setTempCity(firstCity.name);
                    setTempArea(firstCity.clusters[0] || '');
                  }
                  setGeoMessage(null);
                }}
                className="w-full appearance-none text-xs sm:text-sm py-2.5 pl-3.5 pr-9 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold text-slate-900 cursor-pointer"
              >
                {LOCATION_DATABASE.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* City / District */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.cityLabel}
            </label>
            <div className="relative">
              <select
                value={tempCity}
                onChange={(e) => {
                  const newCity = e.target.value;
                  setTempCity(newCity);
                  const cityObj = currentStateObj.cities.find((c) => c.name === newCity);
                  if (cityObj && cityObj.clusters.length > 0) {
                    setTempArea(cityObj.clusters[0]);
                  }
                  setGeoMessage(null);
                }}
                className="w-full appearance-none text-xs sm:text-sm py-2.5 pl-3.5 pr-9 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold text-slate-900 cursor-pointer"
              >
                {currentStateObj.cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Area / Locality (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.areaLabel}
            </label>
            <div className="relative">
              <select
                value={tempArea}
                onChange={(e) => {
                  setTempArea(e.target.value);
                  setGeoMessage(null);
                }}
                className="w-full appearance-none text-xs sm:text-sm py-2.5 pl-3.5 pr-9 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold text-slate-900 cursor-pointer"
              >
                {currentCityObj.clusters.map((cluster) => (
                  <option key={cluster} value={cluster}>
                    {cluster}
                  </option>
                ))}
                <option value="">{t.otherArea}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Selected Location Display */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t.selectedLocationLabel}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-950 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{formattedSelectedLocation}</span>
            </div>
          </div>

          {/* [ Confirm Location ] */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleApply}
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{t.confirmBtn}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
