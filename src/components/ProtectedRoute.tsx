'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // 如果用户未认证，重定向到登录页面
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // 如果用户已认证，渲染子组件；否则返回null
  // 添加一个加载状态以避免在服务端渲染时出现问题
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}