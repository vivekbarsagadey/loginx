---
goal: Complete Guide to 10 Real-World Stepper Use Cases
version: 1.0
date_created: 2025-10-18
status: "Completed"
tags: ["use-cases", "examples", "steppers", "flows"]
---

# Universal Multi-Step Flow System - 10 Real-World Use Cases

This document provides **comprehensive, production-ready examples** for all 10 major stepper use cases in mobile applications. Each use case includes complete flow configuration, best practices, and implementation guidance.

---

## 📋 Table of Contents

1. [Onboarding & Setup](#1-onboarding--setup)
2. [Registration / Sign-Up Flow](#2-registration--sign-up-flow)
3. [Checkout / Payment Flow](#3-checkout--payment-flow)
4. [Booking or Reservation Process](#4-booking-or-reservation-process)
5. [Form Submission / Data Entry](#5-form-submission--data-entry)
6. [Profile Setup or Customization](#6-profile-setup-or-customization)
7. [Learning / Tutorial Flow](#7-learning--tutorial-flow)
8. [App Configuration or Settings Wizard](#8-app-configuration-or-settings-wizard)
9. [Multi-stage Process Tracking](#9-multi-stage-process-tracking)
10. [KYC / Verification Process](#10-kyc--verification-process)

---

## 1. 🧭 Onboarding & Setup

**Purpose:** Guide users through app introduction, permissions, and initial configuration.

**Flow Type:** Linear, skippable
**Progress Indicator:** Dots or horizontal stepper
**Typical Steps:** 3-5 steps

### Complete Example

```typescript
// templates/flows/onboarding-flow.ts
import { FlowConfig } from "@/types/flow";

export const onboardingFlow: FlowConfig = {
  id: "app-onboarding",
  title: "Welcome to LoginX",
  version: "2.0",

  // Visual configuration
  progressIndicator: "dots",
  showHeader: true,
  showSkip: true,

  // Theming - Multiple themes per step
  themes: {
    light: {
      colors: {
        background: "#F0F9FF",
        primary: "#0EA5E9",
        text: "#0C4A6E"
      }
    },
    dark: {
      colors: {
        background: "#0B1220",
        primary: "#3B82F6",
        text: "#F1F5F9"
      }
    }
  },

  // Animation configuration
  animations: {
    stepTransition: "slideRight",
    progressIndicator: "pulse",
    elements: {
      staggerDelay: 100
    }
  },

  steps: [
    {
      id: "welcome",
      type: "display",
      title: "Welcome to LoginX",
      subtitle: "Secure authentication made simple",
      description: "Enterprise-grade security with a beautiful user experience.",

      // Multiple images per step
      images: {
        light: require("@/assets/onboarding/welcome-light.png"),
        dark: require("@/assets/onboarding/welcome-dark.png")
      },

      variant: "hero", // Hero layout for dramatic intro

      animations: {
        entrance: "fadeInUp",
        exit: "fadeOutDown"
      },

      skippable: false
    },

    {
      id: "features",
      type: "display",
      title: "Key Features",
      subtitle: "Everything you need for secure authentication",

      variant: "card", // Card layout for feature showcase

      content: [
        {
          icon: "shield-checkmark",
          iconColor: "#10B981",
          title: "Multi-Factor Authentication",
          description: "Add an extra layer of security with 2FA",
          animation: "fadeIn"
        },
        {
          icon: "finger-print",
          iconColor: "#3B82F6",
          title: "Biometric Login",
          description: "Use Face ID or fingerprint for quick access",
          animation: "fadeIn"
        },
        {
          icon: "lock-closed",
          iconColor: "#8B5CF6",
          title: "End-to-End Encryption",
          description: "Your data is always encrypted and secure",
          animation: "fadeIn"
        }
      ],

      animations: {
        entrance: "slideInRight",
        elements: {
          stagger: true,
          staggerDelay: 150
        }
      },

      skippable: true
    },

    {
      id: "permissions",
      type: "action",
      title: "Enable Notifications",
      subtitle: "Stay informed about your account",
      description: "We'll notify you about login attempts and security alerts.",

      icon: "notifications",
      iconColor: "#F59E0B",

      action: async () => {
        const granted = await requestNotificationPermissions();
        return { granted };
      },

      variant: "minimal",

      primaryButton: {
        label: "Enable Notifications",
        haptic: "medium"
      },

      secondaryButton: {
        label: "Maybe Later",
        style: "text"
      },

      skippable: true
    },

    {
      id: "completion",
      type: "display",
      title: "You're All Set!",
      subtitle: "Let's get started",
      description: "Your account is ready. Tap below to start using LoginX.",

      icon: "checkmark-circle",
      iconColor: "#10B981",

      variant: "minimal",

      animations: {
        entrance: "zoomIn",
        specialEffects: ["confetti"] // Celebration effect
      },

      primaryButton: {
        label: "Get Started",
        action: "complete",
        haptic: "success"
      }
    }
  ],

  // Completion handler
  onComplete: async (data) => {
    await AsyncStorage.setItem("onboarding_completed", "true");
    await AsyncStorage.setItem("onboarding_version", "2.0");
    return { success: true };
  },

  // Skip handler
  onSkip: async () => {
    await AsyncStorage.setItem("onboarding_skipped", "true");
    return { success: true };
  },

  // Analytics
  analytics: {
    trackStepView: true,
    trackCompletion: true,
    trackAbandonment: true,
    trackSkips: true
  }
};
```

### Best Practices

✅ **Keep it short** - 3-5 steps maximum
✅ **Allow skipping** - Don't force users to complete
✅ **Show value first** - Lead with benefits, not features
✅ **Request permissions in context** - Explain why you need them
✅ **Celebrate completion** - Use animations and positive messaging

---

## 2. 🪪 Registration / Sign-Up Flow

**Purpose:** Collect user information for account creation.

**Flow Type:** Linear with validation
**Progress Indicator:** Stepper
**Typical Steps:** 4-6 steps

### Complete Example

```typescript
// templates/flows/registration-flow.ts
import { FlowConfig } from "@/types/flow";
import { z } from "zod";

const registrationSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
      .optional(),
    acceptTerms: z.boolean().refine((val) => val === true)
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
  persistState: true, // Save progress locally

  animations: {
    stepTransition: "slideRight",
    formFields: {
      focus: "scaleUp",
      blur: "scaleDown",
      error: "shake",
      success: "pulse"
    }
  },

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
          autoComplete: "given-name",
          placeholder: "John",
          icon: "person"
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          autoComplete: "family-name",
          placeholder: "Doe",
          icon: "person"
        },
        {
          name: "photoURL",
          label: "Profile Photo",
          type: "image-upload",
          optional: true,
          maxSize: 5 * 1024 * 1024, // 5MB
          acceptedFormats: ["image/jpeg", "image/png"]
        }
      ],

      validationSchema: registrationSchema.pick({
        firstName: true,
        lastName: true
      }),

      animations: {
        fields: {
          stagger: true,
          staggerDelay: 100
        }
      }
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
          autoComplete: "email",
          placeholder: "john@example.com",
          icon: "mail",
          validateOnBlur: true,
          asyncValidation: async (value) => {
            const exists = await checkEmailExists(value);
            if (exists) throw new Error("Email already registered");
          }
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
          showStrengthMeter: true,
          autoComplete: "new-password",
          icon: "lock-closed",
          helperText: "Must be at least 8 characters with uppercase and number"
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          required: true,
          autoComplete: "new-password",
          icon: "lock-closed"
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

      variant: "minimal",

      fields: [
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "phone",
          optional: true,
          placeholder: "+1 (555) 123-4567",
          icon: "call",
          countryCodePicker: true
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
            { text: "Terms of Service", href: "/terms", modal: true },
            { text: "Privacy Policy", href: "/privacy", modal: true }
          ]
        },
        {
          name: "marketing",
          label: "Send me tips and product updates",
          type: "checkbox",
          optional: true,
          defaultValue: false
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
      resendInterval: 60,
      maxAttempts: 5,

      onVerify: async (code) => {
        const valid = await verifyEmailCode(code);
        if (!valid) throw new Error("Invalid code");
        return { verified: true };
      },

      onResend: async () => {
        await sendVerificationEmail();
        return { sent: true };
      }
    },

    {
      id: "success",
      type: "display",
      title: "Account Created!",
      subtitle: "Welcome to LoginX",
      description: "Your account is ready to use",

      icon: "checkmark-circle",
      iconColor: "#10B981",

      variant: "minimal",

      animations: {
        entrance: "zoomIn",
        specialEffects: ["confetti"]
      },

      primaryButton: {
        label: "Continue",
        action: "complete"
      }
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
    // Create Firebase user
    const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);

    // Create Firestore profile
    await createUserProfile(user.uid, {
      displayName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phoneNumber: data.phoneNumber,
      photoURL: data.photoURL,
      marketingOptIn: data.marketing || false
    });

    return { success: true, userId: user.uid };
  },

  onComplete: async (data) => {
    await AsyncStorage.setItem("registration_completed", "true");
    return { success: true };
  },

  // Error handling
  onError: async (error) => {
    await logError("registration_error", error);
    return { handled: true };
  },

  // Analytics
  analytics: {
    trackStepView: true,
    trackFieldInteraction: true,
    trackValidationErrors: true,
    trackCompletion: true,
    trackAbandonment: true
  }
};
```

### Best Practices

✅ **Chunk data entry** - Break into logical steps
✅ **Inline validation** - Validate on blur, not while typing
✅ **Show progress** - Use stepper to show steps remaining
✅ **Save progress** - Persist data locally during flow
✅ **Verify email/phone** - Always verify contact methods
✅ **Password strength** - Show meter and requirements
✅ **Clear error messages** - Explain how to fix issues

---

## 3. 💳 Checkout / Payment Flow

**Purpose:** Guide users through purchase completion.

**Flow Type:** Linear with validation
**Progress Indicator:** Stepper or progress bar
**Typical Steps:** 3-5 steps

### Complete Example

```typescript
// templates/flows/checkout-flow.ts
import { FlowConfig } from "@/types/flow";
import { z } from "zod";

const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
    country: z.string().min(1)
  }),
  paymentMethod: z.enum(["card", "paypal", "apple_pay", "google_pay"]),
  savePaymentMethod: z.boolean().optional()
});

export const checkoutFlow: FlowConfig = {
  id: "checkout",
  title: "Checkout",
  version: "1.0",

  progressIndicator: "stepper",
  showHeader: true,
  persistState: true,

  steps: [
    {
      id: "cart-review",
      type: "display",
      title: "Review Your Cart",
      subtitle: "{{itemCount}} items",

      variant: "card",

      content: {
        type: "cart-summary",
        showItemDetails: true,
        allowRemove: true,
        allowQuantityChange: true
      },

      primaryButton: {
        label: "Continue to Shipping",
        disabled: (data) => data.cart?.items.length === 0
      }
    },

    {
      id: "shipping-address",
      type: "form",
      title: "Shipping Address",
      subtitle: "Where should we send your order?",

      fields: [
        {
          name: "shippingAddress.fullName",
          label: "Full Name",
          type: "text",
          required: true,
          autoComplete: "name"
        },
        {
          name: "shippingAddress.addressLine1",
          label: "Address Line 1",
          type: "text",
          required: true,
          autoComplete: "address-line1"
        },
        {
          name: "shippingAddress.addressLine2",
          label: "Address Line 2",
          type: "text",
          optional: true,
          autoComplete: "address-line2"
        },
        {
          name: "shippingAddress.city",
          label: "City",
          type: "text",
          required: true,
          autoComplete: "address-level2"
        },
        {
          name: "shippingAddress.state",
          label: "State",
          type: "select",
          required: true,
          options: US_STATES,
          autoComplete: "address-level1"
        },
        {
          name: "shippingAddress.zipCode",
          label: "ZIP Code",
          type: "text",
          required: true,
          autoComplete: "postal-code",
          mask: "99999"
        }
      ],

      validationSchema: checkoutSchema.pick({ shippingAddress: true }),

      // Address autocomplete
      autoComplete: {
        service: "google-places",
        onSelect: (address) => ({
          "shippingAddress.addressLine1": address.street,
          "shippingAddress.city": address.city,
          "shippingAddress.state": address.state,
          "shippingAddress.zipCode": address.zipCode
        })
      }
    },

    {
      id: "payment-method",
      type: "selection",
      title: "Payment Method",
      subtitle: "How would you like to pay?",

      variant: "cards",

      options: [
        {
          id: "card",
          title: "Credit/Debit Card",
          icon: "card",
          description: "Visa, Mastercard, Amex, Discover"
        },
        {
          id: "paypal",
          title: "PayPal",
          icon: "logo-paypal",
          description: "Pay with your PayPal account"
        },
        {
          id: "apple_pay",
          title: "Apple Pay",
          icon: "logo-apple",
          description: "Fast and secure",
          condition: (data) => Platform.OS === "ios"
        },
        {
          id: "google_pay",
          title: "Google Pay",
          icon: "logo-google",
          description: "Fast and secure",
          condition: (data) => Platform.OS === "android"
        }
      ],

      required: true
    },

    {
      id: "payment-details",
      type: "form",
      title: "Payment Details",
      subtitle: "Enter your card information",

      fields: [
        {
          name: "cardNumber",
          label: "Card Number",
          type: "text",
          required: true,
          mask: "9999 9999 9999 9999",
          icon: "card"
        },
        {
          name: "expiryDate",
          label: "Expiry Date",
          type: "text",
          required: true,
          mask: "99/99",
          placeholder: "MM/YY"
        },
        {
          name: "cvv",
          label: "CVV",
          type: "text",
          required: true,
          mask: "999",
          secure: true
        },
        {
          name: "savePaymentMethod",
          label: "Save this card for future purchases",
          type: "checkbox",
          optional: true
        }
      ],

      condition: (data) => data.paymentMethod === "card",

      // Stripe integration
      integration: {
        provider: "stripe",
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      }
    },

    {
      id: "review-order",
      type: "display",
      title: "Review & Confirm",
      subtitle: "Please review your order",

      variant: "card",

      content: {
        type: "order-summary",
        sections: [
          { title: "Items", key: "items" },
          { title: "Shipping Address", key: "shippingAddress" },
          { title: "Payment Method", key: "paymentMethod" },
          { title: "Order Total", key: "total" }
        ]
      },

      primaryButton: {
        label: "Place Order - ${{total}}",
        haptic: "medium"
      },

      secondaryButton: {
        label: "Edit",
        action: "back"
      }
    },

    {
      id: "processing",
      type: "loading",
      title: "Processing Payment",
      subtitle: "Please wait...",

      action: async (data) => {
        const order = await processPayment(data);
        return { orderId: order.id };
      },

      animations: {
        loader: "spinner",
        duration: "auto"
      }
    },

    {
      id: "success",
      type: "display",
      title: "Order Placed!",
      subtitle: "Thank you for your purchase",
      description: "Order #{{orderId}}\n\nYou will receive a confirmation email shortly.",

      icon: "checkmark-circle",
      iconColor: "#10B981",

      variant: "minimal",

      animations: {
        entrance: "zoomIn",
        specialEffects: ["confetti"]
      },

      primaryButton: {
        label: "View Order",
        action: (data) => {
          router.push(`/orders/${data.orderId}`);
        }
      },

      secondaryButton: {
        label: "Continue Shopping",
        action: "complete"
      }
    }
  ],

  onComplete: async (data) => {
    await clearCart();
    return { success: true };
  },

  analytics: {
    trackStepView: true,
    trackCompletion: true,
    trackRevenue: true
  }
};
```

### Best Practices

✅ **Show cart summary first** - Let users review before proceeding
✅ **Address autocomplete** - Make address entry easier
✅ **Multiple payment options** - Support various methods
✅ **Order review step** - Always let users confirm before payment
✅ **Loading state** - Show processing indicator
✅ **Success confirmation** - Clear order confirmation with ID

---

## 4. 📅 Booking or Reservation Process

**Purpose:** Schedule appointments, reserve tables, book travel.

**Flow Type:** Linear with date/time selection
**Progress Indicator:** Stepper or progress bar
**Typical Steps:** 4-6 steps

### Complete Example

```typescript
// templates/flows/booking-flow.ts
import { FlowConfig } from "@/types/flow";

export const bookingFlow: FlowConfig = {
  id: "appointment-booking",
  title: "Book Appointment",
  version: "1.0",

  progressIndicator: "stepper",
  persistState: true,

  steps: [
    {
      id: "select-service",
      type: "selection",
      title: "Select Service",
      subtitle: "What would you like to book?",

      variant: "cards",

      options: [
        {
          id: "haircut",
          title: "Haircut",
          description: "Classic cut and style",
          price: "$45",
          duration: "30 min",
          image: require("@/assets/services/haircut.png")
        },
        {
          id: "coloring",
          title: "Hair Coloring",
          description: "Full color treatment",
          price: "$120",
          duration: "2 hours",
          image: require("@/assets/services/coloring.png")
        },
        {
          id: "styling",
          title: "Special Styling",
          description: "For events and occasions",
          price: "$80",
          duration: "1 hour",
          image: require("@/assets/services/styling.png")
        }
      ],

      required: true
    },

    {
      id: "select-provider",
      type: "selection",
      title: "Choose Provider",
      subtitle: "Select your preferred stylist",

      variant: "list",

      options: async (data) => {
        const providers = await fetchAvailableProviders(data.selectService);
        return providers.map((p) => ({
          id: p.id,
          title: p.name,
          subtitle: p.specialty,
          avatar: p.photoURL,
          rating: p.rating,
          reviewCount: p.reviewCount
        }));
      },

      allowAny: {
        id: "any",
        title: "No Preference",
        description: "First available stylist"
      }
    },

    {
      id: "select-date",
      type: "custom",
      component: "DatePicker",
      title: "Choose Date",
      subtitle: "Select your preferred date",

      config: {
        minDate: new Date(),
        maxDate: addMonths(new Date(), 3),
        disabledDates: async (data) => {
          return await fetchUnavailableDates(data.selectProvider);
        }
      },

      required: true
    },

    {
      id: "select-time",
      type: "selection",
      title: "Choose Time",
      subtitle: "{{date}}",

      variant: "grid",

      options: async (data) => {
        const slots = await fetchAvailableTimeSlots(data.selectProvider, data.selectDate);
        return slots.map((slot) => ({
          id: slot.time,
          title: formatTime(slot.time),
          disabled: slot.booked
        }));
      },

      required: true
    },

    {
      id: "contact-info",
      type: "form",
      title: "Contact Information",
      subtitle: "How can we reach you?",

      fields: [
        {
          name: "name",
          label: "Full Name",
          type: "text",
          required: true,
          defaultValue: (data) => data.user?.displayName
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          defaultValue: (data) => data.user?.email
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "phone",
          required: true,
          defaultValue: (data) => data.user?.phoneNumber
        },
        {
          name: "notes",
          label: "Special Requests",
          type: "textarea",
          optional: true,
          placeholder: "Any special requests or notes?"
        },
        {
          name: "reminders",
          label: "Send me appointment reminders",
          type: "checkbox",
          defaultValue: true
        }
      ]
    },

    {
      id: "review-booking",
      type: "display",
      title: "Confirm Booking",
      subtitle: "Please review your appointment",

      variant: "card",

      content: {
        type: "booking-summary",
        fields: [
          { label: "Service", value: "{{selectService.title}}" },
          { label: "Provider", value: "{{selectProvider.title}}" },
          { label: "Date", value: "{{selectDate}}" },
          { label: "Time", value: "{{selectTime}}" },
          { label: "Duration", value: "{{selectService.duration}}" },
          { label: "Price", value: "{{selectService.price}}" }
        ]
      },

      primaryButton: {
        label: "Confirm Booking",
        haptic: "medium"
      }
    },

    {
      id: "success",
      type: "display",
      title: "Booking Confirmed!",
      subtitle: "We look forward to seeing you",
      description: "Confirmation sent to {{email}}",

      icon: "checkmark-circle",
      iconColor: "#10B981",

      variant: "minimal",

      content: {
        type: "booking-details",
        showAddToCalendar: true,
        showDirections: true
      },

      animations: {
        entrance: "zoomIn",
        specialEffects: ["confetti"]
      },

      primaryButton: {
        label: "Add to Calendar",
        action: async (data) => {
          await addToCalendar(data.booking);
        }
      },

      secondaryButton: {
        label: "Done",
        action: "complete"
      }
    }
  ],

  onSubmit: async (data) => {
    const booking = await createBooking({
      serviceId: data.selectService,
      providerId: data.selectProvider,
      date: data.selectDate,
      time: data.selectTime,
      contactInfo: data.contactInfo
    });

    return { booking };
  },

  onComplete: async (data) => {
    await sendConfirmationEmail(data.booking);
    await sendConfirmationSMS(data.booking);
    return { success: true };
  }
};
```

### Best Practices

✅ **Service selection first** - Show what's available
✅ **Provider preference** - Allow "no preference" option
✅ **Visual calendar** - Easy date selection
✅ **Available time slots** - Only show available times
✅ **Contact verification** - Pre-fill from profile
✅ **Review before confirm** - Clear summary
✅ **Calendar integration** - Add to user's calendar
✅ **Confirmation notification** - Email and SMS

---

## 5. 🧾 Form Submission / Data Entry

**Purpose:** Collect complex data (insurance claims, job applications, surveys).

**Flow Type:** Linear with extensive validation
**Progress Indicator:** Progress bar
**Typical Steps:** 5-10+ steps

### Complete Example

```typescript
// templates/flows/insurance-claim-flow.ts
import { FlowConfig } from "@/types/flow";

export const insuranceClaimFlow: FlowConfig = {
  id: "insurance-claim",
  title: "File Insurance Claim",
  version: "1.0",

  progressIndicator: "bar", // Bar for longer flows
  showHeader: true,
  persistState: true, // Critical for long forms
  autoSave: true, // Save every 30 seconds

  steps: [
    {
      id: "claim-type",
      type: "selection",
      title: "Claim Type",
      subtitle: "What type of claim are you filing?",

      variant: "cards",

      options: [
        {
          id: "auto",
          title: "Auto Accident",
          icon: "car",
          description: "Vehicle damage or collision"
        },
        {
          id: "property",
          title: "Property Damage",
          icon: "home",
          description: "Home or property damage"
        },
        {
          id: "health",
          title: "Health/Medical",
          icon: "medical",
          description: "Medical expenses or treatment"
        }
      ],

      required: true
    },

    {
      id: "policy-info",
      type: "form",
      title: "Policy Information",
      subtitle: "Enter your policy details",

      fields: [
        {
          name: "policyNumber",
          label: "Policy Number",
          type: "text",
          required: true,
          mask: "AAAA-9999999",
          asyncValidation: async (value) => {
            const valid = await validatePolicyNumber(value);
            if (!valid) throw new Error("Invalid policy number");
          }
        },
        {
          name: "policyHolder",
          label: "Policy Holder Name",
          type: "text",
          required: true
        },
        {
          name: "effectiveDate",
          label: "Policy Effective Date",
          type: "date",
          required: true
        }
      ]
    },

    {
      id: "incident-details",
      type: "form",
      title: "Incident Details",
      subtitle: "Tell us what happened",

      fields: [
        {
          name: "incidentDate",
          label: "Date of Incident",
          type: "date",
          required: true,
          maxDate: new Date()
        },
        {
          name: "incidentTime",
          label: "Time of Incident",
          type: "time",
          required: true
        },
        {
          name: "location",
          label: "Location",
          type: "text",
          required: true,
          autoComplete: "address"
        },
        {
          name: "description",
          label: "Detailed Description",
          type: "textarea",
          required: true,
          minLength: 50,
          maxLength: 2000,
          placeholder: "Provide a detailed description of the incident..."
        }
      ]
    },

    {
      id: "damage-assessment",
      type: "form",
      title: "Damage Assessment",
      subtitle: "Describe the damage",

      fields: [
        {
          name: "damageType",
          label: "Type of Damage",
          type: "multi-select",
          required: true,
          options: ["Structural damage", "Water damage", "Fire damage", "Theft", "Vandalism", "Other"]
        },
        {
          name: "estimatedCost",
          label: "Estimated Repair Cost",
          type: "currency",
          required: true,
          min: 0,
          prefix: "$"
        },
        {
          name: "damagePhotos",
          label: "Photos of Damage",
          type: "multi-image-upload",
          required: true,
          minFiles: 2,
          maxFiles: 10,
          maxFileSize: 5 * 1024 * 1024
        }
      ]
    },

    {
      id: "witnesses",
      type: "form",
      title: "Witnesses",
      subtitle: "Were there any witnesses?",

      fields: [
        {
          name: "hasWitnesses",
          label: "Were there any witnesses?",
          type: "radio",
          required: true,
          options: ["Yes", "No"]
        },
        {
          name: "witnesses",
          label: "Witness Information",
          type: "repeater",
          condition: (data) => data.hasWitnesses === "Yes",
          minItems: 1,
          maxItems: 5,
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "phone", label: "Phone", type: "phone", required: true },
            { name: "statement", label: "Statement", type: "textarea" }
          ]
        }
      ],

      skippable: true
    },

    {
      id: "police-report",
      type: "form",
      title: "Police Report",
      subtitle: "Was a police report filed?",

      fields: [
        {
          name: "policeReportFiled",
          label: "Was a police report filed?",
          type: "radio",
          required: true,
          options: ["Yes", "No"]
        },
        {
          name: "reportNumber",
          label: "Report Number",
          type: "text",
          required: true,
          condition: (data) => data.policeReportFiled === "Yes"
        },
        {
          name: "officerName",
          label: "Officer Name",
          type: "text",
          condition: (data) => data.policeReportFiled === "Yes"
        },
        {
          name: "reportDocument",
          label: "Upload Police Report",
          type: "file-upload",
          condition: (data) => data.policeReportFiled === "Yes",
          acceptedFormats: [".pdf", ".jpg", ".png"]
        }
      ],

      skippable: true
    },

    {
      id: "additional-documents",
      type: "form",
      title: "Additional Documents",
      subtitle: "Upload any supporting documents",

      fields: [
        {
          name: "documents",
          label: "Supporting Documents",
          type: "multi-file-upload",
          optional: true,
          acceptedFormats: [".pdf", ".jpg", ".png", ".doc", ".docx"],
          maxFiles: 10,
          helperText: "Receipts, estimates, medical bills, etc."
        }
      ],

      skippable: true
    },

    {
      id: "review-claim",
      type: "display",
      title: "Review Your Claim",
      subtitle: "Please review all information",

      variant: "card",

      content: {
        type: "claim-summary",
        sections: [
          { title: "Claim Type", key: "claimType" },
          { title: "Policy Information", key: "policyInfo" },
          { title: "Incident Details", key: "incidentDetails" },
          { title: "Damage Assessment", key: "damageAssessment" },
          { title: "Witnesses", key: "witnesses" },
          { title: "Police Report", key: "policeReport" },
          { title: "Documents", key: "documents" }
        ],
        editable: true
      },

      primaryButton: {
        label: "Submit Claim",
        haptic: "medium"
      },

      secondaryButton: {
        label: "Edit",
        action: "back"
      }
    },

    {
      id: "success",
      type: "display",
      title: "Claim Submitted!",
      subtitle: "Claim #{{claimNumber}}",
      description: "We will review your claim and contact you within 2-3 business days.",

      icon: "checkmark-circle",
      iconColor: "#10B981",

      variant: "minimal",

      content: {
        type: "next-steps",
        steps: ["Claim review (1-2 days)", "Adjuster assignment", "Damage assessment", "Settlement offer"]
      },

      primaryButton: {
        label: "View Claim Status",
        action: (data) => {
          router.push(`/claims/${data.claimNumber}`);
        }
      },

      secondaryButton: {
        label: "Done",
        action: "complete"
      }
    }
  ],

  // Auto-save configuration
  autoSave: {
    enabled: true,
    interval: 30000, // 30 seconds
    storage: "local"
  },

  onSubmit: async (data) => {
    const claim = await submitClaim(data);
    return { claimNumber: claim.number };
  },

  analytics: {
    trackStepView: true,
    trackFieldInteraction: true,
    trackValidationErrors: true,
    trackSaveProgress: true,
    trackCompletion: true
  }
};
```

### Best Practices

✅ **Use progress bar** - Shows completion percentage
✅ **Auto-save** - Critical for long forms
✅ **Field validation** - Validate as users complete fields
✅ **File uploads** - Support multiple documents
✅ **Repeater fields** - For multiple entries (witnesses)
✅ **Review step** - Let users review everything
✅ **Save draft** - Allow users to come back later

---

_Continuing with use cases 6-10 in next section due to length..._

Would you like me to continue with the remaining 5 use cases (Profile Setup, Learning/Tutorial, App Configuration, Process Tracking, and KYC/Verification)?
