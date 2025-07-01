
import React, { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
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
import { TonerForm } from '@/components/TonerForm';
import { TonerGrid } from '@/components/TonerGrid';
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
import { CertificadoForm } from '@/components/CertificadoForm';
import { CertificadoGrid } from '@/components/CertificadoGrid';
import { FilialForm } from '@/components/FilialForm';
import { FilialGrid } from '@/components/FilialGrid';
import { ConfiguracoesRetornado } from '@/components/ConfiguracoesRetornado';
import { StatusCadastro } from '@/components/StatusCadastro';
import { ApisIntegracoes } from '@/components/ApisIntegracoes';
import UserManagement from '@/components/UserManagement';
import UserPermissions from '@/components/UserPermissions';
import NewUserRegistration from '@/components/NewUserRegistration';
import { GarantiaTonerCharts } from '@/components/GarantiaTonerCharts';
import { useNaoConformidades } from '@/hooks/useNaoConformidades';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { naoConformidades } = useNaoConformidades();

  const handleSuccess = () => {
    console.log('Action completed successfully');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'retornados-registro':
        return <RetornadoForm onSuccess={handleSuccess} />;
      case 'retornados-consulta':
        return <RetornadoGrid />;
      case 'retornados-graficos':
        return <RetornadoCharts />;
      case 'fornecedores-cadastro':
        return <FornecedorForm onSuccess={handleSuccess} />;
      case 'fornecedores-consulta':
        return <FornecedorGrid />;
      case 'garantias-registro':
        return <GarantiaForm onSuccess={handleSuccess} />;
      case 'garantias-consulta':
        return <GarantiaGrid />;
      case 'garantias-graficos-gerais':
        return <GarantiaGeralCharts />;
      case 'garantias-toners':
        return <GarantiaTonerGrid />;
      case 'garantias-toners-consulta':
        return <GarantiaTonerConsulta />;
      case 'garantias-toners-graficos':
        return <GarantiaTonerCharts />;
      case 'toners-cadastro':
        return <TonerForm onSuccess={handleSuccess} />;
      case 'toners-consulta-principal':
        return <TonerGrid />;
      case 'auditorias-registro':
        return <AuditoriaForm onSuccess={handleSuccess} />;
      case 'auditorias-consulta':
        return <AuditoriaGrid />;
      case 'nc-registro':
        return <NaoConformidadeForm />;
      case 'nc-consulta':
        return <NaoConformidadeGrid />;
      case 'nc-graficos':
        return <NaoConformidadeCharts naoConformidades={naoConformidades} />;
      case 'titulo-itpop-cadastro':
        return <TituloItPopForm onSuccess={handleSuccess} />;
      case 'titulo-itpop-consulta':
        return <ConsultaTitulosItPop onSuccess={handleSuccess} />;
      case 'registro-itpop':
        return <RegistroItPopForm onSuccess={handleSuccess} />;
      case 'registros-itpop-consulta':
        return <ConsultaRegistrosItPop onSuccess={handleSuccess} />;
      case 'visualizar-itpop':
        return <VisualizadorItPop onSuccess={handleSuccess} />;
      case 'titulo-bpmn-cadastro':
        return <TituloBpmnForm onSuccess={handleSuccess} />;
      case 'titulo-bpmn-consulta':
        return <ConsultaTitulosBpmn onSuccess={handleSuccess} />;
      case 'registro-bpmn':
        return <RegistroBpmnForm onSuccess={handleSuccess} />;
      case 'registros-bpmn-consulta':
        return <ConsultaRegistrosBpmn onSuccess={handleSuccess} />;
      case 'visualizar-bpmn':
        return <VisualizadorBpmn onSuccess={handleSuccess} />;
      case 'certificados-registro':
        return <CertificadoForm />;
      case 'certificados-consulta':
        return <CertificadoGrid />;
      case 'filiais-cadastro':
        return <FilialForm onSuccess={handleSuccess} />;
      case 'filiais-consulta':
        return <FilialGrid />;
      case 'config-retornado':
        return <ConfiguracoesRetornado />;
      case 'status-cadastro':
        return <StatusCadastro />;
      case 'apis-integracoes':
        return <ApisIntegracoes />;
      case 'usuarios':
        return <UserManagement />;
      case 'permissoes':
        return <UserPermissions />;
      case 'novo-usuario':
        return <NewUserRegistration />;
      case 'smtp-config':
        return <div className="p-6"><h1 className="text-2xl font-bold">Configurações SMTP</h1><p className="mt-4 text-gray-600">Configurações de email em desenvolvimento.</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderContent()}
        </Layout>
      </div>
    </ThemeProvider>
  );
}

export default App;
