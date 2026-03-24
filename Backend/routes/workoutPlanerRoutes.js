import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const router = express.Router();

const workoutSchema = z.object({
  exercises: z.array(z.object({
    name: z.string().describe("Name of the exercise."),
    sets: z.number().describe("Number of sets for the exercise."),
    reps: z.number().describe("Number of repetitions for the exercise."),
    bodyPart: z.string().describe("The body part targeted by the exercise."),

  })).describe("A list of exercises for the workout plan.")
});
const jsonSchema = zodToJsonSchema(workoutSchema);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview", 
    generationConfig: {
        responseMimeType: "application/json",
        responseJsonSchema: jsonSchema,
    }
});

// @route   POST /api/planer/generate
// @desc    Generate a workout plan based on user preferences
router.post('/generate', async (req, res) => {
    try {
        const {gender, age, duration, targetArea, environment} = req.body;

        if (!duration || !targetArea || !environment) {
            return res.status(400).json({ message: "Missing required fields: duration, targetArea, or environment" });
        }
        const prompt = `Generate a workout plan based on the following user preferences: gender: ${gender}, age: ${age}, duration: ${duration} minutes, target area: ${targetArea}, environment: ${environment}. The workout plan should include a list of exercises with the name of the exercise, number of sets, and number of repetitions for each exercise.for each exercise set the body Part name to one of the following: 'Chest', 'Back', 'Arms', 'Legs', 'Glutes', 'Core'`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json(JSON.parse(text));
    } catch (err) {
        res.status(500).json({ message: "Error generating workout plan", error: err.message });
    }
});


export default router;