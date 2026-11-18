/**
 * Web Audio API Cavaquinho Pluck Synthesizer
 * Uses physical-modeling style synthesis (filtered pulse + decaying exponential envelope)
 * to simulate authentic steel string acoustic cavaquinho sound.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a single note given MIDI number
 */
export function playNote(midiNote: number, durationSeconds = 1.8) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Convert MIDI to frequency
    const freq = 440 * Math.pow(2, (midiNote - 69) / 12);

    // Oscillator 1: Main pluck wave
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);

    // Oscillator 2: Slightly detuned harmonic for rich steel string timbre
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now); // 1 octave above

    // Lowpass filter simulating wooden instrument body response
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(freq, 200), now + durationSeconds);

    // Gain envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    // Fast attack
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.008);
    // Exponential decay
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

    // Connections
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start & Stop
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durationSeconds);
    osc2.stop(now + durationSeconds);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * Strum a full chord across all active strings with realistic human arpeggio delay
 */
export function strumChord(midiNotes: number[]) {
  if (!midiNotes || midiNotes.length === 0) return;
  
  // Sort or strum from lowest to highest pitch or string 4 to 1
  midiNotes.forEach((midi, idx) => {
    setTimeout(() => {
      playNote(midi, 2.2);
    }, idx * 45); // 45ms strum interval between strings
  });
}
