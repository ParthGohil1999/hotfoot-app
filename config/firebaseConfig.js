import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_FIRESTORE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC__GOOGLE_FIRESTORE_AUTHDOMAIN,
  projectId: process.env.EXPO_PUBLIC_GOOGLE_FIRESTORE_PROJECTID,
  storageBucket: process.env.EXPO_PUBLIC_GOOGLE_FIRESTORE_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_GOOGLE_FIRESTORE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_GOOGLE_FIRESTORE_APPID,
  measurementId: process.env.EXPO_PUBLIC_GOOGLE_FIRESTORE_MEASUREMENTID,
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// ✅ Use this instead of getAuth(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
