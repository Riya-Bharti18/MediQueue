import React from 'react';
import { QueueEntry, QueueState } from '../types/queue';
import { Clock, Users, Bell, AlertTriangle, CheckCircle, Activity, Pause } from 'lucide-react';

interface LiveQueueRingProps {
  entry: QueueEntry;
  queueState: QueueState;
  roomNumber: string;
}

export const LiveQueueRing: React.FC<LiveQueueRingProps> = ({ entry, queueState, roomNumber }) => {
  const isCalled = entry.status === 'CALLED';
  const isInConsultation = entry.status === 'IN_PROGRESS';
  const isCompleted = entry.status === 'COMPLETED';
  const isSkipped = entry.status === 'SKIPPED';
  const isPaused = queueState === 'PAUSED';

  // Urgent Turn Notification styling when patient is called or position is 1
  return (
    <div className="w-full">
      {/* High Alert Banner when patient's turn is here */}
      {isCalled && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 border-2 border-amber-300 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-950 text-amber-400 rounded-xl">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-wide">
                🔔 YOUR TURN IS CALLED!
              </h3>
              <p className="text-xs font-semibold opacity-90">
                Please proceed directly to <span className="underline font-bold">{roomNumber}</span> now.
              </p>
            </div>
          </div>
        </div>
      )}

      {isInConsultation && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 border border-emerald-400">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 animate-spin" />
            <div>
              <h3 className="text-base font-bold">Consultation In Progress</h3>
              <p className="text-xs opacity-90">Doctor is currently attending to you in {roomNumber}.</p>
            </div>
          </div>
        </div>
      )}

      {isPaused && (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-3">
          <Pause className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block">Doctor Consultation Temporarily Paused</span>
            <span>Doctor has momentarily stepped out for an emergency review. Queue will resume shortly.</span>
          </div>
        </div>
      )}

      {/* Main Queue Status Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8">
        
        {/* Status Pill Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Live Queue Status
            </span>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isCalled
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : isInConsultation
                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                : isCompleted
                ? 'bg-slate-100 text-slate-800'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              {entry.status}
            </span>
          </div>
        </div>

        {/* Central Counter Display */}
        <div className="flex flex-col items-center justify-center my-4 text-center">
          
          <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-50 via-teal-50 to-slate-50 border-8 border-emerald-100/80 shadow-inner">
            
            {/* Animated Ring Indicator */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" style={{ animationDuration: '8s' }} />

            <div className="flex flex-col items-center z-10">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                You Are
              </span>
              <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-slate-900 my-1">
                #{entry.position > 0 ? entry.position : '1'}
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 px-3 py-0.5 rounded-full">
                in consultation queue
              </span>
            </div>
          </div>

        </div>

        {/* 2-Column Live Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Patients Ahead</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              {entry.patientsAhead}
            </div>
            <span className="text-[11px] text-slate-500">
              {entry.patientsAhead === 0 ? 'You are next in line!' : `${entry.patientsAhead} waiting before you`}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Estimated Wait</span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 font-mono">
              ~{entry.estimatedWaitMinutes}m
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              Dynamic ETA recalculated
            </span>
          </div>

        </div>

        {/* Real-time formula explanation (PRD compliance) */}
        <div className="mt-4 p-3 rounded-xl bg-slate-100/80 text-[11px] text-slate-600 flex items-center justify-between">
          <span className="font-mono">Formula: {entry.patientsAhead} ahead × avg consult time</span>
          <span className="font-semibold text-emerald-700">Dynamic Live Sync</span>
        </div>

      </div>
    </div>
  );
};
