
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  X, 
  Home, 
  Package, 
  RotateCcw, 
  Shield, 
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Workflow,
  Building2,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: {
    id: string;
    label: string;
    modulo: string;
    submenu: string;
  }[];
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['toners', 'retornados']);
  const { hasPermission } = useAuth();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4" />,
      subItems: [
        { id: 'dashboard-overview', label: 'Visão Geral', modulo: 'Dashboard', submenu: 'Visualização Geral' }
      ]
    },
    {
      id: 'toners',
      label: 'Toners',
      icon: <Package className="h-4 w-4" />,
      subItems: [
        { id: 'toners-cadastro', label: 'Cadastro', modulo: 'Toners', submenu: 'Cadastro' },
        { id: 'toners-consulta', label: 'Consulta', modulo: 'Toners', submenu: 'Consulta' }
      ]
    },
    {
      id: 'retornados',
      label: 'Retornados',
      icon: <RotateCcw className="h-4 w-4" />,
      subItems: [
        { id: 'retornados-registro', label: 'Registro', modulo: 'Retornados', submenu: 'Registro' },
        { id: 'retornados-consulta', label: 'Consulta', modulo: 'Retornados', submenu: 'Consulta' },
        { id: 'retornados-graficos', label: 'Gráficos', modulo: 'Retornados', submenu: 'Gráficos' }
      ]
    },
    {
      id: 'garantias',
      label: 'Garantias',
      icon: <Shield className="h-4 w-4" />,
      subItems: [
        { id: 'garantias-fornecedores-cadastro', label: 'Fornecedores - Cadastro', modulo: 'Garantias', submenu: 'Fornecedores Cadastro' },
        { id: 'garantias-fornecedores-consulta', label: 'Fornecedores - Consulta', modulo: 'Garantias', submenu: 'Fornecedores Consulta' },
        { id: 'garantias-registro', label: 'Registro', modulo: 'Garantias', submenu: 'Registro' },
        { id: 'garantias-consulta', label: 'Consulta', modulo: 'Garantias', submenu: 'Consulta' },
        { id: 'garantias-gerais-graficos', label: 'Gráficos Gerais', modulo: 'Garantias', submenu: 'Gráficos Gerais' },
        { id: 'garantias-toners', label: 'Garantias Toners', modulo: 'Garantias', submenu: 'Garantias Toners' },
        { id: 'garantias-toners-consulta', label: 'Toners - Consulta', modulo: 'Garantias', submenu: 'Toners Consulta' },
        { id: 'garantias-toners-graficos', label: 'Toners - Gráficos', modulo: 'Garantias', submenu: 'Toners Gráficos' }
      ]
    },
    {
      id: 'auditorias',
      label: 'Auditorias',
      icon: <ClipboardCheck className="h-4 w-4" />,
      subItems: [
        { id: 'auditorias-registro', label: 'Registro', modulo: 'Auditorias', submenu: 'Registro' },
        { id: 'auditorias-consulta', label: 'Consulta', modulo: 'Auditorias', submenu: 'Consulta' }
      ]
    },
    {
      id: 'nao-conformidades',
      label: 'Não Conformidades',
      icon: <AlertTriangle className="h-4 w-4" />,
      subItems: [
        { id: 'nao-conformidades-registro', label: 'Registro', modulo: 'Não Conformidades', submenu: 'Registro' },
        { id: 'nao-conformidades-consulta', label: 'Consulta', modulo: 'Não Conformidades', submenu: 'Consulta' },
        { id: 'nao-conformidades-graficos', label: 'Gráficos', modulo: 'Não Conformidades', submenu: 'Gráficos' }
      ]
    },
    {
      id: 'itpop',
      label: 'IT/POP',
      icon: <FileText className="h-4 w-4" />,
      subItems: [
        { id: 'itpop-titulo-cadastro', label: 'Título - Cadastro', modulo: 'IT/POP', submenu: 'Título Cadastro' },
        { id: 'itpop-titulo-consulta', label: 'Título - Consulta', modulo: 'IT/POP', submenu: 'Título Consulta' },
        { id: 'itpop-registro', label: 'Registro', modulo: 'IT/POP', submenu: 'Registro' },
        { id: 'itpop-registros-consulta', label: 'Registros - Consulta', modulo: 'IT/POP', submenu: 'Registros Consulta' },
        { id: 'itpop-visualizar', label: 'Visualizar', modulo: 'IT/POP', submenu: 'Visualizar' }
      ]
    },
    {
      id: 'bpmn',
      label: 'BPMN',
      icon: <Workflow className="h-4 w-4" />,
      subItems: [
        { id: 'bpmn-titulo-cadastro', label: 'Título - Cadastro', modulo: 'BPMN', submenu: 'Título Cadastro' },
        { id: 'bpmn-titulo-consulta', label: 'Título - Consulta', modulo: 'BPMN', submenu: 'Título Consulta' },
        { id: 'bpmn-registro', label: 'Registro', modulo: 'BPMN', submenu: 'Registro' },
        { id: 'bpmn-registros-consulta', label: 'Registros - Consulta', modulo: 'BPMN', submenu: 'Registros Consulta' },
        { id: 'bpmn-visualizar', label: 'Visualizar', modulo: 'BPMN', submenu: 'Visualizar' }
      ]
    },
    {
      id: 'certificados',
      label: 'Certificados',
      icon: <Shield className="h-4 w-4" />,
      subItems: [
        { id: 'certificados-registro', label: 'Registro', modulo: 'Certificados', submenu: 'Registro' },
        { id: 'certificados-consulta', label: 'Consulta', modulo: 'Certificados', submenu: 'Consulta' }
      ]
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: <Settings className="h-4 w-4" />,
      subItems: [
        { id: 'configuracoes-filiais-cadastro', label: 'Filiais - Cadastro', modulo: 'Configurações', submenu: 'Filiais Cadastro' },
        { id: 'configuracoes-filiais-consulta', label: 'Filiais - Consulta', modulo: 'Configurações', submenu: 'Filiais Consulta' },
        { id: 'configuracoes-retornado', label: 'Retornado', modulo: 'Configurações', submenu: 'Retornado' },
        { id: 'configuracoes-usuarios', label: 'Usuários', modulo: 'Configurações', submenu: 'Usuários' }
      ]
    }
  ];

  const renderMenuItem = (item: MenuItem) => {
    const isExpanded = expandedMenus.includes(item.id);
    const hasVisibleSubItems = item.subItems?.some(subItem => 
      hasPermission(subItem.modulo, subItem.submenu, 'ver')
    );

    if (!hasVisibleSubItems) return null;

    return (
      <div key={item.id} className="space-y-1">
        <Button
          variant="ghost"
          onClick={() => toggleMenu(item.id)}
          className={cn(
            "w-full justify-between text-left font-normal hover-enhanced",
            "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          )}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </div>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        
        {isExpanded && item.subItems && (
          <div className="ml-6 space-y-1">
            {item.subItems.map(subItem => {
              if (!hasPermission(subItem.modulo, subItem.submenu, 'ver')) {
                return null;
              }
              
              return (
                <Button
                  key={subItem.id}
                  variant="ghost"
                  onClick={() => {
                    onPageChange(subItem.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full justify-start text-left font-normal hover-enhanced",
                    currentPage === subItem.id 
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  {subItem.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                SGQ PRO
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full pt-16 md:pt-4">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map(renderMenuItem)}
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
