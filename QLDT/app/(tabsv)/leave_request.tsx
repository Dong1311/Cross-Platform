import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
const LeaveRequestScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleFileUpload = () => {
    // Xử lý tải minh chứng (mock function)
    console.log("Upload file");
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

  const handleSubmit = () => {
    // Xử lý gửi yêu cầu nghỉ phép
    console.log("Submit request");
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
            style={styles.input}
            placeholder="Gửi đến ai"
            value={recipient}
            onChangeText={setRecipient}
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
            <Text style={styles.uploadButtonText}>Tải minh chứng</Text>
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
