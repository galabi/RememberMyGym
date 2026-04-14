const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');



// @route   DELETE /api/users/:id
// @desc    Delete a user by MongoDB _id
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found for deletion" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error during deletion", error: err.message });
    }
});

// @route   POST /api/users/login
// @desc    Authenticate user with email or username (case-insensitive)
router.post('/login', async (req, res) => {
    const { credential, password } = req.body; // credential can be email or username

    try {
        // Try to find user by email first, then by username (case-insensitive for username)
        const user = await User.findOne({
            $or: [
                { email: credential.toLowerCase() },
                { username: { $regex: '^' + credential + '$', $options: 'i' } }
            ]
        }).select('+password'); // Include password for authentication
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ message: "Invalid email/username or password" });
        }
        
        res.json({ message: "Login successful", user: { id: user._id, name: user.full_name } });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// @route   patch /api/users/update/password
// @desc    Update user password
router.patch('/update/password/', async (req, res) => {
    const {oldPassword, newPassword, userId } = req.body;
    try {
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.correctPassword(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
        
});

// @route   patch /api/users/update/username/:id
// @desc    Update user username
router.patch('/update/username/:id', async (req, res) => {
    const { newUsername } = req.body;

    try {
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.username = newUsername;
        await user.save();
        res.status(200).json({ message: "Username updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
        
});

// @route   post /api/users/register
// @desc    Register user with email and password
router.post('/register', async (req, res) => {
    const { full_name, username, email, password} = req.body;

    try{
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({ message: "User with this username already exists" });
        }
        if (existingEmail) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newUser = new User({
            full_name,
            username,
            email,
            password
        });
        await newUser.save();
        res.status(201).json({ 
            message: "User created successfully", 
            user: { 
                id: newUser._id, 
                name: newUser.full_name 
            } 
        });    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// @route   patch /api/users/complete-registration/:id
// @desc    Complete user registration with additional details
router.patch('/complete-registration/:id', async (req, res) => {
    const { birth_date, gender } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.birth_date = birth_date;
        user.gender = gender;
        await user.save();
        res.status(200).json({ message: "Registration completed successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
        
});

module.exports = router;