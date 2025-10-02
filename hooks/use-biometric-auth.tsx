/**
 * Biometric Authentication Hook
 * Manages biometric authentication preferences and functionality
 */
import { debugError, debugLog } from '@/utils/debug';
import { BiometricStorage } from '@/utils/secure-storage';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

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
  const checkBiometricSupport = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const rnBiometrics = new ReactNativeBiometrics();
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      // Get saved biometric preference from secure storage
      const { enabled } = await BiometricStorage.getBiometricSettings();

      setState((prev) => ({
        ...prev,
        isAvailable: available,
        biometryType: biometryType || null,
        isEnabled: available && enabled,
        isLoading: false,
      }));

      debugLog(`[BiometricAuth] Support check - Available: ${available}, Type: ${biometryType}, Enabled: ${enabled}`);
    } catch (error) {
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
  };

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

      const rnBiometrics = new ReactNativeBiometrics();

      // Test biometric authentication
      const { success, error: authError } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to enable biometric login',
        cancelButtonText: 'Cancel',
      });

      if (success) {
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
          error: authError || 'Biometric authentication failed',
        }));
        return false;
      }
    } catch (error) {
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
    } catch (error) {
      debugError('[BiometricAuth] Failed to disable biometric authentication', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to disable biometric authentication',
      }));
    }
  };

  /**
   * Authenticate using biometric
   */
  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      if (!state.isAvailable || !state.isEnabled) {
        return false;
      }

      const rnBiometrics = new ReactNativeBiometrics();

      // Determine the prompt message based on biometry type
      let promptMessage = 'Authenticate to continue';
      if (state.biometryType === 'FaceID') {
        promptMessage = 'Use Face ID to authenticate';
      } else if (state.biometryType === 'TouchID') {
        promptMessage = 'Use Touch ID to authenticate';
      } else if (state.biometryType === 'Biometrics') {
        promptMessage = 'Use your fingerprint to authenticate';
      }

      const { success, error: authError } = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });

      if (success) {
        debugLog('[BiometricAuth] Biometric authentication successful');
        return true;
      } else {
        debugLog('[BiometricAuth] Biometric authentication failed or cancelled');
        setState((prev) => ({
          ...prev,
          error: authError || 'Authentication failed or was cancelled',
        }));
        return false;
      }
    } catch (error) {
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
      case 'FaceID':
        return 'Face ID';
      case 'TouchID':
        return 'Touch ID';
      case 'Biometrics':
        return Platform.OS === 'android' ? 'Fingerprint' : 'Biometric';
      default:
        return 'Biometric';
    }
  };

  // Initialize biometric support check on mount
  useEffect(() => {
    checkBiometricSupport();
  }, []);

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
