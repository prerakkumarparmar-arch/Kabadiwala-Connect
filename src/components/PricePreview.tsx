import { useState, useEffect, useCallback } from 'react';
import {
  Cable,
  Cpu,
  BatteryCharging,
  TrendingUp,
  Calendar,
  MapPin,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calculator,
  FileText,
  CheckCircle2,
  Factory,
  Scale,
  PlusCircle,
  RefreshCw,
  TrendingDown,
  Minus,
  ShieldCheck,
  LineChart,
  X,
  Award,
  AlertCircle
} from 'lucide-react';
import { Language, UserLocation, Lot } from '../types';
import { TRANSLATIONS } from '../data';
import { getStoredLots, verifyLotInStorage } from '../lotStore';
import backendApi, { PriceRecord, PriceTrendPoint, MaterialRecord } from '../backendApi';
import { mockPriceDataset } from '../datasets';

interface PricePreviewProps {
  currentLang: Language;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
  onOpenSellModal: () => void;
  onOpenRecyclerModal?: () => void;
}

export default function PricePreview({
  currentLang,
  selectedLocation,
  onChangeLocation,
  onOpenSellModal,
  onOpenRecyclerModal,
}: PricePreviewProps) {
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [lots, setLots] = useState<Lot[]>([]);
  const [verifiedLotNotification, setVerifiedLotNotification] = useState<string | null>(null);

  // Dynamic live prices from backendApi
  const [livePrices, setLivePrices] = useState<PriceRecord[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [activeRegion, setActiveRegion] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Spot calculator state
  const [selectedCalcMaterialId, setSelectedCalcMaterialId] = useState<string>('mat-pcb-motherboard');
  const [calcWeight, setCalcWeight] = useState<number>(25);
  const [calcGrade, setCalcGrade] = useState<'A_INTACT' | 'B_PARTIAL' | 'C_SCRAP_FRAGMENTS'>('A_INTACT');
  const [calcResult, setCalcResult] = useState<{
    baseRatePerKg: number;
    effectiveRatePerKg: number;
    grossEstimateInr: number;
    eprIncentiveBonusInr: number;
    netPayableEstimateInr: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Historical trend modal
  const [selectedTrendMaterial, setSelectedTrendMaterial] = useState<{
    name: string;
    trends: PriceTrendPoint[];
    currentPrice: number;
    region: string;
  } | null>(null);

  // Synchronize lots from localStorage and custom events
  useEffect(() => {
    setLots(getStoredLots());

    const handleLotsUpdated = (e: CustomEvent<Lot[]>) => {
      setLots(e.detail || getStoredLots());
    };

    window.addEventListener('enexus_lots_updated' as any, handleLotsUpdated);
    return () => {
      window.removeEventListener('enexus_lots_updated' as any, handleLotsUpdated);
    };
  }, []);

  // Fetch live prices from backendApi
  const fetchLivePrices = useCallback(async () => {
    setIsLoadingPrices(true);
    try {
      // Try matching by state or city first
      const regionQuery = selectedLocation.city || selectedLocation.state;
      let prices = await backendApi.getLivePrices(regionQuery);

      if (!prices || prices.length === 0) {
        // Fallback to all available regional benchmarks
        prices = await backendApi.getLivePrices();
      }

      setLivePrices(prices);
      if (prices.length > 0) {
        setActiveRegion(prices[0].region);
      }
    } catch (err) {
      console.error('Failed to fetch live prices from backendApi', err);
      // Fallback in-memory
      const fallbackPrices: PriceRecord[] = mockPriceDataset.map((mp) => ({
        materialId: mp.materialId,
        materialName: mp.category,
        unit: (mp.unit === 'pieces' ? 'piece' : 'kg') as 'kg' | 'piece',
        region: mp.location,
        currentBuyingPriceInr: mp.buyingPrice,
        minimumQuotedPriceInr: mp.buyingPrice - 15,
        maximumQuotedPriceInr: mp.quotedPrice,
        formalRecyclerCeilingInr: mp.quotedPrice + 20,
        weeklyTrend: 'up',
        weeklyChangePercent: 3.5,
        historicalTrend: mp.historicalTrend.map((h) => ({
          date: h.date,
          priceInr: h.price,
          volumeKg: h.marketVolumeKg,
        })),
        lastUpdated: mp.timestamp,
      }));
      setLivePrices(fallbackPrices);
      setActiveRegion(fallbackPrices[0]?.region || 'National Index');
    } finally {
      setIsLoadingPrices(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    fetchLivePrices();
  }, [fetchLivePrices]);

  // Dynamic valuation calculation
  useEffect(() => {
    let isCancelled = false;
    async function updateValuation() {
      if (!selectedCalcMaterialId || calcWeight <= 0) return;
      setIsCalculating(true);
      try {
        const res = await backendApi.calculateValuation({
          materialId: selectedCalcMaterialId,
          weightKg: calcWeight,
          grade: calcGrade,
        });
        if (!isCancelled) {
          setCalcResult({
            baseRatePerKg: res.baseRatePerKg,
            effectiveRatePerKg: res.effectiveRatePerKg,
            grossEstimateInr: res.grossEstimateInr,
            eprIncentiveBonusInr: res.eprIncentiveBonusInr,
            netPayableEstimateInr: res.netPayableEstimateInr,
          });
        }
      } catch (e) {
        console.error('Calculation error', e);
      } finally {
        if (!isCancelled) setIsCalculating(false);
      }
    }

    updateValuation();
    return () => {
      isCancelled = true;
    };
  }, [selectedCalcMaterialId, calcWeight, calcGrade]);

  const handleSingleClickVerify = (lotId: string) => {
    const updated = verifyLotInStorage(lotId, 'Authorized Recycler Hub (1-Click)');
    setLots(updated);
    setVerifiedLotNotification(`Lot ${lotId} successfully verified on digital scale!`);
    setTimeout(() => {
      setVerifiedLotNotification(null);
    }, 3500);
  };

  const t = TRANSLATIONS[currentLang];

  // Helper for localized material names
  const getLocalizedName = (item: PriceRecord) => {
    const lower = item.materialName.toLowerCase();
    if (lower.includes('pcb') || lower.includes('motherboard')) {
      return currentLang === 'hi' ? 'कंप्यूटर मदरबोर्ड / पीसीबी' : currentLang === 'mr' ? 'संगणक मदरबोर्ड / सर्किट' : 'PCBs & Motherboards';
    }
    if (lower.includes('cable') || lower.includes('wire') || lower.includes('copper')) {
      return currentLang === 'hi' ? 'तांबे के तार व केबल' : currentLang === 'mr' ? 'तांब्याची वायर व केबल' : 'Copper Cables & Wires';
    }
    if (lower.includes('battery') || lower.includes('lithium')) {
      return currentLang === 'hi' ? 'लिथियम व लेड बैटरी' : currentLang === 'mr' ? 'लिथियम व लेड बॅटरी' : 'Batteries (Li-ion/Lead)';
    }
    if (lower.includes('screen') || lower.includes('display') || lower.includes('crt')) {
      return currentLang === 'hi' ? 'स्क्रीन व मॉनिटर डिस्प्ले' : currentLang === 'mr' ? 'स्क्रीन व मॉनिटर डिस्प्ले' : 'Screens & Monitors';
    }
    if (lower.includes('compressor') || lower.includes('motor')) {
      return currentLang === 'hi' ? 'कंप्रेसर व मोटर' : currentLang === 'mr' ? 'कॉम्प्रेसर व मोटर' : 'Compressors & Motors';
    }
    return item.materialName;
  };

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('cable') || lower.includes('copper') || lower.includes('wire')) {
      return <Cable className="w-6 h-6 text-amber-800" />;
    }
    if (lower.includes('battery') || lower.includes('energy')) {
      return <BatteryCharging className="w-6 h-6 text-blue-800" />;
    }
    return <Cpu className="w-6 h-6 text-emerald-800" />;
  };

  // Filter items
  const filteredPrices = livePrices.filter((p) => {
    if (categoryFilter === 'all') return true;
    const lower = (p.materialName + ' ' + p.materialId).toLowerCase();
    return lower.includes(categoryFilter.toLowerCase());
  });

  const primaryPrices = filteredPrices.slice(0, 3);
  const extendedPrices = filteredPrices.slice(3);

  return (
    <section id="price-preview" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section with Live Benchmark Indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{selectedLocation.city || t.prices.cityBadge}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Live CPCB Price Dataset</span>
              </div>
              
              <button
                type="button"
                onClick={fetchLivePrices}
                disabled={isLoadingPrices}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Refresh rates from backendApi"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingPrices ? 'animate-spin text-emerald-700' : ''}`} />
                <span>{isLoadingPrices ? 'Refreshing...' : 'Live Sync'}</span>
              </button>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-2">
              {t.prices.title}
            </h2>

            {/* Location display and Change Location button */}
            <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>📍 {selectedLocation.area ? `${selectedLocation.area}, ` : ''}{selectedLocation.city}, {selectedLocation.state}</span>
              </span>
              <button
                type="button"
                onClick={onChangeLocation}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 cursor-pointer transition-colors"
              >
                [ Change Location ]
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Government-calibrated rates fetched dynamically from registered regional recycling clusters ({activeRegion || 'National Benchmark'}). Zero broker margin deductions.
            </p>
          </div>

          {/* Quick Price Benchmark tag */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3 self-start md:self-auto shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-extrabold text-emerald-950 text-sm">Official SPCB / CPCB Rate Index</div>
              <div className="text-emerald-700 font-medium">Daily spot benchmark with verified EPR credit additions</div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Filter Fraction:</span>
          {[
            { id: 'all', label: 'All Fractions' },
            { id: 'pcb', label: 'PCBs & Boards' },
            { id: 'cable', label: 'Cables & Copper' },
            { id: 'battery', label: 'Batteries' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {isLoadingPrices && livePrices.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-50 rounded-3xl p-7 border border-slate-200 animate-pulse space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-14 bg-slate-200 rounded-2xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          /* Primary 3 Live Price Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {primaryPrices.map((item) => {
              const isTrendingUp = item.weeklyTrend === 'up';
              const isTrendingDown = item.weeklyTrend === 'down';

              return (
                <div
                  key={item.materialId}
                  className="bg-slate-50/70 hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-emerald-700/60 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon + Trend Pill */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                        {getIcon(item.materialName)}
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isTrendingUp
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : isTrendingDown
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {isTrendingUp ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                          ) : isTrendingDown ? (
                            <TrendingDown className="w-3.5 h-3.5 text-rose-700" />
                          ) : (
                            <Minus className="w-3.5 h-3.5 text-slate-600" />
                          )}
                          <span>
                            {isTrendingUp ? `+${item.weeklyChangePercent}%` : isTrendingDown ? `-${item.weeklyChangePercent}%` : 'Stable'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Material Title */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-emerald-950 transition-colors">
                      {getLocalizedName(item)}
                    </h3>
                    <div className="text-xs font-medium text-slate-500 mb-4">
                      {item.region} · Spot Benchmark
                    </div>

                    {/* Price Range Box */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 mb-4 shadow-2xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-500">Certified Buying Price:</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          Per {item.unit}
                        </span>
                      </div>
                      <div className="text-3xl font-black text-emerald-900 tracking-tight">
                        ₹{item.currentBuyingPriceInr}
                        <span className="text-sm font-medium text-slate-500 ml-1">/ {item.unit}</span>
                      </div>
                      
                      <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <span>Quoted: ₹{item.minimumQuotedPriceInr}–₹{item.maximumQuotedPriceInr}</span>
                        <span className="font-semibold text-slate-800">Cap: ₹{item.formalRecyclerCeilingInr}</span>
                      </div>
                    </div>

                    {/* Mini Actions: View 7-day trend */}
                    {item.historicalTrend && item.historicalTrend.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTrendMaterial({
                          name: getLocalizedName(item),
                          trends: item.historicalTrend,
                          currentPrice: item.currentBuyingPriceInr,
                          region: item.region
                        })}
                        className="w-full text-left text-xs text-emerald-700 hover:text-emerald-900 font-semibold mb-5 flex items-center gap-1.5 cursor-pointer"
                      >
                        <LineChart className="w-3.5 h-3.5" />
                        <span>View 7-Day Trend Points</span>
                      </button>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={onOpenSellModal}
                    className="w-full bg-white hover:bg-emerald-900 text-slate-800 hover:text-white font-semibold text-sm py-3 px-4 rounded-xl border border-slate-300 hover:border-emerald-900 shadow-2xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.prices.sellThis}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Prices Toggle Button */}
        {extendedPrices.length > 0 && (
          <div className="text-center mb-10">
            <button
              id="btn-view-all-prices"
              onClick={() => setShowAllPrices(!showAllPrices)}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-950 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>{showAllPrices ? 'Hide Extended Directory' : `${t.prices.viewAllBtn} (${extendedPrices.length} more)`}</span>
              {showAllPrices ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Extended Price Catalog */}
        {showAllPrices && extendedPrices.length > 0 && (
          <div className="mb-14 rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  Extended Regional E-Waste Benchmark Directory
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  CPCB certified rates across all industrial clusters and recovery fractions.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 self-start">
                {extendedPrices.length} Active Secondary Commodities
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {extendedPrices.map((item) => (
                <div key={item.materialId} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500 mb-1">{item.region}</div>
                  <div className="font-bold text-slate-900 text-base mb-2">{getLocalizedName(item)}</div>
                  <div className="text-2xl font-black text-emerald-900 mb-2">
                    ₹{item.currentBuyingPriceInr} <span className="text-xs font-normal text-slate-500">/ {item.unit}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    Broker Quoted: ₹{item.minimumQuotedPriceInr}–₹{item.maximumQuotedPriceInr} · Recycler Cap: ₹{item.formalRecyclerCeilingInr}
                  </div>
                  <button
                    onClick={onOpenSellModal}
                    className="w-full text-center bg-slate-100 hover:bg-emerald-900 hover:text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Sell This Fraction
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            Interactive Spot Valuation & Government EPR Calculator Engine
            ==================================================================== */}
        <div className="rounded-3xl bg-emerald-950 text-white p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900 text-emerald-200 text-xs font-bold mb-3 border border-emerald-800">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dynamic Spot Valuation Engine</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                Calculate Exact Payout & EPR Bonus
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed mb-4 font-medium">
                Pulls dynamic benchmark prices via asynchronous backendApi calls, applying certified condition grade multipliers and Government EPR credit bonuses (+₹4 to ₹8/kg).
              </p>
              
              <div className="space-y-2 text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time CPCB benchmark rates without broker cuts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Extra EPR hazardous diversion incentive credited directly</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant settlement over UPI, IMPS or cash voucher</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Controls */}
            <div className="lg:col-span-7 bg-emerald-900/70 border border-emerald-800 rounded-2xl p-5 sm:p-6 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                
                {/* Select Fraction */}
                <div>
                  <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
                    E-Waste Fraction
                  </label>
                  <select
                    value={selectedCalcMaterialId}
                    onChange={(e) => setSelectedCalcMaterialId(e.target.value)}
                    className="w-full bg-emerald-950 text-white border border-emerald-700/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {livePrices.map((p) => (
                      <option key={p.materialId} value={p.materialId}>
                        {getLocalizedName(p)} (₹{p.currentBuyingPriceInr}/{p.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Weight Input */}
                <div>
                  <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
                    Estimated Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-emerald-950 text-white border border-emerald-700/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-emerald-400 font-bold">KG</span>
                  </div>
                </div>

              </div>

              {/* Condition Grade Selection */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
                  Condition Grade (CPCB E-Waste Specs)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { grade: 'A_INTACT' as const, label: 'Grade-A: Intact', factor: '100% Rate' },
                    { grade: 'B_PARTIAL' as const, label: 'Grade-B: Partial', factor: '85% Rate' },
                    { grade: 'C_SCRAP_FRAGMENTS' as const, label: 'Grade-C: Scrap', factor: '65% Rate' },
                  ].map((g) => (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => setCalcGrade(g.grade)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                        calcGrade === g.grade
                          ? 'bg-emerald-400 text-emerald-950 border-emerald-300 shadow-xs'
                          : 'bg-emerald-950/80 text-emerald-200 border-emerald-700/80 hover:bg-emerald-800'
                      }`}
                    >
                      <div className="font-extrabold">{g.label}</div>
                      <div className="text-[10px] opacity-80">{g.factor}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payout Output Breakdown */}
              <div className="pt-4 border-t border-emerald-800/80">
                {isCalculating ? (
                  <div className="py-4 text-center text-xs text-emerald-300 animate-pulse">
                    Computing live valuation & EPR credit bonus...
                  </div>
                ) : calcResult ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-emerald-300 mb-1">
                        <span>Base Scrap: ₹{calcResult.grossEstimateInr.toLocaleString('en-IN')}</span>
                        <span>+</span>
                        <span className="bg-emerald-900 px-2 py-0.5 rounded text-emerald-300 font-bold border border-emerald-700">
                          EPR Bonus: +₹{calcResult.eprIncentiveBonusInr.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-3xl font-black text-emerald-300 tracking-tight">
                        ₹{calcResult.netPayableEstimateInr.toLocaleString('en-IN')}
                        <span className="text-xs text-emerald-400 font-normal ml-2 font-mono">
                          (@ ₹{calcResult.effectiveRatePerKg}/kg)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={onOpenSellModal}
                      className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shrink-0 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Create Lot Now</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}
              </div>

            </div>

          </div>
        </div>

        {/* =======================================================
            PRICE & ACTIVE LOTS LEDGER (Instant State/LocalStorage Sync)
            ======================================================= */}
        <div id="price-ledger-section" className="mt-14 pt-10 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2">
                <FileText className="w-3.5 h-3.5 text-emerald-800" />
                <span>Price & Settlement Ledger</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Live Lots Ledger
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Lots created by collectors push directly into Transaction and Traceability datasets, queued offline when disconnected and synced automatically.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onOpenSellModal}
                className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-300" />
                <span>+ Create Lot</span>
              </button>

              {onOpenRecyclerModal && (
                <button
                  type="button"
                  onClick={onOpenRecyclerModal}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Factory className="w-4 h-4 text-emerald-400" />
                  <span>Recycler Dashboard</span>
                </button>
              )}
            </div>
          </div>

          {verifiedLotNotification && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-xl flex items-center gap-2 mb-4 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-semibold">{verifiedLotNotification}</span>
            </div>
          )}

          {/* Ledger Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Lot ID</th>
                    <th className="py-3 px-4">Collector & Catchment</th>
                    <th className="py-3 px-4">Material & Weight</th>
                    <th className="py-3 px-4">Benchmark Fair Value</th>
                    <th className="py-3 px-4">Cloud Sync Status</th>
                    <th className="py-3 px-4 text-right">Recycler Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lots.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No lots in ledger yet. Click "+ Create Lot" to submit your first e-waste fraction.
                      </td>
                    </tr>
                  ) : (
                    lots.map((lot) => {
                      const isVerified =
                        lot.status === 'Verified & Certified' || lot.status === 'Weighed & Certified' || lot.status === 'Verified & Complete';
                      const createdAtMs = typeof lot.createdAt === 'number'
                        ? lot.createdAt
                        : (lot.createdAt ? new Date(lot.createdAt).getTime() : 0);
                      const isNew = lot.postedAgo === 'Just now' || (Date.now() - createdAtMs < 60000);

                      return (
                        <tr
                          key={lot.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isNew ? 'bg-amber-50/50' : ''
                          }`}
                        >
                          {/* Lot ID */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>{lot.id}</span>
                              {isNew && (
                                <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                                  NEW
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-sans font-normal">
                              {lot.postedAgo}
                            </div>
                          </td>

                          {/* Collector */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{lot.collectorName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{lot.area}</span>
                            </div>
                          </td>

                          {/* Material & Weight */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{lot.items}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Scale className="w-3 h-3 text-emerald-700" />
                              <span>{lot.weight}</span>
                            </div>
                          </td>

                          {/* Value */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-emerald-900">{lot.estValue}</div>
                            <div className="text-[10px] text-slate-400">
                              Mode: {lot.paymentPreference ? lot.paymentPreference.toUpperCase() : 'UPI / CASH'}
                            </div>
                          </td>

                          {/* Sync / Status */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                lot.isSynced !== false
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${lot.isSynced !== false ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}`} />
                                <span>{lot.isSynced !== false ? 'Synced to Cloud' : 'Queued Offline'}</span>
                              </span>
                              
                              <span className="text-[10px] text-slate-500 font-medium">
                                {lot.status}
                              </span>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="py-3 px-4 text-right">
                            {isVerified ? (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                                Slip Verified ✓
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSingleClickVerify(lot.id)}
                                className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs py-1.5 px-3 rounded-lg shadow-2xs transition-all cursor-pointer"
                                title="Single click to verify on calibrated digital scale"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                                <span>1-Click Verify</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer summary bar */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>
                Backend integration active: Real-time synchronization with CPCB Registry & Traceability dataset.
              </span>
              <span className="font-semibold text-slate-700">
                {lots.length} Total Records
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Historical Trend Points Modal */}
      {selectedTrendMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {selectedTrendMaterial.name} — Historical Price Trend
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedTrendMaterial.region} · Daily Volume & Price Movement
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTrendMaterial(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {selectedTrendMaterial.trends.map((pt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{pt.date}</div>
                    <div className="text-[11px] text-slate-500">Aggregated Volume: {pt.volumeKg} kg</div>
                  </div>
                  <div className="text-base font-black text-emerald-900">
                    ₹{pt.priceInr} / kg
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedTrendMaterial(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Close Trend History
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
