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
        let { user_id, weight, height, bodyFatPercentage } = req.body;
        
        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required' });
        }

        const objectId = mongoose.Types.ObjectId.isValid(user_id) ? new mongoose.Types.ObjectId(user_id) : user_id;
        
        const lastRecord = await Measurement.findOne({ user_id: objectId }).sort({ createdAt: -1 });
        weight = weight || (lastRecord ? lastRecord.weight : null);
        height = height || (lastRecord ? lastRecord.height : null);
        bodyFatPercentage = bodyFatPercentage || (lastRecord ? lastRecord.bodyFatPercentage : null);

        if (weight < 0 || isNaN(weight)) {
            return res.status(400).json({ message: 'Invalid weight value' });
        }
        if (height < 0) {
            return res.status(400).json({ message: 'Invalid height value' });
        }
        if (bodyFatPercentage < 0 || bodyFatPercentage > 100 ) {
            return res.status(400).json({ message: 'Invalid body fat percentage value' });
        }
                
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
