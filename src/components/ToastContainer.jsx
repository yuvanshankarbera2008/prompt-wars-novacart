import React from 'react';
import { useOrders } from '../context/OrderContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useOrders();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
        };

        const bgBorders = {
          success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          warning: 'bg-amber-50 border-amber-200 text-amber-950 shadow-amber-500/10',
          error: 'bg-rose-50 border-rose-200 text-rose-950',
          info: 'bg-white border-slate-200 text-slate-900',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
              bgBorders[toast.type] || bgBorders.info
            }`}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 text-xs font-bold leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
