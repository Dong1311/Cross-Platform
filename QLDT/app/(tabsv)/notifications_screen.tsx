import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface Notification {
  id: number;
  subject: string;
  message: string;
  date: string;
}

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // fetchNotifications();

    // Mock data for notifications
    const mockNotifications: Notification[] = [
      {
        id: 1,
        subject: "Phân tích và thiết kế hệ thống",
        message: "Đã có điểm cuối kỳ môn Phân tích và thiết kế hệ thống",
        date: "10/07/2024",
      },
      {
        id: 2,
        subject: "Phân tích và thiết kế hệ thống",
        message: "Đã có điểm giữa kỳ môn Phân tích và thiết kế hệ thống",
        date: "09/07/2024",
      },
      {
        id: 3,
        subject: "Thuật toán ứng dụng",
        message: "Đã có điểm môn quá trình Thuật toán ứng dụng",
        date: "05/07/2024",
      },
      {
        id: 4,
        subject:
          "Hội thảo tuyển dụng thực tập sinh của Tập Đoàn Sumitomo Electric",
        message:
          "Tham gia hội thảo tuyển dụng thực tập sinh của Tập Đoàn Sumitomo Electric",
        date: "24/06/2024",
      },
    ];

    // Simulate fetching data
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000); // Simulate delay
  }, []);

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationBox}>
      <Text style={styles.title}>{item.subject}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!notifications.length)
    return <Text style={styles.noData}>No notifications available</Text>;

  return (
    <>
      <StatusBar backgroundColor="#d32f2f" barStyle="light-content" />
      <SafeAreaView style={styles.containerAll}>
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.arrow}
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.navTitleContainer}>
            <Text style={styles.navTitle}>Thông báo</Text>
          </View>
        </View>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.container}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  arrow: {
    position: "absolute",
    marginLeft: 20,
  },
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#d32f2f",
  },
  navTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  navTitle: {
    fontSize: 18,
    color: "white",
  },
  notificationBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
  date: {
    textAlign: "right",
    color: "#888",
    marginTop: 8,
    fontSize: 12,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  noData: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
  },
});

export default NotificationsScreen;
