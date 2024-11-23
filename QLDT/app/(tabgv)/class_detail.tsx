import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import {  useLocalSearchParams   } from "expo-router";  
import Feature from '@/components/Feature'
import { useAuth } from '@/Context/AuthProvider';


const ClassDetail = () => {
  
  const params = useLocalSearchParams();
  const [infoClass, setInfoClass] = useState<Partial<ClassItem>>({});
  const {setClassId, classList } = useAuth() as AuthContextType;
  interface AuthContextType {
    token: string;
    role: string;
    accountId: string;
    setClassList: React.Dispatch<React.SetStateAction<ClassItem[]>>;
    setClassId: React.Dispatch<React.SetStateAction<string>>;
    classList: ClassItem[];
  }

  interface ClassItem {
    class_id: string;
    class_name: string;
    attached_code: string;
    class_type: string;
    lecturer_name: string;
    student_count: number;
    start_date: string;
    end_date: string;
    status: string;
  }

  useEffect(() => {
    if (params.class_id) {
      setClassId(params.class_id as string);
      const selectedClass = classList.find(
        (classItem) => classItem.class_id === params.class_id
      );
      
      if (selectedClass) {
        setInfoClass(selectedClass);
      }
    }
  }, [infoClass.class_id, classList]);

  return(
    <>
      <StatusBar backgroundColor="#d32f2f" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={()=>{router.back()}}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{infoClass.class_name}</Text>
        <TouchableOpacity onPress={() => router.push({pathname:'/(tabgv)/edit_class', params: infoClass })}>
          <Ionicons  name='create-outline' size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Feature iconName='folder-open' featureName='Tài liệu' feature='/documents-class'/>
        <Feature iconName='hand-right' featureName='Điểm danh' feature='/attendance'/>
        <Feature iconName='mail-unread' featureName='Danh sách xin vắng' feature='/(tabgv)/absence_list'/>
        <Feature iconName='document-text' featureName='Danh sách điểm danh' feature='/view_attendance'/>
        <Feature iconName='library' featureName='Bài tập' feature='/assignment'/>
      </View>

      </SafeAreaView>
    </>
  )
}

export default ClassDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
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
  body: {
    marginTop: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  }
})