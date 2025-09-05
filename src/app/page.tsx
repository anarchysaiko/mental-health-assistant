'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HomeView from '../components/HomeView';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  return (
    <ProtectedRoute>
      <div className="relative">
        <div className="absolute top-4 right-4">
          <span className="mr-2 text-gray-700">欢迎, {user?.username}!</span>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            size="sm"
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            登出
          </Button>
        </div>
        <HomeView />
      </div>
    </ProtectedRoute>
  );
}
