import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Button, StyleSheet } from 'react-native';
import styles from '../../public/styles/class_register_style';
import { useRouter } from 'expo-router';

interface ClassInfo {
  class_id: string;
  class_name: string;
  lecturer_name: string;
}

const ClassRegistration = () => {
  const [availableClasses, setAvailableClasses] = useState<ClassInfo[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<ClassInfo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = "FNq9V2";
  const [classCode, setClassCode] = useState('');
  const router = useRouter();

  const fetchAvailableClasses = async (requestedPage: number) => {
    try {
      const response = await fetch('http://157.66.24.126:8080/it5023e/get_open_classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          pageable_request: {
            page: requestedPage.toString(),
            page_size: "4",
          },
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data?.meta?.code === "1000") {
        setAvailableClasses(data.data.page_content);
        setTotalPages(parseInt(data.data.page_info.total_page));
      } else {
        console.error('Error fetching classes:', data.meta?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching available classes:', error);
    }
  };

  const addClassToSelection = (selectedClass: ClassInfo) => {
    if (!selectedClasses.some((cls) => cls.class_id === selectedClass.class_id)) {
      setSelectedClasses([...selectedClasses, selectedClass]);
    }
    setModalVisible(false);
  };

  const registerClasses = async () => {
    const classIds = selectedClasses.map((cls) => cls.class_id);
    if (classIds.length === 0) {
      alert('Vui lòng chọn ít nhất một lớp để đăng ký.');
      return;
    }
    try {
      const response = await fetch('http://157.66.24.126:8080/it5023e/register_class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, class_ids: classIds }),
      });

      const data = await response.json();
      if (data.meta.code === "1000") {
        alert('Đăng ký thành công các lớp: ' + classIds.join(', '));
        router.push('/home_sv'); 
      } else {
        alert('Đăng ký thất bại: ' + data.meta.message);
      }
    } catch (error) {
      console.error('Error registering classes:', error);
    }
  };

  useEffect(() => {
    fetchAvailableClasses(page);
  }, [page]);

  return (
    <View style={styles.container1}>
      {/* Tiêu đề */}
      <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.push('/home_sv')} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
        <Text style={styles.headerText}>HUST</Text>
        <Text style={styles.subHeaderText}>REGISTER FOR CLASS</Text>
      </View>

      <View style={styles.container2}>
        {/* Nhập mã lớp */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mã lớp"
          />
          <TouchableOpacity style={styles.registerButton} onPress={() => {
            if (!classCode.trim()) {
              alert('Vui lòng nhập mã lớp.');
              return;
            }            
            const foundClass = availableClasses.find(cls => cls.class_id === classCode);
            if (foundClass) {
              addClassToSelection(foundClass);
            } else {
              alert('Không tìm thấy lớp.');
            }
          }}>
            <Text style={styles.buttonText}>Tìm kiếm</Text>
          </TouchableOpacity>

        </View>

        {/* Tiêu đề bảng */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Mã lớp</Text>
          <Text style={styles.tableHeaderText}>Tên lớp</Text>
          <Text style={styles.tableHeaderText}>Giảng viên</Text> 
        </View>

        {/* Danh sách lớp đã đăng ký */}
        <FlatList
          data={selectedClasses}
          keyExtractor={(item) => item.class_id}
          renderItem={({ item }) => (
            <TouchableOpacity >
              <View style={[
                styles.classRow,
                selectedClasses.some((cls) => cls.class_id === item.class_id) ? styles.selectedRow : null 
              ]}>
                <Text style={styles.classRowText}>{item.class_id}</Text>
                <Text style={styles.classRowText}>{item.class_name}</Text>
                <Text style={styles.classRowText}>{item.lecturer_name }</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>Chưa có lớp nào được đăng ký</Text>}
        />

        {/* Các nút hành động */}
        <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.submitButton} onPress={registerClasses}>
          <Text style={styles.buttonText}>Gửi đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButtonContainer}
        >
          <Text style={styles.buttonText}>Xóa lớp</Text>
        </TouchableOpacity>
        </View>

        {/* Nút mở Modal hiển thị danh sách lớp mở */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
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
              <Text style={styles.modalHeader}>Danh Sách Các Lớp Mở</Text>
              <FlatList
                data={availableClasses}
                keyExtractor={(item) => item.class_id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => addClassToSelection(item)}>
                    <View style={styles.classRow}>
                      <Text style={styles.classRowText}>{item.class_id}</Text>
                      <Text style={styles.classRowText}>{item.class_name}</Text>
                      <Text style={styles.classRowText}>{item.lecturer_name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>Không có lớp nào được mở</Text>}
              />
              {/* Nút phân trang */}
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1}
                >
                  <Text style={styles.paginationText}>Trước</Text>
                </TouchableOpacity>
                <Text style={styles.paginationText}>Trang {page} / {totalPages}</Text>
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages}
                >
                  <Text style={styles.paginationText}>Sau</Text>
                </TouchableOpacity>
              </View>
              <Button title="Đóng" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

            </View>
          </View>
  );
};


export default ClassRegistration;
