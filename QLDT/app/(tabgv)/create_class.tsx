import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Import Icon
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { Link } from 'expo-router';

const CreateClass: React.FC = () => {
  const [classId, setClassId] = useState('');
  const [subClassId, setSubClassId] = useState('');
  const [className, setClassName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [classType, setClassType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxStudents, setMaxStudents] = useState('');

  const navigation = useNavigation(); // Sử dụng điều hướng để quay lại

  const handleCreateClass = () => {
    console.log('Class Created');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton}>
        <Link href="/home_gv">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Link>
      </TouchableOpacity>
        <Text style={styles.headerText}>HUST</Text>
        <Text style={styles.subHeaderText}>CREATE CLASS</Text>
      </View>
      <View style = {styles.bodyContainer}>
        {/* Form fields */}
        <TextInput
          style={styles.input}
          placeholder="Mã lớp*"
          value={classId}
          onChangeText={setClassId}
        />

        <TextInput
          style={styles.input}
          placeholder="Mã lớp kèm*"
          value={subClassId}
          onChangeText={setSubClassId}
        />

        <TextInput
          style={styles.input}
          placeholder="Tên lớp*"
          value={className}
          onChangeText={setClassName}
        />

        <TextInput
          style={styles.input}
          placeholder="Mã học phần*"
          value={courseId}
          onChangeText={setCourseId}
        />

        <RNPickerSelect
          onValueChange={setClassType}
          items={[
            { label: 'Lecture', value: 'Lecture' },
            { label: 'Lab', value: 'Lab' },
            { label: 'Seminar', value: 'Seminar' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Loại lớp*', value: null }}
        />

        <RNPickerSelect
          onValueChange={setStartDate}
          items={[
            { label: '09:00', value: '09:00' },
            { label: '10:00', value: '10:00' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Bắt đầu', value: null }}
        />

        <RNPickerSelect
          onValueChange={setEndDate}
          items={[
            { label: '11:00', value: '11:00' },
            { label: '12:00', value: '12:00' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Kết thúc', value: null }}
        />

        <TextInput
          style={styles.input}
          placeholder="Số lượng sinh viên tối đa"
          keyboardType="numeric"
          value={maxStudents}
          onChangeText={setMaxStudents}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateClass}>
          <Text style={styles.buttonText}>Tạo lớp học</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.linkText}>Thông tin danh sách các lớp mở</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#b71c1c',
    paddingTop: 40,  // Tạo khoảng trống cho mũi tên
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 40,
    top: 60,
    zIndex: 999,
  },
  bodyContainer:{
    padding:20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#ffff',
  },
  headerText: {
    fontSize: 24,
    color: '#ffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#ffff',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#B30000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#B30000',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#B30000',
    textAlign: 'center',
    marginTop: 15,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    height: 50,
    borderColor: '#B30000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputAndroid: {
    height: 50,
    borderColor: '#B30000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
};

export default CreateClass;
