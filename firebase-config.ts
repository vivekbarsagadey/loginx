
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { initializeAuth, Auth } from "firebase/auth";
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore, Firestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Directly configured Firebase credentials
const firebaseConfig = {
    apiKey: "AIzaSyAGR1vYM4qWGQNok2grOaLyyvHYq8xcxc0",
    authDomain: "loginx-e289b.firebaseapp.com",
    projectId: "loginx-e289b",
    storageBucket: "loginx-e289b.firebasestorage.app",
    messagingSenderId: "26103201207",
    appId: "1:26103201207:web:d052568449b1bc63b53c32"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const firestore: Firestore = getFirestore(app);

export { app, auth, firestore };
