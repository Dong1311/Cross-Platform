import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/Context/AuthProvider";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const LeaveRequestScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [file, setFile] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { token, role, accountId } = useAuth() as AuthContextType;
  const { classId } = useLocalSearchParams();
  interface AuthContextType {
    token: string;
    role: string;
    accountId: string;
  }

  const handleFileUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if(!result.canceled) {
      setFile(result);
    } 
  };

  const handleDateSelection = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    // Xử lý gửi yêu cầu nghỉ phép
    try {
      let formdata = new FormData();

      formdata.append("token", token);
      formdata.append("classId", classId as string); 
      formdata.append("title", title);
      formdata.append("reason", reason);
      formdata.append("date",date.toISOString().split('T')[0] );
      if (file) {
        formdata.append("file", {
          uri: file.assets[0].uri,
          type: file.assets[0].mimeType ?? "",
          name: file.assets[0].name,
        });
      }
      const res = await axios.post('http://157.66.24.126:8080/it5023e/request_absence', formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      if(res.data.meta.code === '1000') {
        Alert.alert("Thành công", 'Gửi thư xin phép nghỉ học thành công')
        router.back()
      }
    } catch (error : any) {
      console.log(error.response.data);
      Alert.alert("Thất bại", error.response.data.meta.message)
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#d32f2f" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
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
            <Text style={styles.navTitle}>NGHỈ PHÉP</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tiêu đề"
            value={title}
            onChangeText={setTitle}
          />
        
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Lý do"
            value={reason}
            onChangeText={setReason}
            multiline
          />

          <Text style={styles.andText}>Và</Text>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleFileUpload}
          >
            <Text style={styles.uploadButtonText}>{ file ? `${file.assets[0].name}` :'Tải minh chứng' }</Text>
            <Ionicons name="caret-down" size={16} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.datePicker}
            onPress={handleDateSelection}
          >
            <Text style={styles.datePickerText}>
              {date ? date.toLocaleDateString() : "Ngày nghỉ phép"}
            </Text>
            <Ionicons name="caret-down" size={16} color="#d32f2f" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  arrow: {
    position: "absolute",
    marginLeft: 20,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#d32f2f",
  },
  navTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  navTitle: {
    fontSize: 18,
    color: "white",
    marginLeft: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  formContainer: {
    padding: 16,
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#d32f2f",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  andText: {
    fontSize: 16,
    color: "#555",
    marginVertical: 8,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 14,
    marginRight: 8,
  },
  datePicker: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderColor: "#d32f2f",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
  },
  datePickerText: {
    color: "#d32f2f",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LeaveRequestScreen;
