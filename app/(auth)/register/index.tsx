import { createUserProfile } from '@/actions/user.action';
import { ThemedButton } from '@/components/themed-button';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase-config';
import { showError } from '@/utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { z } from 'zod';
import RegisterStep1 from './step-1';
import RegisterStep2 from './step-2';
import RegisterStep3 from './step-3';

const STEPS = [
  { id: 'step-1', title: 'Personal Information', component: RegisterStep1, fields: ['firstName', 'lastName'] },
  { id: 'step-2', title: 'Account Security', component: RegisterStep2, fields: ['email', 'password', 'confirmPassword'] },
  { id: 'step-3', title: 'Address', component: RegisterStep3, fields: ['address', 'city', 'state', 'zipCode'] },
];

const schema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      ),
    confirmPassword: z.string(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'Zip code must be at least 5 characters long.'),
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
}>({
  currentStep: 0,
  setCurrentStep: () => {},
  goNext: () => {},
  goPrev: () => {},
  isFirstStep: true,
  isLastStep: false,
});

export const useRegister = () => useContext(RegisterContext);

export default function RegisterScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const { handleSubmit, trigger, formState } = methods;

  const goNext = async () => {
    const fields = STEPS[currentStep].fields;
    const isValid = await trigger(fields as (keyof FormData)[]);
    if (isValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await createUserProfile(user.uid, {
        displayName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        age: 0,
        photoURL: '',
        pushEnabled: false,
        emailUpdates: false,
        marketingTips: false,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      });
      router.replace({
        pathname: '/(auth)/welcome',
        params: { email: data.email },
      });
    } catch (error) {
      showError(error);
    }
  };

  const isFirstStep = useMemo(() => currentStep === 0, [currentStep]);
  const isLastStep = useMemo(() => currentStep === STEPS.length - 1, [currentStep]);
  const CurrentStepComponent = STEPS[currentStep].component;

  useEffect(() => {
    router.setParams({ title: STEPS[currentStep].title });
  }, [currentStep, router]);

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
        }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
          <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: STEPS[currentStep].title }} />
            <ScrollView style={styles.scrollView}>
              <CurrentStepComponent errors={formState.errors} />
            </ScrollView>
            <ThemedView style={styles.buttonContainer}>
              {!isFirstStep && <ThemedButton title="Previous" onPress={goPrev} style={styles.button} />}
              <ThemedButton title={isLastStep ? 'Submit' : 'Next'} onPress={goNext} style={styles.button} />
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
  },
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
  },
  button: {
    flex: 1,
  },
});
