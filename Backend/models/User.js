const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Updated User schema with email field
const userSchema = new mongoose.Schema({
    full_name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    birth_date: { 
        type: String 
    },
    username: { 
        type: String, 
        required: true, 
        lowercase: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true,
        select: false
    },
    gender: { 
        type: String,
        enum: ['male', 'female', 'other'] 
    },
    exercises: [
        {
            name: String,
            muscleGroup: String
        }
    ]
}, { 
    timestamps: true 
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model('User', userSchema);
module.exports = User;