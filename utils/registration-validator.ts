/**
 * @module utils/registration-validator
 * @description Centralized validation utilities for registration form fields
 * Provides regex patterns and validation functions for all registration inputs
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Registration data interface
 */
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  referralCode?: string;
  termsAccepted: boolean;
}

/**
 * Comprehensive validation results for entire form
 */
export interface RegistrationValidationResults {
  isValid: boolean;
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    referralCode?: string;
    termsAccepted?: string;
  };
}

// Regex patterns for validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;
export const REFERRAL_CODE_REGEX = /^[A-Z0-9]{6,12}$/;
export const ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;
export const NAME_REGEX = /^[a-zA-Z\s\-']{2,50}$/;

/**
 * Validates first name
 * @param firstName - First name to validate
 * @returns Validation result with error message if invalid
 */
export function validateFirstName(firstName: string): ValidationResult {
  if (!firstName || firstName.trim().length === 0) {
    return { isValid: false, error: 'First name is required' };
  }
  if (!NAME_REGEX.test(firstName)) {
    return { isValid: false, error: 'First name contains invalid characters' };
  }
  if (firstName.length < 2) {
    return { isValid: false, error: 'First name must be at least 2 characters' };
  }
  if (firstName.length > 50) {
    return { isValid: false, error: 'First name must be less than 50 characters' };
  }
  return { isValid: true };
}

/**
 * Validates last name
 * @param lastName - Last name to validate
 * @returns Validation result with error message if invalid
 */
export function validateLastName(lastName: string): ValidationResult {
  if (!lastName || lastName.trim().length === 0) {
    return { isValid: false, error: 'Last name is required' };
  }
  if (!NAME_REGEX.test(lastName)) {
    return { isValid: false, error: 'Last name contains invalid characters' };
  }
  if (lastName.length < 2) {
    return { isValid: false, error: 'Last name must be at least 2 characters' };
  }
  if (lastName.length > 50) {
    return { isValid: false, error: 'Last name must be less than 50 characters' };
  }
  return { isValid: true };
}

/**
 * Validates email address
 * @param email - Email address to validate
 * @returns Validation result with error message if invalid
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }
  return { isValid: true };
}

/**
 * Validates phone number
 * @param phoneNumber - Phone number to validate
 * @returns Validation result with error message if invalid
 */
export function validatePhoneNumber(phoneNumber: string): ValidationResult {
  if (!phoneNumber || phoneNumber.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }
  if (!PHONE_REGEX.test(phoneNumber)) {
    return { isValid: false, error: 'Phone number contains invalid characters' };
  }
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number must have at least 10 digits' };
  }
  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number is too long' };
  }
  return { isValid: true };
}

/**
 * Validates referral code (optional field)
 * @param referralCode - Referral code to validate
 * @returns Validation result with error message if invalid
 */
export function validateReferralCode(referralCode?: string): ValidationResult {
  if (!referralCode || referralCode.trim().length === 0) {
    return { isValid: true }; // Optional field
  }
  if (!REFERRAL_CODE_REGEX.test(referralCode)) {
    return { isValid: false, error: 'Referral code must be 6-12 uppercase letters/numbers' };
  }
  return { isValid: true };
}

/**
 * Validates ZIP code
 * @param zipCode - ZIP code to validate
 * @returns Validation result with error message if invalid
 */
export function validateZipCode(zipCode: string): ValidationResult {
  if (!zipCode || zipCode.trim().length === 0) {
    return { isValid: false, error: 'ZIP code is required' };
  }
  if (!ZIP_CODE_REGEX.test(zipCode)) {
    return { isValid: false, error: 'Please enter a valid ZIP code (12345 or 12345-6789)' };
  }
  return { isValid: true };
}

/**
 * Validates street address
 * @param address - Street address to validate
 * @returns Validation result with error message if invalid
 */
export function validateAddress(address: string): ValidationResult {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'Street address is required' };
  }
  if (address.length < 5) {
    return { isValid: false, error: 'Address must be at least 5 characters' };
  }
  if (address.length > 200) {
    return { isValid: false, error: 'Address is too long' };
  }
  return { isValid: true };
}

/**
 * Validates city
 * @param city - City name to validate
 * @returns Validation result with error message if invalid
 */
export function validateCity(city: string): ValidationResult {
  if (!city || city.trim().length === 0) {
    return { isValid: false, error: 'City is required' };
  }
  if (city.length < 2) {
    return { isValid: false, error: 'City name must be at least 2 characters' };
  }
  if (city.length > 100) {
    return { isValid: false, error: 'City name is too long' };
  }
  return { isValid: true };
}

/**
 * Validates state
 * @param state - State code or name to validate
 * @returns Validation result with error message if invalid
 */
export function validateState(state: string): ValidationResult {
  if (!state || state.trim().length === 0) {
    return { isValid: false, error: 'State is required' };
  }
  if (state.length < 2) {
    return { isValid: false, error: 'State must be at least 2 characters' };
  }
  if (state.length > 50) {
    return { isValid: false, error: 'State name is too long' };
  }
  return { isValid: true };
}

/**
 * Validates terms acceptance
 * @param termsAccepted - Whether terms were accepted
 * @returns Validation result with error message if invalid
 */
export function validateTermsAccepted(termsAccepted: boolean): ValidationResult {
  if (!termsAccepted) {
    return { isValid: false, error: 'You must accept the terms and conditions' };
  }
  return { isValid: true };
}

/**
 * Validates entire registration form
 * @param data - Registration form data
 * @returns Comprehensive validation results for all fields
 * @example
 * const results = validateRegistrationForm(formData);
 * if (!results.isValid) {
 *   console.log('Validation errors:', results.errors);
 * }
 */
export function validateRegistrationForm(data: RegistrationData): RegistrationValidationResults {
  const errors: RegistrationValidationResults['errors'] = {};
  let isValid = true;

  // Validate first name
  const firstNameResult = validateFirstName(data.firstName);
  if (!firstNameResult.isValid) {
    errors.firstName = firstNameResult.error;
    isValid = false;
  }

  // Validate last name
  const lastNameResult = validateLastName(data.lastName);
  if (!lastNameResult.isValid) {
    errors.lastName = lastNameResult.error;
    isValid = false;
  }

  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
    isValid = false;
  }

  // Validate phone number
  const phoneResult = validatePhoneNumber(data.phoneNumber);
  if (!phoneResult.isValid) {
    errors.phoneNumber = phoneResult.error;
    isValid = false;
  }

  // Validate address
  const addressResult = validateAddress(data.address);
  if (!addressResult.isValid) {
    errors.address = addressResult.error;
    isValid = false;
  }

  // Validate city
  const cityResult = validateCity(data.city);
  if (!cityResult.isValid) {
    errors.city = cityResult.error;
    isValid = false;
  }

  // Validate state
  const stateResult = validateState(data.state);
  if (!stateResult.isValid) {
    errors.state = stateResult.error;
    isValid = false;
  }

  // Validate ZIP code
  const zipResult = validateZipCode(data.zipCode);
  if (!zipResult.isValid) {
    errors.zipCode = zipResult.error;
    isValid = false;
  }

  // Validate referral code (optional)
  const referralResult = validateReferralCode(data.referralCode);
  if (!referralResult.isValid) {
    errors.referralCode = referralResult.error;
    isValid = false;
  }

  // Validate terms acceptance
  const termsResult = validateTermsAccepted(data.termsAccepted);
  if (!termsResult.isValid) {
    errors.termsAccepted = termsResult.error;
    isValid = false;
  }

  return { isValid, errors };
}
