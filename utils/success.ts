// Global success handler callback (set by root component)
let globalSuccessHandler: ((title: string, message: string, onOk?: () => void) => void) | null = null;

/**
 * Set the global success handler (called from root component)
 */
export const setGlobalSuccessHandler = (handler: (title: string, message: string, onOk?: () => void) => void) => {
  globalSuccessHandler = handler;
};

export const showSuccess = (title: string, message: string, onOk?: () => void) => {
  if (globalSuccessHandler) {
    globalSuccessHandler(title, message, onOk);
  } else {
    // Fallback to console if no handler is set (development only)
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(`[${title}] ${message}`);
    }
    if (onOk) {
      onOk();
    }
  }
};
