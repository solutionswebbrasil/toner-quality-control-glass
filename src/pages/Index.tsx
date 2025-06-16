import React, { useState } from 'react';
import Dashboard from './Dashboard';
import RetornadoPage from './RetornadoPage';
import GarantiaPage from './GarantiaPage';
import { CurrentViewProvider } from '@/contexts/CurrentViewContext';

import GarantiaTonerPage from './GarantiaTonerPage';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'retornados':
        return <RetornadoPage />;
      case 'garantias':
        return <GarantiaPage />;
      case 'garantias-toners':
        return <GarantiaTonerPage />;
      default:
        return <div>Página não encontrada.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <CurrentViewProvider value={{ currentView, setCurrentView }}>
        {renderContent()}
      </CurrentViewProvider>
    </div>
  );
};

export default Index;
