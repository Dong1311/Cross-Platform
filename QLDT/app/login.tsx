import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, Modal,} from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter để điều hướng

import styles from '../public/styles/login_style';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State để lưu lỗi
  const router = useRouter();  // Khởi tạo useRouter
  const deviceId = 1;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Hàm xử lý đăng nhập

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://160.30.168.228:8080/it4788/login', {email,password,deviceId})
      if(res.status === 200) {
        if(res.data.role === 'STUDENT') {
          router.push('/home_sv')
        } else {
          router.push('/home_gv')
        }
      } 
    } catch (error) {
      console.log(error)
      setErrorMessage('email hoặc mật khẩu không đúng')
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
      {errorMessage ? <Text style={{ color: 'white' }}>{errorMessage}</Text> : null}

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
