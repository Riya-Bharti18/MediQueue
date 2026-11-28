import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  ChevronRight, 
  Activity, 
  Stethoscope
} from 'lucide-react';
import { Doctor } from '../types/queue';

export const DoctorSearchPage: React.FC = () => {
  const { doctors, setSelectedDoctorId, navigateTo, queueEntries } = useQueue();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', 'Cardiologist', 'General Physician', 'Pediatrician', 'Orthopedic Surgeon'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialization === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctorId(doctor.id);
    navigateTo('booking', { doctorId: doctor.id });
  };

  const handleViewLiveQueue = (doctor: Doctor) => {
    setSelectedDoctorId(doctor.id);
    navigateTo('live-queue', { doctorId: doctor.id });
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Search Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor by name, specialty, or condition (e.g., Cardiology, Dr. Sarah)..."
                  className="w-full pl-11 pr-4 py-3 bg-white/90 text-slate-900 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-medium"
                />
              </div>

              {/* Specialty pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
                {specialties.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedSpecialty === spec
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Doctor Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Participating Specialists
            </h2>
            <p className="text-xs text-slate-500">
              Showing verified doctors with real-time slot and queue availability
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {filteredDoctors.length} Doctors Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map((doc) => {
            // Count waiting patients for this doctor
            const docQueue = queueEntries.filter(e => e.doctorId === doc.id);
            const waitingCount = docQueue.filter(e => e.status === 'WAITING' || e.status === 'CALLED').length;
            const currentServing = docQueue.find(e => e.status === 'IN_PROGRESS' || e.status === 'CALLED');
            const estimatedWait = waitingCount * doc.avgConsultationMinutes;

            return (
              <div
                key={doc.id}
                className="group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                
                {/* Top Card Info */}
                <div className="p-6">
                  
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Stethoscope className="w-3 h-3 text-emerald-600" />
                          {doc.specialization}
                        </span>
                        
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{doc.rating}</span>
                          <span className="text-slate-400 font-normal">({doc.reviewsCount})</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mt-1 truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{doc.title} · {doc.experienceYears} yrs experience</p>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.clinic}</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Bio Snippet */}
                  <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {doc.about}
                  </p>

                  {/* Real-time Queue & Slot Status Row */}
                  <div className="mt-5 grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-center">
                    
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Slots Today</span>
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        {doc.remainingSlots} left
                      </span>
                    </div>

                    <div className="border-x border-slate-200">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Queue Now</span>
                      <span className="text-sm font-extrabold text-emerald-700 font-mono">
                        {waitingCount} waiting
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Est. Wait</span>
                      <span className="text-sm font-extrabold text-teal-700 font-mono">
                        ~{estimatedWait}m
                      </span>
                    </div>

                  </div>

                </div>

                {/* Card Actions Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleViewLiveQueue(doc)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Live Queue</span>
                  </button>

                  <button
                    onClick={() => handleSelectDoctor(doc)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 group-hover:scale-[1.02]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Slot</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
};
