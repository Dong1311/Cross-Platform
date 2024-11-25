import {
  Alert,
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/Context/AuthProvider";
import axios from "axios";

interface StudentAccount {
  first_name: string;
  last_name: string;
  student_id: string;
}

interface Assignment {
  id: number;
  description: string;
  file_url?: string;
}

interface SurveyResponse {
  id: number;
  student_account: StudentAccount;
  submission_time: string;
  grade?: number;
  text_response?: string;
  file_url?: string;
}

const AssignmentDetail = () => {
  const params = useLocalSearchParams();
  const { token, assignmentsData } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [surveyRes, setSurveyRes] = useState<SurveyResponse[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<SurveyResponse | null>(null);
  const [grade, setGrade] = useState("");

  // Set initial assignment data
  useEffect(() => {
    if (assignmentsData && params.id) {
      const result = assignmentsData.find(
        (item) => item.id === Number(params.id)
      );
      setAssignment(result || null);
    }
  }, [assignmentsData, params.id]);

  const getSurveyResponse = async () => {
    try {
      const res = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_survey_response",
        { token, survey_id: params.id }
      );
      if (res.data.meta.code === "1000") {
        setSurveyRes(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching survey responses:", error);
      Alert.alert(
        "Lỗi",
        error?.response?.data?.meta?.message || "Không thể tải dữ liệu"
      );
    }
  };

  const validateGrade = (gradeValue) => {
    const trimmedGrade = gradeValue.trim();
    if (!trimmedGrade) {
      Alert.alert("Lỗi", "Vui lòng nhập số điểm");
      return false;
    }

    const numericScore = parseFloat(trimmedGrade);
    if (isNaN(numericScore)) {
      Alert.alert("Lỗi", "Điểm phải là một số hợp lệ.");
      return false;
    }

    if (numericScore < 0 || numericScore > 10) {
      Alert.alert("Lỗi", "Điểm phải nằm trong khoảng từ 0 đến 10.");
      return false;
    }

    return true;
  };

  const handleGrading = async (submissionId) => {
    if (!validateGrade(grade)) return;

    try {
      const res = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_survey_response",
        {
          token,
          survey_id: String(params.id),
          grade: {
            score: grade,
            submission_id: String(submissionId),
          },
        }
      );

      if (res.data.meta.code === "1000") {
        await handleSendNotifications();
        Alert.alert("Thành công", "Chấm điểm thành công");
        closeModal();
        getSurveyResponse(); // Refresh the data after grading
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        error?.response?.data?.meta?.message || "Không thể chấm điểm"
      );
      console.error("Error grading submission:", error);
    }
  };

  const handleSendNotifications = async () => {
    const formData = new FormData();
    formData.append("token", token);
    formData.append(
      "message",
      `Điểm bài tập của bạn bài ${params.title} là ${grade}.`
    );
    formData.append("toUser", selected.student_account.account_id);
    formData.append("type", "ASSIGNMENT_GRADE");

    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/send_notification",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      console.log(response.data)
      if (response.data.meta.code === "1000") {
        console.log(`Notification sent to user ${selected.student_account.account_id}`);
      } else {
        console.error(
          `Failed to send notification to ${selected.student_account.account_id}: ${response.data.meta.message}`
        );
      }
    } catch (error : any) {
      console.error(
        `Error sending notification to ${selected.student_account.account_id}:`,
        error.response?.data || error.message
      );
    }
  };

  const openModal = (item) => {
    setSelected(item);
    setGrade(""); // Reset grade when opening modal
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
    setGrade("");
  };

  useEffect(() => {
    if (params.id) {
      getSurveyResponse();
    }
  }, [params.id]);

  const openURL = async (url) => {
    if (!url) {
      Alert.alert("Lỗi", "Không có URL hợp lệ");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không thể mở liên kết này");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Lỗi", "Không thể mở liên kết");
    }
  };

  const renderSurveyRes = ({ item }) => {
    if (!item) return null;

    return (
      <View style={styles.resContainer}>
        <View>
          <Text style={styles.resName}>{`${
            item.student_account?.first_name || ""
          } ${item.student_account?.last_name || ""}`}</Text>
          <Text>{`Nộp lúc: ${new Date(
            item.submission_time
          ).toLocaleString()}`}</Text>
          <Text>{`Điểm: ${
            item.grade ? `${item.grade}` : "Chưa chấm điểm"
          }`}</Text>
        </View>

        <TouchableOpacity onPress={() => openModal(item)}>
          <Text style={styles.resBtn}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!assignment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Bài tập</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.emptyText}>Không tìm thấy bài tập</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>
          {params.title || "Chi tiết bài tập"}
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/edit_assignment",
              params: { id: params.id },
            })
          }
        >
          <Ionicons name="create-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.label}>Hướng dẫn:</Text>
        <Text style={styles.desText}>
          {assignment.description || "Không có hướng dẫn"}
        </Text>
        {assignment.file_url && (
          <TouchableOpacity onPress={() => openURL(assignment.file_url)}>
            <Text style={styles.desBtn}>Tài liệu hướng dẫn</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.list}>
        <Text style={styles.label}>Danh sách bài làm</Text>

        <FlatList
          data={surveyRes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderSurveyRes}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có sinh viên nào nộp bài</Text>
          }
        />
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <View>
              <Text style={styles.modalHeader}>Chi tiết</Text>
            </View>
            {selected && (
              <View style={styles.modalContent}>
                <Text style={styles.modalsup}>
                  {`${selected.student_account?.first_name || ""} ${
                    selected.student_account?.last_name || ""
                  } - ${selected.student_account?.student_id || ""}`}
                </Text>
                <Text style={styles.modalsup}>{`Điểm: ${
                  selected.grade ? `${selected.grade}` : "Chưa chấm điểm"
                }`}</Text>
                <View>
                  <Text style={styles.modalh1}>Bài làm</Text>
                  <Text style={{ marginLeft: 8 }}>
                    {selected.text_response || "Không có nội dung"}
                  </Text>
                </View>
                {selected.file_url && (
                  <View style={{ marginTop: 8 }}>
                    <TouchableOpacity
                      onPress={() => openURL(selected.file_url)}
                    >
                      <Text style={styles.desBtn}>File bài làm</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {!selected.grade && (
                  <View style={{ marginTop: 16 }}>
                    <Text style={styles.label2}>Điểm</Text>
                    <TextInput
                      value={grade}
                      onChangeText={setGrade}
                      style={styles.textInput}
                      placeholder="Nhập điểm"
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  </View>
                )}

                <View style={styles.modalBtn}>
                  <TouchableOpacity onPress={closeModal}>
                    <Text style={styles.resBtn}>Thoát</Text>
                  </TouchableOpacity>

                  {!selected.grade && (
                    <TouchableOpacity
                      onPress={() => handleGrading(selected.id)}
                    >
                      <Text style={styles.resBtn}>Chấm điểm</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
    flex: 1,
    textAlign: "center",
  },
  descriptionContainer: {
    padding: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label2: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  desText: {
    fontSize: 16,
    color: "#666",
    padding: 8,
  },
  desBtn: {
    backgroundColor: "#ccc",
    padding: 8,
    marginLeft: 8,
    width: "36%",
    borderRadius: 4,
  },
  list: {
    padding: 8,
    flex: 1,
  },
  resContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 4,
    width: "98%",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resBtn: {
    backgroundColor: "#d32f2f",
    color: "#FFF",
    padding: 8,
    borderRadius: 4,
  },
  textInput: {
    height: 40,
    borderColor: "#B30000",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
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
    maxHeight: "80%",
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
  },
  modalh1: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 8,
  },
  modalsup: {
    opacity: 0.6,
    marginBottom: 4,
    textAlign: "center",
  },
  modalBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 32,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default AssignmentDetail;
