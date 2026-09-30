import { useState, useEffect, useCallback } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Scale,
  ArrowRight,
  Sparkles,
  Factory,
  FileText,
  Wifi,
  WifiOff,
  QrCode,
  Check,
  Building2,
  Clock,
  Printer
} from 'lucide-react';
import { Language, UserLocation, Lot } from '../types';
import { saveNewLot } from '../lotStore';
import backendApi, {
  MaterialRecord,
  OfflineSyncLotPayload,
  SyncQueueItem,
  TransactionRecord,
  TraceabilityRecord
} from '../backendApi';
import { mockMaterialDataset } from '../datasets';

interface SellMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  selectedLocation: UserLocation;
  preSelectedMaterialId?: string;
  preSelectedRecyclerId?: string;
  onLotCreated?: (lot: Lot) => void;
  onOpenRecyclerDashboard?: () => void;
  onViewLedger?: () => void;
}

export default function SellMaterialModal({
  isOpen,
  onClose,
  currentLang,
  selectedLocation,
  preSelectedMaterialId,
  preSelectedRecyclerId,
  onLotCreated,
  onOpenRecyclerDashboard,
  onViewLedger,
}: SellMaterialModalProps) {
  // Materials state
  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-pcb-motherboard');
  const [weightKg, setWeightKg] = useState<number>(30);
  const [conditionGrade, setConditionGrade] = useState<'A_INTACT' | 'B_PARTIAL' | 'C_SCRAP_FRAGMENTS'>('A_INTACT');

  // Collector information
  const [collectorName, setCollectorName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [handoverMethod, setHandoverMethod] = useState<'pickup' | 'center'>('center');
  const [paymentPreference, setPaymentPreference] = useState<'upi' | 'cash' | 'bank'>('upi');

  // Dynamic valuation & EPR bonus calculations
  const [valuation, setValuation] = useState<{
    baseRatePerKg: number;
    effectiveRatePerKg: number;
    grossEstimateInr: number;
    eprIncentiveBonusInr: number;
    netPayableEstimateInr: number;
  } | null>(null);

  // Network & Submission states
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<{
    lot: Lot;
    handoverRef: string;
    form6ManifestId: string;
    isOfflineQueued: boolean;
    qrHash: string;
    grossVal: number;
    eprBonus: number;
    netTotal: number;
  } | null>(null);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize materials from backendApi
  useEffect(() => {
    async function loadMaterials() {
      try {
        const list = await backendApi.getMaterials();
        if (list && list.length > 0) {
          setMaterials(list);
          if (preSelectedMaterialId) {
            setSelectedMaterialId(preSelectedMaterialId);
          } else {
            setSelectedMaterialId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load materials from backendApi', err);
        // In-memory fallback
        const fallbackList: MaterialRecord[] = mockMaterialDataset.map((m) => ({
          id: m.id,
          category: m.category === 'PCBs' ? 'pcb' : m.category === 'Batteries' ? 'battery' : 'cable',
          categoryLabelEn: m.category,
          categoryLabelHi: m.category,
          categoryLabelMr: m.category,
          subCategory: m.subCategory,
          nameEn: m.nameVernacular.en,
          nameHi: m.nameVernacular.hi,
          nameMr: m.nameVernacular.mr,
          description: m.description,
          standardUnit: 'kg',
          approximateWeightPerUnitKg: m.approximateWeight,
          conditionGrades: [
            { grade: 'A_INTACT', description: 'Intact & Clean', valueMultiplier: 1.0 },
            { grade: 'B_PARTIAL', description: 'Semi-Dismantled', valueMultiplier: 0.85 },
            { grade: 'C_SCRAP_FRAGMENTS', description: 'Scrap Fragments', valueMultiplier: 0.65 },
          ],
          hazardousClassification: m.hazardousLevel,
          eprCreditFactor: 1.2,
          estimatedBaseValuePerUnit: m.estimatedValue,
        }));
        setMaterials(fallbackList);
      }
    }
    loadMaterials();
  }, [preSelectedMaterialId]);

  // Update default catchment area when location changes
  useEffect(() => {
    if (selectedLocation) {
      setArea(
        selectedLocation.area
          ? `${selectedLocation.area}, ${selectedLocation.city}`
          : `${selectedLocation.city}, ${selectedLocation.state}`
      );
    }
  }, [selectedLocation]);

  // Recalculate valuation whenever material, weight, or grade changes
  useEffect(() => {
    let active = true;
    async function calc() {
      if (!selectedMaterialId || weightKg <= 0) return;
      try {
        const res = await backendApi.calculateValuation({
          materialId: selectedMaterialId,
          weightKg,
          grade: conditionGrade,
        });
        if (active) {
          setValuation({
            baseRatePerKg: res.baseRatePerKg,
            effectiveRatePerKg: res.effectiveRatePerKg,
            grossEstimateInr: res.grossEstimateInr,
            eprIncentiveBonusInr: res.eprIncentiveBonusInr,
            netPayableEstimateInr: res.netPayableEstimateInr,
          });
        }
      } catch (e) {
        console.error('Valuation error', e);
      }
    }
    calc();
    return () => {
      active = false;
    };
  }, [selectedMaterialId, weightKg, conditionGrade]);

  if (!isOpen) return null;

  const currentMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];

  const isHi = currentLang === 'hi';
  const isMr = currentLang === 'mr';

  const getMaterialLabel = (m?: MaterialRecord) => {
    if (!m) return 'PCBs & Motherboards';
    if (isHi) return m.nameHi || m.nameEn;
    if (isMr) return m.nameMr || m.nameEn;
    return m.nameEn;
  };

  // Form submission handler pushing to Transaction & Traceability datasets
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const cityCode = (selectedLocation.city || 'IND').slice(0, 3).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const mockLotId = `LOT-${cityCode}-${randomNum}`;
      const handoverRef = `EPR-2026-${cityCode}-${randomNum}`;
      const form6ManifestId = `CPCB-M6-2026-${randomNum * 3}`;
      const qrHash = `EPR-HASH-${handoverRef}-SECURE`;

      const gross = valuation?.grossEstimateInr || weightKg * 150;
      const eprBonus = valuation?.eprIncentiveBonusInr || weightKg * 5;
      const net = gross + eprBonus;

      // 1. Prepare offline sync payload
      const syncPayload: OfflineSyncLotPayload = {
        localTempId: mockLotId,
        collectorId: 'COL-CURRENT-USER',
        collectorName: collectorName.trim() || (isMr ? 'अधिकृत कचरा संकलक' : isHi ? 'अधिकृत संग्रहकर्ता' : 'Babu Lal (Collector)'),
        collectorPhone: phone.trim() || '+91 98251 44820',
        materialId: selectedMaterialId,
        materialName: getMaterialLabel(currentMaterial),
        estimatedWeightKg: weightKg,
        conditionGrade,
        userLocation: {
          state: selectedLocation.state,
          city: selectedLocation.city,
          area: area || selectedLocation.city,
        },
        handoverMethod,
        paymentPreference,
        quotedExpectedRateInr: valuation?.effectiveRatePerKg || 150,
        createdAtTimestamp: Date.now(),
      };

      // 2. Push into Offline Queue
      await backendApi.queueLotForSync(syncPayload);

      let isSyncedOnline = false;
      // 3. If online, trigger batch sync engine
      if (isOnline) {
        const syncResult = await backendApi.processSyncQueue();
        if (syncResult.processedCount > 0) {
          isSyncedOnline = true;
        }
      }

      // 4. Create standard Lot record
      const newLot: Lot = {
        id: mockLotId,
        collectorName: syncPayload.collectorName,
        phone: syncPayload.collectorPhone,
        area: syncPayload.userLocation.area,
        items: syncPayload.materialName,
        materialId: selectedMaterialId,
        weightKg: weightKg,
        weight: `${weightKg} ${isMr ? 'किलो' : isHi ? 'किग्रा' : 'kg'}`,
        estValue: `₹${net.toLocaleString('en-IN')}`,
        postedAgo: 'Just now',
        createdAt: Date.now(),
        status: 'Ready for Pickup',
        handoverMethod,
        paymentPreference,
        assignedRecycler: preSelectedRecyclerId || 'Gujarat Pollution Control Board Registered Recycler (Hub #04)',
        isSynced: isSyncedOnline,
      };

      // 5. Commit to local storage store for instant reactivity
      saveNewLot(newLot);

      if (onLotCreated) {
        onLotCreated(newLot);
      }

      setSubmittedResult({
        lot: newLot,
        handoverRef,
        form6ManifestId,
        isOfflineQueued: !isSyncedOnline,
        qrHash,
        grossVal: gross,
        eprBonus,
        netTotal: net,
      });
    } catch (error) {
      console.error('Failed to create lot', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Top Bar */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-300">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isHi ? 'सामग्री बेचें — नया लॉट बनाएं' : isMr ? 'माल विका — नवीन लॉट तयार करा' : 'Sell Material — Create Handover Lot'}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                <span>{selectedLocation.city}, {selectedLocation.state}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  {isOnline ? (
                    <>
                      <Wifi className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Online Sync Ready</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-amber-400" />
                      <span className="text-amber-300">Offline Mode Active</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline notice bar if disconnected */}
        {!isOnline && !submittedResult && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-900">
            <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              <strong>Offline Mode:</strong> Your lot will be securely stored locally in the sync queue and automatically uploaded when connectivity returns.
            </span>
          </div>
        )}

        {submittedResult ? (
          /* Submission Success State with Full Traceability Voucher */
          <div className="p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            {/* Sync Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 border shadow-2xs">
              {!submittedResult.isOfflineQueued ? (
                <div className="flex items-center gap-1.5 text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Synced to Cloud Registry (CPCB Portal v2.4)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                  <span>Queued Offline (Auto-syncs on reconnect)</span>
                </div>
              )}
            </div>

            <h4 className="text-2xl font-black text-slate-900 mb-1 font-mono tracking-tight">
              {submittedResult.lot.id}
            </h4>
            
            <p className="text-xs text-slate-600 max-w-md mx-auto mb-5 leading-relaxed font-medium">
              Handover lot created and recorded into the Transaction and Traceability datasets. Certified digital weighbridge queue active.
            </p>

            {/* Digital Traceability Voucher Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs text-slate-700 mb-6 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">EPR Traceability Reference:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
                  {submittedResult.handoverRef}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">CPCB Form-6 Manifest Ref:</span>
                <span className="font-mono font-bold text-emerald-900">
                  {submittedResult.form6ManifestId}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Material & Weight:</span>
                <span className="font-bold text-slate-900">{submittedResult.lot.weight} {submittedResult.lot.items}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Collector / Catchment:</span>
                <span className="font-medium text-slate-900">{submittedResult.lot.collectorName} ({submittedResult.lot.area})</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <div>
                  <div className="text-[11px] text-slate-500">
                    Gross Scrap: ₹{submittedResult.grossVal.toLocaleString('en-IN')} + EPR Bonus: ₹{submittedResult.eprBonus.toLocaleString('en-IN')}
                  </div>
                  <div className="font-bold text-slate-700">Guaranteed Fair Payout:</div>
                </div>
                <div className="text-xl font-black text-emerald-900 font-mono">
                  ₹{submittedResult.netTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="space-y-2">
              {onOpenRecyclerDashboard && (
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    onOpenRecyclerDashboard();
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs"
                >
                  <Factory className="w-4 h-4 text-emerald-400" />
                  <span>Go to Recycler Dashboard (1-Click Verify on Digital Scale)</span>
                </button>
              )}

              {onViewLedger && (
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    onViewLedger();
                  }}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs"
                >
                  <FileText className="w-4 h-4 text-emerald-300" />
                  <span>View in Price / Ledger Screen</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-xs"
              >
                Create Another Lot
              </button>
            </div>
          </div>
        ) : (
          /* Creation Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            
            {/* 1. Material Selector from backendApi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select E-Waste Material Category
              </label>
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                {materials.map((item) => (
                  <option key={item.id} value={item.id}>
                    {getMaterialLabel(item)} — Base Benchmark: ₹{item.estimatedBaseValuePerUnit}/{item.standardUnit}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Weight & Live Valuation Calculation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Approximate Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">KG</span>
                </div>
              </div>

              {/* Calculated Estimated Range + EPR Incentive */}
              <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-xl p-3 flex flex-col justify-center">
                <div className="text-[11px] font-semibold text-emerald-800 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Est. Guaranteed Value:</span>
                  </span>
                  {valuation && (
                    <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-1.5 py-0.2 rounded">
                      +₹{valuation.eprIncentiveBonusInr} EPR Bonus
                    </span>
                  )}
                </div>
                <div className="text-xl font-black text-emerald-950 font-mono">
                  ₹{valuation?.netPayableEstimateInr.toLocaleString('en-IN') || (weightKg * 150).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  {valuation ? `@ ₹${valuation.effectiveRatePerKg}/kg effective + hazardous credit` : 'Dynamic benchmark calculation'}
                </div>
              </div>
            </div>

            {/* 3. Condition Grade */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Condition Grade (CPCB E-Waste Criteria)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'A_INTACT' as const, label: 'Grade-A: Intact', desc: 'Complete unit' },
                  { id: 'B_PARTIAL' as const, label: 'Grade-B: Partial', desc: 'Semi-dismantled' },
                  { id: 'C_SCRAP_FRAGMENTS' as const, label: 'Grade-C: Scrap', desc: 'Broken shards' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setConditionGrade(g.id)}
                    className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                      conditionGrade === g.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-extrabold">{g.label}</div>
                    <div className="text-[10px] font-normal text-slate-500">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Collector Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Collector Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Bhai (Collector)"
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98251 44820"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* 5. Handover Area & Payment Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Collection Area / Scrap Catchment
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Settlement Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['upi', 'cash', 'bank'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentPreference(mode)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        paymentPreference === mode
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {mode === 'upi' ? 'UPI' : mode === 'cash' ? 'Cash' : 'Bank'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Handover Method Radio */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Handover Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                  handoverMethod === 'center'
                    ? 'border-emerald-700 bg-emerald-50/60'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="handoverMethod"
                    value="center"
                    checked={handoverMethod === 'center'}
                    onChange={() => setHandoverMethod('center')}
                    className="accent-emerald-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Direct Recycler Yard</div>
                    <div className="text-[10px] text-slate-500">Instant digital weigh scale</div>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                  handoverMethod === 'pickup'
                    ? 'border-emerald-700 bg-emerald-50/60'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="handoverMethod"
                    value="pickup"
                    checked={handoverMethod === 'pickup'}
                    onChange={() => setHandoverMethod('pickup')}
                    className="accent-emerald-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Request Doorstep Pickup</div>
                    <div className="text-[10px] text-slate-500">Authorized van dispatch</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Pushing to Traceability & Sync Engine...</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4 text-emerald-200" />
                    <span>Create & Manifest Lot (EPR Form-6)</span>
                    <ArrowRight className="w-4 h-4 text-emerald-200" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
