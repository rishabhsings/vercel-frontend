import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, CheckCircle2, RotateCcw } from 'lucide-react';
import { autoCorrelate, frequencyToNote } from '../utils/audioUtils';

const PitchDetector = ({ targetFrequency, targetNoteName, onMatchProgress, isLessonMode = false }) => {
  const [isAudioRunning, setIsAudioRunning] = useState(false);
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [currentFrequency, setCurrentFrequency] = useState(-1);
  const [noteInfo, setNoteInfo] = useState(null);
  const [inTuneStreak, setInTuneStreak] = useState(0); // consecutive frames in tune
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  
  const pitchHistoryRef = useRef([]);
  const bufLength = 2048;
  const dataBufferRef = useRef(new Float32Array(bufLength));

  // Handle permission check
  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
      setMicPermission(permissionStatus.state);
      permissionStatus.onchange = () => {
        setMicPermission(permissionStatus.state);
      };
    }).catch(err => {
      console.warn('Microphone status query unsupported in this browser.', err);
    });
  }, []);

  // Teardown audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Update target line on canvas when targetFrequency changes
  useEffect(() => {
    pitchHistoryRef.current = [];
  }, [targetFrequency]);

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
      setMicPermission('granted');

      // Create Web Audio nodes
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = bufLength * 2; // For fine resolution
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      setIsAudioRunning(true);
      pitchHistoryRef.current = [];
      updatePitch();
    } catch (err) {
      console.error('Error starting audio input:', err);
      setMicPermission('denied');
      setIsAudioRunning(false);
    }
  };

  const stopAudio = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    
    setIsAudioRunning(false);
    setCurrentFrequency(-1);
    setNoteInfo(null);
  };

  const updatePitch = () => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const buffer = dataBufferRef.current;
    
    // Copy time domain data into Float32 buffer
    analyser.getFloatTimeDomainData(buffer);
    
    // Autocorrelate the signal
    const sampleRate = audioContextRef.current.sampleRate;
    const freq = autoCorrelate(buffer, sampleRate);
    
    if (freq !== -1) {
      setCurrentFrequency(Math.round(freq * 10) / 10);
      const note = frequencyToNote(freq);
      setNoteInfo(note);
      
      // Store in canvas scrolling history (in Hz)
      pitchHistoryRef.current.push(freq);
      
      // Handle Target Note matching logic (±15 cents is standard in-tune threshold, or within 5Hz)
      if (isLessonMode && targetFrequency) {
        const isCorrectNote = note.noteName.slice(0, -1) === targetNoteName.slice(0, -1);
        const centsDifference = note.centsDev;
        const inTune = isCorrectNote && Math.abs(centsDifference) <= 20; // within 20 cents
        
        if (inTune) {
          onMatchProgress(true);
        } else {
          onMatchProgress(false);
        }
      }
    } else {
      setCurrentFrequency(-1);
      setNoteInfo(null);
      pitchHistoryRef.current.push(-1);
      if (isLessonMode) {
        onMatchProgress(false);
      }
    }

    // Keep history clean (limit width of scrolling trail)
    if (pitchHistoryRef.current.length > 300) {
      pitchHistoryRef.current.shift();
    }

    drawPitchTrail();
    animationFrameRef.current = requestAnimationFrame(updatePitch);
  };

  const drawPitchTrail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas with dark background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Draw horizontal grid lines for octaves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let h = 0; h < height; h += height / 4) {
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(width, h);
      ctx.stroke();
    }

    // Render target frequency line if in Lesson Mode
    if (targetFrequency && targetFrequency > 0) {
      // Map frequency logarithmically/linearly to height
      // vocal range is roughly between 80Hz (C2) and 800Hz (G5)
      const targetY = getHzCanvasY(targetFrequency, height);
      
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, targetY);
      ctx.lineTo(width, targetY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash
      
      // Draw Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px Outfit, Inter, sans-serif';
      ctx.fillText(`Target: ${targetNoteName} (${Math.round(targetFrequency)} Hz)`, 10, targetY - 6);
    }

    // Render History Pitch Trail
    const history = pitchHistoryRef.current;
    if (history.length === 0) return;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    let drawing = false;
    ctx.beginPath();
    
    for (let i = 0; i < history.length; i++) {
      const hz = history[i];
      const x = (i / 300) * width;
      
      if (hz === -1) {
        // Break line if no note detected
        if (drawing) {
          ctx.stroke();
          drawing = false;
        }
        continue;
      }
      
      const y = getHzCanvasY(hz, height);
      
      // Determine color based on matching
      if (targetFrequency) {
        const diff = Math.abs(12 * Math.log2(hz / targetFrequency));
        const isMatched = diff < 0.15; // approximate semitone match
        ctx.strokeStyle = isMatched ? '#10b981' : '#6366f1';
      } else {
        ctx.strokeStyle = '#6366f1';
      }

      if (!drawing) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        drawing = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    if (drawing) {
      ctx.stroke();
    }
  };

  // Maps Hz to Canvas Y coordinates (logarithmic scaling fits music theory)
  const getHzCanvasY = (hz, canvasHeight) => {
    const minHz = 80;
    const maxHz = 700;
    // Logarithmic ratio
    const logMin = Math.log(minHz);
    const logMax = Math.log(maxHz);
    const logVal = Math.log(Math.max(minHz, Math.min(hz, maxHz)));
    
    const pct = (logVal - logMin) / (logMax - logMin);
    return canvasHeight - (pct * canvasHeight * 0.8 + canvasHeight * 0.1);
  };

  // Semicircle gauge configurations
  const needleRotation = noteInfo ? Math.max(-90, Math.min(90, (noteInfo.centsDev / 50) * 90)) : 0;
  const isCentsInTune = noteInfo ? Math.abs(noteInfo.centsDev) <= 15 : false;

  return (
    <div className="glass-card flex flex-col items-center border-slate-800/50">
      {/* Microphone status toggles */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800/50 pb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isAudioRunning ? 'bg-emerald-500 animate-pulse-ring shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
          <span className="text-sm font-bold tracking-wide uppercase text-slate-400">Audio Core Status</span>
        </div>
        
        {isAudioRunning ? (
          <button 
            onClick={stopAudio}
            className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/20 transition-all duration-200 shadow-sm"
          >
            <MicOff size={14} /> Stop Mic
          </button>
        ) : (
          <button 
            onClick={startAudio}
            className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20 transition-all duration-200 shadow-sm"
          >
            <Mic size={14} /> Start Mic
          </button>
        )}
      </div>

      {/* Permission Warnings */}
      {micPermission === 'denied' && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-center mb-4 max-w-md">
          <p className="text-sm text-rose-400 font-medium">
            Microphone access is blocked. Please reset site permissions in your browser bar, allow microphone inputs, and reload.
          </p>
        </div>
      )}

      {/* Primary Interface Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">
        {/* Tuner Semicircle needle */}
        <div className="flex flex-col items-center bg-slate-900/40 rounded-2xl p-4 border border-slate-800 relative shadow-inner">
          <span className="text-xs text-slate-500 font-bold mb-2">Tuner Dial (Cents Offset)</span>
          
          <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
            {/* Semicircle Track */}
            <path 
              d="M 20 100 A 80 80 0 0 1 180 100" 
              fill="none" 
              stroke="#334155" 
              strokeWidth="10" 
              strokeLinecap="round"
            />
            {/* Safe zone arc */}
            <path 
              d="M 76 36 A 80 80 0 0 1 124 36" 
              fill="none" 
              stroke={isCentsInTune && currentFrequency > 0 ? '#10b981' : '#cbd5e1'} 
              strokeWidth="10"
            />
            
            {/* Center Pin */}
            <circle cx="100" cy="100" r="6" fill="#0f172a" />
            
            {/* Dial Needle */}
            <line 
              x1="100" 
              y1="100" 
              x2="100" 
              y2="30" 
              stroke={currentFrequency > 0 ? (isCentsInTune ? '#10b981' : '#f43f5e') : '#94a3b8'} 
              strokeWidth="4" 
              strokeLinecap="round"
              style={{
                transform: `rotate(${needleRotation}deg)`,
                transformOrigin: '100px 100px',
                transition: 'transform 0.08s ease-out'
              }}
            />
            
            {/* Centering tick */}
            <line x1="100" y1="20" x2="100" y2="10" stroke="#f8fafc" strokeWidth="2" />
            <text x="20" y="112" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">-50c</text>
            <text x="100" y="112" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">0c</text>
            <text x="180" y="112" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">+50c</text>
          </svg>

          {/* Current Notes readout */}
          {currentFrequency > 0 && noteInfo ? (
            <div className="text-center mt-3">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl font-black text-white tracking-tight">{noteInfo.noteName}</span>
                <span className="text-2xl font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/30 shadow-[0_0_10px_rgba(79,70,229,0.1)]">{noteInfo.swarName}</span>
              </div>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <span className="text-sm font-bold tracking-wider text-slate-400">{currentFrequency} Hz</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isCentsInTune ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'}`}>
                  {noteInfo.centsDev > 0 ? `+${noteInfo.centsDev}` : noteInfo.centsDev} Cents
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center mt-3 text-slate-500 py-2">
              <p className="text-sm font-bold tracking-wide">Awaiting Signal...</p>
              <p className="text-xs mt-0.5 font-medium text-slate-600">Hum, whistle or sing into mic</p>
            </div>
          )}
        </div>

        {/* Live-scrolling Pitch canvas */}
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-bold uppercase">Live Pitch Trail</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">80 Hz - 700 Hz (C2 - F5 Range)</span>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-[145px] shadow-inner bg-slate-900/50">
            <canvas 
              ref={canvasRef} 
              width="400" 
              height="145" 
              className="w-full h-full block" 
            />
          </div>
        </div>
      </div>

      {/* Guide & Controls */}
      {!isAudioRunning && (
        <div className="w-full mt-6 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 text-center flex flex-col items-center justify-center shadow-inner relative z-10">
          <p className="text-sm text-slate-400 mb-3 max-w-sm font-medium">
            Ready to test your vocals? Allow microphone access and click below to open the Audio Core stream.
          </p>
          <button 
            onClick={startAudio}
            className="btn-primary flex items-center justify-center gap-2 shadow-none"
          >
            <Mic size={18} /> Connect Device Input
          </button>
        </div>
      )}
    </div>
  );
};

export default PitchDetector;
