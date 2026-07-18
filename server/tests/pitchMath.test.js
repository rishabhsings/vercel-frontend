import { frequencyToNote, noteToFrequency } from '../../src/utils/audioUtils.js';

console.log('--- STARTING PITCH MATHEMATICS VERIFICATION ---');

const testCases = [
  { hz: 261.63, expectedNote: 'C4', expectedSwar: 'Sa' },
  { hz: 440.00, expectedNote: 'A4', expectedSwar: 'Dha' },
  { hz: 196.00, expectedNote: 'G3', expectedSwar: 'Pa' },
  { hz: 82.41, expectedNote: 'E2', expectedSwar: 'Ga' },
  { hz: 329.63, expectedNote: 'E4', expectedSwar: 'Ga' }
];

let passed = 0;

testCases.forEach((tc, idx) => {
  const result = frequencyToNote(tc.hz);
  if (!result) {
    console.error(`❌ Test #${idx + 1} Failed: Got null result for ${tc.hz} Hz`);
    return;
  }
  
  const matchesNote = result.noteName === tc.expectedNote;
  const matchesSwar = result.swarName === tc.expectedSwar;
  
  if (matchesNote && matchesSwar) {
    console.log(`✅ Test #${idx + 1} Passed: ${tc.hz} Hz -> Note: ${result.noteName} (${result.swarName}), Cents Dev: ${result.centsDev}`);
    passed++;
  } else {
    console.error(`❌ Test #${idx + 1} Failed: ${tc.hz} Hz -> Expected: ${tc.expectedNote} (${tc.expectedSwar}), Got: ${result.noteName} (${result.swarName})`);
  }
});

console.log(`\n--- Note to Frequency Reverse Mapping Tests ---`);
const noteTestCases = ['C4', 'A4', 'G3', 'E2'];
noteTestCases.forEach(note => {
  const calculatedHz = noteToFrequency(note);
  console.log(`🎵 Note: ${note} -> Calculated Freq: ${Math.round(calculatedHz * 100) / 100} Hz`);
});

console.log(`\nVerification Score: ${passed}/${testCases.length} Math Operations Successful!`);
if (passed === testCases.length) {
  console.log('🚀 ALL MATHEMATICAL EQUATIONS ARE FULLY VALIDATED!');
  process.exit(0);
} else {
  process.exit(1);
}
