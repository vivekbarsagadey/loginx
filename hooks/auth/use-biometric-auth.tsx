/**
 * Biometric Authentication Hook
 * Manages biometric authentication preferences and functionality
 * Uses expo-local-authentication for better Expo compatibility
 */
import { debugError, debugLog } from '@/utils/debug';
import { BiometricStorage } from '@/utils/secure-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface BiometricState {
  isAvailable: boolean;
  biometryType: string | null;
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;
}

interface BiometricActions {
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  checkBiometricSupport: () => Promise<void>;
  biometricTypeName: string;
}

export function useBiometricAuth(): BiometricState & BiometricActions {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    biometryType: null,
    isEnabled: false,
    isLoading: true,
    error: null,
  });

  /**
   * Check if biometric authentication is available on the device
   */
  const checkBiometricSupport = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Check hardware availability
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        debugLog('[BiometricAuth] No biometric hardware available');
        setState((prev) => ({
          ...prev,
          isAvailable: false,
          biometryType: null,
          isEnabled: false,
          isLoading: false,
        }));
        return;
      }

      // Check if biometrics are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        debugLog('[BiometricAuth] No biometric records enrolled');
        setState((prev) => ({
          ...prev,
          isAvailable: false,
          biometryType: null,
          isEnabled: false,
          isLoading: false,
        }));
        return;
      }

      // Get available authentication types
      const authTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const biometryType = getBiometryTypeFromAuthTypes(authTypes);

      // Get saved biometric preference from secure storage
      const { enabled } = await BiometricStorage.getBiometricSettings();

      const isAvailable = hasHardware && isEnrolled;

      setState((prev) => ({
        ...prev,
        isAvailable,
        biometryType,
        isEnabled: isAvailable && enabled,
        isLoading: false,
      }));

      debugLog(`[BiometricAuth] Support check - Available: ${isAvailable}, Type: ${biometryType}, Enrolled: ${isEnrolled}, Enabled: ${enabled}`);
    } catch (_error) {
      debugError('[BiometricAuth] Failed to check biometric support', error);
      setState((prev) => ({
        ...prev,
        isAvailable: false,
        biometryType: null,
        isEnabled: false,
        isLoading: false,
        error: 'Failed to check biometric support',
      }));
    }
  }, []);

  /**
   * Enable biometric authentication
   */
  const enableBiometric = async (): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      if (!state.isAvailable) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Biometric authentication is not available on this device',
        }));
        return false;
      }

      // Test biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        requireConfirmation: false,
      });

      if (result.success) {
        // Save preference to secure storage
        await BiometricStorage.setBiometricEnabled(true, state.biometryType || undefined);

        setState((prev) => ({
          ...prev,
          isEnabled: true,
          isLoading: false,
        }));

        debugLog('[BiometricAuth] Biometric authentication enabled successfully');
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Biometric authentication failed',
        }));
        return false;
      }
    } catch (_error) {
      debugError('[BiometricAuth] Failed to enable biometric authentication', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to enable biometric authentication',
      }));
      return false;
    }
  };

  /**
   * Disable biometric authentication
   */
  const disableBiometric = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Clear biometric preferences from secure storage
      await BiometricStorage.clearBiometricSettings();

      setState((prev) => ({
        ...prev,
        isEnabled: false,
        isLoading: false,
      }));

      debugLog('[BiometricAuth] Biometric authentication disabled');
    } catch (_error) {
      debugError('[BiometricAuth] Failed to disable biometric authentication', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to disable biometric authentication',
      }));
    }
  };

  /**
   * Authenticate using biometric with retry limit
   * SECURITY: Limited to 3 attempts before 30-second lockout
   */
  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      if (!state.isAvailable || !state.isEnabled) {
        return false;
      }

      // SECURITY: Check failed attempts
      const failedAttempts = await BiometricStorage.getBiometricAttempts();
      if (failedAttempts >= 3) {
        setState((prev) => ({
          ...prev,
          error: 'Too many failed attempts. Please try again later.',
        }));
        debugLog('[BiometricAuth] Biometric locked due to failed attempts');
        return false;
      }

      // Determine the prompt message based on biometry type
      let promptMessage = 'Authenticate to continue';
      if (state.biometryType === 'FACE_ID') {
        promptMessage = 'Use Face ID to authenticate';
      } else if (state.biometryType === 'TOUCH_ID') {
        promptMessage = 'Use Touch ID to authenticate';
      } else if (state.biometryType === 'FINGERPRINT') {
        promptMessage = 'Use your fingerprint to authenticate';
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        requireConfirmation: false,
      });

      if (result.success) {
        // SECURITY: Clear failed attempts on success
        await BiometricStorage.clearBiometricAttempts();
        debugLog('[BiometricAuth] Biometric authentication successful');
        return true;
      } else {
        // SECURITY: Increment failed attempts
        await BiometricStorage.setBiometricAttempts(failedAttempts + 1);
        debugLog(`[BiometricAuth] Biometric authentication failed or cancelled. Attempts: ${failedAttempts + 1}/3`);
        setState((prev) => ({
          ...prev,
          error: result.error || `Authentication failed. ${2 - failedAttempts} attempts remaining.`,
        }));
        return false;
      }
    } catch (_error) {
      debugError('[BiometricAuth] Biometric authentication error', error);
      setState((prev) => ({
        ...prev,
        error: 'Biometric authentication error occurred',
      }));
      return false;
    }
  };

  /**
   * Get user-friendly biometric type name
   */
  const getBiometricTypeName = (): string => {
    if (!state.biometryType) {
      return 'Biometric';
    }

    switch (state.biometryType) {
      case 'FACE_ID':
        return 'Face ID';
      case 'TOUCH_ID':
        return 'Touch ID';
      case 'FINGERPRINT':
        return Platform.OS === 'android' ? 'Fingerprint' : 'Biometric';
      case 'FACIAL_RECOGNITION':
        return 'Face Recognition';
      case 'IRIS':
        return 'Iris Recognition';
      default:
        return 'Biometric';
    }
  };

  /**
   * Convert LocalAuthentication types to string format
   */
  const getBiometryTypeFromAuthTypes = (authTypes: LocalAuthentication.AuthenticationType[]): string | null => {
    if (authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'FACE_ID';
    }
    if (authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'FINGERPRINT';
    }
    if (authTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'IRIS';
    }
    return authTypes.length > 0 ? 'BIOMETRIC' : null;
  };

  // Initialize biometric support check on mount
  useEffect(() => {
    checkBiometricSupport();
  }, [checkBiometricSupport]);

  return {
    // State
    ...state,

    // Actions
    enableBiometric,
    disableBiometric,
    authenticateWithBiometric,
    checkBiometricSupport,
    biometricTypeName: getBiometricTypeName(),
  };
}
