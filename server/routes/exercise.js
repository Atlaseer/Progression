import express from 'express';
import Exercise from '../models/Exercise.js';

const router = express.Router();

//Create exercise
router.post('/', async (req, res) => {
  try {
    const { name, muscleGroup, equipment, description, pictureUrl } = req.body;

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

//Get exercise by id
router.get('/id/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if(!exercise) return res.status(404).json({ message: 'Exercise not found' })
    res.status(200).json(exercise);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


//Update an exercise by ID
router.put('/:id', async (req, res) => {
  try {
    const {name, muscleGroup, equipment, description, pictureUrl } = req.body;

    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { name, muscleGroup, equipment, description, pictureUrl },
      { new: true, runValidators: true }
    );

    if(!updatedExercise) return res.status(404).json({ error: 'Exercise not found' })

    res.status(200).json({ message: 'Exercise updated', exercise: updatedExercise})
  } catch (err) {
    res.status(500).json({ error: `Failed to update exercise: ${err.message}` })
  }
})

//Delete an exercise by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
        if (!deletedExercise) return res.status(404).json({ error: 'Exercise not found' });

        res.status(200).json({ message: 'Exercise deleted successfully', exercise: deletedExercise });
    } catch (err) {
        res.status(500).json({ error: `Failed to delete exercise: ${err.message}` });
    }
});


export default router;
