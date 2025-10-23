import { useAlert } from '@/hooks/use-alert';
import i18n from '@/i18n';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';

export interface UseUnsavedChangesOptions {
  /**
   * Whether changes have been made
   */
  hasChanges: boolean;
  /**
   * Callback to save changes
   */
  onSave?: () => void | Promise<void>;
  /**
   * Callback to discard changes
   */
  onDiscard?: () => void;
  /**
   * Custom warning message
   */
  warningMessage?: string;
  /**
   * Whether to show warning on back button press
   * @default true
   */
  warnOnBack?: boolean;
}

/**
 * Hook to warn users about unsaved changes before navigation
 * 
 * Provides protection against accidental data loss by warning users
 * when they try to navigate away from a form with unsaved changes.
 * 
 * @param options - Configuration options
 * @returns Methods to control unsaved changes behavior
 * 
 * @example
 * ```tsx
 * function EditProfileScreen() {
 *   const [name, setName] = useState('');
 *   const [hasChanges, setHasChanges] = useState(false);
 *   
 *   const { promptIfUnsaved } = useUnsavedChanges({
 *     hasChanges,
 *     onSave: async () => {
 *       await saveProfile();
 *       setHasChanges(false);
 *     },
 *   });
 * 
 *   return (
 *     <View>
 *       <TextInput value={name} onChangeText={(text) => {
 *         setName(text);
 *         setHasChanges(true);
 *       }} />
 *       <Button title="Save" onPress={onSave} />
 *     </View>
 *   );
 * }
 * ```
 */
export function useUnsavedChanges(options: UseUnsavedChangesOptions) {
  const {
    hasChanges,
    onSave,
    onDiscard,
    warningMessage,
    warnOnBack = true,
  } = options;

  const alert = useAlert();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const hasPromptedRef = useRef(false);

  // Get warning message
  const getWarningMessage = useCallback(() => {
    return (
      warningMessage ||
      i18n.t('common.unsavedChanges.message') ||
      'You have unsaved changes. Do you want to save them before leaving?'
    );
  }, [warningMessage]);

  // Prompt user about unsaved changes
  const promptIfUnsaved = useCallback(
    async (callback?: () => void) => {
      if (!hasChanges || hasPromptedRef.current) {
        callback?.();
        return true;
      }

      return new Promise<boolean>((resolve) => {
        hasPromptedRef.current = true;

        alert.show(
          i18n.t('common.unsavedChanges.title') || 'Unsaved Changes',
          getWarningMessage(),
          [
            {
              text: i18n.t('common.discard') || 'Discard',
              onPress: () => {
                onDiscard?.();
                hasPromptedRef.current = false;
                callback?.();
                resolve(true);
              },
              style: 'destructive',
            },
            {
              text: i18n.t('common.save') || 'Save',
              onPress: async () => {
                if (onSave) {
                  setIsSaving(true);
                  try {
                    await onSave();
                    hasPromptedRef.current = false;
                    callback?.();
                    resolve(true);
                  } catch (_error) {
                    console.error('Error saving changes:', error);
                    resolve(false);
                  } finally {
                    setIsSaving(false);
                  }
                } else {
                  hasPromptedRef.current = false;
                  callback?.();
                  resolve(true);
                }
              },
            },
            {
              text: i18n.t('common.cancel') || 'Cancel',
              onPress: () => {
                hasPromptedRef.current = false;
                resolve(false);
              },
              style: 'cancel',
            },
          ]
        );
      });
    },
    [hasChanges, getWarningMessage, onSave, onDiscard, alert]
  );

  // Handle navigation back with unsaved changes
  const handleNavigateBack = useCallback(() => {
    if (hasChanges && warnOnBack) {
      promptIfUnsaved(() => {
        router.back();
      });
      return true; // Prevent default back behavior
    }
    return false;
  }, [hasChanges, warnOnBack, promptIfUnsaved, router]);

  // Setup back handler
  useEffect(() => {
    if (warnOnBack && hasChanges) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleNavigateBack
      );

      return () => backHandler.remove();
    }
  }, [warnOnBack, hasChanges, handleNavigateBack]);

  // Reset prompted flag when changes are saved
  useEffect(() => {
    if (!hasChanges) {
      hasPromptedRef.current = false;
    }
  }, [hasChanges]);

  return {
    /**
     * Prompt user if there are unsaved changes
     */
    promptIfUnsaved,
    /**
     * Whether currently saving
     */
    isSaving,
    /**
     * Handle navigation back
     */
    handleNavigateBack,
  };
}

/**
 * Hook to track form changes and warn on navigation
 * 
 * @param initialValues - Initial form values
 * @param currentValues - Current form values
 * @param onSave - Save callback
 * @returns Unsaved changes state and methods
 * 
 * @example
 * ```tsx
 * const { hasChanges, promptIfUnsaved } = useFormUnsavedChanges(
 *   { name: 'John', email: 'john@example.com' },
 *   { name, email },
 *   async () => {
 *     await saveProfile({ name, email });
 *   }
 * );
 * ```
 */
export function useFormUnsavedChanges<T extends Record<string, any>>(
  initialValues: T,
  currentValues: T,
  onSave?: () => void | Promise<void>
) {
  const hasChanges = JSON.stringify(initialValues) !== JSON.stringify(currentValues);

  return useUnsavedChanges({
    hasChanges,
    onSave,
  });
}
