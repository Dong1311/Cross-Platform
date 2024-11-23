import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useAuth } from "@/Context/AuthProvider";
import axios from "axios";

const EditClass: React.FC = () => {
  const router = useRouter();
  const [infoClass, setInfoClass] = useState<Partial<ClassItem>>({});
  const { token, role, accountId, classList, classId, setClassList } = useAuth() as AuthContextType;

  interface AuthContextType {
    token: string;
    role: string;
    accountId: string;
    classId :string;
    setClassList: React.Dispatch<React.SetStateAction<ClassItem[]>>;
    setClassId: React.Dispatch<React.SetStateAction<string>>;
    classList: ClassItem[];
  }
  interface ClassItem {
    class_id: string;
    class_name: string;
    attached_code: string;
    class_type: string;
    lecturer_name: string;
    student_count: number;
    start_date: string;
    end_date: string;
    status: string;
  }

  const [classData, setClassData] = useState({
    classId: "",
    className: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {

    const selectedClass = classList.find(
      (classItem) => classItem.class_id === classId
    );
    
    if (selectedClass) {
      setInfoClass(selectedClass);
    }
    
  }, []);

  useEffect(() => {
    setClassData({
      classId: (infoClass.class_id ) || "",
      className: (infoClass.class_name ) || "",
      status: (infoClass.status ) || "",
      startDate: (infoClass.start_date ) || "",
      endDate: (infoClass.end_date ) || "",
    });
  },[infoClass])

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

  const validateForm = () => {
    const { className, status, startDate, endDate } = classData;

    if (!className.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên lớp");
      return false;
    }

    if (!status) {
      Alert.alert("Lỗi", "Vui lòng chọn trạng thái");
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

    return true;
  };

  const handleEditClass = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://157.66.24.126:8080/it5023e/edit_class",
        {
          token,
          class_id: classData.classId,
          class_name: classData.className,
          status: classData.status,
          start_date: classData.startDate,
          end_date: classData.endDate,
        }
      );
      
      if(res.data.meta.code === '1000') {
        setClassList(classList.map(cls => 
          cls.class_id === classData.classId 
            ? { ...cls, ...res.data.data } 
            : cls
        ));
        Alert.alert("Thành công", "Đã cập nhật lớp học");
        router.back();
      }
    } catch (error : any) {
      Alert.alert("Lỗi", "Không thể cập nhật lớp học");
      console.log(error.response.data)
    }
  };

  const handleDeleteClass = () => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa lớp học này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await axios.post('http://157.66.24.126:8080/it5023e/delete_class', {token, role, account_id: accountId, class_id: classId})

            if(res.data.meta.code === '1000'){
              setClassList(classList.filter(cls => cls.class_id !== classData.classId));
              console.log("Xóa lớp học:", classData.classId);
              Alert.alert("Thành công", "Đã xóa lớp học");
              router.replace('/home_gv');
            }
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa lớp học");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Chỉnh sửa lớp học</Text>
        <View style={styles.navPlaceholder} />
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.label}>Mã lớp</Text>
        <TextInput
          editable={false}
          style={styles.input}
          placeholder="Mã lớp*"
          value={classData.classId}
        />

        <Text style={styles.label}>Tên lớp</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên lớp*"
          value={classData.className}
          onChangeText={(text) =>
            setClassData((prev) => ({ ...prev, className: text }))
          }
        />

        <Text style={styles.label}>Trạng thái</Text>
        <RNPickerSelect
          onValueChange={(value) =>
            setClassData((prev) => ({ ...prev, status: value }))
          }
          items={[
            { label: "ACTIVE", value: "ACTIVE" },
            { label: "COMPLETED", value: "COMPLETED" },
            { label: "UPCOMING", value: "UPCOMING" },
          ]}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          value={classData.status}
        />

        <Text style={styles.label}>Ngày bắt đầu</Text>
        <TouchableOpacity
          onPress={() => showDatePicker(classData.startDate, "startDate")}
        >
          <Text style={styles.inputDate}>{classData.startDate}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Ngày kết thúc</Text>
        <TouchableOpacity
          onPress={() => showDatePicker(classData.endDate, "endDate")}
        >
          <Text style={styles.inputDate}>{classData.endDate}</Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteClass}
          >
            <Text style={styles.buttonText}>Xóa lớp này</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleEditClass}
          >
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.linkText}>Thông tin danh sách các lớp mở</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  navPlaceholder: {
    width: 24,
  },
  label: {
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 4,
  },
  bodyContainer: {
    padding: 20,
    flex: 1,
  },
  input: {
    height: 50,
    borderColor: "#B30000",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#b30000",
  },
  saveButton: {
    backgroundColor: "#b30000",
  },
  buttonText: {
    color: "#fff",
  },
  linkText: {
    color: "#B30000",
    textAlign: "center",
    marginTop: 15,
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

export default EditClass;
