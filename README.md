# LoginX

LoginX is a modern, cross-platform mobile application built with React Native and Expo. It provides a seamless and secure user authentication experience, including registration, login, and profile management.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)

## Features

- **User Authentication:** Secure user registration and login functionality using Firebase Authentication.
- **Multi-Step Registration:** A guided, multi-step registration process for a smooth user onboarding experience.
- **Profile Management:** Users can view and manage their profile information.
- **Settings:** A dedicated screen for application settings.
- **Theming:** Light and dark mode support with a customizable theme.
- **Cross-Platform:** Built with Expo, LoginX runs on Android, iOS, and the web from a single codebase.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An account on [Firebase](https://firebase.google.com/) to set up authentication.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/loginx.git
   cd loginx
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the project and add your Firebase configuration:
   ```
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-auth-domain
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   FIREBASE_APP_ID=your-app-id
   ```

## Available Scripts

In the project directory, you can run the following commands:

- `npm start`: Runs the app in development mode with Expo Dev Tools.
- `npm run android`: Runs the app on a connected Android device or emulator.
- `npm run ios`: Runs the app on the iOS simulator.
- `npm run web`: Runs the app in a web browser.
- `npm run lint`: Lints the code using ESLint to check for code quality and style issues.

## Technologies Used

- **Core:**
  - [React Native](https://reactnative.dev/)
  - [Expo](https://expo.dev/)
- **Navigation:**
  - [React Navigation](https://reactnavigation.org/)
  - [Expo Router](https://expo.github.io/router/)
- **Authentication:**
  - [Firebase](https://firebase.google.com/)
- **State Management & Data:**
  - React Hooks
  - [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **UI/UX:**
  - [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
  - [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- **Form Handling:**
  - [React Hook Form](https://react-hook-form.com/)
  - [Zod](https://zod.dev/) for schema validation
- **Tooling:**
  - [TypeScript](https://www.typescriptlang.org/)
  - [ESLint](https://eslint.org/)

## Project Structure

The project follows a standard Expo and React Native project structure:

```
.
├── actions/         # Redux-like actions for state management
├── app/             # Main application source code, structured with Expo Router
│   ├── (auth)/      # Authentication-related screens (login, register, etc.)
│   ├── (tabs)/      # Screens accessible after login (home, profile, settings)
│   └── _layout.tsx  # Root layout of the application
├── assets/          # Static assets like fonts and images
├── components/      # Reusable UI components
├── constants/       # Global constants like colors and theme settings
├── hooks/           # Custom React hooks
├── scripts/         # Helper scripts for the project
└── types/           # TypeScript type definitions
```

## Configuration

The project uses a `firebase-config.ts` file to initialize Firebase. This file reads the environment variables from the `.env` file at build time. Make sure to provide all the required Firebase credentials in your `.env` file before running the application.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
