import { type UserProfile } from '@/types/user';
import { validatePassword as validatePasswordStrength } from './password-validator';

// Input sanitization constants
const MAX_INPUT_LENGTH = 500;
const MAX_DISPLAY_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // Per RFC 5321
const MAX_PHONE_LENGTH = 15; // E.164 international format
const MAX_ADDRESS_LENGTH = 200;
const MAX_CITY_LENGTH = 100;
const MAX_STATE_LENGTH = 100;
const MAX_ZIP_CODE_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const MIN_VALID_AGE = 0;
const MAX_VALID_AGE = 150;

/**
 * Sanitize user input to prevent XSS and injection attacks
 * Removes or escapes potentially dangerous characters
 * @param input - Raw user input string
 * @param maxLength - Maximum allowed length (default MAX_INPUT_LENGTH)
 * @returns Sanitized string
 */
export const sanitizeUserInput = (input: string, maxLength: number = MAX_INPUT_LENGTH): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return (
    input
      .trim()
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove script tags content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Limit length to prevent DoS
      .slice(0, maxLength)
  );
};

/**
 * Sanitize email address
 * @param email - Raw email input
 * @returns Sanitized email
 */
export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') {
    return '';
  }

  return email.toLowerCase().trim().slice(0, MAX_EMAIL_LENGTH);
};

/**
 * Sanitize phone number - remove non-numeric characters
 * @param phone - Raw phone input
 * @returns Sanitized phone (digits only)
 */
export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== 'string') {
    return '';
  }

  return phone.replace(/\D/g, '').slice(0, MAX_PHONE_LENGTH);
};

/**
 * Sanitize user profile data before saving to Firestore
 * @param profile - Partial or full user profile
 * @returns Sanitized user profile
 */
export const sanitizeUserProfile = <T extends Partial<UserProfile>>(profile: T): T => {
  const sanitized = { ...profile };

  // Sanitize string fields
  if (sanitized.displayName) {
    sanitized.displayName = sanitizeUserInput(sanitized.displayName, MAX_DISPLAY_NAME_LENGTH);
  }

  if (sanitized.email) {
    sanitized.email = sanitizeEmail(sanitized.email);
  }

  if (sanitized.address) {
    sanitized.address = sanitizeUserInput(sanitized.address, MAX_ADDRESS_LENGTH);
  }

  if (sanitized.city) {
    sanitized.city = sanitizeUserInput(sanitized.city, MAX_CITY_LENGTH);
  }

  if (sanitized.state) {
    sanitized.state = sanitizeUserInput(sanitized.state, MAX_STATE_LENGTH);
  }

  if (sanitized.zipCode) {
    sanitized.zipCode = sanitizeUserInput(sanitized.zipCode, MAX_ZIP_CODE_LENGTH);
  }

  // Validate age if present
  if (sanitized.age !== undefined) {
    const age = Number(sanitized.age);
    if (isNaN(age) || age < MIN_VALID_AGE || age > MAX_VALID_AGE) {
      sanitized.age = 0;
    }
  }

  // Validate URL if present
  if (sanitized.photoURL) {
    try {
      // Basic URL validation - allow empty string or valid URL
      if (sanitized.photoURL && !sanitized.photoURL.startsWith('http')) {
        sanitized.photoURL = '';
      }
    } catch (error: unknown) {
      sanitized.photoURL = '';
    }
  }

  return sanitized;
};

/**
 * Validate and sanitize password
 * Note: This is for validation only - never store passwords in plain text!
 * @param password - Raw password input
 * @returns Object with isValid flag and message
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (typeof password !== 'string') {
    return { isValid: false, message: 'Password must be a string' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { isValid: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return { isValid: false, message: 'Password is too long' };
  }

  // Use centralized password validator for consistency
  const validation = validatePasswordStrength(password);

  if (!validation.isValid) {
    return {
      isValid: false,
      message: validation.errors[0] || 'Password does not meet requirements',
    };
  }

  return { isValid: true };
};
