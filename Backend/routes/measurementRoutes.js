const express = require('express');
const router = express.Router();
const Measurement = require('../models/Measurement');

// Get latest measurements for a user
router.get('/latest/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const measurement = await Measurement.findOne({ user_id }).sort({ createdAt: -1 });
        
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
        if(weight <= 0 || (!Number.isInteger(weight) && Number.isNaN(weight))) {
            return res.status(400).json({ message: 'Invalid weight value' });
        }
        if(Number.isNaN(height) && (height <= 0 || (!Number.isInteger(height) && Number.isNaN(height)))) {
            return res.status(400).json({ message: 'Invalid height value' });
        }
        if(Number.isNaN(bodyFatPercentage) && (bodyFatPercentage <= 0 || bodyFatPercentage > 100 || !Number.isInteger(bodyFatPercentage))) {
            return res.status(400).json({ message: 'Invalid body fat percentage value' });
        }
        const measurement = new Measurement({
            user_id,
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
        const measurements = await Measurement.find({ user_id }).sort({ createdAt: -1 });
        res.json(measurements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
