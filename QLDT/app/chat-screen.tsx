import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const ChatScreen: React.FC = () => {
  // Quản lý danh sách tin nhắn
  const [messages, setMessages] = useState([
    { id: 1, sender: 'me', content: 'Xin chào, bạn khỏe không?' },
    { id: 2, sender: 'other', content: 'Xin chào, mình khỏe. Còn bạn?' },
    { id: 3, sender: 'me', content: 'Mình cũng khỏe. Dạo này thế nào rồi?' },
    { id: 4, sender: 'other', content: 'Vẫn ổn bạn ạ, cảm ơn bạn đã hỏi!' },
  ]);

  // Quản lý nội dung tin nhắn mới
  const [newMessage, setNewMessage] = useState('');

  // Xử lý khi gửi tin nhắn
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return; // Không gửi nếu nội dung rỗng

    const newMessageObj = {
      id: messages.length + 1, // Tạo ID mới
      sender: 'me', // Người gửi là "me"
      content: newMessage.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessageObj]); // Cập nhật danh sách tin nhắn
    setNewMessage(''); // Xóa nội dung trong input sau khi gửi
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị danh sách tin nhắn */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={
              item.sender === 'me' ? styles.messageSent : styles.messageReceived
            }
          >
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />

      {/* Input để nhập tin nhắn */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChangeText={setNewMessage} // Cập nhật nội dung khi người dùng nhập
        />
        <Button title="Gửi" color="#b30000" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: 10,
  },
  messageSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#b30000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '70%',
  },
  messageReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#ff6666',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '70%',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default ChatScreen;
