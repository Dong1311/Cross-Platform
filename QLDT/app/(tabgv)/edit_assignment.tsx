import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "@/Context/AuthProvider";

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  file_url?: string;
}

interface AuthContextType {
  token: string;
  classId: string;
  assignmentsData: Assignment[];
  setAssignmentsData: (data: Assignment[]) => void;
}

const EditAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState<DocumentPicker.DocumentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Assignment | null>(null);
  const { token, assignmentsData, setAssignmentsData } = useAuth() as AuthContextType;
  const params = useLocalSearchParams();

  useEffect(() => {
    if (!params.id || !assignmentsData) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin bài tập");
      router.back();
      return;
    }

    const result = assignmentsData.find(
      (assignment) => assignment.id === Number(params.id)
    );

    if (!result) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin bài tập");
      router.back();
      return;
    }

    setInitialData(result);
    setTitle(result.title);
    setDeadline(result.deadline);
    setDescription(result.description || "");
  }, [params.id, assignmentsData]);

  const validateInputs = useCallback(() => {
    if (!description.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mô tả bài tập");
      return false;
    }

    if (!deadline) {
      Alert.alert("Lỗi", "Vui lòng chọn hạn nộp bài");
      return false;
    }

    // Validate deadline is in the future
    const deadlineDate = new Date(deadline);
    const now = new Date();
    if (deadlineDate <= now) {
      Alert.alert("Lỗi", "Hạn nộp phải sau thời điểm hiện tại");
      return false;
    }

    // Check if any changes were made
    if (initialData && 
        description.trim() === initialData.description?.trim() &&
        deadline === initialData.deadline &&
        !file) {
      Alert.alert("Thông báo", "Không có thay đổi nào được thực hiện");
      return false;
    }

    return true;
  }, [description, deadline, file, initialData]);

  const showDatePicker = useCallback(() => {
    const currentDate = new Date();
    const minimumDate = new Date();
    minimumDate.setHours(currentDate.getHours(), currentDate.getMinutes(), 0, 0);

    DateTimePickerAndroid.open({
      value: currentDate,
      minimumDate: minimumDate,
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          showTimePicker(selectedDate);
        }
      },
    });
  }, []);

  const showTimePicker = useCallback((selectedDate: Date) => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: "time",
      is24Hour: true,
      onChange: (event, selectedTime) => {
        if (event.type === "set" && selectedTime) {
          const combinedDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes(),
            0
          );

          // Validate if selected time is in the future
          const now = new Date();
          if (combinedDateTime <= now) {
            Alert.alert("Lỗi", "Vui lòng chọn thời gian trong tương lai");
            return;
          }

          setDeadline(combinedDateTime.toISOString());
        }
      },
    });
  }, []);

  const handleUpFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      
      if (!result.canceled) {
        // Validate file size (e.g., max 10MB)
        const fileSize = result.assets[0].size || 0;
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        
        if (fileSize > maxSize) {
          Alert.alert("Lỗi", "Kích thước file không được vượt quá 10MB");
          return;
        }
        
        setFile(result);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải file. Vui lòng thử lại");
    }
  }, []);

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const formdata = new FormData();

      formdata.append("token", token);
      formdata.append("assignmentId", params.id as string);
      formdata.append("description", description.trim());
      formdata.append("deadline", new Date(deadline).toISOString().split(".")[0]);

      if (file?.assets?.[0]) {
        formdata.append("file", {
          uri: file.assets[0].uri,
          type: file.assets[0].mimeType ?? "application/octet-stream",
          name: file.assets[0].name,
        });
      }

      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/edit_survey?file",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (response.data.meta.code === "1000") {
        setAssignmentsData(assignmentsData.map(asg => 
          asg.id === Number(params.id)
            ? { ...asg, ...response.data.data } 
            : asg
        ));
        Alert.alert("Thành công", "Chỉnh sửa bài tập thành công", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        throw new Error(response.data.meta.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.meta?.message || 
                          error.message || 
                          "Có lỗi xảy ra khi cập nhật bài tập";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN')}`;
    } catch {
      return "Chưa chọn thời gian";
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Chỉnh sửa bài tập</Text>
        <View style={styles.navPlaceholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d32f2f" />
          <Text style={styles.loadingText}>Đang xử lý...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.body}>
            <Text style={styles.label}>Tên bài tập</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={title}
              editable={false}
            />

            <Text style={styles.label}>Mô tả <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.inputdes}
              placeholder="Nhập mô tả bài tập"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={1000}
            />

            <Text style={styles.orText}>Hoặc</Text>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUpFile}
              disabled={loading}
            >
              <Text style={styles.uploadText}>
                {file ? `${file.assets[0].name}` : "Tải tài liệu lên (PDF, DOC, DOCX...)"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Hạn nộp <Text style={styles.required}>*</Text></Text>
            <TouchableOpacity 
              onPress={showDatePicker}
              disabled={loading}
            >
              <Text style={styles.inputDate}>
                {deadline ? formatDateTime(deadline) : "Chọn thời hạn nộp bài"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.btnsubmit, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.uploadText}>
              {loading ? "Đang xử lý..." : "Lưu thay đổi"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditAssignment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  navPlaceholder: {
    width: 24,
  },
  body: {
    padding: 16,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  inputdes: {
    height: 200,
    fontSize: 16,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  orText: {
    textAlign: "center",
    marginVertical: 12,
    color: '#666',
  },
  uploadButton: {
    backgroundColor: "#d32f2f",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputDate: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    textAlignVertical: "center",
    fontSize: 16,
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  required: {
    color: '#d32f2f',
  },
  btnsubmit: {
    backgroundColor: "#d32f2f",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
});