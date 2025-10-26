'use client';

import type { User } from '@/types';
import React, { createContext, useState, useEffect } from 'react';

// A mock user for demonstration
const MOCK_USER: User = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Cashier',
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd verify a token from localStorage/cookies here
    // For now, we'll simulate a logged-out user after a short delay
    const timer = setTimeout(() => {
        setUser(null);
        setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, you'd get a JWT and user data from the API
    setUser(MOCK_USER);
    setLoading(false);
  };

  const logout = () => {
    // Mock API call
    setUser(null);
    // In a real app, you'd clear the token from storage
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
