
import { openDatabaseAsync } from 'expo-sqlite';

export const dbPromise = openDatabaseAsync('db.db');

async function setupDatabaseAsync() {
    const db = await dbPromise;
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY NOT NULL, theme TEXT, notifications INTEGER);
    `);
    const row = await db.getFirstAsync('SELECT * FROM settings WHERE id = 0');
    if (!row) {
        await db.runAsync('INSERT INTO settings (id, theme, notifications) VALUES (0, ?, ?)', 'system', 0);
    }
}

setupDatabaseAsync();
