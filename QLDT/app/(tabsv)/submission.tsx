import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Linking,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { useAuth } from "@/Context/AuthProvider";

// Define proper types for route params
type RouteParams = {
  id: string;
  title: string;
  deadline: string;
  description: string;
  file_url: string;
};

type SubmitAssignmentScreenProps = {
  route: RouteProp<{ params: RouteParams }, "params">;
  navigation: StackNavigationProp<any, any>;
};

const SubmitAssignmentScreen: React.FC<SubmitAssignmentScreenProps> = () => {
  const params = useLocalSearchParams<RouteParams>();
  const [textResponse, setTextResponse] = useState<string>("");
  const [file, setFile] = useState(null);
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const openURL = useCallback((url: string) => {
    if (!url) {
      Alert.alert("Lỗi", "URL không hợp lệ");
      return;
    }
    Linking.openURL(url).catch((err) => {
      console.error("An error occurred", err);
      Alert.alert("Lỗi", "Không thể mở liên kết");
    });
  }, []);

  const submitAssignment = useCallback(async () => {
    if (!textResponse.trim() && !file) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập câu trả lời hoặc tải file lên."
      );
      return;
    }

    if (!params.id) {
      Alert.alert("Lỗi", "Không tìm thấy ID bài tập");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("assignmentId", params.id);
    formData.append("textResponse", textResponse.trim());

    if (file && file.assets?.[0]) {
      formData.append("file", {
        uri: file.assets[0].uri,
        type: file.assets[0].mimeType ?? "application/octet-stream",
        name: file.assets[0].name,
      } as any);
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/submit_survey?file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      if (response.data?.meta?.code === "1000") {
        Alert.alert("Thành công", "Bài tập đã được nộp thành công.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        throw new Error(response.data?.message || "Có lỗi xảy ra khi nộp bài");
      }
    } catch (error: any) {
      console.error("Error submitting assignment:", error);
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }, [token, params.id, textResponse, file]);

  const isSubmitDisabled = !textResponse.trim() && !file;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.navTitle} numberOfLines={1}>
            {params.title}
          </Text>
          <View style={styles.navPlaceholder} />
        </View>

        <View style={styles.body}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailItem}>
              Hạn nộp: {new Date(params.deadline).toLocaleString("vi-VN")}
            </Text>
            <Text style={styles.guidelines}>Mô tả:</Text>
            <Text style={styles.guidelineText}>{params.description}</Text>
            {params.file_url && (
              <TouchableOpacity
                style={styles.fileButton}
                onPress={() => openURL(params.file_url)}
              >
                <Text style={styles.fileButtonText}>Tài liệu</Text>
              </TouchableOpacity>
            )}
          </View>

          {params.is_submitted === "true" ? (
            <Text
              style={[
                styles.guidelineText,
                { color: "green", textAlign: "center" },
              ]}
            >
              Đã nộp bài
            </Text>
          ) : (
            <View>
              <Text style={styles.label}>
                Bài làm <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.inputdes}
                placeholder="Nhập câu trả lời"
                value={textResponse}
                onChangeText={setTextResponse}
                multiline
                numberOfLines={4}
                maxLength={1000}
              />
              <Text style={styles.orText}>Hoặc</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpFile}
              >
                <Text style={styles.uploadText}>
                  {file
                    ? file.assets[0].name
                    : "Tải tài liệu lên (PDF, DOC, DOCX...)"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitDisabled && styles.disabledButton,
                ]}
                onPress={submitAssignment}
                disabled={isSubmitDisabled || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Nộp bài</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    backgroundColor: "#f5f5f5",
  },
  body: {
    padding: 16,
  },
  fileButton: {
    padding: 8,
    backgroundColor: "#e0e0e0",
    width: "30%",
    borderRadius: 4,
  },
  fileButtonText: {
    textAlign: "center",
    color: "#333",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  guidelines: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  guidelineText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    lineHeight: 24,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#d32f2f",
    elevation: 4,
  },
  navTitle: {
    fontSize: 18,
    color: "white",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  navPlaceholder: {
    width: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "#d32f2f",
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
    backgroundColor: "#fff",
  },
  orText: {
    textAlign: "center",
    marginVertical: 12,
    color: "#666",
  },
  uploadButton: {
    backgroundColor: "#d32f2f",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default SubmitAssignmentScreen;
