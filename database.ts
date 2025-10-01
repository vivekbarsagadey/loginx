import { openDatabaseAsync } from 'expo-sqlite';

let dbInitialized = false;
let dbInitPromise: Promise<void> | null = null;

export const dbPromise = openDatabaseAsync('db.db');

/**
 * Initialize the database schema and default data
 * This is called automatically on import but can be called manually if needed
 */
async function setupDatabaseAsync(): Promise<void> {
  if (dbInitialized) {
    return;
  }

  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = (async () => {
    try {
      const db = await dbPromise;

      // Enable WAL mode for better concurrency
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY NOT NULL, 
          theme TEXT, 
          notifications INTEGER
        );
      `);

      // Initialize default settings if not exists
      const row = await db.getFirstAsync('SELECT * FROM settings WHERE id = 0');
      if (!row) {
        await db.runAsync('INSERT INTO settings (id, theme, notifications) VALUES (0, ?, ?)', 'system', 0);
      }

      dbInitialized = true;
      console.log('[Database] Initialization complete');
    } catch (error) {
      console.error('[Database] Initialization error:', error);
      throw new Error('Failed to initialize database: ' + (error as Error).message);
    }
  })();

  return dbInitPromise;
}

/**
 * Ensure database is initialized before use
 * Call this before any database operations
 */
export const ensureDbInitialized = async (): Promise<void> => {
  await setupDatabaseAsync();
};

// Start initialization on import, but don't block
setupDatabaseAsync().catch((err) => {
  console.error('[Database] Failed to initialize on startup:', err);
});
