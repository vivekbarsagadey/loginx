/**
 * Data Loader Utilities
 * Helper functions to load and manage data from the data directory
 */

import { getSampleNotifications } from '@/data/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

const SAMPLE_DATA_LOADED_KEY = '@sample_data_loaded';

/**
 * Check if sample data has been loaded before
 */
export async function isSampleDataLoaded(): Promise<boolean> {
  try {
    const loaded = await AsyncStorage.getItem(SAMPLE_DATA_LOADED_KEY);
    return loaded === 'true';
  } catch (error) {
    logger.error('Error checking sample data status:', error);
    return false;
  }
}

/**
 * Mark sample data as loaded
 */
export async function markSampleDataAsLoaded(): Promise<void> {
  try {
    await AsyncStorage.setItem(SAMPLE_DATA_LOADED_KEY, 'true');
  } catch (error) {
    logger.error('Error marking sample data as loaded:', error);
  }
}

/**
 * Load sample notifications into storage
 * Useful for development and testing
 */
export async function loadSampleNotifications(): Promise<void> {
  try {
    const notifications = getSampleNotifications();
    await AsyncStorage.setItem(
      '@notification_history',
      JSON.stringify({
        notifications,
        lastFetch: Date.now(),
      })
    );
    if (__DEV__) {
      logger.info(`Loaded ${notifications.length} sample notifications`);
    }
  } catch (error) {
    logger.error('Error loading sample notifications:', error);
  }
}

/**
 * Initialize sample data on first app launch
 * This can be called during app initialization or onboarding
 */
export async function initializeSampleData(force = false): Promise<void> {
  try {
    const alreadyLoaded = await isSampleDataLoaded();

    if (alreadyLoaded && !force) {
      if (__DEV__) {
        logger.debug('Sample data already loaded, skipping...');
      }
      return;
    }

    if (__DEV__) {
      logger.info('Initializing sample data...');
    }

    // Load sample notifications
    await loadSampleNotifications();

    // Mark as loaded
    await markSampleDataAsLoaded();

    if (__DEV__) {
      logger.info('Sample data initialization complete');
    }
  } catch (error) {
    logger.error('Error initializing sample data:', error);
  }
}

/**
 * Clear all sample data
 * Useful for testing or resetting the app
 */
export async function clearSampleData(): Promise<void> {
  try {
    await AsyncStorage.removeItem('@notification_history');
    await AsyncStorage.removeItem(SAMPLE_DATA_LOADED_KEY);
    if (__DEV__) {
      logger.info('Sample data cleared');
    }
  } catch (error) {
    logger.error('Error clearing sample data:', error);
  }
}

/**
 * Reload sample data
 * Force reload sample data even if already loaded
 */
export async function reloadSampleData(): Promise<void> {
  await clearSampleData();
  await initializeSampleData(true);
}

/**
 * Get notification count from loaded sample data
 */
export async function getSampleNotificationCount(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem('@notification_history');
    if (!data) {
      return 0;
    }
    const parsed = JSON.parse(data);
    return parsed.notifications?.length || 0;
  } catch (error) {
    logger.error('Error getting notification count:', error);
    return 0;
  }
}
