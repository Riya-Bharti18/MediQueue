import React from 'react';
import { useQueue, PageId } from '../context/QueueContext';
import { ChevronRight, Home, Calendar, Activity, Ticket } from 'lucide-react';

interface Step {
  id: PageId;
  label: string;
  stepNumber: number;
}

export const Breadcrumb: React.FC = () => {
  const { activePage, navigateTo, userActiveEntry } = useQueue();

  const steps: Step[] = [
    { id: 'doctors', label: '1. Select Doctor', stepNumber: 1 },
    { id: 'booking', label: '2. Choose Slot & Details', stepNumber: 2 },
    { id: 'live-queue', label: '3. Live Queue & Turn', stepNumber: 3 },
  ];

  if (activePage === 'doctor-dashboard' || activePage === 'receptionist' || activePage === 'waiting-room-tv' || activePage === 'my-tokens') {
    return null;
  }

  const currentStepIndex = steps.findIndex(s => s.id === activePage);

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Step Flow indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {steps.map((step, idx) => {
            const isCurrent = step.id === activePage;
            const isPassed = currentStepIndex > idx;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => navigateTo(step.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent ? 'bg-white text-emerald-700' : isPassed ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step.stepNumber}
                  </span>
                  <span>{step.label.replace(/^\d+\.\s*/, '')}</span>
                </button>

                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Live Token Status Pill */}
        {userActiveEntry && (
          <div 
            onClick={() => navigateTo('live-queue')}
            className="cursor-pointer flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold">Your Token:</span>
            <span className="font-mono font-bold text-emerald-700">{userActiveEntry.token}</span>
            <span className="text-slate-400">·</span>
            <span>{userActiveEntry.patientsAhead} ahead</span>
            <span className="text-slate-400">·</span>
            <span className="font-semibold text-emerald-600">~{userActiveEntry.estimatedWaitMinutes}m wait</span>
          </div>
        )}
      </div>
    </div>
  );
};
