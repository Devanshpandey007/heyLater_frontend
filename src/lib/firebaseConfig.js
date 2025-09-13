import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC5loRfjcfJAV_TgKmEi0Ym2nuBgZFU9Vc",
  authDomain: "heylater-c4a14.firebaseapp.c om",
  projectId: "heylater-c4a14",
  storageBucket: "heylater-c4a14.appspot.com",
  messagingSenderId: "98448896366",
  appId: "1:98448896366:web:ecf45c162229e6bef9917f",
  measurementId: "G-YJT1YMRV6M"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

// Get the Auth instance
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { FIREBASE_APP, FIREBASE_AUTH };