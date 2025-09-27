
import { dbPromise } from '@/database';
import { Setting, Theme } from '@/types/setting';

export const getSettings = async (): Promise<Setting | null> => {
    const db = await dbPromise;
    return await db.getFirstAsync<Setting>('SELECT * FROM settings WHERE id = 0');
}

export const saveSettings = async (settings: {
    theme: Theme;
    pushEnabled: boolean;
    emailUpdates: boolean;
    marketingTips: boolean;
}) => {
    const db = await dbPromise;
    return await db.runAsync(
        'INSERT OR REPLACE INTO settings (id, theme, pushEnabled, emailUpdates, marketingTips) VALUES (0, ?, ?, ?, ?)',
        settings.theme,
        settings.pushEnabled ? 1 : 0,
        settings.emailUpdates ? 1 : 0,
        settings.marketingTips ? 1 : 0
    );
}
