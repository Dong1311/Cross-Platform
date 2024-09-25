import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={{ uri: 'https://your-logo-url-here.com/logo.png' }} style={styles.logo} />

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to AllHust</Text>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.nameContainer}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Họ"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Tên"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        {/* Role Picker */}
        <RNPickerSelect
          onValueChange={(value) => setRole(value)}
          items={[
            { label: 'Student', value: 'student' },
            { label: 'Teacher', value: 'teacher' },
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

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

        {/* Login link */}
        <Text style={styles.loginText}>Hoặc đăng nhập với username/password</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b71c1c', // Màu đỏ
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 50,
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
});

export default SignUp;
