import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuth } from "@/Context/AuthProvider";
import { Link } from "expo-router";

interface ClassItem {
  class_id: string;
  class_name: string;
  attached_code: string | null;
  class_type: string;
  lecturer_name: string;
  student_count: number;
  start_date: string;
  end_date: string;
  status: string;
}

const Home = () => {
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0); // Trạng thái lưu trữ số thông báo chưa đọc
  const router = useRouter();
  const { token, role, accountId, avatar } = useAuth() as AuthContextType;
  console.log(unreadCount)
  interface AuthContextType {
    token: string;
    role: string;
    accountId: string;
    avatar: string;
  }

  useEffect(() => {
    fetchClassList();
    fetchUnreadNotifications(); // Gọi API để lấy số thông báo chưa đọc
  }, []);


  const handleClassPress = (classId: string) => {
    router.push({ pathname: "/class_detail-sv", params: { classId } });
  };

  const fetchClassList = async () => {
    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_class_list",
        {
          token,
          role,
          account_id: accountId,
          pageable_request: {
            page: "0",
            page_size: "5",
          },
        }
      );
      if (response.data.meta.code === "1000") {
        setClasses(response.data.data.page_content);
      } else {
        console.error("Failed to fetch classes: Code not 1000", response.data.meta);
      }
    } catch (error) {
      console.error("Error fetching class list:", error);
    }
  };

  // Hàm gọi API để lấy số lượng thông báo chưa đọc
  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_unread_notification_count",
        { token }
      );
      if (response.data.meta.code === "1000") {
        console.log(response.data.data);
        setUnreadCount(response.data.data); // Cập nhật số thông báo chưa đọc
      } else {
        console.error("Failed to fetch unread notifications", response.data.meta);
      }
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  };

  const renderItem = ({ item }: { item: ClassItem }) => (
    <TouchableOpacity onPress={() => handleClassPress(item.class_id)}>
      <View style={styles.classContainer}>
        <View style={[styles.classIcon, { backgroundColor: getRandomColor() }]}>
          <Text style={styles.classCode}>{item.class_type}</Text>
        </View>
        <View style={styles.classInfo}>
          <Text style={styles.classTitle}>{item.class_name}</Text>
          <Text style={styles.classTeacher}>{item.lecturer_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getRandomColor = () => {
    const colors = [
      "#FF5252",
      "#FF9800",
      "#3F51B5",
      "#9C27B0",
      "#00BCD4",
      "#009688",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/user-info')}>
          <Image 
            source={avatar ? { uri: avatar } : require("../../assets/images/user.png")} 
            style={styles.avatarImage}
            alt="Avatar"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhóm</Text>
        <Link href="/class_register">
          <Icon name="menu" size={30} color="black" />
        </Link>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Text style={styles.sectionTitle}>Lớp học</Text>
      <FlatList
        data={classes.filter((cls) =>
          cls.class_name.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.class_id}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Không có lớp nào</Text>}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => router.push("/(tabsv)/notifications_screen")}
        >
          <View style={styles.notificationContainer}>
            <Icon name="notifications" size={24} color="black" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.tabBarLabel}>Hoạt động</Text>
        </TouchableOpacity>

        {/* Các tab khác */}
        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => router.push("/list-chat")}
        >
          <Icon name="chat" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Trò chuyện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="group" size={24} color="purple" />
          <Text style={[styles.tabBarLabel, { color: "purple" }]}>Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => router.push("/(tabsv)/assignment_sv")}
        >
          <Icon name="assignment" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Bài tập</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarButton} onPress={() => router.push('/user-info')}>
          <Icon name="person" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 20,
    backgroundColor: "white",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginHorizontal: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  classContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    alignItems: "center",
    width: "96%",
    margin: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  classIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  classCode: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  classTeacher: {
    color: "gray",
    fontSize: 14,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  tabBarButton: {
    alignItems: "center",
    flex: 1,
  },
  tabBarLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  notificationContainer: {
    position: "relative",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
    color: "gray",
  },
});

export default Home;
