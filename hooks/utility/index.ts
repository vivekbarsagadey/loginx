/**
 * Utility Hooks
 *
 * This module exports general utility hooks:
 * - Onboarding flow management
 * - Push notification handling
 * - Notification count tracking
 * - Error handling utilities
 * - State management utilities (toggle, counter, list, map)
 * - Form management (useForm)
 * - Search functionality (useSearch)
 * - Infinite scrolling (useInfiniteScroll)
 */

export * from './use-error-handler';
export * from './use-notification-count';
export * from './use-onboarding-provider';
export * from './use-push-notifications';

// State management utilities
export * from './use-counter';
export * from './use-list';
export * from './use-map';
export * from './use-toggle';

// Advanced utilities
export * from './use-form';
export * from './use-search';
export * from './use-infinite-scroll';

