import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { RegisterData } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const data: RegisterData = await request.json();
    
    // 验证输入
    if (!data.username || !data.password) {
      return NextResponse.json(
        { error: '用户名和密码是必需的' },
        { status: 400 }
      );
    }
    
    // 检查密码长度
    if (data.password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为6个字符' },
        { status: 400 }
      );
    }
    
    const result = await registerUser(data);
    
    if (result.success) {
      return NextResponse.json(
        { message: '用户注册成功' },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}