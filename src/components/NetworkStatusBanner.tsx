import { useLotStore } from '../lotStore';
import { Wifi, WifiOff } from 'lucide-react';

export function NetworkStatusBanner() {
  const { isOnline, lots } = useLotStore();
  const unsyncedCount = lots.filter(l => !l.isSynced).length;

  return (
    <div className={`p-2 text-xs text-center font-bold flex items-center justify-center gap-2 transition-all ${
      isOnline ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>🟢 Online Mode Active {unsyncedCount > 0 && `(Synced ${unsyncedCount} lots)`}</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>⚠️ Offline-First Mode: Data safely stored locally ({unsyncedCount} pending sync)</span>
        </>
      )}
    </div>
  );
}

export default NetworkStatusBanner;
