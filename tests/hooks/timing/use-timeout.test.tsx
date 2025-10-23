/**
 * Tests for useTimeout hook
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTimeout } from '@/hooks/timing/use-timeout';

describe('useTimeout', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should start timeout immediately by default', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useTimeout(callback, 1000));

      expect(result.current.isPending).toBe(true);
      expect(result.current.isComplete).toBe(false);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should not start timeout when immediate is false', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useTimeout(callback, 1000, { immediate: false })
      );

      expect(result.current.isPending).toBe(false);
      expect(result.current.isComplete).toBe(false);
    });

    it('should not start timeout when enabled is false', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useTimeout(callback, 1000, { enabled: false })
      );

      expect(result.current.isPending).toBe(false);
    });

    it('should not start timeout when delay is null', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useTimeout(callback, null));

      expect(result.current.isPending).toBe(false);
    });
  });

  describe('Timeout Execution', () => {
    it('should execute callback after delay', () => {
      const callback = jest.fn();
      renderHook(() => useTimeout(callback, 1000));

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should update state after callback execution', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useTimeout(callback, 1000));

      expect(result.current.isPending).toBe(true);
      expect(result.current.isComplete).toBe(false);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isComplete).toBe(true);
    });

    it('should not execute callback before delay', () => {
      const callback = jest.fn();
      renderHook(() => useTimeout(callback, 1000));

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Control Methods', () => {
    it('should start timeout manually', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useTimeout(callback, 1000, { immediate: false })
      );

      expect(result.current.isPending).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.isPending).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should cancel timeout', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useTimeout(callback, 1000));

      expect(result.current.isPending).toBe(true);

      act(() => {
        result.current.cancel();
      });

      expect(result.current.isPending).toBe(false);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should reset timeout', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useTimeout(callback, 1000));

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.isComplete).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isComplete).toBe(false);
    });

    it('should restart timeout', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useTimeout(callback, 1000));

      act(() => {
        jest.advanceTimersByTime(500);
      });

      act(() => {
        result.current.start();
      });

      // Original timeout should be cancelled
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).not.toHaveBeenCalled();

      // New timeout should execute
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cleanup', () => {
    it('should cancel timeout on unmount', () => {
      const callback = jest.fn();
      const { unmount } = renderHook(() => useTimeout(callback, 1000));

      unmount();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should cancel timeout when delay changes', () => {
      const callback = jest.fn();
      const { rerender } = renderHook(
        ({ delay }) => useTimeout(callback, delay),
        { initialProps: { delay: 1000 } }
      );

      act(() => {
        jest.advanceTimersByTime(500);
      });

      rerender({ delay: 2000 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero delay', () => {
      const callback = jest.fn();
      renderHook(() => useTimeout(callback, 0));

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle callback changes', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { rerender } = renderHook(
        ({ callback }) => useTimeout(callback, 1000),
        { initialProps: { callback: callback1 } }
      );

      rerender({ callback: callback2 });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should not start when delay is null', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useTimeout(callback, null));

      act(() => {
        result.current.start();
      });

      expect(result.current.isPending).toBe(false);
    });
  });
});
