import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface OnboardingContextType {
  onboardingCompleted: boolean;
  setOnboardingCompleted: (value: boolean) => void;
  checkingOnboarding: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('onboardingCompleted');
        setOnboardingCompleted(value === 'true');
      } catch (_error) {
        // handle error silently
      } finally {
        setCheckingOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  const handleSetOnboardingCompleted = useCallback(async (value: boolean) => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', String(value));
      setOnboardingCompleted(value);
    } catch (_error) {
      // handle error silently
    }
  }, []);

  const contextValue = useMemo(
    () => ({ onboardingCompleted, setOnboardingCompleted: handleSetOnboardingCompleted, checkingOnboarding }),
    [onboardingCompleted, handleSetOnboardingCompleted, checkingOnboarding]
  );

  return <OnboardingContext.Provider value={contextValue}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
