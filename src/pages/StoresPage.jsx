import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, MapPin, Heart, ChevronRight } from 'lucide-react';
import stores from '../data/stores.json';
import { useLocation } from '../context/LocationContext';
import { useSavedShops } from '../context/SavedShopsContext';
import { DeliveryTimeBadge } from '../components/DeliveryTimeBadge';

export function StoresPage() {
  const { selectedCity } = useLocation();
  const { toggleSaveStore, isStoreSaved } = useSavedShops();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const cityStores = stores.filter(s => s.city === selectedCity);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Neighbourhood Stores in {selectedCity}
          </h1>
          <p className="text-xs text-slate-500">
            Support local businesses and get ultra-fast reliable delivery
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cityStores.map((st) => {
          const saved = isStoreSaved(st.id);
          return (
            <div
              key={st.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                      {st.badge}
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-base mt-1.5">{st.name}</h3>
                    <p className="text-xs text-slate-500">{st.locality}</p>
                  </div>
                  <button
                    onClick={() => toggleSaveStore(st.id)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-3 text-xs">
                  <span className="font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                    ★ {st.rating} ({st.reviewsCount})
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-medium">{st.openingHours}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2.5">
                  {st.categories.map(cat => (
                    <span key={cat} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <DeliveryTimeBadge store={st} variant="compact" />
                <Link
                  to={`/store/${st.id}`}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Visit Store
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
