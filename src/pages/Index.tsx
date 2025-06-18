
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { RetornadoForm } from '@/components/RetornadoForm';
import { RetornadoGrid } from '@/components/RetornadoGrid';
import { RetornadoCharts } from '@/components/RetornadoCharts';
import { FornecedorForm } from '@/components/FornecedorForm';
import { FornecedorGrid } from '@/components/FornecedorGrid';
import { GarantiaForm } from '@/components/GarantiaForm';
import { GarantiaGrid } from '@/components/GarantiaGrid';
import { GarantiaGeralCharts } from '@/components/GarantiaGeralCharts';
import { GarantiaTonerGrid } from '@/components/GarantiaTonerGrid';
import { TonerGrid } from '@/components/TonerGrid';
import { GarantiaTonerCharts } from '@/components/GarantiaTonerCharts';
import { TonerForm } from '@/components/TonerForm';
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
import { UserManagement } from '@/components/UserManagement';
import { ApisIntegracoes } from '@/components/ApisIntegracoes';

export default function Index() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    console.log('Renderizando página:', currentPage);
    
    switch (currentPage) {
      case 'dashboard':
        return <WelcomeScreen />;
      
      // Retornados
      case 'retornado-form':
        return <RetornadoForm />;
      case 'retornado-grid':
        return <RetornadoGrid />;
      case 'retornado-charts':
        return <RetornadoCharts />;
      
      // Garantias
      case 'garantia-form':
        return <GarantiaForm />;
      case 'garantia-grid':
        return <GarantiaGrid />;
      case 'garantia-charts':
        return <GarantiaGrid />; // Usar grid por enquanto
      case 'garantia-geral-charts':
        return <GarantiaGeralCharts />;
      case 'garantia-toner-consulta':
        return <GarantiaTonerGrid />;
      case 'garantia-toner-grid':
        return <GarantiaTonerGrid />;
      case 'garantia-toner-charts':
        return <GarantiaTonerCharts />;
      
      // Toners
      case 'toner-form':
        return <TonerForm />;
      case 'toner-grid':
        return <TonerGrid />;
      
      // Não Conformidades
      case 'nao-conformidade-form':
        return <NaoConformidadeForm />;
      case 'nao-conformidade-grid':
        return <NaoConformidadeGrid />;
      case 'nao-conformidade-charts':
        return <NaoConformidadeCharts naoConformidades={[]} />;
      
      // Auditorias
      case 'auditoria-form':
        return <AuditoriaForm onSuccess={() => {}} />;
      case 'auditoria-grid':
        return <AuditoriaGrid />;
      
      // Certificados
      case 'certificado-form':
        return <CertificadoForm />;
      case 'certificado-grid':
        return <CertificadoGrid />;
      
      // Configurações
      case 'filiais':
        return <FilialGrid />;
      case 'fornecedores':
        return <FornecedorGrid />;
      case 'usuarios':
        return <UserManagement />;
      case 'consulta-usuarios':
        return <UserManagement />;
      case 'apis-integracoes':
        return <ApisIntegracoes />;
      case 'configurar-retornados':
        return <ConfiguracoesRetornado />;
      
      default:
        console.warn('Página não encontrada:', currentPage);
        return <WelcomeScreen />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
