const mongoose = require('mongoose');

// Define the Measurement schema to track user body measurements
const measurementSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    weight: { 
        type: Number,
        required: true // in kg
    },
    height: { 
        type: Number // in cm
    },
    bodyFatPercentage: { 
        type: Number // in %
    }
}, { 
    timestamps: true // Automatically tracks 'createdAt' and 'updatedAt'
});

// Create an index for quick user lookup
measurementSchema.index({ user_id: 1 });

const Measurement = mongoose.model('Measurement', measurementSchema);
module.exports = Measurement;
