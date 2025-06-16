
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  FileText, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Home,
  Package,
  RotateCcw,
  Building2,
  Wrench,
  CheckCircle,
  Search,
  Users,
  AlertTriangle,
  Award,
  FileImage,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';
import { ModeToggle } from './ModeToggle';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { usuario } = useAuth();

  const menuItems = [
    {
      id: 'welcome',
      label: 'Bem-vindo',
      icon: Home,
      page: 'welcome'
    },
    {
      id: 'toners',
      label: 'Toners',
      icon: Package,
      submenu: [
        { id: 'toners-cadastro', label: 'Cadastro de Toners', page: 'toners-cadastro' },
        { id: 'toners-consulta', label: 'Consulta de Toners', page: 'toners-consulta' }
      ]
    },
    {
      id: 'retornados',
      label: 'Retornados',
      icon: RotateCcw,
      submenu: [
        { id: 'retornados-registro', label: 'Registro de Retornados', page: 'retornados-registro' },
        { id: 'retornados-consulta', label: 'Consulta de Retornados', page: 'retornados-consulta' },
        { id: 'retornados-graficos', label: 'Gráficos de Retornados', page: 'retornados-graficos' }
      ]
    },
    {
      id: 'fornecedores',
      label: 'Fornecedores',
      icon: Building2,
      submenu: [
        { id: 'fornecedores-cadastro', label: 'Cadastro de Fornecedores', page: 'garantias-fornecedores-cadastro' },
        { id: 'fornecedores-consulta', label: 'Consulta de Fornecedores', page: 'garantias-fornecedores-consulta' }
      ]
    },
    {
      id: 'garantias',
      label: 'Garantias',
      icon: Shield,
      submenu: [
        { id: 'garantias-registro', label: 'Registro de Garantias Gerais', page: 'garantias-registro' },
        { id: 'garantias-consulta', label: 'Consulta de Garantias Gerais', page: 'garantias-consulta' },
        { id: 'garantias-gerais-graficos', label: 'Gráficos de Garantias Gerais', page: 'garantias-gerais-graficos' },
        { id: 'garantias-toners', label: 'Garantias de Toners Pendentes', page: 'garantias-toners' },
        { id: 'garantias-toners-consulta', label: 'Consulta de Garantias de Toners Finalizados', page: 'garantias-toners-consulta' },
        { id: 'garantias-toners-graficos', label: 'Gráficos de Garantias de Toners', page: 'garantias-toners-graficos' }
      ]
    },
    {
      id: 'auditorias',
      label: 'Auditorias',
      icon: CheckCircle,
      submenu: [
        { id: 'auditorias-registro', label: 'Registro de Auditorias', page: 'auditorias-registro' },
        { id: 'auditorias-consulta', label: 'Consulta de Auditorias', page: 'auditorias-consulta' }
      ]
    },
    {
      id: 'nao-conformidades',
      label: 'Não Conformidades',
      icon: AlertTriangle,
      submenu: [
        { id: 'nao-conformidades-registro', label: 'Registro de Não Conformidades', page: 'nao-conformidades-registro' },
        { id: 'nao-conformidades-consulta', label: 'Consulta de Não Conformidades', page: 'nao-conformidades-consulta' },
        { id: 'nao-conformidades-graficos', label: 'Gráficos de Não Conformidades', page: 'nao-conformidades-graficos' }
      ]
    },
    {
      id: 'itpop',
      label: 'IT/POP',
      icon: FileText,
      submenu: [
        { id: 'itpop-titulo-cadastro', label: 'Cadastro de Títulos', page: 'itpop-titulo-cadastro' },
        { id: 'itpop-titulo-consulta', label: 'Consulta de Títulos', page: 'itpop-titulo-consulta' },
        { id: 'itpop-registro', label: 'Registro de IT/POP', page: 'itpop-registro' },
        { id: 'itpop-registros-consulta', label: 'Consulta de Registros', page: 'itpop-registros-consulta' },
        { id: 'itpop-visualizar', label: 'Visualizar IT/POP', page: 'itpop-visualizar' }
      ]
    },
    {
      id: 'bpmn',
      label: 'BPMN',
      icon: Network,
      submenu: [
        { id: 'bpmn-titulo-cadastro', label: 'Cadastro de Títulos', page: 'bpmn-titulo-cadastro' },
        { id: 'bpmn-titulo-consulta', label: 'Consulta de Títulos', page: 'bpmn-titulo-consulta' },
        { id: 'bpmn-registro', label: 'Registro de BPMN', page: 'bpmn-registro' },
        { id: 'bpmn-registros-consulta', label: 'Consulta de Registros', page: 'bpmn-registros-consulta' },
        { id: 'bpmn-visualizar', label: 'Visualizar BPMN', page: 'bpmn-visualizar' }
      ]
    },
    {
      id: 'certificados',
      label: 'Certificados',
      icon: Award,
      submenu: [
        { id: 'certificados-registro', label: 'Registro de Certificados', page: 'certificados-registro' },
        { id: 'certificados-consulta', label: 'Consulta de Certificados', page: 'certificados-consulta' }
      ]
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      submenu: [
        { id: 'configuracoes-filiais-cadastro', label: 'Cadastro de Filiais', page: 'configuracoes-filiais-cadastro' },
        { id: 'configuracoes-filiais-consulta', label: 'Consulta de Filiais', page: 'configuracoes-filiais-consulta' },
        { id: 'configuracoes-retornado', label: 'Configurações de Retornado', page: 'configuracoes-retornado' },
        { id: 'configuracoes-usuarios', label: 'Gerenciamento de Usuários', page: 'configuracoes-usuarios' }
      ]
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarOpen(localStorage.getItem('sidebarOpen') === 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', String(sidebarOpen));
    }
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => {
      if (prev.includes(menuId)) {
        return prev.filter((id) => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  };

  const isActive = (page: string) => currentPage === page;

  const filteredMenuItems = menuItems.filter(item => {
    if (item.id === 'configuracoes') {
      return usuario?.usuario === 'admin.admin';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-transform transform-translate-x-0 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-semibold dark:text-white">Menu Principal</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {filteredMenuItems.map((item) => (
              item.submenu ? (
                <li key={item.id} className="mb-1">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={cn(
                      "flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                      expandedMenus.includes(item.id) ? "bg-gray-100 dark:bg-gray-700" : ""
                    )}
                    aria-controls={`dropdown-${item.id}`}
                    data-collapse-toggle={`dropdown-${item.id}`}
                  >
                    <item.icon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                    <span className="ml-3 text-left">{item.label}</span>
                    <svg
                      className={cn(
                        "w-3 h-3 ml-auto",
                        expandedMenus.includes(item.id) ? "rotate-180" : ""
                      )}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  <ul
                    id={`dropdown-${item.id}`}
                    className={cn(
                      "py-2 space-y-2",
                      !expandedMenus.includes(item.id) ? "hidden" : ""
                    )}
                  >
                    {item.submenu.map((subItem) => (
                      <li key={subItem.id}>
                        <a
                          href="#"
                          onClick={() => {
                            onPageChange(subItem.page);
                            if (sidebarOpen) {
                              setSidebarOpen(false);
                            }
                          }}
                          className={cn(
                            "flex items-center w-full p-2 pl-11 text-sm font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                            isActive(subItem.page) ? "bg-gray-100 dark:bg-gray-700" : ""
                          )}
                        >
                          {subItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.id} className="mb-1">
                  <a
                    href="#"
                    onClick={() => {
                      onPageChange(item.page);
                      if (sidebarOpen) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={cn(
                      "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                      isActive(item.page) ? "bg-gray-100 dark:bg-gray-700" : ""
                    )}
                  >
                    <item.icon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                    <span className="ml-3">{item.label}</span>
                  </a>
                </li>
              )
            ))}
          </ul>
        </nav>
      </aside>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 w-full z-40">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Mobile menu button */}
          <Button variant="ghost" className="lg:hidden" onClick={toggleSidebar}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-64" : "ml-0"
      )}>
        <div className="p-6">
          {children}
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
