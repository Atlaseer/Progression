import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  reps: { type: Number },
  weight: { type: Number },
  duration: { type: Number }, // in seconds, for things like planks
  distance: { type: Number }, // in meters, for things like running
});

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sets: [setSchema],
  createdAt: { type: Date, default: Date.now },
});

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
