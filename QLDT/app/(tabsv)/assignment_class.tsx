import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "@/Context/AuthProvider";

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

interface AssignmentsData {
  upcoming: Assignment[];
  overdue: Assignment[];
  completed: Assignment[];
}

const AssignmentClass = () => {
  const router = useRouter();
  const { classId, className } = useLocalSearchParams();
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [assignmentsData, setAssignmentsData] = useState<AssignmentsData>({
    upcoming: [],
    overdue: [],
    completed: [],
  });

  const getDateWithoutTime = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day);
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_all_surveys",
        { token, class_id: classId }
      );

      const now = getDateWithoutTime(new Date());

      const tempUpcoming: Assignment[] = [];
      const tempOverdue: Assignment[] = [];
      const tempCompleted: Assignment[] = [];

      response.data.data.forEach((assignment: Assignment) => {
        const assignmentDate = getDateWithoutTime(new Date(assignment.dueTime));
        if (assignment.completed) {
          tempCompleted.push(assignment);
        } else if (assignmentDate < now) {
          tempOverdue.push(assignment);
        } else {
          tempUpcoming.push(assignment);
        }
      });

      setAssignmentsData({
        upcoming: tempUpcoming,
        overdue: tempOverdue,
        completed: tempCompleted,
      });
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchAssignments();
    }
  }, [classId]);

  const renderAssignments = (assignments: Assignment[]) => {
    if (assignments.length === 0) {
      return <Text style={styles.noAssignments}>Không có bài tập nào</Text>;
    }

    const groupedAssignments: { [key: string]: Assignment[] } = {};
    assignments.forEach((assignment) => {
      const assignmentDate = new Date(assignment.dueTime);
      const dateString = assignmentDate.toLocaleDateString();
      if (!groupedAssignments[dateString]) {
        groupedAssignments[dateString] = [];
      }
      groupedAssignments[dateString].push(assignment);
    });

    return Object.keys(groupedAssignments).map((date) => (
      <View key={date}>
        <Text style={styles.dateHeader}>{date}</Text>
        {groupedAssignments[date].map((assignment) => (
          <TouchableOpacity
            key={assignment.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/submission",
                params: assignment,
              })
            }
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>
                {new Date(assignment.dueTime).getDate()}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{assignment.title}</Text>
              <Text style={styles.subText}>
                Đến hạn lúc{" "}
                {new Date(assignment.dueTime).toLocaleTimeString().slice(0, 5)}
              </Text>
              <Text style={styles.subText}>Lớp {assignment.className}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title2}>{`Bài tập lớp ${className || ""}`}</Text>
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

        <ScrollView style={styles.assignmentList}>
          {activeTab === "upcoming" &&
            renderAssignments(assignmentsData.upcoming)}
          {activeTab === "overdue" &&
            renderAssignments(assignmentsData.overdue)}
          {activeTab === "completed" &&
            renderAssignments(assignmentsData.completed)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#d32f2f", // Màu header
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#d32f2f",
    alignItems: "center",
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
  noAssignments: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  iconContainer: {
    backgroundColor: "#D32F2F",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    marginRight: 10,
  },
  iconText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#555",
  },
});

export default AssignmentClass;
