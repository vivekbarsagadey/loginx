import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

/**
 * A hook for managing sensitive data in SecureStore (encrypted storage).
 * 
 * This hook provides a React state-like interface for Expo's SecureStore,
 * which encrypts data before storing it. Use this for sensitive information
 * like authentication tokens, API keys, or user credentials.
 * 
 * **Note**: SecureStore is only available on iOS and Android devices (not web or simulator).
 * 
 * @param key - The storage key (unique identifier)
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue, remove, loading, error]
 * 
 * @example
 * ```typescript
 * // Storing auth token
 * function AuthToken() {
 *   const [token, setToken, removeToken, loading] = useSecureStorage<string>(
 *     'auth-token',
 *     ''
 *   );
 * 
 *   const login = async (email: string, password: string) => {
 *     const { token } = await api.login(email, password);
 *     await setToken(token);
 *   };
 * 
 *   const logout = async () => {
 *     await removeToken();
 *   };
 * 
 *   return (
 *     <View>
 *       <Text>Token: {token ? 'Authenticated' : 'Not logged in'}</Text>
 *       <Button onPress={logout}>Logout</Button>
 *     </View>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Storing API key
 * function ApiKeyManager() {
 *   const [apiKey, setApiKey, removeApiKey] = useSecureStorage<string>(
 *     'api-key',
 *     ''
 *   );
 * 
 *   return (
 *     <View>
 *       <TextInput
 *         value={apiKey}
 *         onChangeText={setApiKey}
 *         secureTextEntry
 *         placeholder="Enter API Key"
 *       />
 *       <Button onPress={removeApiKey}>Clear</Button>
 *     </View>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Storing user credentials
 * function RememberMe() {
 *   const [credentials, setCredentials] = useSecureStorage<{
 *     email: string;
 *     password: string;
 *   }>('user-credentials', { email: '', password: '' });
 * 
 *   const saveCredentials = async (email: string, password: string) => {
 *     await setCredentials({ email, password });
 *   };
 * 
 *   return (
 *     <View>
 *       <Text>Email: {credentials.email}</Text>
 *       <Button onPress={() => saveCredentials('user@example.com', 'pass123')}>
 *         Save
 *       </Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useSecureStorage<T>(
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

  // Load initial value from secure storage
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        setLoading(true);
        const item = await SecureStore.getItemAsync(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item) as T);
        }
      } catch (_error) {
        setError(
          _error instanceof Error
            ? _error
            : new Error("Failed to load from secure storage")
        );
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  // Set value in state and secure storage
  const setValue = useCallback(
    async (value: T | ((prev: T) => T)) => {
      try {
        setError(null);
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await SecureStore.setItemAsync(key, JSON.stringify(valueToStore));
      } catch (_error) {
        setError(
          _error instanceof Error
            ? _error
            : new Error("Failed to save to secure storage")
        );
      }
    },
    [key, storedValue]
  );

  // Remove value from secure storage
  const remove = useCallback(async () => {
    try {
      setError(null);
      setStoredValue(initialValue);
      await SecureStore.deleteItemAsync(key);
    } catch (_error) {
      setError(
        _error instanceof Error
          ? _error
          : new Error("Failed to remove from secure storage")
      );
    }
  }, [key, initialValue]);

  return [storedValue, setValue, remove, loading, error];
}
