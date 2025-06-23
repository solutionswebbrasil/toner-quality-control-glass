
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { Dashboard } from '@/components/Dashboard';
import { KpisPage } from '@/components/KpisPage';
import { ConfiguracoesPage } from '@/components/ConfiguracoesPage';
import { RetornadoForm } from '@/components/RetornadoForm';
import { RetornadoGrid } from '@/components/RetornadoGrid';
import { FornecedorForm } from '@/components/FornecedorForm';
import { FornecedorGrid } from '@/components/FornecedorGrid';
import { GarantiaForm } from '@/components/GarantiaForm';
import { GarantiaGrid } from '@/components/GarantiaGrid';
import { GarantiaTonerGrid } from '@/components/GarantiaTonerGrid';
import { TonerGrid } from '@/components/TonerGrid';
import { TonerForm } from '@/components/TonerForm';
import { AuditoriaForm } from '@/components/AuditoriaForm';
import { AuditoriaGrid } from '@/components/AuditoriaGrid';
import { NaoConformidadeForm } from '@/components/NaoConformidadeForm';
import { NaoConformidadeGrid } from '@/components/NaoConformidadeGrid';
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
import { CertificadoForm } from '@/components/CertificadoForm';
import { CertificadoGrid } from '@/components/CertificadoGrid';
import { FilialForm } from '@/components/FilialForm';
import { FilialGrid } from '@/components/FilialGrid';
import { ConfiguracoesRetornado } from '@/components/ConfiguracoesRetornado';
import { StatusCadastro } from '@/components/StatusCadastro';
import { UserManagement } from '@/components/UserManagement';
import { ApisIntegracoes } from '@/components/ApisIntegracoes';

export default function Index() {
  const [currentPage, setCurrentPage] = useState('inicio');

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'inicio':
        return <Dashboard />;
      case 'kpis':
        return <KpisPage />;
      case 'configuracoes':
        return <ConfiguracoesPage />;
      case 'retornados-registro':
        return <RetornadoForm />;
      case 'retornados-consulta':
        return <RetornadoGrid />;
      case 'fornecedores-cadastro':
        return <FornecedorForm />;
      case 'fornecedores-consulta':
        return <FornecedorGrid />;
      case 'garantias-registro':
        return <GarantiaForm />;
      case 'garantias-consulta':
        return <GarantiaGrid />;
      case 'garantias-toners':
        return <GarantiaTonerGrid />;
      case 'toners-cadastro':
        return <TonerForm />;
      case 'toners-consulta-principal':
        return <TonerGrid />;
      case 'auditorias-registro':
        return <AuditoriaForm onSuccess={() => {}} />;
      case 'auditorias-consulta':
        return <AuditoriaGrid />;
      case 'nc-registro':
        return <NaoConformidadeForm />;
      case 'nc-consulta':
        return <NaoConformidadeGrid />;
      case 'titulo-itpop-cadastro':
        return <TituloItPopForm onSuccess={() => {}} />;
      case 'titulo-itpop-consulta':
        return <ConsultaTitulosItPop onSuccess={() => {}} />;
      case 'registro-itpop':
        return <RegistroItPopForm onSuccess={() => {}} />;
      case 'registros-itpop-consulta':
        return <ConsultaRegistrosItPop onSuccess={() => {}} />;
      case 'visualizar-itpop':
        return <VisualizadorItPop onSuccess={() => {}} />;
      case 'titulo-bpmn-cadastro':
        return <TituloBpmnForm onSuccess={() => {}} />;
      case 'titulo-bpmn-consulta':
        return <ConsultaTitulosBpmn onSuccess={() => {}} />;
      case 'registro-bpmn':
        return <RegistroBpmnForm onSuccess={() => {}} />;
      case 'registros-bpmn-consulta':
        return <ConsultaRegistrosBpmn onSuccess={() => {}} />;
      case 'visualizar-bpmn':
        return <VisualizadorBpmn onSuccess={() => {}} />;
      case 'certificados-registro':
        return <CertificadoForm />;
      case 'certificados-consulta':
        return <CertificadoGrid />;
      case 'filiais-cadastro':
        return <FilialForm onSuccess={() => {}} />;
      case 'filiais-consulta':
        return <FilialGrid />;
      case 'config-retornado':
        return <ConfiguracoesRetornado />;
      case 'status-cadastro':
        return <StatusCadastro />;
      case 'usuarios':
        return <UserManagement />;
      case 'apis-integracoes':
        return <ApisIntegracoes />;
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
