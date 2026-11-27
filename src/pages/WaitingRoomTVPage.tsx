import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Activity, Clock, Users, ArrowLeft, Volume2, ShieldCheck, Tv } from 'lucide-react';

export const WaitingRoomTVPage: React.FC = () => {
  const { doctors, queueEntries, navigateTo, playChime } = useQueue();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between selection:bg-emerald-500">
      
      {/* TV Header Bar */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo('live-queue')}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Exit TV Mode"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/30">
            <Activity className="w-7 h-7 text-white" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              MediQueue <span className="text-emerald-400 font-light">· Live Waiting Room Display</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              CareWell Super Specialty Clinic · All Consultation Rooms
            </p>
          </div>
        </div>

        {/* Live Clock & Status */}
        <div className="flex items-center gap-6">
          <button
            onClick={playChime}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800"
            title="Chime"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <div className="text-right">
            <span className="text-3xl font-black font-mono tracking-tight text-emerald-400 block">
              {currentTime}
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Real-time Queue Synced
            </span>
          </div>
        </div>
      </header>

      {/* Main Boards Grid (Room-by-Room Display) */}
      <main className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {doctors.slice(0, 2).map((doc) => {
          const docEntries = queueEntries.filter(e => e.doctorId === doc.id);
          const currentServing = docEntries.find(e => e.status === 'IN_PROGRESS' || e.status === 'CALLED');
          const waitingEntries = docEntries.filter(e => e.status === 'WAITING').slice(0, 4);

          return (
            <div
              key={doc.id}
              className="rounded-3xl bg-slate-900 border-2 border-slate-800 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              {/* Doctor Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
                    {doc.roomNumber}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">{doc.name}</h2>
                  <p className="text-xs text-slate-400">{doc.specialization}</p>
                </div>

                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700"
                />
              </div>

              {/* Now Serving Big Box */}
              <div className="my-6 p-6 rounded-3xl bg-emerald-950/50 border-2 border-emerald-500/50 text-center relative">
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 block mb-1">
                  Now Serving in {doc.roomNumber}
                </span>

                <div className="text-6xl sm:text-7xl font-black font-mono text-white tracking-tight drop-shadow-lg">
                  {currentServing ? currentServing.token : 'Room Ready'}
                </div>

                <p className="text-sm text-slate-300 font-semibold mt-2">
                  {currentServing ? currentServing.patientName : 'Next token will be called shortly'}
                </p>
              </div>

              {/* Next in Line Waiting Strip */}
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-3">
                  Next In Line:
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {waitingEntries.map((entry, idx) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700"
                    >
                      <span className="text-[10px] text-slate-400 block font-semibold">#{idx + 1}</span>
                      <span className="text-lg font-mono font-bold text-amber-300 block">{entry.token}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{entry.patientName.split(' ')[0]}</span>
                    </div>
                  ))}
                  {waitingEntries.length === 0 && (
                    <div className="col-span-4 py-3 text-xs text-slate-500">
                      No further patients waiting in this queue.
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </main>

      {/* TV Footer Ticker */}
      <footer className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-400">PATIENT ADVISORY:</span>
          <span>Please proceed immediately to the consultation corridor when your token appears above.</span>
        </div>
        <div className="font-mono text-slate-500">
          POWERED BY MEDIQUEUE REAL-TIME ENGINE
        </div>
      </footer>

    </div>
  );
};
