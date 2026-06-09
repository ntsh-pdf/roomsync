
const Booking = require('../models/Booking');

// Create a reservation with strict anti-double-booking checks
exports.createBooking = async (req, res) => {
    const { user_id, resource_id, start_time, end_time } = req.body;

    // Simple validation rule checking for missing items
    if (!user_id || !resource_id || !start_time || !end_time) {
        return res.status(400).json({ error: 'All fields (user_id, resource_id, start_time, end_time) are required.' });
    }

    try {
        // 1. Check if anyone else has booked this resource during this block
        const overlappingBookings = await Booking.checkOverlap(resource_id, start_time, end_time);
        
        if (overlappingBookings.length > 0) {
            return res.status(409).json({ error: 'Conflict: This resource is already booked during the selected timeframe.' });
        }

        // 2. If free, commit it to the database
        const bookingId = await Booking.create(user_id, resource_id, start_time, end_time);
        
        res.status(201).json({
            message: 'Booking confirmed successfully!',
            bookingId: bookingId
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to complete booking: ' + err.message });
    }
};

// Fetch bookings made by a specific user
exports.getUserBookings = async (req, res) => {
    const { userId } = req.params;

    try {
        const userBookings = await Booking.getByUser(userId);
        res.status(200).json(userBookings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user bookings: ' + err.message });
    }
};