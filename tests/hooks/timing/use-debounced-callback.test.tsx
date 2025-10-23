/**
 * Tests for useDebouncedCallback hook
 */

import { renderHook, act } from '@testing-library/react-native';
import { useDebouncedCallback } from '@/hooks/timing/use-debounced-callback';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic Functionality', () => {
    it('should debounce callback execution', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 500));

      act(() => {
        result.current();
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 500));

      // First call
      act(() => {
        result.current();
      });

      // Advance timer partially
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Second call should reset timer
      act(() => {
        result.current();
      });

      // Advance timer for remaining original delay
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Callback should not have been called yet
      expect(callback).not.toHaveBeenCalled();

      // Advance timer for new delay
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Callback should be called once
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should only execute callback once after multiple rapid calls', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 500));

      // Rapid calls
      act(() => {
        result.current();
        result.current();
        result.current();
        result.current();
        result.current();
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Parameters', () => {
    it('should pass arguments to callback', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useDebouncedCallback((a: number, b: string) => callback(a, b), 500)
      );

      act(() => {
        result.current(42, 'test');
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledWith(42, 'test');
    });

    it('should use arguments from last call', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useDebouncedCallback((value: number) => callback(value), 500)
      );

      act(() => {
        result.current(1);
        result.current(2);
        result.current(3);
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(3);
    });

    it('should handle multiple parameter types', () => {
      const callback = jest.fn();
      const { result } = renderHook(() =>
        useDebouncedCallback(
          (str: string, num: number, bool: boolean, obj: { key: string }) =>
            callback(str, num, bool, obj),
          500
        )
      );

      const testObj = { key: 'value' };

      act(() => {
        result.current('test', 42, true, testObj);
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledWith('test', 42, true, testObj);
    });
  });

  describe('Delay Changes', () => {
    it('should update delay when changed', () => {
      const callback = jest.fn();
      const { result, rerender } = renderHook(
        ({ delay }) => useDebouncedCallback(callback, delay),
        { initialProps: { delay: 500 } }
      );

      act(() => {
        result.current();
      });

      // Update delay
      rerender({ delay: 1000 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should not be called yet with old delay
      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should be called with new delay
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle zero delay', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 0));

      act(() => {
        result.current();
      });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Callback Changes', () => {
    it('should use updated callback', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { result, rerender } = renderHook(
        ({ callback }) => useDebouncedCallback(callback, 500),
        { initialProps: { callback: callback1 } }
      );

      act(() => {
        result.current();
      });

      rerender({ callback: callback2 });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cleanup', () => {
    it('should cancel pending callback on unmount', () => {
      const callback = jest.fn();
      const { result, unmount } = renderHook(() =>
        useDebouncedCallback(callback, 500)
      );

      act(() => {
        result.current();
      });

      unmount();

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should cancel previous timeout when new call is made', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 500));

      act(() => {
        result.current();
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      act(() => {
        result.current();
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should debounce search input', () => {
      const searchAPI = jest.fn();
      const { result } = renderHook(() =>
        useDebouncedCallback((query: string) => searchAPI(query), 300)
      );

      // Simulate user typing
      act(() => {
        result.current('h');
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current('he');
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current('hel');
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current('hello');
      });

      // API should not be called yet
      expect(searchAPI).not.toHaveBeenCalled();

      // Wait for debounce delay
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // API should be called once with final value
      expect(searchAPI).toHaveBeenCalledTimes(1);
      expect(searchAPI).toHaveBeenCalledWith('hello');
    });

    it('should debounce form validation', () => {
      const validate = jest.fn();
      const { result } = renderHook(() =>
        useDebouncedCallback((value: string) => validate(value), 400)
      );

      // Rapid value changes
      act(() => {
        result.current('a');
        result.current('ab');
        result.current('abc');
        result.current('abcd');
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate).toHaveBeenCalledWith('abcd');
    });

    it('should debounce window resize', () => {
      const recalculate = jest.fn();
      const { result } = renderHook(() =>
        useDebouncedCallback(() => recalculate(), 500)
      );

      // Simulate multiple resize events
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current();
          jest.advanceTimersByTime(50);
        });
      }

      // Recalculate should not be called during resize
      expect(recalculate).not.toHaveBeenCalled();

      // Wait for debounce delay
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Recalculate should be called once
      expect(recalculate).toHaveBeenCalledTimes(1);
    });
  });
});
