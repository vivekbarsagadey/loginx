# Expo Go Development Guide

## Overview

This document explains how to develop and test LoginX with **Expo Go** and when
you need a **Development Build**.

## What is Expo Go

**Expo Go** is a free app available on iOS and Android app stores that allows
you to quickly test your Expo project without building native code. However, it
has limitations.

## Features Available in Expo Go ✅

The following features work perfectly in Expo Go:

- ✅ **Email/Password Authentication** (Firebase Auth)
- ✅ **Email Verification**
- ✅ **Phone Verification** (Firebase)
- ✅ **2FA (Two-Factor Authentication)**
- ✅ **Password Reset**
- ✅ **Biometric Authentication** (FaceID/TouchID/Fingerprint via
  `expo-local-authentication`)
- ✅ **Theme Switching** (Light/Dark/System)
- ✅ **Internationalization** (i18n)
- ✅ **Push Notifications** (via `expo-notifications`)
- ✅ **Image Picker** (via `expo-image-picker`)
- ✅ **Local Storage** (AsyncStorage)
- ✅ **Secure Storage** (SecureStore)
- ✅ **Firestore Database**
- ✅ **All UI Components**

## Features NOT Available in Expo Go ❌

The following features require a **Development Build**:

- ❌ **Google Sign-In** (requires `@react-native-google-signin/google-signin`)
- ❌ Any custom native modules not included in Expo Go

## Using Expo Go

### 1. Start the Development Server

```powershell
pnpm start
```

Or with tunnel for external testing:

```powershell
pnpm android  # Uses tunnel mode
```

### 2. Scan QR Code

- **iOS**: Use the Camera app to scan the QR code
- **Android**: Open Expo Go app and scan the QR code

### 3. Expected Behavior

When running in Expo Go:

1. A banner will appear at the top saying "Running in Expo Go"
2. Google Sign-In button will be **disabled**
3. Apple Sign-In will work on iOS (built into Expo Go)
4. All other features work normally

### 4. Testing Authentication

You can test the full authentication flow using:

- **Email/Password Registration**
- **Email/Password Login**
- **Email Verification**
- **Phone Verification**
- **2FA Setup and Verification**
- **Biometric Authentication** (if your device supports it)
- **Password Reset**

## Creating a Development Build

When you need Google Sign-In or other custom native features, create a
development build:

### Step 1: Install EAS CLI

```powershell
npm install -g eas-cli
```

### Step 2: Login to Expo

```powershell
eas login
```

### Step 3: Configure EAS Build

Your project already has `eas.json` configured. Review it:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### Step 4: Build Development Client

For Android:

```powershell
eas build --profile development --platform android
```

For iOS:

```powershell
eas build --profile development --platform ios
```

### Step 5: Install Development Build

Once the build completes:

1. Download the `.apk` (Android) or `.ipa` (iOS) file
2. Install it on your device
3. Run your project: `pnpm start`
4. Open the app from your device (not Expo Go)
5. Now Google Sign-In will work! ✅

## Local Development Builds (Faster)

For faster iteration, you can build locally:

### Prerequisites

- **Android**: Android Studio installed
- **iOS**: Xcode installed (Mac only)

### Build Locally

Generate native code:

```powershell
npx expo prebuild
```

Run on Android:

```powershell
npx expo run:android
```

Run on iOS (Mac only):

```powershell
npx expo run:ios
```

## Environment Variables

### For Expo Go

Use the `.env.expo-go` file (already created):

```env
EXPO_PUBLIC_ENABLE_GOOGLE_SIGNIN=false
EXPO_PUBLIC_ENABLE_BIOMETRICS=false
```

### For Development Build

Use the regular `.env` file:

```env
EXPO_PUBLIC_ENABLE_GOOGLE_SIGNIN=true
EXPO_PUBLIC_ENABLE_BIOMETRICS=true

# Google OAuth
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
```

## Troubleshooting

### Error: TurboModuleRegistry.getEnforcing(...): 'RNGoogleSignin' could not be found

**Solution**: This error appears when trying to use Google Sign-In in Expo Go.

**Fix**:

1. The code now automatically detects Expo Go and disables Google Sign-In
2. If you still see the error, clear cache:

```powershell
pnpm start --clear
```

### Google Sign-In Button is Disabled

This is **expected behavior** in Expo Go. The button is intentionally disabled
to prevent errors.

**Solution**: Create a development build (see above).

### I need to test Google Sign-In quickly

**Solution**: Use Firebase Authentication Emulator:

Install Firebase tools:

```powershell
npm install -g firebase-tools
```

Initialize Firebase:

```powershell
firebase init emulators
```

Start emulator:

```powershell
firebase emulators:start
```

Update your Firebase config to use emulator.

## Best Practices

### Development Workflow

1. **Start with Expo Go** - Test most features quickly
2. **Switch to Development Build** - When you need native modules
3. **Use EAS Update** - Push JS/asset updates without rebuilding

### Code Organization

The project is organized to support both Expo Go and development builds:

- **Conditional imports** - Native modules are imported conditionally
- **Feature flags** - Environment variables control feature availability
- **Graceful degradation** - UI adapts based on available features

### Example: Conditional Feature Usage

```typescript
import Constants from "expo-constants";

const isExpoGo = Constants.appOwnership === "expo";

if (isExpoGo) {
  // Show message: "Feature not available in Expo Go"
} else {
  // Use native module
}
```

## Testing Checklist

### Expo Go Testing

- [ ] Email/Password Registration
- [ ] Email/Password Login
- [ ] Email Verification
- [ ] Phone Verification
- [ ] 2FA Setup and Login
- [ ] Password Reset
- [ ] Biometric Authentication
- [ ] Theme Switching
- [ ] Language Switching
- [ ] Profile Management
- [ ] Push Notifications
- [ ] Image Upload

### Development Build Testing

All above, plus:

- [ ] Google Sign-In Registration
- [ ] Google Sign-In Login
- [ ] Apple Sign-In (iOS only)

## Resources

- [Expo Go Documentation](https://docs.expo.dev/get-started/expo-go/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Application Services](https://expo.dev/eas)

## Quick Commands Reference

```powershell
# Start with Expo Go
pnpm start

# Start with tunnel (external testing)
pnpm android

# Clear cache and start
pnpm start --clear

# Build development client (Android)
eas build --profile development --platform android

# Build development client (iOS)
eas build --profile development --platform ios

# Build locally (Android)
npx expo run:android

# Build locally (iOS, Mac only)
npx expo run:ios

# Generate native code
npx expo prebuild
```

## Support

If you encounter issues:

1. Check this guide first
2. Clear cache: `pnpm start --clear`
3. Check [Expo Discord](https://chat.expo.dev/)
4. Open an issue on GitHub

---

**Last Updated**: October 6, 2025
