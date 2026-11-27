export type Role = 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST';

export type QueueEntryStatus = 'WAITING' | 'CALLED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';

export type QueueState = 'ACTIVE' | 'PAUSED';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  department: string;
  clinic: string;
  roomNumber: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  avatar: string;
  avgConsultationMinutes: number;
  availableDays: string[];
  slotsCount: number;
  remainingSlots: number;
  about: string;
}

export interface Slot {
  id: string;
  doctorId: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  capacity: number;
  bookedCount: number;
  status: 'AVAILABLE' | 'ALMOST_FULL' | 'FULL';
}

export interface QueueEntry {
  id: string;
  token: string; // e.g. "A-024" or "W-005"
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  reason?: string;
  doctorId: string;
  slotId?: string;
  slotTime: string;
  entryType: 'BOOKED' | 'WALK_IN';
  position: number; // 1-based order in active queue
  patientsAhead: number;
  estimatedWaitMinutes: number;
  status: QueueEntryStatus;
  joinedAt: string;
  calledAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface QueueEventLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'call' | 'complete' | 'skip' | 'walkin' | 'pause';
  token?: string;
}
