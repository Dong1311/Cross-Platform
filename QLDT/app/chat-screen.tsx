// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
// import { useAuth } from '../Context/AuthProvider'; // Lấy useAuth
// import { connectSocket, sendMessage, disconnectSocket } from '../utils/websocket'; // Module WebSocket

// interface Message {
//   sender: { id: number };
//   receiver: { id: number };
//   content: string;
// }

// const ChatScreen: React.FC = () => {
//   const { accountId, token } = useAuth(); // Lấy thông tin từ AuthContext
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [content, setContent] = useState('');
//   const [receiverId, setReceiverId] = useState('');

//   useEffect(() => {
//     if (!accountId || !token) return;

//     connectSocket(parseInt(accountId, 10), (msg: Message) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     return () => disconnectSocket();
//   }, [accountId, token]);

//   const handleSendMessage = () => {
//     if (!content || !receiverId) return;

//     sendMessage(parseInt(receiverId, 10), content, token!);
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { sender: { id: parseInt(accountId!) }, receiver: { id: parseInt(receiverId, 10) }, content },
//     ]);
//     setContent('');
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={item.sender.id === parseInt(accountId!) ? styles.sent : styles.received}>
//             <Text>{item.content}</Text>
//           </View>
//         )}
//         contentContainerStyle={styles.messageList}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Receiver ID"
//           value={receiverId}
//           onChangeText={setReceiverId}
//           keyboardType="numeric"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Message"
//           value={content}
//           onChangeText={setContent}
//         />
//         <Button title="Send" onPress={handleSendMessage} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//   },
//   messageList: {
//     flexGrow: 1,
//     justifyContent: 'flex-end',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 8,
//     marginHorizontal: 5,
//   },
//   sent: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#d1f5d3',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   received: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#f5d1d1',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
// });

// export default ChatScreen;
