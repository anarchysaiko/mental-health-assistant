import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { LoginData } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const data: LoginData = await request.json();
    
    // 验证输入
    if (!data.username || !data.password) {
      return NextResponse.json(
        { error: '用户名和密码是必需的' },
        { status: 400 }
      );
    }
    
    const result = await loginUser(data);
    
    if (result.success) {
      // 设置cookie
      const response = NextResponse.json(
        { message: '登录成功', user: { id: result.user.id, username: result.user.username } },
        { status: 200 }
      );
      
      // 设置cookie，过期时间为7天
      response.cookies.set('auth-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7天
        path: '/'
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}