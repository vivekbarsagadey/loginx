import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

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
      } catch (e) {
        // handle error
      } finally {
        setCheckingOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  const handleSetOnboardingCompleted = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', String(value));
      setOnboardingCompleted(value);
    } catch (e) {
      // handle error
    }
  };

  return <OnboardingContext.Provider value={{ onboardingCompleted, setOnboardingCompleted: handleSetOnboardingCompleted, checkingOnboarding }}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
