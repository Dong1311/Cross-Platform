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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker"; 
import axios from "axios"; 

const API_URL = "https://6705494f031fd46a830f6626.mockapi.io/ehust/documents"; 

export default function App() {
  const [documents, setDocuments] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedDocument, setSelectedDocument] = useState(null); 
  const [newDocumentName, setNewDocumentName] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true); 
      const response = await axios.get(API_URL);
      setDocuments(response.data); 
    } catch (err) {
      setError("Failed to load documents");
    } finally {
      setLoading(false); 
    }
  };

  const openModal = (document) => {
    setSelectedDocument(document);
    setNewDocumentName(document.name); 
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDocument(null);
  };

  const handleDeleteDocument = async () => {
    if (selectedDocument) {
      try {
        await axios.delete(`${API_URL}/${selectedDocument.id}`);
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== selectedDocument.id)
        );
        closeModal();
      } catch (err) {
        Alert.alert("Error", "Failed to delete document");
      }
    }
  };

  const handleEditDocumentName = async () => {
    if (selectedDocument) {
      try {
        const updatedDocument = { ...selectedDocument, name: newDocumentName };
        await axios.put(`${API_URL}/${selectedDocument.id}`, updatedDocument); 

        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.id === selectedDocument.id ? updatedDocument : doc
          )
        );
        closeModal(); 
      } catch (err) {
        Alert.alert("Error", "Failed to update document name");
      }
    }
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (!result.canceled) {
        // Upload the document file to the server
        const formData = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
        };

        const response = await axios.post(API_URL, JSON.stringify(formData), {
          headers: { "Content-Type": "application/json" },
        });

        setDocuments([...documents, response.data]);
        Alert.alert("Success","Upload file thành công")
      }
    } catch (err) {
      Alert.alert("Error", "Upload file thất bại");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Ionicons name="document" size={24} color="blue" />
      <Text style={styles.documentName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => openModal(item)}
      >
        <Ionicons name="ellipsis-horizontal" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Ionicons name="arrow-back" size={24} color="white" />
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
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
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
                <Text style={styles.modalTitle}>Edit Document</Text>
                <TextInput
                  style={styles.input}
                  value={newDocumentName}
                  onChangeText={setNewDocumentName}
                />

                <Pressable
                  style={styles.modalButton}
                  onPress={handleEditDocumentName}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </Pressable>

                <Pressable
                  style={styles.modalButton}
                  onPress={handleDeleteDocument}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#d32f2f" }]}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
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
    paddingTop: 40,
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
    color: 'red',
    textAlign: 'center',
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
