import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Định nghĩa kiểu Assignment
interface Assignment {
  id: number;
  title: string;
  dueTime: string; 
  className: string;
  classLogo: string; 
  points?: number; 
  date: Date; // Sử dụng Date cho trường date
}

//fake data
const assignmentsData = {
  upcoming: [
    {
      id: 1,
      title: 'Bài tập Kiểm thử hộp đen',
      dueTime: 'Đến hạn lúc 23:59',
      className: '20241-C3-DBCL PM',
      classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkD2TROKcvLLnAh279xpe2PFqrcmvuN7KJCg&s',
      points: 0,
      date: new Date(2024, 9, 14), // 14 thg 10
    },
    {
      id: 2,
      title: 'Bài tập về nhà ngày 08/10/2024',
      dueTime: 'Đến hạn lúc 23:59',
      className: '154043 - Android',
      classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkD2TROKcvLLnAh279xpe2PFqrcmvuN7KJCg&s',
      points: 10,
      date: new Date(2024, 9, 14), // 14 thg 10
    },
    {
      id: 3,
      title: 'Bài tập mới cho ngày 15/10/2024',
      dueTime: 'Đến hạn lúc 23:59',
      className: '154044 - Android',
      classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkD2TROKcvLLnAh279xpe2PFqrcmvuN7KJCg&s',
      points: 10,
      date: new Date(2024, 9, 15), // 15 thg 10
    },
     {
      id: 4,
      title: 'Bài tập Kiểm thử hộp đen',
      dueTime: 'Đến hạn lúc 23:59',
      className: '20241-C3-DBCL PM',
      classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkD2TROKcvLLnAh279xpe2PFqrcmvuN7KJCg&s',
      points: 0,
      date: new Date(2024, 9, 16), 
    },
  ],
  overdue: [],
  completed: [],
};

const AssignmentApp = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const renderAssignments = (assignments: Assignment[]) => {
    if (assignments.length === 0) {
      return <Text style={styles.noAssignments}>Không có bài tập nào</Text>;
    }

    // Nhóm bài tập theo ngày
    const groupedAssignments: { [key: string]: Assignment[] } = {};
    assignments.forEach((assignment) => {
      const dateString = assignment.date.toLocaleDateString(); // Chuyển đổi thành chuỗi ngày
      if (!groupedAssignments[dateString]) {
        groupedAssignments[dateString] = [];
      }
      groupedAssignments[dateString].push(assignment);
    });

    return Object.keys(groupedAssignments).map((date) => (
      <View key={date}>
        <Text style={styles.dateHeader}>{date}</Text>
        {groupedAssignments[date].map((assignment) => (
          <View key={assignment.id} style={styles.assignmentItem}>
            <Image
              source={{ uri: assignment.classLogo }}
              style={styles.classLogo}
            />
            <View style={styles.assignmentDetails}>
              <Text style={styles.assignmentTitle}>{assignment.title}</Text>
              <Text style={styles.assignmentDue}>{assignment.dueTime}</Text>
              <Text style={styles.assignmentClassName}>{assignment.className}</Text>
              {(assignment.points != null && assignment.points != 0) && (
                <Text style={styles.assignmentPoints}>{assignment.points} điểm</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
         source={{ uri: '' }} 
         style={styles.userImage}
        />
        <Text style={styles.title}>Bài tập</Text>
        {/* Tabs */}
        <View style={styles.tabs}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' ? styles.activeTab : {},
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            Sắp tới
          </Text>
          <Text
            style={[
              styles.tabText,
              activeTab === 'overdue' ? styles.activeTab : {},
            ]}
            onPress={() => setActiveTab('overdue')}
          >
            Quá hạn
          </Text>
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' ? styles.activeTab : {},
            ]}
            onPress={() => setActiveTab('completed')}
          >
            Đã hoàn thành
          </Text>
        </View>
      </View>

      {/* Assignment List */}
      <ScrollView style={styles.assignmentList}>
        {activeTab === 'upcoming' && renderAssignments(assignmentsData.upcoming)}
        {activeTab === 'overdue' && renderAssignments(assignmentsData.overdue)}
        {activeTab === 'completed' && renderAssignments(assignmentsData.completed)}
      </ScrollView>

      {/* Thanh điều hướng dưới */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="notifications" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Hoạt động</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="chat" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Trò chuyện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="group" size={24} color="black" />
          <Text style={[styles.tabBarLabel, { color: 'purple' }]}>Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="assignment" size={24} color="purple" />
          <Text style={styles.tabBarLabel}>Bài tập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="calendar-today" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Lịch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#b71c1c',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
    color: '#b71c1c',
  },
  assignmentList: {
    padding: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  classLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  assignmentDetails: {
    marginLeft: 15,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  assignmentDue: {
    fontSize: 14,
    color: '#888',
  },
  assignmentClassName: {
    fontSize: 14,
    color: '#555',
  },
  assignmentPoints: {
    fontSize: 14,
    color: '#444',
  },
  noAssignments: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabBarButton: {
    alignItems: 'center',
  },
  tabBarLabel: {
    marginTop: 4,
    fontSize: 12,
  }
});

export default AssignmentApp;
