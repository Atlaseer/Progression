import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  muscleGroup: {
    type: [String],
    required: true,
  },
  equipment: {
    type: String,
    default: 'none', //Dumbbell, barbell, machine
  },
  description: {
    type: String,
  },
  pictureUrl: {
    type: String, //Link to picture
  }
});

export default mongoose.model('Exercise', exerciseSchema);
