/**
 * Example test file to verify Jest setup
 */

describe('Jest Configuration', () => {
  it('should be properly configured', () => {
    expect(true).toBe(true);
  });

  it('should support TypeScript', () => {
    const testValue = 'TypeScript works';
    expect(testValue).toBe('TypeScript works');
  });

  it('should have proper test environment', () => {
    expect(typeof jest).toBe('object');
    expect(typeof describe).toBe('function');
    expect(typeof it).toBe('function');
    expect(typeof expect).toBe('function');
  });
});
