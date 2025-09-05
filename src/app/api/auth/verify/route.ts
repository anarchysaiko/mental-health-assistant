import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1] || 
                  request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: '未提供认证令牌' },
        { status: 401 }
      );
    }
    
    const user = await verifyToken(token);
    
    if (user) {
      return NextResponse.json(
        { user: { id: user.id, username: user.username } },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: '无效的认证令牌' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('验证错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}