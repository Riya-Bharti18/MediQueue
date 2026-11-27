import { Doctor, Slot, QueueEntry } from '../types/queue';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Mukherjee',
    title: 'MD, FACC',
    specialization: 'Cardiologist',
    department: 'Department of Cardiology',
    clinic: 'CareWell Super Specialty Clinic · Room 204',
    roomNumber: 'Room 204',
    rating: 4.9,
    reviewsCount: 142,
    experienceYears: 14,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    avgConsultationMinutes: 10,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    slotsCount: 20,
    remainingSlots: 4,
    about: 'Specializes in clinical cardiology, hypertension, echocardiography, and preventive heart health. Known for compassionate patient care.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Arindam Sen',
    title: 'MBBS, MD (Medicine)',
    specialization: 'General Physician',
    department: 'Internal Medicine',
    clinic: 'CareWell Super Specialty Clinic · Room 102',
    roomNumber: 'Room 102',
    rating: 4.8,
    reviewsCount: 215,
    experienceYears: 18,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    avgConsultationMinutes: 8,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    slotsCount: 24,
    remainingSlots: 7,
    about: 'Expert in diabetes management, infectious diseases, and comprehensive family wellness consultations.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Priyanka Roy',
    title: 'MD, DCH',
    specialization: 'Pediatrician',
    department: 'Child Health & Neonatology',
    clinic: 'CareWell Super Specialty Clinic · Room 108',
    roomNumber: 'Room 108',
    rating: 4.95,
    reviewsCount: 188,
    experienceYears: 11,
    avatar: 'https://images.unsplash.com/photo-1594824813680-bd91642c8d20?auto=format&fit=crop&q=80&w=400',
    avgConsultationMinutes: 12,
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    slotsCount: 18,
    remainingSlots: 2,
    about: 'Friendly pediatrician focused on pediatric development, vaccinations, nutrition, and child wellness.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Rajesh Banerjee',
    title: 'MS (Ortho), MCh',
    specialization: 'Orthopedic Surgeon',
    department: 'Orthopedics & Joint Care',
    clinic: 'CareWell Super Specialty Clinic · Room 301',
    roomNumber: 'Room 301',
    rating: 4.7,
    reviewsCount: 96,
    experienceYears: 16,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    avgConsultationMinutes: 12,
    availableDays: ['Tue', 'Thu', 'Fri'],
    slotsCount: 16,
    remainingSlots: 5,
    about: 'Specialized in joint replacement, sports injury rehab, and spine disorders with minimally invasive methods.'
  }
];

export const INITIAL_SLOTS: Slot[] = [
  // Morning slots for Dr. Sarah
  { id: 'slot-1', doctorId: 'doc-1', time: '09:00 AM - 09:30 AM', period: 'Morning', capacity: 4, bookedCount: 4, status: 'FULL' },
  { id: 'slot-2', doctorId: 'doc-1', time: '09:30 AM - 10:00 AM', period: 'Morning', capacity: 4, bookedCount: 4, status: 'FULL' },
  { id: 'slot-3', doctorId: 'doc-1', time: '10:00 AM - 10:30 AM', period: 'Morning', capacity: 4, bookedCount: 3, status: 'ALMOST_FULL' },
  { id: 'slot-4', doctorId: 'doc-1', time: '10:30 AM - 11:00 AM', period: 'Morning', capacity: 4, bookedCount: 2, status: 'AVAILABLE' },
  { id: 'slot-5', doctorId: 'doc-1', time: '11:00 AM - 11:30 AM', period: 'Morning', capacity: 4, bookedCount: 1, status: 'AVAILABLE' },
  // Afternoon slots
  { id: 'slot-6', doctorId: 'doc-1', time: '04:00 PM - 04:30 PM', period: 'Afternoon', capacity: 4, bookedCount: 1, status: 'AVAILABLE' },
  { id: 'slot-7', doctorId: 'doc-1', time: '04:30 PM - 05:00 PM', period: 'Afternoon', capacity: 4, bookedCount: 0, status: 'AVAILABLE' },

  // Dr. Arindam
  { id: 'slot-8', doctorId: 'doc-2', time: '10:00 AM - 10:30 AM', period: 'Morning', capacity: 5, bookedCount: 3, status: 'AVAILABLE' },
  { id: 'slot-9', doctorId: 'doc-2', time: '10:30 AM - 11:00 AM', period: 'Morning', capacity: 5, bookedCount: 2, status: 'AVAILABLE' },
  { id: 'slot-10', doctorId: 'doc-2', time: '11:00 AM - 11:30 AM', period: 'Morning', capacity: 5, bookedCount: 1, status: 'AVAILABLE' },

  // Dr. Priyanka
  { id: 'slot-11', doctorId: 'doc-3', time: '10:00 AM - 10:30 AM', period: 'Morning', capacity: 4, bookedCount: 4, status: 'FULL' },
  { id: 'slot-12', doctorId: 'doc-3', time: '10:30 AM - 11:00 AM', period: 'Morning', capacity: 4, bookedCount: 3, status: 'ALMOST_FULL' },

  // Dr. Rajesh
  { id: 'slot-13', doctorId: 'doc-4', time: '11:30 AM - 12:00 PM', period: 'Morning', capacity: 4, bookedCount: 1, status: 'AVAILABLE' }
];

export const INITIAL_QUEUE_ENTRIES: QueueEntry[] = [
  {
    id: 'q-1',
    token: 'A-021',
    patientName: 'Kalyan Bose',
    patientPhone: '+91 98301 11223',
    patientAge: 52,
    patientGender: 'Male',
    reason: 'Routine ECG Follow-up',
    doctorId: 'doc-1',
    slotId: 'slot-2',
    slotTime: '09:30 AM - 10:00 AM',
    entryType: 'BOOKED',
    position: 0,
    patientsAhead: 0,
    estimatedWaitMinutes: 0,
    status: 'IN_PROGRESS',
    joinedAt: '09:25 AM',
    calledAt: '09:40 AM',
    notes: 'In consultation room'
  },
  {
    id: 'q-2',
    token: 'A-022',
    patientName: 'Ananya Dutta',
    patientPhone: '+91 98745 44321',
    patientAge: 34,
    patientGender: 'Female',
    reason: 'Chest tightness & fatigue',
    doctorId: 'doc-1',
    slotId: 'slot-2',
    slotTime: '09:30 AM - 10:00 AM',
    entryType: 'BOOKED',
    position: 1,
    patientsAhead: 0,
    estimatedWaitMinutes: 10,
    status: 'CALLED',
    joinedAt: '09:32 AM',
    calledAt: '09:48 AM',
    notes: 'Called to waiting corridor'
  },
  {
    id: 'q-3',
    token: 'W-001',
    patientName: 'Rohan Sharma',
    patientPhone: '+91 94330 99881',
    patientAge: 29,
    patientGender: 'Male',
    reason: 'Sudden palpitation (Walk-in)',
    doctorId: 'doc-1',
    slotTime: 'Walk-in Queue',
    entryType: 'WALK_IN',
    position: 2,
    patientsAhead: 1,
    estimatedWaitMinutes: 20,
    status: 'WAITING',
    joinedAt: '09:38 AM'
  },
  {
    id: 'q-4',
    token: 'A-024',
    patientName: 'Subhasish Sen (You)',
    patientPhone: '+91 98310 55667',
    patientAge: 46,
    patientGender: 'Male',
    reason: 'Blood pressure check & refill',
    doctorId: 'doc-1',
    slotId: 'slot-3',
    slotTime: '10:00 AM - 10:30 AM',
    entryType: 'BOOKED',
    position: 3,
    patientsAhead: 2,
    estimatedWaitMinutes: 30,
    status: 'WAITING',
    joinedAt: '09:42 AM'
  },
  {
    id: 'q-5',
    token: 'A-025',
    patientName: 'Meenakshi Sen',
    patientPhone: '+91 98319 77889',
    patientAge: 61,
    patientGender: 'Female',
    reason: 'Post-CABG quarterly check',
    doctorId: 'doc-1',
    slotId: 'slot-3',
    slotTime: '10:00 AM - 10:30 AM',
    entryType: 'BOOKED',
    position: 4,
    patientsAhead: 3,
    estimatedWaitMinutes: 40,
    status: 'WAITING',
    joinedAt: '09:45 AM'
  }
];
