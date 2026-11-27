import React from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { Navbar } from './components/Navbar';
import { Breadcrumb } from './components/Breadcrumb';
import { ToastContainer } from './components/Toast';
import { PersonaSwitcher } from './components/PersonaSwitcher';
import { Footer } from './components/Footer';

// Pages
import { DoctorSearchPage } from './pages/DoctorSearchPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { LiveQueuePage } from './pages/LiveQueuePage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { ReceptionistPage } from './pages/ReceptionistPage';
import { WaitingRoomTVPage } from './pages/WaitingRoomTVPage';
import { MyTokensPage } from './pages/MyTokensPage';

// Framer motion for smooth page transitions
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
  out: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.18,
      ease: 'easeIn',
    },
  },
};

const MainContent: React.FC = () => {
  const { activePage } = useQueue();

  if (activePage === 'waiting-room-tv') {
    return <WaitingRoomTVPage />;
  }

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'doctors':
        return <DoctorSearchPage />;
      case 'booking':
        return <BookingFlowPage />;
      case 'live-queue':
        return <LiveQueuePage />;
      case 'doctor-dashboard':
        return <DoctorDashboardPage />;
      case 'receptionist':
        return <ReceptionistPage />;
      case 'my-tokens':
        return <MyTokensPage />;
      default:
        return <DoctorSearchPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 md:pb-0">
      <Navbar />
      <Breadcrumb />
      
      {/* Floating interactive demo controls */}
      <PersonaSwitcher />

      {/* Main Animated Page View Container */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="w-full"
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <QueueProvider>
      <MainContent />
    </QueueProvider>
  );
}

export default App;
