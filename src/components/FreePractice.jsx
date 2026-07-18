import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import PitchDetector from './PitchDetector';
import { playTone, noteToFrequency } from '../utils/audioUtils';
import { Music, PlayCircle, ArrowLeft } from 'lucide-react';

const FreePractice = () => {
  const { setCurrentView } = useApp();
  const audioCtxRef = useRef(null);

  // Initialize Audio Context for playback on first interaction
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handlePlayNote = (noteName) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const freq = noteToFrequency(noteName);
    if (freq > 0) {
      playTone(audioCtxRef.current, freq, 2.0); // Play for 2 seconds
    }
  };

  // Generate piano keys for 2 octaves (C3 to B4)
  const generateKeys = () => {
    const octaves = [3, 4];
    const notes = [
      { note: 'C', type: 'white' },
      { note: 'C#', type: 'black' },
      { note: 'D', type: 'white' },
      { note: 'D#', type: 'black' },
      { note: 'E', type: 'white' },
      { note: 'F', type: 'white' },
      { note: 'F#', type: 'black' },
      { note: 'G', type: 'white' },
      { note: 'G#', type: 'black' },
      { note: 'A', type: 'white' },
      { note: 'A#', type: 'black' },
      { note: 'B', type: 'white' }
    ];

    const keys = [];
    octaves.forEach(octave => {
      notes.forEach(n => {
        keys.push({
          name: `${n.note}${octave}`,
          type: n.type,
          label: n.type === 'white' ? `${n.note}${octave}` : ''
        });
      });
    });
    return keys;
  };

  const keys = generateKeys();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1 flex items-center gap-2">
            <Music className="text-indigo-400" size={28} /> Free Practice Tuner
          </h1>
          <p className="text-slate-400 font-medium text-sm">
            Play a reference note on the piano, then sing it back to see your pitch accuracy in real-time.
          </p>
        </div>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="btn-secondary flex items-center gap-1.5 text-sm py-2 px-4 whitespace-nowrap shadow-none"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 relative z-10">
        {/* Pitch Detector Component in open mode (no target) */}
        <div className="glass-card border-slate-800/50 p-2 md:p-6 shadow-sm">
          <PitchDetector 
            targetFrequency={null} 
            isLessonMode={false} 
            onMatchProgress={() => {}} 
          />
        </div>

        {/* Interactive Virtual Piano */}
        <div className="glass-card border-slate-800/50 flex flex-col items-center pt-8 pb-10 overflow-x-auto shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="w-full flex items-center justify-between px-4 mb-6 max-w-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <PlayCircle size={14} className="text-indigo-400" /> Interactive Pitch Reference
            </span>
            <span className="text-[10px] text-slate-500 font-bold">C3 to B4 Range</span>
          </div>

          <div className="relative flex justify-center min-w-[600px] px-4 select-none">
            {keys.map((key, index) => {
              if (key.type === 'white') {
                return (
                  <div
                    key={key.name}
                    onMouseDown={() => handlePlayNote(key.name)}
                    onTouchStart={(e) => { e.preventDefault(); handlePlayNote(key.name); }}
                    className="relative w-12 h-40 bg-slate-200 border-r border-b border-l border-slate-400 rounded-b-md cursor-pointer hover:bg-white active:bg-slate-300 transition-colors shadow-sm flex items-end justify-center pb-3 z-0 group"
                  >
                    <span className="text-slate-900 font-bold text-[10px] pointer-events-none opacity-50 group-hover:opacity-100">
                      {key.label}
                    </span>
                  </div>
                );
              }
              return null; // Handle black keys separately to overlap them
            })}
            
            {/* Absolute positioning for black keys over white keys */}
            <div className="absolute top-0 left-0 right-0 flex justify-center h-24 pointer-events-none px-4">
              {keys.map((key, index) => {
                // Calculate position for black keys
                // White keys are 48px wide (w-12).
                if (key.type === 'black') {
                  // Figure out how many white keys came before this black key in the current generation
                  const whiteKeysBefore = keys.slice(0, index).filter(k => k.type === 'white').length;
                  // Left position = number of white keys * width of white key - half width of black key
                  const leftOffset = (whiteKeysBefore * 48) - 12;
                  
                  return (
                    <div
                      key={key.name}
                      onMouseDown={() => handlePlayNote(key.name)}
                      onTouchStart={(e) => { e.preventDefault(); handlePlayNote(key.name); }}
                      className="absolute top-0 w-6 h-24 bg-slate-950 border border-black rounded-b-md cursor-pointer hover:bg-slate-800 active:bg-slate-700 pointer-events-auto z-10 shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
                      style={{ left: `${leftOffset}px`, transform: 'translateX(50%)' }} // Translate adjustment to center on the crack between white keys
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 text-center mt-6 max-w-sm font-medium">
            Click or tap any key to play the reference tone. Listen closely, then use your microphone to match the pitch on the tuner above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreePractice;
