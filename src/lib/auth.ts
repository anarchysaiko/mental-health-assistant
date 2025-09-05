import { RegisterData, LoginData, User } from '../types/auth';
import jwt from 'jsonwebtoken';
import { sql } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 根据用户名查找用户
export const findUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const result = await sql`
      SELECT id, username, password, created_at as createdAt 
      FROM users 
      WHERE username = ${username}
    `;
    
    // 检查查询结果是否存在
    if (result.rowCount === 0) {
      return null;
    }
    
    // 确保返回的对象符合 User 类型定义
    const row = result.rows[0];
    return {
      id: row.id,
      username: row.username,
      password: row.password,
      createdAt: new Date(row.createdat) // 注意：数据库字段名是 created_at，但查询时已转换为 createdAt
    };
  } catch (error) {
    console.error('查找用户错误:', error);
    return null;
  }
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
    const createdAt = new Date().toISOString();
    await sql`
      INSERT INTO users (username, password, created_at) 
      VALUES (${username}, ${hashedPassword}, ${createdAt})
    `;
    
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
    const { password: _, ...userWithoutPassword } = user;
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
    const result = await sql`
      SELECT id, username, created_at as createdAt 
      FROM users 
      WHERE id = ${decoded.id}
    `;
    
    // 检查查询结果是否存在
    if (result.rowCount === 0) {
      return null;
    }
    
    // 确保返回的对象符合 User 类型定义
    const row = result.rows[0];
    return {
      id: row.id,
      username: row.username,
      password: '', // 注意：验证令牌时不需要密码
      createdAt: new Date(row.createdat) // 注意：数据库字段名是 created_at，但查询时已转换为 createdAt
    };
  } catch (error) {
    console.error('令牌验证错误:', error);
    return null;
  }
};