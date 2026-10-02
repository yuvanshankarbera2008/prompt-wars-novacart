import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Store, ChevronRight } from 'lucide-react';
import { useSavedShops } from '../context/SavedShopsContext';
import stores from '../data/stores.json';
import { DeliveryTimeBadge } from '../components/DeliveryTimeBadge';

export function SavedShopsPage() {
  const { savedStoreIds, toggleSaveStore } = useSavedShops();
  const savedStores = stores.filter(s => savedStoreIds.includes(s.id));

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Neighbourhood Shops</h1>
        <p className="text-xs text-slate-500">Your saved trusted stores with 1-tap fast reordering</p>
      </div>

      {savedStores.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700">No saved shops yet</h3>
          <p className="text-xs text-slate-400 mt-1">Heart any neighbourhood store to save it here for fast reordering!</p>
          <Link to="/stores" className="inline-block mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
            Explore Stores
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedStores.map((st) => (
            <div key={st.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">{st.name}</h3>
                    <p className="text-xs text-slate-500">{st.locality} • ★ {st.rating}</p>
                  </div>
                  <button
                    onClick={() => toggleSaveStore(st.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700"
                  >
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </button>
                </div>
                <div className="mt-3">
                  <DeliveryTimeBadge store={st} variant="compact" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600">Open Now</span>
                <Link
                  to={`/store/${st.id}`}
                  className="px-3 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
                >
                  Order Again
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
