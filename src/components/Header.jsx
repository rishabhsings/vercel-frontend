import React from 'react';
import { useApp } from '../context/AppContext';
import { User } from 'lucide-react';

const Header = () => {
  const { currentView, setCurrentView, user, login } = useApp();

  const getNavClass = (viewName) => {
    const isActive = currentView === viewName;
    return `text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-full ${
      isActive 
        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.15)]' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <span className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Raagam 🎙️
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => setCurrentView('landing')} className={getNavClass('landing')}>Home</button>
          <button onClick={() => setCurrentView('free-practice')} className={getNavClass('free-practice')}>Interactive Tools</button>
          <button onClick={() => setCurrentView('lessons')} className={getNavClass('lessons')}>Vocal Academy</button>
          <button onClick={() => setCurrentView('dashboard')} className={getNavClass('dashboard')}>Progress Dashboard</button>
        </div>
        
        <div>
          {user?.isGuest ? (
            <button 
              onClick={() => setCurrentView('auth')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2 px-5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center gap-2 hover:scale-[1.02]"
            >
              <User size={16} /> Login / Register
            </button>
          ) : (
            <button 
              onClick={() => setCurrentView('profile')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2 px-5 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all duration-300 flex items-center gap-2 hover:scale-[1.02]"
            >
              <User size={16} /> My Profile
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
