
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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Classic Header */}
      <div className="fixed top-0 left-0 right-0 z-50 classic-header bg-gray-800 text-white">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-lg font-semibold">Sistema de Gestão da Qualidade</h1>
          <div className="text-sm">
            Usuário: {user?.email || 'Não logado'}
          </div>
        </div>
      </div>

      {/* Sidebar - Fixed */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 mt-12 classic-sidebar bg-gray-50 border-r border-gray-300">
        <Sidebar
          isOpen={true}
          onNavigateTo={onPageChange}
          currentPage={currentPage}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 mt-12">
        <main className="classic-container bg-gray-100 p-6">
          <div className="classic-content bg-white border border-gray-300 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
