import { UserProfile } from '@/types/user';

/**
 * Sanitize user input to prevent XSS and injection attacks
 * Removes or escapes potentially dangerous characters
 * @param input - Raw user input string
 * @param maxLength - Maximum allowed length (default 500)
 * @returns Sanitized string
 */
export const sanitizeUserInput = (input: string, maxLength: number = 500): string => {
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

  return email.toLowerCase().trim().slice(0, 254); // Max email length per RFC
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

  return phone.replace(/\D/g, '').slice(0, 15); // Max international phone length
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
    sanitized.displayName = sanitizeUserInput(sanitized.displayName, 100);
  }

  if (sanitized.email) {
    sanitized.email = sanitizeEmail(sanitized.email);
  }

  if (sanitized.address) {
    sanitized.address = sanitizeUserInput(sanitized.address, 200);
  }

  if (sanitized.city) {
    sanitized.city = sanitizeUserInput(sanitized.city, 100);
  }

  if (sanitized.state) {
    sanitized.state = sanitizeUserInput(sanitized.state, 100);
  }

  if (sanitized.zipCode) {
    sanitized.zipCode = sanitizeUserInput(sanitized.zipCode, 20);
  }

  // Validate age if present
  if (sanitized.age !== undefined) {
    const age = Number(sanitized.age);
    if (isNaN(age) || age < 0 || age > 150) {
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
    } catch {
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

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long' };
  }

  // Check for at least one uppercase, lowercase, number, and special character
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)',
    };
  }

  return { isValid: true };
};
