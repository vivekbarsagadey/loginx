
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId,
};

console.log("--- FIRING UP FIREBASE --- START");
console.log("1. [firebase-config.ts] Configuration object being passed to initializeApp:", JSON.stringify(firebaseConfig, null, 2));

let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("2. [firebase-config.ts] Firebase app initialized successfully:", app.name);
  } catch (e) {
    console.error("2. [firebase-config.ts] FATAL ERROR during initializeApp:", e);
  }
} else {
  app = getApp();
  console.log("2. [firebase-config.ts] Existing Firebase app retrieved:", app.name);
}

let auth;
if (app) {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    console.log("3. [firebase-config.ts] Firebase auth initialized successfully.");
  } catch(e) {
    console.error("3. [firebase-config.ts] FATAL ERROR during initializeAuth:", e);
  }
} else {
  console.error("3. [firebase-config.ts] Firebase app object is missing, cannot initialize auth.");
}

console.log("--- FIRING UP FIREBASE --- END");

const firestore = app ? getFirestore(app) : null;

export { app, auth, firestore };
