import { useState, useEffect } from 'react';
import { X, Factory, ShieldCheck, CheckCircle2, Scale, Clock, MapPin, Send, PlusCircle, Check } from 'lucide-react';
import { Language, Lot } from '../types';
import { getStoredLots, verifyLotInStorage } from '../lotStore';

interface RecyclerLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onOpenSellModal?: () => void;
}

export default function RecyclerLotModal({ isOpen, onClose, onOpenSellModal }: RecyclerLotModalProps) {
  const [lots, setLots] = useState<Lot[]>([]);
  const [offerSentId, setOfferSentId] = useState<string | null>(null);
  const [verifiedLotId, setVerifiedLotId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'verified'>('all');

  // Load from state/localStorage on mount and whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setLots(getStoredLots());
    }
  }, [isOpen]);

  // Sync across changes in real-time
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

  const handleSendOffer = (id: string) => {
    setOfferSentId(id);
    setLots((prev) =>
      prev.map((lot) => (lot.id === id ? { ...lot, status: 'Under Offer' as const } : lot))
    );
    setTimeout(() => {
      setOfferSentId(null);
    }, 3000);
  };

  const handleSingleClickVerify = (id: string) => {
    const updated = verifyLotInStorage(id, 'EcoGreen Certified Recycler (Scale #04)');
    setLots(updated);
    setVerifiedLotId(id);
    setTimeout(() => {
      setVerifiedLotId(null);
    }, 4000);
  };

  const filteredLots = lots.filter((lot) => {
    const isVerified = lot.status === 'Verified & Certified' || lot.status === 'Weighed & Certified';
    if (activeFilter === 'pending') return !isVerified;
    if (activeFilter === 'verified') return isVerified;
    return true;
  });

  const pendingCount = lots.filter(
    (l) => l.status !== 'Verified & Certified' && l.status !== 'Weighed & Certified'
  ).length;
  const verifiedCount = lots.filter(
    (l) => l.status === 'Verified & Certified' || l.status === 'Weighed & Certified'
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Top bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Recycler Dashboard — Intake & Verification Desk
              </h3>
              <p className="text-[11px] text-emerald-300">
                Authorized Recycler Procurement Desk · Live State & LocalStorage Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Incoming Lots from Informal Collectors
              </h4>
              <p className="text-xs text-slate-600">
                Verify weight on digital scale with 1 click to certify the lot and update the ledger.
              </p>
            </div>
            {onOpenSellModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSellModal();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-colors cursor-pointer self-start"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Create Test Lot (Collector)</span>
              </button>
            )}
          </div>

          {/* Verification Notification Toast */}
          {verifiedLotId && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-2xl flex items-center gap-2.5 mb-5 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold">Lot {verifiedLotId} Verified!</span> Calibrated digital scale slip logged and marked as verified in state & localStorage. Ledger updated in real time.
              </div>
            </div>
          )}

          {offerSentId && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-950 text-xs rounded-xl flex items-center gap-2 mb-4 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Offer sent successfully for <strong>{offerSentId}</strong>. Collector notified with your procurement benchmark.
              </span>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-5 border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Lots ({lots.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              Pending Verification ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('verified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'verified'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              Verified & Certified ({verifiedCount})
            </button>
          </div>

          {/* Lots List */}
          <div className="space-y-3.5 mb-6 max-h-[440px] overflow-y-auto pr-1">
            {filteredLots.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                No lots matching this filter.
              </div>
            ) : (
              filteredLots.map((lot) => {
                const isVerified =
                  lot.status === 'Verified & Certified' || lot.status === 'Weighed & Certified';
                const isNew = lot.postedAgo === 'Just now';

                return (
                  <div
                    key={lot.id}
                    className={`border rounded-2xl p-4 sm:p-5 transition-all shadow-2xs ${
                      isVerified
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isNew
                        ? 'bg-white border-amber-300 ring-2 ring-amber-200/50'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {lot.id}
                        </span>
                        {isNew && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 animate-pulse">
                            NEW LOT
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-900">
                          {lot.collectorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {lot.area}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {lot.postedAgo}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-7">
                        <div className="text-sm font-bold text-slate-900 mb-1">
                          {lot.items}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <Scale className="w-3.5 h-3.5 text-emerald-700" />
                            Weight: {lot.weight}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-800">
                            Est: {lot.estValue}
                          </span>
                          {lot.paymentPreference && (
                            <>
                              <span>•</span>
                              <span className="uppercase text-slate-500 font-medium">
                                Mode: {lot.paymentPreference}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-5 flex flex-wrap sm:justify-end items-center gap-2">
                        {isVerified ? (
                          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
                            <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                            <span>Verified & Certified</span>
                          </div>
                        ) : (
                          <>
                            {/* The 1-Click Verification Button requested by User */}
                            <button
                              id={`btn-verify-${lot.id}`}
                              type="button"
                              onClick={() => handleSingleClickVerify(lot.id)}
                              className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
                              title="Single click to certify weight on calibrated digital scale"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                              <span>1-Click Verify</span>
                            </button>

                            {lot.status !== 'Under Offer' && (
                              <button
                                type="button"
                                onClick={() => handleSendOffer(lot.id)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Send className="w-3 h-3 text-slate-600" />
                                <span>Offer</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom compliance notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                Verified lots record an immutable timestamp and digital scale slip, syncing directly to the Collector's ledger in localStorage.
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl shrink-0 cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
