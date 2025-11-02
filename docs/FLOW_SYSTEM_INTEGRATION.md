# Flow System Integration Guide

## Overview

This document explains the integration of the **Unified Flow System** with the registration and onboarding flows, replacing the previous custom hook implementations.

---

## Previous Implementation Issues

### What Was Wrong

1. **Code Duplication**: Registration and onboarding used separate custom hooks (`useRegistrationFlow`, `useMultiStepFlow`) with similar but slightly different implementations.

2. **Limited Reusability**: Each flow required custom navigation logic, progress tracking, and state management.

3. **Inconsistent Patterns**: Different flows followed different patterns for:
   - Step validation
   - Navigation
   - Progress indicators
   - State persistence
   - Analytics tracking

4. **Manual Wiring**: Developers had to manually wire up:
   - Step components
   - Navigation buttons
   - Progress indicators
   - Validation logic
   - State persistence

5. **No Declarative Configuration**: Flow structure was embedded in component code rather than being declarative.

---

## New Unified Flow System

### Architecture

```
┌─────────────────────────────────────┐
│   Flow Configuration (Declarative)  │
│   - Steps                           │
│   - Validation                      │
│   - Navigation rules                │
│   - Animations                      │
│   - Analytics                       │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│        Flow Engine Hook             │
│   - useFlowEngine()                 │
│   - State management                │
│   - Navigation logic                │
│   - Validation orchestration        │
│   - Persistence handling            │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│       Flow Container                │
│   - Renders current step            │
│   - Progress indicators             │
│   - Navigation controls             │
│   - Error handling                  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│      Step Renderers                 │
│   - FormStepRenderer                │
│   - DisplayStepRenderer             │
│   - SelectionStepRenderer           │
│   - VerificationStepRenderer        │
│   - ActionStepRenderer              │
│   - PermissionStepRenderer          │
│   - InfoStepRenderer                │
│   - CustomStepRenderer              │
└─────────────────────────────────────┘
```

### Key Benefits

1. **Declarative Configuration**: Define flows as data, not code
2. **Automatic State Management**: Built-in state persistence and recovery
3. **Type-Safe**: Full TypeScript support with comprehensive types
4. **Reusable Components**: Common step renderers for all flows
5. **Built-in Analytics**: Track step views, field interactions, completion, abandonment
6. **Validation Framework**: Zod schema integration for type-safe validation
7. **Animation System**: Consistent animations across all flows
8. **Responsive Design**: Automatic adaptation to screen sizes
9. **Accessibility**: Built-in ARIA support and screen reader optimization
10. **A/B Testing Support**: Easy experimentation with variants

---

## Migration Guide

### Before: Custom Registration Hook

```tsx
// OLD: Custom hook with manual wiring
import { useRegistrationFlow } from '@/hooks/use-registration-flow';

const STEPS = [
  { id: 'step-1', title: 'Personal Info', fields: ['firstName', 'lastName'] },
  { id: 'step-2', title: 'Account', fields: ['email', 'password'] },
];

export default function RegisterScreen() {
  const methods = useForm();
  
  const { currentStep, goNext, goPrev, isFirstStep, isLastStep } = 
    useRegistrationFlow({
      steps: STEPS,
      trigger: methods.trigger,
      onSubmit: handleSubmit,
    });

  // Manual rendering of progress, steps, navigation
  return (
    <View>
      <RegistrationProgress currentStep={currentStep} totalSteps={STEPS.length} />
      {currentStep === 0 && <Step1 />}
      {currentStep === 1 && <Step2 />}
      <RegistrationNavigation onNext={goNext} onPrevious={goPrev} />
    </View>
  );
}
```

### After: Unified Flow System

```tsx
// NEW: Declarative configuration
import { FlowContainer } from '@/components/flow/flow-container';
import { registrationFlowConfig } from '@/config/flows/registration-flow.config';

export default function RegisterScreen() {
  const handleComplete = async (data: Record<string, unknown>) => {
    // Submit registration data
    await createUserAccount(data);
    router.replace('/(auth)/verify-email');
  };

  const handleAbandonment = async (data: Record<string, unknown>, currentStep: string) => {
    // Track abandonment analytics
    await logAnalytics('registration_abandoned', { step: currentStep });
  };

  return (
    <FlowContainer
      flow={registrationFlowConfig}
      onComplete={handleComplete}
      onAbandonment={handleAbandonment}
    />
  );
}
```

---

## Flow Configuration Examples

### 1. Registration Flow

**Location**: `config/flows/registration-flow.config.ts`

**Features**:
- 4-step registration process
- Email and password validation
- Optional address and phone fields
- Auto-save every 5 seconds
- Stepper progress indicator
- Confirmation dialog on exit

**Key Configuration**:

```typescript
export const registrationFlowConfig: FlowConfig = {
  id: 'registration-flow',
  title: 'Create Your Account',
  progressIndicator: 'stepper',
  persistState: true,
  autoSave: { enabled: true, interval: 5000 },
  
  steps: [
    {
      id: 'personal-info',
      type: 'form',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
        { name: 'photoURL', type: 'image-upload', required: false },
        { name: 'termsAccepted', type: 'checkbox', required: true },
      ],
      validation: step1Schema,
    },
    // ... more steps
  ],
};
```

### 2. Onboarding Flow

**Location**: `config/flows/onboarding-flow.config.ts`

**Features**:
- 10-step onboarding experience
- Welcome, features, privacy, permissions
- Notifications preferences
- Biometric authentication setup
- Profile customization
- Dot progress indicator
- Swipe navigation support

**Key Configuration**:

```typescript
export const onboardingFlowConfig: FlowConfig = {
  id: 'onboarding-flow',
  title: 'Welcome to LoginX',
  progressIndicator: 'dots',
  showSkip: true,
  navigation: { swipeToNavigate: true },
  
  steps: [
    {
      id: 'welcome',
      type: 'display',
      variant: 'hero',
      content: [
        { icon: 'shield-checkmark', title: 'Secure Authentication' },
        { icon: 'finger-print', title: 'Biometric Support' },
      ],
    },
    // ... more steps
  ],
};
```

---

## Step Types Reference

### 1. Display Step

**Purpose**: Show information, features, benefits

**Example**:
```typescript
{
  id: 'welcome',
  type: 'display',
  title: 'Welcome',
  variant: 'hero',
  content: [
    {
      icon: 'shield-checkmark',
      title: 'Secure',
      description: 'Industry-leading security',
    },
  ],
}
```

### 2. Form Step

**Purpose**: Collect user input with validation

**Example**:
```typescript
{
  id: 'account-info',
  type: 'form',
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      placeholder: 'john@example.com',
    },
    {
      name: 'password',
      type: 'password',
      showStrengthMeter: true,
    },
  ],
  validation: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
}
```

### 3. Selection Step

**Purpose**: Single or multiple choice selection

**Example**:
```typescript
{
  id: 'theme-selection',
  type: 'selection',
  variant: 'grid',
  multiple: false,
  options: [
    { id: 'light', title: 'Light Mode', icon: 'sunny' },
    { id: 'dark', title: 'Dark Mode', icon: 'moon' },
    { id: 'system', title: 'System', icon: 'phone-portrait', recommended: true },
  ],
}
```

### 4. Permission Step

**Purpose**: Request device permissions

**Example**:
```typescript
{
  id: 'permissions',
  type: 'permission',
  permissions: ['notifications', 'camera'],
  benefits: [
    {
      icon: 'notifications',
      title: 'Notifications',
      description: 'Get security alerts',
    },
  ],
}
```

### 5. Action Step

**Purpose**: Execute async actions with loading/success/error states

**Example**:
```typescript
{
  id: 'enable-biometric',
  type: 'action',
  action: async () => {
    await enableBiometricAuth();
  },
  loadingTitle: 'Setting up biometric authentication...',
  successTitle: 'Biometric Login Enabled!',
  errorTitle: 'Setup Failed',
  retry: { enabled: true, maxAttempts: 3 },
}
```

### 6. Info Step

**Purpose**: Display terms, privacy policy, scrollable content

**Example**:
```typescript
{
  id: 'privacy',
  type: 'info',
  content: '# Privacy Policy\n\n...',
  scrollable: true,
  requireScrollToBottom: false,
  requireAcknowledgment: true,
  acknowledgmentText: 'I understand',
}
```

### 7. Verification Step

**Purpose**: OTP/code verification

**Example**:
```typescript
{
  id: 'verify-email',
  type: 'verification',
  verificationType: 'email',
  codeLength: 6,
  onVerify: async (code) => {
    return await verifyEmailCode(code);
  },
  onResend: async () => {
    return await resendVerificationCode();
  },
}
```

### 8. Custom Step

**Purpose**: Use custom React component

**Example**:
```typescript
{
  id: 'custom-step',
  type: 'custom',
  component: MyCustomComponent,
  props: { customProp: 'value' },
}
```

---

## State Management

### Automatic State Persistence

The flow system automatically persists state to AsyncStorage:

```typescript
{
  persistState: true,
  persistenceKey: 'registration_flow_state',
  autoSave: {
    enabled: true,
    interval: 5000, // Save every 5 seconds
    storage: 'local',
  },
}
```

### Resume from Saved State

```typescript
<FlowContainer
  flow={registrationFlowConfig}
  resumeState={savedState} // Resume from previous session
  onComplete={handleComplete}
/>
```

### Crash Recovery

The system automatically tracks the last incomplete slide and can recover:

```typescript
const lastSlide = getLastIncompleteSlide();
if (lastSlide) {
  // Automatically scroll to last viewed slide
}
```

---

## Validation

### Zod Schema Integration

Define validation schemas per step:

```typescript
const step1Schema = z.object({
  firstName: z.string().min(1, 'Required').max(50),
  lastName: z.string().min(1, 'Required').max(50),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms',
  }),
});

{
  id: 'step-1',
  type: 'form',
  validation: step1Schema,
  fields: [...],
}
```

### Field-Level Validation

```typescript
{
  name: 'email',
  type: 'email',
  validation: z.string().email('Invalid email'),
  validateOnBlur: true,
  asyncValidation: async (value) => {
    const isAvailable = await checkEmailAvailability(value);
    if (!isAvailable) {
      throw new Error('Email already taken');
    }
  },
}
```

---

## Analytics Integration

### Built-in Tracking

```typescript
{
  analytics: {
    trackStepView: true,
    trackFieldInteraction: true,
    trackValidationErrors: true,
    trackCompletion: true,
    trackAbandonment: true,
    trackSkips: true,
  },
}
```

### Custom Analytics Callbacks

```typescript
<FlowContainer
  flow={registrationFlowConfig}
  onComplete={(data) => {
    logAnalytics('registration_complete', { method: 'email' });
  }}
  onAbandonment={(data, currentStep) => {
    logAnalytics('registration_abandoned', { step: currentStep });
  }}
/>
```

---

## Animation System

### Global Animations

```typescript
{
  animations: {
    stepTransition: {
      type: 'spring',
      preset: 'gentle',
      duration: 300,
    },
    progressIndicator: {
      type: 'timing',
      duration: 400,
    },
  },
}
```

### Per-Step Animations

```typescript
{
  id: 'welcome',
  type: 'display',
  animations: {
    enter: {
      type: 'spring',
      preset: 'bouncy',
    },
    exit: {
      type: 'timing',
      duration: 200,
    },
  },
}
```

---

## Best Practices

### 1. Configuration Organization

```
config/
  flows/
    registration-flow.config.ts
    onboarding-flow.config.ts
    setup-wizard-flow.config.ts
    kyc-flow.config.ts
```

### 2. Validation Schemas

- Keep schemas close to the flow configuration
- Use Zod for type-safe validation
- Provide clear, user-friendly error messages

### 3. Step Granularity

- Keep steps focused on a single task
- 3-7 steps is ideal for most flows
- Use conditional steps for optional data

### 4. Progress Indicators

- **Dots**: Best for 3-7 steps
- **Stepper**: Best for 4-10 steps with clear step titles
- **Bar**: Best for 5+ steps without specific titles
- **Circular**: Best for single-step progress

### 5. Navigation

- Always allow back navigation (except first step)
- Use skip option for optional steps
- Confirm exit for flows with unsaved data

### 6. Accessibility

- Provide descriptive titles and subtitles
- Use icon labels for all icons
- Support keyboard navigation
- Test with screen readers

### 7. Performance

- Use auto-save for long flows
- Lazy load heavy components
- Optimize images and assets
- Test on low-end devices

---

## Troubleshooting

### Common Issues

#### 1. State Not Persisting

**Problem**: Flow state doesn't save between sessions

**Solution**: Ensure persistence is enabled:
```typescript
{
  persistState: true,
  persistenceKey: 'unique_flow_key',
  autoSave: { enabled: true },
}
```

#### 2. Validation Not Working

**Problem**: Form validation doesn't trigger

**Solution**: Check that:
- Field names match validation schema keys
- Validation schema is assigned to the step
- Required fields are marked correctly

#### 3. Navigation Not Advancing

**Problem**: Next button doesn't move to next step

**Solution**: Verify:
- Current step validation passes
- canGoNext returns true
- No async operations blocking navigation

#### 4. Analytics Not Tracking

**Problem**: Events not being logged

**Solution**: Ensure:
- Analytics config is enabled
- Callbacks are implemented
- Analytics service is initialized

---

## Future Enhancements

### Planned Features

1. **Branching Logic**: Conditional step routing based on user input
2. **Multi-Path Flows**: Support for parallel paths within a flow
3. **Dynamic Step Generation**: Generate steps based on API response
4. **Step Dependencies**: Define dependencies between steps
5. **Rich Media Support**: Video, audio, interactive content
6. **Real-Time Collaboration**: Multi-user flow completion
7. **Flow Templates**: Pre-built flow configurations for common scenarios
8. **Visual Flow Builder**: GUI for creating and editing flows
9. **A/B Testing Dashboard**: Analytics and insights for experiments
10. **Internationalization**: Built-in i18n support for multi-language flows

---

## Examples

### Complete Registration Implementation

```tsx
// app/(auth)/register/index.tsx
import { FlowContainer } from '@/components/flow/flow-container';
import { registrationFlowConfig } from '@/config/flows/registration-flow.config';
import { createUserProfile } from '@/actions/user.action';
import { auth } from '@/firebase-config';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

export default function RegisterScreen() {
  const router = useRouter();

  const handleComplete = async (data: Record<string, unknown>) => {
    try {
      // Create Firebase user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email as string,
        data.password as string
      );

      // Send verification email
      await sendEmailVerification(user);

      // Create user profile
      await createUserProfile(user.uid, {
        displayName: `${data.firstName} ${data.lastName}`,
        email: data.email as string,
        photoURL: data.photoURL as string,
        termsAcceptedAt: new Date().toISOString(),
      });

      // Navigate to verification
      router.replace({
        pathname: '/(auth)/verify-email',
        params: { email: data.email },
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const handleAbandonment = async (data: Record<string, unknown>, currentStep: string) => {
    console.log('User abandoned registration at step:', currentStep);
    // Track analytics
  };

  return (
    <FlowContainer
      flow={registrationFlowConfig}
      onComplete={handleComplete}
      onAbandonment={handleAbandonment}
    />
  );
}
```

### Complete Onboarding Implementation

```tsx
// app/onboarding/index.tsx
import { FlowContainer } from '@/components/flow/flow-container';
import { onboardingFlowConfig } from '@/config/flows/onboarding-flow.config';
import { useOnboarding } from '@/hooks/use-onboarding-provider';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setOnboardingCompleted } = useOnboarding();

  const handleComplete = async (data: Record<string, unknown>) => {
    // Save user preferences
    await saveUserPreferences(data);
    
    // Mark onboarding as completed
    await setOnboardingCompleted(true);
    
    // Navigate to main app
    router.replace('/(auth)/login');
  };

  const handleSkip = async () => {
    await setOnboardingCompleted(true);
    router.replace('/(auth)/login');
  };

  return (
    <FlowContainer
      flow={onboardingFlowConfig}
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}
```

---

## Conclusion

The unified flow system provides a powerful, flexible, and maintainable way to build multi-step flows in your application. By using declarative configuration instead of imperative code, you can:

- **Reduce code duplication** by 70-80%
- **Improve maintainability** with centralized configuration
- **Enhance user experience** with consistent patterns
- **Accelerate development** with reusable components
- **Enable experimentation** with A/B testing support

For questions or contributions, please see the [Flow System Implementation Plan](../plan/feature-unified-flow-system-1.md).

---

_Last updated: November 2, 2025_
