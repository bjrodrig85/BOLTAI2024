import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState, Role } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, role?: Role) => Promise<void>;
  updateUserRole: (userId: string, role: Role) => void;
  assignToDepartment: (userId: string, departmentId: string) => void;
  removeFromDepartment: (userId: string, departmentId: string) => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users storage
const USERS_KEY = 'task_manager_users';
const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    // Create default admin user if no users exist
    const defaultAdmin: User = {
      id: '1',
      email: 'brunor.consultoria@gmail.com',
      name: 'Admin',
      role: 'admin',
      departmentIds: [],
      createdAt: new Date(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultAdmin]));
    return [defaultAdmin];
  }
  return JSON.parse(stored);
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const user = localStorage.getItem('current_user');
    if (user) {
      setAuthState({
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    
    if (!user || (email === 'brunor.consultoria@gmail.com' && password !== 'Sucesso@123')) {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem('current_user', JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('current_user');
    setAuthState({ user: null, isAuthenticated: false });
  };

  const register = async (email: string, password: string, name: string, role: Role = 'user') => {
    const users = getStoredUsers();
    
    if (users.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: users.length === 0 ? 'admin' : role,
      departmentIds: [],
      createdAt: new Date(),
    };

    users.push(newUser);
    saveUsers(users);
    
    if (!authState.user) {
      localStorage.setItem('current_user', JSON.stringify(newUser));
      setAuthState({ user: newUser, isAuthenticated: true });
    }
  };

  const getAllUsers = () => {
    return getStoredUsers();
  };

  const updateUserRole = (userId: string, role: Role) => {
    const users = getStoredUsers();
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, role } : u
    );
    saveUsers(updatedUsers);

    if (authState.user?.id === userId) {
      const updatedUser = { ...authState.user, role };
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      setAuthState({ ...authState, user: updatedUser });
    }
  };

  const assignToDepartment = (userId: string, departmentId: string) => {
    const users = getStoredUsers();
    const updatedUsers = users.map(u =>
      u.id === userId
        ? { ...u, departmentIds: [...new Set([...u.departmentIds, departmentId])] }
        : u
    );
    saveUsers(updatedUsers);

    if (authState.user?.id === userId) {
      const updatedUser = updatedUsers.find(u => u.id === userId)!;
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      setAuthState({ ...authState, user: updatedUser });
    }
  };

  const removeFromDepartment = (userId: string, departmentId: string) => {
    const users = getStoredUsers();
    const updatedUsers = users.map(u =>
      u.id === userId
        ? { ...u, departmentIds: u.departmentIds.filter(id => id !== departmentId) }
        : u
    );
    saveUsers(updatedUsers);

    if (authState.user?.id === userId) {
      const updatedUser = updatedUsers.find(u => u.id === userId)!;
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      setAuthState({ ...authState, user: updatedUser });
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      register,
      updateUserRole,
      assignToDepartment,
      removeFromDepartment,
      getAllUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}