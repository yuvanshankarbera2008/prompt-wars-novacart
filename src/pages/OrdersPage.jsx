import React from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { Truck, ChevronRight, PackageCheck, Clock } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export function OrdersPage() {
  const { orders } = useOrders();

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Your Orders</h1>
        <p className="text-xs text-slate-500">Track current shipments and view order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700">No orders placed yet</h3>
          <p className="text-xs text-slate-400 mt-1">Start shopping from your neighbourhood stores!</p>
          <Link to="/stores" className="inline-block mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
            Shop Stores
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">#{ord.id}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">
                    {ord.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {ord.items?.length || 1} items from <span className="font-bold">{ord.store?.name || 'Local Store'}</span>
                </p>
                <p className="text-xs font-black text-slate-900 mt-0.5">{formatINR(ord.finalTotal || ord.itemTotal)}</p>
              </div>

              <Link
                to={`/tracking/${ord.id}`}
                className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>Track Order</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
