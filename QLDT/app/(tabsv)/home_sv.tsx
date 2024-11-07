import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, useRouter } from 'expo-router';

const Home = () => {
  // State để quản lý danh sách lớp học và tìm kiếm
  const [search, setSearch] = useState('');
  const router = useRouter(); 

  interface ClassItem {
    id: string;
    code: string;
    title: string;
    teacher: string;
  }

  
  // Giả định danh sách lớp học
  const classes = [
    { id: '1', code: 'IL', title: '154055 - IT4931 - Lưu trữ và xử lý dữ liệu', teacher: 'Tran The Hung' },
    { id: '2', code: 'NK', title: '2(2-1-0-4) Nhập môn Khoa học dữ liệu', teacher: 'Pham Van Hai' },
    { id: '3', code: 'TC', title: '20241 - Thuật toán ứng dụng', teacher: 'Nguyen Huu Duc' },
    { id: '4', code: '2T', title: '20241 - Tính toán tiến hóa', teacher: 'Huynh Thi Thanh Binh' },
    { id: '5', code: 'IW', title: '20241. IT4409. Web', teacher: 'Trinh Anh Phuc' },
    { id: '6', code: 'HI', title: 'Học sâu và ứng dụng', teacher: 'Trinh Anh Phuc' },
  ];

  // Hàm để render từng phần tử trong danh sách lớp
  const renderItem = ({ item }: { item: ClassItem }) => (
    <View style={styles.classContainer}>
      <View style={[styles.classIcon, { backgroundColor: getRandomColor() }]}>
        <Text style={styles.classCode}>{item.code}</Text>
      </View>
      <View style={styles.classInfo}>
        <Text style={styles.classTitle}>{item.title}</Text>
        <Text style={styles.classTeacher}>{item.teacher}</Text>
      </View>
    </View>
  );
  

  // Hàm để sinh màu ngẫu nhiên cho các biểu tượng lớp
  const getRandomColor = () => {
    const colors = ['#FF5252', '#FF9800', '#3F51B5', '#9C27B0', '#00BCD4', '#009688'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container}>
      {/* Phần tìm kiếm */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>V2</Text>
        </View>
        <Text style={styles.headerTitle}>Nhóm</Text>
        <Link href="/class_register">
          <Icon name="menu" size={30} color="black" />
        </Link>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Danh sách lớp học */}
      <Text style={styles.sectionTitle}>Lớp học</Text>
      <FlatList<ClassItem>
        data={classes.filter((cls) =>
          cls.title.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* Thanh điều hướng dưới */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarButton} onPress={()=>router.push('/(tabsv)/notifications_screen')}>
          <Icon name="notifications" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Hoạt động</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}
        onPress={()=>router.push('/(tabsv)/leave_request')}>
          <Icon name="chat" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Trò chuyện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="group" size={24} color="purple" />
          <Text style={[styles.tabBarLabel, { color: 'purple' }]}>Nhóm</Text>
        </TouchableOpacity>
        {/* <Link href="/assignment_sv" style={{ zIndex: 10 }}>
          <TouchableOpacity style={styles.tabBarButton}>
            <Icon name="assignment" size={24} color="black" />
            <Text style={styles.tabBarLabel}>Bài tập</Text>
          </TouchableOpacity>
        </Link> */}
        {/* <TouchableOpacity style={styles.tabBarButton}> */}
        <TouchableOpacity style={styles.tabBarButton} onPress={()=>router.push('/(tabsv)/assignment_sv')}>
          <Icon name="assignment" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Bài tập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}  >
          <Icon name="calendar-today" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Lịch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton} onPress={()=>router.push('/documents-class')}>
          <Icons name="file-document-multiple" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Tài liệu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  avatarContainer: {
    backgroundColor: 'orange',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    marginTop:50,
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginHorizontal: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  classList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  classContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    alignItems: 'center',
  },
  classIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  classCode: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classTeacher: {
    color: 'gray',
    fontSize: 14,
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
    flex:1
  },
  tabBarLabel: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default Home;
