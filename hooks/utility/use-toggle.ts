import { useCallback, useState } from 'react';

/**
 * A hook for toggling a boolean value.
 *
 * This hook provides a simple way to toggle between true/false states,
 * commonly used for UI elements like modals, menus, accordions, etc.
 *
 * @param initialValue - The initial boolean value (default: false)
 * @returns A tuple containing [current value, toggle function, setValue function]
 *
 * @example
 * ```typescript
 * function Modal() {
 *   const [isOpen, toggle, setIsOpen] = useToggle(false);
 *
 *   return (
 *     <>
 *       <Button onPress={toggle}>Toggle Modal</Button>
 *       <Button onPress={() => setIsOpen(true)}>Open Modal</Button>
 *       {isOpen && <ModalContent onClose={toggle} />}
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With initial value
 * const [isVisible, toggleVisible] = useToggle(true);
 *
 * // Toggle: true -> false -> true
 * toggleVisible();
 * ```
 */
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
