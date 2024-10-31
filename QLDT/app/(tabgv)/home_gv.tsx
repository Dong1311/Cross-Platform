import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link, router } from 'expo-router';
import attendance from './attendance';

const Home = () => {
  // State để quản lý danh sách lớp học và tìm kiếm
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading

  interface ClassItem {
    classId: string;
    courseId: string;
    className: string;
    lecturerId: string;
    code: string; // Thêm trường code
  }

  // Hàm để tạo mã ngẫu nhiên
  const generateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const isTwoLetters = Math.random() < 0.5; // 50% xác suất là hai chữ cái
    if (isTwoLetters) {
      return letters.charAt(Math.floor(Math.random() * letters.length)) +
             letters.charAt(Math.floor(Math.random() * letters.length));
    } else {
      return numbers.charAt(Math.floor(Math.random() * numbers.length)) +
             letters.charAt(Math.floor(Math.random() * letters.length));
    }
  };

  // Hàm để lấy dữ liệu từ API và thêm mã code ngẫu nhiên
  const fetchClasses = async () => {
    try {
      const response = await fetch('https://6706925aa0e04071d2276c8e.mockapi.io/tailieuhoctap/class');
      const data = await response.json();
      console.log(data);
      // Thêm mã code ngẫu nhiên cho mỗi lớp
      const updatedClasses = data.map((cls: ClassItem) => ({
        ...cls,
        code: generateRandomCode(), // Thêm mã ngẫu nhiên cho mỗi lớp
      }));
      setClasses(updatedClasses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setLoading(false);
    }
  };

  // useEffect để gọi hàm fetchClasses khi component được render lần đầu
  useEffect(() => {
    fetchClasses();
  }, []);

  // Hàm để render từng phần tử trong danh sách lớp
  const renderItem = ({ item }: { item: ClassItem }) => (
    <TouchableOpacity style={styles.classContainer}>
      <Link href="/edit_class">
        <View style={styles.classContainer}>
          <View style={[styles.classIcon, { backgroundColor: getRandomColor() }]}>
            <Text style={styles.classCode}>{item.code}</Text> 
          </View>
          <View style={styles.classInfo}>
            <Text style={styles.classTitle}>{item.className}</Text>
            <Text style={styles.classTeacher}>{item.lecturerId}</Text>
          </View>
        </View>
      </Link>

    </TouchableOpacity>
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
        <Link href="/create_class">
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
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={classes.filter((cls) =>
            cls.className.toLowerCase().includes(search.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.classId}
        />
      )}

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
          <Icon name="group" size={24} color="purple" />
          <Text style={[styles.tabBarLabel, { color: 'purple' }]}>Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="assignment" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Bài tập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="calendar-today" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Lịch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton} onPress={()=> router.push('/attendance')}>
          <Icon name="checklist" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Điểm danh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton} onPress={()=> router.push('/(tabgv)/absence_list')}>
          <Icon name="checklist" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Ds xin vắng</Text>
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
  },
  tabBarLabel: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default Home;
