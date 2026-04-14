require('dotenv').config();
const express = require('express');
const { connectDB, getDbStatus } = require('./DataBase');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const planWorkoutRoutes = require('./routes/workoutPlanerRoutes').default;
const cors = require('cors');
const protect = require('./middleware/auth');
const API_IP = process.env.API_IP || 'localhost';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({// Allow requests from any origin
    origin: API_BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); 


connectDB();
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  const db = getDbStatus();
  const httpStatus = db === 'connected' ? 200 : 503;
  res.status(httpStatus).json({ server: 'up', database: db });
});

// Apply auth to everything except login, register, and health
const PUBLIC_ROUTES = ['POST /api/users/login', 'POST /api/users/register'];
app.use((req, res, next) => {
    if (PUBLIC_ROUTES.includes(`${req.method} ${req.path}`)) return next();
    return protect(req, res, next);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/planer', planWorkoutRoutes); 


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://${API_IP}:${PORT}`);
});