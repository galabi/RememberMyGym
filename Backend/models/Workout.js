const mongoose = require('mongoose');

// Define the Workout schema to track weights for each exercise per user
const workoutSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true 
    },
    exercise_name: { 
        type: String, 
        required: true // Example: 'Bench Press', 'Leg Extension'
    },
    weight: { 
        type: Number, 
        required: true // The weight used in the last session
    },
    sets: { 
        type: Number 
    },
    reps: { 
        type: Number 
    }
}, { 
    timestamps: true // Automatically tracks 'createdAt' and 'updatedAt'
});

// Create an index to make searching for a specific user's exercise faster
workoutSchema.index({ user_id: 1, exercise_name: 1 });

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;