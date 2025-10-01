/**
 * Accessibility constants and roles for React Native components
 * Provides consistent accessibility labels and roles throughout the app
 */

export const AccessibilityRoles = {
  BUTTON: 'button',
  LINK: 'link',
  TEXT: 'text',
  HEADER: 'header',
  IMAGE: 'image',
  IMAGE_BUTTON: 'imagebutton',
  SEARCH: 'search',
  ADJUSTABLE: 'adjustable',
  SWITCH: 'switch',
  TAB: 'tab',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  MENU: 'menu',
  MENU_ITEM: 'menuitem',
  PROGRESS_BAR: 'progressbar',
  SLIDER: 'slider',
  SPINBUTTON: 'spinbutton',
  SUMMARY: 'summary',
  TOOLBAR: 'toolbar',
} as const;

export const AccessibilityStates = {
  DISABLED: { disabled: true },
  SELECTED: { selected: true },
  CHECKED: { checked: true },
  BUSY: { busy: true },
  EXPANDED: { expanded: true },
} as const;

export const AccessibilityTraits = {
  BUTTON: ['button'],
  LINK: ['link'],
  HEADER: ['header'],
  IMAGE: ['image'],
  SELECTED: ['selected'],
  DISABLED: ['disabled'],
  ADJUSTABLE: ['adjustable'],
  SEARCH_FIELD: ['search'],
} as const;

/**
 * Common accessibility hints for better screen reader experience
 */
export const AccessibilityHints = {
  BUTTON_TAP: 'Double tap to activate',
  LINK_TAP: 'Double tap to open',
  INPUT_EDIT: 'Double tap to edit',
  TOGGLE: 'Double tap to toggle',
  NAVIGATE: 'Double tap to navigate',
  CLOSE: 'Double tap to close',
  BACK: 'Double tap to go back',
  SUBMIT: 'Double tap to submit',
  CANCEL: 'Double tap to cancel',
} as const;
