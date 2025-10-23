import i18n from '@/i18n';
import * as MailComposer from 'expo-mail-composer';
import { Linking, Platform } from 'react-native';
import { logger } from './logger-production';

/**
 * Support contact configuration
 */
export const SUPPORT_CONFIG = {
  email: 'support@loginx.app',
  subject: 'LoginX Support Request',
  helpUrl: 'https://loginx.app/help',
  faqUrl: 'https://loginx.app/faq',
} as const;

/**
 * Error context for support emails
 */
export interface ErrorContext {
  errorCode?: string;
  errorMessage?: string;
  timestamp?: string;
  platform?: string;
  appVersion?: string;
  userId?: string;
}

/**
 * Check if device can send email
 */
export async function canSendEmail(): Promise<boolean> {
  try {
    return await MailComposer.isAvailableAsync();
  } catch (error: unknown) {
    logger.error('Error checking email availability', error as Error);
    return false;
  }
}

/**
 * Format error context for email body
 */
function formatErrorContext(context?: ErrorContext): string {
  if (!context) {
    return '';
  }

  const sections: string[] = ['\n\n--- Error Details ---'];

  if (context.errorCode) {
    sections.push(`Error Code: ${context.errorCode}`);
  }
  if (context.errorMessage) {
    sections.push(`Error Message: ${context.errorMessage}`);
  }
  if (context.timestamp) {
    sections.push(`Timestamp: ${context.timestamp}`);
  }
  if (context.platform) {
    sections.push(`Platform: ${context.platform}`);
  }
  if (context.appVersion) {
    sections.push(`App Version: ${context.appVersion}`);
  }
  if (context.userId) {
    sections.push(`User ID: ${context.userId}`);
  }

  sections.push('--- End Error Details ---');

  return sections.join('\n');
}

/**
 * Compose and send support email with error context
 *
 * @param subject - Email subject (defaults to generic support request)
 * @param errorContext - Optional error details to include
 * @returns Success status
 */
export async function contactSupport(
  subject?: string,
  errorContext?: ErrorContext
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if email is available
    const emailAvailable = await canSendEmail();

    if (!emailAvailable) {
      // Fallback to opening email app with mailto link
      const emailSubject = encodeURIComponent(subject || SUPPORT_CONFIG.subject);
      const emailBody = encodeURIComponent(
        `Please describe your issue:\n\n${formatErrorContext(errorContext)}`
      );
      const mailto = `mailto:${SUPPORT_CONFIG.email}?subject=${emailSubject}&body=${emailBody}`;

      const canOpen = await Linking.canOpenURL(mailto);
      if (canOpen) {
        await Linking.openURL(mailto);
        return { success: true };
      }

      return {
        success: false,
        error: i18n.t('errors.support.emailNotConfigured'),
      };
    }

    // Compose email with expo-mail-composer
    const emailBody = `Please describe your issue:\n\n${formatErrorContext(errorContext)}`;

    const result = await MailComposer.composeAsync({
      recipients: [SUPPORT_CONFIG.email],
      subject: subject || SUPPORT_CONFIG.subject,
      body: emailBody,
    });

    if (result.status === 'sent') {
      return { success: true };
    }

    if (result.status === 'cancelled') {
      return {
        success: false,
        error: i18n.t('errors.support.emailCancelled'),
      };
    }

    return {
      success: false,
      error: i18n.t('errors.support.emailFailed'),
    };
  } catch (error: unknown) {
    logger.error('Error contacting support', error as Error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : i18n.t('errors.support.emailFailed'),
    };
  }
}

/**
 * Open help center in browser
 */
export async function openHelpCenter(): Promise<void> {
  try {
    const canOpen = await Linking.canOpenURL(SUPPORT_CONFIG.helpUrl);
    if (canOpen) {
      await Linking.openURL(SUPPORT_CONFIG.helpUrl);
    } else {
      logger.error('Cannot open help center URL');
    }
  } catch (error: unknown) {
    logger.error('Error opening help center', error as Error);
  }
}

/**
 * Open FAQ page in browser
 */
export async function openFAQ(): Promise<void> {
  try {
    const canOpen = await Linking.canOpenURL(SUPPORT_CONFIG.faqUrl);
    if (canOpen) {
      await Linking.openURL(SUPPORT_CONFIG.faqUrl);
    } else {
      logger.error('Cannot open FAQ URL');
    }
  } catch (error: unknown) {
    logger.error('Error opening FAQ', error as Error);
  }
}

/**
 * Get current error context for support
 */
export function getErrorContextForSupport(_error: unknown): ErrorContext {
  const context: ErrorContext = {
    timestamp: new Date().toISOString(),
    platform: Platform.OS,
  };

  // Extract error code if available
  if (
    typeof _error === 'object' &&
    __error !== null &&
    'code' in error &&
    typeof (_error as { code: unknown }).code === 'string'
  ) {
    context.errorCode = (_error as { code: string }).code;
  }

  // Extract error message
  if (_error instanceof Error) {
    context.errorMessage = error.message;
  } else if (typeof _error === 'string') {
    context.errorMessage = error;
  }

  return context;
}
