import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Flame, Music, HelpCircle, ArrowRight, Video, UserCheck, Play } from 'lucide-react';

const Dashboard = () => {
  const { user, setCurrentView } = useApp();

  // Helper to determine recommend videos based on voice classification
  const getRecommendations = (voiceType) => {
    const defaultRecs = [
      {
        title: "Daily Humming and Vocal Exercises",
        duration: "5 mins",
        url: "https://www.youtube.com/watch?v=2TzC7s9j59Y",
        description: "Perfect for absolute beginners to loosen vocal cords gently."
      },
      {
        title: "Pitch Matching for Complete Beginners",
        duration: "8 mins",
        url: "https://www.youtube.com/watch?v=68TjR0B6x3c",
        description: "Focuses on tuning your ears to match key piano chords."
      }
    ];

    switch (voiceType) {
      case 'Soprano':
        return [
          {
            title: "Soprano High Range Extension & Warmup",
            duration: "10 mins",
            url: "https://www.youtube.com/watch?v=3g8K9114b0Y",
            description: "Exercises focusing on safe head voice transitions and breath support for high sopranos."
          },
          {
            title: "Breathing Exercises for High Notes",
            duration: "6 mins",
            url: "https://www.youtube.com/watch?v=FjUcr7z5J4A",
            description: "Strengthen diaphragmatic posture to support higher octaves."
          },
          ...defaultRecs
        ];
      case 'Alto':
        return [
          {
            title: "Alto Vocal Warmups (D3 to A5)",
            duration: "12 mins",
            url: "https://www.youtube.com/watch?v=zJg4v4vI7k0",
            description: "Ideal chest and middle-voice mix exercises for alto ranges."
          },
          {
            title: "Rich Warmth in Lower-Mid Registry",
            duration: "7 mins",
            url: "https://www.youtube.com/watch?v=aPzJ3_e2eD4",
            description: "Techniques to maintain a full alto warmth without cracking."
          },
          ...defaultRecs
        ];
      case 'Tenor':
        return [
          {
            title: "Tenor Head Voice Expansion Tutorial",
            duration: "15 mins",
            url: "https://www.youtube.com/watch?v=2K4Vb7aN0X4",
            description: "Unlocking falsetto and bridging register transitions for tenors."
          },
          {
            title: "Pitch Closeness for High Male Registers",
            duration: "8 mins",
            url: "https://www.youtube.com/watch?v=GkX0q5kZ10g",
            description: "Prevent straining on F4 to A4 notes."
          },
          ...defaultRecs
        ];
      case 'Bass':
        return [
          {
            title: "Deep Vocal Resonance for Basses (E2 to C4)",
            duration: "10 mins",
            url: "https://www.youtube.com/watch?v=dpxXQ1q7u5o",
            description: "Maximize chest cavity resonance and control deep frequencies safely."
          },
          {
            title: "Deep Bass Warmup Exercises",
            duration: "8 mins",
            url: "https://www.youtube.com/watch?v=M2Oszb8j_k8",
            description: "Exercises for starting singing in the lower octaves safely."
          },
          ...defaultRecs
        ];
      default:
        return defaultRecs;
    }
  };

  const vocalProfile = user?.vocalProfile || {};
  const stats = user?.stats || {};
  const voiceType = vocalProfile.voiceType || 'Undetermined';
  const hasRangeProfile = voiceType !== 'Undetermined' && vocalProfile.minFrequency > 0;
  
  const recommendations = getRecommendations(voiceType);

  // Map frequency logarithmic ratio for the safe range bar
  const getLogPercent = (hz) => {
    const minPianoHz = 65; // C2
    const maxPianoHz = 1046; // C6
    const logMin = Math.log(minPianoHz);
    const logMax = Math.log(maxPianoHz);
    const logVal = Math.log(Math.max(minPianoHz, Math.min(hz, maxPianoHz)));
    return ((logVal - logMin) / (logMax - logMin)) * 100;
  };

  const minRangePct = hasRangeProfile ? getLogPercent(vocalProfile.minFrequency) : 0;
  const maxRangePct = hasRangeProfile ? getLogPercent(vocalProfile.maxFrequency) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card mb-8 border-indigo-500/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">
            Namaste, <span className="text-indigo-400">{user?.username}</span>!
          </h1>
          <p className="text-slate-400 text-sm max-w-md font-medium">
            Welcome to Raagam. Train your ear and voice with real-time feedback.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setCurrentView('lessons')}
            className="btn-primary flex items-center gap-1.5 shadow-none"
          >
            <Play size={16} fill="white" /> Practice Lessons
          </button>
          {!hasRangeProfile && (
            <button 
              onClick={() => setCurrentView('range-finder')}
              className="btn-secondary flex items-center gap-1.5"
            >
              Analyze Range
            </button>
          )}
        </div>
      </div>

      {/* Grid: Stats & Vocal Range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        
        {/* XP Card */}
        <div className="glass-card flex items-center gap-5 border-slate-800/50">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400">
            <Trophy size={24} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Experience</span>
            <span className="text-2xl font-black text-white">{stats.xp || 0} <span className="text-sm font-semibold text-amber-500">XP</span></span>
          </div>
        </div>

        {/* Streak Card */}
        <div className="glass-card flex items-center gap-5 border-slate-800/50">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center text-rose-400">
            <Flame size={24} className="animate-float" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Practice Streak</span>
            <span className="text-2xl font-black text-white">{stats.streakDays || 0} <span className="text-sm font-semibold text-rose-500">Days</span></span>
          </div>
        </div>

        {/* Voice Type Card */}
        <div className="glass-card flex items-center gap-5 border-slate-800/50">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400">
            <UserCheck size={24} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Vocal Classification</span>
            <span className="text-xl font-black text-indigo-400">{voiceType}</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Column: Vocal Range bar chart */}
        <div className="glass-card lg:col-span-2 flex flex-col justify-between border-slate-800/50">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight mb-2 flex items-center gap-2">
              <Music size={18} className="text-indigo-400" /> Safe Vocal Range Profile
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">
              Your safety limits prevent vocal cord fatigue and nodules. Sing in this range for maximum health.
            </p>
            
            {hasRangeProfile ? (
              <div className="py-6 px-2">
                {/* Horizontal range bar */}
                <div className="relative w-full h-4 bg-slate-800 rounded-full border border-slate-700 mb-6">
                  {/* Highlight bar */}
                  <div 
                    className="absolute h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    style={{ 
                      left: `${minRangePct}%`, 
                      width: `${maxRangePct - minRangePct}%` 
                    }}
                  />
                  
                  {/* Markers */}
                  <div 
                    className="absolute w-4 h-4 bg-white border-2 border-indigo-500 rounded-full -top-1.5 -translate-x-1/2 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                    style={{ left: `${minRangePct}%` }}
                  />
                  <div 
                    className="absolute w-4 h-4 bg-white border-2 border-emerald-400 rounded-full -top-1.5 -translate-x-1/2 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ left: `${maxRangePct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold px-1">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Lowest Pitch</span>
                    <span className="text-sm font-black text-white">{vocalProfile.lowestNote} ({vocalProfile.minFrequency} Hz)</span>
                  </div>
                  <div className="text-center bg-slate-900/40 border border-slate-700 px-3 py-1.5 rounded-lg">
                    <span className="text-slate-500 block text-[9px] uppercase">Width</span>
                    <span className="text-xs font-bold text-white">
                      {Math.round(12 * Math.log2(vocalProfile.maxFrequency / vocalProfile.minFrequency))} Semitones
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px] uppercase">Highest Pitch</span>
                    <span className="text-sm font-black text-white">{vocalProfile.highestNote} ({vocalProfile.maxFrequency} Hz)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 text-center py-10 flex flex-col items-center">
                <HelpCircle className="w-10 h-10 text-slate-500 mb-2 animate-float" />
                <p className="text-sm text-white font-bold mb-2">Voice Type Undetermined</p>
                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  Run our 3-step pitch matching finder to measure your frequencies and get customized recommended lessons.
                </p>
                <button 
                  onClick={() => setCurrentView('range-finder')}
                  className="btn-primary text-xs flex items-center gap-1 py-2 px-4 shadow-none"
                >
                  Start Range Onboarding <ArrowRight size={12} />
                </button>
              </div>
            )}
          </div>

          {hasRangeProfile && (
            <div className="mt-6 border-t border-slate-800/50 pt-4 text-center">
              <button 
                onClick={() => setCurrentView('range-finder')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold tracking-wide transition-colors"
              >
                Re-take range finder assessment
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Recommendations */}
        <div className="glass-card flex flex-col justify-between border-slate-800/50">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight mb-2 flex items-center gap-2">
              <Video size={18} className="text-indigo-400" /> Video Practice Recommendations
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-medium">
              Curated audio training recommendations based on your {voiceType !== 'Undetermined' ? `natural ${voiceType}` : 'starter'} vocal profile.
            </p>

            <div className="flex flex-col gap-3">
              {recommendations.map((rec, index) => (
                <a 
                  key={index}
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-800/60 rounded-xl p-3 flex gap-3 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(79,70,229,0.15)] transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Video size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1">
                      {rec.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-normal">
                      {rec.description}
                    </p>
                    <span className="text-[9px] font-semibold text-slate-500 block mt-1">
                      Duration: {rec.duration}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {!hasRangeProfile && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl mt-4">
              <p className="text-[10px] text-rose-400 font-semibold leading-normal text-center">
                ℹ️ Complete your Vocal Range Finder to unlock voice-specific (Soprano/Alto/Tenor/Bass) training.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
