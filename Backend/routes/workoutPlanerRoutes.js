const WorkoutPlan = require('../models/WorkoutPlan');
const express = require('express');
const { GoogleGenAI } = require("@google/genai");
const User = require('../models/User');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const router = express.Router();

const workoutSchema = {
    type: "object",
    properties: {
        exercises: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Name of the exercise" },
                    sets: { type: "integer", description: "Number of sets" },
                    reps: { type: "integer", description: "Number of reps" },
                    bodyPart: {
                        type: "string",
                        enum: ['Chest', 'Back', 'Arms', 'Legs', 'Glutes', 'Core'],
                        description: "Targeted body part"
                    }
                },
                required: ["name", "sets", "reps", "bodyPart"]
            }
        }
    },
    required: ["exercises"]
};


const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// @route   POST /api/planer/generate
// @desc    Generate a workout plan based on user preferences
router.post('/generate', async (req, res) => {
    try {
        const {userid ,duration, targetArea, environment} = req.body;
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!duration || !targetArea || !environment) {
            return res.status(400).json({ message: "Missing required fields: duration, targetArea, or environment" });
        }

        const prompt = `Generate a workout plan based on the following user preferences: gender: ${user.gender}, age: ${user.age}, duration: ${duration} minutes, target area: ${targetArea}, environment: ${environment}. 
                        IMPORTANT RULE: If an exercise is time-based (like Plank), put the time required in the 'name' field and set 'reps' to 1.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents:prompt,
            config : {
                systemInstruction: "You are a professional fitness coach.",
                responseMimeType: "application/json",
                responseJsonSchema: workoutSchema,
                temperature: 0.1,
            }
        });
        
        const workoutData = JSON.parse(response.text);

        res.status(200).json(workoutData);
    } catch (err) {
        res.status(500).json({ message: "Error generating workout plan", error: err.message });
    }
});

// @route   POST /api/planer/save
// @desc    Save a complete workout group (multiple exercises) for a user
router.post('/save', async (req, res) => {
    try {
        const { user_id, exercises } = req.body;

        if (!user_id || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
            return res.status(400).json({ 
                message: 'user_id and a non-empty exercises array are required' 
            });
        }


        const lastExerciseRecord = await WorkoutPlan.findOne({ user_id })
            .sort({ workout_index: -1 }) 
            .select('workout_index')
            .lean();

        const nextIndex = lastExerciseRecord ? lastExerciseRecord.workout_index + 1 : 1;

        const workoutDocuments = exercises.map(ex => ({
            user_id: user_id,
            workout_index: nextIndex,
            body_part: ex.bodyPart,
            workout_name: `Workout ${nextIndex}`,
            exercise_name: ex.name,
            sets: ex.sets,
            reps: ex.reps
        }));

        const savedExercises = await WorkoutPlan.insertMany(workoutDocuments);

        res.status(201).json({ 
            message: 'Workout group saved successfully', 
            workout_index: nextIndex,
            total_exercises_saved: savedExercises.length
        });

    } catch (error) {
        console.error("Error saving workout group:", error);
        res.status(500).json({ 
            message: "Failed to save the workout group", 
            error: error.message 
        });
    }
});

// @route   DELETE /api/planer/:userId/:workoutIndex
// @desc    Delete all exercises of a saved workout plan by index
router.delete('/:userId/:workoutIndex', async (req, res) => {
    try {
        const { userId, workoutIndex } = req.params;
        const result = await WorkoutPlan.deleteMany({ user_id: userId, workout_index: Number(workoutIndex) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Workout plan not found' });
        }
        res.status(200).json({ message: 'Workout plan deleted successfully' });
    } catch (error) {
        console.error("Error deleting workout plan:", error);
        res.status(500).json({ message: "Failed to delete workout plan", error: error.message });
    }
});

// @route   GET /api/planer/:userId
// @desc    Get all saved workout plans for a user, grouped by workout_index
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const exercises = await WorkoutPlan.find({ user_id: userId })
            .sort({ workout_index: -1, createdAt: 1 })
            .lean();

        if (!exercises.length) {
            return res.status(200).json([]);
        }

        // Group by workout_index
        const grouped = {};
        for (const ex of exercises) {
            const idx = ex.workout_index;
            if (!grouped[idx]) {
                grouped[idx] = {
                    workout_index: idx,
                    workout_name: ex.workout_name,
                    createdAt: ex.createdAt,
                    exercises: []
                };
            }
            grouped[idx].exercises.push({
                exercise_name: ex.exercise_name,
                body_part: ex.body_part,
                sets: ex.sets,
                reps: ex.reps
            });
        }

        const plans = Object.values(grouped).sort((a, b) => b.workout_index - a.workout_index);
        res.status(200).json(plans);

    } catch (error) {
        console.error("Error fetching workout plans:", error);
        res.status(500).json({ message: "Failed to fetch workout plans", error: error.message });
    }
});

module.exports = router;