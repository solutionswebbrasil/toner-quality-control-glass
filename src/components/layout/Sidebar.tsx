
import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  FileText, 
  Shield, 
  Building2, 
  Users, 
  ClipboardCheck, 
  AlertTriangle, 
  BookOpen, 
  FileCode, 
  Award, 
  Settings, 
  User,
  FolderPlus,
  Mail,
  Key,
  Cog,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  page?: string;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    page: 'dashboard'
  },
  {
    id: 'retornados',
    label: 'Retornados',
    icon: Package,
    submenu: [
      { id: 'retornados-registro', label: 'Registro', icon: FileText, page: 'retornados-registro' },
      { id: 'retornados-consulta', label: 'Consulta', icon: FileText, page: 'retornados-consulta' },
      { id: 'retornados-graficos', label: 'Gráficos', icon: FileText, page: 'retornados-graficos' }
    ]
  },
  {
    id: 'fornecedores',
    label: 'Fornecedores',
    icon: Building2,
    submenu: [
      { id: 'fornecedores-cadastro', label: 'Cadastro', icon: Building2, page: 'fornecedores-cadastro' },
      { id: 'fornecedores-consulta', label: 'Consulta', icon: Building2, page: 'fornecedores-consulta' }
    ]
  },
  {
    id: 'garantias',
    label: 'Garantias',
    icon: Shield,
    submenu: [
      { id: 'garantias-registro', label: 'Registro', icon: Shield, page: 'garantias-registro' },
      { id: 'garantias-consulta', label: 'Consulta', icon: Shield, page: 'garantias-consulta' },
      { id: 'garantias-graficos-gerais', label: 'Gráficos Gerais', icon: Shield, page: 'garantias-graficos-gerais' },
      { id: 'garantias-toners', label: 'Garantias Toners', icon: Shield, page: 'garantias-toners' }
    ]
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: FolderPlus,
    submenu: [
      { id: 'toners-cadastro', label: 'Cadastro de Toners', icon: Package, page: 'toners-cadastro' },
      { id: 'toners-consulta-principal', label: 'Consulta de Toners', icon: Package, page: 'toners-consulta-principal' }
    ]
  },
  {
    id: 'auditorias',
    label: 'Auditorias',
    icon: ClipboardCheck,
    submenu: [
      { id: 'auditorias-registro', label: 'Registro', icon: ClipboardCheck, page: 'auditorias-registro' },
      { id: 'auditorias-consulta', label: 'Consulta', icon: ClipboardCheck, page: 'auditorias-consulta' }
    ]
  },
  {
    id: 'pops-its',
    label: 'POPs / ITs',
    icon: BookOpen,
    submenu: [
      { id: 'titulo-itpop-cadastro', label: 'Cadastro de Títulos', icon: FileText, page: 'titulo-itpop-cadastro' },
      { id: 'titulo-itpop-consulta', label: 'Consulta de Títulos', icon: FileText, page: 'titulo-itpop-consulta' },
      { id: 'registro-itpop', label: 'Registro de Documentos', icon: FileCode, page: 'registro-itpop' },
      { id: 'registros-itpop-consulta', label: 'Consulta de Registros', icon: FileCode, page: 'registros-itpop-consulta' },
      { id: 'visualizar-itpop', label: 'Visualizar Documentos', icon: FileText, page: 'visualizar-itpop' }
    ]
  },
  {
    id: 'documentos-vencimento',
    label: 'Docs. c/ Vencimento',
    icon: Calendar,
    submenu: [
      { id: 'documento-vencimento-cadastro', label: 'Cadastro', icon: Calendar, page: 'documento-vencimento-cadastro' },
      { id: 'documento-vencimento-consulta', label: 'Consulta', icon: Calendar, page: 'documento-vencimento-consulta' }
    ]
  },
  {
    id: 'usuarios',
    label: 'Usuários',
    icon: Users,
    page: 'usuarios'
  }
];

const systemSettingsItems: MenuItem[] = [
  {
    id: 'definicoes-sistema',
    label: 'Definições do Sistema',
    icon: Cog,
    submenu: [
      { id: 'apis-integracoes', label: 'APIs', icon: Settings, page: 'apis-integracoes' },
      { id: 'smtp-config', label: 'SMTP', icon: Mail, page: 'smtp-config' },
      { id: 'usuarios-gerenciamento', label: 'Gerenciamento de Usuários', icon: Users, page: 'usuarios' },
      { id: 'permissoes', label: 'Permissões', icon: Key, page: 'permissoes' }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (page: string) => currentPage === page;

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => (
      item.submenu ? (
        <li key={item.id}>
          <button
            onClick={() => toggleMenu(item.id)}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-white hover:bg-blue-700 dark:hover:bg-gray-700",
              expandedMenus.includes(item.id) && "bg-blue-700 dark:bg-gray-700"
            )}
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0 text-white" />
            <span className="flex-1 text-left leading-tight break-words text-xs text-white">
              {item.label}
            </span>
            <svg
              className={cn(
                "w-3 h-3 transition-transform duration-200 flex-shrink-0 ml-2",
                expandedMenus.includes(item.id) ? "rotate-180" : ""
              )}
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
            className={cn(
              "mt-1 space-y-1 transition-all duration-200 ease-in-out overflow-hidden",
              expandedMenus.includes(item.id) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            {item.submenu.map((subItem) => (
              <li key={subItem.id}>
                <button
                  onClick={() => onPageChange(subItem.page!)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 ml-6 text-xs rounded-lg transition-colors duration-200 hover:bg-blue-700 dark:hover:bg-gray-700",
                    isActive(subItem.page!) 
                      ? "bg-blue-500 text-white font-medium"
                      : "text-white"
                  )}
                >
                  <span className="leading-tight break-words">{subItem.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </li>
      ) : (
        <li key={item.id}>
          <button
            onClick={() => onPageChange(item.page!)}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-blue-700 dark:hover:bg-gray-700",
              isActive(item.page!) 
                ? "bg-white text-blue-600 dark:bg-white dark:text-gray-800 font-medium"
                : "text-white"
            )}
          >
            <item.icon className="w-5 h-5 mr-3 text-current flex-shrink-0" />
            <span className="leading-tight break-words text-xs">{item.label}</span>
          </button>
        </li>
      )
    ));
  };

  return (
    <aside className="w-72 bg-blue-600 dark:bg-gray-800 border-r border-blue-700 dark:border-gray-700 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-blue-700 dark:border-gray-700 flex-shrink-0 px-3">
        <span className="text-lg font-semibold text-center leading-tight text-white dark:text-white">
          Menu Principal
        </span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {renderMenuItems(menuItems)}
        </ul>
      </nav>

      <div className="border-t border-blue-700 dark:border-gray-700 py-4">
        <ul className="space-y-1 px-3">
          {renderMenuItems(systemSettingsItems)}
        </ul>
      </div>
    </aside>
  );
};
