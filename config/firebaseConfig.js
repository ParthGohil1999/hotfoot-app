import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2hI3Uyvmaw31xmUcLX1waCBGoxa-bNi4",
  authDomain: "tripify-bc166.firebaseapp.com",
  projectId: "tripify-bc166",
  storageBucket: "tripify-bc166.firebasestorage.app",
  messagingSenderId: "183104668317",
  appId: "1:183104668317:web:527f734085543ba1c28a74",
  measurementId: "G-L6SW6J95GE",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyDn_2g8qDhJkCutlqnhd6gjuAV8pqXP5XE",
//   authDomain: "top-opus-429821-g6.firebaseapp.com",
//   projectId: "top-opus-429821-g6",
//   storageBucket: "top-opus-429821-g6.firebasestorage.app",
//   messagingSenderId: "575061247873",
//   appId: "1:575061247873:web:061abfc75acab619520a80",
//   measurementId: "G-L6SW6J95GE",
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// ✅ Use this instead of getAuth(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
