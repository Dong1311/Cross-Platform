import { StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList, Modal, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';  
import Feature from '@/components/Feature';
import { useAuth } from '@/Context/AuthProvider';
import axios from 'axios';

const ClassDetail = () => {
  const params = useLocalSearchParams();
  const [infoClass, setInfoClass] = useState<Partial<ClassItem>>({});
  const { setClassId, classList } = useAuth() as AuthContextType;
  const { token } = useAuth();

  const [searchText, setSearchText] = useState('');
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  interface AuthContextType {
    token: string;
    role: string;
    accountId: string;
    setClassList: React.Dispatch<React.SetStateAction<ClassItem[]>>;
    setClassId: React.Dispatch<React.SetStateAction<string>>;
    classList: ClassItem[];
  }

  interface ClassItem {
    class_id: string;
    class_name: string;
    attached_code: string;
    class_type: string;
    lecturer_name: string;
    student_count: number;
    start_date: string;
    end_date: string;
    status: string;
  }

  useEffect(() => {
    if (params.class_id) {
      setClassId(params.class_id as string);
      const selectedClass = classList.find(
        (classItem) => classItem.class_id === params.class_id
      );
      
      if (selectedClass) {
        setInfoClass(selectedClass);
      }
    }
  }, [params.class_id, classList]);

  useEffect(() => {
    if (searchText.trim() !== '') {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 500); 

      return () => clearTimeout(delayDebounceFn); 
    } else {
      setStudents([]); 
    }
  }, [searchText]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://157.66.24.126:8080/it5023e/search_account', {
        search: searchText,
        pageable_request: {
          page: '0',
          page_size: '20',
        },
      });
      setStudents(response.data.data.page_content);
    } catch (error) {
      console.error('Error searching students:', error);
    }
  };

  const handleAddStudent = async (studentId: string) => {
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc muốn thêm sinh viên với ID ${studentId}?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              const response = await axios.post('http://157.66.24.126:8080/it5023e/add_student', {
                token: token, 
                class_id: infoClass.class_id,
                account_id: studentId, 
              });
              if (response.data.meta.code === '1000') {
                Alert.alert('Thành công', `Sinh viên với ID ${studentId} đã được thêm thành công!`);
                setIsModalVisible(false); 
              } else {
                Alert.alert('Lỗi', 'Thêm sinh viên thất bại.');
              }
            } catch (error) {
              console.error('Lỗi khi thêm sinh viên:', error.response ? error.response.data : error);
              Alert.alert('Lỗi', `Đã xảy ra lỗi khi thêm sinh viên. Chi tiết: ${error.response ? error.response.data : error.message}`);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  

  return (
    <>
      <StatusBar backgroundColor="#d32f2f" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{infoClass.class_name}</Text>
          <TouchableOpacity onPress={() => router.push({pathname:'/(tabgv)/edit_class', params: infoClass })}>
          <Ionicons  name='create-outline' size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Feature iconName="folder-open" featureName="Tài liệu" feature="/documents-class" />
          <Feature iconName="hand-right" featureName="Điểm danh" feature="/attendance" />
          <Feature iconName="mail-unread" featureName="Danh sách xin vắng" feature="/(tabgv)/absence_list" />
          <Feature iconName="document-text" featureName="Danh sách điểm danh" feature="/view_attendance" />
          <Feature iconName="library" featureName="Bài tập" feature="/assignment" />
        </View>

        {/* Modal for searching students */}
        <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
          <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm sinh viên"
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={students}
              keyExtractor={(item) => item.account_id.toString()}  
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.studentItem} onPress={() => handleAddStudent(item.account_id)}>
                  <Text>{item.first_name} {item.last_name}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={{ color: 'white' }}>Đóng</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        <TouchableOpacity 
          style={styles.addStudentButton} 
          onPress={() => setIsModalVisible(true)}>
          <Text style={styles.addStudentButtonText}>Thêm sinh viên</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default ClassDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: "#d32f2f",
    position: 'relative', 
  },
  navTitle: {
    fontSize: 18,
    color: "white",
  },
  body: {
    marginTop: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  studentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  closeButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
  addStudentButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  addStudentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
