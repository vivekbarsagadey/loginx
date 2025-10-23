import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

/**
 * A hook for managing data in AsyncStorage (React Native's local storage).
 * 
 * This hook provides a React state-like interface for AsyncStorage,
 * automatically persisting state changes and loading initial values.
 * 
 * @param key - The storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue, remove, loading, error]
 * 
 * @example
 * ```typescript
 * // Basic usage
 * function UserPreferences() {
 *   const [theme, setTheme, removeTheme] = useLocalStorage<string>(
 *     'user-theme',
 *     'light'
 *   );
 * 
 *   return (
 *     <View>
 *       <Text>Current Theme: {theme}</Text>
 *       <Button onPress={() => setTheme('dark')}>Dark Mode</Button>
 *       <Button onPress={() => setTheme('light')}>Light Mode</Button>
 *       <Button onPress={removeTheme}>Reset</Button>
 *     </View>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Complex object storage
 * function ShoppingCart() {
 *   const [cart, setCart, clearCart, loading] = useLocalStorage<CartItem[]>(
 *     'shopping-cart',
 *     []
 *   );
 * 
 *   const addItem = (item: CartItem) => {
 *     setCart([...cart, item]);
 *   };
 * 
 *   if (loading) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   return (
 *     <View>
 *       <FlatList data={cart} renderItem={({ item }) => <CartItem item={item} />} />
 *       <Button onPress={clearCart}>Clear Cart</Button>
 *     </View>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Form draft auto-save
 * function DraftEditor() {
 *   const [draft, setDraft] = useLocalStorage<string>(
 *     'draft-content',
 *     ''
 *   );
 * 
 *   // Auto-save on change
 *   const handleTextChange = (text: string) => {
 *     setDraft(text);
 *   };
 * 
 *   return (
 *     <TextInput
 *       value={draft}
 *       onChangeText={handleTextChange}
 *       placeholder="Your draft is auto-saved"
 *     />
 *   );
 * }
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [
  T,
  (value: T | ((prev: T) => T)) => Promise<void>,
  () => Promise<void>,
  boolean,
  Error | null
] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial value from storage
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        setLoading(true);
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item) as T);
        }
      } catch (_err) {
        setError(
          _error instanceof Error ? _error : new Error("Failed to load from storage")
        );
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  // Set value in state and storage
  const setValue = useCallback(
    async (value: T | ((prev: T) => T)) => {
      try {
        setError(null);
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (_err) {
        setError(
          _error instanceof Error ? _error : new Error("Failed to save to storage")
        );
      }
    },
    [key, storedValue]
  );

  // Remove value from storage
  const remove = useCallback(async () => {
    try {
      setError(null);
      setStoredValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (_err) {
      setError(
        _error instanceof Error ? _error : new Error("Failed to remove from storage")
      );
    }
  }, [key, initialValue]);

  return [storedValue, setValue, remove, loading, error];
}
