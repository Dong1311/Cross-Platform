import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "@/Context/AuthProvider";
import axios from 'axios';

const ChangePassword = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp với xác nhận mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://157.66.24.126:8080/it4788/change_password', {
        token,
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (response.data.code === "1000") {
        Alert.alert('Thành công', 'Mật khẩu đã được thay đổi thành công.', [
          {
            text: 'OK',
            onPress: () => router.push('/user-info'), // Quay lại màn user-info
          },
        ]);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Lỗi', response.data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backIconContainer} onPress={() => router.push('/user-info')}>
        <Image source={require('../assets/images/arrow-back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Đổi Mật Khẩu</Text>

        <Text style={styles.label}>Mật khẩu cũ:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu cũ"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        <Text style={styles.label}>Mật khẩu mới:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu mới"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.label}>Xác nhận mật khẩu mới:</Text>
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu mới"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Đang xử lý...' : 'Lưu thay đổi'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#921616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIconContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10, 
  },
  
  backIcon: {
    width: 24, 
    height: 24, 
    resizeMode: 'contain', 
  },

  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b71c1c',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#b71c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChangePassword;
