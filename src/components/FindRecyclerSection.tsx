import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Factory,
  MapPin,
  Scale,
  Phone,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Truck,
  ShieldCheck,
  Star,
  Award,
  Zap,
  ArrowUpDown,
  RefreshCw,
  X
} from 'lucide-react';
import { Language, UserLocation } from '../types';
import { TRANSLATIONS } from '../data';
import backendApi, { RecyclerRecord } from '../backendApi';
import { mockRecyclerDataset } from '../datasets';

interface FindRecyclerSectionProps {
  currentLang: Language;
  selectedLocation: UserLocation;
  onChangeLocation: () => void;
  onOpenSellModal: (recyclerId?: string) => void;
}

export default function FindRecyclerSection({
  currentLang,
  selectedLocation,
  onChangeLocation,
  onOpenSellModal,
}: FindRecyclerSectionProps) {
  const [recyclers, setRecyclers] = useState<RecyclerRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyInMyState, setOnlyInMyState] = useState<boolean>(false);
  const [onlyWithPickup, setOnlyWithPickup] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(true);

  // Sorting / Ranking
  const [sortBy, setSortBy] = useState<'rating' | 'capacity' | 'speed'>('rating');

  const t = TRANSLATIONS[currentLang];

  // Fetch recyclers dynamically from backendApi
  const fetchRecyclers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await backendApi.getRecyclers({
        state: onlyInMyState ? selectedLocation.state : undefined,
        acceptedCategory: selectedCategory !== 'all' ? (selectedCategory as any) : undefined,
        pickupRequired: onlyWithPickup ? true : undefined,
        onlyAuthorized: onlyVerified ? true : undefined,
      });

      if (data && data.length > 0) {
        setRecyclers(data);
      } else {
        // Fallback to all recyclers
        const allData = await backendApi.getRecyclers();
        setRecyclers(allData);
      }
    } catch (err) {
      console.error('Failed to fetch recyclers from backendApi', err);
      // Fallback in-memory
      const fallbackList: RecyclerRecord[] = mockRecyclerDataset.map((r) => ({
        id: r.recyclerId,
        facilityName: r.facilityName,
        registeredLegalEntity: r.facilityName + ' Pvt Ltd',
        spcbRegistrationNumber: r.authorizationDetails,
        authorizationStatus: r.authorizationStatus === 'VERIFIED' ? 'VALID_AUTHORIZED' : 'PENDING_RENEWAL',
        serviceArea: {
          state: r.location.state,
          city: r.location.city,
          hubCluster: r.serviceArea,
          radiusKm: 40,
          pickupAvailable: r.pickupAvailability,
        },
        contact: {
          liaisonOfficer: r.contactInfo.contactPerson,
          phone: r.contactInfo.phone,
          supportEmail: r.contactInfo.email,
          dispatchAddress: r.location.address,
        },
        acceptedMaterials: ['pcb', 'cable', 'battery', 'screen'],
        dailyProcessingCapacityMetricTons: r.dailyCapacityTons,
        averageSettlementTimeHours: 0.5,
        rating: 4.8,
        totalRecycledTons: 1420,
        eprPortalRegistered: true,
      }));
      setRecyclers(fallbackList);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation, onlyInMyState, selectedCategory, onlyWithPickup, onlyVerified]);

  useEffect(() => {
    fetchRecyclers();
  }, [fetchRecyclers]);

  // Client-side filtering & Ranking logic
  const filteredAndRankedRecyclers = useMemo(() => {
    return recyclers
      .filter((rec) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = rec.facilityName.toLowerCase().includes(q);
          const matchCity = rec.serviceArea.city.toLowerCase().includes(q);
          const matchLic = rec.spcbRegistrationNumber.toLowerCase().includes(q);
          const matchMaterials = rec.acceptedMaterials.some((m: string) =>
            m.toLowerCase().includes(q)
          );
          if (!matchName && !matchCity && !matchLic && !matchMaterials) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          const hasCategory = rec.acceptedMaterials.some(
            (c: string) => c.toLowerCase().includes(selectedCategory.toLowerCase())
          );
          if (!hasCategory) return false;
        }

        // Verified filter
        if (onlyVerified && rec.authorizationStatus !== 'VALID_AUTHORIZED') {
          return false;
        }

        // Pickup filter
        if (onlyWithPickup && !rec.serviceArea.pickupAvailable) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'capacity') {
          return b.dailyProcessingCapacityMetricTons - a.dailyProcessingCapacityMetricTons;
        }
        if (sortBy === 'speed') {
          return a.averageSettlementTimeHours - b.averageSettlementTimeHours;
        }
        return 0;
      });
  }, [recyclers, searchQuery, selectedCategory, onlyVerified, onlyWithPickup, sortBy]);

  return (
    <section id="recyclers-section" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              <Factory className="w-3.5 h-3.5 text-emerald-700" />
              <span>SPCB / CPCB Authorized Recycler Dataset</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-2">
              Authorized E-Waste Recycler Directory
            </h2>
            
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect directly with verified formal recyclers holding valid Central & State Pollution Control Board authorizations. All facilities operate certified digital weigh scales with instant spot settlement.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={fetchRecyclers}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              title="Refresh dataset from backendApi"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
              <span>{isLoading ? 'Loading...' : 'Refresh Recyclers'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenSellModal()}
              className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              + Create Lot for Any Recycler
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm mb-8 space-y-4">
          
          {/* Top Row: Search Input + Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input (8 cols) */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by facility name, industrial area, license number, or material..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Ranking / Sorting (4 cols) */}
            <div className="md:col-span-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-500 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="rating">Top Rated (★ Stars)</option>
                <option value="capacity">Highest Daily Capacity (MT/Day)</option>
                <option value="speed">Fastest Settlement Speed</option>
              </select>
            </div>

          </div>

          {/* Bottom Row: Category Pills + Toggle Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            
            {/* Material Fraction Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider text-[10px]">
                Material:
              </span>
              {[
                { id: 'all', label: 'All Fractions' },
                { id: 'PCB', label: 'Circuit Boards (PCBs)' },
                { id: 'Cable', label: 'Cables & Wiring' },
                { id: 'Battery', label: 'Batteries' },
                { id: 'Display', label: 'Screens / CRTs' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyWithPickup(!onlyWithPickup)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  onlyWithPickup
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Doorstep Pickup Only</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyInMyState(!onlyInMyState)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  onlyInMyState
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>In {selectedLocation.state} Only</span>
              </button>
            </div>

          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-semibold px-1">
          <span>
            Found <strong>{filteredAndRankedRecyclers.length}</strong> Authorized E-Waste Facilities
          </span>
          <span className="text-slate-400">
            CPCB / SPCB Authorized Recyclers Registry 2026
          </span>
        </div>

        {/* Recyclers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="h-6 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-20 bg-slate-100 rounded-2xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredAndRankedRecyclers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Factory className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800 mb-1">No recyclers matched your criteria</h4>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              Try resetting the filters or searching across all states to view regional authorized e-waste aggregators.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyInMyState(false);
                setOnlyWithPickup(false);
              }}
              className="bg-emerald-900 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndRankedRecyclers.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-700/60 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      <span>SPCB Verified</span>
                    </span>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-xs font-extrabold">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{rec.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Facility Name & Entity */}
                  <h3 className="text-lg font-black text-slate-950 mb-1 leading-snug group-hover:text-emerald-900 transition-colors">
                    {rec.facilityName}
                  </h3>

                  <div className="text-[11px] font-mono text-slate-400 mb-2 truncate" title={rec.spcbRegistrationNumber}>
                    License: {rec.spcbRegistrationNumber}
                  </div>

                  {/* Location and Radius */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{rec.contact.dispatchAddress || `${rec.serviceArea.city}, ${rec.serviceArea.state}`}</span>
                  </div>

                  {/* Capacity & Scale specs */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-4 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Processing Capacity:</span>
                      <span className="font-extrabold text-slate-900">
                        {rec.dailyProcessingCapacityMetricTons} MT / Day
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Scale Verification:</span>
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <Scale className="w-3 h-3 text-emerald-700" />
                        <span>Certified Weighbridge</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Settlement Speed:</span>
                      <span className="font-bold text-emerald-900 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Instant UPI (~{Math.round(rec.averageSettlementTimeHours * 60)} mins)</span>
                      </span>
                    </div>

                    {rec.serviceArea.pickupAvailable && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                          <Truck className="w-3 h-3" /> Pickup within {rec.serviceArea.radiusKm}km
                        </span>
                        <span className="text-slate-400">Available</span>
                      </div>
                    )}
                  </div>

                  {/* Accepted Materials */}
                  <div className="mb-4">
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                      Authorized Fractions:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {rec.acceptedMaterials.map((m) => (
                        <span
                          key={m}
                          className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium capitalize"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Card Bottom CTA Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`tel:${rec.contact.phone}`}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs flex items-center justify-center transition-colors cursor-pointer"
                    title={`Call ${rec.contact.liaisonOfficer}: ${rec.contact.phone}`}
                  >
                    <Phone className="w-4 h-4 text-emerald-800" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onOpenSellModal(rec.id)}
                    className="flex-1 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors text-center cursor-pointer shadow-2xs hover:shadow"
                  >
                    Handover Lot Here
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
