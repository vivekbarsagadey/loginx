/**
 * Permissions Context Tests
 * Test suite for PermissionsProvider and usePermissions hook
 */

import { PermissionsProvider, usePermissions } from '@/hooks/permissions/use-permissions-context';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock Expo permissions
jest.mock('expo-camera', () => ({
  Camera: {
    getCameraPermissionsAsync: jest.fn(() =>
      Promise.resolve({
        granted: false,
        canAskAgain: true,
      })
    ),
    requestCameraPermissionsAsync: jest.fn(() =>
      Promise.resolve({
        status: 'granted',
        canAskAgain: true,
      })
    ),
  },
}));

jest.mock('expo-image-picker', () => ({
  getMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      granted: false,
      canAskAgain: true,
    })
  ),
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      status: 'granted',
      canAskAgain: true,
    })
  ),
}));

jest.mock('expo-location', () => ({
  getForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      granted: false,
      canAskAgain: true,
    })
  ),
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      status: 'granted',
      canAskAgain: true,
    })
  ),
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      granted: false,
      canAskAgain: true,
    })
  ),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      status: 'granted',
      canAskAgain: true,
    })
  ),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => <PermissionsProvider>{children}</PermissionsProvider>;

describe('PermissionsProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default permissions state', async () => {
      const { result } = renderHook(() => usePermissions(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.permissions).toEqual({
        camera: { granted: false, canAskAgain: true },
        mediaLibrary: { granted: false, canAskAgain: true },
        location: { granted: false, canAskAgain: true },
        notifications: { granted: false, canAskAgain: true },
      });
    });
  });

  describe('Permission Requests', () => {
    it('should request camera permission', async () => {
      const { result } = renderHook(() => usePermissions(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const granted = await result.current.requestPermission('camera');

      expect(granted).toBe(true);
      expect(result.current.permissions.camera.granted).toBe(true);
    });

    it('should request media library permission', async () => {
      const { result } = renderHook(() => usePermissions(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const granted = await result.current.requestPermission('mediaLibrary');

      expect(granted).toBe(true);
    });

    it('should request location permission', async () => {
      const { result } = renderHook(() => usePermissions(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const granted = await result.current.requestPermission('location');

      expect(granted).toBe(true);
    });

    it('should request notification permission', async () => {
      const { result } = renderHook(() => usePermissions(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const granted = await result.current.requestPermission('notifications');

      expect(granted).toBe(true);
    });
  });

  describe('Permission Checking', () => {
    it('should check if permission is granted', async () => {
      const { result } = renderHook(() => usePermissions(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Initially not granted
      expect(result.current.isPermissionGranted('camera')).toBe(false);

      // Request permission
      await result.current.requestPermission('camera');

      // Now granted
      expect(result.current.isPermissionGranted('camera')).toBe(true);
    });

    it('should get permission status', async () => {
      const { result } = renderHook(() => usePermissions(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const status = result.current.getPermissionStatus('camera');

      expect(status).toEqual({
        granted: false,
        canAskAgain: true,
      });
    });
  });

  describe('Critical Permissions', () => {
    it('should check if all critical permissions are granted', async () => {
      const { result } = renderHook(() => usePermissions(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Initially not granted
      expect(result.current.areAllCriticalPermissionsGranted()).toBe(false);

      // Request notification permission (critical)
      await result.current.requestPermission('notifications');

      // Now granted
      expect(result.current.areAllCriticalPermissionsGranted()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should throw error if usePermissions is used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => usePermissions());
      }).toThrow('usePermissions must be used within a PermissionsProvider');

      console.error = originalError;
    });
  });
});
