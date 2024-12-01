import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuth } from "@/Context/AuthProvider";

const UserInfo = () => {
  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const router = useRouter();
  const { token, accountId, setAuth } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  console.log("token:", token, "accountid:", accountId);
  interface UserInfo {
    id: string;
    ho: string;
    ten: string;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar: string | null;
  }

  const fetchUserInfo = async () => {
    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it4788/get_user_info",
        {
          token,
          user_id: accountId,
        }
      );

      if (response.data.code === "1000") {
        setUserInfo(response.data.data);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const getDirectImageUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/(.+?)\//);
    return fileIdMatch
      ? `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`
      : url;
  };

  const handleSaveChanges = async () => {
    if (!newAvatar) {
      Alert.alert("Error", "Please select an avatar to update.");
      return;
    }

    const formData = new FormData();
    formData.append("token", token || "");

    if (newAvatar) {
      formData.append("file", {
        uri: newAvatar.uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as unknown as Blob);
    }

    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it4788/change_info_after_signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.code === "1000") {
        Alert.alert("Success", "Avatar updated successfully!");
        setUserInfo(response.data.data);
        setEditing(false);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewAvatar(result.assets[0]);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            setAuth(null);
            router.push("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backIconContainer}
          onPress={() => router.push("/home_sv")}
        >
          <Image
            source={require("../assets/images/arrow-back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutIconContainer}
          onPress={handleLogout}
        >
          <Image
            source={require("../assets/images/logout.png")}
            style={styles.logoutIcon}
          />
        </TouchableOpacity>
        {userInfo ? (
          <>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  newAvatar
                    ? { uri: newAvatar.uri }
                    : userInfo.avatar
                    ? { uri: getDirectImageUrl(userInfo.avatar) }
                    : require("../assets/images/user.png") // Avatar mặc định
                }
                style={styles.avatar}
              />

              {editing && (
                <TouchableOpacity
                  style={styles.changeAvatarButton}
                  onPress={handlePickImage}
                >
                  <Text style={styles.changeAvatarText}>Change Avatar</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{userInfo.name}</Text>

              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{userInfo.email}</Text>

              <Text style={styles.label}>Role:</Text>
              <Text style={styles.value}>{userInfo.role}</Text>

              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{userInfo.status}</Text>
            </View>

            <View style={styles.actionsContainer}>
              {editing ? (
                <>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveChanges}
                  >
                    <Text style={styles.buttonText}>Save Avatar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setEditing(false);
                      setNewAvatar(null);
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setEditing(true)}
                  >
                    <Text style={styles.buttonText}>Edit Avatar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.changePasswordButton}
                    onPress={() => router.push("/change-password")}
                  >
                    <Text style={styles.buttonText}>Change Password</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
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
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#d32f2f",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  backIconContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },

  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  changeAvatarText: {
    color: "#fff",
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  logoutIconContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  changePasswordButton: {
    backgroundColor: "#ffc107",
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
    color: "#555",
  },
});

export default UserInfo;
