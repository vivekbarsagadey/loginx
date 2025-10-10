/**
 * About Info Configuration
 * Centralized app information and contact data
 */

import type { AppInfoItem, ContactItem } from '@/types/about-info';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

/**
 * Get app information items
 * @returns Array of app info items with current app data
 */
export function getAppInfoItems(): AppInfoItem[] {
  const appName = Constants.expoConfig?.extra?.appName || 'LoginX';
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const appBuildNumber = Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber || '100',
    android: Constants.expoConfig?.android?.versionCode?.toString() || '100',
    default: '100',
  });
  const platformName = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web';

  return [
    { icon: 'smartphone', label: 'App Name', value: appName },
    { icon: 'tag', label: 'Version', value: appVersion },
    { icon: 'hash', label: 'Build Number', value: appBuildNumber },
    { icon: 'code', label: 'Platform', value: platformName },
  ];
}

/**
 * Get contact information items
 * @param handleLinkPress - Function to handle opening URLs
 * @returns Array of contact items with actions
 */
export function getContactItems(handleLinkPress: (url: string) => void): ContactItem[] {
  return [
    {
      icon: 'mail',
      label: 'Email',
      value: 'vivek@whizit.co.in',
      action: () => handleLinkPress('mailto:vivek@whizit.co.in'),
    },
    {
      icon: 'globe',
      label: 'Website',
      value: 'whizit.co.in',
      action: () => handleLinkPress('https://whizit.co.in'),
    },
    {
      icon: 'github',
      label: 'GitHub',
      value: 'vivekbarsagadey/loginx',
      action: () => handleLinkPress('https://github.com/vivekbarsagadey/loginx'),
    },
  ];
}

/**
 * Helper function to open URL
 * @param url - URL to open
 */
export function openURL(url: string): void {
  Linking.openURL(url);
}
