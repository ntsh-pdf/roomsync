// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Import Routes
const resourceRoutes = require('./routes/resourceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// --- UPDATED CORS CONFIGURATION ---
// This tells the server to specifically trust your React frontend
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json()); // Essential for reading incoming JSON req.body data

// Mount API Routes
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
    res.send('Booking System API (SQLite) is fully configured!');
});

const PORT = process.env.PORT || 5000;

// Initialize Database then Start Server
connectDB()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is flying high on port ${PORT}`);
            console.log(`📡 Accepting requests from: http://localhost:5173`);
        });
    })
    .catch(err => {
        console.error("Failed to start server due to database issue:", err);
    });