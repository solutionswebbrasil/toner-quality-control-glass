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
import { NotFound } from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClient>
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
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/retornados/novo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <RetornadoForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/retornados/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <RetornadoGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/retornados/charts"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <RetornadoCharts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/toners/novo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TonerForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/toners/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TonerGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/toners/editar/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TonerEditForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/nova"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GarantiaForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GarantiaGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/editar/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GarantiaEditForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/charts"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GarantiaCharts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias/geral-charts"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GarantiaGeralCharts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias-toner/consulta"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GarantiaTonerConsulta />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias-toner/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GarantiaTonerGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/garantias-toner/charts"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <GarantiaTonerCharts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nao-conformidades/nova"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <NaoConformidadeForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nao-conformidades/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <NaoConformidadeGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nao-conformidades/charts"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <NaoConformidadeCharts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auditorias/nova"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AuditoriaForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auditorias/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AuditoriaGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificados/novo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CertificadoForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificados/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CertificadoGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/filiais"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <FilialGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/filiais/novo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <FilialForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fornecedores"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <FornecedorGrid />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fornecedores/novo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <FornecedorForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <UserManagement />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consulta-usuarios"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ConsultaUsuarios />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apis-integracoes"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ApisIntegracoes />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/configurar-retornados"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ConfiguracoesRetornado />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/bpmn/titulos/novo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TituloBpmnForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bpmn/registros/novo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <RegistroBpmnForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/bpmn/titulos/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ConsultaTitulosBpmn />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bpmn/registros/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ConsultaRegistrosBpmn />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bpmn/baixar"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <BaixarBpmn />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/bpmn/visualizar"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <VisualizadorBpmn />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/itpop/titulos/novo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TituloItPopForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/itpop/registros/novo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <RegistroItPopForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/itpop/titulos/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ConsultaTitulosItPop />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/itpop/registros/lista"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ConsultaRegistrosItPop />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/itpop/visualizar"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <VisualizadorItPop />
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
    </QueryClient>
  );
}

export default App;
