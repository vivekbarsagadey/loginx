# Universal Multi-Step Flow System

A comprehensive, production-ready flow system for creating multi-step user experiences in React Native/Expo applications.

## Features

✅ **7 Step Types** - Display, Form, Selection, Verification, Action, Permission, Custom
✅ **4 Progress Indicators** - Dots, Stepper, Bar, Circular
✅ **State Management** - Automatic state persistence and resume
✅ **Validation** - Built-in validation with Zod schemas
✅ **Navigation** - Forward, backward, skip, and conditional navigation
✅ **Type-Safe** - Full TypeScript coverage with comprehensive types
✅ **Themeable** - Multiple themes per step (light, dark, custom)
✅ **Responsive** - Adapts to different screen sizes and orientations
✅ **Accessible** - WCAG 2.2 AA compliant with proper ARIA labels
✅ **Analytics Ready** - Built-in tracking hooks for user behavior

## Quick Start

### 1. Install Dependencies

The flow system is built-in and requires no additional dependencies beyond the project's existing packages.

### 2. Create a Flow Configuration

```typescript
import { FlowConfig } from '@/types/flow';

export const myFlow: FlowConfig = {
  id: 'my-flow',
  title: 'My Flow',
  version: '1.0',
  
  progressIndicator: 'dots',
  showHeader: true,
  showSkip: true,
  
  steps: [
    {
      id: 'welcome',
      type: 'display',
      title: 'Welcome!',
      subtitle: 'Get started with our app',
      description: 'This is the first step',
    },
    {
      id: 'form',
      type: 'form',
      title: 'Your Information',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
        },
      ],
    },
    {
      id: 'complete',
      type: 'display',
      title: "You're All Set!",
      description: 'Thanks for completing the flow',
    },
  ],
  
  onComplete: async (data) => {
    console.log('Flow completed with data:', data);
    return { success: true };
  },
};
```

### 3. Use FlowContainer in Your Screen

```tsx
import { FlowContainer } from '@/components/flow/flow-container';
import { myFlow } from './my-flow';
import { useRouter } from 'expo-router';

export default function MyScreen() {
  const router = useRouter();

  return (
    <FlowContainer
      flow={myFlow}
      onComplete={() => router.replace('/(tabs)')}
    />
  );
}
```

## Step Types

### Display Step
Shows information, images, and content.

```typescript
{
  id: 'welcome',
  type: 'display',
  title: 'Welcome',
  subtitle: 'Get started',
  description: 'This is a display step',
  image: require('@/assets/welcome.png'),
  content: [
    {
      icon: 'checkmark',
      title: 'Feature 1',
      description: 'Description of feature 1',
    },
  ],
}
```

### Form Step
Collects user input with validation.

```typescript
{
  id: 'personal-info',
  type: 'form',
  title: 'Personal Information',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
  ],
}
```

### Selection Step
Single or multiple choice selection.

```typescript
{
  id: 'preferences',
  type: 'selection',
  title: 'Choose Your Preferences',
  multiple: true,
  options: [
    {
      id: 'option1',
      title: 'Option 1',
      description: 'Description',
    },
    {
      id: 'option2',
      title: 'Option 2',
      description: 'Description',
    },
  ],
}
```

## Progress Indicators

### Dots (3-5 steps)
```typescript
progressIndicator: 'dots'
```

### Stepper (5-8 steps)
```typescript
progressIndicator: 'stepper'
```

### Bar (8+ steps)
```typescript
progressIndicator: 'bar'
```

### Circular
```typescript
progressIndicator: 'circular'
```

## Validation

### Field-Level Validation
```typescript
{
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true,
  validation: z.string().email('Invalid email'),
}
```

### Step-Level Validation
```typescript
{
  id: 'form',
  type: 'form',
  validationSchema: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
}
```

## State Persistence

Enable automatic state saving:

```typescript
export const myFlow: FlowConfig = {
  // ...
  persistState: true,
  autoSave: {
    enabled: true,
    interval: 30000, // Auto-save every 30 seconds
  },
};
```

## Navigation

### Conditional Steps
```typescript
{
  id: 'optional-step',
  type: 'display',
  title: 'Optional',
  condition: (data) => data.showOptional === true,
}
```

### Skip Steps
```typescript
{
  id: 'skippable',
  type: 'display',
  title: 'Can Skip',
  skippable: true,
}
```

### Custom Navigation
```typescript
{
  id: 'custom',
  type: 'display',
  primaryButton: {
    label: 'Custom Action',
    action: (data) => {
      // Custom logic
    },
  },
}
```

## Analytics

Track user behavior:

```typescript
export const myFlow: FlowConfig = {
  // ...
  analytics: {
    trackStepView: true,
    trackCompletion: true,
    trackAbandonment: true,
    trackSkips: true,
  },
  
  onStepView: (stepId, data) => {
    console.log('Step viewed:', stepId);
  },
};
```

## Examples

See `templates/flows/` for complete examples:
- `simple-onboarding-flow.ts` - Basic 3-step onboarding

## API Reference

### FlowConfig
Complete flow configuration type with all available options.

### StepConfig
Base step configuration extended by specific step types.

### FlowContainer Props
- `flow: FlowConfig` - Flow configuration
- `onComplete?: (data) => void` - Completion callback
- `onSkip?: (data) => void` - Skip callback
- `initialData?: Record<string, any>` - Initial data
- `resumeState?: FlowState` - Resume from saved state

## Architecture

```
components/flow/
├── flow-container.tsx       # Main orchestrator
├── flow-header.tsx          # Optional header
├── flow-progress.tsx        # Progress wrapper
├── flow-navigation.tsx      # Navigation controls
├── flow-step-wrapper.tsx    # Step renderer
├── progress/                # Progress indicators
│   ├── dots-progress.tsx
│   ├── stepper-progress.tsx
│   ├── bar-progress.tsx
│   └── circular-progress.tsx
└── steps/                   # Step type renderers
    ├── display-step.tsx
    ├── form-step.tsx
    ├── selection-step.tsx
    ├── verification-step.tsx
    ├── action-step.tsx
    ├── permission-step.tsx
    └── custom-step.tsx

hooks/
├── use-flow-engine.ts       # Main orchestrator hook
├── use-flow-state.ts        # State management
├── use-flow-navigation.ts   # Navigation logic
├── use-flow-validation.ts   # Validation engine
├── use-flow-persistence.ts  # State persistence
└── use-flow-context.ts      # Context provider

types/
└── flow.ts                  # Complete type system
```

## Contributing

When adding new step types:
1. Define the step config type in `types/flow.ts`
2. Create the renderer in `components/flow/steps/`
3. Add case to `flow-step-wrapper.tsx`
4. Update documentation

## Roadmap

- [ ] Enhanced animations with react-native-reanimated
- [ ] Advanced theming (seasonal, A/B testing, brand customization)
- [ ] More flow templates (registration, setup, tutorial)
- [ ] Image carousel support
- [ ] Video step support
- [ ] Advanced form field types
- [ ] OTP verification component
- [ ] Permission request component
- [ ] Comprehensive test suite

## License

MIT - Part of the LoginX project
