import { createUserProfile } from '@/actions/user.action';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SocialSignInButtons } from '@/components/ui/social-sign-in-buttons';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useSocialAuth } from '@/hooks/use-social-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { showError } from '@/utils/error';
import { logStateChange, runRegistrationDiagnostics } from '@/utils/registration-diagnostics';
import { sanitizeEmail, sanitizeUserInput } from '@/utils/sanitize';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { z } from 'zod';
import RegisterStep1 from './step-1';
import RegisterStep2 from './step-2';
import RegisterStep3 from './step-3';
import RegisterStep4 from './step-4';

const STEPS = [
  { id: 'step-1', title: 'Personal Information', component: RegisterStep1, fields: ['firstName', 'lastName', 'photoURL', 'termsAccepted', 'referralCode'] },
  { id: 'step-2', title: 'Account Security', component: RegisterStep2, fields: ['email', 'password', 'confirmPassword'] },
  { id: 'step-3', title: 'Address', component: RegisterStep3, fields: ['address', 'city', 'state', 'zipCode'] },
  { id: 'step-4', title: 'Phone Verification', component: RegisterStep4, fields: ['phoneNumber'] },
];

const schema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    photoURL: z.string().optional().or(z.literal('')),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and privacy policy',
    }),
    referralCode: z
      .string()
      .regex(/^[A-Z0-9]{6,12}$/, 'Referral code must be 6-12 alphanumeric characters')
      .optional()
      .or(z.literal('')),
    email: z.string().email('Please enter a valid email address.').max(254, 'Email is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .max(128, 'Password is too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      ),
    confirmPassword: z.string(),
    address: z.string().max(200, 'Address is too long').optional().or(z.literal('')),
    city: z.string().max(100, 'City is too long').optional().or(z.literal('')),
    state: z.string().max(100, 'State is too long').optional().or(z.literal('')),
    zipCode: z.string().max(10, 'Zip code is too long').optional().or(z.literal('')),
    phoneNumber: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

const RegisterContext = createContext<{
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goNext: () => void;
  goPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}>({
  currentStep: 0,
  setCurrentStep: () => {},
  goNext: () => {},
  goPrev: () => {},
  isFirstStep: true,
  isLastStep: false,
  isSubmitting: false,
});

export const useRegister = () => useContext(RegisterContext);

export default function RegisterScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signInWithGoogle, signInWithApple, loading: socialLoading } = useSocialAuth();

  // Run diagnostics on mount (development only)
  useEffect(() => {
    runRegistrationDiagnostics();
  }, []);

  // Log step changes for debugging
  useEffect(() => {
    logStateChange('RegisterScreen', 'currentStep', currentStep - 1, currentStep);
  }, [currentStep]);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      photoURL: '',
      termsAccepted: false,
      referralCode: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
    },
  });

  const { handleSubmit, trigger, formState } = methods;

  const goNext = async () => {
    const fields = STEPS[currentStep].fields;
    const isValid = await trigger(fields as (keyof FormData)[]);

    if (isValid) {
      // Haptic feedback for successful validation
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    } else {
      // Haptic feedback for validation error
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep - 1);
    } else {
      // Confirm before leaving registration
      Alert.alert('Cancel Registration?', 'Are you sure you want to cancel? Your progress will be lost.', [
        {
          text: 'Continue Registering',
          style: 'cancel',
        },
        {
          text: 'Cancel Registration',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.back();
          },
        },
      ]);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize all user inputs before submission
      const sanitizedData = {
        firstName: sanitizeUserInput(data.firstName, 50),
        lastName: sanitizeUserInput(data.lastName, 50),
        photoURL: data.photoURL || '',
        termsAccepted: data.termsAccepted,
        termsAcceptedAt: new Date().toISOString(),
        referralCode: data.referralCode ? sanitizeUserInput(data.referralCode, 12) : '',
        email: sanitizeEmail(data.email),
        password: data.password, // Don't sanitize password (Firebase handles it)
        address: data.address ? sanitizeUserInput(data.address, 200) : '',
        city: data.city ? sanitizeUserInput(data.city, 100) : '',
        state: data.state ? sanitizeUserInput(data.state, 100) : '',
        zipCode: data.zipCode ? sanitizeUserInput(data.zipCode, 10) : '',
        phoneNumber: data.phoneNumber ? sanitizeUserInput(data.phoneNumber, 20) : '',
      };

      // Step 1: Create user account
      const { user } = await createUserWithEmailAndPassword(auth, sanitizedData.email, sanitizedData.password);

      // Step 2: Send email verification
      try {
        await sendEmailVerification(user);
      } catch (verificationError) {
        console.warn('[Registration] Failed to send verification email:', verificationError);
        // Continue even if email verification fails - user can resend later
      }

      // Step 3: Create user profile in Firestore
      try {
        await createUserProfile(user.uid, {
          displayName: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
          email: sanitizedData.email,
          age: 0,
          photoURL: sanitizedData.photoURL,
          pushEnabled: false,
          emailUpdates: false,
          marketingTips: false,
          address: sanitizedData.address,
          city: sanitizedData.city,
          state: sanitizedData.state,
          zipCode: sanitizedData.zipCode,
          referralCode: sanitizedData.referralCode,
          termsAcceptedAt: sanitizedData.termsAcceptedAt,
        });
      } catch (profileError) {
        console.error('[Registration] Failed to create user profile:', profileError);
        // Rollback: Delete the Firebase user if profile creation fails
        try {
          await deleteUser(user);
          throw new Error('Failed to create user profile. Please try again.');
        } catch (deleteError) {
          console.error('[Registration] Failed to rollback user creation:', deleteError);
          throw new Error('Registration failed. Please contact support if you cannot log in.');
        }
      }

      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate based on whether phone number was provided
      if (sanitizedData.phoneNumber && sanitizedData.phoneNumber.trim()) {
        // Phone verification flow
        try {
          router.replace({
            pathname: '/(auth)/verify-phone',
            params: { phoneNumber: sanitizedData.phoneNumber },
          });
        } catch (navError) {
          console.error('[Registration] Navigation to phone verification failed:', navError);
          // Fallback to email verification
          try {
            router.replace({
              pathname: '/(auth)/verify-email',
              params: { email: sanitizedData.email },
            });
          } catch (fallbackError) {
            console.error('[Registration] Fallback navigation also failed:', fallbackError);
            showError(new Error('Registration complete! Please check your email for verification link.'));
          }
        }
      } else {
        // Email verification flow (no phone)
        try {
          router.replace({
            pathname: '/(auth)/verify-email',
            params: { email: sanitizedData.email },
          });
        } catch (navError) {
          console.error('[Registration] Navigation to email verification failed:', navError);
          showError(new Error('Registration complete! Please check your email for verification link and then log in.'));
        }
      }
    } catch (error) {
      // Error haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFirstStep = useMemo(() => currentStep === 0, [currentStep]);
  const isLastStep = useMemo(() => currentStep === STEPS.length - 1, [currentStep]);
  const CurrentStepComponent = STEPS[currentStep].component;

  const progressColor = useThemeColor({}, 'primary');
  const progressBgColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    router.setParams({ title: STEPS[currentStep].title });
  }, [currentStep, router]);

  // Progress Indicator Component
  const ProgressIndicator = () => (
    <ThemedView style={styles.progressContainer}>
      <ThemedText type="caption" style={styles.progressText}>
        Step {currentStep + 1} of {STEPS.length}
      </ThemedText>
      <View style={styles.progressBarContainer}>
        {STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              {
                backgroundColor: index <= currentStep ? progressColor : progressBgColor,
              },
            ]}
          />
        ))}
      </View>
      <ThemedText type="body" style={[{ color: textColor }, CommonText.sectionTitle]}>
        {STEPS[currentStep].title}
      </ThemedText>
    </ThemedView>
  );

  return (
    <FormProvider {...methods}>
      <RegisterContext.Provider
        value={{
          currentStep,
          setCurrentStep,
          goNext,
          goPrev,
          isFirstStep,
          isLastStep,
          isSubmitting,
        }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20} enabled={true}>
          <ThemedView style={styles.container}>
            <Stack.Screen
              options={{
                title: 'Register',
                headerBackTitle: 'Cancel',
              }}
            />

            {/* Progress Indicator */}
            <ProgressIndicator />

            {/* Form Content */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {/* Social Sign-In - Show only on first step */}
              {currentStep === 0 && <SocialSignInButtons onGoogleSignIn={signInWithGoogle} onAppleSignIn={signInWithApple} loading={socialLoading} mode="register" />}

              <CurrentStepComponent errors={formState.errors} />
            </ScrollView>

            {/* Navigation Buttons */}
            <ThemedView style={styles.buttonContainer}>
              <ThemedButton
                title={isFirstStep ? 'Cancel' : 'Previous'}
                onPress={goPrev}
                style={styles.button}
                variant="secondary"
                disabled={isSubmitting}
                accessibilityLabel={isFirstStep ? 'Cancel registration' : 'Go to previous step'}
                accessibilityHint={isFirstStep ? 'Returns to previous screen' : 'Returns to the previous registration step'}
              />
              <ThemedButton
                title={isLastStep ? 'Create Account' : 'Next'}
                onPress={goNext}
                style={styles.button}
                loading={isSubmitting}
                disabled={isSubmitting}
                accessibilityLabel={isLastStep ? 'Create account' : 'Go to next step'}
                accessibilityHint={isLastStep ? 'Creates your account with the provided information' : 'Proceeds to the next registration step'}
              />
            </ThemedView>
          </ThemedView>
        </KeyboardAvoidingView>
      </RegisterContext.Provider>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: Spacing.md,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  progressContainer: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  progressText: {
    // Color will be set by ThemedText's 'caption' type
  },
  progressBarContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: BorderRadius.xs,
  },
  scrollView: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? Spacing.sm : Spacing.md,
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
  },
});
