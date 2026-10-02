import React from 'react';
import { Clock, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { useLocation, calculateDistanceKm } from '../context/LocationContext';

/**
 * Section 7: Delivery-time message with Honesty Rule
 * Calculates ETA based on store packing time, distance, and traffic.
 * If ETA > 30 min, displays honest true range with explanation badge.
 */
export function DeliveryTimeBadge({ 
  store, 
  variant = 'compact', // 'compact' | 'banner' | 'checkout' | 'detail'
  className = '' 
}) {
  const { currentAddress } = useLocation();

  // Compute location-based ETA
  let distanceKm = 2.4;
  if (store && currentAddress) {
    distanceKm = calculateDistanceKm(store.lat, store.lng, currentAddress.lat, currentAddress.lng);
  }

  const packingMin = store?.basePackingTimeMin || 6;
  // ~3 min per km in metro traffic
  const travelMin = Math.round(distanceKm * 3.2);
  const totalMinLow = packingMin + travelMin;
  const totalMinHigh = totalMinLow + Math.max(5, Math.round(totalMinLow * 0.25));

  // Honesty rule check: if total estimated delivery time exceeds 30 minutes
  const isOver30Min = totalMinHigh > 30 || distanceKm > 6.0;
  
  // Specific reason for honesty rule
  let honestyReason = 'High demand & peak road transit';
  if (distanceKm > 6.0) {
    honestyReason = 'Store is further from your address (>6 km)';
  }

  if (variant === 'banner') {
    return (
      <div className={`p-4 rounded-2xl border transition-all ${
        isOver30Min 
          ? 'bg-amber-50/80 border-amber-200 text-amber-950' 
          : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
      } ${className}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${
            isOver30Min ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {isOver30Min ? <Clock className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black tracking-tight">
                {isOver30Min 
                  ? `Receive your order within ${totalMinLow}–${totalMinHigh} min*`
                  : 'Receive your order within 10–30 min*'
                }
              </span>
              {isOver30Min ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 border border-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  Honest ETA: {honestyReason}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  Reliability Promise
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              *Delivery time is based on your delivery location ({currentAddress?.label || 'Indiranagar'}, ~{distanceKm} km away).
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'checkout') {
    return (
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Standard Service Window:</span>
          <span className="font-bold text-slate-700">10–30 min*</span>
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
          <span className="font-extrabold text-slate-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            Exact ETA for this address:
          </span>
          <span className={`font-black ${isOver30Min ? 'text-amber-600' : 'text-emerald-600'}`}>
            {totalMinLow}–{totalMinHigh} min
          </span>
        </div>
        {isOver30Min && (
          <p className="text-[11px] text-amber-700 font-medium bg-amber-50 p-1.5 rounded border border-amber-200">
            ⚠️ Honesty Rule: Extended due to {honestyReason.toLowerCase()}. No fake rush promises.
          </p>
        )}
        <p className="text-[10px] text-slate-400">
          *Delivery time is based on your delivery location.
        </p>
      </div>
    );
  }

  // Compact variant for store cards and listings
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="flex items-center gap-1.5">
        <Clock className={`w-3.5 h-3.5 ${isOver30Min ? 'text-amber-600' : 'text-emerald-600'}`} />
        <span className={`text-xs font-black tracking-tight ${isOver30Min ? 'text-amber-700' : 'text-emerald-700'}`}>
          {isOver30Min ? `${totalMinLow}–${totalMinHigh} min*` : '10–30 min*'}
        </span>
        {isOver30Min && (
          <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1 rounded">
            HONEST ETA
          </span>
        )}
      </div>
      <span className="text-[10px] text-slate-400 leading-tight">
        *Based on your location ({distanceKm} km)
      </span>
    </div>
  );
}
