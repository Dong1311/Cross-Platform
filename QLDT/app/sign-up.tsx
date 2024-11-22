import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import styles from '../public/styles/sign-up_style';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Link } from 'expo-router';

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
}
type RootStackParamList = {
  'sign-up': undefined;
  login: undefined;
  home: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'sign-up'>;

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const navigation = useNavigation<NavigationProp>();

  const validateFields = () => {
    let valid = true;
    let newErrors: Errors = {};
  
    if (!firstName) {
      newErrors.firstName = 'Vui lòng nhập tên';
      valid = false;
    }
  
    if (!lastName) {
      newErrors.lastName = 'Vui lòng nhập họ';
      valid = false;
    }
  
    if (!email || !email.includes('@') || 
        (!email.endsWith('@hust.edu.vn') && !email.endsWith('@soict.hust.edu.vn'))) {
      newErrors.email = 'Email không hợp lệ. Vui lòng sử dụng email @hust.edu.vn hoặc @soict.hust.edu.vn';
      valid = false;
    }
  
    if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      valid = false;
    }
  
    if (!role) {
      newErrors.role = 'Vui lòng chọn vai trò';
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (validateFields()) {
      try {
        const userData = {
          ho: lastName,
          ten: firstName,
          email: email,
          password: password,
          uuid: 131103, // Sử dụng UUID cố định
          role: role?.toUpperCase()
        };
  
        console.log("UUID đã gửi:", userData.uuid);  // In UUID ra console để theo dõi
  
        const response = await fetch('http://157.66.24.126:8080/it4788/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
  
        const responseText = await response.text();
        console.log("Response text:", responseText);
  
        if (response.ok) {
          const result = JSON.parse(responseText);
          setSuccessMessage('Đăng ký thành công!');
          console.log('User đăng ký thành công:', result);
        } else {
          let newErrors: Errors = {};
          newErrors.email = responseText;
          setErrors(newErrors);
        }
      } catch (error) {
        setErrors({ email: 'Không thể kết nối tới server. Vui lòng thử lại sau.' });
        console.error('Error during signup:', error);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logohust_2.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to AllHust</Text>

      <View style={styles.form}>
        <View style={styles.nameContainer}>
          <TextInput
            style={[
              styles.input,
              styles.halfInput,
              !!errors.lastName ? styles.errorInput : null
            ]}
            placeholder="Họ"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={[
              styles.input,
              styles.halfInput,
              !!errors.firstName ? styles.errorInput : null
            ]}
            placeholder="Tên"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.nameContainer}>
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>

        <TextInput
          style={[styles.input, errors.email ? styles.errorInput : null]}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.password ? styles.errorInput : null]}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <RNPickerSelect
          onValueChange={(value) => setRole(value)}
          items={[
            { label: 'Giảng viên (Lecturer)', value: 'LECTURER' },
            { label: 'Sinh viên (Student)', value: 'STUDENT' },
          ]}
          placeholder={{ label: "Role", value: null }}
          style={{
            inputAndroid: {
              color: 'black',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 5,
              marginVertical: 10,
            },
            inputIOS: {
              color: 'black',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 5,
              marginVertical: 10,
            },
          }}
        />
        {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
        
        {successMessage ? <Text style={{ color: 'green', marginTop: 20 }}>{successMessage}</Text> : null}

        <View style={styles.centeredLinksContainer}>
          <Link href="/login">
            <Text style={[styles.loginText, styles.linkSpacing]}>Hoặc đăng nhập với username/password</Text>
          </Link>
          <Link href="/GetVerifyCode">
            <Text style={[styles.loginText, styles.linkSpacing]}>Get verify code</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
