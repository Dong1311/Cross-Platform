import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { createUserWithEmailAndPassword } from 'firebase/auth';  // Firebase Auth
import { collection, addDoc } from 'firebase/firestore';  // Firestore cho việc lưu thông tin người dùng
import { auth, db } from '../firebase';  // Firebase config
import styles from '../public/styles/sign-up_style';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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

// Khai báo kiểu của navigation
type NavigationProp = StackNavigationProp<RootStackParamList, 'sign-up'>;

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState<string>(''); // State để thông báo thành công
  // const navigation = useNavigation();
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

    if (!email || !email.includes('@')) {
      newErrors.email = 'Email không hợp lệ';
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
        // Đăng ký người dùng với Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Lưu thông tin người dùng vào Firestore (tuỳ chọn)
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: role,
        });

        setSuccessMessage('Đăng ký thành công!'); // Thông báo thành công
        console.log('User đăng ký thành công: ', user.email);
      } catch (error: any) {
        let newErrors: Errors = {};
        switch (error.code) {
          case 'auth/email-already-in-use':
            newErrors.email = 'Email này đã được sử dụng';
            break;
          case 'auth/invalid-email':
            newErrors.email = 'Email không hợp lệ';
            break;
          case 'auth/weak-password':
            newErrors.password = 'Mật khẩu quá yếu';
            break;
          default:
            newErrors.email = 'Đã xảy ra lỗi. Vui lòng thử lại';
        }
        setErrors(newErrors);
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
            { label: 'Giảng viên (Lecturer)', value: 'lecturer' },
            { label: 'Sinh viên (Student)', value: 'student' },
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

        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.loginText}>Hoặc đăng nhập với username/password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;
