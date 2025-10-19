import { useCallback, useState } from 'react';
import { Platform, Share as RNShare, ShareAction } from 'react-native';

/**
 * Content to share
 */
export interface ShareContent {
  /** Message or text to share */
  message?: string;
  /** URL to share */
  url?: string;
  /** Title for the share dialog (Android only) */
  title?: string;
  /** Files to share (not supported on all platforms) */
  files?: string[];
}

/**
 * Share options
 */
export interface ShareOptions {
  /** Dialog title (Android) */
  dialogTitle?: string;
  /** Subject for email sharing (iOS) */
  subject?: string;
  /** Exclude certain activities (iOS) */
  excludedActivityTypes?: string[];
  /** Callback on successful share */
  onSuccess?: (action: ShareAction) => void;
  /** Callback on share error */
  onError?: (error: Error) => void;
  /** Callback when share is dismissed */
  onDismiss?: () => void;
}

/**
 * Share result
 */
export interface ShareResult {
  /** Whether the share was successful */
  success: boolean;
  /** Action taken (iOS only) */
  action?: string;
  /** Activity type (iOS only) */
  activityType?: string;
  /** Error if share failed */
  error?: Error;
}

/**
 * Return type for useShare hook
 */
export interface UseShareReturn {
  /** Share content */
  share: (content: ShareContent, options?: ShareOptions) => Promise<ShareResult>;
  /** Whether share is available on this platform */
  canShare: boolean;
  /** Whether share operation is in progress */
  isSharing: boolean;
  /** Error from last share operation */
  error: Error | null;
  /** Last share result */
  lastResult: ShareResult | null;
}

/**
 * Hook for native share functionality
 *
 * @example
 * ```typescript
 * const { share, canShare, isSharing } = useShare();
 *
 * // Share text
 * const handleShareText = async () => {
 *   const result = await share({
 *     message: 'Check out this amazing app!',
 *   });
 *   if (result.success) {
 *     console.log('Shared successfully');
 *   }
 * };
 *
 * // Share URL
 * const handleShareUrl = async () => {
 *   await share({
 *     message: 'Visit our website',
 *     url: 'https://example.com',
 *   });
 * };
 *
 * // Share with custom title (Android)
 * const handleShareWithTitle = async () => {
 *   await share(
 *     {
 *       message: 'Share this content',
 *       title: 'My App',
 *     },
 *     {
 *       dialogTitle: 'Share via',
 *     }
 *   );
 * };
 *
 * // Share with callbacks
 * const handleShareWithCallbacks = async () => {
 *   await share(
 *     { message: 'Hello!' },
 *     {
 *       onSuccess: (action) => console.log('Shared:', action),
 *       onError: (error) => console.error('Error:', error),
 *       onDismiss: () => console.log('Dismissed'),
 *     }
 *   );
 * };
 * ```
 *
 * @returns Object with share functions and state
 */
export function useShare(): UseShareReturn {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<ShareResult | null>(null);

  // Check if share is available
  const canShare = true; // React Native Share API is available on all platforms

  /**
   * Share content using native share dialog
   */
  const share = useCallback(
    async (content: ShareContent, options: ShareOptions = {}): Promise<ShareResult> => {
      const { dialogTitle, subject, excludedActivityTypes, onSuccess, onError, onDismiss } =
        options;

      setIsSharing(true);
      setError(null);

      try {
        // Validate content
        if (!content.message && !content.url) {
          throw new Error('Either message or url must be provided');
        }

        // Prepare share options
        const shareOptions: any = {
          message: content.message,
          url: content.url,
          title: content.title,
        };

        // Platform-specific options
        if (Platform.OS === 'android') {
          if (dialogTitle) {
            shareOptions.dialogTitle = dialogTitle;
          }
        } else if (Platform.OS === 'ios') {
          if (subject) {
            shareOptions.subject = subject;
          }
          if (excludedActivityTypes && excludedActivityTypes.length > 0) {
            shareOptions.excludedActivityTypes = excludedActivityTypes;
          }
        }

        // Perform share
        const result = await RNShare.share(shareOptions);

        let shareResult: ShareResult;

        if (result.action === RNShare.sharedAction) {
          // Successfully shared
          shareResult = {
            success: true,
            action: result.action,
            activityType: result.activityType,
          };

          if (onSuccess) {
            onSuccess(result.action);
          }
        } else if (result.action === RNShare.dismissedAction) {
          // User dismissed the share dialog
          shareResult = {
            success: false,
            action: result.action,
          };

          if (onDismiss) {
            onDismiss();
          }
        } else {
          // Unknown action
          shareResult = {
            success: false,
          };
        }

        setLastResult(shareResult);
        setIsSharing(false);
        return shareResult;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Failed to share content');
        setError(errorObj);

        const shareResult: ShareResult = {
          success: false,
          error: errorObj,
        };

        if (onError) {
          onError(errorObj);
        }

        setLastResult(shareResult);
        setIsSharing(false);
        return shareResult;
      }
    },
    []
  );

  return {
    share,
    canShare,
    isSharing,
    error,
    lastResult,
  };
}

/**
 * Predefined share templates for common scenarios
 */
export const ShareTemplates = {
  /**
   * Share app invite
   */
  appInvite: (appName: string, appUrl: string): ShareContent => ({
    message: `Check out ${appName}! ${appUrl}`,
    url: appUrl,
    title: `Invite to ${appName}`,
  }),

  /**
   * Share referral code
   */
  referral: (code: string, message?: string): ShareContent => ({
    message: message || `Use my referral code: ${code}`,
    title: 'Referral Code',
  }),

  /**
   * Share achievement
   */
  achievement: (achievement: string, message?: string): ShareContent => ({
    message: message || `I just achieved: ${achievement}`,
    title: 'Achievement',
  }),

  /**
   * Share content link
   */
  contentLink: (title: string, url: string, description?: string): ShareContent => ({
    message: description ? `${title}\n\n${description}\n\n${url}` : `${title}\n\n${url}`,
    url,
    title,
  }),
};
