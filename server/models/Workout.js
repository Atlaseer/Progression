import mongoose from 'mongoose';
import setSchema  from './Set.js';

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sets: [setSchema], //Reusable schema
  createdAt: { type: Date, default: Date.now },
});

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
