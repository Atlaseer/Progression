import express from 'express';
import Exercise from '../models/Exercise.js';

const router = express.Router();

//Create exercise
router.post('/', async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    await newExercise.save();
    res.status(201).json({ message: 'Exercise created!', exercise: newExercise });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
