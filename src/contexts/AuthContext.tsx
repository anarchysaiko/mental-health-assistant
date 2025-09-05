'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 检查用户是否已登录
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/verify', { method: 'GET' });
        const data = await response.json();
        
        if (response.ok && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('auth-token');
        }
      } catch (error) {
        console.error('验证用户状态失败:', error);
        localStorage.removeItem('auth-token');
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // 登录
  const login = async (data: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      } else {
        throw new Error(result.error || '登录失败');
      }
    } catch (error) {
      throw error;
    }
  };
  
  // 注册
  const register = async (data: { username: string; password: string; confirmPassword: string }) => {
    try {
      // 检查密码确认
      if (data.password !== data.confirmPassword) {
        throw new Error('两次输入的密码不一致');
      }
      
      // 注册用户
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: data.username, password: data.password }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return result;
      } else {
        throw new Error(result.error || '注册失败');
      }
    } catch (error) {
      throw error;
    }
  };
  
  // 登出
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth-token');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};