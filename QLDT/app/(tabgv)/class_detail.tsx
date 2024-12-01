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

  // State for searching students
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

  // useEffect to trigger search when searchText changes
  useEffect(() => {
    if (searchText.trim() !== '') {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 500); // Delay for 500ms to avoid too many requests on every keystroke

      return () => clearTimeout(delayDebounceFn); // Cleanup on change
    } else {
      setStudents([]); // Clear the list when searchText is empty
    }
  }, [searchText]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://157.66.24.126:8080/it5023e/search_account', {
        search: searchText,
        pageable_request: {
          page: '0',
          page_size: '5',
        },
      });
      setStudents(response.data.data.page_content);
    } catch (error) {
      console.error('Error searching students:', error);
    }
  };

  const handleAddStudent = async (studentId: string) => {
    try {
      const response = await axios.post('http://157.66.24.126:8080/it5023e/add_student', {
        token: token, // Replace this with dynamic token
        class_id: infoClass.class_id,
        account_id: studentId,
      });

      if (response.data.meta.code === '1000') {
        Alert.alert('Success', `Student with ID ${studentId} added successfully!`);
        setIsModalVisible(false); // Close modal after adding
      } else {
        Alert.alert('Error', 'Failed to add student.');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Error', 'An error occurred while adding the student.');
    }
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
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={[styles.addButton, { position: 'absolute', top: 20, right: 20 }]}>
            <Ionicons name="add" size={24} color="white" />
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
              placeholder="Search for students"
              value={searchText}
              onChangeText={setSearchText} // Update searchText on input change
            />
            <FlatList
              data={students}
              keyExtractor={(item) => item.account_id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.studentItem} onPress={() => handleAddStudent(item.account_id)}>
                  <Text>{item.first_name} {item.last_name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
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
    position: 'relative', // Ensure position of add button
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
  addButton: {
    zIndex: 999, // Ensure button appears on top
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
});
