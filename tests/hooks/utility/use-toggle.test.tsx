/**
 * Tests for useToggle hook
 */

import { renderHook, act } from '@testing-library/react-native';
import { useToggle } from '@/hooks/utility/use-toggle';

describe('useToggle', () => {
  describe('Initialization', () => {
    it('should initialize with default value false', () => {
      const { result } = renderHook(() => useToggle());

      expect(result.current[0]).toBe(false);
    });

    it('should initialize with provided value', () => {
      const { result } = renderHook(() => useToggle(true));

      expect(result.current[0]).toBe(true);
    });

    it('should initialize with false when explicitly passed', () => {
      const { result } = renderHook(() => useToggle(false));

      expect(result.current[0]).toBe(false);
    });
  });

  describe('Toggle Functionality', () => {
    it('should toggle from false to true', () => {
      const { result } = renderHook(() => useToggle(false));

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](); // toggle
      });

      expect(result.current[0]).toBe(true);
    });

    it('should toggle from true to false', () => {
      const { result } = renderHook(() => useToggle(true));

      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1](); // toggle
      });

      expect(result.current[0]).toBe(false);
    });

    it('should toggle multiple times', () => {
      const { result } = renderHook(() => useToggle(false));

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](); // toggle to true
      });

      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1](); // toggle to false
      });

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](); // toggle to true
      });

      expect(result.current[0]).toBe(true);
    });
  });

  describe('SetValue Functionality', () => {
    it('should set value to true', () => {
      const { result } = renderHook(() => useToggle(false));

      act(() => {
        result.current[2](true); // setValue
      });

      expect(result.current[0]).toBe(true);
    });

    it('should set value to false', () => {
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        result.current[2](false); // setValue
      });

      expect(result.current[0]).toBe(false);
    });

    it('should set value when already at that value', () => {
      const { result } = renderHook(() => useToggle(true));

      act(() => {
        result.current[2](true); // setValue to same value
      });

      expect(result.current[0]).toBe(true);
    });
  });

  describe('Combined Usage', () => {
    it('should work with both toggle and setValue', () => {
      const { result } = renderHook(() => useToggle(false));

      // Initial state
      expect(result.current[0]).toBe(false);

      // Toggle to true
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(true);

      // Set to false
      act(() => {
        result.current[2](false);
      });

      expect(result.current[0]).toBe(false);

      // Set to true
      act(() => {
        result.current[2](true);
      });

      expect(result.current[0]).toBe(true);

      // Toggle to false
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(false);
    });
  });

  describe('Memoization', () => {
    it('should maintain stable toggle function reference', () => {
      const { result, rerender } = renderHook(() => useToggle(false));

      const firstToggle = result.current[1];

      act(() => {
        result.current[1](); // Change state
      });

      rerender();

      const secondToggle = result.current[1];

      expect(firstToggle).toBe(secondToggle);
    });

    it('should maintain stable setValue function reference', () => {
      const { result, rerender } = renderHook(() => useToggle(false));

      const firstSetValue = result.current[2];

      act(() => {
        result.current[2](true); // Change state
      });

      rerender();

      const secondSetValue = result.current[2];

      expect(firstSetValue).toBe(secondSetValue);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should work for modal visibility', () => {
      const { result } = renderHook(() => useToggle(false));
      const [isModalOpen, toggleModal, setModalOpen] = result.current;

      // Modal closed by default
      expect(isModalOpen).toBe(false);

      // Open modal
      act(() => {
        setModalOpen(true);
      });

      expect(result.current[0]).toBe(true);

      // Close modal
      act(() => {
        setModalOpen(false);
      });

      expect(result.current[0]).toBe(false);

      // Toggle modal
      act(() => {
        toggleModal();
      });

      expect(result.current[0]).toBe(true);
    });

    it('should work for accordion expand/collapse', () => {
      const { result } = renderHook(() => useToggle(false));
      const [isExpanded, toggleExpanded] = result.current;

      // Collapsed by default
      expect(isExpanded).toBe(false);

      // Expand
      act(() => {
        toggleExpanded();
      });

      expect(result.current[0]).toBe(true);

      // Collapse
      act(() => {
        toggleExpanded();
      });

      expect(result.current[0]).toBe(false);
    });

    it('should work for checkbox state', () => {
      const { result } = renderHook(() => useToggle(false));
      const [isChecked, , setChecked] = result.current;

      // Unchecked by default
      expect(isChecked).toBe(false);

      // Check
      act(() => {
        setChecked(true);
      });

      expect(result.current[0]).toBe(true);

      // Uncheck
      act(() => {
        setChecked(false);
      });

      expect(result.current[0]).toBe(false);
    });

    it('should work for loading state', () => {
      const { result } = renderHook(() => useToggle(false));
      const [isLoading, , setLoading] = result.current;

      // Not loading by default
      expect(isLoading).toBe(false);

      // Start loading
      act(() => {
        setLoading(true);
      });

      expect(result.current[0]).toBe(true);

      // Stop loading
      act(() => {
        setLoading(false);
      });

      expect(result.current[0]).toBe(false);
    });
  });
});
