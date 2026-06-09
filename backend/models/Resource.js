
const connectDB = require('../config/db');

const Resource = {
    // Get all resources that are marked as available
    getAll: async () => {
        const db = await connectDB();
        return await db.all('SELECT * FROM resources WHERE is_available = 1');
    },

    // Get a single resource by its ID
    getById: async (id) => {
        const db = await connectDB();
        return await db.get('SELECT * FROM resources WHERE id = ?', [id]);
    }
};

module.exports = Resource;