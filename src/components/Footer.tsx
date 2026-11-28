import React from 'react';
import { Activity, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy-800 text-white ring-1 ring-white/10 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">MediQueue</p>
              <p className="text-[11px] text-slate-400">
                Know your slot. Know your queue. Know your time.
              </p>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] space-y-1 text-slate-400">
            <p className="flex items-center justify-center md:justify-end gap-1.5 text-slate-300 font-medium">
              <span>Developed for HealthTech Queue Systems</span>
              <span className="text-slate-600">·</span>
              <span>Team RADIANS</span>
            </p>
            <p>
              RCC Institute of Information Technology · Built with Next.js PWA, Socket.IO & PostgreSQL Architecture
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
