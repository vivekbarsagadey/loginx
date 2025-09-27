// firebase-config.ts
import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  inMemoryPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// ---- config from app.json/app.config.ts -> extra ----
const extra =
  (Constants.expoConfig?.extra as Record<string, string> | undefined) ??
  (Constants.manifest?.extra as Record<string, string> | undefined);

const firebaseConfig = {
  apiKey: extra?.apiKey,
  authDomain: extra?.authDomain,
  projectId: extra?.projectId,
  storageBucket: extra?.storageBucket,
  messagingSenderId: extra?.messagingSenderId,
  appId: extra?.appId,
};

// ---- initialize (reuse if already created) ----
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ---- Auth ----
let auth: Auth;

if (Platform.OS === "web") {
  // Web: keep users signed in (local persistence)
  auth = getAuth(app);
  // Optional: use session-only persistence instead with browserSessionPersistence
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} else {
  // React Native: explicit in-memory persistence (no disk, no AsyncStorage)
  try {
    auth = initializeAuth(app, {
      persistence: inMemoryPersistence,
    });
  } catch {
    // guard for Fast Refresh / already-initialized
    auth = getAuth(app);
  }
}

export { auth };
export const firestore = getFirestore(app);
