
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { menuItems } from './layout/menuItems';
import { LayoutProps } from './layout/types';

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { profile, loading } = useAuth();

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

  // Mostrar todos os itens para admin, filtrar outros usuários conforme necessário
  const filteredMenuItems = menuItems.filter(item => {
    // Sempre mostrar para admin
    if (profile?.role === 'admin') {
      return true;
    }
    
    // Para usuários comuns, esconder apenas configurações por enquanto
    if (item.id === 'configuracoes') {
      return false;
    }
    
    return true;
  });

  console.log('Layout - Profile:', profile, 'Loading:', loading);
  console.log('Filtered menu items:', filteredMenuItems.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        currentPage={currentPage}
        onPageChange={onPageChange}
        filteredMenuItems={filteredMenuItems}
      />

      <div className="flex-1 flex flex-col">
        <Header
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        {/* Main Content */}
        <main className="flex-1 pt-16 overflow-auto">
          <div className="p-4 max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
