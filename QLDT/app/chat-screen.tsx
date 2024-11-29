import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from "@/Context/AuthProvider";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface Sender {
  id: number;
  name: string;
  avatar: string;
}

interface Message {
  message_id: string;
  message: string;
  sender: Sender;
  created_at: string;
  unread: number;
}

interface ApiResponse {
  data: {
    conversation: Message[];
    is_blocked: string;
  };
  meta: {
    code: string;
    message: string;
  };
}

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('37');
  const [content, setContent] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const { token, accountId, email } = useAuth() as AuthContextType;

  interface AuthContextType {
    token: string;
    accountId: string;
    email: string;
  }

  useEffect(() => {
    const socket = new SockJS('http://157.66.24.126:8080/ws');
    const newClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    newClient.onConnect = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      
      newClient.subscribe(`/user/${accountId}/inbox`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received message from inbox:', receivedMessage);
        
        setMessages((prev) => {
          if (!prev.some(msg => msg.id === receivedMessage.id)) {
            const allMessages = [...prev, receivedMessage];
            return allMessages.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          }
          return prev;
        });
      });
      
      fetchConversations();
    };

    newClient.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    };

    newClient.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setIsConnected(false);
    };

    try {
      clientRef.current = newClient;
      newClient.activate();
    } catch (error) {
      console.error('Error activating STOMP client:', error);
      setIsConnected(false);
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [accountId, token]);

  const sendMessage = async () => {
    if (!clientRef.current || !isConnected) {
      console.error('STOMP client is not connected');
      try {
        await clientRef.current?.activate();
        return;
      } catch (error) {
        console.error('Failed to reconnect:', error);
        return;
      }
    }

    const message = {
      sender: email,
      receiver: { id: receiverId },
      content,
      token,
    };

    console.log('Sending message:', message);
    
    try {
      clientRef.current.publish({
        destination: '/chat/message',
        body: JSON.stringify(message),
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreMessages) {
      fetchConversations(currentPage + 1);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.y;
    if (offset < 50) {
      handleLoadMore();
    }
  };

  const fetchConversations = async (page = 0) => {
    if (isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    try {
      const response = await axios.post<ApiResponse>('http://157.66.24.126:8080/it5023e/get_conversation', {
        token: token,
        index: page.toString(),
        count: "20",
        conversation_id: "5575",
        mark_as_read: "true"
      });

      if (response.data.meta?.code === "1000") {
        const newMessages = response.data.data.conversation;
        
        if (newMessages.length < 5) {
          setHasMoreMessages(false);
        }

        setMessages(prevMessages => {
          const mappedMessages = newMessages.map(msg => ({
            id: msg.message_id,
            content: msg.message,
            sender: msg.sender,
            created_at: msg.created_at,
            unread: msg.unread
          }));
          
          const uniqueMessages = mappedMessages.filter(
            newMsg => !prevMessages.some(prevMsg => prevMsg.id === newMsg.id)
          );
          
          const allMessages = [...prevMessages, ...uniqueMessages];
          
          return allMessages.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });

        setCurrentPage(page);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Lỗi Axios:', error.response?.data || error.message);
      } else {
        console.error('Lỗi không xác định:', error);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Họ Và Tên 20218286</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        data={messages}
        inverted={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.sender.id === Number(accountId) ? styles.sentContainer : styles.receivedContainer
          ]}>
            <Text style={[
              styles.messageText,
              item.sender.id === Number(accountId) ? styles.sent : styles.received
            ]}>
              {item.content}
            </Text>
          </View>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={() => (
          isLoadingMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="red" />
            </View>
          ) : null
        )}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10
        }}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="red" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Ionicons name="send" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    paddingTop: 40,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
  },
  sentContainer: {
    alignSelf: 'flex-end',
    marginLeft: 40,
  },
  receivedContainer: {
    alignSelf: 'flex-start',
    marginRight: 40,
  },
  messageText: {
    padding: 12,
    borderRadius: 15,
    fontSize: 16,
  },
  sent: {
    backgroundColor: 'red',
    color: 'white',
    borderTopRightRadius: 4,
  },
  received: {
    backgroundColor: '#E8E8E8',
    color: 'black',
    borderTopLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: 'white',
  },
  addButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ChatScreen;
