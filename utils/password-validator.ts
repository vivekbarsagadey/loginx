/**
 * Centralized Password Validation Service
 * TASK-020: Consolidates all password validation logic
 * SECURITY: Strong password requirements with comprehensive validation
 */

import { ValidationConstants, ValidationMessages } from '@/constants/validation';
import { sanitizePassword } from './input-sanitization';
import { logger } from './logger-production';

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number; // 0-100
}

/**
 * Password strength criteria
 */
interface PasswordCriteria {
  minLength: boolean;
  maxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  noCommonPatterns: boolean;
  noSequentialChars: boolean;
  noRepeatedChars: boolean;
}

/**
 * Common password patterns to reject
 * SECURITY: Prevent use of common weak passwords
 */
const COMMON_WEAK_PATTERNS = [/^password/i, /^123456/, /^qwerty/i, /^abc123/i, /^letmein/i, /^welcome/i, /^monkey/i, /^dragon/i, /^master/i, /^sunshine/i];

/**
 * Sequential character patterns (e.g., abc, 123)
 */
const SEQUENTIAL_CHARS = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;

/**
 * Repeated character patterns (e.g., aaa, 111)
 */
const REPEATED_CHARS = /(.)\1{2,}/;

/**
 * Validate password against all criteria
 * @param password - Password to validate
 * @returns Validation result with errors and strength assessment
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Sanitize password first to remove dangerous characters
  const sanitized = sanitizePassword(password);
  if (sanitized !== password) {
    logger.warn('[PasswordValidator] Password contains invalid characters and was sanitized');
    errors.push(ValidationMessages.PASSWORD_INVALID_CHARS);
  }

  // Check required criteria
  const criteria = checkPasswordCriteria(sanitized);

  // Length validation
  if (!criteria.minLength) {
    errors.push(ValidationMessages.PASSWORD_TOO_SHORT);
  }
  if (!criteria.maxLength) {
    errors.push(ValidationMessages.PASSWORD_TOO_LONG);
  }

  // Character type validation
  if (!criteria.hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!criteria.hasLowercase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!criteria.hasNumber) {
    errors.push('Password must contain at least one number');
  }
  if (!criteria.hasSpecialChar) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  // Pattern validation
  if (!criteria.noCommonPatterns) {
    errors.push('Password is too common. Please choose a more unique password');
  }
  if (!criteria.noSequentialChars) {
    warnings.push('Password contains sequential characters (e.g., abc, 123)');
  }
  if (!criteria.noRepeatedChars) {
    warnings.push('Password contains repeated characters (e.g., aaa, 111)');
  }

  // Calculate strength score
  const score = calculatePasswordScore(sanitized, criteria);
  const strength = getPasswordStrength(score);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    strength,
    score,
  };
}

/**
 * Check password against all criteria
 * @param password - Password to check
 * @returns Criteria check results
 */
function checkPasswordCriteria(password: string): PasswordCriteria {
  return {
    minLength: password.length >= ValidationConstants.PASSWORD_MIN_LENGTH,
    maxLength: password.length <= ValidationConstants.PASSWORD_MAX_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
    noCommonPatterns: !COMMON_WEAK_PATTERNS.some((pattern) => pattern.test(password)),
    noSequentialChars: !SEQUENTIAL_CHARS.test(password),
    noRepeatedChars: !REPEATED_CHARS.test(password),
  };
}

/**
 * Calculate password strength score (0-100)
 * @param password - Password to score
 * @param criteria - Password criteria check results
 * @returns Score from 0 to 100
 */
function calculatePasswordScore(password: string, criteria: PasswordCriteria): number {
  let score = 0;

  // Length bonus (up to 30 points)
  if (criteria.minLength) {
    score += Math.min(30, (password.length - ValidationConstants.PASSWORD_MIN_LENGTH) * 3);
  }

  // Character type bonuses (10 points each, 40 total)
  if (criteria.hasUppercase) {score += 10;}
  if (criteria.hasLowercase) {score += 10;}
  if (criteria.hasNumber) {score += 10;}
  if (criteria.hasSpecialChar) {score += 10;}

  // Pattern bonuses (10 points each, 30 total)
  if (criteria.noCommonPatterns) {score += 10;}
  if (criteria.noSequentialChars) {score += 10;}
  if (criteria.noRepeatedChars) {score += 10;}

  // Ensure score is between 0 and 100
  return Math.min(100, Math.max(0, score));
}

/**
 * Get password strength category from score
 * @param score - Password score (0-100)
 * @returns Strength category
 */
function getPasswordStrength(score: number): 'weak' | 'medium' | 'strong' | 'very-strong' {
  if (score < 40) {return 'weak';}
  if (score < 60) {return 'medium';}
  if (score < 80) {return 'strong';}
  return 'very-strong';
}

/**
 * Get password strength color for UI display
 * @param strength - Password strength category
 * @returns Color name for themed components
 */
export function getPasswordStrengthColor(strength: 'weak' | 'medium' | 'strong' | 'very-strong'): string {
  switch (strength) {
    case 'weak':
      return 'error';
    case 'medium':
      return 'warning';
    case 'strong':
      return 'success';
    case 'very-strong':
      return 'success';
  }
}

/**
 * Get user-friendly password strength text
 * @param strength - Password strength category
 * @returns Human-readable strength description
 */
export function getPasswordStrengthText(strength: 'weak' | 'medium' | 'strong' | 'very-strong'): string {
  switch (strength) {
    case 'weak':
      return 'Weak password - easy to guess';
    case 'medium':
      return 'Medium strength - could be stronger';
    case 'strong':
      return 'Strong password - good choice';
    case 'very-strong':
      return 'Very strong password - excellent!';
  }
}

/**
 * Quick validation - returns true if password meets minimum requirements
 * @param password - Password to validate
 * @returns True if password is valid
 */
export function isPasswordValid(password: string): boolean {
  const result = validatePassword(password);
  return result.isValid;
}

/**
 * Validate password confirmation match
 * @param password - Original password
 * @param confirmation - Confirmation password
 * @returns Validation result
 */
export function validatePasswordConfirmation(
  password: string,
  confirmation: string
): {
  isValid: boolean;
  error?: string;
} {
  if (!confirmation) {
    return {
      isValid: false,
      error: 'Please confirm your password',
    };
  }

  if (password !== confirmation) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Generate password strength requirements text for UI
 * @returns Array of requirement strings
 */
export function getPasswordRequirements(): string[] {
  return [
    `At least ${ValidationConstants.PASSWORD_MIN_LENGTH} characters long`,
    'At least one uppercase letter (A-Z)',
    'At least one lowercase letter (a-z)',
    'At least one number (0-9)',
    'At least one special character (@$!%*?&)',
    'Avoid common passwords',
  ];
}

/**
 * Validate password change (old password vs new password)
 * @param oldPassword - Current password
 * @param newPassword - New password
 * @returns Validation result
 */
export function validatePasswordChange(
  oldPassword: string,
  newPassword: string
): {
  isValid: boolean;
  error?: string;
} {
  if (!oldPassword || !newPassword) {
    return {
      isValid: false,
      error: 'Both passwords are required',
    };
  }

  if (oldPassword === newPassword) {
    return {
      isValid: false,
      error: 'New password must be different from old password',
    };
  }

  const newPasswordResult = validatePassword(newPassword);
  if (!newPasswordResult.isValid) {
    return {
      isValid: false,
      error: newPasswordResult.errors[0],
    };
  }

  return {
    isValid: true,
  };
}
