import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useRouter,  useLocalSearchParams   } from "expo-router";  
import Feature from '@/components/Feature'
import { useAuth } from '@/Context/AuthProvider';

const ClassDetail = () => {

  const infoClass = useLocalSearchParams();
  const {setClassId} = useAuth();

  setClassId(infoClass.class_id);

  return(
    <>
      <StatusBar backgroundColor="#d32f2f" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={()=>{router.back()}}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{infoClass.class_name}</Text>
        <TouchableOpacity>
          <Text style={styles.navbtn}></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Feature iconName='document-text' featureName='Tài liệu' feature='/documents-class'/>
        <Feature iconName='hand-right' featureName='Điểm danh' feature='/attendance'/>
        <Feature iconName='mail-unread' featureName='Danh sách xin vắng' feature='/(tabgv)/absence_list'/>
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
    paddingHorizontal: 32,
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
})