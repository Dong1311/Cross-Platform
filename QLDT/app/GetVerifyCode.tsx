import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../public/styles/sign-up_style';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Link } from 'expo-router';

const GetVerifyCode = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const handleGetVerifyCode = async () => {
    try {
      const response = await fetch('http://157.66.24.126:8080/it4788/get_verify_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const responseText = await response.text();
      console.log('Nội dung phản hồi:', responseText);
  
      if (!response.ok) {
        setError('Yêu cầu không thành công. Vui lòng thử lại.');
        return;
      }
  
      const result = JSON.parse(responseText);
  
      if (result.code === "1000") {
        setVerificationCode(result.verify_code); // Lưu mã xác thực
        // Hiển thị Alert với mã xác thực
        Alert.alert(
          'Mã xác thực',
          `Mã xác thực của bạn là: ${result.verify_code}`,
          [{ text: 'OK' }]
        );
      } else {
        setError(result.message || 'Đã xảy ra lỗi.');
      }
    } catch (error) {
      console.error('Không thể kết nối đến server:', error);
      setError('Không thể kết nối tới server. Vui lòng thử lại sau.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logohust_2.png')} style={styles.logo} />
      <Text style={styles.title}>Lấy mã xác thực</Text>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, styles.largeInput, error ? styles.errorInput : null]}
          placeholder="Nhập email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={[styles.input, styles.largeInput, error ? styles.errorInput : null]}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleGetVerifyCode}>
          <Text style={styles.buttonText}>Nhận mã xác thực</Text>
        </TouchableOpacity>

        {verificationCode && (
          <Text style={{ color: 'green', marginTop: 20 }}>
            Mã xác thực của bạn là: {verificationCode}
          </Text>
        )}

        <View style={styles.centeredLinksContainer}>
          <Link href="/CheckVerifyCode">
            <Text style={[styles.loginText, styles.linkSpacing]}>Check Verify Code</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default GetVerifyCode;
