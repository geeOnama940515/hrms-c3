'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider: Checking stored user...');
    // Check if user is stored in localStorage
    try {
      const storedUser = localStorage.getItem('hrms_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('👤 AuthProvider: Found stored user:', parsedUser);
        setUser(parsedUser);
      } else {
        console.log('👤 AuthProvider: No stored user found');
      }
    } catch (error) {
      console.error('❌ AuthProvider: Error parsing stored user:', error);
      localStorage.removeItem('hrms_user');
    } finally {
      setIsLoading(false);
      console.log('✅ AuthProvider: Initial loading complete');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 AuthContext: Login function called with:', { email, passwordLength: password.length });
    setIsLoading(true);
    
    try {
      console.log('📡 AuthContext: Making API request to /api/auth/login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 AuthContext: API response status:', response.status);
      console.log('📡 AuthContext: API response ok:', response.ok);

      if (response.ok) {
        console.log('✅ AuthContext: Response OK, parsing JSON...');
        const data = await response.json();
        console.log('📦 AuthContext: Response data:', data);
        
        if (data.user) {
          console.log('👤 AuthContext: Setting user:', data.user);
          setUser(data.user);
          localStorage.setItem('hrms_user', JSON.stringify(data.user));
          console.log('💾 AuthContext: User saved to localStorage');
          return true;
        } else {
          console.log('❌ AuthContext: No user in response data');
          return false;
        }
      } else {
        console.log('❌ AuthContext: Response not OK');
        const errorData = await response.text();
        console.log('❌ AuthContext: Error response:', errorData);
        return false;
      }
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
      console.log('🔄 AuthContext: Login process completed, isLoading set to false');
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext: Logout called');
    setUser(null);
    localStorage.removeItem('hrms_user');
    console.log('✅ AuthContext: User logged out and localStorage cleared');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  console.log('🔄 AuthContext: Current state:', { user: user?.email || 'none', isLoading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};