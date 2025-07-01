
import React from 'react';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
