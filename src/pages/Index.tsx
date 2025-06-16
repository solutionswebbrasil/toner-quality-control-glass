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
import { NaoConformidadeForm } from '@/components/NaoConformidadeForm';
import { NaoConformidadeGrid } from '@/components/NaoConformidadeGrid';
import { NaoConformidadeCharts } from '@/components/NaoConformidadeCharts';
import { TituloItPopForm } from '@/components/TituloItPopForm';
import { ConsultaTitulosItPop } from '@/components/ConsultaTitulosItPop';
import { RegistroItPopForm } from '@/components/RegistroItPopForm';
import { ConsultaRegistrosItPop } from '@/components/ConsultaRegistrosItPop';
import { VisualizadorItPop } from '@/components/VisualizadorItPop';
import { TituloBpmnForm } from '@/components/TituloBpmnForm';
import { ConsultaTitulosBpmn } from '@/components/ConsultaTitulosBpmn';
import { RegistroBpmnForm } from '@/components/RegistroBpmnForm';
import { ConsultaRegistrosBpmn } from '@/components/ConsultaRegistrosBpmn';
import { VisualizadorBpmn } from '@/components/VisualizadorBpmn';
import { FilialForm } from '@/components/FilialForm';
import { FilialGrid } from '@/components/FilialGrid';
import { ConfiguracoesRetornado } from '@/components/ConfiguracoesRetornado';
import { useNaoConformidades } from '@/hooks/useNaoConformidades';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('toners-cadastro');
  const { naoConformidades } = useNaoConformidades();

  const renderContent = () => {
    switch (currentPage) {
      case 'toners-cadastro':
        return <TonerForm />;
      case 'toners-consulta':
        return <TonerGrid />;
      case 'retornados-registro':
        return <RetornadoForm />;
      case 'retornados-consulta':
        return <RetornadoGrid />;
      case 'retornados-graficos':
        return <RetornadoCharts />;
      case 'garantias-fornecedores-cadastro':
        return <FornecedorForm />;
      case 'garantias-fornecedores-consulta':
        return <FornecedorGrid />;
      case 'garantias-registro':
        return <GarantiaForm />;
      case 'garantias-consulta':
        return <GarantiaGrid />;
      case 'garantias-graficos':
        return <GarantiaCharts />;
      case 'auditorias-registro':
        return <AuditoriaForm />;
      case 'auditorias-consulta':
        return <AuditoriaGrid />;
      case 'nao-conformidades-registro':
        return <NaoConformidadeForm />;
      case 'nao-conformidades-consulta':
        return <NaoConformidadeGrid />;
      case 'nao-conformidades-graficos':
        return <NaoConformidadeCharts naoConformidades={naoConformidades} />;
      case 'itpop-titulo-cadastro':
        return <TituloItPopForm />;
      case 'itpop-titulo-consulta':
        return <ConsultaTitulosItPop />;
      case 'itpop-registro':
        return <RegistroItPopForm />;
      case 'itpop-registros-consulta':
        return <ConsultaRegistrosItPop />;
      case 'itpop-visualizar':
        return <VisualizadorItPop />;
      case 'bpmn-titulo-cadastro':
        return <TituloBpmnForm />;
      case 'bpmn-titulo-consulta':
        return <ConsultaTitulosBpmn />;
      case 'bpmn-registro':
        return <RegistroBpmnForm />;
      case 'bpmn-registros-consulta':
        return <ConsultaRegistrosBpmn />;
      case 'bpmn-visualizar':
        return <VisualizadorBpmn />;
      case 'configuracoes-filiais-cadastro':
        return <FilialForm />;
      case 'configuracoes-filiais-consulta':
        return <FilialGrid />;
      case 'configuracoes-retornado':
        return <ConfiguracoesRetornado />;
      default:
        return <TonerForm />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
