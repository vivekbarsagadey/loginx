/**
 * @module utils/audit-logger
 * @description Audit logging for authentication events to Firestore
 * TASK-111: Implement audit logging for authentication events to Firestore audit_logs collection
 */

import { firestore, isFirestoreReady } from '@/firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { createLogger } from './debug';
import { SecurityEventType } from './monitoring';

const logger = createLogger('AuditLogger');

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  eventType: SecurityEventType | string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date | ReturnType<typeof serverTimestamp>;
  success: boolean;
  errorMessage?: string;
}

/**
 * Write audit log to Firestore
 * @param entry - Audit log entry to write
 */
export async function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
  try {
    if (!isFirestoreReady()) {
      logger.warn('Firestore not ready, skipping audit log');
      return;
    }

    const auditLogsRef = collection(firestore, 'audit_logs');

    await addDoc(auditLogsRef, {
      ...entry,
      timestamp: serverTimestamp(),
    });

    logger.log('Audit event logged:', entry.eventType);
  } catch (_error) {
    logger.error('Failed to log audit event:', error);
    // Don't throw - audit logging should not block user actions
  }
}

/**
 * Log successful login
 */
export async function logSuccessfulLogin(userId: string, email: string, method: 'email' | 'google' | 'apple' | 'biometric'): Promise<void> {
  await logAuditEvent({
    eventType: SecurityEventType.LOGIN,
    userId,
    userEmail: email,
    success: true,
    metadata: {
      method,
    },
  });
}

/**
 * Log failed login attempt
 */
export async function logFailedLogin(email: string, reason: string): Promise<void> {
  await logAuditEvent({
    eventType: SecurityEventType.LOGIN_FAILED,
    userEmail: email,
    success: false,
    errorMessage: reason,
  });
}

/**
 * Log password change
 */
export async function logPasswordChange(userId: string, email: string): Promise<void> {
  await logAuditEvent({
    eventType: SecurityEventType.PASSWORD_CHANGE,
    userId,
    userEmail: email,
    success: true,
  });
}

/**
 * Log account deletion
 */
export async function logAccountDeletion(userId: string, email: string, reason?: string): Promise<void> {
  await logAuditEvent({
    eventType: SecurityEventType.ACCOUNT_DELETION,
    userId,
    userEmail: email,
    success: true,
    metadata: {
      reason,
    },
  });
}

/**
 * Log 2FA status change
 */
export async function log2FAStatusChange(userId: string, email: string, enabled: boolean): Promise<void> {
  await logAuditEvent({
    eventType: enabled ? SecurityEventType.TWO_FACTOR_ENABLED : SecurityEventType.TWO_FACTOR_DISABLED,
    userId,
    userEmail: email,
    success: true,
  });
}

/**
 * Log biometric auth status change
 */
export async function logBiometricStatusChange(userId: string, email: string, enabled: boolean): Promise<void> {
  await logAuditEvent({
    eventType: enabled ? SecurityEventType.BIOMETRIC_ENABLED : SecurityEventType.BIOMETRIC_DISABLED,
    userId,
    userEmail: email,
    success: true,
  });
}
