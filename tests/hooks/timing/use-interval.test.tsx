/**
 * Tests for useInterval hook
 */

import { act, renderHook } from '@testing-library/react-native';
import { useInterval } from '@/hooks/timing/use-interval';

describe('useInterval', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should start interval immediately by default', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useInterval(callback, 1000));

      expect(result.current.isRunning).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should not start interval when immediate is false', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useInterval(callback, 1000, { immediate: false })
      );

      expect(result.current.isRunning).toBe(false);
    });

    it('should not start interval when enabled is false', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useInterval(callback, 1000, { enabled: false })
      );

      expect(result.current.isRunning).toBe(false);
    });

    it('should not start interval when delay is null', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useInterval(callback, null));

      expect(result.current.isRunning).toBe(false);
    });
  });

  describe('Interval Execution', () => {
    it('should execute callback repeatedly at interval', () => {
      const callback = jest.fn();
      renderHook(() => useInterval(callback, 1000));

      // First execution
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(callback).toHaveBeenCalledTimes(1);

      // Second execution
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(callback).toHaveBeenCalledTimes(2);

      // Third execution
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should not execute callback before interval', () => {
      const callback = jest.fn();
      renderHook(() => useInterval(callback, 1000));

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should maintain consistent interval timing', () => {
      const callback = jest.fn();
      renderHook(() => useInterval(callback, 100));

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe('Control Methods', () => {
    it('should start interval manually', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useInterval(callback, 1000, { immediate: false })
      );

      expect(result.current.isRunning).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should stop interval', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useInterval(callback, 1000));

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        result.current.stop();
      });

      expect(result.current.isRunning).toBe(false);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should restart interval', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useInterval(callback, 1000));

      act(() => {
        jest.advanceTimersByTime(500);
      });

      act(() => {
        result.current.restart();
      });

      // Callback should not execute at 500ms mark
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).not.toHaveBeenCalled();

      // Should execute at 1000ms after restart
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple start/stop cycles', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useInterval(callback, 1000, { immediate: false })
      );

      // Start
      act(() => {
        result.current.start();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      // Stop
      act(() => {
        result.current.stop();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      // Start again
      act(() => {
        result.current.start();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cleanup', () => {
    it('should stop interval on unmount', () => {
      const callback = jest.fn();
      const { unmount } = renderHook(() => useInterval(callback, 1000));

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      unmount();

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should stop interval when delay changes', () => {
      const callback = jest.fn();
      const { rerender } = renderHook(
        ({ delay }) => useInterval(callback, delay),
        { initialProps: { delay: 1000 } }
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      rerender({ delay: 2000 });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should stop interval when enabled becomes false', () => {
      const callback = jest.fn();
      const { rerender } = renderHook(
        ({ enabled }) => useInterval(callback, 1000, { enabled }),
        { initialProps: { enabled: true } }
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      rerender({ enabled: false });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very short intervals', () => {
      const callback = jest.fn();
      renderHook(() => useInterval(callback, 10));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(callback).toHaveBeenCalledTimes(10);
    });

    it('should handle callback changes', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { rerender } = renderHook(
        ({ callback }) => useInterval(callback, 1000),
        { initialProps: { callback: callback1 } }
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      rerender({ callback: callback2 });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle delay changing to null', () => {
      const callback = jest.fn();
      const { rerender, result } = renderHook(
        ({ delay }) => useInterval(callback, delay),
        { initialProps: { delay: 1000 as number | null } }
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      rerender({ delay: null });

      expect(result.current.isRunning).toBe(false);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
