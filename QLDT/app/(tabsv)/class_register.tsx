import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Button, StyleSheet } from 'react-native';
import styles from '../../public/styles/class_register_style';
import { useRouter } from 'expo-router';
import { useAuth } from "@/Context/AuthProvider";

interface ClassInfo {
  class_id: string;
  class_name: string;
  class_type: string;
  lecturer_name: string;
}

const ClassRegistration = () => {
  const [availableClasses, setAvailableClasses] = useState<ClassInfo[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<ClassInfo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [classCode, setClassCode] = useState("");
  const [registeredClasses, setRegisteredClasses] = useState<ClassInfo[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [allClasses, setAllClasses] = useState<ClassInfo[]>([]);

  // console.log("All Classes:", allClasses);
  // console.log("Searching for:", classCode);
  // console.log("classCode nhập vào:", classCode);
  // console.log("Danh sách allClasses:", allClasses.map(cls => cls.class_id));

  const { token } = useAuth();
  const combinedClasses = [
    ...registeredClasses,
    ...selectedClasses.filter(
      (cls) => !registeredClasses.some((reg) => reg.class_id === cls.class_id)
    ),
  ];
  // console.log(token);
  const router = useRouter();
  const fetchAllClasses = async () => {
    try {
        let currentPage = 1;
        let totalPages = 1;
        let accumulatedClasses: ClassInfo[] = []; // Biến tạm để lưu danh sách tích lũy

        do {
            const response = await fetch('http://157.66.24.126:8080/it5023e/get_open_classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    pageable_request: {
                        page: currentPage.toString(),
                        page_size: "10", // Số lượng mỗi lần lấy
                    },
                }),
            });

            const data = await response.json();
            if (data?.meta?.code === '1000') {
                accumulatedClasses = [...accumulatedClasses, ...data.data.page_content]; // Gộp danh sách lớp mới
                totalPages = parseInt(data.data.page_info.total_page);
                currentPage++;
            } else {
                console.error('Error fetching classes:', data.meta?.message || 'Unknown error');
                break;
            }
        } while (currentPage <= totalPages);

        setAllClasses(accumulatedClasses); // Cập nhật toàn bộ danh sách vào state
    } catch (error) {
        console.error('Error fetching all classes:', error);
    }
};

  
  const fetchRegisteredClasses = async () => {
    try {
      const response = await fetch("http://157.66.24.126:8080/it5023e/get_class_list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          role: "STUDENT",
          account_id: "24",
          pageable_request: {
            page: "0",
            page_size: "10",
          },
        }),
      });

      const data = await response.json();
      if (data?.meta?.code === "1000") {
        setRegisteredClasses(data.data.page_content); // Lưu danh sách lớp đã đăng ký
      } else {
        console.error("Error fetching registered classes:", data.meta?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching registered classes:", error);
    }
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);
  
  
  
  const fetchAvailableClasses = async (requestedPage: number) => {
    try {
      const response = await fetch(
        "http://157.66.24.126:8080/it5023e/get_open_classes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            pageable_request: {
              page: requestedPage.toString(),
              page_size: "4",
            },
          }),
        }
      );

      const data = await response.json();

      if (data?.meta?.code === "1000") {
        setAvailableClasses(data.data.page_content);
        setTotalPages(parseInt(data.data.page_info.total_page));
      } else {
        console.error(
          "Error fetching classes:",
          data.meta?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching available classes:", error);
    }
  };

  const addClassToSelection = (selectedClass: ClassInfo) => {
    if (!selectedClasses.some((cls) => cls.class_id === selectedClass.class_id)) {
      setSelectedClasses([...selectedClasses, selectedClass]);
    }
    setModalVisible(false);
  };

  const clearSelectedClasses = () => {
    if (!selectedClassId) {
      alert("Vui lòng chọn một lớp để xóa.");
      return;
    }
  
    // Kiểm tra nếu lớp đã được đăng ký
    const isRegistered = registeredClasses.some(
      (cls) => cls.class_id === selectedClassId
    );
  
    if (isRegistered) {
      alert("Lớp đã được đăng ký không thể xóa.");
      return;
    }
  
    // Xóa lớp chưa đăng ký
    const updatedClasses = selectedClasses.filter(
      (cls) => cls.class_id !== selectedClassId
    );
  
    setSelectedClasses(updatedClasses);
    setSelectedClassId(null); // Reset trạng thái chọn
    alert("Lớp chưa đăng ký đã được xóa.");
  };
  

  const registerClasses = async () => {
    const classIds = selectedClasses.map((cls) => cls.class_id);
    if (classIds.length === 0) {
      alert("Vui lòng chọn ít nhất một lớp để đăng ký.");
      return;
    }
    try {
      const response = await fetch(
        "http://157.66.24.126:8080/it5023e/register_class",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, class_ids: classIds }),
        }
      );

      const data = await response.json();
      if (data.meta.code === "1000") {
        alert("Đăng ký thành công các lớp: " + classIds.join(", "));
        router.push("/home_sv");
      } else {
        alert("Đăng ký thất bại: " + data.meta.message);
      }
    } catch (error) {
      console.error("Error registering classes:", error);
    }
  };

  useEffect(() => {
    fetchAvailableClasses(page);
  }, [page]);
  useEffect(() => {
    fetchRegisteredClasses(); 
  }, []);

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
          value={classCode} // Liên kết với state classCode
          onChangeText={setClassCode} // Cập nhật giá trị classCode khi người dùng nhập
        />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => {
          if (!classCode.trim()) {
            alert("Vui lòng nhập mã lớp.");
            return;
          }
          const foundClass = allClasses.find(
            (cls) => String(cls.class_id).trim() == String(classCode).trim()
          );
          
          if (foundClass) {
            addClassToSelection(foundClass);
          } else {
            alert("Không tìm thấy lớp.");
          }
        }}
      >
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
        data={combinedClasses} // Hiển thị danh sách hợp nhất
        keyExtractor={(item) => item.class_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            // Nếu lớp đang được chọn, bỏ chọn nó
            if (selectedClassId === item.class_id) {
              setSelectedClassId(null);
            } else {
              // Ngược lại, chọn lớp
              setSelectedClassId(item.class_id);
            }
          }}>
            <View
              style={[
                styles.classRow,
                selectedClassId === item.class_id ? styles.selectedRow : null, 
                // selectedClasses.some((cls) => cls.class_id === item.class_id) ? styles.selectedRow : null,
              ]}
            >
              <Text style={styles.classRowText}>{item.class_id}</Text>
              <Text style={styles.classRowText}>{item.class_name}</Text>
              <Text style={styles.classRowText}>{item.lecturer_name}</Text>
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
          onPress={clearSelectedClasses}
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
              <View style={styles.modalTableHeader}>
                <Text style={[styles.modalTableHeaderText, styles.modalColumn1]}>Mã Lớp</Text>
                <Text style={[styles.modalTableHeaderText, styles.modalColumn2]}>Loại Lớp</Text>
                <Text style={[styles.modalTableHeaderText, styles.modalColumn3]}>Tên Lớp</Text>
                <Text style={[styles.modalTableHeaderText, styles.modalColumn4]}>Giảng Viên</Text>
              </View>

              <FlatList
                data={availableClasses}
                keyExtractor={(item) => item.class_id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => addClassToSelection(item)}>
                    <View style={styles.modalTableRow}>
                      <Text style={[styles.modalTableCell, styles.modalColumn1]}>{item.class_id}</Text>
                      <Text style={[styles.modalTableCell, styles.modalColumn2]}>{item.class_type}</Text>
                      <Text style={[styles.modalTableCell, styles.modalColumn3]}>{item.class_name}</Text>
                      <Text style={[styles.modalTableCell, styles.modalColumn4]}>{item.lecturer_name}</Text>
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
