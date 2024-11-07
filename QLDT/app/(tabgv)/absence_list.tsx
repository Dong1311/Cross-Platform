import { FlatList, Image, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const absenceList = [
  {
    id : '1' ,
    title : 'Đơn xin phép vắng học',
    name : 'Nguyễn Văn An',
    mssv : '20216666',
    class : '145890',
    date : '2024-10-30',
    cause : ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit totam voluptas quaerat officia quod atque facere mollitia, libero eveniet hic eius sed vero sint voluptatum blanditiis est dolorum, labore ad.',
    image : 'https://cdn.tuoitre.vn/thumb_w/480/471584752817336320/2023/4/1/gia-mao-giay-nhap-vien-bv-cho-ray-16803195393581042405086.jpeg'
  },
  {
    id : '2' ,
    title : 'Đơn xin phép vắng học',
    name : 'Nguyễn Văn An',
    mssv : '20216666',
    class : '145890',
    date : '2024-10-30',
    cause : 'lí do em xin nghỉ buổi học là do em bị ốm',
    image : 'https://cdn.lawnet.vn/uploads/phapluat/NHUTHAO/con-om.jpg'
  },
]

const AbsenceList = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState('');


  const openModal = (item) => {
    setModalVisible(true);
    setSelected(item);
  }


  const closeModal = () => {
    setModalVisible(false);
  }

  const handleAgree = (selected) => {
    console.log('Agree' + selected.id);
    setModalVisible(false);
  }
  
  const handleRefuse = (selected) => {
    console.log('Refuse' + selected.id);
    setModalVisible(false);
  }

  const AbsenceItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemsup}>{`${item.name} - ${item.mssv}`}</Text>
          <Text style={styles.itemsup}>{`Ngày vắng: ${item.date}`}</Text>
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
        <TouchableOpacity onPress={()=>{router.back()}}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Danh sách xin vắng</Text>
        <TouchableOpacity>
          <Text style={styles.navbtn}></Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={absenceList}
        keyExtractor={(item) => item.id}
        renderItem={AbsenceItem}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBg}>
          <View style= {styles.modalContainer}>
            <View >
              <Text style= {styles.modalHeader}>Chi tiết</Text>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selected.title}</Text>
              <Text style={styles.modalsup}>{`${selected.name} - ${selected.mssv}`}</Text>
              <Text style={styles.modalsup}>{`Ngày vắng: ${selected.date}`}</Text>
              <View>
                <Text style={styles.modalh1}>Lý do</Text>
                <Text>{selected.cause}</Text>
              </View>
              <View>
                <Text style={styles.modalh1}>Minh chứng</Text>
                <Image style={styles.image} source={{uri : selected.image }}/>
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
  )
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
  }
})