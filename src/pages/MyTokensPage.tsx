import React from 'react';
import { useQueue } from '../context/QueueContext';
import { Ticket, Calendar, Clock, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { DigitalTokenCard } from '../components/DigitalTokenCard';

export const MyTokensPage: React.FC = () => {
  const { userTokens, doctors, navigateTo } = useQueue();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Patient Wallet
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          My Active & Past Tokens
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your digital consultation tokens, queue positions, and booking details.
        </p>
      </div>

      {userTokens.length > 0 ? (
        <div className="space-y-6">
          {userTokens.map((entry) => {
            const doc = doctors.find(d => d.id === entry.doctorId) || doctors[0];
            return (
              <div key={entry.id} className="space-y-4">
                <DigitalTokenCard
                  entry={entry}
                  doctor={doc}
                />
                <div className="flex justify-center">
                  <button
                    onClick={() => navigateTo('live-queue', { token: entry.token })}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                  >
                    <span>Track Live Position & Turn Alerts</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Active Tokens</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Book an appointment with a specialist to receive your verified digital token.
          </p>
          <button
            onClick={() => navigateTo('doctors')}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Find a Doctor
          </button>
        </div>
      )}

    </div>
  );
};
