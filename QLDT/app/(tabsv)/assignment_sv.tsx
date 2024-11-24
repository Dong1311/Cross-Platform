import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "@/Context/AuthProvider";
import AssignmentCard from "@/components/AssignmentCard";

// Định nghĩa kiểu Assignment
interface Assignment {
  id: number;
  title: string;
  dueTime: string;
  className: string;
  classLogo: string;
  points?: number;
  date: string; // Sử dụng Date cho trường date
  completed: boolean;
}

// Định nghĩa type cho object assignmentsData
interface AssignmentsData {
  upcoming: Assignment[];
  overdue: Assignment[];
  completed: Assignment[];
}
const API_URL = "https://670fad74a85f4164ef2b6e89.mockapi.io/ehust/assignments";
const AssignmentApp = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const {token} = useAuth()

  const [assignmentsData, setAssignmentsData] = useState<AssignmentsData>({
    upcoming: [],
    overdue: [],
    completed: [],
  });
  // Hàm để chỉ lấy phần ngày mà không quan tâm đến giờ, phút, giây
  const getDateWithoutTime = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day);
  };
  // Hàm fetch API và phân loại dữ liệu
  const fetchAssignments = async () => {
    try {
      const response = await axios.post('http://157.66.24.126:8080/it5023e/get_student_assignments', {token});

      const now = getDateWithoutTime(new Date()); // Ngày hiện tại không có giờ, phút, giây

      // Mảng tạm để phân loại bài tập
      const tempUpcoming: Assignment[] = [];
      const tempOverdue: Assignment[] = [];
      const tempCompleted: Assignment[] = [];

      // Phân loại bài tập
      response.data.data.forEach((assignment) => {
        const assignmentDate = getDateWithoutTime(new Date(assignment.deadline)); // Chuyển date từ API

        if (assignment.is_submitted) {
          tempCompleted.push(assignment);
        } else if (assignmentDate < now) {
          tempOverdue.push(assignment);
        } else {
          tempUpcoming.push(assignment);
        }
      });

      // Cập nhật state với object assignmentsData
      setAssignmentsData({
        upcoming: tempUpcoming,
        overdue: tempOverdue,
        completed: tempCompleted,
      });

    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  // Gọi fetch API khi component được mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  const renderAssignments = (assignments: Assignment[]) => {
    if (assignments.length === 0) {
      return <Text style={styles.noAssignments}>Không có bài tập nào</Text>;
    }


    // Nhóm bài tập theo ngày
    const groupedAssignments: { [key: string]: Assignment[] } = {};
    assignments.forEach((assignment) => {
      const assignmentDate = new Date(assignment.deadline); // Chuyển đổi thành đối tượng Date
      const dateString = assignmentDate.toLocaleDateString(); // Gọi toLocaleDateString() sau khi chuyển đổi
      if (!groupedAssignments[dateString]) {
        groupedAssignments[dateString] = [];
      }
      groupedAssignments[dateString].push(assignment);
    });

    return Object.keys(groupedAssignments).map((date) => (
      <View key={date}>
        <Text style={styles.dateHeader}>{date}</Text>
       
          {groupedAssignments[date].map((assignment) => (
             <TouchableOpacity style={styles.card} onPress={()=> router.push({
              pathname: '/submission',
              params: assignment,
             })}>
             <View style={styles.iconContainer}>
               <Text style={styles.iconText}>{new Date(assignment.deadline).getDate()}</Text>
             </View>
             <View style={styles.textContainer}>
               <Text style={styles.title}>{assignment.title}</Text>
               <Text style={styles.subText}>{`Đến hạn lúc ${new Date(assignment.deadline).toLocaleTimeString().slice(0,5)}`}</Text>
               <Text style={styles.subText}>{`Lớp ${assignment.class_id}`}</Text>
             </View>
           </TouchableOpacity>
          ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title2}>Bài tập</Text>
        {/* Tabs */}
        <View style={styles.tabs}>
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" ? styles.activeTab : {},
            ]}
            onPress={() => setActiveTab("upcoming")}
          >
            Sắp tới
          </Text>
          <Text
            style={[
              styles.tabText,
              activeTab === "overdue" ? styles.activeTab : {},
            ]}
            onPress={() => setActiveTab("overdue")}
          >
            Quá hạn
          </Text>
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" ? styles.activeTab : {},
            ]}
            onPress={() => setActiveTab("completed")}
          >
            Đã hoàn thành
          </Text>
        </View>
      </View>

      {/* Assignment List */}
      <ScrollView style={styles.assignmentList}>
        {activeTab === "upcoming" &&
          renderAssignments(assignmentsData.upcoming)}
        {activeTab === "overdue" && renderAssignments(assignmentsData.overdue)}
        {activeTab === "completed" &&
          renderAssignments(assignmentsData.completed)}
      </ScrollView>

      {/* Thanh điều hướng dưới */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarButton}
        onPress={()=>router.push('/(tabsv)/notifications_screen')}>
          <Icon name="notifications" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Hoạt động</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}
        onPress={()=>router.push('/(tabsv)/leave_request')}>
          <Icon name="chat" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Trò chuyện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}
        onPress={()=>router.push('/(tabsv)/home_sv')}>
          <Icon name="group" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Nhóm</Text>
        </TouchableOpacity>
        {/* <Link href="/assignment_sv" style={{ zIndex: 10 }}>
          <TouchableOpacity style={styles.tabBarButton}>
            <Icon name="assignment" size={24} color="black" />
            <Text style={styles.tabBarLabel}>Bài tập</Text>
          </TouchableOpacity>
        </Link> */}
        {/* <TouchableOpacity style={styles.tabBarButton}> */}
        <TouchableOpacity style={styles.tabBarButton}
        >
          <Icon name="assignment" size={24} color="purple" />
          <Text style={[styles.tabBarLabel, { color: "purple" }]}>Bài tập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="calendar-today" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Lịch</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBarButton}
          onPress={() => router.push("/documents-class")}
        >
          <Icons name="file-document-multiple" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Tài liệu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#b71c1c",
    alignItems: "center",
  },
  userImage: {
    width: 50,
    height: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  title2: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#fff",
    color: "#b71c1c",
  },
  assignmentList: {
    padding: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  assignmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  classLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  assignmentDetails: {
    marginLeft: 15,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  assignmentDue: {
    fontSize: 14,
    color: "#888",
  },
  assignmentClassName: {
    fontSize: 14,
    color: "#555",
  },
  assignmentPoints: {
    fontSize: 14,
    color: "#444",
  },
  noAssignments: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
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
  },
  tabBarLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  iconContainer: {
    backgroundColor: '#D32F2F',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    marginRight: 10,
  },
  iconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#555',
  },
});

export default AssignmentApp;
