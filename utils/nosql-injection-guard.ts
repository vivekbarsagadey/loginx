/**
 * NoSQL Injection Guard
 * Validates and sanitizes Firestore queries to prevent injection attacks
 */

/**
 * Validates Firestore query to prevent NoSQL injection
 * @param query - Query object to validate
 * @throws Error if query contains dangerous operators
 */
export function validateFirestoreQuery(query: Record<string, unknown>): void {
  const dangerousOperators = ['$where', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$regex', '$exists'];

  const checkValue = (value: unknown, path = 'root'): void => {
    if (typeof value === 'string') {
      // Check for dangerous operators in string values
      for (const op of dangerousOperators) {
        if (value.includes(op)) {
          throw new Error(`Dangerous operator "${op}" found in query at ${path}`);
        }
      }
    }

    if (typeof value === 'object' && value !== null) {
      // Check object keys and values recursively
      for (const [key, val] of Object.entries(value)) {
        if (dangerousOperators.includes(key)) {
          throw new Error(`Dangerous operator "${key}" found in query at ${path}.${key}`);
        }
        checkValue(val, `${path}.${key}`);
      }
    }
  };

  checkValue(query);
}

/**
 * Sanitizes a Firestore query by removing dangerous operators
 * @param query - Query object to sanitize
 * @returns Sanitized query object
 */
export function sanitizeFirestoreQuery(query: Record<string, unknown>): Record<string, unknown> {
  const dangerousOperators = ['$where', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$regex', '$exists'];

  const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      let sanitized = value;
      dangerousOperators.forEach((op) => {
        sanitized = sanitized.replace(new RegExp(op.replace('$', '\\$'), 'g'), '');
      });
      return sanitized;
    }

    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }

    if (typeof value === 'object' && value !== null) {
      const sanitized: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        if (!dangerousOperators.includes(key)) {
          sanitized[key] = sanitizeValue(val);
        }
      }
      return sanitized;
    }

    return value;
  };

  return sanitizeValue(query) as Record<string, unknown>;
}
