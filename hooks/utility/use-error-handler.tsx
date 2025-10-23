import i18n from '@/i18n';
import { contactSupport, getErrorContextForSupport } from '@/utils/contact-support';
import { getErrorInfo, isFatalError } from '@/utils/error';
import { logger } from '@/utils/logger-production';
import { useCallback, useState } from 'react';

export interface ErrorDisplay {
  title: string;
  message: string;
  isFatal: boolean;
  visible: boolean;
}

/**
 * Hook for handling errors with optional fatal error support
 * Provides error display state and actions for retry and contact support
 */
export function useErrorHandler() {
  const [errorDisplay, setErrorDisplay] = useState<ErrorDisplay>({
    title: '',
    message: '',
    isFatal: false,
    visible: false,
  });

  /**
   * Display an error to the user
   */
  const showError = useCallback((error: unknown) => {
    const errorInfo = getErrorInfo(error);
    const fatal = isFatalError(error);

    setErrorDisplay({
      title: errorInfo.title,
      message: errorInfo.message,
      isFatal: fatal,
      visible: true,
    });

    // Log error for debugging
    logger.error('Error displayed to user', {
      title: errorInfo.title,
      message: errorInfo.message,
      isFatal: fatal,
      error: error,
    });
  }, []);

  /**
   * Clear the error display
   */
  const clearError = useCallback(() => {
    setErrorDisplay((prev) => ({ ...prev, visible: false }));
  }, []);

  /**
   * Handle contact support for fatal errors
   */
  const handleContactSupport = useCallback(
    async (error: unknown) => {
      const errorContext = getErrorContextForSupport(error);
      const result = await contactSupport(i18n.t('errors.support.contactButton'), errorContext);

      if (!result.success && result.error) {
        // Show error if email composition failed
        showError(new Error(result.error));
      }
    },
    [showError]
  );

  return {
    errorDisplay,
    showError,
    clearError,
    handleContactSupport,
  };
}
