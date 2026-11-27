import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Ticket, 
  FastForward, 
  Tv, 
  Building2,
  Phone,
  User,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const ReceptionistPage: React.FC = () => {
  const { 
    doctors, 
    selectedDoctor, 
    setSelectedDoctorId, 
    queueEntries, 
    addWalkIn, 
    callNextPatient, 
    skipPatient, 
    navigateTo 
  } = useQueue();

  // Walk-in form state
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [reason, setReason] = useState<string>('');
  const [targetDoctorId, setTargetDoctorId] = useState<string>(selectedDoctor.id);
  const [isPriority, setIsPriority] = useState<boolean>(false);
  const [justCreatedToken, setJustCreatedToken] = useState<string | null>(null);

  // Table filter
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [doctorFilter, setDoctorFilter] = useState<string>('ALL');

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newEntry = addWalkIn({
      doctorId: targetDoctorId,
      patientName,
      patientPhone: patientPhone || '+91 90000 00000',
      patientAge: patientAge ? Number(patientAge) : undefined,
      reason: reason || 'Walk-in Consultation',
      priority: isPriority
    });

    setJustCreatedToken(newEntry.token);
    setPatientName('');
    setPatientPhone('');
    setPatientAge('');
    setReason('');
    setIsPriority(false);
  };

  const filteredEntries = queueEntries.filter((entry) => {
    const matchesSearch = 
      entry.token.toLowerCase().includes(searchFilter.toLowerCase()) ||
      entry.patientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      entry.patientPhone.includes(searchFilter);

    const matchesStatus = statusFilter === 'ALL' || entry.status === statusFilter;
    const matchesDoctor = doctorFilter === 'ALL' || entry.doctorId === doctorFilter;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold uppercase tracking-wider border border-teal-200">
              Front-Desk Operations
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-slate-500 text-xs font-semibold">Centralized Clinic Queue Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Reception & Walk-in Hub
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Issue instant walk-in tokens, manage clinic triage, and coordinate patient arrivals across all consulting rooms.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('waiting-room-tv')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Tv className="w-4 h-4 text-amber-400" />
            <span>Launch Waiting Room TV Display</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 cols): Rapid Walk-in Patient Registration Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Fast Walk-in Registration
                </h3>
                <p className="text-xs text-slate-500">Generates instant digital token in &lt; 5 seconds</p>
              </div>
            </div>

            {justCreatedToken && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-300 flex items-center justify-between animate-fade-in">
                <div>
                  <span className="text-xs font-bold block">Token Issued Successfully!</span>
                  <span className="text-2xl font-black font-mono text-emerald-700">{justCreatedToken}</span>
                </div>
                <button
                  onClick={() => setJustCreatedToken(null)}
                  className="text-xs font-bold text-emerald-800 bg-emerald-200/60 px-3 py-1.5 rounded-lg hover:bg-emerald-200"
                >
                  Dismiss
                </button>
              </div>
            )}

            <form onSubmit={handleCreateWalkIn} className="space-y-4">
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Assign Doctor & Room *
                </label>
                <select
                  value={targetDoctorId}
                  onChange={(e) => setTargetDoctorId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} · {doc.specialization} ({doc.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    placeholder="Years"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Reason for Visit / Triage Notes
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Fever, dizziness, walk-in consultation"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Priority checkbox */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="priorityCheck"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded accent-emerald-600"
                />
                <label htmlFor="priorityCheck" className="text-xs text-amber-950 font-semibold cursor-pointer">
                  Urgent / Priority Triage (Inserts near front of queue)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Issue Walk-in Token & Add to Queue</span>
              </button>

            </form>

          </div>
        </div>

        {/* Right Column (7 cols): Centralized Master Clinic Queue Board */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Master Clinic Queue Board
                </h3>
                <p className="text-xs text-slate-500">Live roster across all consultation rooms</p>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {filteredEntries.length} Total Tokens
              </span>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <div className="relative flex-1 min-w-[160px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter token or name..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="WAITING">Waiting</option>
                <option value="CALLED">Called</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="SKIPPED">Skipped</option>
              </select>

              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="ALL">All Doctors</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Token</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Doctor</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.map((entry) => {
                    const doc = doctors.find(d => d.id === entry.doctorId);
                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-black text-slate-900 whitespace-nowrap">
                          {entry.token}
                          {entry.entryType === 'WALK_IN' && (
                            <span className="ml-1 text-[9px] font-bold px-1 py-0.2 rounded bg-amber-100 text-amber-800">
                              W
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800 block truncate max-w-[120px]">{entry.patientName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{entry.patientPhone}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {doc ? doc.name.replace('Dr. ', '') : 'Doctor'}
                          <span className="block text-[10px] text-slate-400">{doc?.roomNumber}</span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            entry.status === 'CALLED'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : entry.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : entry.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-900'
                              : entry.status === 'SKIPPED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {entry.status === 'WAITING' && (
                            <button
                              onClick={() => skipPatient(entry.id)}
                              className="text-[10px] text-slate-400 hover:text-rose-600 px-2 py-1 rounded hover:bg-rose-50 font-semibold"
                            >
                              Skip
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
