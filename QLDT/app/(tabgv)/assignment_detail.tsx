import {
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/Context/AuthProvider";
import axios from "axios";

const AssignmentDetail = () => {
  const params = useLocalSearchParams();
  const { token, assignmentsData } = useAuth();
  const [assignment, setAssignment] = useState({});
  const [surverRes, setSurverRes] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    let result = assignmentsData.find(
      (assignment) => assignment.id === Number(params.id)
    );
    setAssignment(result);
  }, []);

  const getSurveyResponse = async () => {
    try {
      const res = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_survey_response",
        { token, survey_id: params.id }
      );
      if (res.data.meta.code === "1000") {
        setSurverRes(res.data.data);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const openModal = (item) => {
    setModalVisible(true);
    setSelected(item);
  }


  const closeModal = () => {
    setModalVisible(false);
  }

  useEffect(() => {
    getSurveyResponse();
  }, []);

  const openURL = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  const renderSurverRes = ({ item }) => {
    return (
      <View style={styles.resContainer}>
        <View>
          <Text
            style={styles.resName}
          >{`${item.student_account.first_name} ${item.student_account.last_name}`}</Text>
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

  return (
    <SafeAreaView>
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{params.title}</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabgv)/create_assignment")}
        >
          <Ionicons name="create-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.label}>Hướng dẫn:</Text>
        <Text style={styles.desText}>{assignment.description}</Text>
        <TouchableOpacity onPress={() => openURL(assignment.file_url)}>
          <Text style={styles.desBtn}>Tài liệu hướng dẫn</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        <Text style={styles.label}>Danh sách bài làm</Text>

        <FlatList
          data={surverRes}
          keyExtractor={(item) => item.id + ""}
          renderItem={renderSurverRes}
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", marginTop: 10, fontSize: 16 }}
            >
              Chưa có sinh viên nào nộp bài 
            </Text>
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
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {selected.title || "Đơn xin nghỉ học"}
                </Text>
                <Text style={styles.modalsup}>
                  {selected?.student_account
                    ? `${selected.student_account.first_name} ${selected.student_account.last_name} - ${selected.student_account.student_id}`
                    : ""}
                </Text>
                <Text
                  style={styles.modalsup}
                >{`Ngày vắng: ${selected.absence_date}`}</Text>
                <View>
                  <Text style={styles.modalh1}>Bài làm</Text>
                  <Text style={{marginLeft:8}}>{selected.text_response}</Text>
                </View>
                <View style={{marginTop:8,}}>
                  <TouchableOpacity onPress={() => openURL(selected.file_url) }>
                    <Text style={styles.desBtn}>File bài làm</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBtn}>
                  <TouchableOpacity onPress={() => closeModal()}>
                    <Text style={styles.resBtn}>Đóng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRefuse(selected)}>
                    <Text style={styles.resBtn}>Từ chối</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAgree(selected)}>
                    <Text style={styles.resBtn}>Đồng ý</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
    </SafeAreaView>
  );
};

export default AssignmentDetail;

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
  descriptionContainer: {
    padding: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
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
  resBtn : {
    backgroundColor: "#d32f2f",
    color: "#FFF",
    padding: 8,
    borderRadius: 4,
  },

  modalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer : {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 4,
  },
  modalHeader : {
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: '#d32f2f',
    color: "#FFF",
    padding: 16,
    textAlign: "center",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  modalContent: {
    padding: 16,
  },
  modalTitle : {
    fontSize: 18,
    fontWeight: '700',
    textAlign: "center",
    marginBottom: 8,
  },
  modalsup : {
    opacity: 0.6,
    marginBottom: 4,
    textAlign: "center",
  },
  modalh1 : {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 8,
  },
  modalBtn : {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 32,
  },
  image : {
    width: 'auto',
    height: 120,
    resizeMode:'contain' ,
  },
  selectStatus : {
    borderBlockColor: '#d32f2f',
    borderBottomWidth: 1,
  }
});
