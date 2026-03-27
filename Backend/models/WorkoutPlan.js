const e = require('express');
const mongoose = require('mongoose');

// Define the Workout schema to track weights for each exercise per user
const workoutPlanSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true 
    },
    workout_index: {
        type: Number,
        required: true // To differentiate between multiple workouts for the same user
    },
    workout_name: {
        type: String,
        required: true // Example: 'Monday Workout', 'Leg Day'
    },
    body_part: {
        type: String,
        enum: ['Chest', 'Back', 'Arms', 'Legs', 'Glutes', 'Core'],
        required: true
    },
    exercise_name: { 
        type: String, 
        required: true // Example: 'Bench Press', 'Leg Extension'
    },
    sets: { 
        type: Number, 
        required: true
    },
    reps: { 
        type: Number ,
        required: true
    }
}, { 
    timestamps: true // Automatically tracks 'createdAt' and 'updatedAt'
});

// Create an index to make searching for a specific user's exercise faster
workoutPlanSchema.index({ user_id: 1, workout_index: 1 });

const WorkoutPlan = mongoose.model('Workout_Plan', workoutPlanSchema);
module.exports = WorkoutPlan;