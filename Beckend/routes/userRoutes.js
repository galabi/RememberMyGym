const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// @route   GET /api/users
// @desc    Get all users from the database
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
});

// @route   GET /api/users/:username
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

module.exports = router;