import React from 'react';
import { useQueue, PageId } from '../context/QueueContext';
import { 
  Activity, 
  Clock, 
  Users, 
  Calendar, 
  UserCheck, 
  Tv, 
  Ticket, 
  Stethoscope, 
  ShieldCheck,
  RefreshCw,
  LogIn,
  Home
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, 
    activePage, 
    navigateTo, 
    userActiveEntry, 
    isReconnecting,
    queueState
  } = useQueue();

  const navLinks: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'doctors', label: 'Find Doctors', icon: <Stethoscope className="w-4 h-4" /> },
    { 
      id: 'live-queue', 
      label: 'Live Queue', 
      icon: <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />, 
      badge: userActiveEntry ? userActiveEntry.token : undefined 
    },
    { id: 'my-tokens', label: 'My Tokens', icon: <Ticket className="w-4 h-4" /> },
    { id: 'doctor-dashboard', label: 'Doctor Room', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'receptionist', label: 'Reception Hub', icon: <Users className="w-4 h-4" /> },
    { id: 'waiting-room-tv', label: 'Clinic Display', icon: <Tv className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Banner: Emergency & Real-time Sync Status */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE QUEUE ENGINE
          </span>
          <span className="hidden sm:inline text-slate-400">
            CareWell Super Specialty Clinic · Salt Lake Sector V
          </span>
        </div>

        <div className="flex items-center gap-3">
          {queueState === 'PAUSED' && (
            <span className="bg-amber-500/20 text-amber-300 text-[11px] px-2 py-0.5 rounded border border-amber-500/40 font-medium">
              Queue Paused
            </span>
          )}
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            {isReconnecting ? (
              <span className="flex items-center gap-1 text-amber-400">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Syncing snapshot...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Socket.IO: &lt;100ms
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Product Statement */}
            <div 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 to-navy-950 flex items-center justify-center text-white shadow-md shadow-navy-950/20 group-hover:scale-105 transition-transform duration-200">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                    Medi<span className="text-slate-700">Queue</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    PWA
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  Know your slot. Know your queue. Know your time.
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.2 bg-emerald-600 text-white font-mono text-[11px] font-semibold rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action / Active Token Quick Pill */}
            <div className="flex items-center gap-2">
              {userActiveEntry && (
                <button
                  onClick={() => navigateTo('live-queue')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all transform hover:scale-[1.02]"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Token {userActiveEntry.token}</span>
                  <span className="bg-emerald-800/80 px-1.5 py-0.5 rounded text-[10px] font-mono">
                    #{userActiveEntry.position > 0 ? userActiveEntry.position : 'Now'}
                  </span>
                </button>
              )}

              <button
                onClick={() => navigateTo('booking')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Book Slot</span>
              </button>

              <button
                onClick={() => navigateTo('sign-in')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  activePage === 'sign-in'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
                }`}
                title="Sign in or create an account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (PWA Experience) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        {navLinks.slice(0, 5).map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </div>
              <span className="mt-1 leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
