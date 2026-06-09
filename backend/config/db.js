// backend/config/db.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db = null;

async function connectDB() {
    if (db) return db;

    try {
        // This opens (or creates) a local file called 'booking.db' inside backend/database/
        db = await open({
            filename: path.join(__dirname, '../database/booking.db'),
            driver: sqlite3.Database
        });

        console.log('✅ SQLite Database connected successfully (booking.db)!');

        // Turn on Foreign Key support in SQLite (disabled by default)
        await db.run('PRAGMA foreign_keys = ON');

        // Automatically build the tables if they don't exist yet
        await initializeTables(db);

        return db;
    } catch (err) {
        console.error('❌ Database connection/initialization failed:', err.message);
        throw err;
    }
}

async function initializeTables(database) {
    // 1. Users Table
    await database.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 2. Resources Table
    await database.exec(`
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            capacity INTEGER DEFAULT 1,
            is_available INTEGER DEFAULT 1 -- 1 for True, 0 for False
        );
    `);

    // 3. Reservations Table
    await database.exec(`
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            resource_id INTEGER NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
        );
    `);

    // =======================================================================
    // ADDED CODE: Seed a sample user if users table is empty
    // This gives your React app a valid User ID (1) to bypass the foreign key block!
    // =======================================================================
    const userCount = await database.get('SELECT COUNT(*) as count FROM users');
        if (userCount.count === 0) {
        await database.run(`
            INSERT INTO users (id, name, email, password) VALUES 
            (1, 'User One', 'user1@example.com', 'placeholder'),
            (2, 'User Two', 'user2@example.com', 'placeholder'),
            (3, 'User Three', 'user3@example.com', 'placeholder'),
            (4, 'User Four', 'user4@example.com', 'placeholder');
        `);
        console.log('🌱 Database seeded with initial sample users (IDs: 1, 2, 3, 4)!');
    }

    // Seed sample data if resources table is empty
    const count = await database.get('SELECT COUNT(*) as count FROM resources');
    if (count.count === 0) {
        await database.exec(`
            INSERT INTO resources (name, description, capacity) VALUES 
            ('Meeting Room 1', 'Equipped with TV and whiteboard', 8),
            ('Meeting Room 2', 'Equipped with whiteboard and projector', 10),
            ('Meeting Room 1 & 2 (Conference Room)', 'Combined mega-space with whiteboard and TV', 20),
            ('TV Area', 'Comfortable collaborative lounge with TV and sofa layout', 10),
            ('TV 1', 'Compact focus space with 1 desk and 3 seats', 3),
            ('TV 2', 'Dynamic open space layout for standing meetings', 5);
        `);
        console.log('🌱 Database successfully seeded with your new workspace assets!');
    }

    try {
        await database.run('PRAGMA foreign_keys = OFF;');
        await database.run('DELETE FROM reservations;');
        await database.run('PRAGMA foreign_keys = ON;');
        console.log('🧹 Success: All locked legacy reservations have been completely cleared!');
    } catch (cleanError) {
        console.log('Note: Clean-up skipped or table not ready yet.');
    }
}

// Export a function that resolves to our database instance
module.exports = connectDB;