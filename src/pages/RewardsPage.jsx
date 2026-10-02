import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRewards } from '../context/RewardsContext';
import { 
  Gift, 
  Sparkles, 
  Copy, 
  Check, 
  Truck, 
  Award, 
  Users, 
  Share2, 
  Store,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { ScratchCard } from '../components/ScratchCard';
import { formatINR } from '../utils/formatters';
import stores from '../data/stores.json';

export function RewardsPage() {
  const { user } = useAuth();
  const { scratchCards, claimedCoupons, storeStamps } = useRewards();

  const [copiedCode, setCopiedCode] = useState(false);

  const activeScratchCard = scratchCards.find(c => !c.isScratched) || scratchCards[0];

  const handleCopyReferral = () => {
    const text = `Shop from your local neighbourhood stores on NOVA CART and get 50% OFF your first order + 3 FREE deliveries! Use my code: ${user?.referralCode || 'NOVA-YUVAN-26'} https://novacart.local/login`;
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // Tier progress
  const orderCount = user?.deliveredOrdersCount || 1;
  let nextTier = 'Silver Member';
  let neededForNext = Math.max(0, 4 - orderCount);
  let tierProgress = Math.min(100, (orderCount / 4) * 100);

  if (orderCount >= 4 && orderCount < 10) {
    nextTier = 'Gold Member';
    neededForNext = Math.max(0, 10 - orderCount);
    tierProgress = Math.min(100, ((orderCount - 4) / 6) * 100);
  } else if (orderCount >= 10) {
    nextTier = 'Nova Champion VIP';
    neededForNext = 0;
    tierProgress = 100;
  }

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
            Retention & Loyalty Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Rewards, Scratch Cards & Local Loyalty
        </h1>
        <p className="text-xs text-slate-500">
          Earn free deliveries, store stamps, and exclusive vouchers by shopping regularly from neighbourhood stores.
        </p>
      </div>

      {/* 1. Interactive Scratch Card Section (Section 9) */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>₹500+ Order Bonus</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Wow, great order! 🌟 You're a Nova Star.
          </h2>
          <p className="text-xs text-slate-300">
            Scratch the foil card below with your mouse or finger to reveal your surprise reward!
          </p>
        </div>

        {activeScratchCard && (
          <div className="pt-2">
            <ScratchCard card={activeScratchCard} />
          </div>
        )}
      </section>

      {/* 2. Free Delivery & Loyalty Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Free Delivery Token Tracker */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Free Delivery Wallet</span>
              <Truck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900">{user?.freeDeliveryTokens ?? 3}</span>
              <span className="text-xs font-bold text-slate-400">/ 3 Remaining</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3].map((num) => (
                <Truck
                  key={num}
                  className={`w-4 h-4 ${
                    num <= (user?.freeDeliveryTokens ?? 3) ? 'text-emerald-500' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Scratch cards & orders ₹2,000+ unlock extra tokens!
          </p>
        </div>

        {/* Member Tier Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Loyalty Tier</span>
              <Award className="w-5 h-5 text-brand-600" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-black text-brand-700">{user?.loyaltyTier || 'Nova Member'}</span>
              <p className="text-xs text-slate-600 font-bold mt-0.5">{user?.loyaltyPoints || 150} Nova Coins</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-brand-600 h-full rounded-full" style={{ width: `${tierProgress}%` }} />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {neededForNext > 0 ? `${neededForNext} more orders to reach ${nextTier}` : 'Max VIP tier reached!'}
          </p>
        </div>

        {/* NOVA Wallet */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">NOVA Credit Wallet</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-slate-900">{formatINR(user?.walletBalance || 50)}</span>
              <p className="text-xs text-emerald-600 font-bold mt-0.5">Includes delay compensations</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Automatically deducted from your next checkout bill.
          </p>
        </div>
      </div>

      {/* 3. Store-Specific Loyalty Stamp Cards (Section 13) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Neighbourhood Store Stamp Cards</h2>
            <p className="text-xs text-slate-500">
              Collect stamps every time you order from your favourite local shops!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.slice(0, 4).map((st) => {
            const stampsEarned = storeStamps[st.id] || 2;
            const required = st.loyaltyProgram?.stampsRequired || 5;
            const isCompleted = stampsEarned >= required;

            return (
              <div key={st.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{st.name}</h4>
                    <p className="text-xs text-slate-500">{st.locality}</p>
                  </div>
                  <span className="text-xs font-black bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full">
                    {stampsEarned} / {required} Stamps
                  </span>
                </div>

                <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-2 text-xs">
                  <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-amber-950 font-bold">Reward: {st.loyaltyProgram?.rewardTitle}</span>
                </div>

                {/* Stamp Circles */}
                <div className="flex items-center gap-2 pt-1">
                  {Array.from({ length: required }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                        i < stampsEarned
                          ? 'bg-gradient-to-tr from-brand-700 to-indigo-600 text-white shadow-xs scale-105'
                          : 'bg-slate-100 text-slate-400 border border-dashed border-slate-300'
                      }`}
                    >
                      {i < stampsEarned ? '🏷️' : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Referral Program & Tracker (Section 10) */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold bg-white/20 text-emerald-200 px-3 py-1 rounded-full border border-white/20 inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Give ₹100, Get ₹100</span>
            </span>
            <h3 className="text-xl font-black">Invite Friends to Your Neighbourhood</h3>
            <p className="text-xs text-slate-300 max-w-lg">
              Share your personal invite code. When your friend delivers their first order, you both get ₹100 credited to your NOVA Wallets!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center sm:text-right shrink-0">
            <p className="text-[10px] text-emerald-200 uppercase font-bold">Your Unique Code</p>
            <p className="text-lg font-mono font-black tracking-wider mt-0.5">{user?.referralCode || 'NOVA-YUVAN-26'}</p>
            <button
              onClick={handleCopyReferral}
              className="mt-2 w-full px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>
          </div>
        </div>

        {/* Referral Tracker */}
        <div className="pt-3 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 bg-white/5 rounded-2xl">
            <p className="text-[10px] text-slate-300 font-semibold">Friends Joined</p>
            <p className="text-lg font-black text-emerald-300 mt-0.5">3</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl">
            <p className="text-[10px] text-slate-300 font-semibold">Orders Completed</p>
            <p className="text-lg font-black text-amber-300 mt-0.5">2</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl">
            <p className="text-[10px] text-slate-300 font-semibold">Earned to Wallet</p>
            <p className="text-lg font-black text-white mt-0.5">₹200</p>
          </div>
        </div>
      </section>

      {/* 5. Active Coupons List */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">Your Active Vouchers & Coupons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {claimedCoupons.map((coupon) => (
            <div key={coupon.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl border border-amber-200 font-mono">
                    {coupon.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Expires in {coupon.expiresInDays} days
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-800 mt-3">{coupon.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{coupon.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Min Order: {formatINR(coupon.minOrder)}</span>
                <button
                  onClick={() => alert(`Coupon ${coupon.code} copied!`)}
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
