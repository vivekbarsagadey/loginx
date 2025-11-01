/**
 * Tests for input sanitization utilities
 */

import {
  sanitizeDocumentId,
  sanitizeEmail,
  sanitizeFieldName,
  sanitizeObject,
  sanitizeText,
  sanitizeUrl,
  sanitizeUserInput,
} from '@/utils/input-sanitization';

describe('input-sanitization', () => {
  describe('sanitizeEmail', () => {
    it('should preserve valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'user+tag@example.com',
        'user_name@example.org',
      ];

      validEmails.forEach((email) => {
        expect(sanitizeEmail(email)).toBe(email.toLowerCase());
      });
    });

    it('should convert email to lowercase', () => {
      expect(sanitizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
      expect(sanitizeEmail('Test.User@Domain.COM')).toBe('test.user@domain.com');
    });

    it('should remove dangerous characters', () => {
      const result1 = sanitizeEmail('user@example.com<script>');
      expect(result1).not.toContain('<script>');
      expect(result1).toContain('user@example.com');
      
      expect(sanitizeEmail('user"@example.com')).toBe('user@example.com');
    });

    it('should handle empty and whitespace', () => {
      expect(sanitizeEmail('')).toBe('');
      expect(sanitizeEmail('   ')).toBe('');
      expect(sanitizeEmail('  user@example.com  ')).toBe('user@example.com');
    });
  });

  describe('sanitizeUserInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeUserInput('  test  ')).toBe('test');
      expect(sanitizeUserInput('\n\ttest\n\t')).toBe('test');
    });

    it('should enforce max length', () => {
      const longText = 'a'.repeat(200);
      expect(sanitizeUserInput(longText, 100)).toHaveLength(100);
      expect(sanitizeUserInput(longText, 50)).toHaveLength(50);
    });

    it('should remove script tags', () => {
      const result1 = sanitizeUserInput('<script>alert("xss")</script>');
      const result2 = sanitizeUserInput('Hello <script>bad</script> World');
      
      expect(result1).not.toContain('<script>');
      expect(result1).not.toContain('</script>');
      expect(result2).not.toContain('<script>');
      expect(result2).toContain('Hello');
      expect(result2).toContain('World');
    });

    it('should preserve safe characters', () => {
      const safeText = 'Hello, World! How are you? 123-456';
      expect(sanitizeUserInput(safeText)).toBe(safeText);
    });

    it('should remove potentially dangerous characters', () => {
      expect(sanitizeUserInput('Hello<>World')).toBe('HelloWorld');
      expect(sanitizeUserInput('Test{value}End')).toBe('TestvalueEnd');
    });
  });

  describe('sanitizeText', () => {
    it('should preserve alphanumeric and common punctuation', () => {
      const text = 'Hello, World! This is a test. 123-456';
      expect(sanitizeText(text)).toBe(text);
    });

    it('should remove HTML tags', () => {
      const result1 = sanitizeText('Hello <b>World</b>');
      const result2 = sanitizeText('<p>Paragraph</p>');
      
      expect(result1).not.toContain('<b>');
      expect(result1).not.toContain('</b>');
      expect(result1).toContain('Hello');
      expect(result1).toContain('World');
      
      expect(result2).not.toContain('<p>');
      expect(result2).toContain('Paragraph');
    });

    it('should preserve quotes and apostrophes', () => {
      expect(sanitizeText("It's a \"test\"")).toBe("It's a \"test\"");
    });
  });

  describe('sanitizeUrl', () => {
    it('should preserve valid URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com/path',
        'https://example.com/path?query=value',
        'https://example.com:8080/path',
      ];

      validUrls.forEach((url) => {
        expect(sanitizeUrl(url)).toBe(url);
      });
    });

    it('should remove javascript: protocol', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBe('');
      expect(sanitizeUrl('JAVASCRIPT:alert("xss")')).toBe('');
    });

    it('should remove data: protocol', () => {
      expect(sanitizeUrl('data:text/html,<script>alert("xss")</script>')).toBe('');
    });

    it('should allow mailto: and tel: protocols', () => {
      expect(sanitizeUrl('mailto:user@example.com')).toBe('mailto:user@example.com');
      expect(sanitizeUrl('tel:+1234567890')).toBe('tel:+1234567890');
    });

    it('should handle empty URLs', () => {
      expect(sanitizeUrl('')).toBe('');
      expect(sanitizeUrl('   ')).toBe('');
    });
  });

  describe('sanitizeDocumentId', () => {
    it('should preserve valid document IDs', () => {
      expect(sanitizeDocumentId('user-123')).toBe('user-123');
      expect(sanitizeDocumentId('doc_abc_xyz')).toBe('doc_abc_xyz');
      expect(sanitizeDocumentId('ID123456')).toBe('ID123456');
    });

    it('should remove invalid characters', () => {
      expect(sanitizeDocumentId('user/../admin')).toBe('user..admin');
      expect(sanitizeDocumentId('doc/path')).toBe('docpath');
    });

    it('should handle special patterns', () => {
      expect(sanitizeDocumentId('__name__')).not.toContain('__');
      expect(sanitizeDocumentId('..')).not.toBe('..');
    });
  });

  describe('sanitizeFieldName', () => {
    it('should preserve valid field names', () => {
      expect(sanitizeFieldName('userName')).toBe('userName');
      expect(sanitizeFieldName('user_name')).toBe('user_name');
    });

    it('should remove invalid characters', () => {
      expect(sanitizeFieldName('user$name')).toBe('username');
      expect(sanitizeFieldName('user@name')).toBe('username');
    });

    it('should prevent field path injection', () => {
      const injected = 'field1.field2';
      const result = sanitizeFieldName(injected);
      expect(result).not.toContain('..');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string values', () => {
      const obj = {
        name: '  John  ',
        email: 'USER@EXAMPLE.COM',
        description: 'Test <script>alert("xss")</script>',
      };

      const sanitized = sanitizeObject(obj, sanitizeUserInput);

      expect(sanitized.name).toBe('John');
      expect(sanitized.email).toBe('USER@EXAMPLE.COM');
      expect(sanitized.description).not.toContain('<script>');
      expect(sanitized.description).toContain('Test');
    });

    it('should preserve non-string values', () => {
      const obj = {
        name: 'John',
        age: 30,
        active: true,
        score: null,
      };

      const sanitized = sanitizeObject(obj);

      expect(sanitized.name).toBe('John');
      expect(sanitized.age).toBe(30);
      expect(sanitized.active).toBe(true);
      expect(sanitized.score).toBeNull();
    });

    it('should handle nested objects', () => {
      const obj = {
        user: {
          name: '  John  ',
          profile: {
            bio: 'Test <script>xss</script>',
          },
        },
      };

      const sanitized = sanitizeObject(obj, sanitizeUserInput);

      expect(sanitized.user.name).toBe('John');
      expect(sanitized.user.profile.bio).not.toContain('<script>');
      expect(sanitized.user.profile.bio).toContain('Test');
    });

    it('should handle arrays', () => {
      const obj = {
        tags: ['  tag1  ', 'tag2<script>', '  tag3  '],
        counts: [1, 2, 3],
      };

      const sanitized = sanitizeObject(obj, sanitizeUserInput);

      expect(sanitized.tags[0]).toBe('tag1');
      expect(sanitized.tags[1]).not.toContain('<script>');
      expect(sanitized.tags[1]).toContain('tag2');
      expect(sanitized.tags[2]).toBe('tag3');
      expect(sanitized.counts).toEqual([1, 2, 3]);
    });

    it('should use default sanitizer', () => {
      const obj = {
        field: 'Hello <b>World</b>',
      };

      const sanitized = sanitizeObject(obj);
      expect(sanitized.field).not.toContain('<b>');
      expect(sanitized.field).toContain('Hello');
      expect(sanitized.field).toContain('World');
    });
  });
});
