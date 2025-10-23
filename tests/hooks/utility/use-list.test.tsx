/**
 * Tests for useList hook
 */

import { act, renderHook } from '@testing-library/react-native';
import { useList } from '@/hooks/utility/use-list';

interface TestItem {
  id: number;
  name: string;
}

describe('useList', () => {
  describe('Initialization', () => {
    it('should initialize with empty array by default', () => {
      const { result } = renderHook(() => useList<TestItem>());

      expect(result.current.list).toEqual([]);
    });

    it('should initialize with provided array', () => {
      const initialList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const { result } = renderHook(() => useList(initialList));

      expect(result.current.list).toEqual(initialList);
    });
  });

  describe('Push', () => {
    it('should add single item to end', () => {
      const { result } = renderHook(() => useList<TestItem>());

      act(() => {
        result.current.push({ id: 1, name: 'Item 1' });
      });

      expect(result.current.list).toEqual([{ id: 1, name: 'Item 1' }]);
    });

    it('should add multiple items to end', () => {
      const { result } = renderHook(() => useList<TestItem>());

      act(() => {
        result.current.push(
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' }
        );
      });

      expect(result.current.list).toHaveLength(2);
      expect(result.current.list[1]).toEqual({ id: 2, name: 'Item 2' });
    });
  });

  describe('Pop', () => {
    it('should remove and return last item', () => {
      const initialList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];
      const { result } = renderHook(() => useList(initialList));

      let removed: TestItem | undefined;
      act(() => {
        removed = result.current.pop();
      });

      expect(removed).toEqual({ id: 3, name: 'Item 3' });
      expect(result.current.list).toHaveLength(2);
      expect(result.current.list[1]).toEqual({ id: 2, name: 'Item 2' });
    });

    it('should return undefined for empty list', () => {
      const { result } = renderHook(() => useList<TestItem>());

      let removed: TestItem | undefined;
      act(() => {
        removed = result.current.pop();
      });

      expect(removed).toBeUndefined();
      expect(result.current.list).toEqual([]);
    });
  });

  describe('Unshift', () => {
    it('should add single item to beginning', () => {
      const { result } = renderHook(() =>
        useList([{ id: 2, name: 'Item 2' }])
      );

      act(() => {
        result.current.unshift({ id: 1, name: 'Item 1' });
      });

      expect(result.current.list[0]).toEqual({ id: 1, name: 'Item 1' });
      expect(result.current.list).toHaveLength(2);
    });

    it('should add multiple items to beginning', () => {
      const { result } = renderHook(() =>
        useList([{ id: 3, name: 'Item 3' }])
      );

      act(() => {
        result.current.unshift(
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' }
        );
      });

      expect(result.current.list[0]).toEqual({ id: 1, name: 'Item 1' });
      expect(result.current.list).toHaveLength(3);
    });
  });

  describe('Shift', () => {
    it('should remove and return first item', () => {
      const initialList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];
      const { result } = renderHook(() => useList(initialList));

      let removed: TestItem | undefined;
      act(() => {
        removed = result.current.shift();
      });

      expect(removed).toEqual({ id: 1, name: 'Item 1' });
      expect(result.current.list).toHaveLength(2);
      expect(result.current.list[0]).toEqual({ id: 2, name: 'Item 2' });
    });

    it('should return undefined for empty list', () => {
      const { result } = renderHook(() => useList<TestItem>());

      let removed: TestItem | undefined;
      act(() => {
        removed = result.current.shift();
      });

      expect(removed).toBeUndefined();
      expect(result.current.list).toEqual([]);
    });
  });

  describe('RemoveAt', () => {
    it('should remove item at index', () => {
      const initialList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.removeAt(1);
      });

      expect(result.current.list).toHaveLength(2);
      expect(result.current.list).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 3, name: 'Item 3' },
      ]);
    });

    it('should not modify list for invalid index', () => {
      const initialList = [{ id: 1, name: 'Item 1' }];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.removeAt(10);
      });

      expect(result.current.list).toEqual(initialList);
    });

    it('should not modify list for negative index', () => {
      const initialList = [{ id: 1, name: 'Item 1' }];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.removeAt(-1);
      });

      expect(result.current.list).toEqual(initialList);
    });
  });

  describe('InsertAt', () => {
    it('should insert item at index', () => {
      const { result } = renderHook(() =>
        useList([
          { id: 1, name: 'Item 1' },
          { id: 3, name: 'Item 3' },
        ])
      );

      act(() => {
        result.current.insertAt(1, { id: 2, name: 'Item 2' });
      });

      expect(result.current.list).toHaveLength(3);
      expect(result.current.list[1]).toEqual({ id: 2, name: 'Item 2' });
    });

    it('should insert at beginning', () => {
      const { result } = renderHook(() =>
        useList([{ id: 2, name: 'Item 2' }])
      );

      act(() => {
        result.current.insertAt(0, { id: 1, name: 'Item 1' });
      });

      expect(result.current.list[0]).toEqual({ id: 1, name: 'Item 1' });
    });

    it('should insert at end', () => {
      const { result } = renderHook(() =>
        useList([{ id: 1, name: 'Item 1' }])
      );

      act(() => {
        result.current.insertAt(1, { id: 2, name: 'Item 2' });
      });

      expect(result.current.list[1]).toEqual({ id: 2, name: 'Item 2' });
    });
  });

  describe('UpdateAt', () => {
    it('should update item at index', () => {
      const initialList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.updateAt(0, { id: 1, name: 'Updated Item 1' });
      });

      expect(result.current.list[0]).toEqual({ id: 1, name: 'Updated Item 1' });
    });

    it('should not modify list for invalid index', () => {
      const initialList = [{ id: 1, name: 'Item 1' }];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.updateAt(10, { id: 99, name: 'Invalid' });
      });

      expect(result.current.list).toEqual(initialList);
    });
  });

  describe('Clear', () => {
    it('should clear all items', () => {
      const initialList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.clear();
      });

      expect(result.current.list).toEqual([]);
    });
  });

  describe('Filter', () => {
    it('should filter items by predicate', () => {
      const initialList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.filter((item) => item.id % 2 === 1);
      });

      expect(result.current.list).toHaveLength(2);
      expect(result.current.list).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 3, name: 'Item 3' },
      ]);
    });

    it('should handle filter with no matches', () => {
      const initialList = [{ id: 1, name: 'Item 1' }];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.filter((item) => item.id > 100);
      });

      expect(result.current.list).toEqual([]);
    });
  });

  describe('Sort', () => {
    it('should sort with comparator', () => {
      const initialList = [
        { id: 3, name: 'Item 3' },
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.sort((a, b) => a.id - b.id);
      });

      expect(result.current.list[0].id).toBe(1);
      expect(result.current.list[1].id).toBe(2);
      expect(result.current.list[2].id).toBe(3);
    });

    it('should sort without comparator (default sort)', () => {
      const { result } = renderHook(() => useList([3, 1, 2]));

      act(() => {
        result.current.sort();
      });

      expect(result.current.list).toEqual([1, 2, 3]);
    });
  });

  describe('Reverse', () => {
    it('should reverse list order', () => {
      const initialList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.reverse();
      });

      expect(result.current.list[0]).toEqual({ id: 3, name: 'Item 3' });
      expect(result.current.list[2]).toEqual({ id: 1, name: 'Item 1' });
    });
  });

  describe('Remove', () => {
    it('should remove specific item by reference', () => {
      const item1 = { id: 1, name: 'Item 1' };
      const item2 = { id: 2, name: 'Item 2' };
      const item3 = { id: 3, name: 'Item 3' };
      const { result } = renderHook(() => useList([item1, item2, item3]));

      act(() => {
        result.current.remove(item2);
      });

      expect(result.current.list).toHaveLength(2);
      expect(result.current.list).toEqual([item1, item3]);
    });

    it('should not modify list if item not found', () => {
      const item1 = { id: 1, name: 'Item 1' };
      const item2 = { id: 2, name: 'Item 2' };
      const { result } = renderHook(() => useList([item1]));

      act(() => {
        result.current.remove(item2);
      });

      expect(result.current.list).toEqual([item1]);
    });
  });

  describe('Set', () => {
    it('should replace entire list', () => {
      const initialList = [{ id: 1, name: 'Item 1' }];
      const newList = [
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.set(newList);
      });

      expect(result.current.list).toEqual(newList);
    });
  });

  describe('Reset', () => {
    it('should reset to initial list', () => {
      const initialList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const { result } = renderHook(() => useList(initialList));

      act(() => {
        result.current.clear();
      });

      expect(result.current.list).toEqual([]);

      act(() => {
        result.current.reset();
      });

      expect(result.current.list).toEqual(initialList);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should work for todo list', () => {
      interface Todo {
        id: number;
        text: string;
        completed: boolean;
      }

      const { result } = renderHook(() => useList<Todo>([]));

      // Add todos
      act(() => {
        result.current.push(
          { id: 1, text: 'Task 1', completed: false },
          { id: 2, text: 'Task 2', completed: false }
        );
      });

      expect(result.current.list).toHaveLength(2);

      // Mark as completed
      act(() => {
        result.current.updateAt(0, {
          id: 1,
          text: 'Task 1',
          completed: true,
        });
      });

      expect(result.current.list[0].completed).toBe(true);

      // Remove completed
      act(() => {
        result.current.filter((todo) => !todo.completed);
      });

      expect(result.current.list).toHaveLength(1);
    });

    it('should work for shopping cart', () => {
      interface CartItem {
        id: number;
        name: string;
        quantity: number;
        price: number;
      }

      const { result } = renderHook(() => useList<CartItem>([]));

      // Add items
      act(() => {
        result.current.push({ id: 1, name: 'Product 1', quantity: 1, price: 10 });
      });

      // Update quantity
      act(() => {
        const item = result.current.list[0];
        result.current.updateAt(0, { ...item, quantity: 3 });
      });

      expect(result.current.list[0].quantity).toBe(3);

      // Remove item
      act(() => {
        result.current.removeAt(0);
      });

      expect(result.current.list).toEqual([]);
    });

    it('should work for notification list', () => {
      interface Notification {
        id: number;
        message: string;
        read: boolean;
      }

      const { result } = renderHook(() => useList<Notification>([]));

      // Add notifications (newest first)
      act(() => {
        result.current.unshift({ id: 1, message: 'New message', read: false });
        result.current.unshift({ id: 2, message: 'New like', read: false });
      });

      expect(result.current.list[0].id).toBe(2);

      // Mark all as read
      act(() => {
        result.current.set(
          result.current.list.map((n) => ({ ...n, read: true }))
        );
      });

      expect(result.current.list.every((n) => n.read)).toBe(true);

      // Clear all
      act(() => {
        result.current.clear();
      });

      expect(result.current.list).toEqual([]);
    });
  });
});
