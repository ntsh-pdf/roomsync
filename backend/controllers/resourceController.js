const Resource = require('../models/Resource');

// Fetch all available rooms/desks
exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.getAll();
        res.status(200).json(resources);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve resources: ' + err.message });
    }
};