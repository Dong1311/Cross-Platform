// import { initializeApp } from 'firebase/app';
// import { getFirestore, Firestore } from 'firebase/firestore';
// import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Cấu hình Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCbhTpA6_dSyUnHPje39GF9wYycJz7i5o8",
//   authDomain: "react-navtive-qldt.firebaseapp.com",
//   projectId: "react-navtive-qldt",
//   storageBucket: "react-navtive-qldt.appspot.com",
//   messagingSenderId: "175085949899",
//   appId: "1:175085949899:android:d28a5c651fa1a8a2c55c4e"
// };

// // Khởi tạo Firebase App
// const app = initializeApp(firebaseConfig);

// // Khởi tạo Firestore với kiểu Firestore
// const db: Firestore = getFirestore(app);

// // Khởi tạo Auth với kiểu Auth
// let auth: Auth;
// try {
//   auth = getAuth(app); // Nếu đã khởi tạo Firebase Auth
// } catch (e) {
//   // Khởi tạo Firebase Auth với AsyncStorage để duy trì trạng thái đăng nhập
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });
// }

// export { auth, db };
