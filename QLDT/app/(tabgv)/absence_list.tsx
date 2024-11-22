import { Alert, FlatList, Image, Linking, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import axios from 'axios'
import { useAuth } from "@/Context/AuthProvider";
import { Picker } from '@react-native-picker/picker'
import { Link } from '@react-navigation/native'

const AbsenceList = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Partial<absenceData>>({});
  const [absenceList, setAbsenceList] = useState([]);
  const {token, classId} = useAuth() as AuthContextType;
  const [status, setStatus] = useState('PENDING')

  interface absenceData {
    id: number;
    student_account: StudentAccount;
    absence_date: Date;
    title: string;
    reason: string;
    status: string;
    file_url: null;
  }

  interface StudentAccount {
    account_id: number;
    last_name: string;
    first_name: string;
    email: string;
    student_id: number;
  }

  interface AuthContextType {
    token: string;
    classId: string;
  }

  const fetchAbsenceList = async () => {
    try {
      const res = await axios.post('http://157.66.24.126:8080/it5023e/get_absence_requests', {token, class_id : classId, status, pageable_request : {
        "page" : "0",
        "page_size" : "10"
    }});

      if(res.status === 200) {
        setAbsenceList(res.data.data.page_content)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const openModal = (item : absenceData) => {
    setModalVisible(true);
    setSelected(item);
  }


  const closeModal = () => {
    setModalVisible(false);
  }

  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  const handleAgree = async (selected : absenceData) => {
    try {
      const res = await axios.post('http://157.66.24.126:8080/it5023e/review_absence_request', {token, request_id : selected.id, status: 'ACCEPTED'});
      if(res.status === 200) {
        Alert.alert('Hoàn Thành', 'đồng ý đơn xin nghỉ thành công')
        fetchAbsenceList();
        setModalVisible(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Thất bại', 'có lỗi sảy ra, hãy thử lại')
    }
    
  }
  
  const handleRefuse = async (selected : absenceData) => {
    try {
      const res = await axios.post('http://157.66.24.126:8080/it5023e/review_absence_request', {token, request_id : selected.id, status: 'REJECTED'});
      if(res.status === 200) {
        Alert.alert('Hoàn Thành', 'Từ chối đơn xin nghỉ thành công')
        fetchAbsenceList();
        setModalVisible(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Thất bại', 'có lỗi sảy ra, hãy thử lại')
    }
  }

  useEffect(() => {
    fetchAbsenceList();
  },[status])

  const AbsenceItem = ({item} : {item : absenceData}) => {
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>
            { item.title || 'Đơn xin nghỉ học' } 
          </Text>
          <Text style={styles.itemsup}>{`${item.student_account.first_name} ${item.student_account.last_name} - ${item.student_account.student_id}`}</Text>
          <Text style={styles.itemsup}>{`Ngày vắng: ${item.absence_date}`}</Text>
        </View>

        <TouchableOpacity onPress={() => openModal(item)}>
          <Text style={styles.btn}>Chi tiết</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <StatusBar backgroundColor="#d32f2f" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Danh sách xin vắng</Text>
          <TouchableOpacity>
            <Text style={styles.navbtn}></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectStatus}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
          >
            <Picker.Item label="Chờ phê duyệt" value="PENDING" />
            <Picker.Item label="Đã đồng ý" value="ACCEPTED" />
            <Picker.Item label="Từ chối" value="REJECTED" />
          </Picker>
        </View>

        <FlatList
          data={absenceList}
          keyExtractor={(item) => item.id +''}
          renderItem={AbsenceItem}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 10, fontSize: 16 }}>
              Không có thư xin nghỉ nào
            </Text>
          }
        />

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
                  <Text style={styles.modalh1}>Lý do</Text>
                  <Text>{selected.reason}</Text>
                </View>
                <View>
                  <Text style={styles.modalh1}>Minh chứng</Text>
                  <TouchableOpacity onPress={() => openURL(selected.file_url) }>
                    <Text style={styles.btn2}>Xem minh chứng</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBtn}>
                  <TouchableOpacity onPress={() => closeModal()}>
                    <Text style={styles.btn}>Đóng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRefuse(selected)}>
                    <Text style={styles.btn}>Từ chối</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAgree(selected)}>
                    <Text style={styles.btn}>Đồng ý</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

export default AbsenceList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: "#d32f2f",
  },
  navTitle: {
    fontSize: 18,
    color: "white",
  },
  navbtn:{
    fontSize: 18,
    color: "white",
    padding: 4,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle : {
    fontSize: 20,
    fontWeight:'700',
    marginBottom: 8,
  },
  itemsup : {
    opacity: 0.6,
    marginBottom: 4,
  },
  btn : {
    fontWeight: '700',
    backgroundColor: '#d32f2f',
    padding: 8,
    color: '#fff',
    borderRadius: 4,
  },
  btn2 : {
    backgroundColor: '#ccc',
    padding: 8,
    width: '40%',
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
})