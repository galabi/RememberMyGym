import WorkoutPlan from '../models/WorkoutPlan.js';
import express from 'express';
import { GoogleGenAI } from "@google/genai";
import User from '../models/User.js';
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

export default router;