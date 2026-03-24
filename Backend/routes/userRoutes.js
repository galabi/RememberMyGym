const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');


// @route   GET /api/users/:userid
// @desc    Get a single user by their MongoDB _id
router.get('/id/:userid', async (req, res) => {
    try {
        const user = await User.findById(req.params.userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error finding user", error: err.message });
    }
});

// @route   GET /api/users/username/:username
// @desc    Get a single user by their username
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error finding user", error: err.message });
    }
});

// @route   POST /api/users
// @desc    Create a new user with email
router.post('/', async (req, res) => {
    const user = new User({
        full_name: req.body.full_name,
        email: req.body.email, // Added email field
        birth_date: req.body.birth_date,
        username: req.body.username,
        password: req.body.password,
        gender: req.body.gender
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: "Error creating user", error: err.message });
    }
});

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

// @route   patch /api/users/update/username
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

module.exports = router;