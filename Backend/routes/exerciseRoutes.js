const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all exercises for a user
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

// Add an exercise to user's list
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

// Remove an exercise from user's list
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

module.exports = router;
