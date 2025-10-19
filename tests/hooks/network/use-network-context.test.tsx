/**
 * Network Context Tests
 * Test suite for NetworkProvider and useNetwork hook
 */

import { NetworkProvider, useNetwork } from '@/hooks/network/use-network-context';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock dependencies
jest.mock('@/utils/network', () => ({
  getNetworkStatus: jest.fn(() => Promise.resolve({
    isOnline: true,
    isConnected: true,
    isInternetReachable: true,
    connectionType: 'wifi',
  })),
  initializeNetworkMonitoring: jest.fn(() => jest.fn()),
  subscribeToNetworkChanges: jest.fn(() => jest.fn()),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NetworkProvider>{children}</NetworkProvider>
);

describe('NetworkProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default network state', async () => {
      const { result } = renderHook(() => useNetwork(), { wrapper });

      await waitFor(() => {
        expect(result.current.isMonitoring).toBe(true);
      });

      expect(result.current.isConnected).toBe(true);
      expect(result.current.isInternetReachable).toBe(true);
      expect(result.current.connectionType).toBe('wifi');
      expect(result.current.error).toBeNull();
    });

    it('should have default sync queue info', async () => {
      const { result } = renderHook(() => useNetwork(), { wrapper });

      await waitFor(() => {
        expect(result.current.isMonitoring).toBe(true);
      });

      expect(result.current.syncQueue).toEqual({
        pendingCount: 0,
        isSyncing: false,
        lastSyncAt: null,
        failedCount: 0,
      });
    });
  });

  describe('Network Status Updates', () => {
    it('should refresh network status', async () => {
      const { result } = renderHook(() => useNetwork(), { wrapper });

      await waitFor(() => {
        expect(result.current.isMonitoring).toBe(true);
      });

      await result.current.refreshStatus();

      expect(result.current.isConnected).toBe(true);
    });
  });

  describe('Sync Queue Management', () => {
    it('should update sync queue info', async () => {
      const { result } = renderHook(() => useNetwork(), { wrapper });

      await waitFor(() => {
        expect(result.current.isMonitoring).toBe(true);
      });

      const updates = {
        pendingCount: 5,
        isSyncing: true,
      };

      result.current.updateSyncQueue(updates);

      expect(result.current.syncQueue.pendingCount).toBe(5);
      expect(result.current.syncQueue.isSyncing).toBe(true);
    });

    it('should track failed sync count', async () => {
      const { result } = renderHook(() => useNetwork(), { wrapper });

      await waitFor(() => {
        expect(result.current.isMonitoring).toBe(true);
      });

      result.current.updateSyncQueue({ failedCount: 3 });

      expect(result.current.syncQueue.failedCount).toBe(3);
    });
  });

  describe('Error Handling', () => {
    it('should throw error if useNetwork is used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useNetwork());
      }).toThrow('useNetwork must be used within a NetworkProvider');

      console.error = originalError;
    });
  });
});
