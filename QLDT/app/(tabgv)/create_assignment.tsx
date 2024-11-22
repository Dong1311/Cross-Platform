import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { useAuth } from "@/Context/AuthProvider";

const CreateAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("-- Chọn Ngày --");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { classId, token } = useAuth() as AuthContextType;

  interface AuthContextType {
    token: string;
    classId: string;
  }

  const showDatePicker = () => {
    const parseDate = new Date(Date.now());

    DateTimePickerAndroid.open({
      value: parseDate,
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          // const formattedDate = selectedDate.toISOString().split('T')[0];
          // setDeadline(formattedDate)
          showTimePicker(selectedDate);
        }
      },
    });
  };

  const showTimePicker = (selectedDate) => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: "time", // Chế độ chọn giờ
      is24Hour: true,
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          // Lấy ngày và giờ từ cả hai lần chọn
          const combinedDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes(),
            selectedTime.getSeconds()
          );

          // Định dạng ngày giờ theo ý muốn
          const formattedDateTime = combinedDateTime.toISOString();
          setDeadline(formattedDateTime);
        }
      },
    });
  };

  const handleUpFile = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if(!result.canceled) {
      setFile(result);
    } 
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let formdata = new FormData();

      formdata.append("token", token);
      formdata.append("classId", classId);
      formdata.append("title", title);
      formdata.append("description", description);
      formdata.append("deadline", deadline.split(".")[0]);
      if (file) {
        formdata.append("file", {
          uri: file.assets[0].uri,
          type: file.assets[0].mimeType ?? "",
          name: file.assets[0].name,
        });
      }
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/create_survey?file",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      if (response.data.meta.code === "1000") {
        Alert.alert("Success", "Tạo bài tập thành công");
        router.back();
      }
    } catch (error: any) {
      Alert.alert("Error", error.response.data);
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Tạo bài tập</Text>
        <TouchableOpacity>
          <Text></Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#d32f2f" />
      ) : (
        <>
          <View style={styles.body}>
            <TextInput
              style={styles.input}
              placeholder="Tên bài tập*"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={styles.inputdes}
              placeholder="Mô tả"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.orText}>Hoặc</Text>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => {
                handleUpFile();
              }}
            >
              <Text style={styles.uploadText}>
                {file ? `${file.assets[0].name}` : "Tải tài liệu lên"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Hạn nộp</Text>
            <TouchableOpacity onPress={() => showDatePicker()}>
              <Text style={styles.inputDate}>{`${
                deadline.split("T")[0]
              }  ${new Date(deadline).toLocaleTimeString()}`}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.btnsubmit}
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text style={styles.uploadText}>Tạo bài tập</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default CreateAssignment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    marginBottom: 16,
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
  },
  navbtn: {
    fontSize: 18,
    color: "white",
    padding: 4,
  },
  body: {
    padding: 16,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    paddingVertical: 20,
    marginBottom: 15,
  },
  inputdes: {
    height: 300,
    fontSize: 16,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 4,
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: "#e63946",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputDate: {
    height: 50,
    borderColor: "#B30000",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    textAlignVertical: "center",
  },
  label: {
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 8,
    marginTop: 16,
  },
  btnsubmit: {
    backgroundColor: "#e63946",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
    width: "90%",
    margin: "auto",
  },
});
