import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { useAuth } from '@/Context/AuthProvider';

interface Student {
  account_id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  status?: string;
  attendance_id?: string;
}

const ViewAttendance: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [listStudent, setListStudent] = useState<Student[]>([]);
  const [msgError, setMsgError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);

  const { classId, token, accountId, role } = useAuth();

  const getStudents = async (): Promise<void> => {
    try {
      const res = await axios.post(
        'http://157.66.24.126:8080/it5023e/get_class_info',
        { token, role, account_id: accountId, class_id: classId }
      );
      if (res.status === 200) {
        setStudents(res.data.data.student_accounts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAttendanceData = async (): Promise<void> => {
    try {
      const res = await axios.post(
        'http://157.66.24.126:8080/it5023e/get_attendance_list',
        { token, class_id: classId, date }
      );
      if (res.status === 200) {
        setAttendance(res.data.data.attendance_student_details);
        setMsgError('');
      }
    } catch (error: any) {
      setAttendance([]);
      setMsgError(error.response?.data?.data || 'Error fetching attendance');
      console.error('Error', error.response?.data?.meta?.message);
    }
  };

  const handleChangeStatus = async (status: string): Promise<void> => {
    try {
      if (!selectedStudent?.attendance_id) return;

      const res = await axios.post(
        'http://157.66.24.126:8080/it5023e/set_attendance_status',
        { token, attendance_id: selectedStudent.attendance_id, status }
      );
      if (res.data.meta.code === "1000") {
        getAttendanceData();
        alert('Chỉnh sửa thành công');
        setModalVisible(false);
      }
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.meta?.message || 'Error updating status');
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    getAttendanceData();
  }, [date]);

  useEffect(() => {
    let templist: Student[] = [];
    if (attendance.length > 0) {
      templist = students.map((student) => ({
        ...student,
        ...attendance.find((att) => att.student_id === student.student_id),
      }));
    }
    setListStudent(templist);
  }, [attendance, students]);

  const openModal = (item: Student): void => {
    setModalVisible(true);
    setSelectedStudent(item);
  };

  const closeModal = (): void => {
    setModalVisible(false);
  };

  const onChange = (_event: any, selectedDate: Date | undefined): void => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showMode = (currentMode: 'date' | 'time'): void => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = (): void => {
    showMode('date');
  };

  const renderStudent = ({ item }: { item: Student }) => {
    return (
      <View style={styles.itemStudent}>
        <View style={styles.infoStudent}>
          <FontAwesome5 name="user-circle" size={40} color="#ddd" />
          <View style={styles.groupInfo}>
            <Text style={styles.nameStudent}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.mssvStudent}>{item.student_id}</Text>
            <Text
              style={{
                color:
                  item.status === 'PRESENT'
                    ? 'green'
                    : item.status === 'UNEXCUSED_ABSENCE'
                    ? 'red'
                    : item.status === 'EXCUSED_ABSENCE'
                    ? '#e5b55f'
                    : 'black',
              }}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.changeStatusButton}
          onPress={() => openModal(item)}
        >
          <Text style={styles.changeStatusButtonText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Danh sách điểm danh</Text>
        <TouchableOpacity>
          <Text style={styles.navbtn} />
        </TouchableOpacity>
      </View>

      <View style={styles.containerDate}>
        <Text style={styles.infoDate}>
          Điểm danh ngày:{' '}
          {date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </Text>

        <TouchableOpacity style={styles.btndate} onPress={showDatepicker}>
          <Text>chọn ngày</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {msgError ? (
          <Text style={styles.errorText}>{msgError}</Text>
        ) : (
          <FlatList
            data={listStudent}
            keyExtractor={(item) => item.account_id}
            renderItem={renderStudent}
          />
        )}
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Chọn trạng thái</Text>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => handleChangeStatus('PRESENT')}>
                <Text style={styles.modalbtn}>PRESENT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChangeStatus('EXCUSED_ABSENCE')}
              >
                <Text style={styles.modalbtn}>EXCUSED_ABSENCE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChangeStatus('UNEXCUSED_ABSENCE')}
              >
                <Text style={styles.modalbtn}>UNEXCUSED_ABSENCE</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.btnclosed}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#d32f2f',
  },
  navTitle: {
    fontSize: 18,
    color: 'white',
  },
  navbtn: {
    fontSize: 18,
    color: 'white',
    padding: 4,
  },
  containerDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 6,
    marginBottom: 6,
  },
  btndate: {
    padding: 8,
    backgroundColor: '#ccc',
  },
  infoDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  itemStudent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  infoStudent: {
    flexDirection: 'row',
  },
  groupInfo: {
    marginLeft: 12,
    gap: 4,
  },
  nameStudent: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mssvStudent: {
    color: '#888',
  },
  changeStatusButton: {
    marginTop: 10,
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  changeStatusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 4,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: '#d32f2f',
    color: '#FFF',
    padding: 16,
    textAlign: 'center',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  modalContent: {
    padding: 16,
    gap: 8,
  },
  modalbtn: {
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#ccc',
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnclosed: {
    backgroundColor: '#d32f2f',
    color: '#fff',
    width: 80,
    textAlign: 'center',
    alignSelf: 'flex-end',
    padding: 10,
    marginVertical: 16,
    marginRight: 16,
    borderRadius: 6,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8,
    color: '#d32f2f',
  },
});

export default ViewAttendance;