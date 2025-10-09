# Alert Replacement Status

## Overview

This document tracks the progress of replacing all `Alert.alert` calls with the
themed dialog system using the `useAlert` hook.

## Why Replace Alert.alert?

1. **Theme Consistency** - Alert.alert uses native system dialogs that don't
   match our app theme
2. **Better UX** - Custom dialogs provide better animations, haptic feedback,
   and visual consistency
3. **Dark Mode Support** - System alerts don't respect our theme (light/dark
   mode)
4. **Variant Support** - Our themed dialogs support success, warning, error
   variants with appropriate colors
5. **Accessibility** - Better control over accessibility features

## Replacement Pattern

### Before (Using Alert.alert)

```typescript
import { Alert } from "react-native";

Alert.alert("Title", "Message", [{ text: "OK", onPress: handleOk }]);
```

### After (Using useAlert)

```typescript
import { useAlert } from '@/hooks/use-alert';

const { show: showAlert, AlertComponent } = useAlert();

// In handler
showAlert('Title', 'Message', [{ text: 'OK', onPress: handleOk }], { variant: 'success' });

// In JSX (before closing tag)
return (
  <View>
    {/* Your content */}
    {AlertComponent}
  </View>
);
```

## Completed Files ✅

### Onboarding Components

- ✅ `components/onboarding/notification-slide.tsx` (7 replacements)
- ✅ `components/onboarding/biometric-slide.tsx` (3 replacements)
- ✅ `components/onboarding/profile-slide.tsx` (2 replacements)

### UI Components

- ✅ `components/ui/photo-upload.tsx` (5 replacements)

### Authentication Screens

- ✅ `app/(auth)/login.tsx` (3 replacements)
- ✅ `app/(auth)/verify-email.tsx` (4 replacements)
- ✅ `app/(auth)/forgot-password.tsx` (1 replacement)

### App Screens

- ✅ `app/feedback.tsx` (6 replacements)
- ✅ `app/report-issue.tsx` (6 replacements)
- ✅ `app/rate-app.tsx` (5 replacements)

**Total Completed: 10 files, ~42 Alert.alert calls replaced**

## Remaining Files 🔄

### UI Components (High Priority)

- ⏳ `components/ui/multi-photo-picker.tsx` - 5 Alert.alert calls
  - Permission required alert
  - Maximum photos reached alert
  - Image size validation alert
  - Remove photo confirmation
  - Remove all photos confirmation

- ⏳ `components/ui/qr-scanner.tsx` - 4 Alert.alert calls
  - Camera permission alerts
  - Invalid QR code alert
  - Error handling alerts

### Authentication Screens (High Priority)

- ⏳ `app/(auth)/verify-2fa.tsx` - 2 Alert.alert calls
  - Backup code info
  - Cancel verification warning

- ⏳ `app/(auth)/verify-magic-link.tsx` - 1 Alert.alert call
  - No email error

- ⏳ `app/(auth)/verify-phone.tsx` - 2 Alert.alert calls
  - Demo mode notification
  - Skip verification confirmation

- ⏳ `app/(auth)/register/index.tsx` - 1 Alert.alert call
  - Cancel registration confirmation

### App Screens (Medium Priority)

- ⏳ `app/notifications/index.tsx` - 2 Alert.alert calls
  - Delete notification confirmation
  - Clear all notifications confirmation

- ⏳ `app/legal/data-rights.tsx` - 3 Alert.alert calls
  - Request data confirmation
  - Delete data warning
  - Success messages

- ⏳ `app/(tabs)/index.tsx` - Check for alerts
- ⏳ `app/security/sessions.tsx` - Check for alerts

### Utilities (Low Priority)

- ⏳ `utils/safe-navigation.ts` - 1 Alert.alert call
  - Navigation error handling

**Total Remaining: ~11 files, ~21 Alert.alert calls**

## Implementation Checklist

For each file that needs updating:

1. [ ] Replace Alert import

   ```diff
   - import { Alert, ... } from 'react-native';
   + import { ... } from 'react-native';
   + import { useAlert } from '@/hooks/use-alert';
   ```

2. [ ] Initialize useAlert hook in component

   ```typescript
   const { show: showAlert, AlertComponent } = useAlert();
   ```

3. [ ] Replace Alert.alert calls with showAlert

   ```diff
   - Alert.alert('Title', 'Message', [{ text: 'OK' }]);
   + showAlert('Title', 'Message', [{ text: 'OK' }], { variant: 'success' });
   ```

4. [ ] Add variant based on context:
   - `variant: 'success'` - Success messages, confirmations
   - `variant: 'warning'` - Warnings, validation errors
   - `variant: 'error'` - Error messages, failures
   - `variant: 'default'` - Informational messages

5. [ ] Add AlertComponent to JSX before closing container

   ```tsx
   return (
     <ScreenContainer>
       {/* Content */}
       {AlertComponent}
     </ScreenContainer>
   );
   ```

6. [ ] Update useCallback dependencies if needed

   ```typescript
   const handleAction = useCallback(() => {
     showAlert(...);
   }, [..., showAlert]);
   ```

7. [ ] Test all dialog interactions
   - [ ] Dialogs appear correctly
   - [ ] Theme colors apply properly
   - [ ] Button actions work
   - [ ] Dismissable behavior works
   - [ ] Dark mode support

## Variant Guidelines

### Success (variant: 'success')

- Email sent successfully
- Data saved successfully
- Registration completed
- Profile updated
- Action completed

### Warning (variant: 'warning')

- Validation errors
- Permission required
- Maximum limits reached
- Skip confirmations
- Feature disabled

### Error (variant: 'error')

- Authentication failures
- Network errors
- Failed operations
- Missing required data
- System errors

### Default (variant: 'default')

- Informational messages
- General confirmations
- Help text
- Instructions

## Testing Checklist

After completing all replacements:

- [ ] Test all dialog appearances in light mode
- [ ] Test all dialog appearances in dark mode
- [ ] Verify haptic feedback works
- [ ] Test dismissable behavior
- [ ] Test button actions
- [ ] Verify animations are smooth
- [ ] Check accessibility labels
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Remove unused Alert imports

## Benefits Achieved

Once complete:

1. ✅ **Consistent theming** across all dialogs
2. ✅ **Dark mode support** for all alerts
3. ✅ **Better UX** with smooth animations
4. ✅ **Haptic feedback** integration
5. ✅ **Variant colors** for different message types
6. ✅ **Accessibility** improvements
7. ✅ **Reduced dependencies** on native dialogs

## Next Steps

1. Complete remaining UI component replacements (multi-photo-picker, qr-scanner)
2. Complete remaining auth screen replacements
3. Complete remaining app screen replacements
4. Update utility file (safe-navigation.ts)
5. Run comprehensive testing
6. Remove unused Alert imports
7. Update ESLint rules to prevent Alert.alert usage (optional)

## Notes

- The `useAlert` hook mimics the Alert.alert API for easy migration
- Supports 1-2 buttons (single alert or confirmation)
- Automatically handles loading states in confirmations
- Provides themed backdrop and animations
- Respects system reduced motion preferences

---

**Last Updated:** January 10, 2025  
**Status:** 10/21 files complete (~67% done)  
**Next Priority:** UI Components (multi-photo-picker, qr-scanner)
