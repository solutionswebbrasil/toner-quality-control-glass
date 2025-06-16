
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
import { AuditoriaForm } from '@/components/AuditoriaForm';
import { AuditoriaGrid } from '@/components/AuditoriaGrid';
import { TituloItPopForm } from '@/components/TituloItPopForm';
import { ConsultaTitulosItPop } from '@/components/ConsultaTitulosItPop';
import { RegistroItPopForm } from '@/components/RegistroItPopForm';
import { VisualizadorItPop } from '@/components/VisualizadorItPop';
import { TituloBpmnForm } from '@/components/TituloBpmnForm';
import { RegistroBpmnForm } from '@/components/RegistroBpmnForm';
import { BaixarBpmn } from '@/components/BaixarBpmn';

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
      case 'auditorias-registro':
        return <AuditoriaForm onSuccess={() => console.log('Auditoria registrada!')} />;
      case 'auditorias-consulta':
        return <AuditoriaGrid />;
      case 'itpop-titulo-cadastro':
        return <TituloItPopForm onSuccess={() => console.log('Título IT/POP cadastrado!')} />;
      case 'itpop-titulo-consulta':
        return <ConsultaTitulosItPop onSuccess={() => console.log('Título IT/POP consultado!')} />;
      case 'itpop-registro':
        return <RegistroItPopForm onSuccess={() => console.log('IT/POP registrado!')} />;
      case 'itpop-visualizar':
        return <VisualizadorItPop onSuccess={() => console.log('IT/POP visualizado!')} />;
      case 'bpmn-titulo-cadastro':
        return <TituloBpmnForm onSuccess={() => console.log('Título BPMN cadastrado!')} />;
      case 'bpmn-registro':
        return <RegistroBpmnForm onSuccess={() => console.log('BPMN registrado!')} />;
      case 'bpmn-baixar':
        return <BaixarBpmn onSuccess={() => console.log('BPMN baixado!')} />;
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
