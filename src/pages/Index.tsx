
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { TonerForm } from '@/components/TonerForm';
import { TonerGrid } from '@/components/TonerGrid';
import { RetornadoForm } from '@/components/RetornadoForm';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'toners-cadastro':
        return <TonerForm onSuccess={() => console.log('Toner cadastrado!')} />;
      case 'toners-consulta':
        return <TonerGrid />;
      case 'retornados-registro':
        return <RetornadoForm onSuccess={() => console.log('Retornado registrado!')} />;
      case 'retornados-consulta':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Consulta de Retornados</h2>
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl p-6">
              <p className="text-center text-slate-500">
                Funcionalidade de consulta e importação CSV em desenvolvimento...
              </p>
            </div>
          </div>
        );
      case 'retornados-graficos':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gráficos de Retornados</h2>
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl p-6">
              <p className="text-center text-slate-500">
                Gráficos analíticos em desenvolvimento...
              </p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default Index;
