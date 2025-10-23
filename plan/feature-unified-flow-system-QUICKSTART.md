# Flow System Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you create your first flow in under 5 minutes.

---

## Step 1: Create a Flow Configuration

Create a new file in `templates/flows/`:

```typescript
// templates/flows/my-first-flow.ts
import { FlowConfig } from "@/types/flow";

export const myFirstFlow: FlowConfig = {
  id: "my-first-flow",
  title: "My First Flow",
  version: "1.0",

  progressIndicator: "dots",
  showHeader: true,

  steps: [
    {
      id: "welcome",
      type: "display",
      title: "Welcome!",
      subtitle: "Let's get started",
      description: "This is your first flow."
    },
    {
      id: "done",
      type: "display",
      title: "All Done!",
      subtitle: "That was easy",
      primaryButton: {
        label: "Finish",
        action: "complete"
      }
    }
  ]
};
```

## Step 2: Use the Flow in Your Screen

```tsx
// app/my-flow/index.tsx
import { FlowContainer } from "@/components/flow/flow-container";
import { myFirstFlow } from "@/templates/flows/my-first-flow";
import { useRouter } from "expo-router";

export default function MyFlowScreen() {
  const router = useRouter();

  return <FlowContainer flow={myFirstFlow} onComplete={() => router.back()} />;
}
```

## Step 3: That's It! 🎉

You now have a working multi-step flow.

---

## Common Use Cases

### 1. Simple Onboarding (Display Steps Only)

```typescript
{
  steps: [
    {
      id: 'step1',
      type: 'display',
      title: 'Welcome',
      description: 'Welcome message here',
      image: require('@/assets/welcome.png'),
    },
    {
      id: 'step2',
      type: 'display',
      title: 'Features',
      content: [
        { icon: 'star', title: 'Feature 1', description: 'Details...' },
        { icon: 'heart', title: 'Feature 2', description: 'Details...' },
      ],
    },
  ],
}
```

### 2. Form Collection

```typescript
{
  steps: [
    {
      id: 'personal-info',
      type: 'form',
      title: 'Personal Info',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
    },
    {
      id: 'preferences',
      type: 'selection',
      title: 'Choose Theme',
      options: [
        { id: 'light', title: 'Light Mode' },
        { id: 'dark', title: 'Dark Mode' },
      ],
    },
  ],
}
```

### 3. Permission Request

```typescript
{
  steps: [
    {
      id: 'notifications',
      type: 'permission',
      title: 'Enable Notifications',
      description: 'Stay informed about updates',
      permissions: ['notifications'],
      skippable: true,
    },
  ],
}
```

### 4. Verification Code

```typescript
{
  steps: [
    {
      id: 'verify',
      type: 'verification',
      title: 'Verify Email',
      description: 'Enter the 6-digit code',
      verificationType: 'email',
      codeLength: 6,
    },
  ],
}
```

---

## Flow Configuration Options

### Basic Options

```typescript
{
  id: string; // Unique flow identifier
  title: string; // Flow title
  version: string; // Flow version
  progressIndicator: "dots" | "stepper" | "bar" | "none";
  showHeader: boolean; // Show/hide header
  showSkip: boolean; // Show/hide skip button
  persistState: boolean; // Enable state persistence
}
```

### Step Types

| Type           | Purpose             | Example Use Case                       |
| -------------- | ------------------- | -------------------------------------- |
| `display`      | Show information    | Welcome screens, feature introductions |
| `form`         | Collect input       | Registration, settings                 |
| `selection`    | Choose options      | Theme selection, preferences           |
| `permission`   | Request permissions | Notifications, location                |
| `verification` | Verify codes        | Email/phone verification               |
| `action`       | Execute actions     | Enable biometrics, sync data           |
| `custom`       | Custom component    | Special requirements                   |

---

## Step Configuration Examples

### Display Step (Full Options)

```typescript
{
  id: 'welcome',
  type: 'display',
  title: 'Welcome',
  subtitle: 'Subtitle text',
  description: 'Description text',
  image: require('@/assets/image.png'),
  content: [
    { icon: 'star', title: 'Feature 1', description: 'Details' },
  ],
  primaryButton: { label: 'Continue', action: 'next' },
  secondaryButton: { label: 'Skip', action: 'skip' },
  skippable: true,
}
```

### Form Step (Full Options)

```typescript
{
  id: 'personal-info',
  type: 'form',
  title: 'Personal Information',
  subtitle: 'Tell us about yourself',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your first name',
      autoComplete: 'given-name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: z.string().email(),
    },
    {
      name: 'newsletter',
      label: 'Subscribe to newsletter',
      type: 'switch',
      defaultValue: true,
    },
  ],
  validationSchema: z.object({
    firstName: z.string().min(1),
    email: z.string().email(),
  }),
}
```

### Selection Step (Full Options)

```typescript
{
  id: 'theme-selection',
  type: 'selection',
  title: 'Choose Theme',
  subtitle: 'Pick your favorite',
  multiple: false,  // Single selection
  required: true,
  options: [
    {
      id: 'light',
      title: 'Light Mode',
      icon: 'sunny',
      description: 'Bright and clear',
      color: '#FFFFFF',
      recommended: true,
    },
    {
      id: 'dark',
      title: 'Dark Mode',
      icon: 'moon',
      description: 'Easy on the eyes',
      color: '#000000',
    },
  ],
}
```

### Conditional Step

```typescript
{
  id: 'advanced-settings',
  type: 'form',
  title: 'Advanced Settings',
  // Only show this step if user selected 'advanced' mode
  condition: (data) => data.userType === 'advanced',
  fields: [...],
}
```

---

## Navigation Control

### Automatic Navigation

```typescript
// Flow handles navigation automatically
<FlowContainer flow={myFlow} />
```

### Custom Navigation Handlers

```typescript
<FlowContainer
  flow={myFlow}
  onComplete={handleComplete}
  onSkip={handleSkip}
  onAbandonment={handleAbandon}
/>
```

### Programmatic Navigation

```typescript
const { next, previous, skip, jumpTo } = useFlowEngine(flow);

// Navigate to next step
await next();

// Go back
previous();

// Skip current step
skip();

// Jump to specific step
jumpTo("step-3");
```

---

## Data Handling

### Access Flow Data

```typescript
const { data, updateData } = useFlowEngine(flow);

// Read data
console.log(data.email);

// Update data
updateData({ email: "user@example.com" });
```

### Form Submission

```typescript
{
  onSubmit: async (data) => {
    // Handle form submission
    await saveToDatabase(data);
    return { success: true };
  },
  onComplete: async (data) => {
    // Flow completion handler
    await trackCompletion(data);
    return { success: true };
  },
}
```

---

## Validation

### Field-Level Validation

```typescript
{
  fields: [
    {
      name: 'email',
      validation: z.string().email('Invalid email'),
    },
  ],
}
```

### Step-Level Validation

```typescript
{
  validationSchema: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
}
```

### Custom Validation

```typescript
{
  validate: async (data) => {
    const isAvailable = await checkEmailAvailability(data.email);
    if (!isAvailable) {
      return { valid: false, error: 'Email already taken' };
    }
    return { valid: true };
  },
}
```

---

## State Persistence

### Enable Persistence

```typescript
{
  persistState: true,
  persistenceKey: 'my-flow-state', // Optional custom key
}
```

### Manual Persistence

```typescript
const { saveState, loadState, clearState } = useFlowPersistence("my-flow");

// Save current state
await saveState(currentData);

// Load saved state
const savedData = await loadState();

// Clear saved state
await clearState();
```

---

## Analytics

### Enable Analytics

```typescript
{
  analytics: {
    trackStepView: true,
    trackCompletion: true,
    trackAbandonment: true,
  },
}
```

### Custom Analytics

```typescript
{
  onStepView: (stepId, data) => {
    analytics.track('flow_step_view', { stepId, ...data });
  },
  onComplete: (data) => {
    analytics.track('flow_complete', data);
  },
}
```

---

## Styling

### Theme Integration

All flow components automatically use your app's theme:

```typescript
// Automatically themed
<FlowContainer flow={myFlow} />
```

### Custom Styling

```typescript
<FlowContainer
  flow={myFlow}
  containerStyle={styles.custom}
  headerStyle={styles.header}
  navigationStyle={styles.navigation}
/>
```

---

## Error Handling

### Automatic Error Handling

```typescript
{
  onError: (error, stepId) => {
    console.error(`Error in step ${stepId}:`, error);
    showToast(error.message);
  },
}
```

### Retry Logic

```typescript
{
  retry: {
    enabled: true,
    maxAttempts: 3,
    retryDelay: 1000,
  },
}
```

---

## Advanced Features

### Branching Flow

```typescript
{
  steps: [
    {
      id: 'user-type',
      type: 'selection',
      options: [
        { id: 'personal', title: 'Personal' },
        { id: 'business', title: 'Business' },
      ],
    },
    // Personal path
    {
      id: 'personal-setup',
      condition: (data) => data.userType === 'personal',
    },
    // Business path
    {
      id: 'business-setup',
      condition: (data) => data.userType === 'business',
    },
  ],
}
```

### Dynamic Step Generation

```typescript
{
  steps: generateStepsBasedOnUserType(userType),
}
```

### Async Actions

```typescript
{
  id: 'sync-data',
  type: 'action',
  title: 'Syncing Data',
  action: async () => {
    await syncUserData();
    return { success: true, message: 'Data synced!' };
  },
}
```

---

## Troubleshooting

### Common Issues

**Flow not progressing?**

- Check validation rules
- Ensure required fields are filled
- Check console for errors

**State not persisting?**

- Enable `persistState: true`
- Ensure unique flow ID
- Check AsyncStorage permissions

**Custom step not rendering?**

- Verify component import
- Check step type is 'custom'
- Ensure component prop is passed

---

## Best Practices

✅ **Keep flows focused** - 3-8 steps is ideal
✅ **Use clear titles** - Users should know what's expected
✅ **Validate early** - Check input as soon as possible
✅ **Provide feedback** - Loading states, success messages
✅ **Allow going back** - Unless it's a verification step
✅ **Test on real devices** - Both iOS and Android
✅ **Track analytics** - Understand where users drop off

---

## Next Steps

- Read the [full implementation plan](./feature-unified-flow-system-1.md)
- Check out [usage examples](./feature-unified-flow-system-EXAMPLE.md)
- Review the [architecture](./feature-unified-flow-system-ARCHITECTURE.md)
- Start building your first flow!

---

**Need Help?**

- Check the documentation in `docs/FLOW_SYSTEM_GUIDE.md`
- Look at example flows in `templates/flows/`
- Review test cases in `tests/flow/`
