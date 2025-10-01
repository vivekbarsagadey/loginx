/**
 * Validation constants for forms and user input
 * Centralized validation rules to maintain consistency
 */

export const ValidationConstants = {
  // Password rules
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_REGEX: /^[a-zA-Z0-9@$!%*?&]*$/,

  // Name rules
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,

  // Email rules
  EMAIL_MAX_LENGTH: 254,

  // Age rules
  MIN_AGE: 13,
  MAX_AGE: 120,

  // Phone rules
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,

  // General text rules
  TEXT_SHORT_MAX: 100,
  TEXT_MEDIUM_MAX: 500,
  TEXT_LONG_MAX: 2000,
} as const;

export const ValidationMessages = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${ValidationConstants.PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_TOO_LONG: `Password must not exceed ${ValidationConstants.PASSWORD_MAX_LENGTH} characters`,
  PASSWORD_INVALID_CHARS: 'Password contains invalid characters',
  NAME_TOO_SHORT: `Name must be at least ${ValidationConstants.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name must not exceed ${ValidationConstants.NAME_MAX_LENGTH} characters`,
  AGE_TOO_LOW: `You must be at least ${ValidationConstants.MIN_AGE} years old`,
  AGE_TOO_HIGH: `Age must not exceed ${ValidationConstants.MAX_AGE} years`,
  INVALID_PHONE: 'Please enter a valid phone number',
} as const;
