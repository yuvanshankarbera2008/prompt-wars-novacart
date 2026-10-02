import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useLocation } from '../context/LocationContext';
import { formatINR } from '../utils/formatters';
import { DeliveryTimeBadge } from '../components/DeliveryTimeBadge';
import { CelebrationModal2k } from '../components/CelebrationModal2k';
import { 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Sparkles, 
  Check, 
  Trash2, 
  Plus, 
  Minus, 
  AlertCircle,
  ShieldCheck,
  Tag,
  HelpCircle,
  Gift
} from 'lucide-react';

export function CartPage() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    itemTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    isFreeDeliveryBy2k,
    amountNeededFor2k,
    substituteOptions,
    setSubstitutePreference
  } = useCart();
  const { user, decrementFreeDeliveryToken, markFirstOrderDiscountUsed } = useAuth();
  const { createOrder } = useOrders();
  const { currentAddress } = useLocation();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Explore your favourite neighbourhood stores and enjoy 50% off on your first order!
        </p>
        <Link
          to="/stores"
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-600/20"
        >
          Browse Stores
        </Link>
      </div>
    );
  }

  // Tokens calculation
  const tokensLeft = user?.freeDeliveryTokens ?? 3;
  const hasToken = tokensLeft > 0;

  // Free delivery rules (Section 4 & 5):
  // 1. If cart >= 2000: free delivery unlocked WITHOUT using a token!
  // 2. Else if user has token (or is new customer first 3 orders): free delivery using 1 token
  // 3. Else standard fee ₹35
  const isDeliveryFree = isFreeDeliveryBy2k || hasToken;
  const deliveryFee = isDeliveryFree ? 0 : 35;
  const tokenWillBeUsed = !isFreeDeliveryBy2k && hasToken;

  // First order discount rule (Section 4):
  // 50% discount up to ₹150 with min cart of ₹199
  const isFirstOrderEligible = !user?.hasUsedFirstOrderDiscount && itemTotal >= 199;
  const firstOrderDiscount = isFirstOrderEligible ? Math.min(150, Math.round(itemTotal * 0.5)) : 0;

  const finalTotal = Math.max(0, itemTotal - firstOrderDiscount + deliveryFee);
  const totalSavings = firstOrderDiscount + (isDeliveryFree ? 35 : 0);

  // Scratch card qualification check (Section 9)
  const isEligibleForScratchCard = finalTotal >= 500;

  const handleCheckout = () => {
    const store = cartItems[0]?.store;

    // Deduct free delivery token if applicable
    if (tokenWillBeUsed) {
      decrementFreeDeliveryToken();
    }

    if (isFirstOrderEligible) {
      markFirstOrderDiscountUsed();
    }

    const newOrder = createOrder({
      items: cartItems,
      itemTotal,
      firstOrderDiscount,
      deliveryFee,
      finalTotal,
      savingsTotal: totalSavings,
      deliveryAddress: currentAddress,
      store,
      usedFreeDeliveryToken: tokenWillBeUsed,
      usedFirstOrderDiscount: isFirstOrderEligible,
      isScratchCardEligible: isEligibleForScratchCard,
      substitutesPreferences: substituteOptions
    });

    clearCart();
    navigate(`/tracking/${newOrder.id}`);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Cart & Checkout</h1>
          <p className="text-xs text-slate-500">Transparent billing from neighbourhood stores</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Delivery Tracker & ₹2,000 Milestone Banner (Section 5) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* 3-Icon Free Delivery Tracker */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-slate-700">Free Deliveries Remaining:</span>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
              {[1, 2, 3].map((num) => (
                <Truck
                  key={num}
                  className={`w-4 h-4 ${
                    num <= tokensLeft ? 'text-emerald-500' : 'text-slate-300'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-slate-800 ml-1">
                {tokensLeft} of 3 left
              </span>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500">
            Cart Total: <span className="text-slate-900 font-black">{formatINR(itemTotal)}</span> / ₹2,000
          </div>
        </div>

        {/* Progress Bar towards ₹2,000 Free Delivery Rule */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFreeDeliveryBy2k ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-500 to-indigo-600'
              }`}
              style={{ width: `${Math.min(100, (itemTotal / 2000) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            {isFreeDeliveryBy2k ? (
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                🎉 ₹2,000 Free Delivery Rule Unlocked! (No token will be used)
              </span>
            ) : (
              <span className="text-slate-600 font-medium">
                Add items worth <span className="font-extrabold text-brand-600">{formatINR(amountNeededFor2k)}</span> more to unlock FREE delivery without consuming a token!
              </span>
            )}
            <span className="font-bold text-slate-400">Target: ₹2,000</span>
          </div>
        </div>
      </div>

      {/* First-Order 50% OFF Banner (Section 4) */}
      {isFirstOrderEligible && (
        <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-black">🎁 50% OFF your first order auto-applied!</h4>
              <p className="text-xs text-amber-100">Enjoy 50% off up to ₹150 (Min cart ₹199)</p>
            </div>
          </div>
          <span className="text-sm font-black bg-white text-orange-600 px-3 py-1 rounded-xl shadow-xs">
            Save {formatINR(firstOrderDiscount)}
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">
            Selected Items ({cartItems.length})
          </h2>

          {cartItems.map(({ product, store, quantity }) => (
            <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-xl bg-slate-100" />
                  </div>
                  <div>
                    {/* Section 12 Availability Confidence Tag */}
                    <div className="mb-1">
                      {product.availabilityConfidence === 'high' && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                          ✅ Confirmed In Stock
                        </span>
                      )}
                      {product.availabilityConfidence === 'medium' && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
                          🟡 Medium (Few Left)
                        </span>
                      )}
                      {product.availabilityConfidence === 'low' && (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded">
                          🔴 Rare (Substitute recommended)
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-slate-800">{product.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{product.unit} • from {store.name}</p>
                    <p className="text-xs font-black text-slate-900 mt-1">{formatINR(product.price)}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 shadow-2xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black px-1.5">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Section 12: Substitutes before failure choice */}
              <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                <span className="text-slate-500 font-medium">If unavailable at store:</span>
                <select
                  value={substituteOptions[product.id] || 'similar'}
                  onChange={(e) => setSubstitutePreference(product.id, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-700 focus:outline-none"
                >
                  <option value="similar">Replace with similar verified item</option>
                  <option value="ask">Ask me on chat before replacing</option>
                  <option value="remove">Remove item if unavailable</option>
                </select>
              </div>
            </div>
          ))}

          {/* Section 9: Scratch Card Eligibility Callout */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Gift className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold text-indigo-900">₹500+ Scratch Card Reward</span>
                <p className="text-indigo-700 mt-0.5">
                  {isEligibleForScratchCard 
                    ? "🎉 You've unlocked an interactive scratch card on order completion!"
                    : `Add items worth ${formatINR(500 - finalTotal)} more to unlock a surprise scratch card!`}
                </p>
              </div>
            </div>
            {isEligibleForScratchCard && (
              <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full shrink-0">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Checkout Summary Box */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Bill Summary</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Item Total</span>
                <span className="font-bold text-slate-900">{formatINR(itemTotal)}</span>
              </div>

              {isFirstOrderEligible && (
                <div className="flex justify-between text-amber-700 font-bold bg-amber-50 p-2 rounded-xl">
                  <span>🎁 50% First Order Discount</span>
                  <span>-{formatINR(firstOrderDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    FREE
                  </span>
                ) : (
                  <span className="font-bold">{formatINR(deliveryFee)}</span>
                )}
              </div>

              {tokenWillBeUsed && (
                <p className="text-[10px] text-slate-500">
                  (1 of your {tokensLeft} free delivery tokens will be applied upon delivery)
                </p>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                <span>Final Payable</span>
                <span className="text-brand-700">{formatINR(finalTotal)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="p-2 bg-emerald-50 rounded-xl text-center text-xs font-black text-emerald-800 border border-emerald-200">
                  You saved {formatINR(totalSavings)}! 🌟
                </div>
              )}
            </div>

            {/* Section 7 Delivery-time message at checkout */}
            <DeliveryTimeBadge store={cartItems[0]?.store} variant="checkout" />

            {/* Anti-Abuse Check Assurance (Section 4) */}
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Anti-Abuse Verified: Mobile • Device • Address fingerprint</span>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handleCheckout}
              id="checkout-confirm-btn"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <span>Place Order ({formatINR(finalTotal)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <CelebrationModal2k />
    </div>
  );
}
