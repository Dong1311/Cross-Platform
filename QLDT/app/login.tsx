import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter để điều hướng
import { signInWithEmailAndPassword } from 'firebase/auth';  // Import Firebase Auth
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore để lấy dữ liệu
import { auth, db } from '../firebase';  // Import Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

import styles from '../public/styles/login_style';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State để lưu lỗi
  const router = useRouter();  // Khởi tạo useRouter

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Hàm xử lý đăng nhập

  const handleLogin = async () => {
    try {
      // Đăng nhập với Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Truy vấn để tìm tài liệu người dùng dựa trên thuộc tính uid
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log('Thông tin người dùng:', userData);
          
          // Kiểm tra role và điều hướng dựa trên role
          if (userData.role === 'student') {
            router.push('/homesv');  // Điều hướng đến trang sinh viên
          } else {
            router.push('/homesv');  // Điều hướng đến trang khác cho các vai trò khác
          }
        });
      } else {
        console.error('Không tìm thấy dữ liệu người dùng');
        setErrorMessage('Đã xảy ra lỗi khi lấy thông tin người dùng');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        setErrorMessage('Email hoặc mật khẩu không chính xác');
      } else {
        console.error('Unknown error occurred');
      }
    }
  };

  

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logohust_2.png')} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Đăng nhập với tài khoản QLĐT</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email hoặc mã số SV/CB"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/747/747545.png' }}
          style={styles.icon}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Image
            source={{
              uri: showPassword
                ? 'https://cdn-icons-png.flaticon.com/128/709/709612.png'
                : 'https://cdn-icons-png.flaticon.com/128/2767/2767146.png',
            }}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Hiển thị thông báo lỗi nếu có */}
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}

      {/* Button Đăng nhập */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
      </TouchableOpacity>

      {/* Modal Quên Mật Khẩu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              Bạn hãy nhập Email (của trường) hoặc MSSV (đối với Sinh viên) để lấy lại mật khẩu.
              Mật khẩu mới sẽ được gửi về email của bạn.
            </Text>
            <View style={styles.modalInputContainer}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/747/747545.png' }}
                style={styles.icon}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Email hoặc mã số SV/CB"
                value={forgotEmail}
                onChangeText={setForgotEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;
