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
import { Checkbox } from 'expo-checkbox';
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "@/Context/AuthProvider";

interface Notification {
  id: number;
  message: string;
  status: string;
  from_user: number;
  to_user: number;
  type: string;
  sent_time: string;
  title_push_notification: string;
}

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]); // Lưu trữ các notification đã chọn
  const { token } = useAuth();

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://157.66.24.126:8080/it5023e/get_notifications", {
        token,
        index: 0,
        count: 10,
      });

      if (response.data.meta.code === "1000") {
        setNotifications(response.data.data);
      } else {
        setError(response.data.meta.message || "Error fetching notifications.");
      }
    } catch (err) {
      setError("Failed to fetch notifications. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Hàm xử lý khi checkbox thay đổi
  const handleCheckboxChange = (id: number) => {
    setSelectedNotifications(prevState => {
      if (prevState.includes(id)) {
        return prevState.filter(notificationId => notificationId !== id); // Bỏ chọn
      } else {
        return [...prevState, id]; // Chọn thêm
      }
    });
  };

  // Hàm gọi API để đánh dấu thông báo là đã đọc
  const markAsRead = async () => {
    try {
      for (const id of selectedNotifications) {
        const response = await axios.post(
          "http://157.66.24.126:8080/it5023e/mark_notification_as_read",
          {
            token,
            notification_id: id.toString(),
          }
        );
        if (response.data.meta.code === "1000") {
          console.log(`Notification ${id} marked as read`);
        } else {
          console.error("Error marking notification as read", response.data.meta);
        }
      }

      // Sau khi gửi API thành công, reset selectedNotifications
      setSelectedNotifications([]);
      fetchNotifications(); // Tải lại danh sách thông báo
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const isUnread = item.status === "UNREAD"; // Kiểm tra nếu thông báo chưa đọc
    return (
      <View style={[styles.notificationBox, isUnread && styles.unreadNotification]}>
        <Text style={[styles.title, isUnread && styles.unreadTitle]}>
          {item.title_push_notification}
        </Text>
        <Text style={[styles.message, isUnread && styles.unreadMessage]}>
          {item.message}
        </Text>
        <Text style={[styles.date, isUnread && styles.unreadDate]}>
          {new Date(item.sent_time).toLocaleDateString()} -{" "}
          {new Date(item.sent_time).toLocaleTimeString()}
        </Text>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={selectedNotifications.includes(item.id)} // Kiểm tra nếu id này có trong selectedNotifications
            onValueChange={() => handleCheckboxChange(item.id)} // Cập nhật trạng thái checkbox
          />
          <Text style={styles.checkboxLabel}>Chọn</Text>
        </View>
      </View>
    );
  };
  

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
        {selectedNotifications.length > 0 && (
          <TouchableOpacity
            style={styles.markAsReadButton}
            onPress={markAsRead}
          >
            <Text style={styles.markAsReadText}>Đánh dấu đã đọc</Text>
          </TouchableOpacity>
        )}
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
  unreadNotification: {
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  unreadTitle: {
    color: "#888", 
  },
  unreadMessage: {
    color: "#888", 
  },
  unreadDate: {
    color: "#bbb", 
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
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
  markAsReadButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 16,
    alignItems: "center",
  },
  markAsReadText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotificationsScreen;
