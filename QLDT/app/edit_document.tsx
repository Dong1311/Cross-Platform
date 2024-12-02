import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  Alert,
  ActivityIndicator 
} from "react-native";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

export default function EditDocumentScreen() {
  const params = useLocalSearchParams();
  
  const [editTitle, setEditTitle] = useState(params.material_name as string);
  const [editDescription, setEditDescription] = useState(params.description as string);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled) {
        setSelectedFile(result);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể chọn file");
    }
  };

  const handleUpdateDocument = async () => {
    if (!editTitle.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên tài liệu");
      return;
    }

    setIsLoading(true);
    try {
      if (selectedFile && !selectedFile.canceled) {
        let formData = new FormData();
        formData.append("token", params.token as string);
        formData.append("materialId", params.id as string);
        formData.append("title", editTitle);
        formData.append("description", editDescription);
        formData.append("materialType", selectedFile.assets[0].mimeType ?? '');
        formData.append("file", {
          uri: selectedFile.assets[0].uri,
          type: selectedFile.assets[0].mimeType ?? '',
          name: selectedFile.assets[0].name,
        } as any);

        const response = await axios.post(
          `http://157.66.24.126:8080/it5023e/edit_material`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.code === "1000") {
          Alert.alert("Thành công", "Cập nhật tài liệu thành công");
          router.back();
        } else {
          Alert.alert("Lỗi", response.data.message || "Không thể cập nhật tài liệu");
        }
      } else {
        const updatedDocument = {
          materialId: params.id,
          title: editTitle,
          description: editDescription,
          token: params.token,
        };

        const response = await axios.post(
          `http://157.66.24.126:8080/it5023e/edit_material`,
          updatedDocument
        );

        if (response.data.code === "1000") {
          Alert.alert("Thành công", "Cập nhật tài liệu thành công");
          router.back();
        } else {
          Alert.alert("Lỗi", response.data.message || "Không thể cập nhật tài liệu");
        }
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể cập nhật tài liệu");
      console.log('error_update : ' + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>Tên tài liệu:</Text>
      <TextInput
        style={styles.input}
        value={editTitle}
        onChangeText={setEditTitle}
        placeholder="Nhập tên tài liệu"
        editable={!isLoading}
      />

      <Text style={styles.labelText}>Mô tả:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={editDescription}
        onChangeText={setEditDescription}
        placeholder="Nhập mô tả"
        multiline
        numberOfLines={4}
        editable={!isLoading}
      />

      <Pressable 
        style={[styles.fileButton, isLoading && styles.disabledButton]} 
        onPress={handleFilePick}
        disabled={isLoading}
      >
        <Ionicons name="document-attach" size={24} color="white" />
        <Text style={styles.buttonText}>
          {selectedFile && !selectedFile.canceled 
            ? selectedFile.assets[0].name 
            : "Chọn file mới"}
        </Text>
      </Pressable>

      <Pressable 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleUpdateDocument}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
        )}
      </Pressable>

      <Pressable 
        style={[
          styles.button, 
          { backgroundColor: "#d32f2f" },
          isLoading && styles.disabledButton
        ]} 
        onPress={() => router.back()}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Hủy</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#1e90ff",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
    height: 45,
    justifyContent: 'center',
  },
  fileButton: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
