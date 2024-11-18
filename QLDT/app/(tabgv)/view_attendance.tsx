import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import axios from "axios";
import { useAuth } from "@/Context/AuthProvider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const view_attendance = () => {
  const [date, setDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [listStudent, setListStudent] = useState([]);
  const [msgError, setMsgError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState();
  const { classId, token, accountId, role } = useAuth();

  const getStudents = async () => {
    try {
      const res = await axios.post(
        "http://160.30.168.228:8080/it5023e/get_class_info",
        { token, role, account_id: accountId, class_id: classId }
      );
      if (res.status === 200) {
        setStudents(res.data.data.student_accounts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAttendanceData = async () => {
    try {
      const res = await axios.post(
        "http://160.30.168.228:8080/it5023e/get_attendance_list",
        { token, class_id: classId, date }
      );
      if (res.status === 200) {
        setAttendance(res.data.data.attendance_student_details);
        setMsgError("");
      }
    } catch (error) {
      setAttendance([]);
      setMsgError(error.response.data.data);
      console.log("Error", error.response.data.meta.message);
    }
  };

  const handleChangeStatus = async (status) => {
    try {
      const res = await axios.post(
        "http://160.30.168.228:8080/it5023e/set_attendance_status",
        { token, attendance_id: selectedStudent.attendance_id , status : status }
      );
      if(res.data.meta.code === 1000) {
        getAttendanceData()
        alert('Chỉnh sửa thành công')
        setModalVisible(false)
      }
    } catch (error) {
      console.log(error.response.data);
      alert(error.response.data.meta.message)
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    getAttendanceData();
  }, [date]);

  useEffect(() => {
    let templist;
    if (attendance.length > 0) {
      templist = students.map((student) => ({
        ...student,
        ...attendance.find((att) => att.student_id === student.student_id),
      }));
    } else {
      templist = [];
    }
    setListStudent(templist);
  }, [attendance]);

  const openModal = (item) => {
    setModalVisible(true);
    setSelectedStudent(item)
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const renderStudent = ({ item }) => {
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
                  item.status === "PRESENT"
                    ? "green"
                    : item.status === "UNEXCUSED_ABSENCE"
                    ? "red"
                    : item.status === "EXCUSED_ABSENCE"
                    ? "#e5b55f"
                    : "black",
              }}
            >
              {item.status}
            </Text>
          </View>
        </View>
        {/* Nút hiển thị menu */}
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
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Danh sách điểm danh</Text>
        <TouchableOpacity>
          <Text style={styles.navbtn}></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerDate}>
        <Text style={styles.infoDate}>
          Điểm danh ngày:{" "}
          {date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>

        <TouchableOpacity style={styles.btndate} onPress={showDatepicker}>
          <Text>chọn ngày</Text>
        </TouchableOpacity>
      </View>

      <View>
        {msgError ? (
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginTop: 8,
              color: "#d32f2f",
            }}
          >
            {msgError}
          </Text>
        ) : (
          <FlatList
            data={listStudent}
            keyExtractor={(item) => item.account_id}
            renderItem={renderStudent}
          />
        )}
      </View>

      <Modal
        transparent={true}
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
              <TouchableOpacity onPress={() => handleChangeStatus('EXCUSED_ABSENCE')}>
                <Text style={styles.modalbtn}>EXCUSED_ABSENCE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleChangeStatus('UNEXCUSED_ABSENCE')}>
                <Text style={styles.modalbtn}>UNEXCUSED_ABSENCE</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => closeModal()}>
              <Text style={styles.btnclosed}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default view_attendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#d32f2f",
  },
  navTitle: {
    fontSize: 18,
    color: "white",
  },
  navbtn: {
    fontSize: 18,
    color: "white",
    padding: 4,
  },
  containerDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 6,
    marginBottom: 6,
  },
  btndate: {
    padding: 8,
    backgroundColor: "#ccc",
  },
  infoDate: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  itemStudent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  infoStudent: {
    flexDirection: "row",
  },
  groupInfo: {
    marginLeft: 12,
    gap: 4,
  },
  nameStudent: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mssvStudent: {
    color: "#888",
  },
  menu: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  changeStatusButton: {
    marginTop: 10,
    backgroundColor: "#d32f2f",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  changeStatusButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 4,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "700",
    backgroundColor: "#d32f2f",
    color: "#FFF",
    padding: 16,
    textAlign: "center",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  modalContent: {
    padding: 16,
    gap: 8,
  },
  modalbtn: {
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#ccc",
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnclosed: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    width: 80,
    textAlign: "center",
    alignSelf: "flex-end",
    padding: 10,
    marginVertical: 16,
    marginRight: 16,
    borderRadius: 6,
  },
});
