/**
 * Authentication & Security Hooks
 * 
 * This module exports all authentication-related hooks including:
 * - User authentication (login, logout, session management)
 * - Biometric authentication (FaceID, TouchID, Fingerprint)
 * - Two-factor authentication (2FA)
 * - Social authentication (Google, Apple)
 * - Security settings management
 * - Permission handling
 * - Registration flow management
 */

export * from './use-auth-provider';
export * from './use-biometric-auth';
export * from './use-two-factor-auth';
export * from './use-social-auth';
export * from './use-security-settings';
export * from './use-permissions';
export * from './use-registration-flow';
export * from './use-registration-state';
export * from './use-email-availability';
