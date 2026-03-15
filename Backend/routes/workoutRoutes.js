const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// @route   POST /api/workouts/log
// @desc    Add or update weight for a specific exercise
router.post('/log', async (req, res) => {
    const { user_id, exercise_name, weight, sets, reps } = req.body;

    // Basic validation to ensure required fields are present
    if (!user_id || !exercise_name || weight === undefined) {
        return res.status(400).json({ message: "Missing required fields: user_id, exercise_name, or weight" });
    }

    try {
        // Use findOneAndUpdate with upsert:true to update existing exercise or create a new one
        // This ensures the user always sees their LATEST record for each machine
        const workout = await Workout.findOneAndUpdate(
            { user_id, exercise_name }, 
            { 
                weight, 
                sets, 
                reps,
                updatedAt: Date.now() // Manually force update timestamp if needed
            }, 
            { new: true, upsert: true } 
        );
        res.status(200).json(workout);
    } catch (err) {
        res.status(400).json({ message: "Error saving workout data", error: err.message });
    }
});

// @route   GET /api/workouts/:userId
// @desc    Get all saved weights for a specific user
router.get('/:userId', async (req, res) => {
    try {
        // Fetching workouts for a specific user and sorting by most recent update
        const workouts = await Workout.find({ user_id: req.params.userId })
            .sort({ updatedAt: -1 });
            
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching workouts", error: err.message });
    }
});

module.exports = router;