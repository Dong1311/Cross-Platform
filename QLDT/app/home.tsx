import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Chào mừng đến với Hệ thống quản lý lớp học</Text>
        <Button title="Chuyển đến Quản lý lớp học" onPress={() => {/* Chuyển tới các chức năng khác */}} />
      </View>
      <Text style={styles.header}>Welcome to Class Management System</Text>
      <Button title="Go to Class Management" onPress={() => router.push('/(tabs)/class_management')} />
      <Button title="Go to Register Class" onPress={() => router.push('/(tabs)/class_register')} />
      <Button title="Go to Create Class" onPress={() => router.push('/(tabs)/create_class')} />
      <Button title="Go to Edit Class" onPress={() => router.push('/(tabs)/edit_class')} />
      <Button title="Go to Test Class" onPress={() => router.push('/(tabs)/test_class')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Home;
