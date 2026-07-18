export const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const swarStrings = ["Sa", "Re(k)", "Re", "Ga(k)", "Ga", "Ma", "Ma(t)", "Pa", "Dha(k)", "Dha", "Ni(k)", "Ni"];

/**
 * Calculates fundamental frequency (pitch) in Hz using Autocorrelation
 * @param {Float32Array} buf Audio buffer
 * @param {number} sampleRate AudioContext sample rate
 * @returns {number} Detected frequency in Hz, or -1 if no signal/insufficient pitch clarity
 */
export function autoCorrelate(buf, sampleRate) {
  const SIZE = buf.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  
  // Audio safety fallback: return -1 if volume is too quiet (noise gate)
  if (rms < 0.008) {
    return -1;
  }

  // Trim silence/low amplitude tails from search range
  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = SIZE - 1; i >= SIZE / 2; i--) {
    if (Math.abs(buf[i]) < thres) {
      r2 = i;
      break;
    }
  }

  const trimmedBuf = buf.subarray(r1, r2);
  const trimmedSize = trimmedBuf.length;

  // Perform cross-correlation
  const c = new Float32Array(trimmedSize);
  for (let i = 0; i < trimmedSize; i++) {
    for (let j = 0; j < trimmedSize - i; j++) {
      c[i] = c[i] + trimmedBuf[j] * trimmedBuf[j + i];
    }
  }

  // Find the first zero-crossing peak
  let d = 0;
  while (c[d] > c[d + 1]) d++;
  
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < trimmedSize / 2; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  
  let T0 = maxpos;

  // Apply parabolic interpolation for sub-sample accuracy
  if (T0 > 0 && T0 < trimmedSize - 1) {
    const x1 = c[T0 - 1];
    const x2 = c[T0];
    const x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);
  }

  // Frequency is sample rate divided by the period (in samples)
  const frequency = sampleRate / T0;
  
  // Standard human vocal fundamental frequency ranges from ~50 Hz to ~2000 Hz
  if (frequency > 50 && frequency < 2000) {
    return frequency;
  }
  
  return -1;
}

/**
 * Converts frequency in Hz to musical note details
 * @param {number} frequency 
 * @returns {object|null} Western/Indian note mapping, cents offset, and raw notes
 */
export function frequencyToNote(frequency) {
  if (!frequency || frequency <= 0) return null;
  
  // pitch equation: noteNum = 12 * log2(freq / 440) + 69
  const noteNum = 12 * Math.log2(frequency / 440) + 69;
  const roundedNote = Math.round(noteNum);
  const centsDev = Math.round((noteNum - roundedNote) * 100);
  
  const noteIndex = ((roundedNote % 12) + 12) % 12;
  const octave = Math.floor(roundedNote / 12) - 1;
  
  const noteName = noteStrings[noteIndex] + octave;
  const swarName = swarStrings[noteIndex];
  
  return {
    noteNum,
    roundedNote,
    noteIndex,
    octave,
    noteName,
    swarName,
    centsDev
  };
}

/**
 * Converts standard note string to equivalent target frequency in Hz
 * @param {string} noteName (e.g. "C4")
 * @returns {number} frequency in Hz
 */
export function noteToFrequency(noteName) {
  const regex = /^([A-G]#?)(\d+)$/;
  const match = noteName.match(regex);
  if (!match) return 0;
  
  const letter = match[1];
  const octave = parseInt(match[2], 10);
  const noteIndex = noteStrings.indexOf(letter);
  if (noteIndex === -1) return 0;
  
  const noteNum = (octave + 1) * 12 + noteIndex;
  return 440 * Math.pow(2, (noteNum - 69) / 12);
}

/**
 * Plays a synthesized tone using Web Audio API
 * @param {AudioContext} audioCtx 
 * @param {number} frequency 
 * @param {number} duration in seconds
 */
export function playTone(audioCtx, frequency, duration = 1.5) {
  if (!audioCtx || frequency <= 0) return;
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  // Use a mix of sine and triangle for a pleasant electric piano-like sound
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  // Envelope
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1); // Attack
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration); // Decay/Release
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}
