'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { AuthModal } from './AuthModal';
import { Bot } from 'lucide-react';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-purple-500/20 animate-pulse mb-4">
          <Bot className="w-9 h-9 text-white" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
          <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span>Syncing AI Companion & Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated && <AuthModal />}
      {children}
    </>
  );
};
