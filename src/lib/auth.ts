import { RegisterData, LoginData, User } from '../types/auth';
import jwt from 'jsonwebtoken';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// 数据库文件路径
const DB_PATH = './database.db';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 初始化数据库
const initDatabase = async () => {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  return db;
};

// 根据用户名查找用户
export const findUserByUsername = async (username: string): Promise<User | null> => {
  const db = await initDatabase();
  const row = await db.get('SELECT id, username, password, created_at as createdAt FROM users WHERE username = ?', [username]);
  await db.close();
  return row || null;
};

// 注册新用户
export const registerUser = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
  const { username, password } = data;
  
  try {
    // 检查用户是否已存在
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return { success: false, error: '用户名已存在' };
    }
    
    // 密码加密
    const bcrypt = (await import('bcrypt')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 插入新用户
    const db = await initDatabase();
    const createdAt = new Date();
    await db.run(
      'INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)',
      [username, hashedPassword, createdAt]
    );
    await db.close();
    
    return { success: true };
  } catch (error) {
    console.error('注册错误:', error);
    return { success: false, error: '注册失败' };
  }
};

// 验证用户登录
export const loginUser = async (data: LoginData): Promise<{ success: boolean; user?: Omit<User, 'password'>; token?: string; error?: string }> => {
  const { username, password } = data;
  
  try {
    // 查找用户
    const user = await findUserByUsername(username);
    if (!user) {
      return { success: false, error: '用户不存在' };
    }
    
    // 验证密码
    const bcrypt = (await import('bcrypt')).default;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: '密码错误' };
    }
    
    // 创建JWT令牌
    const { password: _password, ...userWithoutPassword } = user;
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return { success: true, user: userWithoutPassword, token };
  } catch (error) {
    console.error('登录错误:', error);
    return { success: false, error: '登录失败' };
  }
};

// 验证JWT令牌
export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    
    // 查找用户
    const db = await initDatabase();
    const user = await db.get('SELECT id, username, created_at as createdAt FROM users WHERE id = ?', [decoded.id]);
    await db.close();
    
    return user || null;
  } catch (error) {
    console.error('令牌验证错误:', error);
    return null;
  }
};