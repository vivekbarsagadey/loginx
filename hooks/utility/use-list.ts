import { useCallback, useState } from "react";

/**
 * Return type for the useList hook.
 */
export interface UseListReturn<T> {
  /** Current list */
  list: T[];
  /** Set entire list to new value */
  set: (newList: T[]) => void;
  /** Add item(s) to end of list */
  push: (...items: T[]) => void;
  /** Remove and return last item */
  pop: () => T | undefined;
  /** Add item(s) to beginning of list */
  unshift: (...items: T[]) => void;
  /** Remove and return first item */
  shift: () => T | undefined;
  /** Remove item at index */
  removeAt: (index: number) => void;
  /** Insert item at index */
  insertAt: (index: number, item: T) => void;
  /** Update item at index */
  updateAt: (index: number, item: T) => void;
  /** Clear entire list */
  clear: () => void;
  /** Filter list by predicate */
  filter: (predicate: (item: T, index: number) => boolean) => void;
  /** Sort list by comparator */
  sort: (comparator?: (a: T, b: T) => number) => void;
  /** Reverse list order */
  reverse: () => void;
  /** Remove specific item (by reference) */
  remove: (item: T) => void;
  /** Reset to initial list */
  reset: () => void;
}

/**
 * A hook for managing array/list state with helpful mutation methods.
 * 
 * This hook provides a comprehensive set of array manipulation methods,
 * making it easy to manage lists without writing repetitive state updates.
 * 
 * @param initialList - The initial array value
 * @returns List state and manipulation functions
 * 
 * @example
 * ```typescript
 * // Basic list operations
 * function TodoList() {
 *   const { list, push, removeAt, clear } = useList<Todo>([]);
 * 
 *   const addTodo = (text: string) => {
 *     push({ id: Date.now(), text, completed: false });
 *   };
 * 
 *   return (
 *     <>
 *       {list.map((todo, index) => (
 *         <TodoItem 
 *           key={todo.id} 
 *           todo={todo} 
 *           onRemove={() => removeAt(index)} 
 *         />
 *       ))}
 *       <Button onPress={() => addTodo('New Task')}>Add</Button>
 *       <Button onPress={clear}>Clear All</Button>
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Advanced list operations
 * function ShoppingCart() {
 *   const { list, updateAt, filter, sort } = useList<CartItem>([]);
 * 
 *   const updateQuantity = (index: number, quantity: number) => {
 *     updateAt(index, { ...list[index], quantity });
 *   };
 * 
 *   const removeOutOfStock = () => {
 *     filter(item => item.inStock);
 *   };
 * 
 *   const sortByPrice = () => {
 *     sort((a, b) => a.price - b.price);
 *   };
 * 
 *   return (
 *     <>
 *       {list.map((item, index) => (
 *         <CartItem key={item.id} item={item} onUpdate={updateQuantity} />
 *       ))}
 *     </>
 *   );
 * }
 * ```
 */
export function useList<T>(initialList: T[] = []): UseListReturn<T> {
  const [list, setList] = useState<T[]>(initialList);

  const set = useCallback((newList: T[]) => {
    setList(newList);
  }, []);

  const push = useCallback((...items: T[]) => {
    setList((prev) => [...prev, ...items]);
  }, []);

  const pop = useCallback((): T | undefined => {
    let item: T | undefined;
    setList((prev) => {
      if (prev.length === 0) {return prev;}
      item = prev[prev.length - 1];
      return prev.slice(0, -1);
    });
    return item;
  }, []);

  const unshift = useCallback((...items: T[]) => {
    setList((prev) => [...items, ...prev]);
  }, []);

  const shift = useCallback((): T | undefined => {
    let item: T | undefined;
    setList((prev) => {
      if (prev.length === 0) {return prev;}
      item = prev[0];
      return prev.slice(1);
    });
    return item;
  }, []);

  const removeAt = useCallback((index: number) => {
    setList((prev) => {
      if (index < 0 || index >= prev.length) {return prev;}
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  }, []);

  const insertAt = useCallback((index: number, item: T) => {
    setList((prev) => {
      const clampedIndex = Math.max(0, Math.min(index, prev.length));
      return [
        ...prev.slice(0, clampedIndex),
        item,
        ...prev.slice(clampedIndex),
      ];
    });
  }, []);

  const updateAt = useCallback((index: number, item: T) => {
    setList((prev) => {
      if (index < 0 || index >= prev.length) {return prev;}
      const newList = [...prev];
      newList[index] = item;
      return newList;
    });
  }, []);

  const clear = useCallback(() => {
    setList([]);
  }, []);

  const filter = useCallback(
    (predicate: (item: T, index: number) => boolean) => {
      setList((prev) => prev.filter(predicate));
    },
    []
  );

  const sort = useCallback((comparator?: (a: T, b: T) => number) => {
    setList((prev) => {
      const newList = [...prev];
      newList.sort(comparator);
      return newList;
    });
  }, []);

  const reverse = useCallback(() => {
    setList((prev) => [...prev].reverse());
  }, []);

  const remove = useCallback((item: T) => {
    setList((prev) => prev.filter((i) => i !== item));
  }, []);

  const reset = useCallback(() => {
    setList(initialList);
  }, [initialList]);

  return {
    list,
    set,
    push,
    pop,
    unshift,
    shift,
    removeAt,
    insertAt,
    updateAt,
    clear,
    filter,
    sort,
    reverse,
    remove,
    reset,
  };
}
