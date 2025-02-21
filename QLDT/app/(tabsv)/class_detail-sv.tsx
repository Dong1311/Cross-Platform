import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "@/Context/AuthProvider";
import { useRouter } from "expo-router";
interface StudentAccount {
  account_id: number;
  last_name: string;
  first_name: string;
  email: string;
  avatar: string | null;
  student_id: number;
}

interface ClassDetailType {
  class_id: string;
  class_name: string;
  attached_code: string | null;
  class_type: string;
  lecturer_name: string;
  student_count: number;
  start_date: string;
  end_date: string;
  status: string;
  student_accounts: StudentAccount[];
}

const ClassDetail = () => {
  const { classId } = useLocalSearchParams();
  const [classDetail, setClassDetail] = useState<ClassDetailType | null>(null);
  const { token, accountId, setClassId } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (classId) {
      fetchClassDetail();
    }
  }, [classId]);
  console.log("token", token, "classid: ", classId);
  const fetchClassDetail = async () => {
    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_class_info",
        {
          token,
          role: "STUDENT",
          account_id: accountId,
          class_id: classId,
        }
      );

      // console.log("API Response:", response.data);

      if (response.data.meta.code === "1000") {
        setClassDetail(response.data.data);
      } else {
        console.error(
          "Failed to fetch class detail:",
          response.data.meta.message
        );
      }
    } catch (error) {
      console.error("Error fetching class detail:", error);
    }
  };

  const handleRequestLeave = () => {
    router.push({
      pathname: "/absence-request",
      params: { classId: classDetail?.class_id }, // Truyền classId
    });
  };

  const handleDocuments = () => {
    setClassId(classId);
    router.push("/documents-class");
  };
  const handleAssignment = () => {
    router.push({
      pathname: "/(tabsv)/assignment_class",
      params: {
        classId: classDetail?.class_id,
        className: classDetail?.class_name,
      },
    });
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconContainer}
          onPress={() => router.push("/home_sv")}
        >
          <Image
            source={require("../../assets/images/arrow-back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {classDetail ? (
          <>
            {/* Class Information */}
            <View style={styles.classInfoCard}>
              <Text style={styles.classTitle}>{classDetail.class_name}</Text>
              <Text style={styles.classDetailText}>
                Lecturer: {classDetail.lecturer_name}
              </Text>
              <Text style={styles.classDetailText}>
                Start Date: {classDetail.start_date}
              </Text>
              <Text style={styles.classDetailText}>
                End Date: {classDetail.end_date}
              </Text>
              <Text style={styles.classDetailText}>
                Status: {classDetail.status}
              </Text>
            </View>

            {/* Students List Header */}
            <Text style={styles.subtitle}>Students</Text>

            {/* Students List */}
            <FlatList
              data={classDetail.student_accounts}
              keyExtractor={(item) => item.account_id.toString()}
              renderItem={({ item }) => (
                <View style={styles.studentCard}>
                  <Text
                    style={styles.studentName}
                  >{`${item.first_name} ${item.last_name}`}</Text>
                  <Text style={styles.studentEmail}>{item.email}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No students available</Text>
              }
            />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleRequestLeave}
              >
                <Text style={styles.buttonText}>Xin nghỉ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDocuments}
              >
                <Text style={styles.buttonText}>Tài liệu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleAssignment}
              >
                <Text style={styles.buttonText}>Bài tập</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
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
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    width: "100%",
    height: 60,
    backgroundColor: "#d32f2f", // Màu đỏ
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  backIconContainer: {
    position: "absolute",
    top: 15,
    left: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  classInfoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  classTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  classDetailText: {
    fontSize: 16,
    color: "#555",
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  studentEmail: {
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ClassDetail;
