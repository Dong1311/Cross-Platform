import { Ionicons } from '@expo/vector-icons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StatusBar, Text, TouchableOpacity, View, StyleSheet, FlatList, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/Context/AuthProvider';
import axios from 'axios';


const Attendance = () => {
  const [attendance, setAttendance] = useState<string[]>([]);
  const [students, setStudents] = useState([])
  const params = useLocalSearchParams();
  const {classId, token, accountId, role} = useAuth();
    const getStudents = async () => {
    try {
      const res = await axios.post('http://157.66.24.126:8080/it5023e/get_class_info', {token,role, account_id : accountId, class_id : classId})
      if(res.status === 200) {
        setStudents(res.data.data.student_accounts)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getStudents();
  },[])


  const handleStudentPress = (studentId : string) => {
    setAttendance((prev : string[]) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleSendList = async () => {
    try {
      const res = await axios.post('http://157.66.24.126:8080/it5023e/take_attendance',
         {token, class_id: classId, date : new Date(Date.now()).toISOString(), attendance_list : attendance})
      console.log(res.data)
      if(res.data.meta.code === "1000") {
        router.back()
      }else {
        alert('Error: ' + res.data.meta.message)
      }
   } catch (error) {
      console.log(error)
   } 
  }

  const handleSave = ({attendance} : {attendance : string[]}) => {
    Alert.alert('Xác nhận','Bạn có muốn lưu không ?',[
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Lưu',
          onPress: async () => {
            await handleSendList(); // Gửi danh sách điểm danh
            await handleSendNotifications(); // Gửi thông báo sau khi điểm danh
          },
          style: 'default',
        },
      ],
      {
        cancelable: true,
      }
    )
  }
  

  const handleSendNotifications = async () => {
    try {
      const today = new Date();
      const formattedDate = `${today.getDate()}/${
        today.getMonth() + 1
      }/${today.getFullYear()}`;
  
      if (!token || !classId) {
        console.error("Token or classId is missing!");
        return;
      }
  
      if (!attendance.length) {
        alert("Danh sách vắng mặt trống!");
        return;
      }
  
      // Tìm `account_id` tương ứng với mỗi `student_id`
      const accountIds = attendance
        .map((studentId) => {
          const student = students.find((s) => s.student_id === studentId);
          return student?.account_id; // Trả về account_id hoặc undefined nếu không tìm thấy
        })
        .filter((id) => id); // Lọc ra các giá trị hợp lệ (loại bỏ undefined)
  
      if (!accountIds.length) {
        console.error("No valid account IDs found!");
        return;
      }
  
      for (const accountId of accountIds) {
        const formData = new FormData();
        formData.append("token", token);
        formData.append(
          "message",
          `Bạn đã vắng mặt lớp học ${classId} vào ngày ${formattedDate}.`
        );
        formData.append("toUser", accountId);
        formData.append("type", "ABSENCE");
  
        console.log("Sending notification to account ID:", accountId);
  
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
  
          if (response.data.meta.code === "1000") {
            console.log(`Notification sent to user ${accountId}`);
          } else {
            console.error(
              `Failed to send notification to ${accountId}: ${response.data.meta.message}`
            );
          }
        } catch (error) {
          console.error(
            `Error sending notification to ${accountId}:`,
            error.response?.data || error.message
          );
        }
      }
  
      alert("Đã gửi thông báo đến tất cả sinh viên vắng mặt.");
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  };
  
  

  const renderStudent = ({item}) => {

    const isSelected = attendance.includes(item.student_id);

    return (
        <View style={styles.itemStudent}>
          <View style={styles.infoStudent}>
            <FontAwesome5 name="user-circle" size={40} color="#ddd"/>
            <View style={styles.groupInfo}>
              <Text style={styles.nameStudent} >{item.first_name} {item.last_name}</Text>
              <Text style={styles.mssvStudent} >{item.student_id}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={()=>handleStudentPress(item.student_id)}>
            {
              isSelected 
              ? <FontAwesome5 name="ban" size={32} color="#CA1728" />
              : <FontAwesome5 name="check-circle" size={32} color="#699bf7" />
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
        keyExtractor={(item) => item.account_id}
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