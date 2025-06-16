import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { TonerForm } from '@/components/TonerForm';
import { TonerGrid } from '@/components/TonerGrid';
import { RetornadoForm } from '@/components/RetornadoForm';
import { RetornadoGrid } from '@/components/RetornadoGrid';
import { RetornadoCharts } from '@/components/RetornadoCharts';
import { FornecedorForm } from '@/components/FornecedorForm';
import { FornecedorGrid } from '@/components/FornecedorGrid';
import { GarantiaForm } from '@/components/GarantiaForm';
import { GarantiaGrid } from '@/components/GarantiaGrid';
import { GarantiaGeralCharts } from '@/components/GarantiaGeralCharts';
import { GarantiaTonerGrid } from '@/components/GarantiaTonerGrid';
import { GarantiaTonerConsulta } from '@/components/GarantiaTonerConsulta';
import { GarantiaTonerCharts } from '@/components/GarantiaTonerCharts';
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
import { UserManagement } from '@/components/UserManagement';
import { useNaoConformidades } from '@/hooks/useNaoConformidades';
import { CertificadoForm } from '@/components/CertificadoForm';
import { CertificadoGrid } from '@/components/CertificadoGrid';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('welcome');
  const { naoConformidades } = useNaoConformidades();

  const renderContent = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomeScreen />;
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
      case 'garantias-gerais-graficos':
        return <GarantiaGeralCharts />;
      case 'garantias-toners':
        return <GarantiaTonerGrid />;
      case 'garantias-toners-consulta':
        return <GarantiaTonerConsulta />;
      case 'garantias-toners-graficos':
        return <GarantiaTonerCharts />;
      case 'auditorias-registro':
        return <AuditoriaForm onSuccess={() => {}} />;
      case 'auditorias-consulta':
        return <AuditoriaGrid />;
      case 'nao-conformidades-registro':
        return <NaoConformidadeForm />;
      case 'nao-conformidades-consulta':
        return <NaoConformidadeGrid />;
      case 'nao-conformidades-graficos':
        return <NaoConformidadeCharts naoConformidades={naoConformidades} />;
      case 'itpop-titulo-cadastro':
        return <TituloItPopForm onSuccess={() => {}} />;
      case 'itpop-titulo-consulta':
        return <ConsultaTitulosItPop onSuccess={() => {}} />;
      case 'itpop-registro':
        return <RegistroItPopForm onSuccess={() => {}} />;
      case 'itpop-registros-consulta':
        return <ConsultaRegistrosItPop onSuccess={() => {}} />;
      case 'itpop-visualizar':
        return <VisualizadorItPop onSuccess={() => {}} />;
      case 'bpmn-titulo-cadastro':
        return <TituloBpmnForm onSuccess={() => {}} />;
      case 'bpmn-titulo-consulta':
        return <ConsultaTitulosBpmn onSuccess={() => {}} />;
      case 'bpmn-registro':
        return <RegistroBpmnForm onSuccess={() => {}} />;
      case 'bpmn-registros-consulta':
        return <ConsultaRegistrosBpmn onSuccess={() => {}} />;
      case 'bpmn-visualizar':
        return <VisualizadorBpmn onSuccess={() => {}} />;
      case 'configuracoes-filiais-cadastro':
        return <FilialForm onSuccess={() => {}} />;
      case 'configuracoes-filiais-consulta':
        return <FilialGrid />;
      case 'configuracoes-retornado':
        return <ConfiguracoesRetornado />;
      case 'configuracoes-usuarios':
        return <UserManagement />;
      case 'certificados-registro':
        return <CertificadoForm onSuccess={() => {}} />;
      case 'certificados-consulta':
        return <CertificadoGrid />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
