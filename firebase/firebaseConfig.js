import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDn8uZDqqdT32_0uaAkRsnFK_kjJnlJqpE",
  authDomain: "garu-dasie.firebaseapp.com",
  projectId: "garu-dasie",
  storageBucket: "garu-dasie.appspot.com",
  messagingSenderId: "945030078697",
  appId: "1:945030078697:web:0b73ca8af79b6614425078"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Export the app and auth objects
export { app, auth };
