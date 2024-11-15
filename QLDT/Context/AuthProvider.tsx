import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [classId, setClassId] = useState(null);

  // Hàm lưu token và lưu vào SecureStore
  const saveToken = async (newToken) => {
    setToken(newToken);
    await SecureStore.setItemAsync('userToken', newToken);
  };

  // Hàm lấy token từ SecureStore
  const loadToken = async () => {
    const savedToken = await SecureStore.getItemAsync('userToken');
    setToken(savedToken);
  };

  // Hàm xóa token
  const deleteToken = async () => {
    setToken(null);
    await SecureStore.deleteItemAsync('userToken');
  };


  const value = {
    token,role,accountId,classId, setClassId, setRole, setAccountId, saveToken, loadToken, deleteToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để truy cập Auth Context
export const useAuth = () => useContext(AuthContext);
