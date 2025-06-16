
import { 
  Shield, 
  FileText, 
  BarChart3, 
  Settings, 
  Home,
  Package,
  RotateCcw,
  Building2,
  Wrench,
  CheckCircle,
  Users,
  AlertTriangle,
  Award,
  Network
} from 'lucide-react';
import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
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
