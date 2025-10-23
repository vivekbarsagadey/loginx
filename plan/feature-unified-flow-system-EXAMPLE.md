# Flow System Usage Examples

This document provides practical examples of how to use the unified flow system in various scenarios.

## Table of Contents

1. [Basic Onboarding Flow](#basic-onboarding-flow)
2. [Multi-Step Registration](#multi-step-registration)
3. [Feature Setup Wizard](#feature-setup-wizard)
4. [Interactive Tutorial](#interactive-tutorial)
5. [Conditional Flow with Branching](#conditional-flow-with-branching)

---

## Basic Onboarding Flow

A simple 4-step onboarding flow with welcome, features, permissions, and completion screens.

```typescript
// templates/flows/onboarding-flow.ts
import { FlowConfig } from "@/types/flow";

export const onboardingFlow: FlowConfig = {
  id: "app-onboarding",
  title: "Welcome to LoginX",
  version: "1.0",

  // Visual configuration
  progressIndicator: "dots",
  showHeader: true,
  showSkip: true,

  // Steps configuration
  steps: [
    {
      id: "welcome",
      type: "display",
      title: "Welcome to LoginX",
      subtitle: "Secure authentication made simple",
      description: "LoginX provides enterprise-grade security with a beautiful user experience.",
      image: require("@/assets/images/onboarding-welcome.png"),
      skippable: false
    },
    {
      id: "features",
      type: "display",
      title: "Key Features",
      subtitle: "Everything you need for secure authentication",
      content: [
        {
          icon: "shield-checkmark",
          title: "Multi-Factor Authentication",
          description: "Add an extra layer of security with 2FA"
        },
        {
          icon: "finger-print",
          title: "Biometric Login",
          description: "Use Face ID or fingerprint for quick access"
        },
        {
          icon: "lock-closed",
          title: "End-to-End Encryption",
          description: "Your data is always encrypted and secure"
        }
      ],
      skippable: true
    },
    {
      id: "permissions",
      type: "permission",
      title: "Enable Notifications",
      subtitle: "Stay informed about your account",
      description: "We'll notify you about login attempts and security alerts.",
      permissions: ["notifications"],
      icon: "notifications",
      skippable: true
    },
    {
      id: "completion",
      type: "display",
      title: "You're All Set!",
      subtitle: "Let's get started",
      description: "Your account is ready. Tap below to start using LoginX.",
      image: require("@/assets/images/onboarding-complete.png"),
      primaryButton: {
        label: "Get Started",
        action: "complete"
      }
    }
  ],

  // Completion handler
  onComplete: async (data) => {
    await AsyncStorage.setItem("onboarding_completed", "true");
    return { success: true };
  },

  // Analytics
  analytics: {
    trackStepView: true,
    trackCompletion: true,
    trackAbandonment: true
  }
};
```

### Usage in Screen Component

```tsx
// app/onboarding/index.tsx
import { FlowContainer } from "@/components/flow/flow-container";
import { onboardingFlow } from "@/templates/flows/onboarding-flow";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleComplete = () => {
    router.replace("/(tabs)");
  };

  return <FlowContainer flow={onboardingFlow} onComplete={handleComplete} onSkip={handleComplete} />;
}
```

---

## Multi-Step Registration

A comprehensive registration flow with form validation and conditional steps.

```typescript
// templates/flows/registration-flow.ts
import { FlowConfig } from "@/types/flow";
import { z } from "zod";

const registrationSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const registrationFlow: FlowConfig = {
  id: "user-registration",
  title: "Create Account",
  version: "2.0",

  progressIndicator: "stepper",
  showHeader: true,
  persistState: true,

  steps: [
    {
      id: "personal-info",
      type: "form",
      title: "Personal Information",
      subtitle: "Tell us about yourself",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          required: true,
          autoComplete: "given-name"
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          autoComplete: "family-name"
        },
        {
          name: "photoURL",
          label: "Profile Photo",
          type: "image-upload",
          optional: true
        }
      ],
      validationSchema: registrationSchema.pick({
        firstName: true,
        lastName: true
      })
    },
    {
      id: "account-security",
      type: "form",
      title: "Account Security",
      subtitle: "Create your secure credentials",
      fields: [
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          autoComplete: "email"
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
          showStrengthMeter: true,
          autoComplete: "new-password"
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          required: true,
          autoComplete: "new-password"
        }
      ],
      validationSchema: registrationSchema.pick({
        email: true,
        password: true,
        confirmPassword: true
      })
    },
    {
      id: "phone-number",
      type: "form",
      title: "Phone Number",
      subtitle: "Add your phone for account recovery",
      description: "Optional but recommended for account security",
      fields: [
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "phone",
          optional: true
        }
      ],
      skippable: true
    },
    {
      id: "terms-acceptance",
      type: "form",
      title: "Terms & Privacy",
      subtitle: "Review and accept our policies",
      fields: [
        {
          name: "acceptTerms",
          label: "I accept the Terms of Service and Privacy Policy",
          type: "checkbox",
          required: true,
          links: [
            { text: "Terms of Service", href: "/terms" },
            { text: "Privacy Policy", href: "/privacy" }
          ]
        }
      ],
      validationSchema: registrationSchema.pick({
        acceptTerms: true
      })
    },
    {
      id: "verify-email",
      type: "verification",
      title: "Verify Your Email",
      subtitle: "Check your inbox",
      description: "We sent a verification code to {{email}}",
      verificationType: "email",
      codeLength: 6,
      resendInterval: 60
    }
  ],

  // Navigation rules
  navigation: {
    allowBack: true,
    confirmExit: true,
    exitMessage: "Are you sure? Your progress will be lost."
  },

  // Form submission
  onSubmit: async (data) => {
    const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);

    await createUserProfile(user.uid, {
      displayName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      photoURL: data.photoURL
    });

    return { success: true, userId: user.uid };
  },

  onComplete: async (data) => {
    // Navigate to email verification
    return { success: true };
  }
};
```

---

## Feature Setup Wizard

A wizard-style flow for setting up 2FA with conditional steps.

```typescript
// templates/flows/2fa-setup-flow.ts
import { FlowConfig } from "@/types/flow";

export const twoFactorSetupFlow: FlowConfig = {
  id: "2fa-setup",
  title: "Set Up Two-Factor Authentication",
  version: "1.0",

  progressIndicator: "bar",

  steps: [
    {
      id: "intro",
      type: "display",
      title: "Secure Your Account",
      subtitle: "Add an extra layer of protection",
      content: [
        {
          icon: "shield",
          title: "Enhanced Security",
          description: "Protect your account from unauthorized access"
        },
        {
          icon: "time",
          title: "Quick Setup",
          description: "Takes less than 2 minutes to complete"
        }
      ]
    },
    {
      id: "method-selection",
      type: "selection",
      title: "Choose Your Method",
      subtitle: "Select how you want to receive codes",
      options: [
        {
          id: "app",
          icon: "phone-portrait",
          title: "Authenticator App",
          description: "Use Google Authenticator, Authy, or similar",
          recommended: true
        },
        {
          id: "sms",
          icon: "chatbubble",
          title: "SMS",
          description: "Receive codes via text message"
        },
        {
          id: "email",
          icon: "mail",
          title: "Email",
          description: "Receive codes via email"
        }
      ],
      required: true
    },
    {
      id: "app-setup",
      type: "action",
      title: "Scan QR Code",
      subtitle: "Open your authenticator app",
      description: "Scan this QR code with your authenticator app",
      action: async () => {
        const secret = await generateTOTPSecret();
        return { qrCode: generateQRCode(secret) };
      },
      // Only show if user selected 'app' method
      condition: (data) => data.methodSelection === "app"
    },
    {
      id: "sms-setup",
      type: "form",
      title: "Phone Verification",
      subtitle: "Enter your phone number",
      fields: [
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "phone",
          required: true
        }
      ],
      condition: (data) => data.methodSelection === "sms"
    },
    {
      id: "verify-code",
      type: "verification",
      title: "Verify Setup",
      subtitle: "Enter the 6-digit code",
      description: "Enter the code from your authenticator app",
      verificationType: "totp",
      codeLength: 6
    },
    {
      id: "backup-codes",
      type: "display",
      title: "Save Backup Codes",
      subtitle: "Keep these in a safe place",
      description: "Use these codes if you lose access to your device",
      content: {
        type: "backup-codes",
        codes: [] // Generated dynamically
      },
      primaryButton: {
        label: "Download Codes",
        action: "download"
      },
      secondaryButton: {
        label: "I've Saved Them",
        action: "continue"
      }
    },
    {
      id: "success",
      type: "display",
      title: "You're Protected!",
      subtitle: "2FA is now active",
      description: "Your account is now more secure",
      icon: "checkmark-circle",
      primaryButton: {
        label: "Done",
        action: "complete"
      }
    }
  ],

  onComplete: async (data) => {
    await enable2FA(data);
    return { success: true };
  }
};
```

---

## Interactive Tutorial

A tutorial flow with interactive elements and progress tracking.

```typescript
// templates/flows/tutorial-flow.ts
import { FlowConfig } from "@/types/flow";

export const appTutorialFlow: FlowConfig = {
  id: "app-tutorial",
  title: "Quick Tutorial",
  version: "1.0",

  progressIndicator: "dots",
  showSkip: true,

  steps: [
    {
      id: "navigation",
      type: "interactive",
      title: "Navigation Basics",
      subtitle: "Swipe or tap to navigate",
      media: {
        type: "animation",
        source: require("@/assets/animations/swipe-gesture.json")
      },
      interactions: [
        {
          type: "gesture",
          gesture: "swipe-right",
          target: "screen",
          feedback: "Great! You can swipe between screens"
        }
      ]
    },
    {
      id: "menu-access",
      type: "interactive",
      title: "Access the Menu",
      subtitle: "Tap the menu icon",
      highlightElement: "menu-button",
      interactions: [
        {
          type: "tap",
          target: "menu-button",
          feedback: "Perfect! The menu gives you quick access to all features"
        }
      ]
    },
    {
      id: "search",
      type: "interactive",
      title: "Search",
      subtitle: "Try searching for something",
      highlightElement: "search-bar",
      interactions: [
        {
          type: "input",
          target: "search-bar",
          feedback: "Nice! You can search across all your data"
        }
      ]
    },
    {
      id: "completion",
      type: "display",
      title: "You're Ready!",
      subtitle: "Start exploring",
      description: "You can replay this tutorial anytime from Settings",
      primaryButton: {
        label: "Start Using App",
        action: "complete"
      }
    }
  ]
};
```

---

## Conditional Flow with Branching

A flow that adapts based on user input with multiple paths.

```typescript
// templates/flows/personalization-flow.ts
import { FlowConfig } from "@/types/flow";

export const personalizationFlow: FlowConfig = {
  id: "personalization",
  title: "Personalize Your Experience",
  version: "1.0",

  progressIndicator: "stepper",
  persistState: true,

  steps: [
    {
      id: "user-type",
      type: "selection",
      title: "How will you use this app?",
      subtitle: "Select your primary use case",
      options: [
        {
          id: "personal",
          title: "Personal Use",
          icon: "person"
        },
        {
          id: "business",
          title: "Business",
          icon: "briefcase"
        },
        {
          id: "team",
          title: "Team Collaboration",
          icon: "people"
        }
      ],
      required: true
    },

    // Personal flow
    {
      id: "personal-interests",
      type: "selection",
      title: "What are you interested in?",
      subtitle: "Select all that apply",
      multiple: true,
      options: [
        { id: "security", title: "Security", icon: "shield" },
        { id: "privacy", title: "Privacy", icon: "lock-closed" },
        { id: "convenience", title: "Convenience", icon: "flash" }
      ],
      condition: (data) => data.userType === "personal"
    },

    // Business flow
    {
      id: "company-size",
      type: "selection",
      title: "Company Size",
      subtitle: "How many employees?",
      options: [
        { id: "solo", title: "Solo" },
        { id: "small", title: "2-10" },
        { id: "medium", title: "11-50" },
        { id: "large", title: "50+" }
      ],
      condition: (data) => data.userType === "business"
    },

    // Team flow
    {
      id: "team-role",
      type: "selection",
      title: "Your Role",
      subtitle: "What's your position?",
      options: [
        { id: "admin", title: "Administrator" },
        { id: "member", title: "Team Member" },
        { id: "viewer", title: "Viewer" }
      ],
      condition: (data) => data.userType === "team"
    },

    // Common for all flows
    {
      id: "theme-preference",
      type: "selection",
      title: "Choose Your Theme",
      subtitle: "Pick a color scheme",
      options: [
        { id: "default", title: "Default Blue", color: "#007AFF" },
        { id: "ocean", title: "Ocean", color: "#00CED1" },
        { id: "sunset", title: "Sunset", color: "#FF6347" },
        { id: "forest", title: "Forest", color: "#228B22" },
        { id: "purple", title: "Purple", color: "#9370DB" }
      ]
    },

    {
      id: "notifications",
      type: "form",
      title: "Notification Preferences",
      subtitle: "Choose what you want to hear about",
      fields: [
        {
          name: "security",
          label: "Security Alerts",
          type: "switch",
          defaultValue: true
        },
        {
          name: "updates",
          label: "Product Updates",
          type: "switch",
          defaultValue: true
        },
        {
          name: "tips",
          label: "Tips & Tricks",
          type: "switch",
          defaultValue: false
        }
      ]
    },

    {
      id: "completion",
      type: "display",
      title: "All Set!",
      subtitle: "Your experience is personalized",
      description: "You can change these settings anytime",
      primaryButton: {
        label: "Continue",
        action: "complete"
      }
    }
  ],

  onComplete: async (data) => {
    await saveUserPreferences(data);
    return { success: true };
  }
};
```

---

## Advanced: Custom Step Component

Create a custom step component for unique use cases.

```tsx
// components/flow/steps/custom-calendar-step.tsx
import { CustomStepProps } from "@/types/flow";
import { Calendar } from "@/components/ui/calendar";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export function CustomCalendarStep({ step, data, onUpdate }: CustomStepProps) {
  const handleDateSelect = (date: Date) => {
    onUpdate({ selectedDate: date });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{step.title}</ThemedText>
      <ThemedText type="subtitle">{step.subtitle}</ThemedText>

      <Calendar onDateSelect={handleDateSelect} selectedDate={data.selectedDate} minDate={new Date()} maxDate={addMonths(new Date(), 6)} />
    </ThemedView>
  );
}
```

### Using Custom Step in Flow

```typescript
const appointmentFlow: FlowConfig = {
  id: "book-appointment",
  steps: [
    {
      id: "select-date",
      type: "custom",
      component: CustomCalendarStep,
      title: "Choose a Date",
      subtitle: "Select your preferred appointment date"
    }
    // ... more steps
  ]
};
```

---

## Summary

The unified flow system provides:

✅ **Consistent UX** - Same look and feel across all flows
✅ **Type Safety** - Full TypeScript support with validation
✅ **Flexibility** - Support for linear, branching, and conditional flows
✅ **Reusability** - Write once, use everywhere
✅ **Developer Experience** - Simple API, great documentation
✅ **Performance** - Optimized animations and state management
✅ **Accessibility** - WCAG 2.2 AA compliant out of the box

For more details, see the full implementation plan in `plan/feature-unified-flow-system-1.md`.
