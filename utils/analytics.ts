/**
 * Analytics tracking utility for user interactions and events
 */

export enum AnalyticsEvent {
  // Empty State Events
  EMPTY_STATE_VIEW = 'empty_state_view',
  EMPTY_STATE_CTA_CLICK = 'empty_state_cta_click',

  // Error Events
  ERROR_OCCURRED = 'error_occurred',
  ERROR_RECOVERY_ATTEMPTED = 'error_recovery_attempted',

  // Form Events
  FORM_STARTED = 'form_started',
  FORM_COMPLETED = 'form_completed',
  FORM_ABANDONED = 'form_abandoned',
  FORM_VALIDATION_ERROR = 'form_validation_error',

  // Search Events
  SEARCH_PERFORMED = 'search_performed',
  SEARCH_RESULT_CLICKED = 'search_result_clicked',

  // User Actions
  FEATURE_USED = 'feature_used',
  SETTING_CHANGED = 'setting_changed',
}

export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Log an analytics event
 * @param event - Event name
 * @param params - Event parameters
 */
export function logAnalyticsEvent(event: AnalyticsEvent, params?: AnalyticsEventParams): void {
  if (__DEV__) {
    // In development, log analytics events
    // eslint-disable-next-line no-console
    console.log('[Analytics]', event, params);
  }

  // TODO: Integrate with actual analytics service (Firebase Analytics, Amplitude, etc.)
  // Example: analytics().logEvent(event, params);
}

/**
 * Log empty state view
 * @param screenName - Name of the screen showing empty state
 * @param emptyStateType - Type of empty state (items, notifications, search, etc.)
 */
export function logEmptyStateView(screenName: string, emptyStateType: string): void {
  logAnalyticsEvent(AnalyticsEvent.EMPTY_STATE_VIEW, {
    screen_name: screenName,
    empty_state_type: emptyStateType,
  });
}

/**
 * Log empty state CTA click
 * @param screenName - Name of the screen
 * @param emptyStateType - Type of empty state
 * @param ctaLabel - Label of the CTA button clicked
 */
export function logEmptyStateCTAClick(screenName: string, emptyStateType: string, ctaLabel: string): void {
  logAnalyticsEvent(AnalyticsEvent.EMPTY_STATE_CTA_CLICK, {
    screen_name: screenName,
    empty_state_type: emptyStateType,
    cta_label: ctaLabel,
  });
}

/**
 * Log error occurrence
 * @param errorType - Type/category of error
 * @param errorCode - Error code
 * @param screenName - Screen where error occurred
 */
export function logErrorOccurrence(errorType: string, errorCode: string, screenName?: string): void {
  logAnalyticsEvent(AnalyticsEvent.ERROR_OCCURRED, {
    error_type: errorType,
    error_code: errorCode,
    screen_name: screenName,
  });
}

/**
 * Log error recovery attempt
 * @param errorType - Type of error
 * @param recoveryAction - Action taken to recover
 */
export function logErrorRecovery(errorType: string, recoveryAction: string): void {
  logAnalyticsEvent(AnalyticsEvent.ERROR_RECOVERY_ATTEMPTED, {
    error_type: errorType,
    recovery_action: recoveryAction,
  });
}

/**
 * Log form event
 * @param formName - Name of the form
 * @param event - Type of form event
 * @param additionalParams - Additional parameters
 */
export function logFormEvent(formName: string, event: 'started' | 'completed' | 'abandoned' | 'validation_error', additionalParams?: AnalyticsEventParams): void {
  const eventMap = {
    started: AnalyticsEvent.FORM_STARTED,
    completed: AnalyticsEvent.FORM_COMPLETED,
    abandoned: AnalyticsEvent.FORM_ABANDONED,
    validation_error: AnalyticsEvent.FORM_VALIDATION_ERROR,
  };

  logAnalyticsEvent(eventMap[event], {
    form_name: formName,
    ...additionalParams,
  });
}

/**
 * Log search event
 * @param searchQuery - Search query text
 * @param resultsCount - Number of results found
 * @param screenName - Screen where search occurred
 */
export function logSearchPerformed(searchQuery: string, resultsCount: number, screenName: string): void {
  logAnalyticsEvent(AnalyticsEvent.SEARCH_PERFORMED, {
    search_query: searchQuery,
    results_count: resultsCount,
    screen_name: screenName,
  });
}

/**
 * Log feature usage
 * @param featureName - Name of the feature used
 * @param screenName - Screen where feature was used
 * @param additionalParams - Additional parameters
 */
export function logFeatureUsed(featureName: string, screenName: string, additionalParams?: AnalyticsEventParams): void {
  logAnalyticsEvent(AnalyticsEvent.FEATURE_USED, {
    feature_name: featureName,
    screen_name: screenName,
    ...additionalParams,
  });
}

/**
 * Set user properties for analytics
 * @param properties - User properties to set
 */
export function setAnalyticsUserProperties(properties: AnalyticsEventParams): void {
  if (__DEV__) {
    // In development, log user properties
    // eslint-disable-next-line no-console
    console.log('[Analytics] User Properties:', properties);
  }

  // TODO: Integrate with actual analytics service
  // Example: analytics().setUserProperties(properties);
}
