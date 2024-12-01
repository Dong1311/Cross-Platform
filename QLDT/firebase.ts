import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD_ZD2aFvMCId2fWQ--byva2YQrpt2C1gU",
  authDomain: "crossplatform-it4788-f38e0.firebaseapp.com",
  projectId: "crossplatform-it4788-f38e0",
  storageBucket: "crossplatform-it4788-f38e0.firebasestorage.app",
  messagingSenderId: "844626516109",
  appId: "1:844626516109:android:1c122a7d1d7acc8ffd2ac4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const firestore = getFirestore(app);
export const auth = getAuth(app);