import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Sparkles,
  Ticket,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { DigitalTokenCard } from '../components/DigitalTokenCard';

export const BookingFlowPage: React.FC = () => {
  const { 
    selectedDoctor, 
    slots, 
    bookSlot, 
    navigateTo, 
    activeToken,
    userActiveEntry,
    playChime
  } = useQueue();

  const [step, setStep] = useState<number>(1);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    () => slots.find(s => s.doctorId === selectedDoctor.id && s.status !== 'FULL')?.id ?? ''
  );

  React.useEffect(() => {
    const isStillAvailable = slots.some(
      s => s.id === selectedSlotId && s.doctorId === selectedDoctor.id && s.status !== 'FULL'
    );
    if (!isStillAvailable) {
      setSelectedSlotId(slots.find(s => s.doctorId === selectedDoctor.id && s.status !== 'FULL')?.id ?? '');
    }
  }, [selectedSlotId, selectedDoctor.id, slots]);
  
  // Patient form
  const [patientName, setPatientName] = useState<string>('Subhasish Sen');
  const [patientPhone, setPatientPhone] = useState<string>('+91 98310 55667');
  const [patientAge, setPatientAge] = useState<number>(46);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [reason, setReason] = useState<string>('Hypertension & routine medication review');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedEntry, setConfirmedEntry] = useState<any>(null);

  const availableSlotsForDoc = slots.filter(s => s.doctorId === selectedDoctor.id);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const entry = await bookSlot({
        doctorId: selectedDoctor.id,
        slotId: selectedSlotId,
        patientName,
        patientPhone,
        patientAge,
        patientGender,
        reason
      });

      setConfirmedEntry(entry);
      setBookingConfirmed(true);
      playChime();

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Step Header */}
      {!bookingConfirmed && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Step {step} of 2
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {step === 1 ? 'Select Appointment Slot' : 'Patient Information'}
              </h1>
            </div>

            {/* Selected Doctor Summary Pill */}
            <div className="hidden sm:flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="text-left text-xs pr-2">
                <span className="font-bold text-slate-900 block">{selectedDoctor.name}</span>
                <span className="text-emerald-700 font-medium">{selectedDoctor.specialization}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation View when booked */}
      {bookingConfirmed && confirmedEntry ? (
        <div className="text-center py-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mb-4 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-black text-slate-900">
            Booking & Digital Token Confirmed!
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Your appointment has been registered in the live queue engine. Track real-time progress below.
          </p>

          <div className="my-8">
            <DigitalTokenCard
              entry={confirmedEntry}
              doctor={selectedDoctor}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('live-queue', { token: confirmedEntry.token })}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
              <Ticket className="w-4 h-4" />
              <span>Track Live Queue & Turn Alert</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setBookingConfirmed(false);
                setStep(1);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition-all"
            >
              Book Another Patient
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8">
          
          {/* STEP 1: Choose Doctor & Time Slot */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Slot Availability Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Available Consultation Slots (Today)
                  </label>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {availableSlotsForDoc.filter(s => s.status !== 'FULL').length} Slots Open
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableSlotsForDoc.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    const isFull = slot.status === 'FULL';
                    const remaining = slot.capacity - slot.bookedCount;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          isFull
                            ? 'opacity-50 bg-slate-50 border-slate-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/40 shadow-sm'
                            : 'border-slate-200 hover:border-emerald-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-slate-700">{slot.period}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isFull
                              ? 'bg-rose-100 text-rose-800'
                              : remaining === 1
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isFull ? 'FULL' : `${remaining} left`}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-slate-900 font-mono mt-1">
                          {slot.time}
                        </div>

                        {/* Capacity progress line */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${(slot.bookedCount / slot.capacity) * 100}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Next Step CTA */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <span>Continue to Patient Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: Patient Form */}
          {step === 2 && (
            <form onSubmit={handleConfirmBooking} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Subhasish Sen"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Mobile Phone (For Turn SMS / WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+91 98310 55667"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Age & Gender
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(parseInt(e.target.value, 10))}
                      placeholder="Age"
                      className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Reason for Consultation
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Chest discomfort, BP check, fever"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>

              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold text-sm text-emerald-900">Appointment Summary</div>
                <p>Doctor: <span className="font-semibold">{selectedDoctor.name} ({selectedDoctor.specialization})</span></p>
                <p>Room: <span className="font-semibold">{selectedDoctor.roomNumber}</span> · CareWell Super Specialty Clinic</p>
                <p>Average wait dynamically calculated in real time upon arrival.</p>
              </div>

              {/* Form Navigation Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Slots</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Registering Token...</span>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Confirm & Issue Digital Token</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      )}

    </div>
  );
};
