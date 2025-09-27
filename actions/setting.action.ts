
import { dbPromise } from '@/database';
import { Setting, Theme } from '@/types/setting';

export const getSettings = async (): Promise<Setting | null> => {
    const db = await dbPromise;
    return await db.getFirstAsync<Setting>('SELECT * FROM settings WHERE id = 0');
}

export const saveSettings = async (theme: Theme, notifications: boolean) => {
    const db = await dbPromise;
    return await db.runAsync(
        'INSERT OR REPLACE INTO settings (id, theme, notifications) VALUES (0, ?, ?)',
        theme,
        notifications ? 1 : 0
    );
}
