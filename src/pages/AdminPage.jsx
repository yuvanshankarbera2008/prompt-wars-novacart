import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  Package, 
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  Upload,
  Calendar,
  CloudRain,
  Sun,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { formatINR, formatLakhs } from '../utils/formatters';
import { AdCreativeGenerator } from '../components/AdCreativeGenerator';
import products from '../data/products.json';
import stores from '../data/stores.json';

export function AdminPage() {
  const { 
    promoGuardrails, 
    setPromoGuardrails,
    isPromoWarningActive, 
    promoSpendRatio, 
    supportTickets, 
    resolveTicket,
    influencerStats,
    stockOverrides,
    updateProductStock
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('overview'); // overview | stock | demand | guardrail | marketing
  const [selectedStoreId, setSelectedStoreId] = useState('store-blr-01');
  const [bulkUploadSuccess, setBulkUploadSuccess] = useState(false);

  const selectedStore = stores.find(s => s.id === selectedStoreId) || stores[0];
  const storeProducts = products.filter(p => p.storeIds.includes(selectedStore.id));

  const handleBulkUploadSimulate = () => {
    setBulkUploadSuccess(true);
    setTimeout(() => setBulkUploadSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
              Executive Console
            </span>
            <span className="text-xs text-slate-500 font-semibold">Store Intelligence & Guardrails</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Store Owner & Admin Dashboard
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'KPIs & Crisis' },
            { id: 'guardrail', label: 'Promo Guardrails' },
            { id: 'stock', label: 'Live Stock Control' },
            { id: 'demand', label: 'Demand AI Forecast' },
            { id: 'marketing', label: 'Influencers & UTM' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-brand-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PROMO GUARDRAIL ALERT (Section 10 & Business Context) */}
      {isPromoWarningActive && (
        <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-3xl shadow-sm flex items-start gap-4">
          <div className="p-2.5 bg-rose-500 text-white rounded-2xl shrink-0 mt-0.5 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-black text-rose-950 text-sm">
              PROMO GUARDRAIL TRIGGERED: Promo Spend is {promoSpendRatio.toFixed(1)}% of Revenue (Safe Cap: {promoGuardrails.maxPromoSpendPercent}%)
            </h4>
            <p className="text-rose-800 leading-relaxed">
              Current promo burn is <span className="font-extrabold text-rose-950">{formatLakhs(promoGuardrails.currentPromoSpend)}/month</span> against revenue of <span className="font-extrabold text-rose-950">{formatLakhs(promoGuardrails.currentRevenue)}/month</span>. 
              The 79% promo surge has not translated to retention (repeat rate fell from 41% to 27%). NOVA CART's guardrails cap first-order discounts at ₹150 (MOV ₹199) and redirect rewards to repeat store loyalty stamps and saved neighbourhood stores.
            </p>
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW & CRISIS METRICS (Section 1) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 6 Months Ago vs Now Comparison Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Business Performance Diagnostics (6 Months Ago vs Present)
                </h3>
                <p className="text-xs text-slate-500">
                  Every product and UX decision in NOVA CART is engineered to reverse these indicators.
                </p>
              </div>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                Audited Metrics
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Metric</th>
                    <th className="pb-3">6 Months Ago</th>
                    <th className="pb-3">Now (Current)</th>
                    <th className="pb-3">Delta Impact</th>
                    <th className="pb-3">NOVA Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-3 font-bold text-slate-800">Repeat Purchase Rate</td>
                    <td className="py-3 text-slate-600">41%</td>
                    <td className="py-3 text-rose-600 font-black">27%</td>
                    <td className="py-3 text-rose-700 font-bold">-14% drop</td>
                    <td className="py-3 text-emerald-700 font-bold">My Neighbourhood Saved Shops + Store Stamps</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-800">Average Delivery Time</td>
                    <td className="py-3 text-slate-600">29 min</td>
                    <td className="py-3 text-amber-600 font-black">37 min</td>
                    <td className="py-3 text-amber-700 font-bold">+8 min slower</td>
                    <td className="py-3 text-emerald-700 font-bold">Section 7 Honesty Rule (Realistic ETA, no fake rush)</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-800">Order Cancellation Rate</td>
                    <td className="py-3 text-slate-600">6%</td>
                    <td className="py-3 text-rose-600 font-black">11%</td>
                    <td className="py-3 text-rose-700 font-bold">Almost 2x spike</td>
                    <td className="py-3 text-emerald-700 font-bold">Availability Confidence + Pre-failure Substitutes</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-800">Customer Support Tickets</td>
                    <td className="py-3 text-slate-600">3,100 / mo</td>
                    <td className="py-3 text-indigo-600 font-black">5,900 / mo</td>
                    <td className="py-3 text-indigo-700 font-bold">+90% overload</td>
                    <td className="py-3 text-emerald-700 font-bold">Proactive Delay Compensation (₹30 credit) + Auto-refund</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-800">Monthly Promo Burn</td>
                    <td className="py-3 text-slate-600">₹9.5L</td>
                    <td className="py-3 text-rose-600 font-black">₹17.0L</td>
                    <td className="py-3 text-rose-700 font-bold">+79% burn</td>
                    <td className="py-3 text-emerald-700 font-bold">Admin Promo Guardrail (35% revenue cap)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Support Ticket Queue (Section 14) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-600" />
                  <span>Support Ticket Manager (Targeting 5,900 Tickets Reduction)</span>
                </h3>
                <p className="text-xs text-slate-500">1-tap resolution workflow with automated wallet credit refunds</p>
              </div>
              <span className="text-xs font-bold text-slate-400">{supportTickets.length} active tickets</span>
            </div>

            <div className="space-y-2.5">
              {supportTickets.map(t => (
                <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">#{t.id}</span>
                      <span className="text-[10px] font-extrabold uppercase bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
                        {t.issueType}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">• {t.createdAt}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700">{t.description}</p>
                    <p className="text-[11px] text-slate-400">{t.customerName} • {t.customerPhone}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                      t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {t.refundStatus}
                    </span>
                    {t.status !== 'Resolved' && (
                      <button
                        onClick={() => resolveTicket(t.id, true)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                      >
                        1-Tap Auto Refund
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROMO GUARDRAILS CONFIG (Section 10) */}
      {activeTab === 'guardrail' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">Configurable Promo & Discount Guardrails</h3>
            <p className="text-xs text-slate-500">
              Prevent discount abuse and maintain sustainable unit economics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">First-Order Max Discount Cap</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-500">₹</span>
                <input
                  type="number"
                  value={promoGuardrails.maxFirstOrderDiscount}
                  onChange={(e) => setPromoGuardrails(prev => ({ ...prev, maxFirstOrderDiscount: Number(e.target.value) }))}
                  className="w-full text-sm font-bold p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <p className="text-[10px] text-slate-400">Section 4 rule: 50% off up to ₹150</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Minimum Order Value (MOV)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-500">₹</span>
                <input
                  type="number"
                  value={promoGuardrails.minOrderValueFirstOrder}
                  onChange={(e) => setPromoGuardrails(prev => ({ ...prev, minOrderValueFirstOrder: Number(e.target.value) }))}
                  className="w-full text-sm font-bold p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <p className="text-[10px] text-slate-400">Prevents cart split abuse (Set to ₹199)</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Promo Spend Alert Threshold</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={promoGuardrails.maxPromoSpendPercent}
                  onChange={(e) => setPromoGuardrails(prev => ({ ...prev, maxPromoSpendPercent: Number(e.target.value) }))}
                  className="w-full text-sm font-bold p-2 bg-white border border-slate-200 rounded-xl"
                />
                <span className="text-xs font-black text-slate-500">% of Rev</span>
              </div>
              <p className="text-[10px] text-slate-400">Triggers alarm if spend exceeds %</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs space-y-1">
            <h4 className="font-extrabold text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Anti-Abuse Verification Shield</span>
            </h4>
            <p className="text-indigo-800">
              Cross-checks mobile device IDs, phone OTP verification, and geo-delivery address fingerprints to stop fraudulent first-order promo recycling.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE STOCK CONTROL & BULK UPLOAD (Section 11) */}
      {activeTab === 'stock' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Store Inventory & Live Availability Updates</h3>
                <p className="text-xs text-slate-500">Tap to toggle availability confidence; updates live in customer cart</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                >
                  {stores.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>

                <button
                  onClick={handleBulkUploadSimulate}
                  className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Bulk Upload CSV</span>
                </button>
              </div>
            </div>

            {bulkUploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bulk stock inventory sync completed for {selectedStore.name}! 42 items updated.</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Current Count</th>
                    <th className="pb-2">Availability Confidence</th>
                    <th className="pb-2">Quick 1-Tap Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {storeProducts.map((p) => {
                    const currentStatus = stockOverrides[p.id]?.status || p.availabilityConfidence;
                    const count = stockOverrides[p.id]?.count ?? p.stockCount;

                    return (
                      <tr key={p.id}>
                        <td className="py-3">
                          <span className="font-bold text-slate-800">{p.name}</span>
                          <span className="block text-[11px] text-slate-400">{p.unit}</span>
                        </td>
                        <td className="py-3 font-mono font-bold text-slate-800">{count} units</td>
                        <td className="py-3">
                          {currentStatus === 'high' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                              ✅ High Confirmed
                            </span>
                          )}
                          {currentStatus === 'medium' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                              🟡 Medium (Only {count} left)
                            </span>
                          )}
                          {currentStatus === 'low' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                              🔴 Low / Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateProductStock(p.id, 'high', 25)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px]"
                            >
                              In Stock
                            </button>
                            <button
                              onClick={() => updateProductStock(p.id, 'medium', 3)}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-[10px]"
                            >
                              Low (3 left)
                            </button>
                            <button
                              onClick={() => updateProductStock(p.id, 'low', 0)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-[10px]"
                            >
                              Out
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEMAND PREDICTION AI CHARTS (Section 11) */}
      {activeTab === 'demand' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                  Predictive Intelligence
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Demand Forecasting per Product, Store & Time Slot
              </h3>
              <p className="text-xs text-slate-500">
                Weather patterns, weekend spikes, and festival surge anticipation with suggested reorder limits.
              </p>
            </div>

            {/* Visual Bar Chart of Demand Surges */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-600" />
                <span>Weekly Projected Demand Spike by Category</span>
              </h4>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'Fresh Milk & Dairy (Morning 7-9 AM spike)', pct: 92, surge: '+45% Daily', color: 'bg-indigo-600' },
                  { label: 'Chakki Atta & Cooking Oils (Weekend surge)', pct: 78, surge: '+30% Sat-Sun', color: 'bg-emerald-600' },
                  { label: 'Bakery Pastries & Snacks (Evening 5-8 PM)', pct: 85, surge: '+55% Evenings', color: 'bg-amber-500' },
                  { label: 'Emergency OTC Medicines (Monsoon & Flu spike)', pct: 64, surge: '+25% Weather', color: 'bg-rose-500' },
                ].map(bar => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{bar.label}</span>
                      <span className="font-mono font-black text-slate-900">{bar.surge}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Reorder Quantities Alert */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <h5 className="font-black text-amber-950">
                  Suggested Inventory Restock for Indiranagar & HSR Stores
                </h5>
                <p className="text-amber-800">
                  Predicted weekend tea-time demand: Reorder <span className="font-bold">50 loaves Modern Bread</span> and <span className="font-bold">40 Amul Butter packs</span> to avoid out-of-stock cancellations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INFLUENCER & CAMPAIGN MARKETING (Section 10) */}
      {activeTab === 'marketing' && (
        <div className="space-y-6">
          {/* Influencer Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Influencer Campaign Attribution</h3>
              <p className="text-xs text-slate-500">Live order conversions and GMV per creator promo code</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                    <th className="pb-2">Code</th>
                    <th className="pb-2">Creator</th>
                    <th className="pb-2">Delivered Orders</th>
                    <th className="pb-2">Attributed GMV</th>
                    <th className="pb-2">Conversion Rate</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {influencerStats.map((inf) => (
                    <tr key={inf.code}>
                      <td className="py-3 font-mono font-black text-brand-700">{inf.code}</td>
                      <td className="py-3 font-bold text-slate-800">{inf.name}</td>
                      <td className="py-3 font-bold text-slate-700">{inf.orders}</td>
                      <td className="py-3 font-black text-slate-900">{formatINR(inf.gmv)}</td>
                      <td className="py-3 font-bold text-emerald-600">{inf.conversionRate}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          inf.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {inf.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Ad Creative & UTM Link Generator */}
          <AdCreativeGenerator />
        </div>
      )}
    </div>
  );
}
