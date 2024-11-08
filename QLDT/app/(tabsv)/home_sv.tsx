import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';

interface ClassItem {
  class_id: string;
  class_name: string;
  attached_code: string | null;
  class_type: string;
  lecturer_name: string;
  student_count: number;
  start_date: string;
  end_date: string;
  status: string;
}

const Home = () => {
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState<ClassItem[]>([]); 
  const router = useRouter();

  useEffect(() => {
    fetchClassList();
  }, []);

  const fetchClassList = async () => {
    try {
      const response = await axios.post('http://160.30.168.228:8080/it5023e/get_class_list', {
        token: "ad69Nl",
        role: "STUDENT",
        account_id: "157"
      });

      if (response.data.meta.code === 1000) {
        setClasses(response.data.data);
      } else {
        console.error("Failed to fetch classes:", response.data.meta.message);
      }
    } catch (error) {
      console.error("Error fetching class list:", error);
    }
  };

  const renderItem = ({ item }: { item: ClassItem }) => (
    <View style={styles.classContainer}>
      <View style={[styles.classIcon, { backgroundColor: getRandomColor() }]}>
        <Text style={styles.classCode}>{item.class_type}</Text>
      </View>
      <View style={styles.classInfo}>
        <Text style={styles.classTitle}>{item.class_name}</Text>
        <Text style={styles.classTeacher}>{item.lecturer_name}</Text>
      </View>
    </View>
  );

  const getRandomColor = () => {
    const colors = ['#FF5252', '#FF9800', '#3F51B5', '#9C27B0', '#00BCD4', '#009688'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>V2</Text>
        </View>
        <Text style={styles.headerTitle}>Nhóm</Text>
        <Link href="/class_register">
          <Icon name="menu" size={30} color="black" />
        </Link>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Text style={styles.sectionTitle}>Lớp học</Text>
      <FlatList
        data={classes.filter((cls) =>
          cls.class_name.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.class_id}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarButton} onPress={() => router.push('/(tabsv)/notifications_screen')}>
          <Icon name="notifications" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Hoạt động</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton} onPress={() => router.push('/(tabsv)/leave_request')}>
          <Icon name="chat" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Trò chuyện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="group" size={24} color="purple" />
          <Text style={[styles.tabBarLabel, { color: 'purple' }]}>Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton} onPress={() => router.push('/(tabsv)/assignment_sv')}>
          <Icon name="assignment" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Bài tập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton}>
          <Icon name="calendar-today" size={24} color="black" />
          <Text style={styles.tabBarLabel}>Lịch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBarButton} onPress={() => router.push('/documents-class')}>
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
    marginTop: 20,
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
    flex: 1,
  },
  tabBarLabel: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default Home;
