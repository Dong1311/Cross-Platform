import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Button, StyleSheet } from 'react-native';

interface ClassInfo {
  subClassId: string;
  classId: string;
  className: string;
  courseId: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  lecturerId: number;
  classType: string;
  studentIds: number[];
  Id: string;
  registrationStatus?: string;
}

const ClassRegistration = () => {
  const [classCode, setClassCode] = useState('');
  const [registeredClasses, setRegisteredClasses] = useState<ClassInfo[]>([]);
  const [availableClasses, setAvailableClasses] = useState<ClassInfo[]>([]);
  const [modalVisible, setModalVisible] = useState(false); // Điều khiển Modal
  const studentId = '105';
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null); // Lớp được chọn để xóa
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Modal xóa

  const fetchAvailableClasses = async () => {
    try {
      const response = await fetch('https://6706925aa0e04071d2276c8e.mockapi.io/tailieuhoctap/class');
      const data = await response.json();
  
      // Cập nhật trạng thái đăng ký cho các lớp có `studentId`
      const updatedClasses = data.map((classItem: ClassInfo) => {
        if (classItem.studentIds.includes(parseInt(studentId))) {
          return { ...classItem, registrationStatus: 'Đăng ký thành công' };
        }
        return { ...classItem, registrationStatus: 'Chưa đăng ký' };
      });
  
      // Cập nhật cả availableClasses cho Modal và registeredClasses cho phần danh sách đăng ký
      setAvailableClasses(updatedClasses); // Đặt danh sách các lớp mở
      setRegisteredClasses(updatedClasses.filter((item: ClassInfo) => item.studentIds.includes(parseInt(studentId))));
      setModalVisible(true); // Hiển thị Modal khi dữ liệu đã được tải
    } catch (error) {
      console.error('Error fetching available classes:', error);
    }
  };
  
  <FlatList
    data={availableClasses}  // Sử dụng đúng availableClasses trong Modal
    keyExtractor={(item) => item.classId}
    renderItem={({ item }) => (
      <View style={styles.classRow}>
        <Text style={styles.classRowText}>{item.classId}</Text>
        <Text style={styles.classRowText}>{item.courseId}</Text>
        <Text style={styles.classRowText}>{item.className}</Text>
        <Text style={styles.classRowText}>
          {item.studentIds?.length || 0}/{item.maxStudents}
        </Text>
        <Text style={styles.classRowText}>{item.classType}</Text>
      </View>
    )}
    ListEmptyComponent={<Text>Không có lớp nào được mở</Text>}
  />
  

  useEffect(() => {
    fetchAvailableClasses(); // Tự động fetch dữ liệu khi màn hình được hiển thị
  }, []);

  
  // Thêm lớp vào danh sách đã đăng ký
  const handleRegister = () => {
    const foundClass = availableClasses.find(c => c.classId === classCode);
    const alreadyRegistered = registeredClasses.find(c => c.classId === classCode);
  
    if (alreadyRegistered) {
      alert('Lớp đã được đăng ký trong bảng');
      return;
    }
  
    if (foundClass) {
      const newClass: ClassInfo = {
        ...foundClass,
        registrationStatus: 'Đang chờ' // Trạng thái mặc định là "Đang chờ"
      };
      setRegisteredClasses([...registeredClasses, newClass]);
      setClassCode('');
    } else {
      alert('Không tìm thấy lớp');
    }
  };
  

  const handleSubmit = async () => {
    try {
      for (let c of registeredClasses) {
        // Kiểm tra nếu trạng thái đăng ký chưa phải "Đăng ký thành công"
        if (c.registrationStatus !== 'Đăng ký thành công') {
          const currentStudents = c.studentIds?.length || 0;
  
          // Kiểm tra xem `studentId` đã có trong mảng `studentIds` hay chưa
          if (!c.studentIds.includes(parseInt(studentId))) {
            if (currentStudents < c.maxStudents) {
              // Cập nhật `studentIds` với `studentId`
              const updatedClass = { 
                ...c, 
                studentIds: [...c.studentIds, parseInt(studentId)], // Đảm bảo `studentId` là số
                registrationStatus: 'Đăng ký thành công' 
              };
  
              // Gửi yêu cầu PUT để cập nhật lớp trên MockAPI
              const response = await fetch(`https://6706925aa0e04071d2276c8e.mockapi.io/tailieuhoctap/class/${c.Id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedClass)
              });
  
              if (response.ok) {
                // Hiển thị thông báo đăng ký thành công
                alert(`Đăng ký lớp ${c.classId} thành công`);
              } else {
                const errorData = await response.json();
                console.error('API Error:', errorData); 
                updatedClass.registrationStatus = 'Đăng ký thất bại';
              }
  
              // Cập nhật danh sách lớp đã đăng ký với trạng thái
              setRegisteredClasses((prevClasses) =>
                prevClasses.map((cl) =>
                  cl.classId === c.classId ? updatedClass : cl
                )
              );
            } else {
              alert(`Lớp ${c.classId} đã đủ sinh viên`);
            }
          } else {
            alert(`Student đã đăng ký lớp ${c.classId} trước đó`);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting registrations:', error);
      alert('Đã xảy ra lỗi khi gửi đăng ký');
    }
  };
  

  const handleDeleteClass = async () => {
    if (!selectedClass) return;
  
    try {
      const updatedClass = {
        ...selectedClass,
        studentIds: selectedClass.studentIds.filter(id => id !== parseInt(studentId)) // Xóa `studentId` khỏi danh sách
      };
  
      // Gửi yêu cầu cập nhật lên MockAPI
      const response = await fetch(`https://6706925aa0e04071d2276c8e.mockapi.io/tailieuhoctap/class/${selectedClass.Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClass),
      });
  
      if (response.ok) {
        // Xóa lớp khỏi danh sách đã đăng ký
        setRegisteredClasses((prevClasses) =>
          prevClasses.filter((cl) => cl.classId !== selectedClass.classId) // Xóa lớp khỏi bảng
        );
        alert('Xóa sinh viên khỏi lớp thành công');
      } else {
        alert('Đã xảy ra lỗi khi xóa');
      }
    } catch (error) {
      console.error('Error deleting student from class:', error);
      alert('Đã xảy ra lỗi khi xóa');
    } finally {
      setDeleteModalVisible(false);
      setSelectedClass(null); 
    }
  };

  return (
    <View style={styles.container1}>
      {/* Tiêu đề */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>HUST</Text>
        <Text style={styles.subHeaderText}>REGISTER FOR CLASS</Text>
      </View>

      <View style={styles.container2}>
        {/* Nhập mã lớp */}
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

        {/* Tiêu đề bảng */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Mã lớp</Text>
          <Text style={styles.tableHeaderText}>Mã lớp kèm</Text>
          <Text style={styles.tableHeaderText}>Tên lớp</Text>
          <Text style={styles.tableHeaderText}>Trạng thái đăng ký</Text> 
        </View>

        {/* Danh sách lớp đã đăng ký */}
        <FlatList
          data={registeredClasses}
          keyExtractor={(item) => item.classId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedClass(item)}>
              <View style={[
                styles.classRow,
                selectedClass?.classId === item.classId ? styles.selectedRow : null // Thêm màu cho hàng được chọn
              ]}>
                <Text style={styles.classRowText}>{item.classId}</Text>
                <Text style={styles.classRowText}>{item.courseId}</Text>
                <Text style={styles.classRowText}>{item.className}</Text>
                <Text style={styles.classRowText}>{item.registrationStatus || 'Đang chờ'}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>Chưa có lớp nào được đăng ký</Text>}
        />


        {/* Các nút hành động */}
        <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Gửi đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButtonContainer}
          onPress={() => {
            if (selectedClass) {
              setDeleteModalVisible(true); // Hiển thị popup xác nhận khi nhấn "Xóa lớp"
            } else {
              alert('Vui lòng chọn một lớp để xóa');
            }
          }}
        >
          <Text style={styles.buttonText}>Xóa lớp</Text>
        </TouchableOpacity>
        </View>

        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Bạn có chắc chắn muốn xóa?</Text>
              <View style={styles.modalButtons}>
                <Button title="Hủy" onPress={() => setDeleteModalVisible(false)} />
                <Button title="Đồng ý" onPress={handleDeleteClass} />
              </View>
            </View>
          </View>
        </Modal>
        {/* Nút mở Modal hiển thị danh sách lớp mở */}
        <TouchableOpacity onPress={fetchAvailableClasses}>
          <Text style={styles.linkText}>Thông tin danh sách các lớp mở</Text>
        </TouchableOpacity>

        {/* Modal hiển thị danh sách lớp mở */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Danh sách các lớp mở</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Mã lớp</Text>
                <Text style={styles.tableHeaderText}>Mã khóa</Text>
                <Text style={styles.tableHeaderText}>Tên lớp</Text>
                <Text style={styles.tableHeaderText}>Số sinh viên</Text>
                <Text style={styles.tableHeaderText}>Loại lớp</Text>
              </View>

              <FlatList
                data={availableClasses}
                keyExtractor={(item) => item.classId}
                renderItem={({ item }) => (
                  <View style={styles.classRow}>
                    <Text style={styles.classRowText}>{item.classId}</Text>
                    <Text style={styles.classRowText}>{item.courseId}</Text>
                    <Text style={styles.classRowText}>{item.className}</Text>
                    <Text style={styles.classRowText}>
                      {item.studentIds?.length || 0}/{item.maxStudents}
                    </Text>
                    <Text style={styles.classRowText}>{item.classType}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text>Không có lớp nào được mở</Text>}
              />

              <Button title="Đóng" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

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
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#b71c1c',
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
    flex: 1,  // Đảm bảo các cột có chiều rộng linh hoạt
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  classRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  classRowText: {
    flex: 1,
    textAlign: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  selectedRow: {
    backgroundColor: '#e0e0e0', // Màu nền cho hàng đã chọn
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

});

export default ClassRegistration;
