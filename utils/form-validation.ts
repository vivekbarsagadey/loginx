/**
 * Form validation utilities
 * Centralized validation logic for common form fields
 */

import { ValidationConstants, ValidationMessages } from '@/constants/validation';
import i18n from '@/i18n';
import { sanitizeEmail, sanitizeUserInput } from './sanitize';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email address
 * @param email - Email to validate
 * @returns Validation result with error message if invalid
 */
export function validateEmailField(email: string): ValidationResult {
  const sanitized = sanitizeEmail(email);

  if (!sanitized) {
    return {
      isValid: false,
      error: i18n.t('errors.validation.invalidEmail'),
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return {
      isValid: false,
      error: i18n.t('errors.validation.invalidEmail'),
    };
  }

  return { isValid: true };
}

/**
 * Validate display name
 * @param name - Display name to validate
 * @returns Validation result with error message if invalid
 */
export function validateDisplayNameField(name: string): ValidationResult {
  const sanitized = sanitizeUserInput(name.trim());

  if (!sanitized) {
    return {
      isValid: false,
      error: i18n.t('errors.validation.emptyDisplayName'),
    };
  }

  if (sanitized.length < ValidationConstants.NAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: ValidationMessages.NAME_TOO_SHORT,
    };
  }

  if (sanitized.length > ValidationConstants.NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: ValidationMessages.NAME_TOO_LONG,
    };
  }

  return { isValid: true };
}

/**
 * Validate age
 * @param age - Age string to validate
 * @returns Validation result with error message if invalid
 */
export function validateAgeField(age: string): ValidationResult {
  if (!age) {
    return { isValid: true }; // Optional field
  }

  const ageNum = parseInt(age, 10);

  if (isNaN(ageNum)) {
    return {
      isValid: false,
      error: i18n.t('errors.validation.invalidAge'),
    };
  }

  if (ageNum < ValidationConstants.MIN_AGE) {
    return {
      isValid: false,
      error: ValidationMessages.AGE_TOO_LOW,
    };
  }

  if (ageNum > ValidationConstants.MAX_AGE) {
    return {
      isValid: false,
      error: ValidationMessages.AGE_TOO_HIGH,
    };
  }

  return { isValid: true };
}

/**
 * Validate zip code
 * @param zipCode - Zip code to validate
 * @returns Validation result with error message if invalid
 */
export function validateZipCodeField(zipCode: string): ValidationResult {
  if (!zipCode) {
    return { isValid: true }; // Optional field
  }

  const sanitized = sanitizeUserInput(zipCode.trim());

  if (sanitized.length > 0 && sanitized.length < 5) {
    return {
      isValid: false,
      error: i18n.t('errors.validation.zipCodeTooShort'),
    };
  }

  return { isValid: true };
}

/**
 * Validate phone number (basic validation)
 * @param phone - Phone number to validate
 * @returns Validation result with error message if invalid
 */
export function validatePhoneField(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: true }; // Optional field
  }

  const sanitized = phone.trim();

  // Basic phone validation - at least 10 digits
  const phoneRegex = /^\+?[\d\s()-]{10,}$/;
  if (!phoneRegex.test(sanitized)) {
    return {
      isValid: false,
      error: i18n.t('errors.validation.invalidPhone'),
    };
  }

  return { isValid: true };
}

/**
 * Validate required field (non-empty)
 * @param value - Value to validate
 * @param fieldName - Name of field for error message
 * @returns Validation result with error message if invalid
 */
export function validateRequiredField(value: string, fieldName = 'Field'): ValidationResult {
  const sanitized = sanitizeUserInput(value.trim());

  if (!sanitized) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
}

/**
 * Validate text with minimum length
 * @param text - Text to validate
 * @param minLength - Minimum required length
 * @param fieldName - Name of field for error message
 * @returns Validation result with error message if invalid
 */
export function validateMinLength(text: string, minLength: number, fieldName = 'Text'): ValidationResult {
  const sanitized = sanitizeUserInput(text.trim());

  if (!sanitized) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  if (sanitized.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate text with maximum length
 * @param text - Text to validate
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of field for error message
 * @returns Validation result with error message if invalid
 */
export function validateMaxLength(text: string, maxLength: number, fieldName = 'Text'): ValidationResult {
  if (text.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate text with length range
 * @param text - Text to validate
 * @param minLength - Minimum required length
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of field for error message
 * @returns Validation result with error message if invalid
 */
export function validateLengthRange(text: string, minLength: number, maxLength: number, fieldName = 'Text'): ValidationResult {
  const minResult = validateMinLength(text, minLength, fieldName);
  if (!minResult.isValid) {
    return minResult;
  }

  return validateMaxLength(text, maxLength, fieldName);
}

/**
 * Validate multiple fields at once
 * @param validations - Array of validation functions to run
 * @returns True if all validations pass
 */
export function validateFields(validations: (() => ValidationResult)[]): boolean {
  return validations.every((validate) => validate().isValid);
}
