/**
 * Tests for useCounter hook
 */

import { useCounter } from '@/hooks/utility/use-counter';
import { act, renderHook } from '@testing-library/react-native';

describe('useCounter', () => {
  describe('Initialization', () => {
    it('should initialize with default value 0', () => {
      const { result } = renderHook(() => useCounter());

      expect(result.current.count).toBe(0);
    });

    it('should initialize with provided value', () => {
      const { result } = renderHook(() => useCounter(42));

      expect(result.current.count).toBe(42);
    });

    it('should clamp initial value to min bound', () => {
      const { result } = renderHook(() => useCounter(-5, { min: 0 }));

      expect(result.current.count).toBe(0);
    });

    it('should clamp initial value to max bound', () => {
      const { result } = renderHook(() => useCounter(15, { max: 10 }));

      expect(result.current.count).toBe(10);
    });

    it('should clamp initial value to range', () => {
      const { result } = renderHook(() => useCounter(50, { min: 0, max: 10 }));

      expect(result.current.count).toBe(10);
    });
  });

  describe('Increment', () => {
    it('should increment by 1 (default step)', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1);
    });

    it('should increment by custom step', () => {
      const { result } = renderHook(() => useCounter(0, { step: 5 }));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(5);
    });

    it('should increment multiple times', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(3);
    });

    it('should not exceed max bound', () => {
      const { result } = renderHook(() => useCounter(9, { max: 10 }));

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(10);
    });

    it('should respect max bound with custom step', () => {
      const { result } = renderHook(() => useCounter(0, { max: 10, step: 7 }));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(7);

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(10); // Clamped to max
    });
  });

  describe('Decrement', () => {
    it('should decrement by 1 (default step)', () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(4);
    });

    it('should decrement by custom step', () => {
      const { result } = renderHook(() => useCounter(10, { step: 3 }));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(7);
    });

    it('should decrement multiple times', () => {
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.decrement();
        result.current.decrement();
        result.current.decrement();
      });

      expect(result.current.count).toBe(7);
    });

    it('should not go below min bound', () => {
      const { result } = renderHook(() => useCounter(1, { min: 0 }));

      act(() => {
        result.current.decrement();
        result.current.decrement();
        result.current.decrement();
      });

      expect(result.current.count).toBe(0);
    });

    it('should respect min bound with custom step', () => {
      const { result } = renderHook(() => useCounter(10, { min: 0, step: 7 }));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(3);

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(0); // Clamped to min
    });
  });

  describe('Set', () => {
    it('should set to specific value', () => {
      const { result } = renderHook(() => useCounter(0));

      act(() => {
        result.current.set(42);
      });

      expect(result.current.count).toBe(42);
    });

    it('should clamp set value to min', () => {
      const { result } = renderHook(() => useCounter(5, { min: 0 }));

      act(() => {
        result.current.set(-10);
      });

      expect(result.current.count).toBe(0);
    });

    it('should clamp set value to max', () => {
      const { result } = renderHook(() => useCounter(5, { max: 10 }));

      act(() => {
        result.current.set(100);
      });

      expect(result.current.count).toBe(10);
    });

    it('should allow setting to same value', () => {
      const { result } = renderHook(() => useCounter(5));

      act(() => {
        result.current.set(5);
      });

      expect(result.current.count).toBe(5);
    });
  });

  describe('Reset', () => {
    it('should reset to initial value', () => {
      const { result } = renderHook(() => useCounter(10));

      act(() => {
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(12);

      act(() => {
        result.current.reset();
      });

      expect(result.current.count).toBe(10);
    });

    it('should reset to clamped initial value', () => {
      const { result } = renderHook(() => useCounter(15, { min: 0, max: 10 }));

      expect(result.current.count).toBe(10);

      act(() => {
        result.current.set(5);
      });

      expect(result.current.count).toBe(5);

      act(() => {
        result.current.reset();
      });

      expect(result.current.count).toBe(10);
    });
  });

  describe('Boundary Checks', () => {
    it('should correctly identify min boundary', () => {
      const { result } = renderHook(() => useCounter(1, { min: 0, max: 10 }));

      expect(result.current.isMin).toBe(false);

      act(() => {
        result.current.decrement();
      });

      expect(result.current.isMin).toBe(true);
    });

    it('should correctly identify max boundary', () => {
      const { result } = renderHook(() => useCounter(9, { min: 0, max: 10 }));

      expect(result.current.isMax).toBe(false);

      act(() => {
        result.current.increment();
      });

      expect(result.current.isMax).toBe(true);
    });

    it('should return false for isMin when no min is set', () => {
      const { result } = renderHook(() => useCounter(0));

      expect(result.current.isMin).toBe(false);

      act(() => {
        result.current.decrement();
      });

      expect(result.current.isMin).toBe(false);
    });

    it('should return false for isMax when no max is set', () => {
      const { result } = renderHook(() => useCounter(10));

      expect(result.current.isMax).toBe(false);

      act(() => {
        result.current.increment();
      });

      expect(result.current.isMax).toBe(false);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should work for cart quantity selector', () => {
      const { result } = renderHook(() => useCounter(1, { min: 1, max: 99 }));

      // Start with 1 item
      expect(result.current.count).toBe(1);

      // Increase quantity
      act(() => {
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(3);

      // Decrease quantity
      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(2);

      // Can't go below 1
      act(() => {
        result.current.set(0);
      });

      expect(result.current.count).toBe(1);

      // Can't exceed 99
      act(() => {
        result.current.set(100);
      });

      expect(result.current.count).toBe(99);
    });

    it('should work for page navigation', () => {
      const totalPages = 10;
      const { result } = renderHook(() => useCounter(1, { min: 1, max: totalPages }));

      // First page
      expect(result.current.count).toBe(1);
      expect(result.current.isMin).toBe(true);
      expect(result.current.isMax).toBe(false);

      // Next page
      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(2);

      // Jump to page
      act(() => {
        result.current.set(5);
      });

      expect(result.current.count).toBe(5);

      // Last page
      act(() => {
        result.current.set(10);
      });

      expect(result.current.count).toBe(10);
      expect(result.current.isMax).toBe(true);
    });

    it('should work for volume control', () => {
      const { result } = renderHook(() => useCounter(50, { min: 0, max: 100, step: 10 }));

      // Start at 50%
      expect(result.current.count).toBe(50);

      // Increase volume
      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(60);

      // Decrease volume
      act(() => {
        result.current.decrement();
        result.current.decrement();
      });

      expect(result.current.count).toBe(40);

      // Mute
      act(() => {
        result.current.set(0);
      });

      expect(result.current.count).toBe(0);

      // Max volume
      act(() => {
        result.current.set(100);
      });

      expect(result.current.count).toBe(100);
    });

    it('should work for rating system', () => {
      const { result } = renderHook(() => useCounter(0, { min: 0, max: 5 }));

      // Unrated
      expect(result.current.count).toBe(0);

      // Rate 3 stars
      act(() => {
        result.current.set(3);
      });

      expect(result.current.count).toBe(3);

      // Change to 5 stars
      act(() => {
        result.current.set(5);
      });

      expect(result.current.count).toBe(5);
      expect(result.current.isMax).toBe(true);

      // Clear rating
      act(() => {
        result.current.set(0);
      });

      expect(result.current.count).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative numbers', () => {
      const { result } = renderHook(() => useCounter(-5));

      expect(result.current.count).toBe(-5);

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(-4);
    });

    it('should handle decimal step', () => {
      const { result } = renderHook(() => useCounter(0, { step: 0.5 }));

      act(() => {
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(1);
    });

    it('should handle large numbers', () => {
      const { result } = renderHook(() => useCounter(1000000));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1000001);
    });
  });
});
