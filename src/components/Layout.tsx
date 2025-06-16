import React from 'react';
import { Sidebar, SidebarContent, SidebarProvider } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ModeToggle';
import { 
  Package, 
  Shield, 
  FileText, 
  Settings, 
  BarChart3,
  Users,
  Building2,
  ClipboardList,
  FolderOpen,
  BookOpen,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentView } from '@/contexts/CurrentViewContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentView, setCurrentView } = useCurrentView();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-50">
        <Sidebar className="w-64 border-r bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <span className="font-bold text-lg">Controle de Insumos</span>
            <ModeToggle />
          </div>

          <nav className="mt-8 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Módulos Principais
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'dashboard' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('retornados')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'retornados' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Package className="w-4 h-4 mr-3" />
                  Retornados
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Garantias
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('garantias')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'garantias' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Shield className="w-4 h-4 mr-3" />
                  Garantias Gerais
                </button>
                <button
                  onClick={() => setCurrentView('garantias-toners')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'garantias-toners' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Wrench className="w-4 h-4 mr-3" />
                  Garantias de Toners
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cadastros
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('toners')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'toners' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Toners
                </button>
                <button
                  onClick={() => setCurrentView('filiais')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'filiais' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Building2 className="w-4 h-4 mr-3" />
                  Filiais
                </button>
                <button
                  onClick={() => setCurrentView('fornecedores')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'fornecedores' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Fornecedores
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Qualidade
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('nao-conformidades')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'nao-conformidades' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <ClipboardList className="w-4 h-4 mr-3" />
                  Não Conformidades
                </button>
                <button
                  onClick={() => setCurrentView('auditorias')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'auditorias' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <FolderOpen className="w-4 h-4 mr-3" />
                  Auditorias
                </button>
                <button
                  onClick={() => setCurrentView('certificados')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'certificados' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  Certificados
                </button>
                <button
                  onClick={() => setCurrentView('it-pops')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'it-pops' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  IT-POP
                </button>
                <button
                  onClick={() => setCurrentView('bpmns')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'bpmns' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <FileText className="w-4 h-4 mr-3" />
                  BPMN
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Configurações
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('settings')}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    currentView === 'settings' 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Configurações
                </button>
              </div>
            </div>
          </nav>
        </Sidebar>
        <SidebarContent className="flex-1 p-4">
          {children}
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
};
