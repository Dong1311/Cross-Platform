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

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationBox}>
      <Text style={styles.title}>{item.title_push_notification}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>
        {new Date(item.sent_time).toLocaleDateString()} -{" "}
        {new Date(item.sent_time).toLocaleTimeString()}
      </Text>
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
