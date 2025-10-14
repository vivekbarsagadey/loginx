/**
 * @file tests/security/injection-attacks.test.ts
 * @description Security tests for SQL/NoSQL injection vulnerabilities
 * TASK-115: Test SQL/NoSQL injection attempts on all user input fields
 */

import { validateFirestoreQuery } from '@/utils/nosql-injection-guard';
import { sanitizeUserInput } from '@/utils/sanitize';

describe('NoSQL Injection Prevention', () => {
  describe('sanitizeUserInput', () => {
    it('should prevent basic injection attempts', () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "admin'--",
        "1' UNION SELECT * FROM passwords--",
        "<script>alert('XSS')</script>",
        '../../../etc/passwd',
        '$ne: null',
        "{ $gt: '' }",
      ];

      maliciousInputs.forEach((input) => {
        const sanitized = sanitizeUserInput(input);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('$ne');
        expect(sanitized).not.toContain('$gt');
        expect(sanitized).not.toContain('DROP TABLE');
        expect(sanitized).not.toContain('UNION SELECT');
      });
    });

    it('should handle NoSQL operators in query strings', () => {
      const maliciousQueries = [{ email: { $ne: null } }, { password: { $regex: '.*' } }, { age: { $gt: 0 } }, { role: { $in: ['admin', 'superadmin'] } }];

      maliciousQueries.forEach((query) => {
        const stringified = JSON.stringify(query);
        const sanitized = sanitizeUserInput(stringified);
        expect(sanitized).not.toMatch(/\$ne|\$regex|\$gt|\$in/);
      });
    });

    it('should preserve valid user input', () => {
      const validInputs = ['john.doe@example.com', 'John Doe', '123 Main St, Apt 4B', '+1-555-0123', 'Valid password with special chars!@#'];

      validInputs.forEach((input) => {
        const sanitized = sanitizeUserInput(input);
        expect(sanitized).toBeTruthy();
        expect(sanitized.length).toBeGreaterThan(0);
      });
    });

    it('should handle empty and null values', () => {
      expect(sanitizeUserInput('')).toBe('');
      expect(sanitizeUserInput('   ')).toBe('');
    });
  });

  describe('validateFirestoreQuery', () => {
    it('should reject queries with NoSQL operators', () => {
      const maliciousQueries = [{ email: { $ne: null } }, { password: { $regex: /.*/ } }, { age: { $gte: 18 } }];

      maliciousQueries.forEach((query) => {
        expect(() => validateFirestoreQuery(query)).toThrow();
      });
    });

    it('should accept valid Firestore queries', () => {
      const validQueries = [{ email: 'user@example.com' }, { status: 'active' }, { createdAt: new Date() }];

      validQueries.forEach((query) => {
        expect(() => validateFirestoreQuery(query)).not.toThrow();
      });
    });
  });
});

describe('XSS Prevention', () => {
  it('should escape HTML entities', () => {
    const xssAttempts = ['<img src=x onerror=alert(1)>', '<svg/onload=alert(1)>', 'javascript:alert(1)', '<iframe src="javascript:alert(1)">'];

    xssAttempts.forEach((xss) => {
      const sanitized = sanitizeUserInput(xss);
      expect(sanitized).not.toMatch(/<script|<img|<svg|<iframe|javascript:/i);
    });
  });
});

describe('Path Traversal Prevention', () => {
  it('should prevent directory traversal attempts', () => {
    const traversalAttempts = ['../../../etc/passwd', '..\\..\\..\\windows\\system32', '....//....//....//etc/passwd', '%2e%2e%2f%2e%2e%2f'];

    traversalAttempts.forEach((path) => {
      const sanitized = sanitizeUserInput(path);
      expect(sanitized).not.toMatch(/\.\.[\/\\]/);
    });
  });
});
