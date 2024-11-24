import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

interface ClassInfo {
  class_id: string;
  class_name: string;
  class_type: string;
  lecturer_name: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  accountId: string | null;
  classList: ClassInfo[] | null;
  classId: string | null;
  assignmentsData: any[];
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  setAccountId: React.Dispatch<React.SetStateAction<string | null>>;
  setClassId: React.Dispatch<React.SetStateAction<string | null>>;
  setClassList: React.Dispatch<React.SetStateAction<ClassInfo[] | null>>;
  setAssignmentsData: React.Dispatch<React.SetStateAction<any[]>>;
  saveToken: (newToken: string) => Promise<void>;
  loadToken: () => Promise<void>;
  deleteToken: () => Promise<void>;
  setAuth: (auth: Partial<AuthContextType> | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [classList, setClassList] = useState<ClassInfo[] | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [assignmentsData, setAssignmentsData] = useState<any[]>([]);

  useEffect(() => {
    loadToken();
  }, []);

  const saveToken = async (newToken: string) => {
    try {
      setToken(newToken);
      await SecureStore.setItemAsync("userToken", newToken);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const loadToken = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync("userToken");
      setToken(savedToken);
    } catch (error) {
      console.error("Error loading token:", error);
    }
  };

  const deleteToken = async () => {
    try {
      setToken(null);
      await SecureStore.deleteItemAsync("userToken");
    } catch (error) {
      console.error("Error deleting token:", error);
    }
  };

  const setAuth = (auth: Partial<AuthContextType> | null) => {
    if (auth) {
      const {
        token = null,
        role = null,
        accountId = null,
        classList = null,
        classId = null,
        assignmentsData = [],
      } = auth;
      setToken(token);
      setRole(role);
      setAccountId(accountId);
      setClassList(classList);
      setClassId(classId);
      setAssignmentsData(assignmentsData);
    } else {
      setToken(null);
      setRole(null);
      setAccountId(null);
      setClassList(null);
      setClassId(null);
      setAssignmentsData([]);
    }
  };

  const value = {
    token,
    role,
    accountId,
    classId,
    setClassId,
    classList,
    setToken,
    setClassList,
    setRole,
    setAccountId,
    saveToken,
    loadToken,
    deleteToken,
    assignmentsData,
    setAssignmentsData,
    setAuth,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
