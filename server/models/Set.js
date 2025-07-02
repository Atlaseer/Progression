import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId, //Reference to Exercise
    ref: 'Exercise',
    required: true
  },
    reps: Number,
    duration: Number,
    distance: Number,
    weight: Number,
    rest: Number
}, { timestamps: true });

const Set = mongoose.model('Set', setSchema);
export default Set;
