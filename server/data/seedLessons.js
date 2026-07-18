import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { db } from '../utils/dbHelper.js';

dotenv.config();

const lessons = [
  {
    title: "Swar 'Sa' - The Foundation",
    description: "Learn to sing the fundamental base note 'Sa' (C4) steady and strong. The foundation of Hindustani and Western music.",
    category: "Pitch Matching",
    targetNotes: [
      { note: "C4", frequency: 261.63, durationSec: 3 }
    ],
    xpReward: 100,
    difficulty: "Beginner"
  },
  {
    title: "Swar 'Re' - Climbing Up",
    description: "Ascend to the second note 'Re' (D4). Focus on moving smoothly and holding the pitch steady.",
    category: "Pitch Matching",
    targetNotes: [
      { note: "D4", frequency: 293.66, durationSec: 3 }
    ],
    xpReward: 120,
    difficulty: "Beginner"
  },
  {
    title: "Swar 'Ga' - The Third Step",
    description: "Train your voice to hit the bright 'Ga' (E4) pitch. Keep your chest relaxed and throat open.",
    category: "Pitch Matching",
    targetNotes: [
      { note: "E4", frequency: 329.63, durationSec: 3 }
    ],
    xpReward: 130,
    difficulty: "Beginner"
  },
  {
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
    title: "Steady 'Pa' - The Anchor",
    description: "Align your posture and sing the stable dominant fifth note 'Pa' (G4). Essential for building vocal strength.",
    category: "Pitch Matching",
    targetNotes: [
      { note: "G4", frequency: 392.00, durationSec: 4 }
    ],
    xpReward: 150,
    difficulty: "Intermediate"
  },
  {
    title: "Deep Hum Warmup",
    description: "A resonant chest hum at a lower pitch 'G3' (196.00 Hz) to warm up the vocal cords and stimulate resonance.",
    category: "Vocal Warmup",
    targetNotes: [
      { note: "G3", frequency: 196.00, durationSec: 4 }
    ],
    xpReward: 100,
    difficulty: "Beginner"
  },
  {
    title: "Swar 'Ma' - The Half Step",
    description: "Perfect the semitone interval from 'Ga' to 'Ma' (F4) at 349.23 Hz.",
    category: "Pitch Matching",
    targetNotes: [
      { note: "F4", frequency: 349.23, durationSec: 3 }
    ],
    xpReward: 140,
    difficulty: "Beginner"
  }
];

const seed = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    global.useMockDB = true;
    console.log('No MONGODB_URI found. Seeding in Mock JSON mode...');
  } else {
    try {
      await mongoose.connect(mongoURI);
      global.useMockDB = false;
      console.log('Connected to MongoDB. Seeding in Database mode...');
    } catch (err) {
      console.log('MongoDB connection failed. Seeding in Mock JSON mode...');
      global.useMockDB = true;
    }
  }

  try {
    const count = await db.seedLessons(lessons);
    console.log(`Successfully seeded ${count} lessons!`);
  } catch (error) {
    console.error('Error seeding lessons:', error);
  } finally {
    if (!global.useMockDB) {
      await mongoose.connection.close();
    }
    process.exit(0);
  }
};

seed();
