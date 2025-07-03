import express from 'express';
import Exercise from '../models/Exercise.js';

const router = express.Router();

//Create exercise
router.post('/', async (req, res) => {
  try {
    const { name, muscleGroup, equipment, description, pictureUrl } = (req.body);

    if (!name || !muscleGroup) return res.status(400).json({ error: "Name and musclegroup are required" });

    const newExercise = new Exercise({
      name, 
      muscleGroup, 
      equipment, 
      description, 
      pictureUrl
    })

    await newExercise.save();
    res.status(201).json({ message: 'Exercise created!', exercise: newExercise });

  } catch (err) {
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

//Get all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercises' })
  }
})


router.delete('/', async (req, res) => {

})

export default router;
