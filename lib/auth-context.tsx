'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore failures in environments where localStorage is unavailable (e.g., iOS private mode)
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore failures
    }
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for login state
    const isLoggedIn = safeLocalStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      setUser({ email: 'demo@nandatent.com' });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Local password check
    if (password === '123456') {
      safeLocalStorage.setItem('isLoggedIn', 'true');
      setUser({ email });
    } else {
      throw new Error('Invalid password');
    }
  };

  const signUp = async (email: string, password: string) => {
    // For simplicity, just sign in
    await signIn(email, password);
  };

  const logout = async () => {
    safeLocalStorage.removeItem('isLoggedIn');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
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