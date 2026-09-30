import { useState, useEffect } from 'react';
import {
  Factory,
  ShieldCheck,
  CheckCircle2,
  Scale,
  Search,
  Check,
  Clock,
  MapPin,
  FileText,
  Smartphone,
  ExternalLink,
  X,
  Printer,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import { Language, Lot } from '../types';
import { getStoredLots, verifyAndCompleteLotInStorage } from '../lotStore';

export interface RecyclerDesktopDashboardProps {
  currentLang?: Language;
  onSwitchToCollector?: () => void;
  onBackToHome?: () => void;
}

export function RecyclerDesktopDashboard({
  currentLang = 'en',
  onSwitchToCollector,
  onBackToHome,
}: RecyclerDesktopDashboardProps) {
  const [lots, setLots] = useState<Lot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [completedLotSlip, setCompletedLotSlip] = useState<Lot | null>(null);
  const [justVerifiedId, setJustVerifiedId] = useState<string | null>(null);

  // Sync lots from localStorage on mount & listen to real-time events
  useEffect(() => {
    setLots(getStoredLots());
    const handleUpdate = (e: CustomEvent<Lot[]>) => {
      setLots(e.detail || getStoredLots());
    };
    window.addEventListener('enexus_lots_updated' as any, handleUpdate);
    return () => {
      window.removeEventListener('enexus_lots_updated' as any, handleUpdate);
    };
  }, []);

  const handleVerifyAndComplete = (lotId: string) => {
    const updated = verifyAndCompleteLotInStorage(
      lotId,
      'Gujarat Pollution Control Board Registered Recycler (GPCB #AHM-09)'
    );
    setLots(updated);
    setJustVerifiedId(lotId);

    const completed = updated.find((l) => l.id === lotId);
    if (completed) {
      setCompletedLotSlip(completed);
    }

    setTimeout(() => {
      setJustVerifiedId(null);
    }, 4000);
  };

  // Filter and search
  const filteredLots = lots.filter((lot) => {
    const isCompleted =
      lot.status === 'Verified & Complete' ||
      lot.status === 'Verified & Certified' ||
      lot.status === 'Completed';

    if (statusFilter === 'pending' && isCompleted) return false;
    if (statusFilter === 'completed' && !isCompleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = lot.id.toLowerCase().includes(q);
      const matchItem = lot.items.toLowerCase().includes(q);
      const matchCollector = lot.collectorName.toLowerCase().includes(q);
      const matchArea = lot.area.toLowerCase().includes(q);
      return matchId || matchItem || matchCollector || matchArea;
    }

    return true;
  });

  const totalLots = lots.length;
  const pendingLots = lots.filter(
    (l) =>
      l.status !== 'Verified & Complete' &&
      l.status !== 'Verified & Certified' &&
      l.status !== 'Completed'
  ).length;
  const completedLots = lots.filter(
    (l) =>
      l.status === 'Verified & Complete' ||
      l.status === 'Verified & Certified' ||
      l.status === 'Completed'
  ).length;

  const totalWeightApprox = lots.reduce((acc, l) => {
    const num = parseFloat(l.weight.replace(/[^0-9.]/g, '')) || 0;
    return acc + num;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      
      {/* Recycler Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  Recycler Desktop Dashboard
                </h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  GPCB REG: #AHM-09
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authorized Intake & Scale Verification Desk · Auto-synced with Collector Handovers
              </p>
            </div>
          </div>

          {/* Navigation & Quick toggle buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs py-2 px-3 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              >
                <span>
                  {currentLang === 'hi' ? '← मुख्य पृष्ठ' : currentLang === 'mr' ? '← मुख्य पृष्ठ' : '← Back to Home'}
                </span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-medium">Digital Scale:</span>
              <span className="font-bold text-white font-mono">Scale #04 Online</span>
            </div>

            {onSwitchToCollector && (
              <button
                type="button"
                onClick={onSwitchToCollector}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Open Collector Mobile Screen"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'hi' ? '📱 कलेक्टर मोड' : currentLang === 'mr' ? '📱 कलेक्टर मोड' : '📱 Switch to Collector'}
                </span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Top Metric Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
              <span>TOTAL INTAKE LOTS</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900">{totalLots}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Across all regional catchments</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between text-amber-800 text-xs font-extrabold mb-1">
              <span>PENDING SCALE VERIFY</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-amber-950">{pendingLots}</div>
            <div className="text-[11px] text-amber-800 mt-1 font-semibold">Awaiting 'Verify & Complete'</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-1">
              <span>FINALIZED & COMPLETED</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950">{completedLots}</div>
            <div className="text-[11px] text-emerald-800 mt-1 font-semibold">Scale certified & settled</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
              <span>INTAKE WEIGHT</span>
              <Scale className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900">{totalWeightApprox} kg</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Accumulated dry scrap</div>
          </div>

        </section>

        {/* Toolbar: Search, Filters & Quick Stats */}
        <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Lots ({totalLots})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Pending Action</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-900 text-white font-mono">
                {pendingLots}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'completed'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Finalized</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-200 font-mono">
                {completedLots}
              </span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by lot ID, scrap material, or collector name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
          </div>

        </section>

        {/* Live Lots Table / Stream */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Submitted Lots Intake Stream
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredLots.length} of {lots.length} lots
            </span>
          </div>

          {filteredLots.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800">No lots matching your criteria</div>
              <p className="text-xs text-slate-500 mt-1">
                Try switching the filter or create a new lot on the Collector Mobile Screen.
              </p>
              <button
                type="button"
                onClick={onSwitchToCollector}
                className="mt-4 inline-flex items-center gap-1.5 bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Open Collector Screen</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Lot ID</th>
                    <th className="py-3 px-4">Scrap Category</th>
                    <th className="py-3 px-4">Collector & Location</th>
                    <th className="py-3 px-4">Input Weight</th>
                    <th className="py-3 px-4">Settlement Amount (Approx)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredLots.map((lot) => {
                    const isCompleted =
                      lot.status === 'Verified & Complete' ||
                      lot.status === 'Verified & Certified' ||
                      lot.status === 'Completed';

                    const isJustVerified = justVerifiedId === lot.id;

                    return (
                      <tr
                        key={lot.id}
                        className={`transition-colors ${
                          isJustVerified
                            ? 'bg-emerald-100/70 font-semibold'
                            : isCompleted
                            ? 'bg-emerald-50/30 hover:bg-emerald-50/60'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Lot ID */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-slate-900 text-xs">
                              {lot.id}
                            </span>
                            {lot.postedAgo === 'Just now' && (
                              <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {lot.postedAgo}
                          </div>
                        </td>

                        {/* Scrap Category */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {lot.items}
                        </td>

                        {/* Collector & Area */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{lot.collectorName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{lot.area}</span>
                          </div>
                        </td>

                        {/* Weight */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <span className="bg-slate-100 text-slate-800 font-mono px-2 py-0.5 rounded border border-slate-200">
                            {lot.weight}
                          </span>
                        </td>

                        {/* Settlement Amount (Approx) */}
                        <td className="py-3.5 px-4">
                          <div className="font-black text-emerald-950 text-xs sm:text-sm">
                            {lot.estValue.includes('Approx') ? lot.estValue : `Approx ${lot.estValue}`}
                          </div>
                          {lot.minPrice && lot.maxPrice && (
                            <div className="text-[10px] text-slate-500 font-medium">
                              Benchmark: ₹{lot.minPrice.toLocaleString('en-IN')} – ₹{lot.maxPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>VERIFIED & COMPLETE</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>READY FOR PICKUP</span>
                            </span>
                          )}
                        </td>

                        {/* Action: Verify & Complete Button */}
                        <td className="py-3.5 px-4 text-right">
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={() => setCompletedLotSlip(lot)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl cursor-pointer shadow-2xs transition-all"
                            >
                              <FileText className="w-3.5 h-3.5 text-emerald-700" />
                              <span>View Settlement Slip</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              id={`verify-complete-${lot.id}`}
                              onClick={() => handleVerifyAndComplete(lot.id)}
                              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs px-3.5 py-2 rounded-xl cursor-pointer shadow-xs hover:shadow-md transition-all active:scale-95"
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Verify & Complete</span>
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>

      {/* FINALIZED SETTLEMENT SLIP & CERTIFICATE MODAL */}
      {completedLotSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Slip Header */}
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Digital Weighbridge & Settlement Slip</h3>
                  <p className="text-[11px] text-emerald-300">
                    Officially Finalized Transaction · GPCB Compliance Record
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCompletedLotSlip(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Details */}
            <div className="p-6 space-y-4 text-xs text-slate-800">
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="text-base font-black text-slate-950">{completedLotSlip.id}</div>
                <div className="text-xs font-extrabold text-emerald-800">
                  STATUS: TRANSACTION FINALIZED & COMPLETED
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Scrap Category:</span>
                  <span className="font-bold text-slate-900">{completedLotSlip.items}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Certified Scale Weight:</span>
                  <span className="font-mono font-bold text-slate-900">{completedLotSlip.weight}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-900 font-extrabold text-xs">Settlement Amount (Approx):</span>
                  <span className="font-black text-emerald-950 text-sm">
                    {completedLotSlip.estValue.includes('Approx') ? completedLotSlip.estValue : `Approx ${completedLotSlip.estValue}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Collector / Source:</span>
                  <span className="font-bold text-slate-900">{completedLotSlip.collectorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Verified By:</span>
                  <span className="font-semibold text-slate-800">
                    {completedLotSlip.verifiedBy || 'EcoGreen Certified Scale Hub #04'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Timestamp:</span>
                  <span className="font-mono text-slate-700">
                    {completedLotSlip.verifiedAt || 'Just now'} (Instant Digital Record)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletedLotSlip(null)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-center cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
