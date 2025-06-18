
import {
  Home,
  Package,
  Shield,
  Printer,
  AlertTriangle,
  FileCheck,
  Award,
  Settings,
} from 'lucide-react';
import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    page: 'dashboard',
  },
  {
    id: 'retornados',
    label: 'Retornados',
    icon: Package,
    submenu: [
      {
        id: 'retornados-novo',
        label: 'Novo Retornado',
        page: 'retornado-form'
      },
      {
        id: 'retornados-lista',
        label: 'Consultar Retornados',
        page: 'retornado-grid'
      },
      {
        id: 'retornados-charts',
        label: 'Gráficos Retornados',
        page: 'retornado-charts'
      }
    ],
  },
  {
    id: 'garantias',
    label: 'Garantias',
    icon: Shield,
    submenu: [
      {
        id: 'garantias-nova',
        label: 'Registrar Garantia',
        page: 'garantia-form'
      },
      {
        id: 'garantias-lista',
        label: 'Consultar Garantias',
        page: 'garantia-grid'
      },
      {
        id: 'garantias-charts',
        label: 'Gráficos de Garantias',
        page: 'garantia-charts'
      },
      {
        id: 'garantias-geral-charts',
        label: 'Gráficos Gerais',
        page: 'garantia-geral-charts'
      },
      {
        id: 'garantias-toner-consulta',
        label: 'Consultar Toners',
        page: 'garantia-toner-consulta'
      },
      {
        id: 'garantias-toner-lista',
        label: 'Listar Toners',
        page: 'garantia-toner-grid'
      },
      {
        id: 'garantias-toner-charts',
        label: 'Gráficos de Toners',
        page: 'garantia-toner-charts'
      }
    ],
  },
  {
    id: 'toners',
    label: 'Toners',
    icon: Printer,
    submenu: [
      {
        id: 'toners-novo',
        label: 'Novo Toner',
        page: 'toner-form'
      },
      {
        id: 'toners-lista',
        label: 'Consultar Toners',
        page: 'toner-grid'
      }
    ],
  },
  {
    id: 'nao-conformidades',
    label: 'Não Conformidades',
    icon: AlertTriangle,
    submenu: [
      {
        id: 'nao-conformidades-nova',
        label: 'Nova Não Conformidade',
        page: 'nao-conformidade-form'
      },
      {
        id: 'nao-conformidades-lista',
        label: 'Consultar Não Conformidades',
        page: 'nao-conformidade-grid'
      },
      {
        id: 'nao-conformidades-charts',
        label: 'Gráficos de Não Conformidades',
        page: 'nao-conformidade-charts'
      }
    ],
  },
  {
    id: 'auditorias',
    label: 'Auditorias',
    icon: FileCheck,
    submenu: [
      {
        id: 'auditorias-nova',
        label: 'Nova Auditoria',
        page: 'auditoria-form'
      },
      {
        id: 'auditorias-lista',
        label: 'Consultar Auditorias',
        page: 'auditoria-grid'
      }
    ],
  },
  {
    id: 'certificados',
    label: 'Certificados',
    icon: Award,
    submenu: [
      {
        id: 'certificados-novo',
        label: 'Novo Certificado',
        page: 'certificado-form'
      },
      {
        id: 'certificados-lista',
        label: 'Consultar Certificados',
        page: 'certificado-grid'
      }
    ],
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    submenu: [
      {
        id: 'filiais',
        label: 'Filiais',
        page: 'filiais'
      },
      {
        id: 'fornecedores',
        label: 'Fornecedores',
        page: 'fornecedores'
      },
      {
        id: 'usuarios',
        label: 'Usuários',
        page: 'usuarios'
      },
      {
        id: 'consulta-usuarios',
        label: 'Consulta Usuários',
        page: 'consulta-usuarios'
      },
      {
        id: 'apis-integracoes',
        label: 'APIs de Integrações',
        page: 'apis-integracoes'
      },
      {
        id: 'configurar-retornados',
        label: 'Configurar Retornados',
        page: 'configurar-retornados'
      }
    ],
  },
];
