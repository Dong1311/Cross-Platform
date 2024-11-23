import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRouter } from 'expo-router';

const UserInfo = () => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const router = useRouter();
  const token = "FNq9V2";
  const userId = "113";
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
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
      const response = await axios.post('http://157.66.24.126:8080/it4788/get_user_info', {
        token,
        user_id: userId,
      });

      if (response.data.code === "1000") {
        setUserInfo(response.data.data);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (!newName.trim() && !newAvatar) {
      Alert.alert('Error', 'Please provide a name or avatar to update.');
      return;
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('name', newName || userInfo?.name || '');

    if (newAvatar) {
      formData.append('file', {
        uri: newAvatar.uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as unknown as Blob);
    }
    

    try {
      const response = await axios.post('http://157.66.24.126:8080/it4788/change_info_after_signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.code === "1000") {
        Alert.alert('Success', 'Information updated successfully!');
        setUserInfo(response.data.data);
        setEditing(false);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
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

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <View style={styles.avatarContainer}>
            <Image
              source={
                newAvatar
                  ? { uri: newAvatar.uri }
                  : userInfo.avatar
                  ? { uri: userInfo.avatar }
                  : require('../assets/images/user.png')
              }
              style={styles.avatar}
            />
            {editing && (
              <TouchableOpacity style={styles.changeAvatarButton} onPress={handlePickImage}>
                <Text style={styles.changeAvatarText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name:</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                placeholder="Enter new name"
                value={newName}
                onChangeText={setNewName}
              />
            ) : (
              
              <Text style={styles.value}>{userInfo.name}</Text>
            )}

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
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditing(false);
                    setNewName('');
                    setNewAvatar(null);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                  <Text style={styles.buttonText}>Edit Info</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.changePasswordButton} >
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  changeAvatarText: {
    color: '#fff',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  changePasswordButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: '#555',
  },
});

export default UserInfo;
