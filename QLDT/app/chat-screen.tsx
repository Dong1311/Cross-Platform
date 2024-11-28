import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from "@/Context/AuthProvider";
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('37');
  const [content, setContent] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const flatListRef = useRef<FlatList>(null);

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
            return [...prev, receivedMessage];
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

  const fetchConversations = async () => {
    try {
      // Thêm logic để fetch conversations từ API của bạn
      // const response = await fetch('your_api_endpoint');
      // const data = await response.json();
      // setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.sender.id === Number(accountId) ? styles.sentContainer : styles.receivedContainer
          ]}>
            <Text style={[
              styles.messageText,
              item.sender.id === Number(accountId)  ? styles.sent : styles.received
            ]}>
              {item.content}
            </Text>
          </View>
        )}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
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
});

export default ChatScreen;
