# LoginX

**Version 1.0.0** | Built with ❤️ by [Whiz IT](https://whizit.co.in)

LoginX is a modern, enterprise-grade, cross-platform mobile authentication
application built with React Native and Expo. It provides a seamless, secure,
and accessible user authentication experience with support for multiple
languages, biometric authentication, two-factor authentication, and
comprehensive profile management.

> **⚠️ SECURITY NOTICE (October 2, 2025)**\
> Critical security updates have been implemented. **Environment variables are
> now mandatory**.\
> Please read [SECURITY.md](./SECURITY.md) before running the app in production.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D8.0.0-orange)](https://pnpm.io/)
[![Expo SDK](https://img.shields.io/badge/expo-54.0.12-blue)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/react--native-0.81.4-blue)](https://reactnative.dev/)

## Table of Contents

- [Features](#features)
- [What's New](#whats-new)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Available Scripts](#available-scripts)
- [Technologies & Dependencies](#technologies--dependencies)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Security](#security)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [About](#about)
  - [About Vivek Barsagadey](#about-vivek-barsagadey)
  - [About Whiz IT](#about-whiz-it)
- [Acknowledgments](#acknowledgments)
- [Project Status](#project-status)

## Features

### 🔐 Authentication & Security

- **Firebase Authentication Integration** - Secure email/password authentication
- **Multi-Step Registration Flow** - Guided 3-step onboarding process with
  validation
- **Email Verification** - Automated verification emails with secure token
  handling
- **Password Reset** - Secure forgot password flow with email validation
- **Biometric Authentication** - Support for Face ID, Touch ID, and fingerprint
  (iOS/Android)
- **Two-Factor Authentication (2FA)** - Additional security layer for user
  accounts
- **Session Management** - Active session monitoring and management
- **Input Sanitization** - All user inputs are sanitized to prevent XSS and
  injection attacks
- **Firestore Security Rules** - Comprehensive backend security rules

### 👤 User Profile Management

- **Complete Profile System** - User profiles stored in Firebase Firestore
- **Profile Editing** - Update display name, email, and profile information
- **Email Updates** - Secure email change process with verification
- **Password Management** - Change password with old password verification
- **Soft Delete** - Account deletion with data retention for recovery

### 🌍 Internationalization (i18n)

- **Multi-Language Support** - English (en), Spanish (es), Hindi (hi)
- **Dynamic Language Switching** - Change language without app restart
- **Locale-Aware Formatting** - Date, time, and number formatting based on
  locale
- **RTL Support Ready** - Architecture supports right-to-left languages

### 🎨 Theming & Accessibility

- **Light & Dark Mode** - Automatic and manual theme switching
- **System Theme Detection** - Respects device theme preferences
- **Themed Components** - Comprehensive themed UI component library
- **Dynamic Text Sizing** - Adjustable text sizes for better readability
- **Accessibility Labels** - Full VoiceOver/TalkBack support
- **High Contrast Support** - Optimized for accessibility standards
- **Platform-Specific Design** - Follows iOS HIG and Android Material Design
  guidelines

### 📱 User Experience

- **Onboarding Flow** - First-time user experience with feature highlights
- **Haptic Feedback** - Tactile feedback for interactions (iOS/Android)
- **Push Notifications** - Firebase Cloud Messaging integration
- **Splash Screen** - Custom branded splash screens for light/dark modes
- **Error Boundaries** - Graceful error handling with user-friendly messages
- **Loading States** - Skeleton screens and loading indicators
- **Form Validation** - Real-time validation with Zod schemas

### 🛠️ Developer Experience

- **TypeScript** - 100% type-safe codebase
- **Expo Router** - File-based routing with typed routes
- **React Hook Form** - Performant form management
- **Zod Validation** - Runtime type checking and validation
- **ESLint & Prettier** - Code quality and formatting
- **Markdown Linting** - Documentation quality checks
- **Type Checking** - Strict TypeScript configuration
- **Environment Variables** - Secure configuration management
- **Debug Utilities** - Development-only logging and debugging tools

### 📊 Data & Storage

- **Firebase Firestore** - Cloud-based NoSQL database
- **AsyncStorage** - Persistent key-value storage
- **Secure Storage** - Encrypted storage for sensitive data (expo-secure-store)
- **Caching System** - Intelligent data caching with TTL
- **Retry Logic** - Automatic retry for failed network requests

### 🔔 Notifications & Communication

- **Push Notifications** - Rich push notifications with Firebase
- **Notifications Center** - Dedicated screen showing all past notifications
  with history
- **In-App Notifications** - Contextual alerts and messages
- **Notification Management** - Mark as read, delete, and clear all
  notifications
- **Email Integration** - Automated emails for verification and notifications

## What's New

### Version 1.0.0 (October 2, 2025)

#### 🔒 Security Enhancements

- **Mandatory Environment Variables** - All Firebase credentials now required
- **Enhanced Input Sanitization** - XSS and injection prevention
- **Firestore Security Rules** - Comprehensive backend security
- **Session Security** - Platform-specific authentication persistence

#### ✨ New Features

- **2FA Support** - Two-factor authentication implementation
- **Biometric Auth** - Face ID, Touch ID, fingerprint support
- **Session Management** - View and manage active sessions
- **Language Picker** - Enhanced multi-language support (EN, ES, HI)
- **Text Size Adjustment** - Accessibility text sizing
- **What's New Screen** - In-app changelog viewer

#### 🎨 UI/UX Improvements

- **Themed Components Library** - Complete themed UI system
- **Skeleton Loading** - Better loading state indicators
- **Error Boundaries** - Comprehensive error handling
- **Haptic Feedback** - Enhanced tactile feedback
- **Accessibility** - WCAG 2.1 AA compliance improvements

#### 🛠️ Developer Improvements

- **pnpm Package Manager** - Faster, more efficient dependency management
- **Validation Script** - Combined lint, format, and type-check validation
- **Markdown Linting** - Documentation quality automation
- **TypeScript Strict Mode** - Enhanced type safety
- **Debug Utilities** - Development logging system

## Getting Started

Follow these instructions to get LoginX running on your local machine for
development and testing.

### Prerequisites

Ensure you have the following installed on your system:

- **[Node.js](https://nodejs.org/)** (v18.0.0 or newer)

- **[pnpm](https://pnpm.io/)** (v8.0.0 or newer)

  ```bash
  npm install -g pnpm
  ```

- **[Expo CLI](https://docs.expo.dev/get-started/installation/)**

  ```bash
  pnpm install -g expo-cli
  ```

- **[Git](https://git-scm.com/)**

- **Firebase Account** - Create a free account at
  [Firebase Console](https://console.firebase.google.com/)

- **Expo Go App** (for quick testing) - Download for
  [iOS](https://apps.apple.com/app/expo-go/id982107779) or
  [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

- **iOS Simulator** (Mac only) or **Android Emulator** for mobile development

- **EAS CLI** (optional, for builds)

  ```bash
  pnpm install -g eas-cli
  ```

> **📱 Expo Go vs Development Build**
>
> - **Expo Go**: Quick testing - Most features work including email auth, 2FA,
>   and biometrics ✅
> - **Development Build**: Required for Google Sign-In and other custom native
>   modules ⚠️
>
> See [EXPO_GO_GUIDE.md](./EXPO_GO_GUIDE.md) for detailed instructions on what
> works in Expo Go and when you need a development build.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vivekbarsagadey/loginx.git
   cd loginx
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

   > **Note:** This project uses pnpm as the package manager for better
   > performance and disk space efficiency.

3. **Set up Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable **Authentication** (Email/Password provider)
   - Enable **Firestore Database**
   - Go to Project Settings > General
   - In "Your apps" section, add a Web app
   - Copy the Firebase configuration values

4. **Set up Firestore Security Rules:**

   ```bash
   firebase init firestore
   firebase deploy --only firestore:rules
   ```

   The security rules are already defined in `firestore.rules`.

### Android Keystore Setup

LoginX uses a secure Android upload keystore for signing production builds. The
keystore file and credentials are stored in the `keystore/` directory.

1. **Locate keystore files:**

   ```
   keystore/
   ├── @vivekbarsagadey__loginx-keystore.bak.jks    # Keystore file
   └── @vivekbarsagadey__loginx-keystore-credentials.md  # Credentials
   ```

2. **View keystore information:**

   To inspect the keystore and verify its details:

   ```bash
   # Windows PowerShell
   keytool -list -v -keystore .\keystore\@vivekbarsagadey__loginx-keystore.bak.jks -storepass YOUR_KEYSTORE_PASSWORD

   # Mac/Linux
   keytool -list -v -keystore ./keystore/@vivekbarsagadey__loginx-keystore.bak.jks -storepass YOUR_KEYSTORE_PASSWORD
   ```

   This will display:
   - Keystore type (JKS)
   - Key alias information
   - Certificate fingerprints (SHA1, SHA256)
   - Validity period
   - Owner information

3. **View specific key information:**

   ```bash
   # Windows PowerShell
   keytool -list -v -keystore .\keystore\@vivekbarsagadey__loginx-keystore.bak.jks -alias YOUR_KEY_ALIAS -storepass YOUR_KEYSTORE_PASSWORD -keypass YOUR_KEY_PASSWORD

   # Mac/Linux
   keytool -list -v -keystore ./keystore/@vivekbarsagadey__loginx-keystore.bak.jks -alias YOUR_KEY_ALIAS -storepass YOUR_KEYSTORE_PASSWORD -keypass YOUR_KEY_PASSWORD
   ```

4. **Export certificate (optional):**

   To export the public certificate for Google Play Console:

   ```bash
   # Windows PowerShell
   keytool -export -rfc -keystore .\keystore\@vivekbarsagadey__loginx-keystore.bak.jks -alias YOUR_KEY_ALIAS -file loginx-certificate.pem -storepass YOUR_KEYSTORE_PASSWORD

   # Mac/Linux
   keytool -export -rfc -keystore ./keystore/@vivekbarsagadey__loginx-keystore.bak.jks -alias YOUR_KEY_ALIAS -file loginx-certificate.pem -storepass YOUR_KEYSTORE_PASSWORD
   ```

5. **Keystore credentials:**

   The credentials are **securely stored** in
   `keystore/@vivekbarsagadey__loginx-keystore-credentials.md`.

   **⚠️ NEVER share or commit actual credential values publicly!**

   The credentials file contains:
   - **Keystore password** - Required to access the keystore
   - **Key alias** - Identifies the specific key within the keystore
   - **Key password** - Required to use the key for signing

6. **EAS Build configuration:**

   For EAS builds, configure credentials using:

   ```bash
   eas credentials
   ```

   Select "Android" → "Set up a new keystore" or "Use an existing keystore" and
   provide the credentials from the credentials file.

> **🚨 CRITICAL SECURITY WARNING:**
>
> - **NEVER commit keystore files or credentials to public repositories**
> - **NEVER share credential values in documentation or messages**
> - Keep backups of your keystore in **multiple secure locations**
> - If the keystore is lost, you **cannot update your app** on Google Play Store
> - Store credentials in a **secure password manager** (1Password, LastPass,
>   etc.)
> - Treat keystore credentials like production database passwords
> - If credentials are exposed, **generate a new keystore immediately**
> - The `keystore/` directory should be in `.gitignore` for production apps

### Environment Setup

1. **Create environment file:**

   Create a `.env` file in the root directory:

   ```bash
   # Windows PowerShell
   New-Item .env -ItemType File

   # Mac/Linux
   touch .env
   ```

2. **Add required environment variables:**

   Open `.env` and add your Firebase credentials:

   ```env
   # Firebase Configuration (REQUIRED)
   API_KEY="your-firebase-api-key"
   AUTH_DOMAIN="your-project.firebaseapp.com"
   PROJECT_ID="your-project-id"
   STORAGE_BUCKET="your-project.appspot.com"
   MESSAGING_SENDER_ID="123456789012"
   APP_ID="1:123456789012:web:abcdef123456"
   MEASUREMENT_ID="G-XXXXXXXXXX"

   # Expo Configuration
   EAS_PROJECT_ID="your-eas-project-id"

   # App Information
   APP_NAME="LoginX"
   APP_VERSION="1.0.0"
   APP_BUILD="100"

   # Social Authentication
   GOOGLE_WEB_CLIENT_ID="your-google-web-client-id.apps.googleusercontent.com"
   GOOGLE_IOS_CLIENT_ID="your-google-ios-client-id.apps.googleusercontent.com"
   GOOGLE_ANDROID_CLIENT_ID="your-google-android-client-id.apps.googleusercontent.com"

   # Apple Sign In (iOS)
   APPLE_TEAM_ID="your-apple-team-id"
   APPLE_BUNDLE_ID="com.whizit.loginx"

   # Google Places API (for address autocomplete in registration)
   EXPO_PUBLIC_GOOGLE_PLACES_API_KEY="your-google-places-api-key"

   # Firebase Functions (if using)
   FUNCTIONS_URL="https://us-central1-your-project.cloudfunctions.net"
   FIREBASE_STORAGE_URL="gs://your-project.firebasestorage.app"

   # Optional: Backend API configuration
   API_BASE_URL="https://api.myapp.com"
   API_TIMEOUT="10000"
   WS_URL="wss://ws.myapp.com"

   # Optional: Database configuration
   DB_NAME="myappdb"
   DB_ENCRYPTION_KEY="random-32byte-secret"
   CACHE_TTL="3600"

   # Security & Encryption
   JWT_SECRET="your-jwt-secret-key-here"
   AES_ENCRYPTION_KEY="your-32-character-encryption-key"

   # Feature Flags
   ENABLE_BIOMETRIC_AUTH="true"
   ENABLE_SOCIAL_LOGIN="true"
   ENABLE_EMAIL_VERIFICATION="true"
   ENABLE_PUSH_NOTIFICATIONS="false"
   ENABLE_ANALYTICS="false"

   # Development Settings
   USE_FIREBASE_EMULATOR="false"
   DEBUG_MODE="true"
   LOG_LEVEL="debug"

   # Optional: Analytics and monitoring
   SENTRY_DSN="https://xxxx.ingest.sentry.io/1234"
   AMPLITUDE_KEY="abcd1234"
   GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   MIXPANEL_TOKEN="your-mixpanel-token"

   # Email Service (if using custom email provider)
   SENDGRID_API_KEY="your-sendgrid-api-key"
   MAILGUN_API_KEY="your-mailgun-api-key"

   # SMS Service (for phone verification)
   TWILIO_ACCOUNT_SID="your-twilio-account-sid"
   TWILIO_AUTH_TOKEN="your-twilio-auth-token"
   TWILIO_PHONE_NUMBER="+1234567890"

   # Social Media APIs (for profile import)
   FACEBOOK_APP_ID="your-facebook-app-id"
   TWITTER_API_KEY="your-twitter-api-key"
   LINKEDIN_CLIENT_ID="your-linkedin-client-id"
   ```

3. **Verify setup:**

   ```bash
   pnpm validate
   ```

   This command runs linting, formatting checks, and type checking.

4. **Start the development server:**

   ```bash
   pnpm start
   ```

   Then press:
   - `a` for Android
   - `i` for iOS
   - `w` for web

> **⚠️ Important:** Never commit the `.env` file to version control. It's
> already included in `.gitignore` for your security.

## Available Scripts

The following npm scripts are available for development and production
workflows:

### Development

- **`pnpm start`** - Start Expo development server with cache cleared
- **`pnpm android`** - Run on Android device/emulator with tunnel
- **`pnpm ios`** - Run on iOS simulator
- **`pnpm web`** - Run in web browser

### Code Quality

- **`pnpm lint`** - Run ESLint to check code quality
- **`pnpm lint:fix`** - Automatically fix ESLint issues
- **`pnpm lint:md`** - Lint all Markdown files with markdownlint
- **`pnpm lint:md:fix`** - Auto-fix Markdown linting issues
- **`pnpm lint:md:remark`** - Lint Markdown files with remark
- **`pnpm lint:md:remark:fix`** - Auto-fix Markdown with remark

### Formatting

- **`pnpm format`** - Format all code files with Prettier
- **`pnpm format:check`** - Check if files are formatted correctly
- **`pnpm format:md`** - Format Markdown with Prettier and remark
- **`pnpm format:md:check`** - Check Markdown formatting
- **`pnpm format:md:prettier`** - Format Markdown with Prettier only
- **`pnpm format:md:remark`** - Format Markdown with remark only

### Type Checking

- **`pnpm type-check`** - Run TypeScript compiler without emitting files

### Validation

- **`pnpm validate`** - Run all checks (lint, markdown lint with markdownlint
  and remark, format check, type check)
- **`pnpm validate:fix`** - Fix all auto-fixable issues

### Utility

- **`pnpm reset-project`** - Reset project to initial state (removes example
  code)

### Recommended Workflow

Before committing code:

```bash
pnpm validate:fix  # Fix all auto-fixable issues
pnpm validate      # Verify everything passes
```

For continuous development:

```bash
pnpm start         # Start development server
# Then press 'a' for Android, 'i' for iOS, or 'w' for web
```

## Technologies & Dependencies

### Core Technologies

- **[React](https://react.dev/)** (19.1.0) - UI library
- **[React Native](https://reactnative.dev/)** (0.81.4) - Mobile framework
- **[Expo](https://expo.dev/)** (\~54.0.10) - React Native framework and
  platform
- **[TypeScript](https://www.typescriptlang.org/)** (\~5.9.2) - Type-safe
  JavaScript

### Navigation & Routing

- **[Expo Router](https://docs.expo.dev/router/introduction/)** (\~6.0.8) -
  File-based routing
- **[React Navigation](https://reactnavigation.org/)** (^7.1.17) - Navigation
  library
- **[@react-navigation/bottom-tabs](https://reactnavigation.org/docs/bottom-tab-navigator/)**
  (^7.4.0)
- Tab navigation

### Authentication & Backend

- **[Firebase](https://firebase.google.com/)** (^12.3.0) - Backend services
  - Firebase Authentication - User authentication
  - Firebase Firestore - NoSQL cloud database
- **[Firebase Admin SDK Integration](https://firebase.google.com/docs/admin/setup)** -
  Server-side operations

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com/)** (^7.63.0) - Performant
  form management
- **[Zod](https://zod.dev/)** (^3.25.76) - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)**
  (^5.2.2) - Zod integration

### Storage & Data Persistence

- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)**
  (2.2.0) - Persistent storage
- **[expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)**
  (^15.0.7) - Encrypted storage

### Internationalization

- **[i18n-js](https://github.com/fnando/i18n)** (^4.5.1) - Internationalization
  framework
- **[expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/)**
  (\~17.0.7) - Locale detection

### UI Components & Styling

- **[@expo/vector-icons](https://docs.expo.dev/guides/icons/)** (^15.0.2) - Icon
  library
- **[expo-symbols](https://docs.expo.dev/versions/latest/sdk/symbols/)**
  (\~1.0.7) - SF Symbols (iOS)
- **[expo-image](https://docs.expo.dev/versions/latest/sdk/image/)** (\~3.0.8) -
  Optimized image component
- **[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)**
  (\~4.1.1) - Animations
- **[react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/)**
  (\~2.28.0) - Gesture handling

### User Experience

- **[expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)**
  (\~15.0.7) - Haptic feedback
- **[expo-splash-screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)**
  (\~31.0.10) - Splash screen API
- **[expo-status-bar](https://docs.expo.dev/versions/latest/sdk/status-bar/)**
  (\~3.0.8) - Status bar control
- **[expo-system-ui](https://docs.expo.dev/versions/latest/sdk/system-ui/)**
  (\~6.0.7) - System UI control

### Security & Biometrics

- **[react-native-biometrics](https://github.com/SelfLender/react-native-biometrics)**
  (^3.0.1) - Biometric authentication

### Notifications & Communication

- **[expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)**
  (\~0.32.11) - Push notifications
- **[expo-device](https://docs.expo.dev/versions/latest/sdk/device/)**
  (\~8.0.8) - Device information

### Monitoring & Analytics

- **[@sentry/react-native](https://docs.sentry.io/platforms/react-native/)**
  (^6.22.0) - Error tracking

### Media & Assets

- **[expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)**
  (\~17.0.8) - Image selection
- **[expo-font](https://docs.expo.dev/versions/latest/sdk/font/)** (\~14.0.8) -
  Custom fonts

### Utilities

- **[expo-constants](https://docs.expo.dev/versions/latest/sdk/constants/)**
  (\~18.0.9) - App constants
- **[expo-linking](https://docs.expo.dev/versions/latest/sdk/linking/)**
  (\~8.0.8) - Deep linking
- **[expo-web-browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)**
  (\~15.0.7) - In-app browser
- **[dotenv](https://github.com/motdotla/dotenv)** (^17.2.3) - Environment
  variables

### Development Tools

- **[ESLint](https://eslint.org/)** (^9.25.0) - JavaScript linter
- **[eslint-config-expo](https://github.com/expo/expo/tree/main/packages/eslint-config-expo)**
  (\~10.0.0)
- Expo ESLint config
- **[Prettier](https://prettier.io/)** (^3.6.2) - Code formatter
- **[prettier-plugin-organize-imports](https://github.com/simonhaenisch/prettier-plugin-organize-imports)**
  (^4.1.0) - Auto-organize imports
- **[markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli)**
  (^0.43.0) - Markdown linter

### Package Manager

- **[pnpm](https://pnpm.io/)** (>=8.0.0) - Fast, disk space efficient package
  manager

## Project Structure

LoginX follows a well-organized, feature-based structure optimized for
scalability and maintainability:

```text
loginx/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx              # Root layout with providers
│   ├── +not-found.tsx           # 404 error page
│   ├── modal.tsx                # Example modal screen
│   ├── (auth)/                  # Authentication group
│   │   ├── _layout.tsx         # Auth layout
│   │   ├── welcome.tsx         # Welcome/landing screen
│   │   ├── login.tsx           # Login screen
│   │   ├── forgot-password.tsx # Password recovery
│   │   ├── verify-email.tsx    # Email verification
│   │   └── register/           # Multi-step registration
│   │       ├── _layout.tsx
│   │       ├── index.tsx       # Registration entry
│   │       ├── step-1.tsx      # Basic info
│   │       ├── step-2.tsx      # Additional details
│   │       └── step-3.tsx      # Confirmation
│   ├── (tabs)/                  # Main app tabs (protected)
│   │   ├── _layout.tsx         # Tab navigation layout
│   │   ├── index.tsx           # Home/Dashboard
│   │   ├── items.tsx           # Items/Data screen
│   │   └── settings.tsx        # Settings hub
│   ├── onboarding/              # First-time user onboarding
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── profile/                 # User profile management
│   │   ├── _layout.tsx
│   │   ├── edit.tsx            # Edit profile
│   │   └── update-email.tsx    # Change email
│   ├── security/                # Security settings
│   │   ├── 2fa.tsx             # Two-factor authentication
│   │   ├── change-password.tsx # Password change
│   │   └── sessions.tsx        # Active sessions
│   ├── settings/                # App settings
│   │   ├── theme.tsx           # Theme selection
│   │   ├── language.tsx        # Language picker
│   │   ├── notifications.tsx   # Notification preferences
│   │   └── text-size.tsx       # Accessibility text size
│   ├── about/                   # About/Info screens
│   │   └── whats-new.tsx       # Changelog/What's new
│   └── legal/                   # Legal documents
│       ├── terms.tsx           # Terms of service
│       ├── privacy.tsx         # Privacy policy
│       └── license.tsx         # License information
├── actions/                      # Business logic layer
│   ├── user.action.ts           # User-related actions
│   └── setting.action.ts        # Settings actions
├── components/                   # Reusable UI components
│   ├── themed-view.tsx          # Themed container component
│   ├── themed-text.tsx          # Themed text component
│   ├── themed-button.tsx        # Themed button component
│   ├── themed-input.tsx         # Themed input component
│   ├── themed-text-input.tsx    # Themed text input
│   ├── themed-scroll-view.tsx   # Themed scroll container
│   ├── error-boundary.tsx       # Error boundary wrapper
│   ├── external-link.tsx        # External link handler
│   ├── haptic-tab.tsx           # Tab with haptic feedback
│   ├── language-picker.tsx      # Language selection
│   ├── theme-selector.tsx       # Theme selection
│   ├── features-slide.tsx       # Onboarding feature slide
│   ├── brand/                   # Brand components
│   │   ├── logo.tsx            # Full logo
│   │   └── logomark.tsx        # Logo icon
│   ├── navigation/              # Navigation components
│   │   └── TabBarIcon.tsx      # Custom tab bar icons
│   ├── onboarding/              # Onboarding components
│   │   ├── welcome.tsx
│   │   ├── features.tsx
│   │   └── personalize.tsx
│   └── ui/                      # Generic UI components
│       ├── collapsible.tsx     # Collapsible section
│       ├── icon-symbol.tsx     # Cross-platform icons
│       └── icon-symbol.ios.tsx # iOS-specific SF Symbols
├── constants/                    # Global constants
│   ├── index.ts                 # Barrel export
│   ├── theme.ts                 # Theme colors and styles
│   ├── routes.ts                # Route constants
│   ├── validation.ts            # Validation rules
│   └── accessibility.ts         # Accessibility constants
├── hooks/                        # Custom React hooks
│   ├── use-auth-provider.tsx    # Authentication context
│   ├── use-theme.tsx            # Theme management
│   ├── use-color-scheme.ts      # Color scheme detection
│   ├── use-language.tsx         # Language/i18n hook
│   ├── use-theme-color.ts       # Theme color resolver
│   ├── use-onboarding-provider.tsx # Onboarding state
│   ├── use-async-operation.tsx  # Async operation handler
│   └── use-push-notifications.tsx # Push notification handler
├── i18n/                         # Internationalization
│   ├── index.ts                 # i18n configuration
│   └── locales/                 # Translation files
│       ├── en.json             # English
│       ├── es.json             # Spanish
│       └── hi.json             # Hindi
├── types/                        # TypeScript type definitions
│   └── user.ts                  # User-related types
├── utils/                        # Utility functions
│   ├── debug.ts                 # Development logging
│   ├── sanitize.ts              # Input sanitization
│   ├── error.ts                 # Error handling utilities
│   ├── success.ts               # Success handling
│   ├── retry.ts                 # Retry logic
│   ├── cache.ts                 # Caching utilities
│   └── env.ts                   # Environment validation
├── config/                       # Configuration files
│   └── settings.ts              # App settings config
├── assets/                       # Static assets
│   ├── fonts/                   # Custom fonts
│   └── images/                  # Images and icons
├── scripts/                      # Build/utility scripts
│   └── reset-project.js         # Project reset script
├── .github/                      # GitHub-specific files
│   └── instructions/            # Development instructions
│       └── rule.instructions.md # Comprehensive dev guidelines
├── app.config.ts                 # Expo app configuration
├── firebase-config.ts            # Firebase initialization
├── firestore.rules               # Firestore security rules
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.js              # ESLint configuration
├── eas.json                      # EAS Build configuration
├── package.json                  # Dependencies and scripts
├── pnpm-lock.yaml                # pnpm lock file
├── env.d.ts                      # Environment variable types
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Example environment variables
├── .editorconfig                 # Editor configuration
├── .prettierrc.json              # Prettier configuration
├── .prettierignore               # Prettier ignore rules
├── .remarkrc.json                # Remark configuration
├── .remarkignore                 # Remark ignore rules
├── .markdownlint.json            # Markdownlint configuration
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
├── SECURITY.md                   # Security guidelines
├── QUICK_REFERENCE.md            # Quick reference guide
├── AUTHENTICATION_REVIEW.md      # Authentication flow documentation
└── docs/                         # Additional documentation
    ├── LINTING_FORMATTING.md    # Code style guide
    ├── DESIGN_SYSTEM.md         # Design system documentation
    └── ...                      # Other docs
```

### Key Architecture Patterns

#### File-Based Routing (Expo Router)

- Screens in `app/` directory automatically become routes
- Folders with `()` are route groups (don't affect URL)
- `_layout.tsx` files define nested layouts
- Route parameters: `[id].tsx` for dynamic routes

#### Feature-Based Organization

- Related functionality grouped together (profile, security, settings)
- Each feature can have its own components, actions, and types
- Promotes modularity and reusability

#### Separation of Concerns

- **Actions** - Business logic and data operations
- **Components** - Pure UI components
- **Hooks** - Reusable stateful logic
- **Utils** - Pure functions and helpers
- **Constants** - Configuration and static values

#### Themed Component System

All UI components use the themed system for automatic light/dark mode support:

```typescript
import { ThemedView, ThemedText } from "@/components/themed-*";
```

## Configuration

### Firebase Setup

LoginX uses Firebase for authentication and data storage. Configuration is
managed through environment variables.

#### Firebase Console Setup

1. **Authentication:**
   - Enable Email/Password authentication
   - Configure email templates (verification, password reset)
   - Set authorized domains

2. **Firestore Database:**
   - Create database in production mode
   - Deploy security rules from `firestore.rules`
   - Create indexes if needed for queries

3. **Firebase Hosting (Optional):**
   - For web deployment
   - Configure in `firebase.json`

#### Security Rules

The project includes comprehensive Firestore security rules (`firestore.rules`):

- Users can only access their own data
- Input validation on all fields
- Email format validation
- String length limits
- Timestamp validation
- Soft delete enforcement

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

### App Configuration

App configuration is managed in `app.config.ts`:

- **App metadata** - Name, version, slug
- **Platform settings** - iOS and Android specific configurations
- **Splash screen** - Custom splash screens for light/dark mode
- **Plugins** - Expo plugins configuration
- **Experiments** - Typed routes and React Compiler enabled
- **EAS Project** - EAS Build configuration

### Environment Variables

All environment variables are typed in `env.d.ts` for TypeScript safety.

#### Required Variables (Firebase Core)

- `API_KEY` - Firebase API key
- `AUTH_DOMAIN` - Firebase auth domain
- `PROJECT_ID` - Firebase project ID
- `STORAGE_BUCKET` - Firebase storage bucket
- `MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `APP_ID` - Firebase app ID
- `MEASUREMENT_ID` - Google Analytics measurement ID
- `EAS_PROJECT_ID` - Expo Application Services project ID

#### Social Authentication (Optional)

- `GOOGLE_WEB_CLIENT_ID` - Google OAuth web client ID
- `GOOGLE_IOS_CLIENT_ID` - Google OAuth iOS client ID
- `GOOGLE_ANDROID_CLIENT_ID` - Google OAuth Android client ID
- `APPLE_TEAM_ID` - Apple Developer Team ID for Sign in with Apple
- `APPLE_BUNDLE_ID` - App bundle identifier for Apple services

#### Security & Encryption (Optional)

- `JWT_SECRET` - JSON Web Token signing secret
- `AES_ENCRYPTION_KEY` - Advanced Encryption Standard key (32 characters)

#### Feature Flags (Optional)

- `ENABLE_BIOMETRIC_AUTH` - Toggle biometric authentication (true/false)
- `ENABLE_SOCIAL_LOGIN` - Toggle social login features (true/false)
- `ENABLE_EMAIL_VERIFICATION` - Toggle email verification (true/false)
- `ENABLE_PUSH_NOTIFICATIONS` - Toggle push notifications (true/false)
- `ENABLE_ANALYTICS` - Toggle analytics tracking (true/false)

#### Development Settings (Optional)

- `USE_FIREBASE_EMULATOR` - Use Firebase emulator for development (true/false)
- `DEBUG_MODE` - Enable debug logging (true/false)
- `LOG_LEVEL` - Logging verbosity (debug/info/warn/error)

#### External Services (Optional)

- `SENTRY_DSN` - Sentry error tracking DSN
- `AMPLITUDE_KEY` - Amplitude analytics key
- `MIXPANEL_TOKEN` - Mixpanel analytics token
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` - Google Places API for address
  autocomplete

#### Email Services (Optional)

- `SENDGRID_API_KEY` - SendGrid API key for email delivery
- `MAILGUN_API_KEY` - Mailgun API key for email delivery

#### SMS Services (Optional)

- `TWILIO_ACCOUNT_SID` - Twilio account SID for SMS verification
- `TWILIO_AUTH_TOKEN` - Twilio authentication token
- `TWILIO_PHONE_NUMBER` - Twilio phone number for sending SMS

#### Social Media Integration (Optional)

- `FACEBOOK_APP_ID` - Facebook App ID for social features
- `TWITTER_API_KEY` - Twitter API key for social integration
- `LINKEDIN_CLIENT_ID` - LinkedIn Client ID for professional features

See `env.d.ts` for the complete list and TypeScript definitions of all
configuration variables.

### Platform-Specific Configuration

#### iOS

- **Bundle Identifier:** `com.whizit.loginx`
- **Minimum iOS:** 13.0+ (via Expo SDK)
- **Build Number:** Configurable via `APP_BUILD` env variable
- **Icons:** Configured in `app.config.ts`

#### Android

- **Package Name:** `com.whizit.loginx`
- **Minimum SDK:** 26 (Android 8.0)
- **Version Code:** Configurable via `APP_BUILD` env variable
- **Adaptive Icons:** Full support with foreground, background, and monochrome

#### Web

- **Output:** Static site generation
- **Favicon:** Custom favicon included
- **PWA Support:** Can be configured for Progressive Web App

## Security

LoginX implements enterprise-grade security practices. For complete security
documentation, see [SECURITY.md](./SECURITY.md).

### Security Highlights

- **Environment Variables:** All secrets managed via `.env` (never committed)
- **Input Sanitization:** XSS and injection prevention on all user inputs
- **Firestore Security Rules:** Server-side validation and authorization
- **Database Encryption:** SQLite encryption support
- **Authentication Persistence:** Platform-specific secure persistence
- **Biometric Authentication:** Support for Face ID, Touch ID, fingerprint
- **2FA:** Two-factor authentication support
- **Session Management:** Active session monitoring and control
- **Secure Storage:** expo-secure-store for sensitive client data
- **HTTPS Only:** All network requests use secure connections

### Security Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] `.env` file is gitignored
- [ ] Firebase security rules deployed
- [ ] Separate Firebase projects for dev/staging/production
- [ ] Error monitoring configured (Sentry)
- [ ] SSL/TLS certificates valid
- [ ] Dependencies audited (`pnpm audit`)
- [ ] User privacy policy in place
- [ ] GDPR compliance reviewed (if applicable)

## Development Guidelines

LoginX follows comprehensive development guidelines to ensure code quality,
maintainability, and consistency.

### Code Style

- **TypeScript** - 100% type-safe, no `any` types
- **ESLint** - Enforced code quality rules
- **Prettier** - Automatic code formatting
- **Conventional Commits** - Standardized commit messages

### Development Workflow

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines in
   `.github/instructions/rule.instructions.md`

3. **Validate your code:**

   ```bash
   pnpm validate
   ```

4. **Commit your changes:**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR:**

   ```bash
   git push origin feature/your-feature-name
   ```

### Component Development

- Use **functional components** only
- Implement **themed components** for light/dark mode support
- Follow **accessibility guidelines** (WCAG 2.1 AA)
- Add **TypeScript types** for all props
- Include **JSDoc comments** for complex components

### State Management

- **Local state:** `useState` for component-local state
- **Context:** For app-wide state (auth, theme, language)
- **Custom hooks:** Extract reusable stateful logic

### Testing

- Test on **both iOS and Android**
- Test **light and dark modes**
- Test **different screen sizes**
- Test with **VoiceOver/TalkBack** for accessibility
- Test **offline scenarios**

### Performance

- Use `React.memo` for expensive components
- Optimize FlatList with `keyExtractor` and `getItemLayout`
- Use `useCallback` and `useMemo` appropriately
- Avoid inline functions in render
- Monitor bundle size

For complete development guidelines, see
[.github/instructions/rule.instructions.md](.github/instructions/rule.instructions.md).

## Contributing

We welcome contributions to LoginX! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** - Open an issue with details
- 💡 **Suggest features** - Share your ideas
- 📝 **Improve documentation** - Fix typos, add examples
- 🔧 **Submit pull requests** - Fix bugs or add features
- 🌍 **Add translations** - Help with i18n

### Contribution Process

1. **Fork the repository**

   ```bash
   gh repo fork vivekbarsagadey/loginx
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/loginx.git
   cd loginx
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Make your changes**
   - Follow the development guidelines
   - Add tests if applicable
   - Update documentation

6. **Validate your changes**

   ```bash
   pnpm validate:fix
   pnpm validate
   ```

7. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

8. **Push to your fork**

   ```bash
   git push origin feature/amazing-feature
   ```

9. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Submit for review

### Code Review

All contributions go through code review. Reviewers will check:

- Code quality and style compliance
- Test coverage
- Documentation updates
- Security implications
- Performance impact

### Community Guidelines

- Be respectful and inclusive
- Follow our Code of Conduct
- Help others learn and grow
- Provide constructive feedback
- Celebrate successes together

## License

This project is licensed under the **MIT License** - see the
[LICENSE](./LICENSE) file for details.

### MIT License Summary

- ✅ **Commercial use** - Use in commercial projects
- ✅ **Modification** - Modify the code
- ✅ **Distribution** - Distribute copies
- ✅ **Private use** - Use privately
- ℹ️ **Liability** - Limited liability
- ℹ️ **Warranty** - No warranty provided

Copyright (c) 2025 Vivek Barsagadey / Whiz IT

## Support

Need help? Here are your options:

### Documentation

#### Getting Started

- **[README.md](./README.md)** - This file (getting started)
- **[SECURITY.md](./SECURITY.md)** - Security guidelines
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference
- **[AUTHENTICATION_REVIEW.md](./AUTHENTICATION_REVIEW.md)** - Authentication
  flow review

#### Design System

- **[docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)** - Complete design system
  guide (1000+ lines)
- **[docs/DESIGN_SYSTEM_ANALYSIS.md](./docs/DESIGN_SYSTEM_ANALYSIS.md)** -
  Industry comparison & analysis
- **[docs/DESIGN_SYSTEM_SUMMARY.md](./docs/DESIGN_SYSTEM_SUMMARY.md)** - Quick
  overview
- **[docs/DESIGN_SYSTEM_IMPROVEMENTS.md](./docs/DESIGN_SYSTEM_IMPROVEMENTS.md)** -
  4-phase improvement plan (25 components)
- **[docs/DESIGN_SYSTEM_IMPROVEMENT_SUMMARY.md](./docs/DESIGN_SYSTEM_IMPROVEMENT_SUMMARY.md)** -
  Implementation roadmap
- **[docs/DESIGN_SYSTEM_CHECKLIST.md](./docs/DESIGN_SYSTEM_CHECKLIST.md)** -
  Implementation checklist

#### Development

- **[docs/CONSTANTS_REFERENCE.md](./docs/CONSTANTS_REFERENCE.md)** - All
  constants reference
- **[docs/LINTING_FORMATTING.md](./docs/LINTING_FORMATTING.md)** - Linting and
  formatting setup
- **[docs/LOGIN_FLOW_DOCUMENTATION.md](./docs/LOGIN_FLOW_DOCUMENTATION.md)** -
  Login flow details
- **[docs/REGISTRATION_FLOW.md](./docs/REGISTRATION_FLOW.md)** - Registration
  flow documentation
- **[docs/LOCAL_FIRST_IMPLEMENTATION.md](./docs/LOCAL_FIRST_IMPLEMENTATION.md)** -
  Local-first architecture
- **[docs/DOCUMENTATION_STRUCTURE.md](./docs/DOCUMENTATION_STRUCTURE.md)** -
  Documentation organization
- **[docs/IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md)** -
  Implementation status
- **[.github/instructions/rule.instructions.md](.github/instructions/rule.instructions.md)** -
  Complete dev guidelines

### Get Help

- 💬 **GitHub Discussions** - Ask questions, share ideas
- 🐛 **GitHub Issues** - Report bugs or request features
- 📧 **Email** - <vivek@whizit.co.in>
- 🌐 **Website** - <https://whizit.co.in>

### Useful Links

- **Expo Documentation** - <https://docs.expo.dev/>
- **React Native Docs** - <https://reactnative.dev/docs/getting-started>
- **Firebase Docs** - <https://firebase.google.com/docs>
- **TypeScript Handbook** - <https://www.typescriptlang.org/docs/>

### Reporting Security Issues

For security vulnerabilities, please **DO NOT** open a public issue. Email
security concerns directly to <vivek@whizit.co.in>.

---

## About

### About Vivek Barsagadey

**Vivek Barsagadey** is a passionate software engineer and mobile app developer
specializing in React Native, Expo, and modern JavaScript/TypeScript
technologies. With a focus on creating intuitive, accessible, and
high-performance mobile applications, Vivek brings enterprise-grade solutions to
life with clean code and best practices.

**Expertise:**

- 📱 Cross-platform mobile development (React Native, Expo)
- 🔐 Authentication & security implementations
- 🎨 UI/UX design and accessibility
- ⚡ Performance optimization
- 🌍 Internationalization (i18n)
- 🔧 DevOps and CI/CD pipelines

**Connect with Vivek:**

- 🌐 **Website:** <https://vivekbarsagadey.com> _(if available)_
- 💼 **LinkedIn:**
  [linkedin.com/in/vivekbarsagadey](https://linkedin.com/in/vivekbarsagadey)
  _(if available)_
- 🐙 **GitHub:** [@vivekbarsagadey](https://github.com/vivekbarsagadey)
- 📧 **Email:** <vivek@whizit.co.in>
- 🐦 **Twitter/X:** [@vivekbarsagadey](https://twitter.com/vivekbarsagadey) _(if
  available)_

### About Whiz IT

**[Whiz IT](https://whizit.co.in)** is a forward-thinking software development
company specializing in innovative digital solutions. We create cutting-edge
mobile and web applications that help businesses transform their ideas into
reality.

**What We Do:**

- 📱 **Mobile App Development** - Native and cross-platform solutions
- 🌐 **Web Development** - Modern, responsive web applications
- 🎨 **UI/UX Design** - User-centered design that delights
- ☁️ **Cloud Solutions** - Scalable cloud infrastructure and services
- 🔐 **Security & Compliance** - Enterprise-grade security implementations
- 🚀 **Digital Transformation** - End-to-end digital solutions

**Our Values:**

- **Quality First** - We never compromise on code quality and best practices
- **Security Minded** - Security is built into everything we create
- **User-Centric** - Every decision is made with the end user in mind
- **Innovation** - We stay at the forefront of technology trends
- **Transparency** - Open communication and honest relationships
- **Accessibility** - Building inclusive products for everyone

**Technologies We Love:**

React Native • Expo • TypeScript • Node.js • Firebase • AWS • React • Next.js •
PostgreSQL • MongoDB • GraphQL • Docker • Kubernetes

**Get in Touch:**

- 🌐 **Website:** <https://whizit.co.in>
- 📧 **Email:** <hello@whizit.co.in> or <vivek@whizit.co.in>
- 💼 **LinkedIn:**
  [linkedin.com/company/whizit](https://linkedin.com/company/whizit) _(if
  available)_
- 🐙 **GitHub:** [@whizit](https://github.com/whizit) _(if available)_

**Project Portfolio:**

LoginX is just one of many innovative projects from Whiz IT. We're committed to
open-source development and contributing back to the developer community. Check
out our other projects and contributions on our website and GitHub.

---

**Interested in working with us?** Whether you need a mobile app, web platform,
or custom software solution, we'd love to hear from you. Contact us to discuss
your next project!

---

## Acknowledgments

Built with ❤️ by [Vivek Barsagadey](https://github.com/vivekbarsagadey) at
[Whiz IT](https://whizit.co.in)

Special thanks to:

- The Expo team for an amazing framework
- The React Native community
- All contributors and supporters
- The open-source community for incredible tools and libraries

---

## Project Status

[![GitHub last commit](https://img.shields.io/github/last-commit/vivekbarsagadey/loginx)](https://github.com/vivekbarsagadey/loginx/commits/main)
[![GitHub issues](https://img.shields.io/github/issues/vivekbarsagadey/loginx)](https://github.com/vivekbarsagadey/loginx/issues)
[![GitHub stars](https://img.shields.io/github/stars/vivekbarsagadey/loginx)](https://github.com/vivekbarsagadey/loginx/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/vivekbarsagadey/loginx)](https://github.com/vivekbarsagadey/loginx/network)

**Current Version:** 1.0.0\
**Last Documentation Review:** October 11, 2025\
**Status:** ✅ Production Ready (Grade: A+)

> **📊 Project Health Report**\
> A comprehensive project review was completed on October 11, 2025. Overall
> Grade: **A+**\
> See [docs/PROJECT_REVIEW_OCT_2025.md](./docs/PROJECT_REVIEW_OCT_2025.md) for
> the full report. **Status:** Active Development\
> **Last Updated:** October 2, 2025

---

Made with ❤️ using [Expo](https://expo.dev) and
[React Native](https://reactnative.dev)
