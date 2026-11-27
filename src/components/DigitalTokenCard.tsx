import React from 'react';
import { QueueEntry, Doctor } from '../types/queue';
import { Ticket, Calendar, Clock, MapPin, CheckCircle, Share2, Download, QrCode } from 'lucide-react';

interface DigitalTokenCardProps {
  entry: QueueEntry;
  doctor: Doctor;
  onShare?: () => void;
}

export const DigitalTokenCard: React.FC<DigitalTokenCardProps> = ({ entry, doctor, onShare }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white shadow-2xl border border-slate-700/80 max-w-md w-full mx-auto">
      
      {/* Decorative background glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

      {/* Ticket Header */}
      <div className="p-6 border-b border-slate-700/60 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] tracking-wider uppercase">
              {entry.entryType === 'WALK_IN' ? 'Walk-in Token' : 'Digital Token'}
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-slate-400 text-xs font-mono">{entry.joinedAt}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Verified Booking</span>
          </div>
        </div>

        {/* Big Token Number */}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-slate-400 block font-semibold">
              Token Number
            </span>
            <h1 className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {entry.token}
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase tracking-widest text-slate-400 block font-semibold">
              Queue Position
            </span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              #{entry.position > 0 ? entry.position : 'Serving'}
            </span>
          </div>
        </div>
      </div>

      {/* Perforated ticket punch holes */}
      <div className="relative h-4 bg-slate-950 flex items-center justify-between px-2">
        <div className="w-4 h-4 rounded-full bg-slate-50 -ml-4" />
        <div className="border-b-2 border-dashed border-slate-700 flex-1 mx-2" />
        <div className="w-4 h-4 rounded-full bg-slate-50 -mr-4" />
      </div>

      {/* Ticket Details Body */}
      <div className="p-6 space-y-4">
        
        {/* Doctor & Clinic */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-600"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-white truncate">{doctor.name}</h4>
            <p className="text-xs text-emerald-400 font-medium">{doctor.specialization}</p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{doctor.roomNumber} · {doctor.clinic.split('·')[0]}</span>
            </p>
          </div>
        </div>

        {/* Patient Details & Time slot */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient Name</span>
            <span className="font-bold text-white text-sm truncate block mt-0.5">{entry.patientName}</span>
            <span className="text-slate-400 text-[11px] font-mono">{entry.patientPhone}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Appointment Slot</span>
            <span className="font-bold text-emerald-400 text-sm block mt-0.5">{entry.slotTime}</span>
            <span className="text-slate-400 text-[11px]">Today</span>
          </div>
        </div>

        {/* Estimated Wait and Ahead */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Estimated Wait</span>
              <span className="text-lg font-black text-white font-mono">
                ~{entry.estimatedWaitMinutes} mins
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Patients Ahead</span>
            <span className="text-lg font-black text-white font-mono">
              {entry.patientsAhead} {entry.patientsAhead === 1 ? 'person' : 'people'}
            </span>
          </div>
        </div>

        {/* QR Code / Barcode Simulation */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="p-1.5 bg-white rounded-lg text-slate-900">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] block font-mono">SCAN AT CLINIC ENTRY</span>
              <span className="text-[11px] text-slate-300 font-mono">MEDIQ-{entry.token}-2026</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `MediQueue Token ${entry.token}`,
                    text: `My live consultation token is ${entry.token} with ${doctor.name}. Current wait: ~${entry.estimatedWaitMinutes} mins.`,
                  }).catch(() => {});
                } else {
                  alert(`Copied token link: ${entry.token} for ${doctor.name}`);
                }
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Share Token"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
