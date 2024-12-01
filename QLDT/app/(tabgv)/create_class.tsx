import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Icon
import { Link, router } from "expo-router";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import axios from "axios";
import { useAuth } from "@/Context/AuthProvider";

const CreateClass: React.FC = () => {
  const { token, classList, setClassList } = useAuth() as AuthContextType;

  interface AuthContextType {
    token: string;
    role: string;
    accountId: string;
    classId: string;
    setClassList: React.Dispatch<React.SetStateAction<ClassInfo[]>>;
    setClassId: React.Dispatch<React.SetStateAction<string>>;
    classList: ClassInfo[] | null;
  }

  interface ClassInfo {
    class_id: string;
    class_name: string;
    attached_code: string;
    class_type: string;
    lecturer_name: string;
    max_student_amount: number;
    start_date: string;
    end_date: string;
    status: string;
  }

  const [classData, setClassData] = useState({
    classId: "",
    className: "",
    classType: "",
    startDate: "",
    endDate: "",
    maxStudents: "" ,
  });


  const validateForm = () => {
    const {classId, className, classType, startDate, endDate, maxStudents} = classData;

    if (!className.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên lớp");
      return false;
    }

    if (!classId.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã lớp");
      return false;
    }

    if (!classType) {
      Alert.alert("Lỗi", "Vui lòng chọn loại lớp");
      return false;
    }

    if (!startDate) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày bắt đầu");
      return false;
    }

    if (!endDate) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày kết thúc");
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      Alert.alert("Lỗi", "Ngày bắt đầu phải trước ngày kết thúc");
      return false;
    }

    if (!maxStudents.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số lượng sinh viên tối đa");
      return false;
    }

    return true;
  };

  const handleCreateClass = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://157.66.24.126:8080/it5023e/create_class",
        {
          token,
          class_id: classData.classId,
          class_name: classData.className,
          class_type: classData.classType,
          start_date: classData.startDate,
          end_date: classData.endDate,
          max_student_amount : classData.maxStudents,
        }
      );
      console.log(res.data)
      if(res.data.meta.code === '1000') {
        setClassList([res.data.data, ...(classList || [])]);
        Alert.alert("Thành công","Tạo lớp học thành công");
        router.back();
      }
    } catch (error : any) {
      Alert.alert("Lỗi", "Không thể tạo lớp học");
      console.log(error.response.data)
    }
  };
  

  const showDatePicker = (
    currentDate: string,
    setDateField: "startDate" | "endDate"
  ) => {
    const parseDate = new Date(currentDate || Date.now());

    DateTimePickerAndroid.open({
      value: parseDate,
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          const formattedDate = selectedDate.toISOString().split("T")[0];
          setClassData((prev) => ({
            ...prev,
            [setDateField]: formattedDate,
          }));
        }
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>HUST</Text>
        <Text style={styles.subHeaderText}>CREATE CLASS</Text>
      </View>
      <View style={styles.bodyContainer}>
        {/* Form fields */}
        <Text style={styles.label}>Mã lớp</Text>
        <TextInput
          style={styles.input}
          placeholder="Mã lớp*"
          value={classData.classId}
          onChangeText={(value) =>
            setClassData((prev) => ({ ...prev, classId: value }))
          }
        />

        <Text style={styles.label}>Tên lớp</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên lớp*"
          value={classData.className}
          onChangeText={(value) =>
            setClassData((prev) => ({ ...prev, className: value }))
          }
        />

        <Text style={styles.label}>Loại lớp</Text>
        <RNPickerSelect
          value={classData.classType}
          onValueChange={(value) =>
            setClassData((prev) => ({ ...prev, classType: value }))
          }
          items={[
            { label: "LT", value: "LT" },
            { label: "BT", value: "BT" },
            { label: "LT_BT", value: "LT_BT" },
          ]}
          Icon={() => {
            return <Ionicons name="caret-down" size={16} color="#d32f2f" />;
          }}
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 16,
              left: 320 ,
            },
          }}
          useNativeAndroidPickerStyle={false}
        />

        <Text style={styles.label}>Ngày bắt đầu</Text>
        <TouchableOpacity
          style={styles.inputDate}
          onPress={() => showDatePicker(classData.startDate, "startDate")}
        >
          <Text >{classData.startDate}</Text>
          <Ionicons name="caret-down" size={16} color="#d32f2f" />
        </TouchableOpacity>

        <Text style={styles.label}>Ngày kết thúc</Text>
        <TouchableOpacity
          style={styles.inputDate}
          onPress={() => showDatePicker(classData.endDate, "endDate")}
        >
          <Text >{classData.endDate}</Text>
          <Ionicons name="caret-down" size={16} color="#d32f2f" />
        </TouchableOpacity>

        <Text style={styles.label}>Số lượng sinh viên tối đa</Text>
        <TextInput
          style={styles.input}
          placeholder="nhập số sinh viên"
          keyboardType="numeric"
          value={classData.maxStudents}
          onChangeText={(value) =>
            setClassData((prev) => ({ ...prev, maxStudents: value }))}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateClass} >
          <Text style={styles.buttonText}>Tạo lớp học</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.linkText}>Thông tin danh sách các lớp mở</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#b71c1c",
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 40,
    top: 60,
    zIndex: 999,
  },
  bodyContainer: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 24,
    color: "#ffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 16,
    color: "#ffff",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#B30000",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#B30000",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  linkText: {
    color: "#B30000",
    textAlign: "center",
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 4,
  },
  inputDate: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderColor: "#d32f2f",
    borderWidth: 1,
    borderRadius: 4,
    height: 46,
    marginBottom: 12,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    height: 50,
    borderColor: "#B30000",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputAndroid: {
    height: 50,
    borderColor: "#B30000",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
};

export default CreateClass;
