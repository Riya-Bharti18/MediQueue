import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { LiveQueueRing } from '../components/LiveQueueRing';
import { DigitalTokenCard } from '../components/DigitalTokenCard';
import { 
  Activity, 
  Clock, 
  Users, 
  Bell, 
  Share2, 
  RefreshCw, 
  Volume2, 
  CheckCircle2, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FastForward,
  Pause,
  Play
} from 'lucide-react';

export const LiveQueuePage: React.FC = () => {
  const { 
    selectedDoctor, 
    queueEntries, 
    queueState, 
    activeToken, 
    userActiveEntry,
    logs,
    simulateNextStep,
    simulateReconnect,
    isReconnecting,
    playChime,
    togglePauseQueue,
    navigateTo
  } = useQueue();

  const [activeTab, setActiveTab] = useState<'tracker' | 'ticket' | 'timeline'>('tracker');

  // Filter entries for this doctor
  const doctorEntries = queueEntries.filter(e => e.doctorId === selectedDoctor.id);
  const activeEntries = doctorEntries.filter(e => e.status !== 'COMPLETED' && e.status !== 'SKIPPED');
  
  // Find current serving and user entry
  const currentConsulting = doctorEntries.find(e => e.status === 'IN_PROGRESS' || e.status === 'CALLED');
  const userEntry = userActiveEntry || doctorEntries.find(e => e.token === activeToken) || doctorEntries[1] || doctorEntries[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Top Banner: Doctor & Clinic Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <img
            src={selectedDoctor.avatar}
            alt={selectedDoctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                {selectedDoctor.specialization}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-slate-500 text-xs font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {selectedDoctor.roomNumber}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {selectedDoctor.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              CareWell Super Specialty Clinic · Live Consultation Queue
            </p>
          </div>
        </div>

        {/* Quick Simulator & Live Sync Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={simulateNextStep}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
            title="Advance Queue: Call Next Patient"
          >
            <FastForward className="w-4 h-4" />
            <span>Simulate Turn</span>
          </button>

          <button
            onClick={simulateReconnect}
            disabled={isReconnecting}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Simulate Disconnect & State Recovery"
          >
            <RefreshCw className={`w-4 h-4 ${isReconnecting ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            onClick={playChime}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Test Turn Sound Chime"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
          </button>
        </div>

      </div>

      {/* Main Grid: Live Queue Meter + Digital Ticket / Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (7 cols): Live Queue Tracker Ring */}
        <div className="lg:col-span-7 space-y-6">
          
          {userEntry ? (
            <LiveQueueRing
              entry={userEntry}
              queueState={queueState}
              roomNumber={selectedDoctor.roomNumber}
            />
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No active token selected</p>
              <button
                onClick={() => navigateTo('booking')}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Book a Slot
              </button>
            </div>
          )}

          {/* Current Serving & Next in Line Strip */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Room Progress</span>
              <span className="text-emerald-400 font-mono text-[11px]">Avg: {selectedDoctor.avgConsultationMinutes}m / patient</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Now in Consultation Room
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black font-mono text-white">
                    {currentConsulting ? currentConsulting.token : 'Room Available'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {currentConsulting ? currentConsulting.patientName : 'Ready'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Next Patient Called
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black font-mono text-amber-300">
                    {doctorEntries.find(e => e.status === 'CALLED')?.token || 'A-022'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {doctorEntries.find(e => e.status === 'CALLED')?.patientName || 'Waiting in corridor'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Socket Event Log */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Live Queue Event Broadcasts</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Socket.IO Feed</span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
                >
                  <span className="font-mono text-slate-500 shrink-0 font-semibold">{log.timestamp}</span>
                  <span className="text-slate-700 flex-1">{log.message}</span>
                  {log.token && (
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded text-[10px]">
                      {log.token}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col (5 cols): Digital Token Card & Waiting Queue List */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Digital Token Ticket */}
          {userEntry && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Your Digital Pass</h3>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Verified Token
                </span>
              </div>
              <DigitalTokenCard
                entry={userEntry}
                doctor={selectedDoctor}
              />
            </div>
          )}

          {/* Full Queue Roster */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Full Waiting Queue ({activeEntries.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Ordered by arrival</span>
            </div>

            <div className="space-y-2.5">
              {activeEntries.map((entry, index) => {
                const isUser = entry.token === activeToken;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isUser
                        ? 'border-emerald-500 bg-emerald-50/90 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isUser ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        #{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-sm text-slate-900">
                            {entry.token}
                          </span>
                          {entry.entryType === 'WALK_IN' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              Walk-in
                            </span>
                          )}
                          {isUser && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px] sm:max-w-[180px]">
                          {entry.patientName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                        entry.status === 'CALLED' ? 'text-amber-600 animate-pulse' : 'text-slate-600'
                      }`}>
                        {entry.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ~{entry.estimatedWaitMinutes}m wait
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
