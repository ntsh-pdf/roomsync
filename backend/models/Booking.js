const connectDB = require('../config/db');

const Booking = {
    // Check if a resource is already booked for a specific time range
    checkOverlap: async (resourceId, startTime, endTime) => {
        const db = await connectDB();
        const sql = `
            SELECT * FROM reservations 
            WHERE resource_id = ? 
            AND status = 'confirmed'
            AND (
                (start_time < ? AND end_time > ?)
            )
        `;
        // This logic checks if the new booking starts before an existing one ends
        // AND ends after an existing one starts.
        return await db.all(sql, [resourceId, endTime, startTime]);
    },

    // Create a new reservation record
    create: async (userId, resourceId, startTime, endTime) => {
        const db = await connectDB();
        const sql = `
            INSERT INTO reservations (user_id, resource_id, start_time, end_time) 
            VALUES (?, ?, ?, ?)
        `;
        const result = await db.run(sql, [userId, resourceId, startTime, endTime]);
        return result.lastID; // Returns the ID of the new booking
    },

    // Get all bookings for a specific user
    getByUser: async (userId) => {
        const db = await connectDB();
        const sql = `
            SELECT r.*, res.name as resource_name 
            FROM reservations r
            JOIN resources res ON r.resource_id = res.id
            WHERE r.user_id = ?
            ORDER BY r.start_time DESC
        `;
        return await db.all(sql, [userId]);
    }
};

module.exports = Booking;