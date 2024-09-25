import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal,
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/images/logohust_2.png')} style={styles.logo} />

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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
      </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b71c1c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#aaa',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#b71c1c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
  },
  modalInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#b71c1c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#b71c1c',
    fontSize: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
