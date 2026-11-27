import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  User, 
  UserCheck, 
  Users, 
  Tv, 
  FastForward, 
  Wifi, 
  Pause, 
  Play, 
  Volume2, 
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const PersonaSwitcher: React.FC = () => {
  const { 
    role, 
    setRole, 
    activePage, 
    navigateTo, 
    simulateNextStep, 
    simulateReconnect, 
    togglePauseQueue, 
    queueState,
    playChime,
    selectedDoctor,
    updateDoctorAvgTime
  } = useQueue();

  const [expanded, setExpanded] = useState<boolean>(true);
  const [showSpeedControls, setShowSpeedControls] = useState<boolean>(false);

  return (
    <div className="fixed top-20 right-4 z-40 max-w-sm hidden lg:block">
      <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden text-xs">
        
        {/* Header Bar */}
        <div 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/90 cursor-pointer select-none border-b border-slate-700"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-tight text-slate-200">Interactive Demo Controls</span>
          </div>
          <button className="text-slate-400 hover:text-white p-0.5">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="p-3 space-y-3">
            {/* Persona Switches */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                Switch Active Persona
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setRole('PATIENT')}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg font-medium transition-all ${
                    role === 'PATIENT'
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <User className="w-3.5 h-3.5 mb-1 text-emerald-300" />
                  <span className="text-[11px]">Patient</span>
                </button>

                <button
                  onClick={() => setRole('DOCTOR')}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg font-medium transition-all ${
                    role === 'DOCTOR'
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 mb-1 text-blue-300" />
                  <span className="text-[11px]">Doctor</span>
                </button>

                <button
                  onClick={() => setRole('RECEPTIONIST')}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg font-medium transition-all ${
                    role === 'RECEPTIONIST'
                      ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 mb-1 text-teal-300" />
                  <span className="text-[11px]">Front Desk</span>
                </button>
              </div>
            </div>

            {/* Quick Simulation Buttons */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                Real-Time Queue Simulation
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={simulateNextStep}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all font-semibold"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Call Next Patient</span>
                </button>

                <button
                  onClick={() => togglePauseQueue()}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all font-semibold border ${
                    queueState === 'PAUSED'
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {queueState === 'PAUSED' ? (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume Queue</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Queue</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* State Recovery & Audio Chime */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800">
              <button
                onClick={simulateReconnect}
                title="Test socket disconnect and instant state recovery"
                className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[10px]"
              >
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span>Test Reconnect</span>
              </button>

              <button
                onClick={playChime}
                title="Play Turn Bell Chime"
                className="flex items-center justify-center gap-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[10px]"
              >
                <Volume2 className="w-3 h-3 text-emerald-400" />
                <span>Chime</span>
              </button>

              <button
                onClick={() => navigateTo('waiting-room-tv')}
                title="Full Clinic TV Display"
                className="flex items-center justify-center gap-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[10px]"
              >
                <Tv className="w-3 h-3 text-amber-400" />
                <span>TV Mode</span>
              </button>
            </div>

            {/* Dynamic ETA adjustment slider */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Avg Consult Time:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedDoctor.avgConsultationMinutes} mins</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={selectedDoctor.avgConsultationMinutes}
                onChange={(e) => updateDoctorAvgTime(selectedDoctor.id, parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500 block text-right mt-0.5">
                Dynamic ETA recalculated live (PRD §9)
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
