import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import styles from '../public/styles/sign-up_style';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  getVerifyCode: undefined;
  checkVerifyCode: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'checkVerifyCode'>;

const CheckVerifyCode = () => {
  const [email, setEmail] = useState<string>(''); // Thêm trạng thái cho email
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp>();

  const handleCheckVerifyCode = async () => {
    try {
      const response = await fetch('http://160.30.168.228:8080/it4788/check_verify_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verify_code: verifyCode })
      });

      if (!response.ok) {
        setError(`Server error: ${response.status} - ${response.statusText}`);
        return;
      }

      const result = await response.json();

      if (result.meta.code === 1000) {
        setSuccessMessage(`Xác thực thành công! Mã xác thực của bạn là: ${result.verify_code}`);
        setModalVisible(true);
      } else {
        setError(result.meta.message);
      }
    } catch (error: any) {
      setError(`Lỗi: ${error.message || 'Không thể kết nối tới server. Vui lòng thử lại sau.'}`);
      console.log('Chi tiết lỗi:', error);
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ color: 'green', fontSize: 18, marginBottom: 20 }}>{successMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={{ color: 'white' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default CheckVerifyCode;
