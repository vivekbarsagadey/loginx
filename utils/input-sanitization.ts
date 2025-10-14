/**
 * Input Sanitization Utilities - TASK-011 (SEC-005)
 *
 * Provides sanitization functions for user inputs to prevent:
 * - NoSQL injection attacks
 * - XSS (Cross-Site Scripting) attacks
 * - Invalid data patterns
 * - Malformed inputs
 *
 * Usage:
 * ```typescript
 * import { sanitizeEmail, sanitizeName, sanitizePhone } from '@/utils/input-sanitization';
 *
 * const email = sanitizeEmail(userInput.email);
 * const name = sanitizeName(userInput.name);
 * const phone = sanitizePhone(userInput.phone);
 * ```
 *
 * @module input-sanitization
 */

import { logger } from './logger-production';

/**
 * Sanitization options
 */
interface SanitizeOptions {
  /** Remove whitespace from start and end */
  trim?: boolean;
  /** Convert to lowercase */
  lowercase?: boolean;
  /** Convert to uppercase */
  uppercase?: boolean;
  /** Maximum length (truncate if longer) */
  maxLength?: number;
  /** Remove special characters */
  removeSpecialChars?: boolean;
  /** Allow specific characters (regex pattern) */
  allowedCharsPattern?: RegExp;
  /** Log sanitization actions */
  logSanitization?: boolean;
}

/**
 * Dangerous patterns that could indicate injection attempts
 */
const DANGEROUS_PATTERNS = [
  // NoSQL injection operators
  /\$where/gi,
  /\$ne/gi,
  /\$gt/gi,
  /\$gte/gi,
  /\$lt/gi,
  /\$lte/gi,
  /\$in/gi,
  /\$nin/gi,
  /\$exists/gi,
  /\$regex/gi,
  /\$or/gi,
  /\$and/gi,
  /\$not/gi,

  // JavaScript code injection
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
  /onclick\s*=/gi,

  // SQL injection patterns (defense in depth)
  /'\s*or\s*'1'\s*=\s*'1/gi,
  /--/g,
  /;.*drop\s+table/gi,
  /;.*insert\s+into/gi,
  /;.*delete\s+from/gi,

  // Command injection
  /&&/g,
  /\|\|/g,
  /;\s*rm\s+-rf/gi,
];

/**
 * Base sanitization function
 */
function sanitizeBase(input: string, options: SanitizeOptions = {}): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Trim whitespace
  if (options.trim !== false) {
    sanitized = sanitized.trim();
  }

  // Apply case transformations
  if (options.lowercase) {
    sanitized = sanitized.toLowerCase();
  } else if (options.uppercase) {
    sanitized = sanitized.toUpperCase();
  }

  // Check for dangerous patterns
  const foundDangerousPattern = DANGEROUS_PATTERNS.some((pattern) => pattern.test(sanitized));
  if (foundDangerousPattern) {
    logger.warn('[InputSanitization] Dangerous pattern detected in input', {
      inputLength: input.length,
      sanitizedLength: sanitized.length,
    });
    // Remove all dangerous patterns
    DANGEROUS_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '');
    });
  }

  // Remove special characters if requested
  if (options.removeSpecialChars) {
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s-_.@]/g, '');
  }

  // Apply allowed characters pattern
  if (options.allowedCharsPattern) {
    const matches = sanitized.match(options.allowedCharsPattern);
    sanitized = matches ? matches.join('') : '';
  }

  // Apply max length
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  // Log sanitization if needed
  if (options.logSanitization && sanitized !== input) {
    logger.debug('[InputSanitization] Input was sanitized', {
      originalLength: input.length,
      sanitizedLength: sanitized.length,
      changes: input !== sanitized,
    });
  }

  return sanitized;
}

/**
 * Sanitize email address
 * - Converts to lowercase
 * - Removes whitespace
 * - Validates basic email format
 * - Removes dangerous patterns
 * - Max length: 254 characters (RFC 5321)
 */
export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeBase(email, {
    trim: true,
    lowercase: true,
    maxLength: 254,
    allowedCharsPattern: /[a-z0-9._%+\-@]/g,
  });

  // Basic email format validation
  const emailPattern = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
  if (sanitized && !emailPattern.test(sanitized)) {
    logger.warn('[InputSanitization] Invalid email format after sanitization', {
      length: sanitized.length,
    });
    return '';
  }

  return sanitized;
}

/**
 * Sanitize name (first name, last name, display name)
 * - Trims whitespace
 * - Removes dangerous patterns
 * - Allows letters, spaces, hyphens, apostrophes
 * - Max length: 100 characters
 */
export function sanitizeName(name: string): string {
  return sanitizeBase(name, {
    trim: true,
    maxLength: 100,
    allowedCharsPattern: /[a-zA-Z\s\-']/g,
  });
}

/**
 * Sanitize phone number
 * - Removes all non-numeric characters except + and -
 * - Trims whitespace
 * - Max length: 20 characters
 */
export function sanitizePhone(phone: string): string {
  return sanitizeBase(phone, {
    trim: true,
    maxLength: 20,
    allowedCharsPattern: /[\d+\-\s()]/g,
  });
}

/**
 * Sanitize password
 * - Only trims whitespace (preserves all characters for security)
 * - No case transformation
 * - Max length: 128 characters
 * - Checks for dangerous patterns but allows special characters
 */
export function sanitizePassword(password: string): string {
  if (!password || typeof password !== 'string') {
    return '';
  }

  let sanitized = password.trim();

  // Check for obvious injection attempts
  const hasDangerousPattern = DANGEROUS_PATTERNS.some((pattern) => pattern.test(sanitized));
  if (hasDangerousPattern) {
    logger.warn('[InputSanitization] Dangerous pattern detected in password');
    return '';
  }

  // Apply max length
  if (sanitized.length > 128) {
    sanitized = sanitized.substring(0, 128);
  }

  return sanitized;
}

/**
 * Sanitize URL
 * - Trims whitespace
 * - Validates URL format
 * - Only allows http:// and https:// protocols
 * - Max length: 2048 characters
 */
export function sanitizeUrl(url: string): string {
  const sanitized = sanitizeBase(url, {
    trim: true,
    maxLength: 2048,
  });

  // Must start with http:// or https://
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    logger.warn('[InputSanitization] Invalid URL protocol');
    return '';
  }

  // Basic URL validation
  try {
    new URL(sanitized);
    return sanitized;
  } catch {
    logger.warn('[InputSanitization] Invalid URL format');
    return '';
  }
}

/**
 * Sanitize text input (general purpose)
 * - Trims whitespace
 * - Removes dangerous patterns
 * - Removes HTML tags
 * - Max length: 5000 characters
 */
export function sanitizeText(text: string, maxLength = 5000): string {
  let sanitized = sanitizeBase(text, {
    trim: true,
    maxLength,
  });

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  return sanitized;
}

/**
 * Sanitize search query
 * - Trims whitespace
 * - Removes dangerous patterns
 * - Max length: 500 characters
 */
export function sanitizeSearchQuery(query: string): string {
  return sanitizeBase(query, {
    trim: true,
    maxLength: 500,
  });
}

/**
 * Sanitize Firestore document ID
 * - Only allows alphanumeric, underscore, and hyphen
 * - Max length: 1500 characters (Firestore limit)
 */
export function sanitizeDocumentId(id: string): string {
  return sanitizeBase(id, {
    trim: true,
    maxLength: 1500,
    allowedCharsPattern: /[a-zA-Z0-9_\-]/g,
  });
}

/**
 * Sanitize Firestore field name
 * - Only allows alphanumeric, underscore
 * - Max length: 1500 characters (Firestore limit)
 */
export function sanitizeFieldName(fieldName: string): string {
  return sanitizeBase(fieldName, {
    trim: true,
    maxLength: 1500,
    allowedCharsPattern: /[a-zA-Z0-9_]/g,
  });
}

/**
 * Sanitize Firestore field value
 * - Prevents NoSQL injection in query values
 * - Allows alphanumeric, spaces, and common punctuation
 * - Max length: 1048576 bytes (1MB - Firestore document limit)
 * TASK-013: NoSQL injection prevention
 */
export function sanitizeFirestoreValue(value: string): string {
  return sanitizeBase(value, {
    trim: true,
    maxLength: 10000, // Practical limit for query values
    allowedCharsPattern: /[a-zA-Z0-9 .,!?@\-_'"/()]/g,
  });
}

/**
 * Batch sanitize an object's string values
 * Useful for sanitizing form data
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T, sanitizer: (value: string) => string = sanitizeText): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizer(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => (typeof item === 'string' ? sanitizer(item) : item));
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, sanitizer);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Validate that a string is safe (doesn't contain dangerous patterns)
 */
export function isSafeInput(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return true;
  }

  return !DANGEROUS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Sanitization result with validation
 */
export interface SanitizationResult {
  /** Sanitized value */
  value: string;
  /** Whether the input was modified */
  wasModified: boolean;
  /** Whether the input contained dangerous patterns */
  hadDangerousPatterns: boolean;
  /** Whether the sanitized value is valid */
  isValid: boolean;
}

/**
 * Sanitize with detailed result
 */
export function sanitizeWithValidation(input: string, sanitizer: (value: string) => string = sanitizeText): SanitizationResult {
  const original = input || '';
  const hadDangerousPatterns = !isSafeInput(original);
  const sanitized = sanitizer(original);
  const wasModified = sanitized !== original;
  const isValid = sanitized.length > 0;

  return {
    value: sanitized,
    wasModified,
    hadDangerousPatterns,
    isValid,
  };
}
