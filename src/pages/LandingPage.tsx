import React from 'react';
import { useQueue } from '../context/QueueContext';
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  HeartPulse,
  MonitorPlay,
  Pause,
  Play,
  Search,
  ShieldCheck,
  SkipForward,
  Sparkles,
  Stethoscope,
  Ticket,
  Timer,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';

interface FeaturePoint {
  icon: React.ReactNode;
  title: string;
  text: string;
}

interface FeatureSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  points: FeaturePoint[];
  preview: React.ReactNode;
  reversed?: boolean;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  eyebrow,
  title,
  description,
  icon,
  accent,
  points,
  preview,
  reversed,
}) => {
  const textBlock = (
    <div>
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${accent}`}>
        {icon}
        {eyebrow}
      </div>
      <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
        {title}
      </h2>
      <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 max-w-lg">
        {description}
      </p>
      <div className="mt-7 space-y-4">
        {points.map((point) => (
          <div key={point.title} className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-emerald-600">
              {point.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{point.title}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">{point.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const previewBlock = (
    <div className="transition-transform duration-300 hover:-translate-y-1">{preview}</div>
  );

  return (
    <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 sm:py-20 border-b border-slate-200/80 last:border-b-0">
      {reversed ? (
        <>
          {previewBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {previewBlock}
        </>
      )}
    </section>
  );
};

export const LandingPage: React.FC = () => {
  const { navigateTo, userActiveEntry } = useQueue();

  const token = userActiveEntry?.token ?? 'A-024';
  const position = userActiveEntry?.position || 3;
  const patientsAhead = userActiveEntry?.patientsAhead ?? 2;
  const eta = userActiveEntry?.estimatedWaitMinutes ?? 20;

  const steps = [
    {
      icon: <Search className="w-5 h-5" />,
      title: 'Find your specialist',
      text: 'Live availability, no guesswork.',
    },
    {
      icon: <Ticket className="w-5 h-5" />,
      title: 'Reserve your slot',
      text: 'Instant digital token.',
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Track your turn',
      text: 'Arrive right on time.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Real-Time Consultation & Queue Visibility
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-tight">
              Know your slot. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Know your queue. Know your time.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              MediQueue replaces crowded waiting rooms with a calm, connected journey —
              book a slot, get a digital token, and follow your turn live from anywhere.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigateTo('doctors')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Find a Doctor
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('live-queue')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 backdrop-blur-md transition-all"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                View Live Queue
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-6 border-t border-slate-800/80 pt-6 max-w-xl">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">&lt;100ms</span>
                <span className="text-xs text-slate-400 font-medium">Live Queue Sync</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</span>
                <span className="text-xs text-slate-400 font-medium">Digital Token Clarity</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-teal-300 font-mono">3</span>
                <span className="text-xs text-slate-400 font-medium">Connected Personas</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-emerald-400/10 blur-3xl pointer-events-none" />
            <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
                  Your Live Token
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SYNCED
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-5xl font-black font-mono text-white tracking-tight">{token}</p>
                  <p className="mt-1 text-xs text-slate-300">CareWell Super Specialty Clinic</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-emerald-400 font-mono">#{position}</p>
                  <p className="text-[11px] text-slate-400">Your position</p>
                </div>
              </div>

              <div className="mt-6 h-2 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" style={{ width: `${Math.max(12, 100 - position * 22)}%` }} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-950/40 border border-white/10 p-3">
                  <p className="text-xl font-black text-white font-mono">{patientsAhead}</p>
                  <p className="text-[11px] text-slate-400">Patients ahead</p>
                </div>
                <div className="rounded-xl bg-slate-950/40 border border-white/10 p-3">
                  <p className="text-xl font-black text-teal-300 font-mono">~{eta}m</p>
                  <p className="text-[11px] text-slate-400">Estimated wait</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-sky-400/15 border border-sky-300/25 px-3 py-2.5 text-sky-100 text-xs font-medium">
                <Bell className="w-4 h-4 shrink-0 animate-pulse" />
                Turn approaching alert is sent before your name is called.
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 px-4 py-3"
            >
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{step.title}</p>
                <p className="text-xs text-slate-500">{step.text}</p>
              </div>
              <span className="text-xs font-black text-slate-400 font-mono">0{index + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center max-w-2xl mx-auto px-4 pt-16 sm:pt-20">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          One connected experience
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Built for everyone in the clinic.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed">
          Patients, doctors and front desk teams work from the same live queue — so every
          token, turn and estimate is shared instantly.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeatureSection
          eyebrow="For Patients"
          title="Book in seconds. Walk in at the right moment."
          description="No more guessing how long to wait. Reserve a real slot, receive a digital token instantly, and see your place in line update as the clinic moves."
          icon={<Stethoscope className="w-3.5 h-3.5" />}
          accent="bg-emerald-50 text-emerald-700 border border-emerald-200"
          points={[
            {
              icon: <Search className="w-4 h-4" />,
              title: 'Search with live capacity',
              text: 'Find specialists by name or specialty and see remaining slots before you book.',
            },
            {
              icon: <CalendarDays className="w-4 h-4" />,
              title: 'Simple 2-step booking',
              text: 'Pick a morning, afternoon or evening slot, then confirm your details.',
            },
            {
              icon: <Ticket className="w-4 h-4" />,
              title: 'Instant digital token',
              text: 'A clear, shareable token replaces paper slips and uncertain waiting.',
            },
          ]}
          preview={
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-emerald-100 to-teal-50 blur-2xl" />
              <div className="relative rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl shadow-slate-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Booking Confirmed
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> DONE
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-4 rounded-2xl bg-slate-900 text-white p-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center font-black font-mono text-lg">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-2xl font-black tracking-wide">{token}</p>
                    <p className="text-[11px] text-slate-400">Dr. Sarah Mukherjee · Cardiology</p>
                  </div>
                  <Ticket className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="mt-5 flex items-center justify-between gap-2">
                  {['Booked', 'Token issued', 'In queue'].map((label, index) => (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                          {index + 1}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-600">{label}</span>
                      </div>
                      {index < 2 && <div className="flex-1 h-0.5 bg-emerald-100 rounded-full" />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-600">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Reach Room 204 around <span className="font-bold text-slate-900">~{eta} min</span> from now.
                </div>
              </div>
            </div>
          }
        />

        <FeatureSection
          eyebrow="Live Queue Intelligence"
          title="One shared, always-current view of the queue."
          description="Positions, estimated wait times and turn alerts stay in sync across patient phones, doctor dashboards and the waiting room display."
          icon={<Activity className="w-3.5 h-3.5" />}
          accent="bg-teal-50 text-teal-700 border border-teal-200"
          reversed
          points={[
            {
              icon: <Timer className="w-4 h-4" />,
              title: 'Dynamic wait estimates',
              text: 'ETA recalculates from patients ahead × consultation time, and updates for everyone instantly.',
            },
            {
              icon: <Bell className="w-4 h-4" />,
              title: 'Turn approaching alerts',
              text: 'A high-visibility banner and chime fire when you are called or next in line.',
            },
            {
              icon: <ShieldCheck className="w-4 h-4" />,
              title: 'Reconnects without losing state',
              text: 'Queue snapshots restore instantly, so a dropped connection never costs your place.',
            },
          ]}
          preview={
            <div className="relative rounded-3xl bg-slate-900 text-white p-5 sm:p-6 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Live Queue Tracker
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <Zap className="w-3 h-3" /> &lt;100ms SYNC
                </span>
              </div>
              <div className="mt-6 flex items-center gap-6">
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `conic-gradient(#60A5FA 0 ${Math.max(20, 100 - position * 22)}%, #0A1A33 0)` }}
                >
                  <div className="w-[82%] h-[82%] rounded-full bg-slate-900 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black font-mono text-white">#{position}</span>
                    <span className="text-[10px] text-slate-400">in queue</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-3">
                    <p className="text-xl font-black font-mono text-emerald-400">~{eta} min</p>
                    <p className="text-[11px] text-slate-400">Estimated wait</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-3">
                    <p className="text-xl font-black font-mono text-white">{patientsAhead}</p>
                    <p className="text-[11px] text-slate-400">Patients ahead</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-slate-800 pt-4 space-y-2.5">
                {[
                  { time: '09:40', text: 'Token A-021 called to Room 204' },
                  { time: '09:48', text: 'Token A-022 moved to waiting corridor' },
                  { time: '09:55', text: `Token ${token} is 2 turns away` },
                ].map((event) => (
                  <div key={event.time} className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-slate-500">{event.time}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-slate-300">{event.text}</span>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <FeatureSection
          eyebrow="For Doctors"
          title="Keep the consultation in focus, not the queue."
          description="A purpose-built room dashboard puts the active patient, queue controls and timing in one place — with changes reflected everywhere immediately."
          icon={<UserCheck className="w-3.5 h-3.5" />}
          accent="bg-blue-50 text-blue-700 border border-blue-200"
          points={[
            {
              icon: <ClipboardList className="w-4 h-4" />,
              title: 'Active patient at a glance',
              text: 'See symptoms, token and live consultation timer without switching screens.',
            },
            {
              icon: <Play className="w-4 h-4" />,
              title: 'Call, complete, skip or pause',
              text: 'One tap advances the queue, handles no-shows, or broadcasts an urgent break.',
            },
            {
              icon: <Timer className="w-4 h-4" />,
              title: 'Adjustable consultation time',
              text: 'Move the average-time slider and every patient ETA recalculates live.',
            },
          ]}
          preview={
            <div className="relative rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Consultation Room 204
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> IN SESSION
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm">
                  RK
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Riya Kapoor</p>
                  <p className="text-[11px] text-slate-500">Token A-021 · Chest discomfort</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-black text-slate-900">08:42</p>
                  <p className="text-[10px] text-slate-400">elapsed</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: 'Call Next', icon: <Play className="w-3.5 h-3.5" />, dark: false },
                  { label: 'Complete', icon: <CheckCircle2 className="w-3.5 h-3.5" />, dark: true },
                  { label: 'Skip / No-show', icon: <SkipForward className="w-3.5 h-3.5" />, dark: false },
                  { label: 'Pause Queue', icon: <Pause className="w-3.5 h-3.5" />, dark: false },
                ].map((action) => (
                  <div
                    key={action.label}
                    className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold ${
                      action.dark
                        ? 'bg-slate-900 text-white'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {action.icon}
                    {action.label}
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Avg consultation time</span>
                  <span className="font-mono font-bold text-emerald-700">12 mins</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                  <div className="h-full w-[45%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          }
        />

        <FeatureSection
          eyebrow="For Clinics"
          title="Front desk and waiting room, finally in sync."
          description="Register walk-ins in seconds, manage every doctor's queue from one board, and give the waiting room a clear public display of what is happening now."
          icon={<HeartPulse className="w-3.5 h-3.5" />}
          accent="bg-amber-50 text-amber-700 border border-amber-200"
          reversed
          points={[
            {
              icon: <Users className="w-4 h-4" />,
              title: 'Rapid walk-in registration',
              text: 'Create sequential walk-in tokens in seconds, with emergency triage priority when needed.',
            },
            {
              icon: <ClipboardList className="w-4 h-4" />,
              title: 'Master clinic queue board',
              text: 'Filter and monitor every doctor, token and queue length from a single reception view.',
            },
            {
              icon: <MonitorPlay className="w-4 h-4" />,
              title: 'Public waiting room display',
              text: 'A full-screen TV view shows the current token, next in line and live status ticker.',
            },
          ]}
          preview={
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Reception · Walk-in
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                    PRIORITY
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="font-mono text-xl font-black text-slate-900">W-001</p>
                    <p className="text-[10px] text-slate-500">Walk-in token</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="font-mono text-xl font-black text-emerald-700">4</p>
                    <p className="text-[10px] text-slate-500">Doctors in clinic</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  Token issued and added to the live queue board.
                </div>
              </div>
              <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-6 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Waiting Room Display</span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                  </span>
                </div>
                <p className="mt-4 text-xs text-slate-400">Now serving in room 204</p>
                <p className="font-mono text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                  A-021
                </p>
                <div className="mt-4 border-t border-slate-800 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Next in line</p>
                    <p className="font-mono text-sm font-bold text-white mt-0.5">A-022 · W-001</p>
                  </div>
                  <MonitorPlay className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>
          }
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 px-6 py-10 sm:px-10 text-white shadow-xl shadow-emerald-900/10 transition-transform duration-300 hover:-translate-y-0.5">
          <div className="absolute -right-10 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Less waiting. Better care.</h2>
              <p className="mt-2 text-sm text-emerald-50 max-w-xl">
                Explore the patient journey, step into the doctor's room, or see the whole clinic at a glance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigateTo('doctors')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-700 text-sm font-bold shadow-sm hover:bg-emerald-50 transition-colors"
              >
                Find Doctors
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('waiting-room-tv')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 text-white text-sm font-semibold border border-white/30 hover:bg-white/25 transition-colors"
              >
                <MonitorPlay className="w-4 h-4" />
                Clinic Display
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
