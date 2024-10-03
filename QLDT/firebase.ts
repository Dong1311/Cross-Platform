import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getAuth, Auth, browserLocalPersistence } from 'firebase/auth';  // Thay thế getReactNativePersistence
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCbhTpA6_dSyUnHPje39GF9wYycJz7i5o8",
  authDomain: "react-navtive-qldt.firebaseapp.com",
  projectId: "react-navtive-qldt",
  storageBucket: "react-navtive-qldt.appspot.com",
  messagingSenderId: "175085949899",
  appId: "1:175085949899:android:d28a5c651fa1a8a2c55c4e"
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

// Khởi tạo hoặc lấy Firebase Auth
const auth = initializeAuth(app, {
  persistence: browserLocalPersistence, // Sử dụng persistence khác nếu getReactNativePersistence không khả dụng
});

export { auth, db };
