import { Ionicons } from '@expo/vector-icons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StatusBar, Text, TouchableOpacity, View, StyleSheet, FlatList, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const students = [
  {
    id: '1',
    name: 'Nguyễn Vân Anh',
    mssv: 20216666,
  },
  {
    id: '2',
    name: 'Nguyen van nam',
    mssv: 20219999,
  },
  {
    id: '3',
    name: 'Phạm Thị Hoa',
    mssv: 20215566,
  },
  {
    id: '4',
    name: 'Đinh Công Nông',
    mssv: 20215566,
  },
  {
    id: '5',
    name: 'Cù Thị Lan',
    mssv: 20215566,
  },
  
]



const Attendance = () => {
  const [attendance, setAttendance] = useState<string[]>([]);

  useEffect(()=>{
    const listIdStudent = students.map((item) => item.id);
    setAttendance(listIdStudent);
  },[])

  const handleStudentPress = (studentId : string) => {
    setAttendance((prev : string[]) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleSave = ({attendance} : {attendance : string[]}) => {
    Alert.alert('Xác nhận','Bạn có muốn lưu không ?',[
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Lưu',
          onPress: () =>{ console.log(attendance); router.back()},
          style: 'default',
        },
      ],
      {
        cancelable: true,
      }
    )
  }

  const renderStudent = ({item}) => {

    const isSelected = attendance.includes(item.id);

    return (
        <View style={styles.itemStudent}>
          <View style={styles.infoStudent}>
            <FontAwesome5 name="user-circle" size={40} color="#ddd"/>
            <View style={styles.groupInfo}>
              <Text style={styles.nameStudent} >{item.name}</Text>
              <Text style={styles.mssvStudent} >{item.mssv}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={()=>handleStudentPress(item.id)}>
            {
              isSelected 
              ? <FontAwesome5 name="check-circle" size={32} color="#699bf7" />
              : <FontAwesome5 name="ban" size={32} color="#CA1728" />
            }
          </TouchableOpacity>
        </View>
    )
  }

  return (
    <>
      <StatusBar backgroundColor="#d32f2f" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* header */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={()=>{router.back()}}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Điểm danh</Text>
        <TouchableOpacity onPress={()=> handleSave({attendance})}>
          <Text style={styles.navbtn}>Lưu</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>{`Danh sách lớp (${students.length})`}</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
      />
      </SafeAreaView>
    </>
  )
}

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
  text: {
    fontSize: 18,
    padding: 12,
    fontWeight: '500',
  },
  itemStudent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  infoStudent: {
    flexDirection: 'row',
  },
  groupInfo:{
    marginLeft: 12,
    gap: 4,
  },
  nameStudent: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mssvStudent: {
    color: '#888'
  },

})

export default Attendance