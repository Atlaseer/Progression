import express from 'express';
import Workout from '../models/Workout.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Create a workout tied to the authenticated user
router.post('/', requireAuth, async (req, res) => {
  try {
    const { sets, date, startTime, endTime } = req.body;

    if (!sets || sets.length === 0) {
      return res.status(400).json({ error: 'At least one set is required' });
    }

    const workoutData = { user: req.user.id, sets };
    if (startTime) workoutData.startTime = new Date(startTime);
    if (endTime) workoutData.endTime = new Date(endTime);
    if (date) workoutData.createdAt = new Date(date);

    const workout = new Workout(workoutData);
    await workout.save();

    const populated = await workout.populate('sets.exercise');
    res.status(201).json({ message: 'Workout created', workout: populated });
  } catch (err) {
    res.status(500).json({ error: `Failed to create workout: ${err.message}` });
  }
});

// Get workouts for the authenticated user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id })
      .populate('sets.exercise')
      .sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch workouts: ${err.message}` });
  }
});

// Get workouts for a specific user by ID
router.get('/user/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.params.userId })
      .populate('sets.exercise')
      .sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch workouts: ${err.message}` });
  }
});

// Update a workout (only the owner)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    if (workout.user.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });

    const { sets, date, startTime, endTime } = req.body;
    if (sets && sets.length > 0) workout.sets = sets;
    if (startTime) workout.startTime = new Date(startTime);
    if (endTime) workout.endTime = new Date(endTime);
    if (date) workout.createdAt = new Date(date);

    await workout.save();
    const populated = await workout.populate('sets.exercise');
    res.json({ message: 'Workout updated', workout: populated });
  } catch (err) {
    res.status(500).json({ error: `Failed to update workout: ${err.message}` });
  }
});

// Delete a workout (only the owner)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    if (workout.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await workout.deleteOne();
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ error: `Failed to delete workout: ${err.message}` });
  }
});

export default router;
