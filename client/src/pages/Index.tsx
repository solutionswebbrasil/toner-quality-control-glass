
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { Dashboard } from '@/components/Dashboard';
import { KpisPage } from '@/components/KpisPage';
import { ConfiguracoesPage } from '@/components/ConfiguracoesPage';
import { GraficosRetornados } from '@/components/GraficosRetornados';
import { GraficosGarantias } from '@/components/GraficosGarantias';
import { GraficosNaoConformidades } from '@/components/GraficosNaoConformidades';
import { ConfiguracoesSistema } from '@/components/ConfiguracoesSistema';
import { UserManagementImproved } from '@/components/UserManagementImproved';

export default function Index() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'graficos-retornados':
        return <GraficosRetornados />;
      case 'graficos-garantias':
        return <GraficosGarantias />;
      case 'graficos-nao-conformidades':
        return <GraficosNaoConformidades />;
      case 'config-usuarios':
        return <UserManagementImproved />;
      case 'config-sistema':
        return <ConfiguracoesSistema />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
