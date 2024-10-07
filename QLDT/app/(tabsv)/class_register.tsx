import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

interface ClassInfo {
  classCode: string;
  additionalCode: string;
  className: string;
}

const ClassRegistration = () => {
  const [classCode, setClassCode] = useState('');
  const [registeredClasses, setRegisteredClasses] = useState<ClassInfo[]>([]);

  const handleRegister = () => {
    if (classCode.trim()) {
      const newClass: ClassInfo = {
        classCode,
        additionalCode: '12345',
        className: 'Tên lớp mẫu',
      };
      setRegisteredClasses([...registeredClasses, newClass]);
      setClassCode('');
    }
  };

  const handleDelete = (code: string) => {
    setRegisteredClasses(registeredClasses.filter(c => c.classCode !== code));
  };

  return (
    <View style={styles.container1}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>HUST</Text>
        <Text style={styles.subHeaderText}>REGISTER FOR CLASS</Text>
      </View>
      <View style={styles.container2}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mã lớp"
            value={classCode}
            onChangeText={setClassCode}
          />
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Mã lớp</Text>
          <Text style={styles.tableHeaderText}>Mã lớp kèm</Text>
          <Text style={styles.tableHeaderText}>Tên lớp</Text>
        </View>

        <FlatList
          data={registeredClasses}
          keyExtractor={(item) => item.classCode}
          renderItem={({ item }) => (
            <View style={styles.classRow}>
              <Text>{item.classCode}</Text>
              <Text>{item.additionalCode}</Text>
              <Text>{item.className}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.classCode)}>
                <Text style={styles.deleteButton}>Xóa lớp</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text>Sinh viên chưa đăng ký lớp nào</Text>}
        />

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.buttonText}>Gửi đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButtonContainer}>
            <Text style={styles.buttonText}>Xóa lớp</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.linkText}>Thông tin danh sách các lớp mở</Text>
        </TouchableOpacity>
      </View>
      

      
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    
    backgroundColor: '#fff',
  },
  container2: {
    flex: 1,
    padding:20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#b71c1c'
  },
  headerText: {
    fontSize: 24,
    color: '#ffff',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#ffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    flex: 0.7,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  registerButton: {
    backgroundColor: '#b30000',
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#b30000',
    padding: 10,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  classRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  deleteButton: {
    color: '#ff4d4d',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    flex: 0.48,
    backgroundColor: '#b30000',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonContainer: {
    flex: 0.48,
    backgroundColor: '#b30000',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  linkText: {
    color: '#b30000',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default ClassRegistration;
