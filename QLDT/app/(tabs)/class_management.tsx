import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { db } from '../../firebase';  // Import Firestore từ file cấu hình firebase.js
import { collection, getDocs } from 'firebase/firestore';  // Import Firestore methods
import styles from '../../public/styles/class_management_style';
interface ClassInfo {
  classCode: string;  // class_ID
  additionalCode: string;  // class_ID_requirement
  className: string;  // class_name
}

const ClassManagement = () => {
  const [classCode, setClassCode] = useState('');
  const [registeredClasses, setRegisteredClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classCollection = collection(db, 'classes');
        const classSnapshot = await getDocs(classCollection);
        const classList = classSnapshot.docs.map((doc) => ({
          classCode: doc.data().class_ID,
          additionalCode: doc.data().class_ID_requirement,
          className: doc.data().class_name,
        }));
        setRegisteredClasses(classList);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container1}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>HUST</Text>
        <Text style={styles.subHeaderText}>CLASS MANAGEMENT</Text>
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
            <Text style={styles.buttonText}>Tìm kiếm</Text>
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
              <Text style={styles.classCell}>{item.classCode}</Text>
              <Text style={styles.classCell}>{item.additionalCode}</Text>
              <Text style={styles.classCell}>{item.className}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>Danh sách trống</Text>}
        />

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.buttonText}>Tạo lớp học</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButtonContainer}>
            <Text style={styles.buttonText}>Chỉnh</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.linkText}>Thông tin danh sách các lớp mở</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

// const styles = StyleSheet.create({
//   container1: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container2: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   headerContainer: {
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     backgroundColor: '#b71c1c',
//   },
//   headerText: {
//     fontSize: 24,
//     color: '#ffff',
//     textAlign: 'center',
//     marginBottom: 10,
//     marginTop: 50,
//     fontWeight: 'bold',
//   },
//   subHeaderText: {
//     fontSize: 16,
//     color: '#ffff',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   input: {
//     flex: 0.7,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 4,
//     padding: 10,
//   },
//   registerButton: {
//     backgroundColor: '#b30000',
//     padding: 10,
//     borderRadius: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#b30000',
//     padding: 10,
//     borderRadius: 4,
//   },
//   tableHeaderText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     flex: 1,
//     textAlign: 'center',
//   },
//   classRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//   },
//   classCell: {
//     flex: 1,
//     textAlign: 'center',  // Căn giữa nội dung bảng
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   submitButton: {
//     flex: 0.48,
//     backgroundColor: '#b30000',
//     paddingVertical: 10,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   deleteButtonContainer: {
//     flex: 0.48,
//     backgroundColor: '#b30000',
//     paddingVertical: 10,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   linkText: {
//     color: '#b30000',
//     textAlign: 'center',
//     marginTop: 20,
//     textDecorationLine: 'underline',
//   },
// });

export default ClassManagement;
