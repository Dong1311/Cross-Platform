import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from "@/Context/AuthProvider";
import { router, useFocusEffect } from 'expo-router';


interface Partner {
  id: number;
  name: string;
  avatar: string;
}

interface LastMessage {
  sender: {
    id: number;
    name: string;
    avatar: string;
  };
  message: string;
  created_at: string;
  unread: number;
}

interface Conversation {
  id: number;
  partner: Partner;
  last_message: LastMessage;
  created_at: string;
  updated_at: string;
}

// Tạo instance axios
const api = axios.create({
  baseURL: 'http://157.66.24.126:8080/it5023e',
  headers: {
    'Content-Type': 'application/json',
  },
});

const convertGoogleDriveLink = (url: string): string => {
  if (!url) return 'https://via.placeholder.com/50'; // Ảnh mặc định

  // Kiểm tra nếu là link Google Drive
  if (url.includes('drive.google.com')) {
    // Lấy file ID từ URL
    const match = url.match(/[-\w]{25,}/);
    if (match) {
      const fileId = match[0];
      // Trả về link trực tiếp
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  
  return url; // Trả về URL gốc nếu không phải link Google Drive
};

export default function ListChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchConversations = async () => {
    try {
      const response = await api.post('/get_list_conversation', {
        token: token,
        index: '0',
        count: '20'
      });

      if (response.data.meta.code === '1000') {
        setConversations(response.data.data.conversations);
      } else {
        console.error('Lỗi:', response.data.meta.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Lỗi Axios:', error.response?.data || error.message);
      } else {
        console.error('Lỗi:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(() => {
    fetchConversations();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.messageItem} 
      onPress={() => {
        const partnerData = encodeURIComponent(JSON.stringify(item.partner));
        router.push(`/chat-screen?conversation_id=${item.id}&partner_data=${partnerData}`);
      }}
    >
      <Image 
        source={item.partner.avatar 
          ? { uri: convertGoogleDriveLink(item.partner.avatar) }
          : require('../assets/images/user.png')} 
        style={styles.avatar}
        onError={(error) => {
          console.log('Lỗi tải ảnh:', error.nativeEvent.error);
        }}
      />
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.partner.name}</Text>
        <Text style={[
          styles.lastMessage,
          item.last_message.unread > 0 && styles.unreadMessage
        ]}>
          {item.last_message.message}
        </Text>
      </View>
      <Text style={styles.date}>{formatDate(item.last_message.created_at)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#DC2626" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchConversations}
              colors={['#DC2626']}
            />
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/new-chat')}>
        <Icon name="edit" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: '#f0f0f0', // Màu nền khi đang tải ảnh
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#DC2626',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
