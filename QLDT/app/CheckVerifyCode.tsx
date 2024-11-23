import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import styles from '../public/styles/sign-up_style';
import { Link } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';

const CheckVerifyCode = () => {
  const [email, setEmail] = useState<string>('');
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const handleCheckVerifyCode = async () => {
    try {
      const response = await fetch('http://157.66.24.126:8080/it4788/check_verify_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verify_code: verifyCode }),
      });
  
      if (!response.ok) {
        setError(`Server error: ${response.status} - ${response.statusText}`);
        return;
      }
  
      const result = await response.json();
      console.log('Kết quả phản hồi:', result);
  
      // Kiểm tra mã trả về
      if (result.code === "1000") {
        // Hiển thị thông báo thành công với Alert
        Alert.alert(
          "Xác thực thành công!",
          `Mã xác nhận hợp lệ. User ID của bạn là: ${result.userId}`,
          [
            {
              text: "OK",
              onPress: () => router.push('/login'), // Điều hướng đến login sau khi nhấn OK
            },
          ]
        );
      } else {
        setError(result.message || 'Đã xảy ra lỗi.');
      }
    } catch (error: any) {
      setError(`Lỗi: ${error.message || 'Không thể kết nối tới server. Vui lòng thử lại sau.'}`);
      console.error('Chi tiết lỗi:', error);
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực tài khoản</Text>

      <TextInput
        style={[styles.input2, error ? styles.errorInput : null]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input2, error ? styles.errorInput : null]}
        placeholder="Mã xác thực"
        value={verifyCode}
        onChangeText={setVerifyCode}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleCheckVerifyCode}>
        <Text style={styles.buttonText}>Xác thực</Text>
      </TouchableOpacity>

      <Link href="/login" style={styles.linkSpacing}>
            <Text style={styles.loginText}>Go to login page</Text>
          </Link>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          router.push('/login'); 
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                router.push('/login'); 
              }}
              style={styles.closeButton}
            >
              <Text style={{ color: 'white' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckVerifyCode;
