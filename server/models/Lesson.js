import mongoose from 'mongoose';

const targetNoteSchema = new mongoose.Schema({
  noteName: {
    type: String,
    required: true,
  },
  frequencyHz: {
    type: Number,
    required: true,
  },
  durationThreshold: {
    type: Number,
    required: true,
  }
}, { _id: false });

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  category: {
    type: String,
    enum: ['Pitch Matching', 'Vocal Range', 'Warmup'],
    required: true,
  },
  targetNotes: {
    type: [targetNoteSchema],
    default: [],
  }
}, {
  timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
