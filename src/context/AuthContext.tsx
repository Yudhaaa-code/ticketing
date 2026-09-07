'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'USER' | 'ADMIN' | 'ORGANIZER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, role?: UserRole, name?: string) => void;
  logout: () => void;
  isAdmin: boolean;
  loginAsDemo: (role: 'ADMIN' | 'USER') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage
    try {
      const savedUser = localStorage.getItem('goers_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error loading auth from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, role: UserRole = 'USER', name?: string) => {
    const defaultName = name || (email.split('@')[0]);
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      organizationName: role === 'ADMIN' ? 'Goers Official Promoter' : undefined,
    };

    setUser(newUser);
    localStorage.setItem('goers_auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('goers_auth_user');
  };

  const loginAsDemo = (role: 'ADMIN' | 'USER') => {
    if (role === 'ADMIN') {
      login('admin@goersapp.id', 'ADMIN', 'Administrator Goers');
    } else {
      login('budi.santoso@example.com', 'USER', 'Budi Santoso');
    }
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ORGANIZER';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
