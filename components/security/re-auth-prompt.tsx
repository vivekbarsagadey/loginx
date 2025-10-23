/**
 * RE-AUTHENTICATION PROMPT MODAL
 * TASK-077: Modal component for re-authentication with biometric icon
 * TASK-078: Password input fallback when biometric fails
 *
 * Displays:
 * - Reason for re-authentication
 * - Biometric icon/prompt
 * - Password input fallback option
 * - Cancel button
 * - Success/error states with haptic feedback
 */

import { useThemeColors } from '@/hooks/use-theme-colors';
import { debugError, debugLog } from '@/utils/debug';
import type { ReAuthResult } from '@/utils/re-authentication';
import { getBiometricType, requireAuth, verifyPasswordFallback } from '@/utils/re-authentication';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedTextInput } from '../themed-text-input';
import { ThemedView } from '../themed-view';

export interface ReAuthPromptProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when authentication succeeds */
  onSuccess: () => void;
  /** Callback when authentication fails or is cancelled */
  onCancel: () => void;
  /** Reason for re-authentication shown to user */
  reason?: string;
  /** Allow password fallback if biometric fails */
  allowPasswordFallback?: boolean;
  /** User email for password fallback */
  userEmail?: string;
  /** Check session timeout before requiring re-auth */
  checkSessionTimeout?: boolean;
}

/**
 * ReAuthPrompt Modal Component
 * Handles biometric and password re-authentication
 */
export function ReAuthPrompt({ visible, onSuccess, onCancel, reason = 'Please authenticate to continue', allowPasswordFallback = true, userEmail, checkSessionTimeout = true }: ReAuthPromptProps) {
  const colors = useThemeColors(); // Use theme colors directly

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricType, setBiometricType] = useState('Biometric Authentication');

  // Load biometric type on mount
  React.useEffect(() => {
    if (visible) {
      loadBiometricType();
    }
  }, [visible]);

  const loadBiometricType = async () => {
    try {
      const type = await getBiometricType();
      setBiometricType(type);
    } catch (_error: unknown) {
      debugError("[Error]", _error);
    }
  };

  // Auto-trigger biometric on modal open
  React.useEffect(() => {
    if (visible && !showPasswordInput) {
      handleBiometricAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]); // Intentional: Only trigger when visibility changes, not when handler updates

  const handleBiometricAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      debugLog('[ReAuthPrompt] Attempting biometric authentication');

      const result = await requireAuth({
        reason,
        allowPasswordFallback,
        checkSessionTimeout,
      });

      handleAuthResult(result);
    } catch (_error: unknown) {
      debugError("[Error]", _error);
      setError('Authentication failed. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordAuth = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (!userEmail) {
      setError('User email not available');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      debugLog('[ReAuthPrompt] Attempting password authentication');

      const result = await verifyPasswordFallback(password, userEmail);
      handleAuthResult(result);
    } catch (_error: unknown) {
      debugError("[Error]", _error);
      setError('Invalid password. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthResult = async (result: ReAuthResult) => {
    if (result.success) {
      debugLog('[ReAuthPrompt] Authentication successful');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      resetState();
      onSuccess();
    } else {
      debugLog('[ReAuthPrompt] Authentication failed:', result.error);

      // TASK-078: Show password fallback if biometric failed
      if (result.method === 'password' && allowPasswordFallback) {
        setShowPasswordInput(true);
        setError('Biometric authentication failed');
      } else {
        setError(result.error || 'Authentication failed');
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleCancel = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetState();
    onCancel();
  };

  const handleTryBiometricAgain = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPasswordInput(false);
    setPassword('');
    setError(null);
    handleBiometricAuth();
  };

  const resetState = () => {
    setShowPasswordInput(false);
    setPassword('');
    setError(null);
    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel} statusBarTranslucent>
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialIcons name={showPasswordInput ? 'lock' : 'fingerprint'} size={48} color={colors.primary} style={styles.icon} />
            <ThemedText type="title" style={styles.title}>
              {showPasswordInput ? 'Enter Password' : biometricType}
            </ThemedText>
            <ThemedText type="body" style={[styles.reason, { color: colors['text-muted'] }]}>
              {reason}
            </ThemedText>
          </View>

          {/* Error Message */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors['surface-variant'], borderColor: colors.error }]}>
              <MaterialIcons name="error-outline" size={20} color={colors.error} />
              <ThemedText style={[styles.errorText, { color: colors.error }]}>{error}</ThemedText>
            </View>
          )}

          {/* TASK-078: Password Input Fallback */}
          {showPasswordInput && (
            <View style={styles.passwordContainer}>
              <ThemedText type="caption" style={styles.passwordLabel}>
                Password
              </ThemedText>
              <ThemedTextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoFocus
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                placeholder="Enter your password"
                editable={!loading}
                onSubmitEditing={handlePasswordAuth}
                returnKeyType="done"
              />
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {showPasswordInput ? (
              <>
                <ThemedButton title="Cancel" onPress={handleCancel} variant="secondary" disabled={loading} style={styles.button} />
                {allowPasswordFallback && <ThemedButton title={`Try ${biometricType}`} onPress={handleTryBiometricAgain} variant="secondary" disabled={loading} style={styles.button} />}
                <ThemedButton title="Authenticate" onPress={handlePasswordAuth} variant="primary" loading={loading} disabled={loading || !password.trim()} style={styles.button} />
              </>
            ) : (
              <>
                <ThemedButton title="Cancel" onPress={handleCancel} variant="secondary" disabled={loading} style={styles.button} />
                {allowPasswordFallback && <ThemedButton title="Use Password Instead" onPress={() => setShowPasswordInput(true)} variant="secondary" disabled={loading} style={styles.button} />}
                <ThemedButton title="Retry" onPress={handleBiometricAuth} variant="primary" loading={loading} disabled={loading} style={styles.button} />
              </>
            )}
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  reason: {
    textAlign: 'center',
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  passwordContainer: {
    marginBottom: 24,
  },
  passwordLabel: {
    marginBottom: 8,
  },
  actions: {
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
