import React from 'react';
import { X, Sparkles, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CelebrationModal2k() {
  const { showCelebration2k, setShowCelebration2k, itemTotal } = useCart();

  if (!showCelebration2k) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="celebration-2k-modal"
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-200 animate-in zoom-in-95 duration-200 text-center"
      >
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 p-6 text-white relative">
          <button
            onClick={() => setShowCelebration2k(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/30 text-3xl">
            🎉
          </div>

          <h3 className="text-2xl font-black tracking-tight">
            FREE Delivery Unlocked!
          </h3>
          <p className="text-emerald-100 text-xs mt-1">
            Section 5: ₹2,000 Milestone Rule Reached
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left flex items-start gap-3">
            <Truck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold text-slate-800">Zero Token Consumed</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Because your order total is ₹2,000 or more, delivery is ₹0 and your precious free-delivery tokens are <span className="font-bold text-emerald-700">saved for future orders</span>!
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCelebration2k(false)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 text-xs transition-colors"
          >
            Awesome, Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
