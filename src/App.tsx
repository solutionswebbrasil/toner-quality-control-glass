
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';

// Layout and auth components
import { Layout } from '@/components/Layout';
import { AuthPage } from '@/components/AuthPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Page components
import { Dashboard } from '@/components/Dashboard';
import { RetornadoForm } from '@/components/RetornadoForm';
import { RetornadoGrid } from '@/components/RetornadoGrid';
import { RetornadoCharts } from '@/components/RetornadoCharts';
import { TonerForm } from '@/components/TonerForm';
import { TonerGrid } from '@/components/TonerGrid';
import { TonerEditForm } from '@/components/TonerEditForm';
import { GarantiaForm } from '@/components/GarantiaForm';
import { GarantiaGrid } from '@/components/GarantiaGrid';
import { GarantiaEditForm } from '@/components/GarantiaEditForm';
import { GarantiaCharts } from '@/components/GarantiaCharts';
import { GarantiaGeralCharts } from '@/components/GarantiaGeralCharts';
import { GarantiaTonerConsulta } from '@/components/GarantiaTonerConsulta';
import { GarantiaTonerGrid } from '@/components/GarantiaTonerGrid';
import { GarantiaTonerCharts } from '@/components/GarantiaTonerCharts';
import { NaoConformidadeForm } from '@/components/NaoConformidadeForm';
import { NaoConformidadeGrid } from '@/components/NaoConformidadeGrid';
import { NaoConformidadeCharts } from '@/components/NaoConformidadeCharts';
import { AuditoriaForm } from '@/components/AuditoriaForm';
import { AuditoriaGrid } from '@/components/AuditoriaGrid';
import { CertificadoForm } from '@/components/CertificadoForm';
import { CertificadoGrid } from '@/components/CertificadoGrid';
import { FilialForm } from '@/components/FilialForm';
import { FilialGrid } from '@/components/FilialGrid';
import { FornecedorForm } from '@/components/FornecedorForm';
import { FornecedorGrid } from '@/components/FornecedorGrid';
import { UserManagement } from '@/components/UserManagement';
import { ConsultaUsuarios } from '@/components/ConsultaUsuarios';
import { ApisIntegracoes } from '@/components/ApisIntegracoes';
import { ConfiguracoesRetornado } from '@/components/ConfiguracoesRetornado';
import { TituloBpmnForm } from '@/components/TituloBpmnForm';
import { RegistroBpmnForm } from '@/components/RegistroBpmnForm';
import { ConsultaTitulosBpmn } from '@/components/ConsultaTitulosBpmn';
import { ConsultaRegistrosBpmn } from '@/components/ConsultaRegistrosBpmn';
import { BaixarBpmn } from '@/components/BaixarBpmn';
import { VisualizadorBpmn } from '@/components/VisualizadorBpmn';
import { TituloItPopForm } from '@/components/TituloItPopForm';
import { RegistroItPopForm } from '@/components/RegistroItPopForm';
import { ConsultaTitulosItPop } from '@/components/ConsultaTitulosItPop';
import { ConsultaRegistrosItPop } from '@/components/ConsultaRegistrosItPop';
import { VisualizadorItPop } from '@/components/VisualizadorItPop';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  const handleSuccess = () => {
    console.log('Operation completed successfully');
  };

  const handlePageChange = (page: string) => {
    console.log('Page changed to:', page);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <div className="min-h-screen">
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="dashboard" onPageChange={handlePageChange}>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/retornados/novo"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="retornados-novo" onPageChange={handlePageChange}>
                        <RetornadoForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/retornados/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="retornados-lista" onPageChange={handlePageChange}>
                        <RetornadoGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/retornados/charts"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="retornados-charts" onPageChange={handlePageChange}>
                        <RetornadoCharts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/toners/novo"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="toners-novo" onPageChange={handlePageChange}>
                        <TonerForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/toners/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="toners-lista" onPageChange={handlePageChange}>
                        <TonerGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/toners/editar/:id"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="toners-editar" onPageChange={handlePageChange}>
                        <TonerEditForm 
                          toner={{} as any} 
                          onSuccess={handleSuccess} 
                          onCancel={() => {}} 
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/nova"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="garantias-nova" onPageChange={handlePageChange}>
                        <GarantiaForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="garantias-lista" onPageChange={handlePageChange}>
                        <GarantiaGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/editar/:id"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="garantias-editar" onPageChange={handlePageChange}>
                        <GarantiaEditForm 
                          garantia={{} as any} 
                          isOpen={true} 
                          onClose={() => {}} 
                          onSuccess={handleSuccess} 
                        />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/charts"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="garantias-charts" onPageChange={handlePageChange}>
                        <GarantiaCharts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/geral-charts"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="garantias-geral-charts" onPageChange={handlePageChange}>
                        <GarantiaGeralCharts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias-toner/consulta"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="garantias-toner-consulta" onPageChange={handlePageChange}>
                        <GarantiaTonerConsulta />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias-toner/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="garantias-toner-lista" onPageChange={handlePageChange}>
                        <GarantiaTonerGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias-toner/charts"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="garantias-toner-charts" onPageChange={handlePageChange}>
                        <GarantiaTonerCharts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nao-conformidades/nova"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="nao-conformidades-nova" onPageChange={handlePageChange}>
                        <NaoConformidadeForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nao-conformidades/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="nao-conformidades-lista" onPageChange={handlePageChange}>
                        <NaoConformidadeGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nao-conformidades/charts"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="nao-conformidades-charts" onPageChange={handlePageChange}>
                        <NaoConformidadeCharts naoConformidades={[]} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auditorias/nova"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="auditorias-nova" onPageChange={handlePageChange}>
                        <AuditoriaForm onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auditorias/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="auditorias-lista" onPageChange={handlePageChange}>
                        <AuditoriaGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificados/novo"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="certificados-novo" onPageChange={handlePageChange}>
                        <CertificadoForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificados/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="certificados-lista" onPageChange={handlePageChange}>
                        <CertificadoGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/filiais"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="filiais" onPageChange={handlePageChange}>
                        <FilialGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/filiais/novo"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="filiais-novo" onPageChange={handlePageChange}>
                        <FilialForm onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fornecedores"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="fornecedores" onPageChange={handlePageChange}>
                        <FornecedorGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fornecedores/novo"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="fornecedores-novo" onPageChange={handlePageChange}>
                        <FornecedorForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="usuarios" onPageChange={handlePageChange}>
                        <UserManagement />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consulta-usuarios"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="consulta-usuarios" onPageChange={handlePageChange}>
                        <ConsultaUsuarios />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apis-integracoes"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="apis-integracoes" onPageChange={handlePageChange}>
                        <ApisIntegracoes />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/configurar-retornados"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="configurar-retornados" onPageChange={handlePageChange}>
                        <ConfiguracoesRetornado />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/bpmn/titulos/novo"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="bpmn-titulos-novo" onPageChange={handlePageChange}>
                        <TituloBpmnForm onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bpmn/registros/novo"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="bpmn-registros-novo" onPageChange={handlePageChange}>
                        <RegistroBpmnForm onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/bpmn/titulos/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="bpmn-titulos-lista" onPageChange={handlePageChange}>
                        <ConsultaTitulosBpmn onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bpmn/registros/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="bpmn-registros-lista" onPageChange={handlePageChange}>
                        <ConsultaRegistrosBpmn onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bpmn/baixar"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="bpmn-baixar" onPageChange={handlePageChange}>
                        <BaixarBpmn onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/bpmn/visualizar"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="bpmn-visualizar" onPageChange={handlePageChange}>
                        <VisualizadorBpmn onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/itpop/titulos/novo"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="itpop-titulos-novo" onPageChange={handlePageChange}>
                        <TituloItPopForm onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/itpop/registros/novo"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="itpop-registros-novo" onPageChange={handlePageChange}>
                        <RegistroItPopForm onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/itpop/titulos/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="itpop-titulos-lista" onPageChange={handlePageChange}>
                        <ConsultaTitulosItPop onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/itpop/registros/lista"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="itpop-registros-lista" onPageChange={handlePageChange}>
                        <ConsultaRegistrosItPop onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/itpop/visualizar"
                  element={
                    <ProtectedRoute>
                      <Layout currentPage="itpop-visualizar" onPageChange={handlePageChange}>
                        <VisualizadorItPop onSuccess={handleSuccess} />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
