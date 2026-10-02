import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Truck, 
  MapPin, 
  Store, 
  Heart, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Flame,
  Tag,
  Gift,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { useSavedShops } from '../context/SavedShopsContext';
import { DeliveryTimeBadge } from '../components/DeliveryTimeBadge';
import stores from '../data/stores.json';
import products from '../data/products.json';
import { formatINR } from '../utils/formatters';

const CATEGORIES = [
  { id: 'All', label: 'All Items', icon: '🛒' },
  { id: 'Dairy & Bread', label: 'Dairy & Bread', icon: '🥛' },
  { id: 'Groceries & Staples', label: 'Groceries & Atta', icon: '🌾' },
  { id: 'Fresh Fruits & Vegetables', label: 'Fruits & Veggies', icon: '🍎' },
  { id: 'Snacks & Drinks', label: 'Snacks & Chai', icon: '🍪' },
  { id: 'Bakery & Cakes', label: 'Fresh Bakery', icon: '🥐' },
  { id: 'Pharmacy & Healthcare', label: 'Pharmacy Essentials', icon: '💊' },
  { id: 'Stationery & Office', label: 'Stationery & Books', icon: '✏️' },
];

const FESTIVAL_CAMPAIGNS = [
  {
    id: 'fest-01',
    season: 'Diwali Dhamaka',
    title: 'Diwali Festive Sweets & Dry Fruits',
    code: 'DIWALI50',
    discount: 'Flat ₹50 OFF',
    desc: 'Pure ghee sweets & festive dry fruit boxes from heritage neighbourhood mithai stores.',
    bg: 'from-amber-900 via-amber-800 to-yellow-800'
  },
  {
    id: 'fest-02',
    season: 'Holi Colors & Thandai',
    title: 'Organic Gulal & Fresh Thandai',
    code: 'HOLI20',
    discount: '20% OFF',
    desc: 'Skin-safe organic herbal colors and chilled badam thandai packs.',
    bg: 'from-pink-900 via-purple-900 to-indigo-900'
  },
  {
    id: 'fest-03',
    season: 'Weekend Free Delivery Blitz',
    title: 'Weekend Local Shopper Pass',
    code: 'WEEKENDPASS',
    discount: 'FREE Delivery',
    desc: 'Zero delivery fee on all neighbourhood bakeries and grocery stores.',
    bg: 'from-emerald-950 via-teal-900 to-slate-900'
  }
];

export function HomePage() {
  const { user } = useAuth();
  const { selectedCity, currentAddress } = useLocation();
  const { addToCart, cartItems } = useCart();
  const { savedStoreIds, toggleSaveStore, isStoreSaved } = useSavedShops();

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFestivalIndex, setActiveFestivalIndex] = useState(0);

  // Filter stores for the current city
  const cityStores = stores.filter(s => s.city === selectedCity);
  const sampleStore = cityStores[0] || stores[0];

  // Saved stores for "My Neighbourhood"
  const myNeighbourhoodStores = stores.filter(s => savedStoreIds.includes(s.id));

  // Filtered products based on active category
  const filteredProducts = activeCategory === 'All'
    ? products.slice(0, 12)
    : products.filter(p => p.category === activeCategory);

  const popularProducts = products.filter(p => p.isPopular).slice(0, 8);

  const activeFestival = FESTIVAL_CAMPAIGNS[activeFestivalIndex];

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Hero Welcome & Section 7 Delivery-Time Promise */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Connecting 620+ Local Neighbourhood Stores across {selectedCity}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Reliable quick-commerce from your neighbourhood shops.
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            No fake promises. Genuine local store stock with transparent delivery estimates and neighbourhood loyalty rewards.
          </p>

          {/* Section 7 Delivery-Time Message & Honesty Footnote */}
          <div className="pt-2">
            <DeliveryTimeBadge store={sampleStore} variant="banner" />
          </div>

          {/* Value props */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>{user?.freeDeliveryTokens ?? 3} Free Deliveries Remaining</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Availability Confidence Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Seasonal Festival & Offers Carousel (Section 10) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
              Active Offers & Festive Campaigns
            </h2>
          </div>
          <div className="flex gap-1.5">
            {FESTIVAL_CAMPAIGNS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveFestivalIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeFestivalIndex === i ? 'bg-brand-600 w-6' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-3xl bg-gradient-to-r ${activeFestival.bg} text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300`}>
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
              {activeFestival.season}
            </span>
            <h3 className="text-lg font-black tracking-tight">{activeFestival.title}</h3>
            <p className="text-xs text-slate-200 max-w-lg">{activeFestival.desc}</p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shrink-0">
            <div>
              <p className="text-[10px] text-amber-200 font-bold uppercase">Use Coupon Code</p>
              <p className="text-sm font-black font-mono text-white">{activeFestival.code}</p>
            </div>
            <button
              onClick={() => alert(`Coupon ${activeFestival.code} copied!`)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-xl text-xs transition-colors"
            >
              {activeFestival.discount}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Pills */}
      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">Explore by Category</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20 scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. "My Neighbourhood" Saved Shops Row (Section 13) */}
      {myNeighbourhoodStores.length > 0 && (
        <section className="space-y-3 bg-gradient-to-r from-rose-50/50 to-orange-50/50 p-5 rounded-3xl border border-rose-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-xs">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">My Neighbourhood Shops</h3>
                <p className="text-[11px] text-slate-500">Your saved trusted stores with 1-tap fast reordering</p>
              </div>
            </div>
            <Link to="/saved-shops" className="text-xs font-bold text-rose-600 hover:text-rose-800">
              View All ({myNeighbourhoodStores.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {myNeighbourhoodStores.map(st => (
              <div key={st.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">{st.name}</h4>
                  <p className="text-[11px] text-slate-400">{st.locality} • ★ {st.rating}</p>
                  <DeliveryTimeBadge store={st} variant="compact" className="mt-1" />
                </div>
                <Link
                  to={`/store/${st.id}`}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-colors shrink-0"
                >
                  Order
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Stores Delivering to Current Location (Section 6 & 13 Discover Nearby) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Stores Delivering to {currentAddress?.label || selectedCity}
            </h2>
            <p className="text-xs text-slate-500">
              Verified local stores within safe delivery radius (~5-8 km)
            </p>
          </div>
          <Link to="/stores" className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1">
            <span>All Stores ({cityStores.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityStores.map((st) => {
            const isSaved = isStoreSaved(st.id);
            return (
              <div
                key={st.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-brand-500/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                          {st.badge}
                        </span>
                        {st.tags.includes('Local favourite') && (
                          <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                            Local Favourite
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-800 text-sm mt-1.5">{st.name}</h3>
                      <p className="text-xs text-slate-500">{st.locality}</p>
                    </div>

                    <button
                      onClick={() => toggleSaveStore(st.id)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
                      title={isSaved ? "Remove from My Shops" : "Save Store"}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <span className="font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                      ★ {st.rating} ({st.reviewsCount})
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">{st.openingHours}</span>
                  </div>

                  {/* Loyalty Stamp Preview (Section 13) */}
                  {st.loyaltyProgram && (
                    <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-medium truncate max-w-[190px]">
                        Stamp: {st.loyaltyProgram.rewardTitle}
                      </span>
                      <span className="font-black text-brand-700">
                        {st.loyaltyProgram.currentStamps}/{st.loyaltyProgram.stampsRequired} 🏷️
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <DeliveryTimeBadge store={st} variant="compact" />
                  <Link
                    to={`/store/${st.id}`}
                    className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Shop</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Curated Products Grid (Section 11, 12, 13) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {activeCategory === 'All' ? 'Popular Near You & Essentials' : activeCategory}
              </h2>
              <p className="text-xs text-slate-500">Live stock confirmed with availability confidence</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400">{filteredProducts.length} items</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => {
            const store = stores.find(s => prod.storeIds.includes(s.id)) || stores[0];
            const inCart = cartItems.find(item => item.product.id === prod.id);

            return (
              <div key={prod.id} className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    
                    {/* Availability Confidence Badge (Section 12) */}
                    <div className="absolute top-2 left-2">
                      {prod.availabilityConfidence === 'high' && (
                        <span className="text-[10px] bg-emerald-500/90 text-white font-black px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                          ✅ Confirmed Stock
                        </span>
                      )}
                      {prod.availabilityConfidence === 'medium' && (
                        <span className="text-[10px] bg-amber-500/90 text-white font-black px-1.5 py-0.5 rounded shadow-xs">
                          🟡 Only {prod.stockCount} left
                        </span>
                      )}
                      {prod.availabilityConfidence === 'low' && (
                        <span className="text-[10px] bg-rose-500/90 text-white font-black px-1.5 py-0.5 rounded shadow-xs">
                          🔴 Rare Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                    {store.name.split(' ')[0]} {store.name.split(' ')[1]}
                  </span>
                  <h4 className="text-xs font-black text-slate-800 line-clamp-2 leading-snug mt-0.5">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{prod.unit}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900">{formatINR(prod.price)}</span>
                    {prod.mrp > prod.price && (
                      <span className="text-[10px] text-slate-400 line-through ml-1.5">{formatINR(prod.mrp)}</span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(prod, store)}
                    className="p-1.5 px-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                  >
                    {inCart ? (
                      <span className="font-black text-emerald-200">+{inCart.quantity}</span>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
