import React from 'react';
import { useQueue } from '../context/QueueContext';
import { CheckCircle2, AlertCircle, Info, Bell, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useQueue();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
        let borderClass = 'border-blue-200 bg-white/95 text-slate-800';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          borderClass = 'border-emerald-300 bg-emerald-50/95 text-emerald-950 shadow-emerald-500/10';
        } else if (toast.type === 'alert') {
          icon = <Bell className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />;
          borderClass = 'border-amber-400 bg-amber-50/95 text-amber-950 shadow-amber-500/20 ring-2 ring-amber-400/50';
        } else if (toast.type === 'warning') {
          icon = <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-300 bg-white/95 text-slate-800';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
