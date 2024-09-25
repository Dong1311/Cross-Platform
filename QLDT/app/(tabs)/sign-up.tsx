import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';  
import { StackNavigationProp } from '@react-navigation/stack';

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
}

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});  
  const navigation = useNavigation<StackNavigationProp<any>>();
  
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

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logohust_2.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to AllHust</Text>

      <View style={styles.form}>
        <View style={styles.nameContainer}>
        <TextInput
          style={[
            styles.input, 
            styles.halfInput, 
            !!errors.lastName ? styles.errorInput : null  // Chỉ áp dụng style khi có lỗi
          ]}
          placeholder="Họ"
          value={lastName}
          onChangeText={setLastName}
        />
         

          <TextInput
            style={[
              styles.input, 
              styles.halfInput, 
              !!errors.firstName ? styles.errorInput : null  // Chỉ áp dụng style khi có lỗi
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

        <TouchableOpacity style={styles.button} onPress={validateFields}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.loginText}>Hoặc đăng nhập với username/password</Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity onPress={() => navigation.navigate('sign-up')}>
          <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity> */}
      </View>
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
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#b71c1c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default SignUpScreen;
