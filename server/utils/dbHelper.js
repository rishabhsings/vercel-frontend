import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const MOCK_FILE = path.join(DATA_DIR, 'mock_db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure mock file exists
if (!fs.existsSync(MOCK_FILE)) {
  fs.writeFileSync(MOCK_FILE, JSON.stringify({ users: [], lessons: [] }, null, 2));
}

function readMockDB() {
  try {
    const data = fs.readFileSync(MOCK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mock DB:', error);
    return { users: [], lessons: [] };
  }
}

function writeMockDB(data) {
  try {
    fs.writeFileSync(MOCK_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing mock DB:', error);
  }
}

export const db = {
  // USER FUNCTIONS
  findUserByUsername: async (username) => {
    if (global.useMockDB) {
      const mock = readMockDB();
      return mock.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    } else {
      return await User.findOne({ username });
    }
  },

  findUserById: async (id) => {
    if (global.useMockDB) {
      const mock = readMockDB();
      const user = mock.users.find(u => u._id === id);
      if (user) {
        // Exclude password in returned object
        const { password, ...userWithoutPass } = user;
        return userWithoutPass;
      }
      return null;
    } else {
      return await User.findById(id).select('-password');
    }
  },

  createUser: async ({ username, password }) => {
    if (global.useMockDB) {
      const mock = readMockDB();
      if (mock.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Username already exists');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'usr_' + Math.random().toString(36).substr(2, 9),
        username,
        password: hashedPassword,
        vocalProfile: {
          voiceType: 'Undetermined',
          minFrequency: 0,
          maxFrequency: 0,
          highestNote: '',
          lowestNote: ''
        },
        stats: {
          xp: 0,
          streakDays: 0,
          lastActive: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mock.users.push(newUser);
      writeMockDB(mock);
      const { password: _, ...userWithoutPass } = newUser;
      return userWithoutPass;
    } else {
      const user = new User({ username, password });
      await user.save();
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    }
  },

  updateUser: async (id, updateData) => {
    if (global.useMockDB) {
      const mock = readMockDB();
      const userIdx = mock.users.findIndex(u => u._id === id);
      if (userIdx === -1) return null;
      
      const updatedUser = {
        ...mock.users[userIdx],
        ...updateData,
        // Deep merge sub-documents if provided
        vocalProfile: {
          ...mock.users[userIdx].vocalProfile,
          ...(updateData.vocalProfile || {})
        },
        stats: {
          ...mock.users[userIdx].stats,
          ...(updateData.stats || {})
        },
        updatedAt: new Date().toISOString()
      };
      
      mock.users[userIdx] = updatedUser;
      writeMockDB(mock);
      const { password, ...userWithoutPass } = updatedUser;
      return userWithoutPass;
    } else {
      return await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');
    }
  },

  verifyUserPassword: async (candidatePassword, user) => {
    if (global.useMockDB) {
      return await bcrypt.compare(candidatePassword, user.password);
    } else {
      // If user is a Mongoose document
      if (typeof user.comparePassword === 'function') {
        return await user.comparePassword(candidatePassword);
      }
      // If it's a plain object (e.g. lean query)
      return await bcrypt.compare(candidatePassword, user.password);
    }
  },

  // LESSON FUNCTIONS
  findAllLessons: async () => {
    if (global.useMockDB) {
      const mock = readMockDB();
      return mock.lessons;
    } else {
      return await Lesson.find({});
    }
  },

  findLessonById: async (id) => {
    if (global.useMockDB) {
      const mock = readMockDB();
      return mock.lessons.find(l => l._id === id) || null;
    } else {
      return await Lesson.findById(id);
    }
  },

  createLesson: async (lessonData) => {
    if (global.useMockDB) {
      const mock = readMockDB();
      const newLesson = {
        _id: 'les_' + Math.random().toString(36).substr(2, 9),
        ...lessonData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mock.lessons.push(newLesson);
      writeMockDB(mock);
      return newLesson;
    } else {
      const lesson = new Lesson(lessonData);
      return await lesson.save();
    }
  },

  seedLessons: async (lessonsList) => {
    if (global.useMockDB) {
      const mock = readMockDB();
      mock.lessons = []; // Clear existing for seeding
      lessonsList.forEach(l => {
        mock.lessons.push({
          _id: 'les_' + Math.random().toString(36).substr(2, 9),
          ...l,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      writeMockDB(mock);
      return mock.lessons.length;
    } else {
      await Lesson.deleteMany({});
      const seeded = await Lesson.insertMany(lessonsList);
      return seeded.length;
    }
  }
};
