import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import axios from "axios";
import { useAuth } from "@/Context/AuthProvider";


const Home = () => {
  // State để quản lý danh sách lớp học và tìm kiếm
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading
  const { token, role, accountId, setClassList,classList } = useAuth()  as AuthContextType;

  interface AuthContextType {
    token: string;
    role: string;
    accountId: string;
    setClassList: React.Dispatch<React.SetStateAction<ClassItem[]>>;
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

  // Hàm để lấy dữ liệu từ API
  const fetchClasses = async () => {
    try {
      const res = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_class_list",
        {
          token,
          role,
          account_id: accountId,
          pageable_request: null,
        }
      );

      if (res.status === 200) {
        setClassList(res.data.data.page_content)
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setLoading(false);
    }
  };

  // useEffect để gọi hàm fetchClasses khi component được render lần đầu
  useEffect(() => {
    fetchClasses();
  }, []);


  // Hàm để render từng phần tử trong danh sách lớp
  const renderItem = ({ item }: { item: ClassItem }) => (
    <TouchableOpacity style={styles.classContainer}>
      <Link
        href={{
          pathname: "/class_detail",
          params:  {
            class_id: item.class_id,
            class_name: item.class_name,
            attached_code: item.attached_code,
            class_type: item.class_type,
            lecturer_name: item.lecturer_name,
            student_count: item.student_count,
            start_date: item.start_date,
            end_date: item.end_date,
            status: item.status
          },
        }}
        style={{ width: "100%" }}
      >
        <View style={styles.classBody}>
          <View
            style={[styles.classIcon, { backgroundColor: getRandomColor() }]}
          >
            <Text style={styles.classCode}>{item.class_type}</Text>
          </View>
          <View style={styles.classInfo}>
            <Text style={styles.classTitle}>{item.class_name}</Text>
            <Text style={styles.classTeacher}>{item.lecturer_name}</Text>
          </View>
        </View>
      </Link>
    </TouchableOpacity>
  );

  // Hàm để sinh màu ngẫu nhiên cho các biểu tượng lớp
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
      {/* Phần tìm kiếm */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={require("../../assets/images/user.png")}
          />
        </View>
        <Text style={styles.headerTitle}>Nhóm</Text>
        <Link href="/create_class">
          <Icon name="menu" size={30} color="black" />
        </Link>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Danh sách lớp học */}
      <Text style={styles.sectionTitle}>Lớp học</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={
            classList
              ? classList.filter((cls) =>
                  cls.class_name.toLowerCase().includes(search.toLowerCase())
                )
              : []
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.class_id}
        />

      )}

      {/* Thanh điều hướng dưới */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="notifications" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Hoạt động</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}
          onPress={()=>router.push('/list-chat')}>
          <Icon name="chat" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Trò chuyện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="group" size={24} color="purple" />
          <Text style={[styles.tabBarLabel, { color: "purple" }]}>Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton} onPress={() => router.push('/user-info-gv')}>
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
    backgroundColor: "white",
  },
  avatarContainer: {
    backgroundColor: "orange",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    marginTop: 50,
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
  classList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  classBody: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    alignItems: "center",
    width: "100%",
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
    flex: 1,
    alignItems: "center",
  },
  tabBarLabel: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default Home;
