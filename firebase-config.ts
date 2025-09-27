import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

const firebaseConfig: { [key: string]: string | undefined } = {
  apiKey: Constants.expoConfig?.extra?.apiKey,
  authDomain: Constants.expoConfig?.extra?.authDomain,
  projectId: Constants.expoConfig?.extra?.projectId,
  storageBucket: Constants.expoConfig?.extra?.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId,
  appId: Constants.expoConfig?.extra?.appId,
};

if (Constants.expoConfig?.extra?.measurementId) {
  firebaseConfig.measurementId = Constants.expoConfig.extra.measurementId;
}

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const firestore = getFirestore(app);

let analytics: Analytics | undefined;
// Check if analytics is supported in the current environment
isSupported().then((isSupported) => {
  if (isSupported && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
});

export { app, analytics, auth, firestore };
