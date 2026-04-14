const mongoose = require('mongoose');

let dbStatus = 'disconnected';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    dbStatus = 'connected';
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      dbStatus = 'disconnected';
      console.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      dbStatus = 'error';
      console.error('MongoDB error:', err.message);
    });

    mongoose.connection.on('reconnected', () => {
      dbStatus = 'connected';
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    dbStatus = 'error';
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const getDbStatus = () => dbStatus;

module.exports = { connectDB, getDbStatus };