import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from "@/Context/AuthProvider";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';

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
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(
    JSON.parse(decodeURIComponent(params.partner_data as string))
  );
  const [conversationId, setConversationId] = useState(params.conversation_id?.toString() || '');
  const [content, setContent] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const scrollPositionRef = useRef(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const MESSAGES_PER_PAGE = 20;
  const BUFFER_THRESHOLD = 10;
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNewChat, setIsNewChat] = useState(!params.conversation_id);

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
        
        if (isNewChat && receivedMessage.conversation_id) {
          setIsNewChat(false);
          setConversationId(receivedMessage.conversation_id.toString());
          // setMessages(prev => [...prev, {
          //   id: receivedMessage.id,
          //   content: receivedMessage.content,
          //   sender: receivedMessage.sender,
          //   created_at: receivedMessage.created_at,
          //   unread: receivedMessage.unread
          // }]);
          return;
        }
        
        if (receivedMessage.conversation_id === Number(conversationId)) {
          setMessages((prev) => {
            if (!prev.some(msg => msg.id === receivedMessage.id)) {
              if (!shouldAutoScroll) {
                setUnreadCount(count => count + 1);
              }
              const allMessages = [...prev, {
                id: receivedMessage.id,
                content: receivedMessage.content,
                sender: receivedMessage.sender,
                created_at: receivedMessage.created_at,
                unread: receivedMessage.unread
              }];
              return allMessages.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            }
            return prev;
          });
        }
      });
      
      if (!isNewChat) {
        fetchConversations(0);
      }
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
  }, [accountId, token, conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length === 0]);

  const sendMessage = async () => {
    if (!content.trim()) return;
    
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
      receiver: { id: partner.id },
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
      
      // if (isNewChat) {
      //   setMessages(prev => [...prev, {
      //     id: Date.now().toString(),
      //     content: content,
      //     sender: {
      //       id: Number(accountId),
      //       name: email,
      //       avatar: ''
      //     },
      //     created_at: new Date().toISOString(),
      //     unread: 0
      //   }]);
      // }
      
      setContent('');
      if (shouldAutoScroll) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
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
    const visibleLength = event.nativeEvent.layoutMeasurement.height;
    const contentLength = event.nativeEvent.contentSize.height;
    
    const distanceFromBottom = contentLength - visibleLength - offset;
    setShowScrollButton(distanceFromBottom > 100);
    
    if (offset < BUFFER_THRESHOLD * 50) {
      handleLoadMore();
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setShowScrollButton(false);
    setUnreadCount(0);
    setShouldAutoScroll(true);
  };

  const fetchConversations = async (page = 0) => {
    if (!conversationId) return;
    
    if (isLoadingMore || !hasMoreMessages) return;
    
    if (page === 0) {
      setIsLoadingInitial(true);
    }
    setIsLoadingMore(true);

    try {
      const response = await axios.post<ApiResponse>(
        'http://157.66.24.126:8080/it5023e/get_conversation',
        {
          token: token,
          index: page.toString(),
          count: MESSAGES_PER_PAGE.toString(),
          conversation_id: conversationId,
          mark_as_read: "true"
        }
      );

      if (response.data.meta?.code === "1000") {
        const newMessages = response.data.data.conversation;
        
        if (newMessages.length < MESSAGES_PER_PAGE) {
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
      console.error('Lỗi fetch conversations:', error);
    } finally {
      setIsLoadingMore(false);
      setIsLoadingInitial(false);
    }
  };

  // Thêm hàm để format thời gian
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    // Chuyển đổi sang múi giờ Việt Nam (UTC+7)
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    
    return vietnamTime.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Sử dụng định dạng 24 giờ
    });
  };

  // Thêm hàm convertGoogleDriveLink từ list-chat.tsx
  const convertGoogleDriveLink = (url: string): string => {
    if (!url) return 'https://via.placeholder.com/50';
    if (url.includes('drive.google.com')) {
      const match = url.match(/[-\w]{25,}/);
      if (match) {
        const fileId = match[0];
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
    return url;
  };

  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    
    const isCloseToBottom = contentHeight - currentOffset - scrollViewHeight < 20;
    setShouldAutoScroll(isCloseToBottom);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Image 
          source={
            partner.avatar 
              ? { uri: convertGoogleDriveLink(partner.avatar) }
              : require('../assets/images/user.png')
          }
          style={styles.avatar}
        />

        <Text style={styles.userName}>{partner.name}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        data={messages}
        inverted={false}
        keyExtractor={(item) => item.id}
        initialScrollIndex={messages.length - 1}
        onScrollToIndexFailed={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }, 100);
        }}
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
            <Text style={[
              styles.timeText,
              item.sender.id === Number(accountId) ? styles.sentTime : styles.receivedTime
            ]}>
              {formatMessageTime(item.created_at)}
            </Text>
          </View>
        )}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEndDrag}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={() => (
          isLoadingMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="red" />
            </View>
          ) : null
        )}
        ListEmptyComponent={() => (
          isNewChat ? (
            <View style={[styles.loadingContainer, { flex: 1, justifyContent: 'center' }]}>
              <Text style={styles.emptyText}>
                Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện
              </Text>
            </View>
          ) : isLoadingInitial ? (
            <View style={[styles.loadingContainer, { flex: 1, justifyContent: 'center' }]}>
              <ActivityIndicator size="large" color="red" />
            </View>
          ) : (
            <View style={[styles.loadingContainer, { flex: 1, justifyContent: 'center' }]}>
              <Text style={styles.emptyText}>
                Chưa có tin nhắn nào
              </Text>
            </View>
          )
        )}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: BUFFER_THRESHOLD
        }}
      />

      {showScrollButton && (
        <TouchableOpacity 
          style={styles.scrollButton} 
          onPress={scrollToBottom}
        >
          <View style={styles.scrollButtonInner}>
            <Ionicons name="arrow-down" size={24} color="white" />
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}

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
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
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
    backgroundColor: '#DC2626',
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
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sentTime: {
    textAlign: 'right',
    marginRight: 4,
  },
  receivedTime: {
    textAlign: 'left',
    marginLeft: 4,
  },
  scrollButton: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -20 }],
    bottom: 80,
    zIndex: 1000,
  },
  scrollButtonInner: {
    width: 50 ,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
});

export default ChatScreen;
