import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { debounce } from 'lodash';

interface User {
  account_id: string;
  last_name: string;
  first_name: string;
  email: string;
  avatar: string;
}

const convertGoogleDriveLink = (driveLink: string): string => {
  try {
    // Kiểm tra nếu là link Google Drive
    if (driveLink && driveLink.includes('drive.google.com')) {
      // Lấy file ID từ link
      const fileId = driveLink.match(/[-\w]{25,}/);
      if (fileId) {
        // Trả về link trực tiếp
        return `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
      }
    }
    return driveLink;
  } catch (error) {
    console.error('Lỗi xử lý link avatar:', error);
    return '';
  }
};

const NewChatScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch('http://157.66.24.126:8080/it5023e/search_account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: query,
          pageable_request: {
            page: "0",
            page_size: "100"
          }
        })
      });

      const result = await response.json();
      
      // Kiểm tra response hợp lệ
      if (result.meta.code === "1000" && result.data.page_content) {
        setUsers(result.data.page_content);
      } else {
        console.error('Lỗi API:', result.meta.message);
        setUsers([]);
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    // Chuẩn bị dữ liệu partner để gửi sang màn hình chat
    const partner_data = {
      id: user.account_id,
      name: `${user.first_name} ${user.last_name}`,
      avatar: user.avatar,
      email: user.email
    };

    // Chuyển sang màn hình chat với thông tin được mã hóa
    router.push({
      pathname: '/chat-screen',
      params: {
        partner_data: encodeURIComponent(JSON.stringify(partner_data)),
        conversation_id: '', // Để trống vì là cuộc trò chuyện mới
      }
    });
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => handleSelectUser(item)}
    >
      <Image 
        source={
          item.avatar 
            ? { uri: convertGoogleDriveLink(item.avatar) }
            : require('../assets/images/user.png')
        } 
        style={styles.avatar}
        defaultSource={require('../assets/images/user.png')}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {`${item.first_name} ${item.last_name}`}
        </Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      if (text) searchUsers(text);
    }, 500),
    []
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length >= 2) {
      debouncedSearch(text);
    } else {
      setUsers([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}><Ionicons name="arrow-back" size={24} color="white" /></Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trò truyện mới</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên, email..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Loading và Results */}
      <View style={styles.suggestedSection}>
        <Text style={styles.sectionTitle}>
          {searchText ? 'Kết quả tìm kiếm' : 'Đề xuất'}
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#DC2626" style={styles.loading} />
        ) : (
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={item => item.account_id}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>
                {searchText ? 'Không tìm thấy kết quả' : 'Không có đề xuất'}
              </Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    color: '#fff',
    fontSize: 24,
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  suggestedSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  loading: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default NewChatScreen;
