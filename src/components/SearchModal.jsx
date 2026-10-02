import React, { useState, useEffect } from 'react';
import { Search, X, Store, Package, ArrowRight, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import products from '../data/products.json';
import stores from '../data/stores.json';
import { formatINR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { addToCart } = useCart();
  const { selectedCity } = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 6);

  const filteredStores = query.trim()
    ? stores.filter(s =>
        s.city === selectedCity &&
        (s.name.toLowerCase().includes(query.toLowerCase()) ||
         s.locality.toLowerCase().includes(query.toLowerCase()) ||
         s.categories.some(c => c.toLowerCase().includes(query.toLowerCase())))
      )
    : stores.filter(s => s.city === selectedCity).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="search-modal-container"
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-brand-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search milk, bread, medicines, stationery, local stores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-200/60 rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Matching Stores */}
          {filteredStores.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Store className="w-4 h-4 text-brand-600" />
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Neighbourhood Stores ({selectedCity})
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredStores.map(st => (
                  <Link
                    key={st.id}
                    to={`/store/${st.id}`}
                    onClick={onClose}
                    className="p-3 rounded-2xl border border-slate-100 hover:border-brand-500/30 hover:bg-slate-50 transition-all flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{st.name}</h5>
                      <p className="text-[11px] text-slate-400">{st.locality} • ★ {st.rating}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matching Products */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  {query ? `Products Found (${filteredProducts.length})` : 'Popular Essentials'}
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">Click to add to cart</span>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No matching products found. Try "milk" or "atta".</p>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map(p => {
                  const store = stores.find(s => p.storeIds.includes(s.id)) || stores[0];
                  return (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-2xl border border-slate-100 hover:border-slate-200 flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl bg-slate-100" />
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">{p.name}</h5>
                          <p className="text-[11px] text-slate-400">
                            {p.unit} • <span className="font-bold text-slate-700">{formatINR(p.price)}</span> • from {store.name}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(p, store);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
