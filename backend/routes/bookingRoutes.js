
const express = require('express');
const router = express.Router();

// This imports your direct connectDB function from db.js
const connectDB = require('../config/db');

// ==========================================
// 1. CREATE A NEW RESERVATION (POST)
// ==========================================
router.post('/', async (req, res) => {
    const { user_id, resource_id, start_time, end_time } = req.body;

    if (!user_id || !resource_id || !start_time || !end_time) {
        return res.status(400).json({ error: 'Missing required configuration parameters.' });
    }

    try {
        const db = await connectDB();

        // Check for scheduling conflicts (Double-booking protection)
        const conflict = await db.get(`
            SELECT * FROM reservations 
            WHERE resource_id = ? 
            AND (
                (start_time <= ? AND end_time > ?) OR
                (start_time < ? AND end_time >= ?) OR
                (? <= start_time AND ? > start_time)
            )
        `, [resource_id, start_time, start_time, end_time, end_time, start_time, end_time]);

        if (conflict) {
            return res.status(409).json({ error: 'Conflict detected: This space is already occupied during your selected time frames.' });
        }

        // Insert booking into SQLite database
        await db.run(`
            INSERT INTO reservations (user_id, resource_id, start_time, end_time)
            VALUES (?, ?, ?, ?)
        `, [user_id, resource_id, start_time, end_time]);

        res.status(201).json({ message: 'Reservation securely confirmed and committed!' });
    } catch (err) {
        console.error('❌ Database Write Failure:', err.message);
        res.status(500).json({ error: 'Internal server database transaction error.' });
    }
});

// ==========================================
// 2. GET ALL RESERVATIONS WITH ROOM NAMES (GET)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const db = await connectDB();
        
        // Join reservations with resources to fetch clear room names instead of just IDs
        const bookings = await db.all(`
            SELECT 
                reservations.*, 
                resources.name AS resource_name 
            FROM reservations
            JOIN resources ON reservations.resource_id = resources.id
            ORDER BY reservations.created_at DESC
        `);
        
        res.status(200).json(bookings);
    } catch (err) {
        console.error('❌ Failed to fetch ledger:', err.message);
        res.status(500).json({ error: 'Database network failure while retrieving ledger logs.' });
    }
});

// ==========================================
// 3. TERMINATE / CANCEL A RESERVATION (DIRECT FIX)
// ==========================================
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await connectDB();
        
        // 1. Check if the target reservation actually exists
        const booking = await db.get('SELECT * FROM reservations WHERE id = ?', [id]);
        if (!booking) {
            return res.status(404).json({ error: 'Target reservation record not found.' });
        }

        // 2. Run a direct DELETE command without nested transactions
        await db.run('DELETE FROM reservations WHERE id = ?', [id]);
        
        console.log(`🗑️ Reservation ID ${id} successfully removed from SQLite.`);
        res.status(200).json({ message: 'Reservation vector successfully terminated.' });
    } catch (err) {
        console.error('❌ Direct Termination Failure:', err.message);
        res.status(500).json({ error: `Database termination error: ${err.message}` });
    }
});

module.exports = router;