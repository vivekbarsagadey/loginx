import { createUserProfile } from '@/actions/user.action';
import { AuthErrorBoundary } from '@/components/auth/auth-error-boundary';
import { RegistrationNavigation } from '@/components/auth/registration-navigation';
import { RegistrationProgress } from '@/components/auth/registration-progress';
import { RegistrationSocialAuth } from '@/components/auth/registration-social-auth';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useRegistrationFlow } from '@/hooks/use-registration-flow';
import { createLogger } from '@/utils/debug';
import { showError } from '@/utils/error';
import { validatePassword } from '@/utils/password-validator';
import { runRegistrationDiagnostics } from '@/utils/registration-diagnostics';
import { sanitizeEmail, sanitizeUserInput } from '@/utils/sanitize';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { z } from 'zod';
import RegisterStep1 from './step-1';
import RegisterStep2 from './step-2';
import RegisterStep3 from './step-3';
import RegisterStep4 from './step-4';

const logger = createLogger('Registration');

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
      .refine(
        (password) => {
          const result = validatePassword(password);
          return result.isValid;
        },
        (password) => {
          const result = validatePassword(password);
          return { message: result.errors[0] || 'Password does not meet requirements.' };
        }
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
  const { replace } = useHapticNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Run diagnostics on mount (development only)
  useEffect(() => {
    runRegistrationDiagnostics();
  }, []);

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
        password: data.password,
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
      } catch (_verificationError) {
        // Continue even if email verification fails
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
        logger.error('Failed to create user profile:', profileError);
        // Rollback: Delete the Firebase user if profile creation fails
        try {
          await deleteUser(user);
          throw new Error('Failed to create user profile. Please try again.');
        } catch (deleteError) {
          logger.error('Failed to rollback user creation:', deleteError);
          throw new Error('Registration failed. Please contact support if you cannot log in.');
        }
      }

      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate based on whether phone number was provided
      if (sanitizedData.phoneNumber && sanitizedData.phoneNumber.trim()) {
        try {
          replace({
            pathname: '/(auth)/verify-phone',
            params: { phoneNumber: sanitizedData.phoneNumber },
          });
        } catch (navError) {
          logger.error('Navigation to phone verification failed:', navError);
          try {
            replace({
              pathname: '/(auth)/verify-email',
              params: { email: sanitizedData.email },
            });
          } catch (fallbackError) {
            logger.error('Fallback navigation also failed:', fallbackError);
            showError(new Error('Registration complete! Please check your email for verification link.'));
          }
        }
      } else {
        try {
          replace({
            pathname: '/(auth)/verify-email',
            params: { email: sanitizedData.email },
          });
        } catch (navError) {
          logger.error('Navigation to email verification failed:', navError);
          showError(new Error('Registration complete! Please check your email for verification link and then log in.'));
        }
      }
    } catch (_error: unknown) {
      // Error haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(_error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { currentStep, setCurrentStep, goNext, goPrev, isFirstStep, isLastStep, currentStepTitle } = useRegistrationFlow({
    steps: STEPS,
    trigger,
    onSubmit: () => handleSubmit(onSubmit)(),
  });

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <AuthErrorBoundary fallbackMessage="We're having trouble loading the registration form">
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

              <RegistrationProgress currentStep={currentStep} totalSteps={STEPS.length} stepTitle={currentStepTitle} />

              <ThemedScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <RegistrationSocialAuth visible={currentStep === 0} />

                <CurrentStepComponent errors={formState.errors} />
              </ThemedScrollView>

              <RegistrationNavigation isFirstStep={isFirstStep} isLastStep={isLastStep} isSubmitting={isSubmitting} onNext={goNext} onPrevious={goPrev} />
            </ThemedView>
          </KeyboardAvoidingView>
        </RegisterContext.Provider>
      </FormProvider>
    </AuthErrorBoundary>
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
  scrollView: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
