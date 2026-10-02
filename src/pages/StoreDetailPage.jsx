import React from 'react';
import { useParams, Link } from 'react-router-dom';
import stores from '../data/stores.json';
import products from '../data/products.json';
import { useCart } from '../context/CartContext';
import { DeliveryTimeBadge } from '../components/DeliveryTimeBadge';
import { formatINR } from '../utils/formatters';
import { ArrowLeft, Plus, Check, Heart, ShieldCheck } from 'lucide-react';
import { useSavedShops } from '../context/SavedShopsContext';

export function StoreDetailPage() {
  const { storeId } = useParams();
  const { addToCart, cartItems } = useCart();
  const { toggleSaveStore, isStoreSaved } = useSavedShops();

  const store = stores.find(s => s.id === storeId) || stores[0];
  const storeProducts = products.filter(p => p.storeIds.includes(store.id));
  const isSaved = isStoreSaved(store.id);

  return (
    <div className="space-y-6 pb-20">
      <Link to="/stores" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Stores</span>
      </Link>

      {/* Store Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              ★ {store.rating} ({store.reviewsCount} reviews)
            </span>
            <span className="text-xs text-slate-500 font-medium">• {store.openingHours}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-2">{store.name}</h1>
          <p className="text-xs text-slate-500 mt-1">{store.address}</p>
          
          <div className="mt-3">
            <DeliveryTimeBadge store={store} variant="compact" />
          </div>
        </div>

        <button
          onClick={() => toggleSaveStore(store.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
            isSaved
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
          <span>{isSaved ? 'Saved in My Shops' : 'Save Store'}</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">Available Products ({storeProducts.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {storeProducts.map((prod) => {
            const inCart = cartItems.find(item => item.product.id === prod.id);
            return (
              <div key={prod.id} className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    {/* Availability Confidence Badge (Section 12) */}
                    <div className="absolute top-2 left-2">
                      {prod.availabilityConfidence === 'high' && (
                        <span className="text-[10px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                          ✅ High Stock
                        </span>
                      )}
                      {prod.availabilityConfidence === 'medium' && (
                        <span className="text-[10px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded shadow-xs">
                          🟡 Only {prod.stockCount} left
                        </span>
                      )}
                      {prod.availabilityConfidence === 'low' && (
                        <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded shadow-xs">
                          🔴 Rare Stock
                        </span>
                      )}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{prod.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{prod.unit}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900">{formatINR(prod.price)}</span>
                    {prod.mrp > prod.price && (
                      <span className="text-[10px] text-slate-400 line-through ml-1">{formatINR(prod.mrp)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(prod, store)}
                    className="p-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    {inCart ? <span className="text-[11px] px-1 font-black">+{inCart.quantity}</span> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
