/**
 * Jest configuration for LoginX
 * Supports unit, integration, security, and performance tests
 */

const { getNodePreset } = require('jest-expo/config/getPlatformPreset');

const nodePreset = getNodePreset();

module.exports = {
  ...nodePreset,
  setupFiles: undefined, // Don't use the preset's setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.tsx'],
  collectCoverageFrom: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'hooks/**/*.{ts,tsx}', 'utils/**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**', '!**/vendor/**'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 65,
      functions: 70,
      lines: 70,
    },
  },
  moduleNameMapper: {
    ...nodePreset.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/$1',
  },
  testTimeout: 30000,
};
