import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type SubmitAssignmentScreenProps = {
  route: RouteProp<{ params: { id: string } }, 'params'>;
  navigation: StackNavigationProp<any, any>;
};


const SubmitAssignmentScreen: React.FC<SubmitAssignmentScreenProps> = ({ route, navigation }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Test data for assignment
  const assignment = {
    id: 1,
    title: 'Bài tập Kiểm thử hộp đen',
    dueTime: 'Đến hạn lúc 23:59',
    className: '20241-C3-DBCL PM',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkD2TROKcvLLnAh279xpe2PFqrcmvuN7KJCg&s',
    points: 0,
    date: new Date(2024, 9, 14), // 14 thg 10
    guidelines: 'Hãy viết mã cho hàm kiểm tra NextDate theo nội dung yêu cầu như được mô tả trong bài giảng. Được sử dụng các ngôn ngữ lập trình đã học',
  };

  // Function to pick a file from media library
  const pickFile = async () => {
    // Request permission to access media library
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    // Open image picker
    let picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!picked.canceled && picked.assets && picked.assets.length > 0) {
      setSelectedFile(picked.assets[0].uri); // Lấy URI từ assets của kết quả
    }    
    
  };

  return (
    <View style={styles.container}>
      {/* Header displaying class info */}
      <View style={styles.header}>
        <Image source={{ uri: assignment.classLogo }} style={styles.classLogo} />
        <View>
          <Text style={styles.className}>{assignment.className}</Text>
          <Text style={styles.assignmentTitle}>{assignment.title}</Text>
        </View>
      </View>

      {/* Display assignment details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailItem}>Due Time: {assignment.dueTime}</Text>
        <Text style={styles.detailItem}>Points: {assignment.points}</Text>
        <Text style={styles.detailItem}>Submission Date: {assignment.date.toDateString()}</Text>
        <Text style={styles.guidelines}>Instructor's Guidelines:</Text>
        <Text style={styles.guidelineText}>{assignment.guidelines}</Text>
      </View>

      {/* Button to attach a file */}
      <TouchableOpacity style={styles.attachButton} onPress={pickFile}>
        <Text style={styles.attachButtonText}>Đính kèm file</Text>
      </TouchableOpacity>

      {/* Display selected file (image or text) */}
      {selectedFile && (
        <View style={styles.selectedFileContainer}>
          {selectedFile.match(/\.(jpeg|jpg|gif|png)$/) ? (
            <Image source={{ uri: selectedFile }} style={styles.selectedImage} />
          ) : (
            <Text style={styles.fileText}>File đã chọn: {selectedFile}</Text>
          )}
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Assignment</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  classLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  assignmentTitle: {
    fontSize: 16,
    color: '#555',
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  guidelines: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  guidelineText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  attachButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  attachButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedFileContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  fileText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubmitAssignmentScreen;
