require('dotenv').config();
const express = require('express');
const connectDB = require('./DataBase'); 
const userRoutes = require('./routes/userRoutes'); // Import the routes

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(express.json());

// Use the routes
// This tells Express: "Every request that starts with /api/users, send it to userRoutes"
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});