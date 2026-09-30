import { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  AlertTriangle,
  IndianRupee,
  Volume2,
  TrendingUp,
  Cpu,
  Cable,
  BatteryCharging,
  Sparkles,
  User,
  LogOut,
  RefreshCw,
  FileText,
  Check
} from 'lucide-react';
import { Language, UserLocation, Lot } from '../../types';
import { TODAY_PRICES, SAMPLE_RECYCLERS } from '../../data';
import { getStoredLots, verifyLotInStorage } from '../../lotStore';

interface SubViewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: UserLocation;
  currentLang: Language;
  onOpenSellModal?: () => void;
  onOpenRecyclerModal?: () => void;
}

// 1. LOT DETAIL & LOTS MODAL (/lots & /lots/EW1024)
export function LotDetailModal({
  isOpen,
  onClose,
  lotId,
}: {
  isOpen: boolean;
  onClose: () => void;
  lotId?: string;
}) {
  const [activeTab, setActiveTab] = useState<'track' | 'all'>('track');
  const [lots, setLots] = useState<Lot[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLots(getStoredLots());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<Lot[]>) => {
      setLots(e.detail || getStoredLots());
    };
    window.addEventListener('enexus_lots_updated' as any, handleUpdate);
    return () => {
      window.removeEventListener('enexus_lots_updated' as any, handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const currentLot = (lotId ? lots.find((l) => l.id === lotId) : lots[0]) || lots[0];
  const isCurrentVerified =
    currentLot &&
    (currentLot.status === 'Verified & Certified' || currentLot.status === 'Weighed & Certified');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                Lot Tracker
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                #{lotId}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {activeTab === 'track' ? 'PCB Lot Tracking' : 'All My Lots'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'track'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Track Active Lot (EW1024)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Lots (3)
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {activeTab === 'track' ? (
            <>
              {/* Status Header Badge */}
              <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    Current Status
                  </span>
                  <span className="text-base sm:text-lg font-black text-amber-950">
                    QUOTE RECEIVED
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-200/70 text-amber-900">
                  Ready for Handover
                </span>
              </div>

              {/* Mini-Progress Indicator */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Progress Steps
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-slate-900">Lot Created</span>
                      <span className="text-slate-500 block text-[11px]">8.5 kg PCB registered</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Done</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-slate-900">Recycler Matched</span>
                      <span className="text-slate-500 block text-[11px]">GreenCycle Recycling assigned</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Done</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 animate-pulse">
                      ●
                    </div>
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-amber-950">Quote Received</span>
                      <span className="text-amber-800 font-semibold block text-[11px]">
                        Firm rate: ₹105/kg (Est: ₹840–₹980)
                      </span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                      Current
                    </span>
                  </div>

                  <div className="flex items-center gap-3 opacity-60">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">
                      ○
                    </div>
                    <div className="flex-1 text-xs">
                      <span className="font-semibold text-slate-700">Handover Pending</span>
                      <span className="text-slate-500 block text-[11px]">Electronic scale weighment & spot cash/UPI</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Next</span>
                  </div>
                </div>
              </div>

              {/* Lot Details Summary Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Lot ID:</span>
                  <span className="font-mono font-bold text-slate-900">EW1024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Material:</span>
                  <span className="font-bold text-slate-900">Printed Circuit Boards (PCB)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Approximate Weight:</span>
                  <span className="font-bold text-slate-900">8.5 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Estimated Value:</span>
                  <span className="font-extrabold text-emerald-900 text-sm">₹840–₹980</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Selected Recycler:</span>
                  <span className="font-bold text-slate-900 text-right">
                    GreenCycle Recycling
                    <span className="text-[10px] text-slate-500 block font-normal">(Prototype Demo)</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Payment Mode:</span>
                  <span className="font-bold text-slate-900">Cash on Handover / UPI</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:+919800000001"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call Recycler</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-3 rounded-xl transition-colors cursor-pointer"
                >
                  Confirm Handover Slot
                </button>
              </div>
            </>
          ) : (
            /* All Lots View - Real persistent lots from lotStore */
            <div className="space-y-3">
              {lots.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No lots created yet. Click "+ Create Lot" to submit a lot.
                </div>
              ) : (
                lots.map((lot) => {
                  const isVer =
                    lot.status === 'Verified & Certified' || lot.status === 'Weighed & Certified';
                  return (
                    <div
                      key={lot.id}
                      className={`p-3.5 rounded-2xl border transition-all text-xs ${
                        isVer ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <span className="font-mono font-bold text-slate-900 mr-2">#{lot.id}</span>
                          <span className="text-[11px] text-slate-500">{lot.postedAgo}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isVer
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border-amber-200'
                          }`}
                        >
                          {lot.status}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 mb-1">{lot.items}</div>
                      <div className="flex justify-between text-slate-600 text-[11px] items-center">
                        <span>Weight: {lot.weight}</span>
                        <span className="font-extrabold text-emerald-950">{lot.estValue}</span>
                      </div>
                      {!isVer && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-end">
                          <button
                            type="button"
                            onClick={() => verifyLotInStorage(lot.id)}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] py-1 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>1-Click Verify</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 2. PRICES VIEW MODAL (/prices)
export function PricesModal({
  isOpen,
  onClose,
  selectedLocation,
  onOpenSellModal,
  onOpenRecyclerModal,
}: SubViewProps) {
  const [activeTab, setActiveTab] = useState<'prices' | 'ledger'>('prices');
  const [lots, setLots] = useState<Lot[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLots(getStoredLots());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<Lot[]>) => {
      setLots(e.detail || getStoredLots());
    };
    window.addEventListener('enexus_lots_updated' as any, handleUpdate);
    return () => {
      window.removeEventListener('enexus_lots_updated' as any, handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedLocation.city}, {selectedLocation.state}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {activeTab === 'prices' ? 'Today’s Indicative Prices' : 'Price & Lots Ledger'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('prices')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'prices'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Market Prices
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Active Lots Ledger ({lots.length})</span>
          </button>
        </div>

        {/* Disclaimer note */}
        <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-200/80 text-[11px] text-emerald-900 font-medium">
          {activeTab === 'prices'
            ? 'Prototype sample rates – not live market quotations. Benchmark price ranges for common e-waste grades.'
            : 'All lots submitted by collectors update here in real-time and synchronize with Recycler digital weigh scales.'}
        </div>

        {/* Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-3">
          {activeTab === 'prices' ? (
            TODAY_PRICES.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-emerald-600 transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    {item.category}
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {item.gradeNotes}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-black text-emerald-950">
                    {item.priceRange}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {item.trendText}
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Lots Ledger in Prices Modal */
            <div className="space-y-3">
              {lots.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No lots registered in ledger yet.
                </div>
              ) : (
                lots.map((lot) => {
                  const isVer =
                    lot.status === 'Verified & Certified' || lot.status === 'Weighed & Certified';
                  return (
                    <div
                      key={lot.id}
                      className={`p-3.5 rounded-2xl border transition-all text-xs ${
                        isVer ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900">#{lot.id}</span>
                          <span className="text-[10px] text-slate-500">{lot.postedAgo}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isVer
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border-amber-200'
                          }`}
                        >
                          {lot.status}
                        </span>
                      </div>

                      <div className="font-bold text-slate-900 mb-1">{lot.items}</div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-2">
                        <div>Weight: <span className="font-semibold text-slate-800">{lot.weight}</span></div>
                        <div>Fair Value: <span className="font-extrabold text-emerald-900">{lot.estValue}</span></div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                        <span className="text-slate-500">{lot.area}</span>
                        {!isVer ? (
                          <button
                            type="button"
                            onClick={() => verifyLotInStorage(lot.id)}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-[11px] py-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>1-Click Verify</span>
                          </button>
                        ) : (
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {activeTab === 'prices' ? 'Benchmark rates updated' : `${lots.length} active lots recorded`}
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSellModal) onOpenSellModal();
            }}
            className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            + Create New Lot
          </button>
        </div>

      </div>
    </div>
  );
}


// 3. RECYCLERS VIEW MODAL (/recyclers)
export function RecyclersModal({
  isOpen,
  onClose,
  selectedLocation,
}: SubViewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Catchment: {selectedLocation.city}, {selectedLocation.state}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Authorized Recyclers Near You
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Disclaimer */}
        <div className="bg-slate-100 px-5 py-2 text-[11px] text-slate-600 font-medium border-b border-slate-200">
          Demo recycler data for illustrative testing purposes. Recycler authorization status displayed.
        </div>

        {/* Recyclers List */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
          {SAMPLE_RECYCLERS.map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-600 transition-all text-xs"
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rec.name}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{rec.facilityArea}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  {rec.licenseNumber}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 my-2.5">
                {rec.materialsAccepted.map((mat) => (
                  <span
                    key={mat}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700"
                  >
                    {mat}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                <span className="text-[11px] font-bold text-emerald-800">
                  Capacity: {rec.dailyCapacity}
                </span>
                <a
                  href={`tel:${rec.phone}`}
                  className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Desk</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// 4. EARNINGS VIEW MODAL (/earnings)
export function EarningsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
              Collector Ledger
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              My Earnings & Transactions
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Total Earned
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-950 block mt-0.5">
                ₹18,420
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                Pending
              </span>
              <span className="text-base sm:text-lg font-black text-amber-950 block mt-0.5">
                ₹1,260
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                This Month
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900 block mt-0.5">
                ₹3,840
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center font-medium">
            Sample transaction data. All values in Indian Rupees (INR).
          </div>

          {/* Transaction History List */}
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Recent Handover Receipts
            </div>
            <div className="space-y-2">
              {[
                {
                  id: 'REC-7721',
                  date: 'Yesterday, 4:15 PM',
                  desc: 'Copper Cables (22 kg)',
                  amount: '+₹1,540',
                  method: 'Cash Handover',
                  status: 'Paid'
                },
                {
                  id: 'REC-7690',
                  date: '16 Sep 2026',
                  desc: 'Server PCB Boards (12 kg)',
                  amount: '+₹1,920',
                  method: 'Instant UPI',
                  status: 'Paid'
                },
                {
                  id: 'REC-7655',
                  date: '12 Sep 2026',
                  desc: 'Mixed SMPS & Adapters (35 kg)',
                  amount: '+₹1,680',
                  method: 'Bank Transfer',
                  status: 'Paid'
                },
                {
                  id: 'REC-7601',
                  date: '08 Sep 2026',
                  desc: 'Dry Lithium Packs (18 kg)',
                  amount: '+₹1,260',
                  method: 'Pending Weigh Verification',
                  status: 'Pending'
                }
              ].map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{tx.desc}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {tx.id} • {tx.date} • {tx.method}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-black text-sm ${tx.status === 'Paid' ? 'text-emerald-900' : 'text-amber-800'}`}>
                      {tx.amount}
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${tx.status === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// 5. SAFETY GUIDE VIEW MODAL (/safety)
export function SafetyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const handlePlayVoice = () => {
    setIsPlaying(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Battery Safety: Do not puncture, crush or burn batteries. Keep all lithium cells in dry cardboard boxes away from metal scrap and water.'
      );
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-amber-600 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-200" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Collector Safety Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-100 hover:text-white hover:bg-amber-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio helper banner */}
        <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-3">
          <div className="text-xs text-amber-950">
            <span className="font-bold block">Audio Safety Guidance:</span>
            <span>Listen to simple handling instructions in simple voice.</span>
          </div>
          <button
            type="button"
            onClick={handlePlayVoice}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-amber-200 text-amber-950 hover:bg-amber-300'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlaying ? 'Speaking...' : 'Listen Now'}</span>
          </button>
        </div>

        {/* Body rules */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3.5 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-black text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <span>🔋 1. Battery Safety</span>
            </h4>
            <p className="text-slate-700 leading-relaxed font-semibold">
              “Do not puncture, crush or burn batteries.”
            </p>
            <p className="text-slate-500 mt-1">
              Store lithium and mobile batteries in dry, cool cardboard boxes. Never store in wet gunny sacks.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-black text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <span>🔥 2. No Open Acid Washing or Burning</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">
              Open wire burning and acid gold leaching release toxic cyanide and dioxins. Hand over whole intact cables and motherboards directly to authorized dismantlers for higher net value.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-black text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <span>🧤 3. Wear Heavy Gloves & Safety Boots</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">
              Protect against cut hazards from broken cathode ray tubes and exposed sharp chassis edges during lot loading.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

// 6. ACCOUNT PROFILE VIEW MODAL (/account)
export function AccountModal({
  isOpen,
  onClose,
  selectedLocation,
  onChangeLocation,
  onExitToLanding,
  isOnline,
  onToggleOnline,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
  onExitToLanding: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Collector Profile & Settings
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-black text-lg">
              K
            </div>
            <div>
              <div className="font-black text-slate-900 text-base">Collector KBD1024</div>
              <div className="text-emerald-800 font-semibold">Informal Scrap Channel Member</div>
              <div className="text-slate-500 text-[11px] mt-0.5">E-Nexus ID: ENX-IND-1024</div>
            </div>
          </div>

          {/* Current Location Setting */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Assigned Catchment Location
            </div>
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {selectedLocation.area ? `${selectedLocation.area}, ` : ''}
                  {selectedLocation.city}, {selectedLocation.state}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onChangeLocation();
                }}
                className="text-emerald-800 font-bold underline cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>

          {/* Network Sync Simulation */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Network / Offline Sync State</div>
              <div className="text-slate-500 text-[11px]">
                {isOnline ? '🟢 Connected (live sync)' : '🟠 Offline (changes queue locally)'}
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleOnline}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer border ${
                isOnline
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              Toggle Mode
            </button>
          </div>

          {/* Return to Landing Page */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onExitToLanding();
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-600" />
              <span>Return to E-Nexus Public Website</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
