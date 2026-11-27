# MediQueue 🩺
> **"Know your slot. Know your queue. Know your time."**

MediQueue is a real-time clinic consultation and queue visibility layer designed for patients, doctors, and clinic receptionists. It eliminates blind waiting room crowding by synchronizing appointment slot reservation, digital token generation, dynamic estimated waiting times (ETAs), and instant turn approaching alerts.

---

## ✨ Features & User Experience Flow

### 1. 🔍 Patient Journey & Discovery
- **Specialist Search & Live Capacity:** Search participating doctors with real-time remaining slot counts (e.g. `4 slots left today`) and current waiting room queue sizes.
- **2-Step Smooth Booking Wizard:**
  - **Step 1:** Select from Morning, Afternoon, or Evening consultation slots with live capacity progress indicators (`bookedCount / capacity`).
  - **Step 2:** Fast patient details input (Name, phone, age, gender, reason).
  - **Instant Digital Token:** Celebratory confirmation with confetti, audio medical chime, and instant issuance of a digital token (e.g., `A-024`).

### 2. ⚡ Live Queue Tracker & Waiting Room
- **Animated Position Ring:** High-contrast live queue meter showing:
  - Exact queue position: `You are #3 in consultation queue`.
  - Patients ahead counter: `2 patients waiting before you`.
  - Dynamic Wait Time (ETA): Recalculated live using the formula:
    $$\text{ETA} = \text{Patients Ahead} \times \text{Average Consultation Duration}$$
- **🔔 High-Alert Turn Approaching Banner:** Automatically triggers when called or within 1 patient of being seen, displaying an urgent pulsating alert directing the patient to the doctor's room.
- **Audio Chime:** Synthesized Web Audio chime to notify patients when called.
- **Live Event Stream:** Chronological broadcast log of real-time queue transitions.

### 3. 👨‍⚕️ Doctor Consultation Dashboard
- **Active In-Room Patient:** View active patient details, symptoms, and live consultation timer.
- **Queue Controls:**
  - `Call Next Patient`: Advances queue and broadcasts turn alerts to patient screens.
  - `Complete Consultation`: Records completed visits and moves the queue forward.
  - `Skip / No-Show`: Handles absent patients gracefully without stalling the waiting room.
  - `Pause / Resume Queue`: Notifies all connected patients when the doctor takes an urgent break.
- **Dynamic ETA Slider:** Adjust average consultation minutes (5–25 mins); instantly recalculates all waiting patients' ETAs across the application.

### 4. 🏢 Front Desk & Reception Hub
- **Rapid Walk-in Token Registration:** 5-second entry form creating sequential walk-in tokens (e.g. `W-001`, `W-002`) with optional emergency triage priority injection.
- **Master Clinic Queue Board:** Multi-doctor centralized filterable roster.

### 5. 📺 Public Waiting Room TV Display
- Full-screen high-contrast display designed for clinic waiting room monitors:
  - "NOW SERVING IN ROOM 204: TOKEN A-021"
  - "NEXT IN LINE: TOKEN A-022, W-001"
  - Real-time digital clock and status ticker.

### 6. 🎛️ Interactive Demo & Persona Switcher
- Floating top-right control widget allowing instant switching between **Patient**, **Doctor**, and **Receptionist** personas.
- Quick test triggers:
  - `Call Next Patient` (simulates turn transitions).
  - `Pause / Resume Queue`.
  - `Test Reconnect` (tests state restoration with 0ms latency).
  - `Chime` (sound test).
  - `TV Mode` (launches waiting room wall monitor).

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Animation & Transitions:** Framer Motion (`AnimatePresence`, ease-out spring variants)
- **Visual Feedback:** Canvas Confetti, Web Audio API chime synthesis
- **Architecture:** PWA-ready responsive layout, reactive event-driven state machine

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
