import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Role } from '../types/queue';
import {
  Activity,
  ArrowRight,
  ChevronLeft,
  HeartPulse,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
} from 'lucide-react';

type AuthMode = 'sign-in' | 'sign-up';

export const SignInPage: React.FC = () => {
  const { setRole, navigateTo, showToast } = useQueue();
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [role, setSelectedRole] = useState<Role>('PATIENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const roles: { id: Role; label: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'PATIENT',
      label: 'Patient',
      description: 'Book slots and track your turn',
      icon: <UserRound className="w-5 h-5" />,
    },
    {
      id: 'DOCTOR',
      label: 'Doctor',
      description: 'Run your consultation queue',
      icon: <Stethoscope className="w-5 h-5" />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(role);
    showToast(
      mode === 'sign-in' ? 'Signed in successfully' : 'Account created',
      role === 'DOCTOR'
        ? 'Your consultation dashboard is ready.'
        : 'You can now find doctors and reserve a slot.',
      'success'
    );
    navigateTo(role === 'DOCTOR' ? 'doctor-dashboard' : 'doctors');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 min-h-screen flex items-center">
      <div className="w-full grid md:grid-cols-[0.95fr_1.05fr] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between">
          <div className="absolute -top-16 -right-12 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to home
            </button>

            <div className="mt-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              One clinic. One live queue.
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">
                MediQueue
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-sm">
              Sign in to reserve a consultation slot, follow your digital token, or manage your clinic queue in real time.
            </p>

            <div className="mt-8 space-y-3">
              {[
                { icon: <HeartPulse className="w-4 h-4" />, text: 'Instant digital tokens' },
                { icon: <Activity className="w-4 h-4" />, text: 'Live position and wait-time updates' },
                { icon: <ShieldCheck className="w-4 h-4" />, text: 'Synced across patients, doctors and front desk' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-slate-200">
                  <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-emerald-300">
                    {item.icon}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <p className="relative mt-10 text-[11px] text-slate-400">
            CareWell Super Specialty Clinic · Salt Lake Sector V
          </p>
        </div>

        <div className="p-7 sm:p-10">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100">
            {([
              { id: 'sign-in' as const, label: 'Sign In' },
              { id: 'sign-up' as const, label: 'Sign Up' },
            ]).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  mode === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h2 className="mt-7 text-2xl font-extrabold tracking-tight text-slate-900">
            {mode === 'sign-in' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            {mode === 'sign-in'
              ? 'Choose how you want to continue.'
              : 'Tell us how you will use MediQueue.'}
          </p>

          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Continue as
            </p>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((option) => {
                const isSelected = role === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedRole(option.id)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/25'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl mb-2.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {option.icon}
                    </span>
                    <span className="block text-sm font-bold text-slate-900">{option.label}</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'sign-up' && (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {mode === 'sign-up' && (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3 text-[11px] text-slate-400">
            <span className="h-px bg-slate-200 flex-1" />
            OR
            <span className="h-px bg-slate-200 flex-1" />
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="mt-5 w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 transition-colors"
          >
            Explore MediQueue without signing in
          </button>
          <p className="mt-3 text-center text-[11px] text-slate-400">
            Demo mode — any email and password will work.
          </p>
        </div>
      </div>
    </div>
  );
};
