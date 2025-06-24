
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './layout/Sidebar';

export interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarOpen(localStorage.getItem('sidebarOpen') === 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', String(sidebarOpen));
    }
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
      {/* Sidebar - Fixed */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 shadow-xl">
        <Sidebar
          isOpen={true}
          onNavigateTo={onPageChange}
          currentPage={currentPage}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
