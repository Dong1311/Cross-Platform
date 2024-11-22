import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AssignmentCard from '@/components/AssignmentCard';
import axios from 'axios';
import { useAuth } from "@/Context/AuthProvider";

const assignment = () => {
  const { classId, token } = useAuth() as AuthContextType;
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State cho trạng thái làm mới

  interface AuthContextType {
    token: string;
    classId: string;
  }

  const getAssignmentList = async () => {
    try {
      const res = await axios.post('http://157.66.24.126:8080/it5023e/get_all_surveys', { token, class_id: classId });
      if (res.data.meta.code === '1000') {
        const result = res.data.data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setAssignmentsData(result);
      }
    } catch (error: any) {
      console.log(error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  // Hàm làm mới danh sách
  const onRefresh = async () => {
    setRefreshing(true);
    await getAssignmentList();
    setRefreshing(false);
  };

  useEffect(() => {
    getAssignmentList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh điều hướng */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => { router.back(); }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Bài tập</Text>
        <TouchableOpacity onPress={() => router.push("/(tabgv)/create_assignment")}>
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh sách bài tập */}
      <FlatList
        data={assignmentsData}
        keyExtractor={(item) => "" + item.id}
        renderItem={({ item }) => <AssignmentCard item={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 10, fontSize: 16 }}>
            Không có bài tập nào
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default assignment;

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
});
