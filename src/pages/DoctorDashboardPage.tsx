import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  UserCheck, 
  FastForward, 
  CheckCircle, 
  AlertTriangle, 
  Pause, 
  Play, 
  Clock, 
  Users, 
  MapPin, 
  Stethoscope, 
  Plus, 
  ChevronRight,
  Sliders,
  History
} from 'lucide-react';

export const DoctorDashboardPage: React.FC = () => {
  const { 
    selectedDoctor, 
    queueEntries, 
    callNextPatient, 
    completeCurrentPatient, 
    skipPatient, 
    togglePauseQueue, 
    queueState,
    updateDoctorAvgTime,
    navigateTo
  } = useQueue();

  const [consultationNotes, setConsultationNotes] = useState<string>('Patient reports mild hypertension. BP 134/86. Prescribed refill.');

  // Doctor's queue
  const docQueue = queueEntries.filter(e => e.doctorId === selectedDoctor.id);
  const currentPatient = docQueue.find(e => e.status === 'IN_PROGRESS' || e.status === 'CALLED');
  const waitingPatients = docQueue.filter(e => e.status === 'WAITING');
  const completedPatients = docQueue.filter(e => e.status === 'COMPLETED');
  const skippedPatients = docQueue.filter(e => e.status === 'SKIPPED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4">
          <img
            src={selectedDoctor.avatar}
            alt={selectedDoctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] uppercase tracking-wider border border-emerald-500/30">
                Doctor Consultation Console
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-emerald-400 text-xs font-mono font-semibold">{selectedDoctor.roomNumber}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {selectedDoctor.name}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {selectedDoctor.department} · {selectedDoctor.clinic}
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => togglePauseQueue(selectedDoctor.id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              queueState === 'PAUSED'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
          >
            {queueState === 'PAUSED' ? (
              <>
                <Play className="w-4 h-4" />
                <span>Resume Live Queue</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Queue (Break)</span>
              </>
            )}
          </button>

          <button
            onClick={() => callNextPatient(selectedDoctor.id)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02]"
          >
            <FastForward className="w-4 h-4" />
            <span>Call Next Patient</span>
          </button>
        </div>

      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Waiting in Corridor
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {waitingPatients.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              ~{waitingPatients.length * selectedDoctor.avgConsultationMinutes}m total wait
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Completed Consultations
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600 font-mono">
              {completedPatients.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Today's Session
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg Consult Duration
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {selectedDoctor.avgConsultationMinutes} min/patient
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            step="1"
            value={selectedDoctor.avgConsultationMinutes}
            onChange={(e) => updateDoctorAvgTime(selectedDoctor.id, parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
          />
          <span className="text-[10px] text-slate-400 block mt-1">
            Slider recalculates all patient ETAs dynamically (PRD §9)
          </span>
        </div>

      </div>

      {/* Main Grid: Active Patient in Room + Waiting Queue Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (6 cols): Active Patient In Room */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Active in Consultation Room
                </h3>
              </div>

              {currentPatient && (
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {currentPatient.status}
                </span>
              )}
            </div>

            {currentPatient ? (
              <div className="space-y-6">
                
                {/* Big Token Display */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                      Token Number
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white mt-1">
                      {currentPatient.token}
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                      Consultation Timer
                    </span>
                    <span className="text-2xl font-mono font-bold text-emerald-400">
                      07:42
                    </span>
                  </div>
                </div>

                {/* Patient Profile Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
                    <span className="font-bold text-sm text-slate-900 block mt-0.5">{currentPatient.patientName}</span>
                    <span className="text-slate-500 font-mono">{currentPatient.patientPhone}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Appointment Slot</span>
                    <span className="font-bold text-sm text-emerald-700 block mt-0.5">{currentPatient.slotTime}</span>
                    <span className="text-slate-500">Joined at {currentPatient.joinedAt}</span>
                  </div>
                </div>

                {/* Reason / Symptoms */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Reported Symptoms / Reason</span>
                  <p className="font-semibold text-slate-800 mt-1">{currentPatient.reason || 'General health consultation'}</p>
                </div>

                {/* Clinical Notes Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Quick Clinical Summary / Prescriptions
                  </label>
                  <textarea
                    rows={3}
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Action Buttons: Complete & Skip */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => completeCurrentPatient(selectedDoctor.id)}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Consultation</span>
                  </button>

                  <button
                    onClick={() => skipPatient(currentPatient.id)}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-xs border border-slate-200 hover:border-rose-300 transition-all flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Skip / No-Show</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-600" />
                <p className="text-sm font-bold text-slate-700">Room Ready for Next Patient</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click 'Call Next Patient' above to summon the next patient in line.
                </p>
                <button
                  onClick={() => callNextPatient(selectedDoctor.id)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                >
                  Call Next Patient Now
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Col (6 cols): Waiting Patients Management */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Waiting Queue ({waitingPatients.length})
                </h3>
                <p className="text-xs text-slate-500">Ordered by arrival time & priority</p>
              </div>

              <button
                onClick={() => navigateTo('receptionist')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Walk-in</span>
              </button>
            </div>

            {waitingPatients.length > 0 ? (
              <div className="space-y-3">
                {waitingPatients.map((patient, idx) => (
                  <div
                    key={patient.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-slate-900">
                            {patient.token}
                          </span>
                          {patient.entryType === 'WALK_IN' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              Walk-in
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 truncate">{patient.patientName}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{patient.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right mr-2 hidden sm:block">
                        <span className="text-[10px] text-slate-400 block font-semibold">Est. Wait</span>
                        <span className="text-xs font-mono font-bold text-emerald-700">
                          ~{patient.estimatedWaitMinutes}m
                        </span>
                      </div>

                      <button
                        onClick={() => skipPatient(patient.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Skip patient"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
                <p className="text-xs font-bold text-slate-700">No Waiting Patients</p>
                <p className="text-[11px] text-slate-500 mt-0.5">All appointments have been served.</p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
