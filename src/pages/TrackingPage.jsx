import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useRewards } from '../context/RewardsContext';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowLeft,
  Share2,
  RefreshCw,
  Gift,
  Star,
  Zap,
  Check
} from 'lucide-react';
import { TrackingMap } from '../components/TrackingMap';
import { formatINR } from '../utils/formatters';
import confetti from 'canvas-confetti';

const TIMELINE_STEPS = [
  { key: 'placed', label: 'Order Placed', time: 'Just now' },
  { key: 'confirmed', label: 'Store Confirmed (Stock Reserved)', time: '2m auto-timer' },
  { key: 'packing', label: 'Items Packed & Bagged', time: 'In progress' },
  { key: 'partner_assigned', label: 'Delivery Partner Assigned', time: 'Partner at store' },
  { key: 'out_for_delivery', label: 'Out for Delivery', time: 'Rider moving' },
  { key: 'delivered', label: 'Order Delivered Safely', time: 'Arrival' },
];

export function TrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, triggerProactiveDelay, updateOrderStatus, updateRiderLocation, addToast } = useOrders();
  const { addWalletCredit, recordOrderDelivered, user } = useAuth();
  const { awardScratchCard, setActiveScratchModalCard } = useRewards();

  const order = orders.find(o => o.id === orderId) || orders[0];

  const [simulatedProgress, setSimulatedProgress] = useState(order?.statusStepIndex || 1);
  const [currentEta, setCurrentEta] = useState(order?.currentEtaMinutes || 16);
  const [riderCoord, setRiderCoord] = useState(() => {
    return order?.riderLocation || {
      lat: order?.store?.lat || 12.9719,
      lng: order?.store?.lng || 77.6412
    };
  });

  const [isCallingPartner, setIsCallingPartner] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Store & Customer coordinates
  const storeCoord = { lat: order?.store?.lat || 12.9719, lng: order?.store?.lng || 77.6412 };
  const customerCoord = { lat: order?.deliveryAddress?.lat || 12.9718, lng: order?.deliveryAddress?.lng || 77.6415 };

  // Simulated live tracking movement
  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        const next = Math.min(TIMELINE_STEPS.length - 1, prev + 1);
        const nextStep = TIMELINE_STEPS[next];

        // Status update
        updateOrderStatus(order.id, nextStep.key, next);

        // Toast update
        addToast(`Status Update: ${nextStep.label}`, 'info');

        // Interpolate rider coordinates towards customer
        const ratio = (next) / (TIMELINE_STEPS.length - 1);
        const newLat = storeCoord.lat + (customerCoord.lat - storeCoord.lat) * ratio;
        const newLng = storeCoord.lng + (customerCoord.lng - storeCoord.lng) * ratio;
        setRiderCoord({ lat: newLat, lng: newLng });
        updateRiderLocation(order.id, newLat, newLng, Math.max(2, currentEta - 3));

        setCurrentEta(prevEta => Math.max(2, prevEta - 3));

        // When delivered
        if (next === TIMELINE_STEPS.length - 1) {
          recordOrderDelivered();
          addToast("🎉 Order delivered successfully! Enjoy your items!", 'success');
          try {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          } catch (e) {}

          // If order was >= 500, award scratch card
          if (order.finalTotal >= 500 || order.isScratchCardEligible) {
            const card = awardScratchCard(order.id, order.finalTotal);
            addToast("🌟 Wow, great order! You've unlocked an interactive Scratch Card in Rewards!", 'success');
          }
        }

        return next;
      });
    }, 12000); // Progresses smoothly every 12 seconds in demo mode

    return () => clearInterval(interval);
  }, [order?.id, order?.status]);

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <Truck className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">No Active Order Found</h2>
        <p className="text-xs text-slate-500">You don't have any order in progress right now.</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Return to Home
        </Link>
      </div>
    );
  }

  const handleProactiveDelayClick = () => {
    triggerProactiveDelay(order.id);
    addWalletCredit(30, `Delay Compensation for #${order.id}`);
  };

  const handleManualAdvanceStep = () => {
    const nextIndex = Math.min(TIMELINE_STEPS.length - 1, simulatedProgress + 1);
    setSimulatedProgress(nextIndex);
    const nextStep = TIMELINE_STEPS[nextIndex];
    updateOrderStatus(order.id, nextStep.key, nextIndex);

    const ratio = nextIndex / (TIMELINE_STEPS.length - 1);
    const newLat = storeCoord.lat + (customerCoord.lat - storeCoord.lat) * ratio;
    const newLng = storeCoord.lng + (customerCoord.lng - storeCoord.lng) * ratio;
    setRiderCoord({ lat: newLat, lng: newLng });

    if (nextIndex === TIMELINE_STEPS.length - 1) {
      recordOrderDelivered();
      if (order.finalTotal >= 500 || order.isScratchCardEligible) {
        awardScratchCard(order.id, order.finalTotal);
      }
    }
  };

  const isDelivered = order.status === 'delivered' || simulatedProgress === TIMELINE_STEPS.length - 1;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Top Nav & Share */}
      <div className="flex items-center justify-between">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </Link>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            addToast("Tracking link copied to clipboard! 📋", 'info');
          }}
          className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-100"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Tracking Link</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md">
              Order #{order.id}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {isDelivered ? 'Delivered Safely 🎉' : `Arriving in ${currentEta}–${currentEta + 4} min`}
          </h1>
          <p className="text-xs text-slate-500">
            Delivering from <span className="font-bold text-slate-700">{order.store?.name}</span> to{' '}
            <span className="font-bold text-slate-700">{order.deliveryAddress?.label || 'Your Address'}</span>
          </p>
        </div>

        {/* Demo Fast-Forward Button */}
        {!isDelivered && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualAdvanceStep}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              title="Fast-forward order stage for quick verification"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Advance Step (Demo)</span>
            </button>
            {!order.delayCreditGiven && (
              <button
                onClick={handleProactiveDelayClick}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold border border-amber-200 transition-colors"
              >
                Test 5-Min Delay
              </button>
            )}
          </div>
        )}
      </div>

      {/* Proactive Delay Notice (Section 8) */}
      {order.isDelayed && (
        <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl shadow-lg flex items-start gap-3.5 animate-in slide-in-from-top-2 duration-200">
          <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="text-xs">
            <h4 className="font-black text-sm">
              Your order is 5 min late 🙏 Here's ₹30 credit!
            </h4>
            <p className="text-amber-100 mt-0.5">
              Traffic was heavier than usual. We have updated your ETA transparently and immediately added ₹30 to your NOVA Wallet balance.
            </p>
          </div>
        </div>
      )}

      {/* Live Map (Leaflet) */}
      <TrackingMap
        storeCoord={storeCoord}
        customerCoord={customerCoord}
        riderCoord={riderCoord}
      />

      {/* Status Timeline with Animation (Section 8) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">Order Progress Timeline</h3>
        
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {TIMELINE_STEPS.map((step, idx) => {
            const isCompleted = idx <= simulatedProgress;
            const isCurrent = idx === simulatedProgress;

            return (
              <div key={step.key} className="relative flex items-start justify-between gap-4">
                <div
                  className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-white transition-all ${
                    isCurrent
                      ? 'bg-brand-600 ring-4 ring-brand-100 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>

                <div>
                  <h4 className={`text-xs font-black ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isCurrent ? '⚡ Currently in progress' : isCompleted ? 'Completed' : 'Upcoming step'}
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isCurrent ? 'bg-brand-50 text-brand-700' : 'text-slate-400'
                }`}>
                  {step.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Partner Card (Section 8) */}
      {order.partner && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={order.partner.photo}
              alt={order.partner.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-800">{order.partner.name}</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.2 rounded">
                  ★ {order.partner.rating}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {order.partner.vehicle} • <span className="font-mono">{order.partner.plateNumber}</span>
              </p>
              <span className="text-[10px] text-brand-600 font-extrabold">{order.partner.badge}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsCallingPartner(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>Call Champion</span>
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-brand-600/20"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Delivered State: Rating & Scratch Card Prompt */}
      {isDelivered && (
        <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            ✨
          </div>
          <h3 className="text-xl font-black">Thank you for ordering with NOVA CART!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your neighbourhood store has marked this delivery complete. How was your experience?
          </p>

          {/* Star Rating Prompt */}
          {!ratingSubmitted ? (
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setUserRating(star);
                    setRatingSubmitted(true);
                    addToast(`Thank you for rating ${star} stars! 🌟`, 'success');
                  }}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star className={`w-6 h-6 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs font-bold text-emerald-300">
              ✓ Rating of {userRating}★ recorded! Thank you for supporting local stores.
            </p>
          )}

          {/* Section 9: Scratch Card Link */}
          {(order.finalTotal >= 500 || order.isScratchCardEligible) && (
            <div className="pt-2">
              <Link
                to="/rewards"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-lg transition-transform hover:scale-105"
              >
                <Gift className="w-4 h-4 text-slate-950" />
                <span>Scratch Your Order Reward Now!</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Order Details Accordion */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm">Order Summary & Items</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {order.items?.map(({ product, quantity }) => (
            <div key={product.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">{product.name}</span>
                <p className="text-[11px] text-slate-400">Qty: {quantity} • {product.unit}</p>
              </div>
              <span className="font-black text-slate-900">{formatINR(product.price * quantity)}</span>
            </div>
          ))}

          <div className="pt-3 flex justify-between font-black text-sm text-slate-900">
            <span>Total Paid</span>
            <span className="text-brand-700">{formatINR(order.finalTotal || order.itemTotal)}</span>
          </div>
        </div>
      </div>

      {/* Mock Call Modal */}
      {isCallingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-3 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <Phone className="w-8 h-8" />
            </div>
            <h4 className="font-black text-slate-900">Calling {order.partner.name}...</h4>
            <p className="text-xs text-slate-500 font-mono">{order.partner.phone}</p>
            <p className="text-[11px] text-slate-400">Masked for your privacy via NOVA Connect</p>
            <button
              onClick={() => setIsCallingPartner(false)}
              className="w-full py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Mock Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-black text-slate-900 text-sm">Chat with {order.partner.name}</h4>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-xs font-bold text-slate-400">Close</button>
            </div>
            <div className="space-y-2 py-3">
              <div className="bg-slate-100 p-2.5 rounded-xl text-xs text-slate-700 w-fit max-w-[80%]">
                Hello! I have picked up your order from {order.store?.name} and am on my way.
              </div>
              <div className="bg-brand-600 text-white p-2.5 rounded-xl text-xs ml-auto w-fit max-w-[80%]">
                Thank you! Please leave at the doorstep Flat 302.
              </div>
            </div>
            <input
              type="text"
              placeholder="Type message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addToast("Message delivered to delivery champion", 'info');
                  e.target.value = '';
                }
              }}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
