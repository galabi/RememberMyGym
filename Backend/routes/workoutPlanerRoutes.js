import express from 'express';
import { GoogleGenAI } from "@google/genai";
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
        const {gender, age, duration, targetArea, environment} = req.body;

        if (!duration || !targetArea || !environment) {
            return res.status(400).json({ message: "Missing required fields: duration, targetArea, or environment" });
        }
        
        const prompt = `Generate a workout plan based on the following user preferences: gender: ${gender}, age: ${age}, duration: ${duration} minutes, target area: ${targetArea}, environment: ${environment}. 
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


export default router;