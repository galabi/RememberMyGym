const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/exercises/user/:user_id
// @desc    Get all exercises for a user
router.get('/user/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findById(user_id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user.exercises || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/exercises/add
// @desc    Add an exercise to user's list
router.post('/add', async (req, res) => {
    try {
        const { user_id, exercise_name, muscle_group } = req.body;
        
        if (!user_id || !exercise_name || !muscle_group) {
            return res.status(400).json({ 
                message: 'user_id, exercise_name, and muscle_group are required' 
            });
        }
        
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if exercise already exists
        const exerciseExists = user.exercises.some(ex => ex.name === exercise_name);
        if (exerciseExists) {
            return res.status(400).json({ message: 'Exercise already added' });
        }
        
        // Add new exercise
        user.exercises.push({
            name: exercise_name,
            muscleGroup: muscle_group
        });
        
        await user.save();
        res.status(201).json({ message: 'Exercise added successfully', exercises: user.exercises });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/exercises/remove
// @desc    Remove an exercise from user's list
router.post('/remove', async (req, res) => {
    try {
        const { user_id, exercise_name } = req.body;
        
        if (!user_id || !exercise_name) {
            return res.status(400).json({ 
                message: 'user_id and exercise_name are required' 
            });
        }
        
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove exercise
        user.exercises = user.exercises.filter(ex => ex.name !== exercise_name);
        
        await user.save();
        res.json({ message: 'Exercise removed successfully', exercises: user.exercises });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/exercises/addPlan
// @desc    Add an exercises to user's workout plan
router.post('/addPlan', async (req, res) => {
    try {
        const { user_id, exercises} = req.body;

                if (!user_id || !exercises || !Array.isArray(exercises)) {
            return res.status(400).json({ 
                message: 'user_id and exercises are required' 
            });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let addedCount = 0;
        for (const exercise of exercises) {
            const { name, bodyPart } = exercise;

            // Check if exercise already exists
            const exerciseExists = user.exercises.some(ex => ex.name === name);
            if (exerciseExists) {
                continue; // Skip if exercise already exists
            }
            
            // Add new exercise
            user.exercises.push({
                name: name,
                muscleGroup: bodyPart
            });
            addedCount++;
        }
        
        await user.save();
        res.status(201).json({ 
            message: `Successfully added ${addedCount} new exercises`, 
            exercises: user.exercises 
        });
    } catch (error) {
        res.status(500).json({
            message: "Workout didn't save", 
            error: error.message 
        });    
    }
});

module.exports = router;
