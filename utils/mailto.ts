import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Linking, Platform } from 'react-native';

interface MailtoOptions {
  /** Email recipient */
  to: string;
  /** Email subject */
  subject?: string;
  /** Email body */
  body?: string;
  /** Whether to include device info */
  includeDeviceInfo?: boolean;
  /** Additional device info to include */
  additionalInfo?: Record<string, string>;
}

/**
 * Generate and open a mailto link with optional device information
 * Commonly used across support and feedback screens
 */
export async function openMailto(options: MailtoOptions): Promise<boolean> {
  const { to, subject = '', body = '', includeDeviceInfo = true, additionalInfo = {} } = options;

  let emailBody = body;

  // Append device info if requested
  if (includeDeviceInfo) {
    const appVersion = Constants.expoConfig?.version || '1.0.0';
    const platform = Platform.OS;
    const osVersion = Device.osVersion || 'Unknown';

    const deviceInfo = [`App Version: ${appVersion}`, `Platform: ${platform}`, `OS Version: ${osVersion}`, ...Object.entries(additionalInfo).map(([key, value]) => `${key}: ${value}`)].join('\n');

    emailBody = emailBody ? `${emailBody}\n\n---\nDevice Information:\n${deviceInfo}` : `---\nDevice Information:\n${deviceInfo}\n\n---\nPlease describe your issue below:\n\n`;
  }

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(emailBody);
  const url = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      throw new Error('Email client not available');
    }

    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get formatted device info string
 */
export function getDeviceInfo(): string {
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const platform = Platform.OS;
  const osVersion = Device.osVersion || 'Unknown';

  return [`App Version: ${appVersion}`, `Platform: ${platform}`, `OS Version: ${osVersion}`].join('\n');
}
