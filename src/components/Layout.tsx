
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

  // Debug log para ver mudanças de currentPage
  useEffect(() => {
    console.log('🏗️ Layout currentPage prop changed to:', currentPage);
  }, [currentPage]);

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

  // Admin tem acesso a todos os itens, outros usuários têm acesso limitado
  const filteredMenuItems = menuItems.filter(item => {
    // Admin sempre tem acesso
    if (profile?.role === 'admin') {
      return true;
    }
    
    // Para outros usuários, filtrar configurações
    if (item.id === 'configuracoes') {
      return false;
    }
    
    return true;
  });

  console.log('🏗️ Layout render - currentPage:', currentPage, 'profile:', profile?.role);

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
            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Página atual:</strong> {currentPage}
                {profile && (
                  <>
                    {' | '}
                    <strong>Usuário:</strong> {profile.nome_completo} ({profile.role})
                  </>
                )}
              </p>
            </div>
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
