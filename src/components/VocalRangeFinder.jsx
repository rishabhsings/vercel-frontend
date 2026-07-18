import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { autoCorrelate, frequencyToNote } from '../utils/audioUtils';
import { Mic, Check, Trophy, ArrowRight, RotateCcw, Volume2 } from 'lucide-react';

const VocalRangeFinder = () => {
  const { updateVocalProfile, setCurrentView } = useApp();
  const [step, setStep] = useState(1); // 1: Info, 2: Lowest Note, 3: Highest Note, 4: Results
  
  // Audio state
  const [isAudioRunning, setIsAudioRunning] = useState(false);
  const [currentHz, setCurrentHz] = useState(-1);
  const [currentNote, setCurrentNote] = useState(null);
  
  // Recorded stats
  const [minHz, setMinHz] = useState(9999);
  const [maxHz, setMaxHz] = useState(0);
  const [lowestNoteName, setLowestNoteName] = useState('');
  const [highestNoteName, setHighestNoteName] = useState('');
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const bufLength = 2448; // For higher frequency accuracy
  const bufferRef = useRef(new Float32Array(bufLength));

  // Auto classification
  const classifyVoiceType = (lowestHz, highestHz) => {
    if (lowestHz >= 200) return 'Soprano';
    if (lowestHz >= 150) return 'Alto';
    if (lowestHz >= 105) return 'Tenor';
    return 'Bass';
  };

  const startAudio = async () => {
    try {
      stopAudio();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        }
      });
      
      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = bufLength * 2;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      setIsAudioRunning(true);
      capturePitch();
    } catch (error) {
      console.error('Error opening mic for range finder:', error);
      alert('Could not access microphone. Please enable microphone permissions in your browser settings.');
    }
  };

  const stopAudio = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setIsAudioRunning(false);
    setCurrentHz(-1);
    setCurrentNote(null);
  };

  const capturePitch = () => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const buffer = bufferRef.current;
    analyser.getFloatTimeDomainData(buffer);
    
    const sampleRate = audioContextRef.current.sampleRate;
    const hz = autoCorrelate(buffer, sampleRate);
    
    if (hz !== -1 && hz > 50 && hz < 1200) {
      setCurrentHz(Math.round(hz * 10) / 10);
      const note = frequencyToNote(hz);
      setCurrentNote(note);

      if (step === 2) {
        // We look for a steady minimum frequency
        if (hz < minHz) {
          setMinHz(Math.round(hz * 10) / 10);
          setLowestNoteName(note.noteName);
        }
      } else if (step === 3) {
        // We look for a steady maximum frequency
        if (hz > maxHz) {
          setMaxHz(Math.round(hz * 10) / 10);
          setHighestNoteName(note.noteName);
        }
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(capturePitch);
  };

  const handleNextStep = () => {
    stopAudio();
    if (step === 1) {
      setMinHz(9999);
      setLowestNoteName('');
      setStep(2);
      startAudio();
    } else if (step === 2) {
      if (minHz === 9999) {
        alert('Please sing your lowest note so we can record it.');
        startAudio(); // restart audio if stopped
        return;
      }
      setMaxHz(0);
      setHighestNoteName('');
      setStep(3);
      startAudio();
    } else if (step === 3) {
      if (maxHz === 0) {
        alert('Please sing your highest note so we can record it.');
        startAudio(); // restart audio if stopped
        return;
      }
      setStep(4);
    }
  };

  const resetFinder = () => {
    stopAudio();
    setMinHz(9999);
    setMaxHz(0);
    setLowestNoteName('');
    setHighestNoteName('');
    setStep(1);
  };

  const saveProfile = async () => {
    const voiceType = classifyVoiceType(minHz, maxHz);
    const success = await updateVocalProfile({
      voiceType,
      minFrequency: minHz,
      maxFrequency: maxHz,
      lowestNote: lowestNoteName,
      highestNote: highestNoteName
    });
    
    if (success) {
      setCurrentView('dashboard');
    } else {
      alert('Error updating vocal profile. Storing locally.');
      setCurrentView('dashboard');
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in relative z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Vocal Range Finder</h1>
        <p className="text-slate-400 font-medium">Discover your natural voice classification in 3 simple steps</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-10 max-w-md mx-auto relative px-2">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -translate-y-1/2 z-0 transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
        
        {[1, 2, 3, 4].map((num) => (
          <div 
            key={num}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300 shadow-sm ${
              step >= num 
                ? 'bg-indigo-500 text-white border-2 border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.4)]' 
                : 'bg-slate-900 border-2 border-slate-700 text-slate-500'
            }`}
          >
            {step > num ? <Check size={14} strokeWidth={3} /> : num}
          </div>
        ))}
      </div>

      {/* Steps Panels */}
      <div className="glass-card p-8 relative overflow-hidden border-slate-800/50">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        {step === 1 && (
          <div className="text-center relative z-10">
            <Volume2 className="mx-auto text-indigo-400 w-16 h-16 mb-4 animate-float" />
            <h2 className="text-2xl font-black text-white mb-4">Let's Find Your Range</h2>
            <p className="text-slate-300 leading-relaxed mb-6 max-w-lg mx-auto font-medium">
              We classification voices into standard types: <b className="text-white">Soprano, Alto, Tenor, and Bass</b>.
              We will measure your lowest comfortable note, then your highest comfortable note.
              Please sit in a quiet room and prepare to hum or sing.
            </p>
            <button 
              onClick={handleNextStep}
              className="btn-primary inline-flex items-center gap-2 group mx-auto shadow-none"
            >
              Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center relative z-10">
            <h2 className="text-xl font-black text-white mb-1">Step 1: Your Lowest Note</h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">Sing a comfortable, deep "Ah" or hum as low as you can go.</p>
            
            {/* Tuner readouts */}
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800/50 max-w-xs mx-auto mb-6 shadow-inner">
              <span className="text-xs font-bold text-slate-500 block mb-1">Detected Low Pitch</span>
              {currentHz > 0 && currentNote ? (
                <div>
                  <div className="text-4xl font-black text-white mb-1">{currentNote.noteName}</div>
                  <div className="text-xs text-indigo-400 font-bold">{currentHz} Hz</div>
                </div>
              ) : (
                <div className="text-slate-500 py-2">
                  <p className="text-sm font-semibold">Awaiting vocals...</p>
                  <p className="text-[10px] mt-0.5">Start singing low notes</p>
                </div>
              )}
            </div>

            {/* Lock in readout */}
            <div className="mb-8">
              <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Locked Lowest Pitch</span>
              {minHz !== 9999 ? (
                <div className="text-white text-3xl font-black tracking-tight">
                  {lowestNoteName} <span className="text-indigo-400">({minHz} Hz)</span>
                </div>
              ) : (
                <div className="text-slate-500 italic text-sm font-medium">Sing lower to record...</div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={resetFinder} className="btn-secondary flex items-center gap-1.5 py-2 px-6">
                <RotateCcw size={16} /> Reset
              </button>
              <button onClick={handleNextStep} className="btn-primary flex items-center gap-1.5 py-2 px-6 shadow-none">
                Lock & Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center relative z-10">
            <h2 className="text-xl font-black text-white mb-1">Step 2: Your Highest Note</h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">Sing a comfortable high "Ah" as high as you can go (avoid straining!).</p>
            
            {/* Tuner readouts */}
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800/50 max-w-xs mx-auto mb-6 shadow-inner">
              <span className="text-xs font-bold text-slate-500 block mb-1">Detected High Pitch</span>
              {currentHz > 0 && currentNote ? (
                <div>
                  <div className="text-4xl font-black text-white mb-1">{currentNote.noteName}</div>
                  <div className="text-xs text-emerald-400 font-bold">{currentHz} Hz</div>
                </div>
              ) : (
                <div className="text-slate-500 py-2">
                  <p className="text-sm font-semibold">Awaiting vocals...</p>
                  <p className="text-[10px] mt-0.5">Start singing high notes</p>
                </div>
              )}
            </div>

            {/* Lock in readout */}
            <div className="mb-8">
              <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Locked Highest Pitch</span>
              {maxHz > 0 ? (
                <div className="text-white text-3xl font-black tracking-tight">
                  {highestNoteName} <span className="text-emerald-400">({maxHz} Hz)</span>
                </div>
              ) : (
                <div className="text-slate-500 italic text-sm font-medium">Sing higher to record...</div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={resetFinder} className="btn-secondary flex items-center gap-1.5 py-2 px-6">
                <RotateCcw size={16} /> Reset
              </button>
              <button onClick={handleNextStep} className="btn-primary flex items-center gap-1.5 py-2 px-6 shadow-none">
                Lock & Finish <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center relative z-10">
            <Trophy className="mx-auto text-amber-500 w-16 h-16 mb-4 animate-float" />
            <h2 className="text-2xl font-black text-white mb-2">Vocal Profile Ready!</h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">We classified your natural vocal properties</p>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-3.5 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Lowest Note</span>
                <span className="text-lg font-black text-white">{lowestNoteName} <span className="text-sm text-indigo-400">({minHz}Hz)</span></span>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-3.5 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Highest Note</span>
                <span className="text-lg font-black text-white">{highestNoteName} <span className="text-sm text-emerald-400">({maxHz}Hz)</span></span>
              </div>
              <div className="col-span-2 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-indigo-500/30 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Voice Type Classification</span>
                <span className="text-2xl font-black text-indigo-400 block mt-0.5">
                  {classifyVoiceType(minHz, maxHz)}
                </span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={resetFinder} className="btn-secondary flex items-center gap-1.5 py-2 px-6">
                <RotateCcw size={16} /> Retest
              </button>
              <button onClick={saveProfile} className="btn-accent flex items-center gap-1.5 py-2 px-6 shadow-none">
                Save & Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocalRangeFinder;
