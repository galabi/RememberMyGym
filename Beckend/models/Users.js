const mongoose = require('mongoose');

// Updated User schema with email field
const userSchema = new mongoose.Schema({
    full_name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, // No two users can have the same email
        lowercase: true, // Converts email to lowercase automatically
        trim: true // Removes extra spaces
    },
    birth_date: { 
        type: String 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    gender: { 
        type: String,
        enum: ['male', 'female', 'other'] 
    }
}, { 
    timestamps: true 
});

const User = mongoose.model('User', userSchema);
module.exports = User;