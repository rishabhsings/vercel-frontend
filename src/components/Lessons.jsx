import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import PitchDetector from './PitchDetector';
import { Play, CheckCircle2, ChevronRight, Award, Compass, Music, Flame, Lock, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

const Lessons = () => {
  const { user, completeLesson, setCurrentView } = useApp();
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  
  // Game states
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0); // in seconds
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAwarding, setIsAwarding] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const holdIntervalRef = useRef(null);
  const isCorrectPitchRef = useRef(false);

  // Load lessons from backend
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons');
        const data = await response.json();
        if (data.success) {
          setLessons(data.lessons);
        }
      } catch (err) {
        console.error('Failed to load lessons from server:', err);
        // Local mock fallback if offline
        const mockLessons = [
          {
            _id: 'les_sa_mock',
            title: "Swar 'Sa' - The Foundation",
            description: "Learn to sing the fundamental base note 'Sa' (C4) steady and strong. The foundation of Hindustani and Western music.",
            category: "Pitch Matching",
            targetNotes: [{ note: "C4", frequency: 261.63, durationSec: 3 }],
            xpReward: 100,
            difficulty: "Beginner"
          },
          {
            _id: 'les_re_mock',
            title: "Swar 'Re' - Climbing Up",
            description: "Ascend to the second note 'Re' (D4). Focus on moving smoothly and holding the pitch steady.",
            category: "Pitch Matching",
            targetNotes: [{ note: "D4", frequency: 293.66, durationSec: 3 }],
            xpReward: 120,
            difficulty: "Beginner"
          },
          {
            _id: 'les_warmup_mock',
            title: "Sargam Warmup: Sa-Re-Ga",
            description: "A continuous transition warmup exercise. Sing C4, transition to D4, and end on E4, holding each for 2 seconds.",
            category: "Vocal Warmup",
            targetNotes: [
              { note: "C4", frequency: 261.63, durationSec: 2 },
              { note: "D4", frequency: 293.66, durationSec: 2 },
              { note: "E4", frequency: 329.63, durationSec: 2 }
            ],
            xpReward: 200,
            difficulty: "Intermediate"
          },
          {
            _id: 'les_vowel_ah',
            title: "Vowel Practice: 'Ah'",
            description: "Open your mouth wide and sing a clear, resonant 'Ah' sound. Essential for vocal projection and tone clarity.",
            category: "Vowel Training",
            targetNotes: [
              { note: "C4", frequency: 261.63, durationSec: 4 },
              { note: "F4", frequency: 349.23, durationSec: 4 }
            ],
            xpReward: 150,
            difficulty: "Beginner"
          }
        ];
        setLessons(mockLessons);
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchLessons();
  }, []);

  // Monitor hold timer
  useEffect(() => {
    if (activeLesson && !isSuccess) {
      holdIntervalRef.current = setInterval(() => {
        const target = activeLesson.targetNotes[currentNoteIndex];
        
        if (isCorrectPitchRef.current) {
          setHoldProgress((prev) => {
            const nextProgress = prev + 0.1;
            if (nextProgress >= target.durationSec) {
              clearInterval(holdIntervalRef.current);
              handleNoteCompleted();
              return target.durationSec;
            }
            return nextProgress;
          });
        } else {
          // Slowly decay progress instead of resetting instantly (user friendly)
          setHoldProgress((prev) => Math.max(0, prev - 0.15));
        }
      }, 100);
    }

    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [activeLesson, currentNoteIndex, isSuccess]);

  const handleMatchProgress = (inTune) => {
    isCorrectPitchRef.current = inTune;
  };

  const handleNoteCompleted = () => {
    const nextIndex = currentNoteIndex + 1;
    if (nextIndex < activeLesson.targetNotes.length) {
      // Transition to next note in the sequence
      setCurrentNoteIndex(nextIndex);
      setHoldProgress(0);
      isCorrectPitchRef.current = false;
    } else {
      // Completed all notes! Lesson Win!
      triggerWin();
    }
  };

  const triggerWin = async () => {
    setIsSuccess(true);
    setIsAwarding(true);
    
    // Confetti!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Save progress to backend
    const result = await completeLesson(activeLesson._id);
    if (result && result.success) {
      setXpEarned(result.xpEarned || activeLesson.xpReward);
    } else {
      setXpEarned(activeLesson.xpReward);
    }
    setIsAwarding(false);
  };

  const startLesson = (lesson) => {
    setActiveLesson(lesson);
    setCurrentNoteIndex(0);
    setHoldProgress(0);
    setIsSuccess(false);
    setXpEarned(0);
    isCorrectPitchRef.current = false;
  };

  const stopActiveLesson = () => {
    setActiveLesson(null);
    setIsSuccess(false);
  };

  if (loadingLessons) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-slate-400 font-semibold uppercase tracking-wider">Loading Sargams...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {activeLesson ? (
        // ACTIVE SINGING GAME BOARD
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={stopActiveLesson}
              className="btn-secondary flex items-center gap-1.5 py-2 px-4 text-sm"
            >
              <ArrowLeft size={16} /> Exit Lesson
            </button>
            <div className="flex items-center gap-2">
              <span className="bg-slate-900/40 text-xs px-3 py-1.5 rounded-full border border-slate-700 font-semibold text-slate-300">
                Difficulty: {activeLesson.difficulty}
              </span>
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-xs px-3 py-1.5 rounded-full font-bold text-white shadow-lg shadow-amber-500/10">
                Reward: +{activeLesson.xpReward} XP
              </span>
            </div>
          </div>

          <div className="glass-card text-center relative overflow-hidden border-slate-800/50">
            <h2 className="text-2xl font-black tracking-tight text-white mb-1">{activeLesson.title}</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6 font-medium">{activeLesson.description}</p>
            
            {/* Note Sequence Progress */}
            {activeLesson.targetNotes.length > 1 && (
              <div className="flex justify-center gap-3 mb-6">
                {activeLesson.targetNotes.map((tn, idx) => (
                  <div 
                    key={idx}
                    className={`px-3 py-1 rounded-md text-xs font-bold border transition-all duration-300 ${
                      idx === currentNoteIndex
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_10px_rgba(79,70,229,0.2)]'
                        : idx < currentNoteIndex
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-800/50 border-slate-700 text-slate-500'
                    }`}
                  >
                    {tn.note} ({idx < currentNoteIndex ? 'Done' : 'Hold'})
                  </div>
                ))}
              </div>
            )}

            {/* Target Display and Progress Bar */}
            <div className="max-w-md mx-auto bg-slate-900/40 rounded-2xl p-6 border border-slate-800 flex flex-col items-center mb-6">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-1">Target Note</span>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-black text-white tracking-tighter">
                  {activeLesson.targetNotes[currentNoteIndex].note}
                </span>
                <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-lg font-bold">
                  {Math.round(activeLesson.targetNotes[currentNoteIndex].frequency)} Hz
                </span>
              </div>

              {/* Progress Hold Visualizer */}
              <div className="w-full flex flex-col gap-2 mt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className={isCorrectPitchRef.current ? 'text-emerald-400 animate-pulse-ring' : 'text-slate-500'}>
                    {isCorrectPitchRef.current ? '✓ IN TUNE! HOLD IT...' : '✖ MATCH THE NOTE'}
                  </span>
                  <span className="text-slate-400">
                    {Math.round(holdProgress * 10) / 10}s / {activeLesson.targetNotes[currentNoteIndex].durationSec}s
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-75"
                    style={{ width: `${(holdProgress / activeLesson.targetNotes[currentNoteIndex].durationSec) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Embed Pitch Detector */}
            {!isSuccess && (
              <PitchDetector 
                targetFrequency={activeLesson.targetNotes[currentNoteIndex].frequency}
                targetNoteName={activeLesson.targetNotes[currentNoteIndex].note}
                onMatchProgress={handleMatchProgress}
                isLessonMode={true}
              />
            )}

            {/* Victory Popup inside glass card */}
            {isSuccess && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-8 z-20 animate-fade-in backdrop-blur-xl rounded-3xl border border-emerald-500/30">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/50 mb-4 animate-float shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <Award size={44} className="text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">Lesson Completed!</h3>
                <p className="text-slate-400 font-medium max-w-sm mb-6">
                  Outstanding pitch control! You matched the frequencies and completed the sequence successfully.
                </p>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl py-4 px-8 mb-8 text-center flex items-center gap-3">
                  <div className="text-center border-r border-slate-700 pr-6">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">XP Reward</span>
                    <span className="text-2xl font-black text-amber-400">+{xpEarned} XP</span>
                  </div>
                  <div className="text-center pl-3">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Streaks</span>
                    <span className="text-2xl font-black text-indigo-400">Active</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => startLesson(activeLesson)}
                    className="btn-secondary shadow-none"
                  >
                    Retry Practice
                  </button>
                  <button 
                    onClick={stopActiveLesson}
                    className="btn-primary"
                  >
                    More Lessons
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // LESSONS DIRECTORY VIEW
        <div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white mb-1">Interactive Lessons</h1>
              <p className="text-slate-400 font-medium text-sm">Match notes, hold steady hums, and earn XP streaks</p>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="btn-secondary text-sm py-2 px-4 shadow-none"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {lessons.map((lesson) => {
              // Check if user has required level or voice classification compatibility
              const isWarmup = lesson.category === 'Vocal Warmup';
              
              return (
                <div 
                  key={lesson._id}
                  className="glass-card-hover border-slate-800/50 relative overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Badge row */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                        isWarmup 
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {lesson.category}
                      </span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800">
                        {lesson.targetNotes.length} {lesson.targetNotes.length > 1 ? 'Notes' : 'Note'}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-indigo-400 transition-colors">{lesson.title}</h3>
                    <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                      <Award size={14} /> +{lesson.xpReward} XP
                    </div>
                    
                    <button 
                      onClick={() => startLesson(lesson)}
                      className="bg-white hover:bg-slate-200 text-slate-900 rounded-full flex items-center gap-1 py-1.5 px-4 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    >
                      Start <Play size={10} fill="currentColor" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Lessons;
