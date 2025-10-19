#!/bin/bash

# Auth hooks
echo "export * from './auth/use-auth-provider';" > use-auth-provider.tsx
echo "export * from './auth/use-biometric-auth';" > use-biometric-auth.tsx
echo "export * from './auth/use-two-factor-auth';" > use-two-factor-auth.tsx
echo "export * from './auth/use-social-auth';" > use-social-auth.tsx
echo "export * from './auth/use-security-settings';" > use-security-settings.tsx
echo "export * from './auth/use-permissions';" > use-permissions.tsx
echo "export * from './auth/use-registration-flow';" > use-registration-flow.ts
echo "export * from './auth/use-registration-state';" > use-registration-state.ts
echo "export * from './auth/use-email-availability';" > use-email-availability.tsx

# Async hooks
echo "export * from './async/use-async-operation';" > use-async-operation.tsx
echo "export * from './async/use-loading-state';" > use-loading-state.tsx
echo "export * from './async/use-async-error-handler';" > use-async-error-handler.ts

# UI hooks
echo "export * from './ui/use-dialog';" > use-dialog.tsx
echo "export * from './ui/use-alert';" > use-alert.tsx
echo "export * from './ui/use-haptic-action';" > use-haptic-action.tsx
echo "export * from './ui/use-haptic-navigation';" > use-haptic-navigation.tsx
echo "export * from './ui/use-auto-focus';" > use-auto-focus.tsx
echo "export * from './ui/use-form-submit';" > use-form-submit.tsx

# Layout hooks
echo "export * from './layout/use-responsive';" > use-responsive.tsx

# Device hooks
echo "export * from './device/use-network-status';" > use-network-status.tsx
echo "export * from './device/use-accessibility';" > use-accessibility.tsx

# Theme hooks
echo "export * from './theme/use-theme-context';" > use-theme-context.tsx
echo "export * from './theme/use-theme-color';" > use-theme-color.ts
echo "export * from './theme/use-theme-colors';" > use-theme-colors.ts
echo "export * from './theme/use-color-scheme';" > use-color-scheme.ts
echo "export * from './theme/use-language';" > use-language.tsx
echo "export * from './theme/use-language-provider';" > use-language-provider.tsx

# Lifecycle hooks
echo "export * from './lifecycle/use-optimized-callback';" > use-optimized-callback.tsx

# Utility hooks
echo "export * from './utility/use-onboarding-provider';" > use-onboarding-provider.tsx
echo "export * from './utility/use-push-notifications';" > use-push-notifications.tsx
echo "export * from './utility/use-notification-count';" > use-notification-count.tsx
echo "export * from './utility/use-error-handler';" > use-error-handler.tsx

echo "Created all re-export files"
