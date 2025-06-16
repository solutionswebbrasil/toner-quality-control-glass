
import React, { useState } from 'react';
import { Menu, Sun, Moon, Package, BarChart3, FileText, Shield, ClipboardCheck, Layers } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const menuItems = [
  { id: 'toners', label: 'Toners', icon: Package, subItems: [
    { id: 'toners-cadastro', label: 'Cadastro' },
    { id: 'toners-consulta', label: 'Consulta' }
  ]},
  { id: 'retornados', label: 'Retornados', icon: FileText, subItems: [
    { id: 'retornados-registro', label: 'Registro' },
    { id: 'retornados-consulta', label: 'Consulta' },
    { id: 'retornados-graficos', label: 'Gráficos' }
  ]},
  { id: 'garantias', label: 'Garantias', icon: Shield, subItems: [
    { id: 'garantias-fornecedores-cadastro', label: 'Cadastro Fornecedores' },
    { id: 'garantias-fornecedores-consulta', label: 'Consulta Fornecedores' },
    { id: 'garantias-registro', label: 'Registro Garantias' },
    { id: 'garantias-consulta', label: 'Consulta Garantias' },
    { id: 'garantias-graficos', label: 'Gráficos' }
  ]},
  { id: 'auditorias', label: 'Auditorias', icon: ClipboardCheck, subItems: [
    { id: 'auditorias-registro', label: 'Registro' },
    { id: 'auditorias-consulta', label: 'Consulta' }
  ]},
  { id: 'itpop', label: 'IT/POP', icon: FileText, subItems: [
    { id: 'itpop-titulo-cadastro', label: 'Cadastro Títulos' },
    { id: 'itpop-titulo-consulta', label: 'Consulta Títulos' },
    { id: 'itpop-registro', label: 'Registro IT/POP' },
    { id: 'itpop-registros-consulta', label: 'POP/ITs Cadastrados' },
    { id: 'itpop-visualizar', label: 'Visualizar IT/POP' }
  ]},
  { id: 'bpmn', label: 'BPMN', icon: Layers, subItems: [
    { id: 'bpmn-titulo-cadastro', label: 'Cadastro Títulos' },
    { id: 'bpmn-titulo-consulta', label: 'Consulta Títulos' },
    { id: 'bpmn-registro', label: 'Registro BPMN' },
    { id: 'bpmn-registros-consulta', label: 'BPMNs Cadastrados' },
    { id: 'bpmn-visualizar', label: 'Visualizar BPMN' }
  ]}
];

export const Layout: React.FC<LayoutProps> = ({ children, currentPage = 'toners-cadastro', onPageChange }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['toners', 'retornados', 'garantias', 'auditorias', 'itpop', 'bpmn']);
  const { theme, toggleTheme } = useTheme();

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 transition-all duration-300 z-50 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-slate-700/50 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SGQ PRO
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation with ScrollArea */}
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.subItems) {
                      toggleSubmenu(item.id);
                    } else {
                      onPageChange?.(item.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200",
                    "hover:bg-white/50 dark:hover:bg-slate-800/50",
                    currentPage.startsWith(item.id) && "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-200/50 dark:border-blue-800/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.subItems && (
                        <BarChart3 className={cn(
                          "w-4 h-4 transition-transform",
                          expandedMenus.includes(item.id) && "rotate-90"
                        )} />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {item.subItems && !sidebarCollapsed && expandedMenus.includes(item.id) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => onPageChange?.(subItem.id)}
                        className={cn(
                          "w-full text-left p-2 rounded-lg transition-colors text-sm",
                          "hover:bg-white/30 dark:hover:bg-slate-800/30",
                          currentPage === subItem.id && "bg-white/40 dark:bg-slate-800/40 font-medium"
                        )}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Header */}
        <header className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Sistema de Gestão da Qualidade
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
