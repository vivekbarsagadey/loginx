import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Storage keys for onboarding data
const STORAGE_KEYS = {
  COMPLETED: 'onboardingCompleted',
  PERMISSIONS: 'onboardingPermissions',
  ANALYTICS: 'onboardingAnalytics',
} as const;

interface OnboardingPermissions {
  biometric: {
    requested: boolean;
    granted: boolean;
    type?: string;
  };
  notifications: {
    requested: boolean;
    granted: boolean;
  };
}

interface OnboardingStepAnalytics {
  id: string;
  startTime: number;
  completionTime?: number;
  timeSpent?: number;
  interactionCount: number;
  wasSkipped: boolean;
}

interface OnboardingAnalytics {
  startTime?: number;
  completionTime?: number;
  totalTimeSpent?: number;
  slidesCompleted: string[];
  slidesSkipped: string[];
  stepDetails: OnboardingStepAnalytics[];
  crashRecovery?: {
    lastSlide: string;
    timestamp: number;
    recovered: boolean;
  };
  deviceInfo?: {
    platform: string;
    screenSize: string;
    accessibilityEnabled: boolean;
  };
}

interface OnboardingContextType {
  onboardingCompleted: boolean;
  setOnboardingCompleted: (value: boolean) => void;
  checkingOnboarding: boolean;

  // Permission tracking
  permissions: OnboardingPermissions;
  setBiometricPermission: (granted: boolean, type?: string) => Promise<void>;
  setNotificationPermission: (granted: boolean) => Promise<void>;

  // Enhanced Analytics
  analytics: OnboardingAnalytics;
  trackSlideCompletion: (slideId: string) => Promise<void>;
  trackSlideSkip: (slideId: string) => Promise<void>;
  trackSlideStart: (slideId: string) => Promise<void>;
  trackSlideInteraction: (slideId: string) => Promise<void>;
  getSlideProgress: () => { completed: number; total: number };

  // Crash Recovery
  saveCurrentSlide: (slideId: string) => Promise<void>;
  getLastIncompleteSlide: () => string | null;
  markRecoveryComplete: () => Promise<void>;

  // State Management
  currentSlide: string | null;
  completedSteps: Set<string>;
  canSkipSlide: (slideId: string) => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [onboardingCompleted, setOnboardingCompletedState] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Permission and analytics state
  const [permissions, setPermissions] = useState<OnboardingPermissions>({
    biometric: { requested: false, granted: false },
    notifications: { requested: false, granted: false },
  });

  const [analytics, setAnalytics] = useState<OnboardingAnalytics>({
    slidesCompleted: [],
    slidesSkipped: [],
    stepDetails: [],
  });

  const [currentSlide, setCurrentSlide] = useState<string | null>(null);
  const [completedSteps, _setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initializeOnboarding = async () => {
      try {
        const [completedValue, permissionsValue, analyticsValue] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.COMPLETED),
          AsyncStorage.getItem(STORAGE_KEYS.PERMISSIONS),
          AsyncStorage.getItem(STORAGE_KEYS.ANALYTICS),
        ]);

        // Set completion state
        setOnboardingCompletedState(completedValue === 'true');

        // Restore permissions
        if (permissionsValue) {
          const savedPermissions = JSON.parse(permissionsValue);
          setPermissions(savedPermissions);
        }

        // Restore analytics
        if (analyticsValue) {
          const savedAnalytics = JSON.parse(analyticsValue);
          setAnalytics(savedAnalytics);
        }
      } catch (error: unknown) {
        // handle error silently
      } finally {
        setCheckingOnboarding(false);
      }
    };
    initializeOnboarding();
  }, []);

  // Helper function to save data to storage
  const saveToStorage = useCallback(async (key: string, data: OnboardingPermissions | OnboardingAnalytics) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error: unknown) {
      // handle error silently
    }
  }, []);

  const setOnboardingCompleted = useCallback(
    async (value: boolean) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED, String(value));

        // Record completion time in analytics
        if (value && !analytics.completionTime) {
          const updatedAnalytics = {
            ...analytics,
            completionTime: Date.now(),
          };
          setAnalytics(updatedAnalytics);
          await saveToStorage(STORAGE_KEYS.ANALYTICS, updatedAnalytics);
        }

        setOnboardingCompletedState(value);
      } catch (error: unknown) {
        // handle error silently
      }
    },
    [analytics, saveToStorage]
  );

  const setBiometricPermission = useCallback(
    async (granted: boolean, type?: string) => {
      const updatedPermissions = {
        ...permissions,
        biometric: {
          requested: true,
          granted,
          type,
        },
      };
      setPermissions(updatedPermissions);
      await saveToStorage(STORAGE_KEYS.PERMISSIONS, updatedPermissions);
    },
    [permissions, saveToStorage]
  );

  const setNotificationPermission = useCallback(
    async (granted: boolean) => {
      const updatedPermissions = {
        ...permissions,
        notifications: {
          requested: true,
          granted,
        },
      };
      setPermissions(updatedPermissions);
      await saveToStorage(STORAGE_KEYS.PERMISSIONS, updatedPermissions);
    },
    [permissions, saveToStorage]
  );

  const trackSlideCompletion = useCallback(
    async (slideId: string) => {
      const updatedAnalytics = {
        ...analytics,
        slidesCompleted: [...analytics.slidesCompleted.filter((id) => id !== slideId), slideId],
      };
      setAnalytics(updatedAnalytics);
      await saveToStorage(STORAGE_KEYS.ANALYTICS, updatedAnalytics);
    },
    [analytics, saveToStorage]
  );

  const trackSlideSkip = useCallback(
    async (slideId: string) => {
      const currentTime = Date.now();
      const stepDetail = analytics.stepDetails.find((s) => s.id === slideId);
      const timeSpent = stepDetail ? currentTime - stepDetail.startTime : 0;

      const updatedStepDetails = analytics.stepDetails.map((s) => (s.id === slideId ? { ...s, wasSkipped: true, completionTime: currentTime, timeSpent } : s));

      const updatedAnalytics = {
        ...analytics,
        slidesSkipped: [...analytics.slidesSkipped.filter((id) => id !== slideId), slideId],
        stepDetails: updatedStepDetails,
      };
      setAnalytics(updatedAnalytics);
      await saveToStorage(STORAGE_KEYS.ANALYTICS, updatedAnalytics);
    },
    [analytics, saveToStorage]
  );

  const saveCurrentSlide = useCallback(async (slideId: string) => {
    try {
      await AsyncStorage.setItem('currentOnboardingSlide', slideId);
    } catch (error: unknown) {
      // handle error silently
    }
  }, []);

  const trackSlideStart = useCallback(
    async (slideId: string) => {
      setCurrentSlide(slideId);
      await saveCurrentSlide(slideId);

      const existingStep = analytics.stepDetails.find((s) => s.id === slideId);
      if (!existingStep) {
        const newStep: OnboardingStepAnalytics = {
          id: slideId,
          startTime: Date.now(),
          interactionCount: 0,
          wasSkipped: false,
        };

        const updatedAnalytics = {
          ...analytics,
          stepDetails: [...analytics.stepDetails, newStep],
        };
        setAnalytics(updatedAnalytics);
        await saveToStorage(STORAGE_KEYS.ANALYTICS, updatedAnalytics);
      }
    },
    [analytics, saveToStorage, saveCurrentSlide]
  );

  const trackSlideInteraction = useCallback(
    async (slideId: string) => {
      const updatedStepDetails = analytics.stepDetails.map((s) => (s.id === slideId ? { ...s, interactionCount: s.interactionCount + 1 } : s));

      const updatedAnalytics = {
        ...analytics,
        stepDetails: updatedStepDetails,
      };
      setAnalytics(updatedAnalytics);
      await saveToStorage(STORAGE_KEYS.ANALYTICS, updatedAnalytics);
    },
    [analytics, saveToStorage]
  );

  const getLastIncompleteSlide = useCallback((): string | null => {
    if (analytics.crashRecovery && !analytics.crashRecovery.recovered) {
      return analytics.crashRecovery.lastSlide;
    }
    return null;
  }, [analytics.crashRecovery]);

  const markRecoveryComplete = useCallback(async () => {
    if (analytics.crashRecovery) {
      const updatedAnalytics = {
        ...analytics,
        crashRecovery: {
          ...analytics.crashRecovery,
          recovered: true,
        },
      };
      setAnalytics(updatedAnalytics);
      await saveToStorage(STORAGE_KEYS.ANALYTICS, updatedAnalytics);
    }
  }, [analytics, saveToStorage]);

  const getSlideProgress = useCallback(() => {
    const completed = analytics.slidesCompleted.length;
    const total = 8; // Total number of slides
    return { completed, total };
  }, [analytics.slidesCompleted]);

  const canSkipSlide = useCallback((slideId: string) => {
    // Core slides cannot be skipped
    const nonSkippableSlides = ['welcome', 'completion'];
    return !nonSkippableSlides.includes(slideId);
  }, []);

  // Initialize analytics start time
  useEffect(() => {
    if (!checkingOnboarding && !onboardingCompleted && !analytics.startTime) {
      const updatedAnalytics = {
        ...analytics,
        startTime: Date.now(),
      };
      setAnalytics(updatedAnalytics);
      saveToStorage(STORAGE_KEYS.ANALYTICS, updatedAnalytics);
    }
  }, [checkingOnboarding, onboardingCompleted, analytics, saveToStorage]);

  const contextValue = useMemo(
    () => ({
      onboardingCompleted,
      setOnboardingCompleted,
      checkingOnboarding,
      permissions,
      setBiometricPermission,
      setNotificationPermission,
      analytics,
      trackSlideCompletion,
      trackSlideSkip,
      trackSlideStart,
      trackSlideInteraction,
      getSlideProgress,
      saveCurrentSlide,
      getLastIncompleteSlide,
      markRecoveryComplete,
      currentSlide,
      completedSteps,
      canSkipSlide,
    }),
    [
      onboardingCompleted,
      setOnboardingCompleted,
      checkingOnboarding,
      permissions,
      setBiometricPermission,
      setNotificationPermission,
      analytics,
      trackSlideCompletion,
      trackSlideSkip,
      trackSlideStart,
      trackSlideInteraction,
      getSlideProgress,
      saveCurrentSlide,
      getLastIncompleteSlide,
      markRecoveryComplete,
      currentSlide,
      completedSteps,
      canSkipSlide,
    ]
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
