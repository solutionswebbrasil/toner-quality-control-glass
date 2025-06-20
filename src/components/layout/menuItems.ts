
import {
  FileText,
  BarChart3,
  Shield,
  AlertTriangle,
  Award,
  Settings,
  Wrench,
  ClipboardList,
  Search,
  TrendingUp,
  Users,
  Building2,
  Package,
  Link
} from 'lucide-react';

export const menuItems = [
  {
    id: 'retornados',
    label: 'Retornados',
    icon: Package,
    submenu: [
      { id: 'retornados-registro', label: 'Registro', page: 'retornados-registro' },
      { id: 'retornados-consulta', label: 'Consulta', page: 'retornados-consulta' },
      { id: 'retornados-graficos', label: 'Gráficos', page: 'retornados-graficos' }
    ]
  },
  {
    id: 'fornecedores',
    label: 'Fornecedores',
    icon: Building2,
    submenu: [
      { id: 'fornecedores-cadastro', label: 'Cadastro', page: 'fornecedores-cadastro' },
      { id: 'fornecedores-consulta', label: 'Consulta', page: 'fornecedores-consulta' }
    ]
  },
  {
    id: 'garantias',
    label: 'Garantias',
    icon: Shield,
    submenu: [
      { id: 'garantias-registro', label: 'Registro', page: 'garantias-registro' },
      { id: 'garantias-consulta', label: 'Consulta', page: 'garantias-consulta' },
      { id: 'garantias-graficos-gerais', label: 'Gráficos Gerais', page: 'garantias-graficos-gerais' },
      { id: 'garantias-toners', label: 'Garantias Toners', page: 'garantias-toners' }
    ]
  },
  {
    id: 'toners',
    label: 'Toners',
    icon: Package,
    submenu: [
      { id: 'toners-cadastro', label: 'Cadastro', page: 'toners-cadastro' },
      { id: 'toners-consulta-principal', label: 'Consulta', page: 'toners-consulta-principal' },
      { id: 'toners-consulta', label: 'Toners Consulta', page: 'toners-consulta' },
      { id: 'toners-graficos', label: 'Toners Gráficos', page: 'toners-graficos' }
    ]
  },
  {
    id: 'auditorias',
    label: 'Auditorias',
    icon: ClipboardList,
    submenu: [
      { id: 'auditorias-registro', label: 'Registro', page: 'auditorias-registro' },
      { id: 'auditorias-consulta', label: 'Consulta', page: 'auditorias-consulta' }
    ]
  },
  {
    id: 'nao-conformidades',
    label: 'Não Conformidades',
    icon: AlertTriangle,
    submenu: [
      { id: 'nc-registro', label: 'Registro', page: 'nc-registro' },
      { id: 'nc-consulta', label: 'Consulta', page: 'nc-consulta' },
      { id: 'nc-graficos', label: 'Gráficos', page: 'nc-graficos' }
    ]
  },
  {
    id: 'itpop',
    label: 'IT/POP',
    icon: FileText,
    submenu: [
      { id: 'titulo-itpop-cadastro', label: 'Título Cadastro', page: 'titulo-itpop-cadastro' },
      { id: 'titulo-itpop-consulta', label: 'Título Consulta', page: 'titulo-itpop-consulta' },
      { id: 'registro-itpop', label: 'Registro', page: 'registro-itpop' },
      { id: 'registros-itpop-consulta', label: 'Registros Consulta', page: 'registros-itpop-consulta' },
      { id: 'visualizar-itpop', label: 'Visualizar', page: 'visualizar-itpop' }
    ]
  },
  {
    id: 'bpmn',
    label: 'BPMN',
    icon: TrendingUp,
    submenu: [
      { id: 'titulo-bpmn-cadastro', label: 'Título Cadastro', page: 'titulo-bpmn-cadastro' },
      { id: 'titulo-bpmn-consulta', label: 'Título Consulta', page: 'titulo-bpmn-consulta' },
      { id: 'registro-bpmn', label: 'Registro', page: 'registro-bpmn' },
      { id: 'registros-bpmn-consulta', label: 'Registros Consulta', page: 'registros-bpmn-consulta' },
      { id: 'visualizar-bpmn', label: 'Visualizar', page: 'visualizar-bpmn' }
    ]
  },
  {
    id: 'certificados',
    label: 'Certificados',
    icon: Award,
    submenu: [
      { id: 'certificados-registro', label: 'Registro', page: 'certificados-registro' },
      { id: 'certificados-consulta', label: 'Consulta', page: 'certificados-consulta' }
    ]
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    submenu: [
      { id: 'filiais-cadastro', label: 'Filiais Cadastro', page: 'filiais-cadastro' },
      { id: 'filiais-consulta', label: 'Filiais Consulta', page: 'filiais-consulta' },
      { id: 'config-retornado', label: 'Retornado', page: 'config-retornado' },
      { id: 'status-cadastro', label: 'Cadastro de Status', page: 'status-cadastro' },
      { id: 'apis-integracoes', label: 'APIs de Integrações', page: 'apis-integracoes' },
      { id: 'usuarios', label: 'Usuários', page: 'usuarios' }
    ]
  }
];
