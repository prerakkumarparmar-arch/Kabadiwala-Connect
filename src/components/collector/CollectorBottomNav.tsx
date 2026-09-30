import { Home, PackagePlus, IndianRupee, ClipboardList, User } from 'lucide-react';

export type CollectorTab = 'home' | 'sell' | 'prices' | 'lots' | 'account';

interface CollectorBottomNavProps {
  activeTab: CollectorTab;
  onSelectTab: (tab: CollectorTab) => void;
}

export default function CollectorBottomNav({ activeTab, onSelectTab }: CollectorBottomNavProps) {
  const tabs: {
    id: CollectorTab;
    label: string;
    route: string;
    icon: typeof Home;
    highlightPrimary?: boolean;
  }[] = [
    { id: 'home', label: 'Home', route: '/collector', icon: Home },
    { id: 'sell', label: 'Sell', route: '/sell', icon: PackagePlus, highlightPrimary: true },
    { id: 'prices', label: 'Prices', route: '/prices', icon: IndianRupee },
    { id: 'lots', label: 'My Lots', route: '/lots', icon: ClipboardList },
    { id: 'account', label: 'Account', route: '/account', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg safe-area-bottom"
      aria-label="Collector Bottom Navigation"
    >
      <div className="max-w-md md:max-w-xl mx-auto px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          if (tab.highlightPrimary) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className="flex flex-col items-center justify-center -mt-4 group cursor-pointer"
                aria-label={tab.label}
              >
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-md transition-transform group-active:scale-95 ${
                    isActive
                      ? 'bg-emerald-950 text-white ring-4 ring-emerald-100'
                      : 'bg-emerald-900 text-white hover:bg-emerald-800'
                  }`}
                >
                  <IconComponent className="w-6 h-6 text-emerald-300" />
                </div>
                <span
                  className={`text-[11px] font-extrabold mt-1 ${
                    isActive ? 'text-emerald-900' : 'text-slate-700'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[46px] min-w-[56px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
              aria-label={tab.label}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600'
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
