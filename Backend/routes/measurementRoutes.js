const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Measurement = require('../models/Measurement');

// Get latest measurements for a user
router.get('/latest/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const objectId = mongoose.Types.ObjectId.isValid(user_id) ? new mongoose.Types.ObjectId(user_id) : user_id;
        const measurement = await Measurement.findOne({ user_id: objectId }).sort({ createdAt: -1 }).lean();
        
        if (!measurement) {
            return res.json({ 
                weight: null, 
                height: null, 
                bodyFatPercentage: null 
            });
        }
        
        res.json(measurement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Save or update measurements for a user
router.post('/log', async (req, res) => {
    try {
        const { user_id, weight, height, bodyFatPercentage } = req.body;
        
        if (!user_id || !weight) {
            return res.status(400).json({ message: 'user_id and weight are required' });
        }
        if (weight <= 0 || isNaN(weight)) {
            return res.status(400).json({ message: 'Invalid weight value' });
        }
        if (height !== undefined && height !== null && (height <= 0 || isNaN(height))) {
            return res.status(400).json({ message: 'Invalid height value' });
        }
        if (bodyFatPercentage !== undefined && bodyFatPercentage !== null && (bodyFatPercentage <= 0 || bodyFatPercentage > 100 || isNaN(bodyFatPercentage))) {
            return res.status(400).json({ message: 'Invalid body fat percentage value' });
        }
        
        const objectId = mongoose.Types.ObjectId.isValid(user_id) ? new mongoose.Types.ObjectId(user_id) : user_id;
        
        const measurement = new Measurement({
            user_id: objectId,
            weight,
            height,
            bodyFatPercentage
        });
        
        const savedMeasurement = await measurement.save();
        res.status(201).json(savedMeasurement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all measurements history for a user
router.get('/history/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const objectId = mongoose.Types.ObjectId.isValid(user_id) ? new mongoose.Types.ObjectId(user_id) : user_id;
        const measurements = await Measurement.find({ user_id: objectId }).sort({ createdAt: -1 });
        res.json(measurements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
