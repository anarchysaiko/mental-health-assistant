import dotenv from 'dotenv';
import { sql } from './db';
import path from 'path';

// 加载 .env.local 文件
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function initDatabase() {
  try {
    // 创建用户表
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

// 如果直接运行此脚本，则执行数据库初始化
if (require.main === module) {
  initDatabase();
}

export { initDatabase };