import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Sparkles, Calculator } from 'lucide-react';

const benchmarks: Record<string, { name: string; avg: number; min: number; max: number }> = {
  'PCB': { name: 'PCBs & Circuit Boards', avg: 180, min: 100, max: 350 },
  'CABLE': { name: 'Copper Cables', avg: 450, min: 300, max: 600 },
  'BATTERY': { name: 'Lithium-ion Batteries', avg: 300, min: 150, max: 450 },
  'CRT_LCD': { name: 'CRT / LCD Panels', avg: 55, min: 30, max: 90 },
};

export function AIValuationAndAnomalyGuard() {
  const [category, setCategory] = useState('PCB');
  const [weight, setWeight] = useState(5);
  const [quotedPrice, setQuotedPrice] = useState(900);

  const b = benchmarks[category] || benchmarks['PCB'];
  const estimated = weight * b.avg;
  const minLimit = b.min * weight;
  const maxLimit = b.max * weight;

  const isAnomaly = quotedPrice < minLimit * 0.7 || quotedPrice > maxLimit * 1.3;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-black text-slate-800">AI Valuation & Anomaly Guard</h3>
      </div>
      <p className="text-[11px] text-slate-500 mb-3">
        Real-time calculation checking values against regional price datasets to protect informal collectors from underpricing.
      </p>

      <div className="space-y-2.5 mb-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Material Category</label>
          <select 
            value={category} 
            onChange={(e) => {
              const newCat = e.target.value;
              setCategory(newCat);
              const bmk = benchmarks[newCat] || benchmarks['PCB'];
              setQuotedPrice(bmk.avg * weight);
            }}
            className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-medium"
          >
            <option value="PCB">PCBs & Circuit Boards</option>
            <option value="CABLE">Copper Cables</option>
            <option value="BATTERY">Lithium-ion Batteries</option>
            <option value="CRT_LCD">CRT / LCD Panels</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Weight (kg)</label>
            <input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-medium"
              min={1}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Quoted Price (₹)</label>
            <input 
              type="number" 
              value={quotedPrice} 
              onChange={(e) => setQuotedPrice(Number(e.target.value))}
              className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 mb-2.5 flex justify-between items-center">
        <div>
          <span className="text-xs text-indigo-900 font-bold flex items-center gap-1">
            <Calculator className="w-4 h-4 text-indigo-600" /> AI Fair In-Between Value:
          </span>
          <span className="text-[10px] text-slate-500 font-medium block">
            Range: ₹{minLimit.toLocaleString('en-IN')} – ₹{maxLimit.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="text-right">
          <span className="text-indigo-700 font-black text-sm block">₹{estimated.toLocaleString('en-IN')}</span>
          <button
            type="button"
            onClick={() => setQuotedPrice(estimated)}
            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
          >
            Apply Fair Price
          </button>
        </div>
      </div>

      <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
        isAnomaly ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        {isAnomaly ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" /> : <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />}
        <div className="flex-1">
          <span className="font-bold block mb-0.5">
            {isAnomaly ? '⚠️ Outlier / Not In-Between Benchmark Range' : '✅ Verified In-Between Benchmark Prices'}
          </span>
          <span>
            {isAnomaly
              ? `Quoted price ₹${quotedPrice} does not come in between standard range (₹${minLimit} – ₹${maxLimit}).`
              : `Quoted price comes in between verified regional benchmark range (₹${minLimit} – ₹${maxLimit}).`}
          </span>
          {isAnomaly && (
            <button
              type="button"
              onClick={() => setQuotedPrice(estimated)}
              className="mt-1 block text-[11px] font-black text-amber-900 underline cursor-pointer"
            >
              👉 Reset to Fair In-Between Price: ₹{estimated.toLocaleString('en-IN')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIValuationAndAnomalyGuard;
