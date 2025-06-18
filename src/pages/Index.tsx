
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
    console.log('🔥 Renderizando página:', currentPage);
    
    switch (currentPage) {
      case 'dashboard':
        console.log('✅ Renderizando WelcomeScreen');
        return <WelcomeScreen />;
      
      // Retornados
      case 'retornado-form':
        console.log('✅ Renderizando RetornadoForm');
        return <RetornadoForm />;
      case 'retornado-grid':
        console.log('✅ Renderizando RetornadoGrid');
        return <RetornadoGrid />;
      case 'retornado-charts':
        console.log('✅ Renderizando RetornadoCharts');
        return <RetornadoCharts />;
      
      // Garantias
      case 'garantia-form':
        console.log('✅ Renderizando GarantiaForm');
        return <GarantiaForm />;
      case 'garantia-grid':
        console.log('✅ Renderizando GarantiaGrid');
        return <GarantiaGrid />;
      case 'garantia-charts':
        console.log('✅ Renderizando GarantiaGrid (placeholder)');
        return <GarantiaGrid />; // Usar grid por enquanto
      case 'garantia-geral-charts':
        console.log('✅ Renderizando GarantiaGeralCharts');
        return <GarantiaGeralCharts />;
      case 'garantia-toner-consulta':
        console.log('✅ Renderizando GarantiaTonerGrid (consulta)');
        return <GarantiaTonerGrid />;
      case 'garantia-toner-grid':
        console.log('✅ Renderizando GarantiaTonerGrid');
        return <GarantiaTonerGrid />;
      case 'garantia-toner-charts':
        console.log('✅ Renderizando GarantiaTonerCharts');
        return <GarantiaTonerCharts />;
      
      // Toners
      case 'toner-form':
        console.log('✅ Renderizando TonerForm');
        return <TonerForm />;
      case 'toner-grid':
        console.log('✅ Renderizando TonerGrid');
        return <TonerGrid />;
      
      // Não Conformidades
      case 'nao-conformidade-form':
        console.log('✅ Renderizando NaoConformidadeForm');
        return <NaoConformidadeForm />;
      case 'nao-conformidade-grid':
        console.log('✅ Renderizando NaoConformidadeGrid');
        return <NaoConformidadeGrid />;
      case 'nao-conformidade-charts':
        console.log('✅ Renderizando NaoConformidadeCharts');
        return <NaoConformidadeCharts naoConformidades={[]} />;
      
      // Auditorias
      case 'auditoria-form':
        console.log('✅ Renderizando AuditoriaForm');
        return <AuditoriaForm onSuccess={() => {}} />;
      case 'auditoria-grid':
        console.log('✅ Renderizando AuditoriaGrid');
        return <AuditoriaGrid />;
      
      // Certificados
      case 'certificado-form':
        console.log('✅ Renderizando CertificadoForm');
        return <CertificadoForm />;
      case 'certificado-grid':
        console.log('✅ Renderizando CertificadoGrid');
        return <CertificadoGrid />;
      
      // Configurações
      case 'filiais':
        console.log('✅ Renderizando FilialGrid');
        return <FilialGrid />;
      case 'fornecedores':
        console.log('✅ Renderizando FornecedorGrid');
        return <FornecedorGrid />;
      case 'usuarios':
        console.log('✅ Renderizando UserManagement');
        return <UserManagement />;
      case 'consulta-usuarios':
        console.log('✅ Renderizando UserManagement (consulta)');
        return <UserManagement />;
      case 'apis-integracoes':
        console.log('✅ Renderizando ApisIntegracoes');
        return <ApisIntegracoes />;
      case 'configurar-retornados':
        console.log('✅ Renderizando ConfiguracoesRetornado');
        return <ConfiguracoesRetornado />;
      
      default:
        console.warn('❌ Página não encontrada:', currentPage);
        return <WelcomeScreen />;
    }
  };

  console.log('🚀 Index component renderizando com currentPage:', currentPage);

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
