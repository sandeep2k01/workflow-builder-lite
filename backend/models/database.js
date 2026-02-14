/**
 * SQLite database initialization using sql.js (pure JavaScript, no native deps).
 * 
 * Why SQLite:
 *  - No external database server needed
 *  - Runs with one command (Docker-friendly)
 *  - Sufficient for storing the last 5 workflow runs
 *  - Easily swappable for PostgreSQL/MongoDB in production
 * 
 * Why sql.js instead of better-sqlite3:
 *  - Pure JavaScript — no native compilation or build tools required
 *  - Works identically across all platforms (Windows, Linux, macOS)
 *  - Ideal for a demo app where portability matters
 */

const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');
const logger = require('../utils/logger');

const DB_PATH = path.join(__dirname, '..', 'data', 'workflow.db');

let db = null;
let dbReady = null; // Promise that resolves when DB is initialized

/**
 * Initializes the database. Must be called once at startup.
 * Returns a promise that resolves to the db instance.
 */
async function initDatabase() {
    if (db) return db;

    // Ensure data directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const SQL = await initSqlJs();

    // Load existing database file if it exists, otherwise create new
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
        logger.info('Database', `Loaded existing database from ${DB_PATH}`);
    } else {
        db = new SQL.Database();
        logger.info('Database', `Created new database at ${DB_PATH}`);
    }

    // Create tables
    db.run(`
    CREATE TABLE IF NOT EXISTS workflow_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      input_text TEXT NOT NULL,
      selected_steps TEXT NOT NULL,
      results TEXT NOT NULL,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Persist to disk
    saveToFile();

    return db;
}

/**
 * Returns the database instance. Throws if not initialized.
 */
function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return db;
}

/**
 * Persists the in-memory database to disk.
 * Called after every write operation.
 */
function saveToFile() {
    if (!db) return;
    try {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    } catch (error) {
        logger.error('Database', 'Failed to persist database to disk', error);
    }
}

/**
 * Checks if the database is accessible.
 * Used by the health check endpoint.
 */
function isHealthy() {
    try {
        const result = getDatabase().exec('SELECT 1 AS ok');
        return result.length > 0 && result[0].values[0][0] === 1;
    } catch {
        return false;
    }
}

module.exports = { initDatabase, getDatabase, saveToFile, isHealthy };
