
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TonerForm } from '@/components/TonerForm';
import { TonerGrid } from '@/components/TonerGrid';
import { RetornadoForm } from '@/components/RetornadoForm';
import { RetornadoGrid } from '@/components/RetornadoGrid';
import { RetornadoCharts } from '@/components/RetornadoCharts';
import { FornecedorForm } from '@/components/FornecedorForm';
import { FornecedorGrid } from '@/components/FornecedorGrid';
import { GarantiaForm } from '@/components/GarantiaForm';
import { GarantiaGrid } from '@/components/GarantiaGrid';
import { GarantiaCharts } from '@/components/GarantiaCharts';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('toners-cadastro');

  const renderPage = () => {
    switch (currentPage) {
      case 'toners-cadastro':
        return <TonerForm onSuccess={() => console.log('Toner cadastrado!')} />;
      case 'toners-consulta':
        return <TonerGrid />;
      case 'retornados-registro':
        return <RetornadoForm onSuccess={() => console.log('Retornado registrado!')} />;
      case 'retornados-consulta':
        return <RetornadoGrid />;
      case 'retornados-graficos':
        return <RetornadoCharts />;
      case 'garantias-fornecedores-cadastro':
        return <FornecedorForm onSuccess={() => console.log('Fornecedor cadastrado!')} />;
      case 'garantias-fornecedores-consulta':
        return <FornecedorGrid />;
      case 'garantias-registro':
        return <GarantiaForm onSuccess={() => console.log('Garantia registrada!')} />;
      case 'garantias-consulta':
        return <GarantiaGrid />;
      case 'garantias-graficos':
        return <GarantiaCharts />;
      default:
        return <TonerForm onSuccess={() => console.log('Toner cadastrado!')} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default Index;
