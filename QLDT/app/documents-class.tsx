import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Pressable,
  StatusBar,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/Context/AuthProvider";

export default function App() {
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Documents | null>(null);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { classId, token } = useAuth() as AuthContextType;

  interface Documents {
    id: number;
    class_id: string;
    material_name: string;
    description: string;
    material_link: string;
    material_type: string ;
  }

  interface AuthContextType {
    token: string;
    classId : string;
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_material_list",
        { token, class_id: classId } 
      );

      setDocuments(response.data.data);
    } catch (err : any) {
      setError("Failed to load documents");
      console.log(err.response.data.meta.message);
    } finally {
      setLoading(false);
    }
  };

  interface Document {
    id: string;
    material_name: string;
  }
  const openModal = (document: Documents) => {
    setSelectedDocument(document);
    setNewDocumentName(document.material_name);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDocument(null);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có muốn xóa không ?",
      [
        {
          text: "Hủy",
          onPress: () => closeModal(),
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: () => handleDeleteDocument(),
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleDeleteDocument = async () => {
    if (selectedDocument) {
      try {
        await axios.post("http://157.66.24.126:8080/it5023e/delete_material", {
          token,
          material_id: selectedDocument.id,
        });
        fetchDocuments();
        closeModal();
      } catch (err) {
        Alert.alert("Error", "Failed to delete document");
        console.log("error delete : " + err);
      }
    }
  };

  const handleEditDocumentName = async () => {
    if (selectedDocument) {
      try {

        const updatedDocument = {
          materialId : selectedDocument.id,
          title: newDocumentName,
          token: token,
        };

        console.log(updatedDocument)
        await axios.post(`http://157.66.24.126:8080/it5023e/edit_material`, updatedDocument);

        fetchDocuments();
        closeModal();
      } catch (err) {
        Alert.alert("Error", "Failed to update document name");
        console.log('error_edit : ' + err)
      }
    }
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (!result.canceled) {
        // Upload the document file to the server
        let formdata = new FormData();

        formdata.append("token", token);
        formdata.append("classId", classId);
        formdata.append("title", result.assets[0].name);
        formdata.append("description", result.assets[0].name);
        formdata.append("materialType", result.assets[0].mimeType ?? '');
        formdata.append("file", {
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType ?? '',
          name: result.assets[0].name,
        });

        const response = await axios.post(
          "http://157.66.24.126:8080/it5023e/upload_material",
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.code = "1000") {
          // setDocuments([...documents, response.data]);
          fetchDocuments();
          Alert.alert("Success", "Upload file thành công");
        }
      }
    } catch (err) {
      Alert.alert("Error", "Upload file thất bại");
      console.log("uploadfile: " + err);
    }
  };

  const handleOpenFile = async (id : string) => {
    try {
      const res = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_material_info",
         { token, material_id: id } 
      );
      if (res.data.code === "1000") {
        Linking.openURL(res.data.data.material_link);
      }
    } catch (error) {
      Alert.alert("Error", "Lỗi khi mở file");
    }
  };

  const renderItem = ({ item }: { item: Documents }) => (
    <TouchableOpacity
      onPress={() => handleOpenFile(item.id.toString())}
      style={styles.itemContainer}
    >
      <Ionicons name="document" size={24} color="blue" />
      <Text style={styles.documentName}>{item.material_name}</Text>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => openModal(item)}
      >
        <Ionicons name="ellipsis-horizontal" size={24} color="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar backgroundColor="#d32f2f" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Tài liệu học tập</Text>
          <TouchableOpacity onPress={handleUploadDocument}>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Show loading or error state */}
        {loading ? (
          <ActivityIndicator size="large" color="#d32f2f" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={documents}
            keyExtractor={(item) => "" + item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", marginTop: 10, fontSize: 16 }}
              >
                Không có tài liệu nào
              </Text>
            }
          />
        )}

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Chỉnh sửa tài liệu</Text>
                  <TextInput
                    style={styles.input}
                    value={newDocumentName}
                    onChangeText={setNewDocumentName}
                  />

                  <Pressable
                    style={styles.modalButton}
                    onPress={handleEditDocumentName}
                  >
                    <Text style={styles.modalButtonText}>Lưu</Text>
                  </Pressable>

                  <Pressable style={styles.modalButton} onPress={confirmDelete}>
                    <Text style={styles.modalButtonText}>Xóa</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modalButton, { backgroundColor: "#d32f2f" }]}
                    onPress={closeModal}
                  >
                    <Text style={styles.modalButtonText}>Thoát</Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </>
  );
}

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
  listContainer: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  documentName: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  moreButton: {
    padding: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    backgroundColor: "#1e90ff",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    gap: 6,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
