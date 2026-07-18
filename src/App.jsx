import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Profile from './components/Profile';
import VocalRangeFinder from './components/VocalRangeFinder';
import Lessons from './components/Lessons';
import Tutorials from './components/Tutorials';
import FreePractice from './components/FreePractice';
import LiquidEther from './components/LiquidEther';
import Footer from './components/Footer';
import Header from './components/Header';
import Auth from './components/Auth';
import { Music, Trophy, Flame, User } from 'lucide-react';

const AppContent = () => {
  const { user, loading, currentView, setCurrentView } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-customNeonIndigo border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-sm">Raagam Audio Core Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Global LiquidEther Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
        <LiquidEther
          colors={['#4f46e5', '#10b981', '#6366f1']}
          mouseForce={18}
          cursorSize={120}
          isViscous={true}
          viscous={40}
          resolution={0.6}
          autoDemo={true}
          autoSpeed={0.3}
          autoIntensity={1.5}
        />
      </div>

      <Header />

      {/* Main Content Area */}
      <main className="flex-grow relative z-10 pt-20">
        {currentView === 'landing' && <Home />}
        {currentView === 'auth' && <Auth />}
        {currentView === 'profile' && <Profile />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'range-finder' && <VocalRangeFinder />}
        {currentView === 'lessons' && <Lessons />}
        {currentView === 'tutorials' && <Tutorials />}
        {currentView === 'free-practice' && <FreePractice />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
