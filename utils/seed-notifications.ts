/**
 * Seed sample notifications for testing
 * This is for development/demo purposes only
 */

import { addNotification } from './notification-storage';

export async function seedSampleNotifications() {
  const sampleNotifications = [
    {
      type: 'security' as const,
      title: 'New Login Detected',
      message: "A new login was detected from Chrome on Windows. If this wasn't you, please secure your account immediately.",
    },
    {
      type: 'success' as const,
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated.',
    },
    {
      type: 'info' as const,
      title: 'Welcome to LoginX',
      message: 'Thank you for joining! Explore the app and customize your experience in settings.',
    },
    {
      type: 'warning' as const,
      title: 'Password Expiring Soon',
      message: 'Your password will expire in 7 days. Consider changing it to maintain account security.',
    },
    {
      type: 'promotion' as const,
      title: 'New Feature Available',
      message: 'Try our new biometric authentication for faster and more secure login!',
    },
  ];

  for (const notif of sampleNotifications) {
    await addNotification(notif);
    // Add small delay to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
