// 用户认证相关类型定义

export interface User {
  id: number;
  username: string;
  password: string; // 存储加密后的密码
  createdAt: Date;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}