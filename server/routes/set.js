import express from 'express';
import Set from '../models/Set.js';

const router = express.Router();

//Create a new set
router.post('/', async (req, res) => {
  try {
    const { exercise, reps, duration, distance, weight, rest } = req.body;

    if (!exercise) return res.status(400).json({ error: 'Exercise is required' });

    const newSet = new Set({ exercise, reps, duration, distance, weight, rest });
    await newSet.save();

    res.status(201).json({ message: 'Set created', set: newSet });
  } catch (err) {
    res.status(500).json({ error: `Failed to create set: ${err.message}` });
  }
});

//Get all sets
router.get('/', async (req, res) => {
  try {
    const sets = await Set.find().populate('exercise');
    res.json(sets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sets' });
  }
});

//Get a set by ID
router.get('/:id', async (req, res) => {
  try {
    const set = await Set.findById(req.params.id).populate('exercise');
    if (!set) return res.status(404).json({ error: 'Set not found' });
    res.json(set);
  } catch (err) {
    res.status(500).json({ error: `Error getting set: ${err.message}` });
  }
});

//Update a set by ID
router.put('/:id', async (req, res) => {
  try {
    const { exercise, reps, duration, distance, weight, rest } = req.body;

    const updatedSet = await Set.findByIdAndUpdate(
      req.params.id,
      { exercise, reps, duration, distance, weight, rest },
      { new: true, runValidators: true }
    );

    if (!updatedSet) return res.status(404).json({ error: 'Set not found' });

    res.json({ message: 'Set updated', set: updatedSet });
  } catch (err) {
    res.status(500).json({ error: `Failed to update set: ${err.message}` });
  }
});

//Delete a set by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSet = await Set.findByIdAndDelete(req.params.id);
    if (!deletedSet) return res.status(404).json({ error: 'Set not found' });

    res.json({ message: 'Set deleted', set: deletedSet });
  } catch (err) {
    res.status(500).json({ error: `Failed to delete set: ${err.message}` });
  }
});

export default router;
