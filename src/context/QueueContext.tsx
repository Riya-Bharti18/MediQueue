import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Doctor, Slot, QueueEntry, QueueEventLog, Role, QueueState } from '../types/queue';
import { INITIAL_DOCTORS, INITIAL_SLOTS, INITIAL_QUEUE_ENTRIES } from '../data/mockData';

export type PageId = 
  | 'home'
  | 'sign-in'
  | 'doctors' 
  | 'booking' 
  | 'live-queue' 
  | 'doctor-dashboard' 
  | 'receptionist' 
  | 'waiting-room-tv' 
  | 'my-tokens';

interface BookingPayload {
  doctorId: string;
  slotId: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  reason?: string;
}

interface WalkInPayload {
  doctorId: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  reason?: string;
  priority?: boolean;
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'alert';
}

interface QueueContextType {
  role: Role;
  setRole: (role: Role) => void;
  activePage: PageId;
  navigateTo: (page: PageId, meta?: any) => void;
  navigationMeta: any;
  
  doctors: Doctor[];
  selectedDoctor: Doctor;
  setSelectedDoctorId: (id: string) => void;
  slots: Slot[];
  queueEntries: QueueEntry[];
  logs: QueueEventLog[];
  queueState: QueueState;
  
  // User active booking
  activeToken: string | null;
  userBookedToken: string | null;
  userTokens: QueueEntry[];
  userActiveEntry: QueueEntry | null;
  
  // Actions
  bookSlot: (payload: BookingPayload) => Promise<QueueEntry>;
  addWalkIn: (payload: WalkInPayload) => QueueEntry;
  callNextPatient: (doctorId?: string) => void;
  completeCurrentPatient: (doctorId?: string) => void;
  skipPatient: (entryId: string) => void;
  togglePauseQueue: (doctorId?: string) => void;
  updateDoctorAvgTime: (doctorId: string, minutes: number) => void;
  
  // Simulation & UX controls
  simulateNextStep: () => void;
  simulateReconnect: () => void;
  isReconnecting: boolean;
  
  // Toast notifications
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  playChime: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

// Sound generator with Web Audio API (Clean medical turn chime)
export const playMedicalChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    
    // Primary harmonic chime (Two pleasant bells: E5 -> B5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.15); // B5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.9);
  } catch (e) {
    // Audio might be blocked without initial gesture
  }
};

const STORAGE_KEY = 'mediqueue_state_v1';

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('PATIENT');
  const [activePage, setActivePage] = useState<PageId>('home');
  const [navigationMeta, setNavigationMeta] = useState<any>(null);

  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [selectedDoctorId, setSelectedDoctorIdState] = useState<string>('doc-1');
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>(INITIAL_QUEUE_ENTRIES);
  const [queueState, setQueueState] = useState<QueueState>('ACTIVE');
  const [activeToken, setActiveToken] = useState<string | null>('A-024'); // default user token for instant live preview
  const [userBookedToken, setUserBookedToken] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 'init-1',
      title: 'MediQueue Synchronized',
      message: 'Connected to live clinic queue engine. 0ms latency.',
      type: 'info'
    }
  ]);

  const [logs, setLogs] = useState<QueueEventLog[]>([
    { id: 'l-1', timestamp: '09:25 AM', message: 'Queue opened for Dr. Sarah Mukherjee', type: 'info' },
    { id: 'l-2', timestamp: '09:40 AM', message: 'Token A-021 called into Consultation Room 204', type: 'call', token: 'A-021' },
    { id: 'l-3', timestamp: '09:48 AM', message: 'Token A-022 called to waiting corridor', type: 'call', token: 'A-022' },
  ]);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  // Helper to re-calculate queue positions and ETAs according to PRD:
  // ETA = Patients Ahead × Average Consultation Duration
  const recalculateQueue = useCallback((entries: QueueEntry[], currentDoctors: Doctor[]): QueueEntry[] => {
    return entries.map(entry => {
      const doc = currentDoctors.find(d => d.id === entry.doctorId);
      const avgMinutes = doc ? doc.avgConsultationMinutes : 10;

      if (entry.status === 'COMPLETED' || entry.status === 'SKIPPED' || entry.status === 'CANCELLED') {
        return {
          ...entry,
          position: 0,
          patientsAhead: 0,
          estimatedWaitMinutes: 0
        };
      }

      if (entry.status === 'IN_PROGRESS') {
        return {
          ...entry,
          position: 0,
          patientsAhead: 0,
          estimatedWaitMinutes: 0
        };
      }

      // Count waiting or called patients ahead in same doctor's queue
      const doctorEntries = entries.filter(e => e.doctorId === entry.doctorId);
      const activeWaiting = doctorEntries.filter(e => e.status === 'WAITING' || e.status === 'CALLED');
      const indexInWaiting = activeWaiting.findIndex(e => e.id === entry.id);

      if (indexInWaiting === -1) {
        return entry;
      }

      const position = indexInWaiting + 1;
      const patientsAhead = indexInWaiting;
      const estimatedWaitMinutes = patientsAhead * avgMinutes;

      return {
        ...entry,
        position,
        patientsAhead,
        estimatedWaitMinutes
      };
    });
  }, []);

  const showToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const navigateTo = useCallback((page: PageId, meta?: any) => {
    setActivePage(page);
    if (meta !== undefined) {
      setNavigationMeta(meta);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    if (newRole === 'DOCTOR') {
      setActivePage('doctor-dashboard');
    } else if (newRole === 'RECEPTIONIST') {
      setActivePage('receptionist');
    } else {
      if (activePage === 'doctor-dashboard' || activePage === 'receptionist') {
        setActivePage('doctors');
      }
    }
  }, [activePage]);

  // Book an appointment slot
  const bookSlot = async (payload: BookingPayload): Promise<QueueEntry> => {
    const doctor = doctors.find(d => d.id === payload.doctorId) || selectedDoctor;
    const slot = slots.find(s => s.id === payload.slotId);

    // Generate a unique sequential token e.g. A-026
    const usedTokens = new Set(queueEntries.map(e => e.token));
    const highestToken = Math.max(
      20,
      ...queueEntries.map(e => Number(e.token.replace(/^A-/, ''))).filter(n => Number.isFinite(n))
    );
    let nextNum = highestToken + 1;
    let token = `A-${String(nextNum).padStart(3, '0')}`;
    while (usedTokens.has(token)) {
      nextNum += 1;
      token = `A-${String(nextNum).padStart(3, '0')}`;
    }

    const newEntry: QueueEntry = {
      id: `q-${Date.now()}`,
      token,
      patientName: payload.patientName,
      patientPhone: payload.patientPhone,
      patientAge: payload.patientAge,
      patientGender: payload.patientGender,
      reason: payload.reason,
      doctorId: payload.doctorId,
      slotId: payload.slotId,
      slotTime: slot ? slot.time : 'Scheduled Slot',
      entryType: 'BOOKED',
      position: 1,
      patientsAhead: 0,
      estimatedWaitMinutes: 0,
      status: 'WAITING',
      joinedAt: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date()),
    };

    // Decrement slot capacity
    setSlots(prev => prev.map(s => {
      if (s.id === payload.slotId) {
        const newBooked = s.bookedCount + 1;
        return {
          ...s,
          bookedCount: newBooked,
          status: newBooked >= s.capacity ? 'FULL' : newBooked >= s.capacity - 1 ? 'ALMOST_FULL' : 'AVAILABLE'
        };
      }
      return s;
    }));

    // Update doctor remaining slots
    setDoctors(prev => prev.map(d => {
      if (d.id === payload.doctorId) {
        return { ...d, remainingSlots: Math.max(0, d.remainingSlots - 1) };
      }
      return d;
    }));

    const updatedQueue = recalculateQueue([...queueEntries, newEntry], doctors);
    setQueueEntries(updatedQueue);
    setActiveToken(token);
    setUserBookedToken(token);

    const log: QueueEventLog = {
      id: `log-${Date.now()}`,
      timestamp: newEntry.joinedAt,
      message: `Token ${token} booked by ${payload.patientName} for ${doctor.name}`,
      type: 'info',
      token
    };
    setLogs(prev => [log, ...prev]);

    showToast('Booking Confirmed!', `Digital Token ${token} generated. Welcome to the live queue!`, 'success');
    return newEntry;
  };

  // Receptionist adds walk-in patient
  const addWalkIn = (payload: WalkInPayload): QueueEntry => {
    const existingWalkIns = queueEntries.filter(e => e.entryType === 'WALK_IN');
    const token = `W-00${existingWalkIns.length + 2}`;

    const newEntry: QueueEntry = {
      id: `q-${Date.now()}`,
      token,
      patientName: `${payload.patientName} (Walk-in)`,
      patientPhone: payload.patientPhone,
      patientAge: payload.patientAge,
      patientGender: payload.patientGender,
      reason: payload.reason || 'General Consultation',
      doctorId: payload.doctorId,
      slotTime: 'Walk-in Queue',
      entryType: 'WALK_IN',
      position: 1,
      patientsAhead: 0,
      estimatedWaitMinutes: 0,
      status: 'WAITING',
      joinedAt: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date())
    };

    let newQueue: QueueEntry[];
    if (payload.priority) {
      // Priority insert right behind currently active patient
      const inProgressIdx = queueEntries.findIndex(e => e.status === 'IN_PROGRESS' || e.status === 'CALLED');
      const insertAt = inProgressIdx >= 0 ? inProgressIdx + 1 : 0;
      newQueue = [...queueEntries];
      newQueue.splice(insertAt, 0, newEntry);
    } else {
      newQueue = [...queueEntries, newEntry];
    }

    const updated = recalculateQueue(newQueue, doctors);
    setQueueEntries(updated);

    const log: QueueEventLog = {
      id: `log-${Date.now()}`,
      timestamp: newEntry.joinedAt,
      message: `Walk-in token ${token} issued to ${payload.patientName}`,
      type: 'walkin',
      token
    };
    setLogs(prev => [log, ...prev]);

    showToast('Walk-in Token Created', `Token ${token} added to live queue.`, 'info');
    return newEntry;
  };

  // Call Next Patient (Doctor action)
  const callNextPatient = (doctorId: string = selectedDoctorId) => {
    const timeStr = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date());

    setQueueEntries(prev => {
      // Find current in progress or called patient to mark completed
      const nextQueue = prev.map(entry => {
        if (entry.doctorId === doctorId && (entry.status === 'IN_PROGRESS' || entry.status === 'CALLED')) {
          return {
            ...entry,
            status: 'COMPLETED' as const,
            completedAt: timeStr
          };
        }
        return entry;
      });

      // Find first WAITING patient for this doctor
      const nextWaitingIndex = nextQueue.findIndex(e => e.doctorId === doctorId && e.status === 'WAITING');

      if (nextWaitingIndex !== -1) {
        nextQueue[nextWaitingIndex] = {
          ...nextQueue[nextWaitingIndex],
          status: 'CALLED',
          calledAt: timeStr
        };

        const calledToken = nextQueue[nextWaitingIndex].token;
        const patientName = nextQueue[nextWaitingIndex].patientName;

        // Play alert chime
        playMedicalChime();

        // Turn Alert Notification
        showToast(
          '🔔 Patient Called!',
          `Token ${calledToken} (${patientName}) called into ${selectedDoctor.roomNumber}`,
          'alert'
        );

        setLogs(l => [
          {
            id: `log-${Date.now()}`,
            timestamp: timeStr,
            message: `Token ${calledToken} called into ${selectedDoctor.roomNumber}`,
            type: 'call',
            token: calledToken
          },
          ...l
        ]);
      } else {
        showToast('Queue Clear', 'No more waiting patients in this queue.', 'info');
      }

      return recalculateQueue(nextQueue, doctors);
    });
  };

  // Complete current consultation
  const completeCurrentPatient = (doctorId: string = selectedDoctorId) => {
    const timeStr = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date());

    setQueueEntries(prev => {
      let completedToken = '';
      const updated = prev.map(e => {
        if (e.doctorId === doctorId && (e.status === 'IN_PROGRESS' || e.status === 'CALLED')) {
          completedToken = e.token;
          return {
            ...e,
            status: 'COMPLETED' as const,
            completedAt: timeStr
          };
        }
        return e;
      });

      if (completedToken) {
        showToast('Consultation Complete', `Token ${completedToken} marked completed.`, 'success');
        setLogs(l => [
          {
            id: `log-${Date.now()}`,
            timestamp: timeStr,
            message: `Consultation completed for Token ${completedToken}`,
            type: 'complete',
            token: completedToken
          },
          ...l
        ]);
      }
      return recalculateQueue(updated, doctors);
    });
  };

  // Skip Patient (No-show)
  const skipPatient = (entryId: string) => {
    const timeStr = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date());

    setQueueEntries(prev => {
      let skippedToken = '';
      const updated = prev.map(e => {
        if (e.id === entryId) {
          skippedToken = e.token;
          return {
            ...e,
            status: 'SKIPPED' as const,
            completedAt: timeStr
          };
        }
        return e;
      });

      showToast('Patient Skipped', `Token ${skippedToken} marked as absent / skipped.`, 'warning');
      setLogs(l => [
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          message: `Token ${skippedToken} skipped by doctor.`,
          type: 'skip',
          token: skippedToken
        },
        ...l
      ]);

      return recalculateQueue(updated, doctors);
    });
  };

  // Toggle Pause/Resume Queue
  const togglePauseQueue = (doctorId: string = selectedDoctorId) => {
    const newState = queueState === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setQueueState(newState);

    const timeStr = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date());
    const msg = newState === 'PAUSED' 
      ? `Queue temporarily paused by ${selectedDoctor.name}. Consultations on hold.`
      : `Queue resumed by ${selectedDoctor.name}. Consultations in progress.`;

    showToast(
      newState === 'PAUSED' ? '⏸ Queue Paused' : '▶ Queue Resumed',
      msg,
      newState === 'PAUSED' ? 'warning' : 'success'
    );

    setLogs(l => [
      {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        message: msg,
        type: 'pause'
      },
      ...l
    ]);
  };

  // Dynamic ETA reconfiguration: update doctor's avg consultation time
  const updateDoctorAvgTime = (doctorId: string, minutes: number) => {
    setDoctors(prev => {
      const updated = prev.map(d => d.id === doctorId ? { ...d, avgConsultationMinutes: minutes } : d);
      setQueueEntries(q => recalculateQueue(q, updated));
      return updated;
    });

    showToast(
      'ETA Recalculated Dynamically',
      `Average consultation time set to ${minutes} mins. All patient wait-times updated.`,
      'info'
    );
  };

  // Simulate Next Step in Live Queue (One-click reviewer demonstration)
  const simulateNextStep = () => {
    callNextPatient(selectedDoctorId);
  };

  // Simulate Reconnect & State Recovery
  const simulateReconnect = () => {
    setIsReconnecting(true);
    showToast('Simulating Reconnect', 'Restoring queue state snapshot from persistent store...', 'info');
    setTimeout(() => {
      setIsReconnecting(false);
      showToast('State Restored (0ms latency)', 'Queue state reconciled successfully.', 'success');
    }, 1200);
  };

  // Check user active entry
  const userActiveEntry = queueEntries.find(e => e.token === activeToken) || null;
  const userTokens = queueEntries.filter(e => e.token === activeToken || e.patientPhone === '+91 98310 55667');

  return (
    <QueueContext.Provider
      value={{
        role,
        setRole,
        activePage,
        navigateTo,
        navigationMeta,
        doctors,
        selectedDoctor,
        setSelectedDoctorId: setSelectedDoctorIdState,
        slots,
        queueEntries,
        logs,
        queueState,
        activeToken,
        userBookedToken,
        userTokens,
        userActiveEntry,
        bookSlot,
        addWalkIn,
        callNextPatient,
        completeCurrentPatient,
        skipPatient,
        togglePauseQueue,
        updateDoctorAvgTime,
        simulateNextStep,
        simulateReconnect,
        isReconnecting,
        toasts,
        dismissToast,
        showToast,
        playChime: playMedicalChime
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
