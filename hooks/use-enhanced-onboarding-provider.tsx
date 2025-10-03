/**/**

 * Enhanced Onboarding Provider with detailed state tracking and analytics * Enhanced Onboarding Provider with detailed state tracking and analytics

 */ */

import AsyncStorage from '@react-native-async-storage/async-storage';import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';\n\n// Storage keys\nconst ONBOARDING_STORAGE_KEYS = {\n  COMPLETED: 'onboardingCompleted',\n  STEPS: 'onboardingSteps',\n  PERMISSIONS: 'onboardingPermissions',\n  ANALYTICS: 'onboardingAnalytics',\n} as const;\n\n// Slide definitions\nexport const ONBOARDING_SLIDES = [\n  { id: 'welcome', required: false, canSkip: true },\n  { id: 'features', required: false, canSkip: true },\n  { id: 'privacy', required: false, canSkip: true },\n  { id: 'notifications', required: false, canSkip: true },\n  { id: 'biometric', required: false, canSkip: true },\n  { id: 'personalize', required: false, canSkip: true },\n] as const;\n\ntype SlideId = typeof ONBOARDING_SLIDES[number]['id'];\n\ninterface OnboardingStep {\n  id: SlideId;\n  completed: boolean;\n  skipped: boolean;\n  timestamp?: number;\n  timeSpent?: number;\n}\n\ninterface OnboardingPermissions {\n  biometric: {\n    requested: boolean;\n    granted: boolean;\n    type?: string;\n    timestamp?: number;\n  };\n  notifications: {\n    requested: boolean;\n    granted: boolean;\n    timestamp?: number;\n  };\n}\n\ninterface OnboardingAnalytics {\n  startTime?: number;\n  completionTime?: number;\n  totalTimeSpent?: number;\n  slidesViewed: SlideId[];\n  slidesCompleted: SlideId[];\n  slidesSkipped: SlideId[];\n  dropOffPoint?: SlideId;\n}\n\ninterface OnboardingContextType {\n  // State\n  onboardingCompleted: boolean;\n  checkingOnboarding: boolean;\n  currentSlide: number;\n  totalSlides: number;\n  \n  // Steps tracking\n  steps: Record<SlideId, OnboardingStep>;\n  permissions: OnboardingPermissions;\n  analytics: OnboardingAnalytics;\n  \n  // Navigation\n  goToNextSlide: () => Promise<void>;\n  goToPreviousSlide: () => void;\n  goToSlide: (index: number) => void;\n  skipOnboarding: () => Promise<void>;\n  \n  // State management\n  markSlideCompleted: (slideId: SlideId, timeSpent?: number) => Promise<void>;\n  markSlideSkipped: (slideId: SlideId) => Promise<void>;\n  isSlideCompleted: (slideId: SlideId) => boolean;\n  isSlideSkipped: (slideId: SlideId) => boolean;\n  canGoToNextSlide: () => boolean;\n  \n  // Permissions tracking\n  setBiometricPermission: (granted: boolean, type?: string) => Promise<void>;\n  setNotificationPermission: (granted: boolean) => Promise<void>;\n  \n  // Analytics\n  trackSlideView: (slideId: SlideId) => void;\n  trackSlideCompletion: (slideId: SlideId, timeSpent?: number) => void;\n  trackDropOff: (slideId: SlideId) => void;\n  \n  // Complete onboarding\n  setOnboardingCompleted: (value: boolean) => Promise<void>;\n}\n\nconst OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);\n\nexport function OnboardingProvider({ children }: { children: React.ReactNode }) {\n  // Core state\n  const [onboardingCompleted, setOnboardingCompletedState] = useState(false);\n  const [checkingOnboarding, setCheckingOnboarding] = useState(true);\n  const [currentSlide, setCurrentSlide] = useState(0);\n  \n  // Detailed tracking state\n  const [steps, setSteps] = useState<Record<SlideId, OnboardingStep>>(\n    ONBOARDING_SLIDES.reduce((acc, slide) => {\n      acc[slide.id] = {\n        id: slide.id,\n        completed: false,\n        skipped: false,\n      };\n      return acc;\n    }, {} as Record<SlideId, OnboardingStep>)\n  );\n  \n  const [permissions, setPermissions] = useState<OnboardingPermissions>({\n    biometric: { requested: false, granted: false },\n    notifications: { requested: false, granted: false },\n  });\n  \n  const [analytics, setAnalytics] = useState<OnboardingAnalytics>({\n    slidesViewed: [],\n    slidesCompleted: [],\n    slidesSkipped: [],\n  });\n\n  // Initialize from storage\n  useEffect(() => {\n    const initializeOnboarding = async () => {\n      try {\n        const [completedValue, stepsValue, permissionsValue, analyticsValue] = await Promise.all([\n          AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.COMPLETED),\n          AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.STEPS),\n          AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.PERMISSIONS),\n          AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.ANALYTICS),\n        ]);\n        \n        // Set completion state\n        setOnboardingCompletedState(completedValue === 'true');\n        \n        // Restore steps\n        if (stepsValue) {\n          const savedSteps = JSON.parse(stepsValue);\n          setSteps(prev => ({ ...prev, ...savedSteps }));\n        }\n        \n        // Restore permissions\n        if (permissionsValue) {\n          const savedPermissions = JSON.parse(permissionsValue);\n          setPermissions(prev => ({ ...prev, ...savedPermissions }));\n        }\n        \n        // Restore analytics\n        if (analyticsValue) {\n          const savedAnalytics = JSON.parse(analyticsValue);\n          setAnalytics(prev => ({ ...prev, ...savedAnalytics }));\n        }\n        \n      } catch (error) {\n        console.error('Error initializing onboarding state:', error);\n      } finally {\n        setCheckingOnboarding(false);\n      }\n    };\n    \n    initializeOnboarding();\n  }, []);\n\n  // Save state to storage\n  const saveToStorage = useCallback(async (key: string, value: any) => {\n    try {\n      await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));\n    } catch (error) {\n      console.error(`Error saving ${key} to storage:`, error);\n    }\n  }, []);\n\n  // Navigation functions\n  const goToNextSlide = useCallback(async () => {\n    if (currentSlide < ONBOARDING_SLIDES.length - 1) {\n      const nextSlide = currentSlide + 1;\n      setCurrentSlide(nextSlide);\n      trackSlideView(ONBOARDING_SLIDES[nextSlide].id);\n    } else {\n      await setOnboardingCompleted(true);\n    }\n  }, [currentSlide]);\n\n  const goToPreviousSlide = useCallback(() => {\n    if (currentSlide > 0) {\n      const prevSlide = currentSlide - 1;\n      setCurrentSlide(prevSlide);\n      trackSlideView(ONBOARDING_SLIDES[prevSlide].id);\n    }\n  }, [currentSlide]);\n\n  const goToSlide = useCallback((index: number) => {\n    if (index >= 0 && index < ONBOARDING_SLIDES.length) {\n      setCurrentSlide(index);\n      trackSlideView(ONBOARDING_SLIDES[index].id);\n    }\n  }, []);\n\n  const skipOnboarding = useCallback(async () => {\n    // Mark current slide as drop-off point\n    const currentSlideId = ONBOARDING_SLIDES[currentSlide]?.id;\n    if (currentSlideId) {\n      trackDropOff(currentSlideId);\n    }\n    \n    await setOnboardingCompleted(true);\n  }, [currentSlide]);\n\n  // Step management\n  const markSlideCompleted = useCallback(async (slideId: SlideId, timeSpent?: number) => {\n    const updatedSteps = {\n      ...steps,\n      [slideId]: {\n        ...steps[slideId],\n        completed: true,\n        timestamp: Date.now(),\n        timeSpent,\n      },\n    };\n    \n    setSteps(updatedSteps);\n    await saveToStorage(ONBOARDING_STORAGE_KEYS.STEPS, updatedSteps);\n    \n    // Update analytics\n    trackSlideCompletion(slideId, timeSpent);\n  }, [steps, saveToStorage]);\n\n  const markSlideSkipped = useCallback(async (slideId: SlideId) => {\n    const updatedSteps = {\n      ...steps,\n      [slideId]: {\n        ...steps[slideId],\n        skipped: true,\n        timestamp: Date.now(),\n      },\n    };\n    \n    setSteps(updatedSteps);\n    await saveToStorage(ONBOARDING_STORAGE_KEYS.STEPS, updatedSteps);\n    \n    // Update analytics\n    const updatedAnalytics = {\n      ...analytics,\n      slidesSkipped: [...analytics.slidesSkipped.filter(id => id !== slideId), slideId],\n    };\n    setAnalytics(updatedAnalytics);\n    await saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, updatedAnalytics);\n  }, [steps, analytics, saveToStorage]);\n\n  const isSlideCompleted = useCallback((slideId: SlideId) => {\n    return steps[slideId]?.completed || false;\n  }, [steps]);\n\n  const isSlideSkipped = useCallback((slideId: SlideId) => {\n    return steps[slideId]?.skipped || false;\n  }, [steps]);\n\n  const canGoToNextSlide = useCallback(() => {\n    // Always allow navigation - slides are optional\n    return true;\n  }, []);\n\n  // Permission management\n  const setBiometricPermission = useCallback(async (granted: boolean, type?: string) => {\n    const updatedPermissions = {\n      ...permissions,\n      biometric: {\n        requested: true,\n        granted,\n        type,\n        timestamp: Date.now(),\n      },\n    };\n    \n    setPermissions(updatedPermissions);\n    await saveToStorage(ONBOARDING_STORAGE_KEYS.PERMISSIONS, updatedPermissions);\n  }, [permissions, saveToStorage]);\n\n  const setNotificationPermission = useCallback(async (granted: boolean) => {\n    const updatedPermissions = {\n      ...permissions,\n      notifications: {\n        requested: true,\n        granted,\n        timestamp: Date.now(),\n      },\n    };\n    \n    setPermissions(updatedPermissions);\n    await saveToStorage(ONBOARDING_STORAGE_KEYS.PERMISSIONS, updatedPermissions);\n  }, [permissions, saveToStorage]);\n\n  // Analytics functions\n  const trackSlideView = useCallback((slideId: SlideId) => {\n    const updatedAnalytics = {\n      ...analytics,\n      slidesViewed: [...analytics.slidesViewed.filter(id => id !== slideId), slideId],\n    };\n    setAnalytics(updatedAnalytics);\n    saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, updatedAnalytics);\n  }, [analytics, saveToStorage]);\n\n  const trackSlideCompletion = useCallback((slideId: SlideId, timeSpent?: number) => {\n    const updatedAnalytics = {\n      ...analytics,\n      slidesCompleted: [...analytics.slidesCompleted.filter(id => id !== slideId), slideId],\n    };\n    setAnalytics(updatedAnalytics);\n    saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, updatedAnalytics);\n  }, [analytics, saveToStorage]);\n\n  const trackDropOff = useCallback((slideId: SlideId) => {\n    const updatedAnalytics = {\n      ...analytics,\n      dropOffPoint: slideId,\n    };\n    setAnalytics(updatedAnalytics);\n    saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, updatedAnalytics);\n  }, [analytics, saveToStorage]);\n\n  // Main completion handler\n  const setOnboardingCompleted = useCallback(async (value: boolean) => {\n    try {\n      await saveToStorage(ONBOARDING_STORAGE_KEYS.COMPLETED, String(value));\n      \n      // If completing, record analytics\n      if (value) {\n        const completionAnalytics = {\n          ...analytics,\n          completionTime: Date.now(),\n          totalTimeSpent: analytics.startTime ? Date.now() - analytics.startTime : undefined,\n        };\n        setAnalytics(completionAnalytics);\n        await saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, completionAnalytics);\n      }\n      \n      setOnboardingCompletedState(value);\n    } catch (error) {\n      console.error('Error setting onboarding completion:', error);\n    }\n  }, [analytics, saveToStorage]);\n\n  // Start analytics when onboarding begins\n  useEffect(() => {\n    if (!checkingOnboarding && !onboardingCompleted && !analytics.startTime) {\n      const startAnalytics = {\n        ...analytics,\n        startTime: Date.now(),\n      };\n      setAnalytics(startAnalytics);\n      saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, startAnalytics);\n    }\n  }, [checkingOnboarding, onboardingCompleted, analytics, saveToStorage]);\n\n  // Track initial slide view\n  useEffect(() => {\n    if (!checkingOnboarding && !onboardingCompleted) {\n      const initialSlideId = ONBOARDING_SLIDES[currentSlide]?.id;\n      if (initialSlideId && !analytics.slidesViewed.includes(initialSlideId)) {\n        trackSlideView(initialSlideId);\n      }\n    }\n  }, [checkingOnboarding, onboardingCompleted, currentSlide, analytics.slidesViewed, trackSlideView]);\n\n  const contextValue = useMemo(\n    () => ({\n      // State\n      onboardingCompleted,\n      checkingOnboarding,\n      currentSlide,\n      totalSlides: ONBOARDING_SLIDES.length,\n      \n      // Detailed state\n      steps,\n      permissions,\n      analytics,\n      \n      // Navigation\n      goToNextSlide,\n      goToPreviousSlide,\n      goToSlide,\n      skipOnboarding,\n      \n      // State management\n      markSlideCompleted,\n      markSlideSkipped,\n      isSlideCompleted,\n      isSlideSkipped,\n      canGoToNextSlide,\n      \n      // Permissions\n      setBiometricPermission,\n      setNotificationPermission,\n      \n      // Analytics\n      trackSlideView,\n      trackSlideCompletion,\n      trackDropOff,\n      \n      // Completion\n      setOnboardingCompleted,\n    }),\n    [\n      onboardingCompleted,\n      checkingOnboarding,\n      currentSlide,\n      steps,\n      permissions,\n      analytics,\n      goToNextSlide,\n      goToPreviousSlide,\n      goToSlide,\n      skipOnboarding,\n      markSlideCompleted,\n      markSlideSkipped,\n      isSlideCompleted,\n      isSlideSkipped,\n      canGoToNextSlide,\n      setBiometricPermission,\n      setNotificationPermission,\n      trackSlideView,\n      trackSlideCompletion,\n      trackDropOff,\n      setOnboardingCompleted,\n    ]\n  );\n\n  return <OnboardingContext.Provider value={contextValue}>{children}</OnboardingContext.Provider>;\n}\n\nexport function useOnboarding() {\n  const context = useContext(OnboardingContext);\n  if (context === undefined) {\n    throw new Error('useOnboarding must be used within an OnboardingProvider');\n  }\n  return context;\n}

// Storage keys
const ONBOARDING_STORAGE_KEYS = {
  COMPLETED: 'onboardingCompleted',
  STEPS: 'onboardingSteps',
  PERMISSIONS: 'onboardingPermissions',
  ANALYTICS: 'onboardingAnalytics',
} as const;

// Slide definitions
export const ONBOARDING_SLIDES = [
  { id: 'welcome', required: false, canSkip: true },
  { id: 'features', required: false, canSkip: true },
  { id: 'privacy', required: false, canSkip: true },
  { id: 'notifications', required: false, canSkip: true },
  { id: 'biometric', required: false, canSkip: true },
  { id: 'personalize', required: false, canSkip: true },
] as const;

type SlideId = typeof ONBOARDING_SLIDES[number]['id'];

interface OnboardingStep {
  id: SlideId;
  completed: boolean;
  skipped: boolean;
  timestamp?: number;
  timeSpent?: number;
}

interface OnboardingPermissions {
  biometric: {
    requested: boolean;
    granted: boolean;
    type?: string;
    timestamp?: number;
  };
  notifications: {
    requested: boolean;
    granted: boolean;
    timestamp?: number;
  };
}

interface OnboardingAnalytics {
  startTime?: number;
  completionTime?: number;
  totalTimeSpent?: number;
  slidesViewed: SlideId[];
  slidesCompleted: SlideId[];
  slidesSkipped: SlideId[];
  dropOffPoint?: SlideId;
}

interface OnboardingContextType {
  // State
  onboardingCompleted: boolean;
  checkingOnboarding: boolean;
  currentSlide: number;
  totalSlides: number;
  
  // Steps tracking
  steps: Record<SlideId, OnboardingStep>;
  permissions: OnboardingPermissions;
  analytics: OnboardingAnalytics;
  
  // Navigation
  goToNextSlide: () => Promise<void>;
  goToPreviousSlide: () => void;
  goToSlide: (index: number) => void;
  skipOnboarding: () => Promise<void>;
  
  // State management
  markSlideCompleted: (slideId: SlideId, timeSpent?: number) => Promise<void>;
  markSlideSkipped: (slideId: SlideId) => Promise<void>;
  isSlideCompleted: (slideId: SlideId) => boolean;
  isSlideSkipped: (slideId: SlideId) => boolean;
  canGoToNextSlide: () => boolean;
  
  // Permissions tracking
  setBiometricPermission: (granted: boolean, type?: string) => Promise<void>;
  setNotificationPermission: (granted: boolean) => Promise<void>;
  
  // Analytics
  trackSlideView: (slideId: SlideId) => void;
  trackSlideCompletion: (slideId: SlideId, timeSpent?: number) => void;
  trackDropOff: (slideId: SlideId) => void;
  
  // Complete onboarding
  setOnboardingCompleted: (value: boolean) => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  // Core state
  const [onboardingCompleted, setOnboardingCompletedState] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Detailed tracking state
  const [steps, setSteps] = useState<Record<SlideId, OnboardingStep>>(
    ONBOARDING_SLIDES.reduce((acc, slide) => {
      acc[slide.id] = {
        id: slide.id,
        completed: false,
        skipped: false,
      };
      return acc;
    }, {} as Record<SlideId, OnboardingStep>)
  );
  
  const [permissions, setPermissions] = useState<OnboardingPermissions>({
    biometric: { requested: false, granted: false },
    notifications: { requested: false, granted: false },
  });
  
  const [analytics, setAnalytics] = useState<OnboardingAnalytics>({
    slidesViewed: [],
    slidesCompleted: [],
    slidesSkipped: [],
  });

  // Initialize from storage
  useEffect(() => {
    const initializeOnboarding = async () => {
      try {
        const [completedValue, stepsValue, permissionsValue, analyticsValue] = await Promise.all([
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.COMPLETED),
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.STEPS),
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.PERMISSIONS),
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEYS.ANALYTICS),
        ]);
        
        // Set completion state
        setOnboardingCompletedState(completedValue === 'true');
        
        // Restore steps
        if (stepsValue) {
          const savedSteps = JSON.parse(stepsValue);
          setSteps(prev => ({ ...prev, ...savedSteps }));
        }
        
        // Restore permissions
        if (permissionsValue) {
          const savedPermissions = JSON.parse(permissionsValue);
          setPermissions(prev => ({ ...prev, ...savedPermissions }));
        }
        
        // Restore analytics
        if (analyticsValue) {
          const savedAnalytics = JSON.parse(analyticsValue);
          setAnalytics(prev => ({ ...prev, ...savedAnalytics }));
        }
        
      } catch (error) {
        console.error('Error initializing onboarding state:', error);
      } finally {
        setCheckingOnboarding(false);
      }
    };
    
    initializeOnboarding();
  }, []);

  // Save state to storage
  const saveToStorage = useCallback(async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }, []);

  // Navigation functions
  const goToNextSlide = useCallback(async () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      trackSlideView(ONBOARDING_SLIDES[nextSlide].id);
    } else {
      await setOnboardingCompleted(true);
    }
  }, [currentSlide]);

  const goToPreviousSlide = useCallback(() => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      trackSlideView(ONBOARDING_SLIDES[prevSlide].id);
    }
  }, [currentSlide]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < ONBOARDING_SLIDES.length) {
      setCurrentSlide(index);
      trackSlideView(ONBOARDING_SLIDES[index].id);
    }
  }, []);

  const skipOnboarding = useCallback(async () => {
    // Mark current slide as drop-off point
    const currentSlideId = ONBOARDING_SLIDES[currentSlide]?.id;
    if (currentSlideId) {
      trackDropOff(currentSlideId);
    }
    
    await setOnboardingCompleted(true);
  }, [currentSlide]);

  // Step management
  const markSlideCompleted = useCallback(async (slideId: SlideId, timeSpent?: number) => {
    const updatedSteps = {
      ...steps,
      [slideId]: {
        ...steps[slideId],
        completed: true,
        timestamp: Date.now(),
        timeSpent,
      },
    };
    
    setSteps(updatedSteps);
    await saveToStorage(ONBOARDING_STORAGE_KEYS.STEPS, updatedSteps);
    
    // Update analytics
    trackSlideCompletion(slideId, timeSpent);
  }, [steps, saveToStorage]);

  const markSlideSkipped = useCallback(async (slideId: SlideId) => {
    const updatedSteps = {
      ...steps,
      [slideId]: {
        ...steps[slideId],
        skipped: true,
        timestamp: Date.now(),
      },
    };
    
    setSteps(updatedSteps);
    await saveToStorage(ONBOARDING_STORAGE_KEYS.STEPS, updatedSteps);
    
    // Update analytics
    const updatedAnalytics = {
      ...analytics,
      slidesSkipped: [...analytics.slidesSkipped.filter(id => id !== slideId), slideId],
    };
    setAnalytics(updatedAnalytics);
    await saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, updatedAnalytics);
  }, [steps, analytics, saveToStorage]);

  const isSlideCompleted = useCallback((slideId: SlideId) => {
    return steps[slideId]?.completed || false;
  }, [steps]);

  const isSlideSkipped = useCallback((slideId: SlideId) => {
    return steps[slideId]?.skipped || false;
  }, [steps]);

  const canGoToNextSlide = useCallback(() => {
    // Always allow navigation - slides are optional
    return true;
  }, []);

  // Permission management
  const setBiometricPermission = useCallback(async (granted: boolean, type?: string) => {
    const updatedPermissions = {
      ...permissions,
      biometric: {
        requested: true,
        granted,
        type,
        timestamp: Date.now(),
      },
    };
    
    setPermissions(updatedPermissions);
    await saveToStorage(ONBOARDING_STORAGE_KEYS.PERMISSIONS, updatedPermissions);
  }, [permissions, saveToStorage]);

  const setNotificationPermission = useCallback(async (granted: boolean) => {
    const updatedPermissions = {
      ...permissions,
      notifications: {
        requested: true,
        granted,
        timestamp: Date.now(),
      },
    };
    
    setPermissions(updatedPermissions);
    await saveToStorage(ONBOARDING_STORAGE_KEYS.PERMISSIONS, updatedPermissions);
  }, [permissions, saveToStorage]);

  // Analytics functions
  const trackSlideView = useCallback((slideId: SlideId) => {
    const updatedAnalytics = {
      ...analytics,
      slidesViewed: [...analytics.slidesViewed.filter(id => id !== slideId), slideId],
    };
    setAnalytics(updatedAnalytics);
    saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, updatedAnalytics);
  }, [analytics, saveToStorage]);

  const trackSlideCompletion = useCallback((slideId: SlideId, timeSpent?: number) => {
    const updatedAnalytics = {
      ...analytics,
      slidesCompleted: [...analytics.slidesCompleted.filter(id => id !== slideId), slideId],
    };
    setAnalytics(updatedAnalytics);
    saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, updatedAnalytics);
  }, [analytics, saveToStorage]);

  const trackDropOff = useCallback((slideId: SlideId) => {
    const updatedAnalytics = {
      ...analytics,
      dropOffPoint: slideId,
    };
    setAnalytics(updatedAnalytics);
    saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, updatedAnalytics);
  }, [analytics, saveToStorage]);

  // Main completion handler
  const setOnboardingCompleted = useCallback(async (value: boolean) => {
    try {
      await saveToStorage(ONBOARDING_STORAGE_KEYS.COMPLETED, String(value));
      
      // If completing, record analytics
      if (value) {
        const completionAnalytics = {
          ...analytics,
          completionTime: Date.now(),
          totalTimeSpent: analytics.startTime ? Date.now() - analytics.startTime : undefined,
        };
        setAnalytics(completionAnalytics);
        await saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, completionAnalytics);
      }
      
      setOnboardingCompletedState(value);
    } catch (error) {
      console.error('Error setting onboarding completion:', error);
    }
  }, [analytics, saveToStorage]);

  // Start analytics when onboarding begins
  useEffect(() => {
    if (!checkingOnboarding && !onboardingCompleted && !analytics.startTime) {
      const startAnalytics = {
        ...analytics,
        startTime: Date.now(),
      };
      setAnalytics(startAnalytics);
      saveToStorage(ONBOARDING_STORAGE_KEYS.ANALYTICS, startAnalytics);
    }
  }, [checkingOnboarding, onboardingCompleted, analytics, saveToStorage]);

  // Track initial slide view
  useEffect(() => {
    if (!checkingOnboarding && !onboardingCompleted) {
      const initialSlideId = ONBOARDING_SLIDES[currentSlide]?.id;
      if (initialSlideId && !analytics.slidesViewed.includes(initialSlideId)) {
        trackSlideView(initialSlideId);
      }
    }
  }, [checkingOnboarding, onboardingCompleted, currentSlide, analytics.slidesViewed, trackSlideView]);

  const contextValue = useMemo(
    () => ({
      // State
      onboardingCompleted,
      checkingOnboarding,
      currentSlide,
      totalSlides: ONBOARDING_SLIDES.length,
      
      // Detailed state
      steps,
      permissions,
      analytics,
      
      // Navigation
      goToNextSlide,
      goToPreviousSlide,
      goToSlide,
      skipOnboarding,
      
      // State management
      markSlideCompleted,
      markSlideSkipped,
      isSlideCompleted,
      isSlideSkipped,
      canGoToNextSlide,
      
      // Permissions
      setBiometricPermission,
      setNotificationPermission,
      
      // Analytics
      trackSlideView,
      trackSlideCompletion,
      trackDropOff,
      
      // Completion
      setOnboardingCompleted,
    }),
    [
      onboardingCompleted,
      checkingOnboarding,
      currentSlide,
      steps,
      permissions,
      analytics,
      goToNextSlide,
      goToPreviousSlide,
      goToSlide,
      skipOnboarding,
      markSlideCompleted,
      markSlideSkipped,
      isSlideCompleted,
      isSlideSkipped,
      canGoToNextSlide,
      setBiometricPermission,
      setNotificationPermission,
      trackSlideView,
      trackSlideCompletion,
      trackDropOff,
      setOnboardingCompleted,
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