import React, { useEffect } from 'react';
import { X, Sparkles, Truck, Gift, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export function WelcomeModal() {
  const { showWelcomeModal, setShowWelcomeModal, user } = useAuth();

  useEffect(() => {
    if (showWelcomeModal) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {
        // silent fallback
      }
    }
  }, [showWelcomeModal]);

  if (!showWelcomeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="welcome-offer-modal"
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-brand-100 transform transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-brand-950 via-brand-800 to-indigo-700 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
          <button
            onClick={() => setShowWelcomeModal(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex p-3 bg-amber-400/20 text-amber-300 rounded-2xl mb-3 border border-amber-400/30">
            <Sparkles className="w-8 h-8 text-amber-300" />
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            Welcome to NOVA CART! 🎉
          </h2>
          <p className="text-emerald-300 font-bold text-lg mt-1 flex items-center justify-center gap-1.5">
            Your first 3 deliveries are FREE 🚚
          </p>
          <p className="text-slate-300 text-xs mt-1">
            Hi {user?.name?.split(' ')[0] || 'there'}, your new customer welcome bundle is active!
          </p>
        </div>

        {/* Perks Breakdown */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-800">3 Free Delivery Tokens</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">NO MIN ORDER</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Delivery fee is ₹0 on orders 1, 2, and 3. Counted only when your order is delivered safely!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-800">50% OFF First Order</h4>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded">AUTO-APPLIED</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Enjoy 50% discount up to ₹150 on your very first order (min cart ₹199). No coupon code required!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800">₹500+ Scratch Card Reward</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Orders of ₹500+ unlock an interactive scratch card with cash vouchers and repeat perks!
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowWelcomeModal(false)}
            id="welcome-modal-start-btn"
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 hover:from-brand-800 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-700/25 flex items-center justify-center gap-2 group transition-all"
          >
            <span>Start Shopping Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
