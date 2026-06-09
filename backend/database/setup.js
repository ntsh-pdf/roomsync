const connectDB = require('../config/db');

const init = async () => {
    const db = await connectDB();

    console.log("Creating tables...");

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            capacity INTEGER DEFAULT 1,
            is_available BOOLEAN DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            resource_id INTEGER NOT NULL,
            start_time DATETIME NOT NULL,
            end_time DATETIME NOT NULL,
            status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
        );

        -- Add sample data if table is empty
        INSERT INTO resources (name, description, capacity) 
        SELECT 'Conference Room A', 'Equipped with projector', 10
        WHERE NOT EXISTS (SELECT 1 FROM resources);
    `);

    console.log("✅ Database and tables created successfully!");
    process.exit();
};

init().catch(err => {
    console.error("❌ Setup failed:", err);
    process.exit(1);
});