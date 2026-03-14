const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  birth_date: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: String
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);
module.exports = User;