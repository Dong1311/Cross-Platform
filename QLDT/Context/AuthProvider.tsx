import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
interface AuthProviderProps {
  children: React.ReactNode;
}
interface AuthContextType {
  token: string | null;
  role: string | null;
  accountId: string | null;
  classList: any[] | null;
  classId: string | null;
  assignmentsData: any[];
  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
  setAccountId: (accountId: string | null) => void;
  setClassId: (classId: string | null) => void;
  setClassList: (classList: any[] | null) => void;
  setAssignmentsData: (data: any[]) => void;
  saveToken: (newToken: string) => Promise<void>;
  loadToken: () => Promise<void>;
  deleteToken: () => Promise<void>;
}

// const AuthContext = createContext();
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // const [token, setToken] = useState(null);
  // const [role, setRole] = useState(null);
  // const [accountId, setAccountId] = useState(null);
  // const [classList, setClassList] = useState(null);
  // const [classId, setClassId] = useState(null);
  // const [assignmentsData, setAssignmentsData] = useState([]);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [classList, setClassList] = useState<any[] | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [assignmentsData, setAssignmentsData] = useState<any[]>([]);

  // Hàm lưu token và lưu vào SecureStore
  const saveToken = async (newToken: string) => {
    setToken(newToken);
    await SecureStore.setItemAsync("userToken", newToken);
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
    token,
    role,
    accountId,
    classId,
    setClassId,
    classList,
    setToken: (newToken: string | null) => setToken(newToken),      //Toi moi them dong nay cho het loi
    setClassList,
    setRole,
    setAccountId,
    saveToken,
    loadToken,
    deleteToken,
    assignmentsData,
    setAssignmentsData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để truy cập Auth Context
// export const useAuth = () => useContext(AuthContext);
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
