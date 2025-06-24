
import { 
  Home, 
  BarChart3, 
  Package, 
  FileText, 
  Users, 
  Shield, 
  AlertTriangle, 
  Settings,
  TrendingUp,
  GitBranch,
  FileSearch,
  Building,
  Award,
  Workflow,
  BookOpen,
  Network,
  UserCheck,
  Database
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  subItems?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: 'inicio',
    label: 'Início',
    icon: Home
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3
  },
  {
    id: 'kpis',
    label: 'KPIs',
    icon: TrendingUp
  },
  {
    id: 'ishikawa',
    label: 'Ishikawa',
    icon: GitBranch
  },
  {
    id: 'pareto',
    label: 'Pareto',
    icon: BarChart3
  },
  {
    id: 'toners',
    label: 'Toners',
    icon: Package,
    subItems: [
      {
        id: 'toners-cadastro',
        label: 'Cadastro',
        icon: Package
      },
      {
        id: 'toners-consulta-principal',
        label: 'Consulta',
        icon: FileSearch
      }
    ]
  },
  {
    id: 'retornados',
    label: 'Retornados',
    icon: FileText,
    subItems: [
      {
        id: 'retornados-registro',
        label: 'Registro',
        icon: FileText
      },
      {
        id: 'retornados-consulta',
        label: 'Consulta',
        icon: FileSearch
      }
    ]
  },
  {
    id: 'fornecedores',
    label: 'Fornecedores',
    icon: Users,
    subItems: [
      {
        id: 'fornecedores-cadastro',
        label: 'Cadastro',
        icon: Users
      },
      {
        id: 'fornecedores-consulta',
        label: 'Consulta',
        icon: FileSearch
      }
    ]
  },
  {
    id: 'garantias',
    label: 'Garantias',
    icon: Shield,
    subItems: [
      {
        id: 'garantias-registro',
        label: 'Registro',
        icon: Shield
      },
      {
        id: 'garantias-consulta',
        label: 'Consulta',
        icon: FileSearch
      },
      {
        id: 'garantias-toners',
        label: 'Garantias Toners',
        icon: Package
      }
    ]
  },
  {
    id: 'auditorias',
    label: 'Auditorias',
    icon: UserCheck,
    subItems: [
      {
        id: 'auditorias-registro',
        label: 'Registro',
        icon: UserCheck
      },
      {
        id: 'auditorias-consulta',
        label: 'Consulta',
        icon: FileSearch
      }
    ]
  },
  {
    id: 'nao-conformidades',
    label: 'Não Conformidades',
    icon: AlertTriangle,
    subItems: [
      {
        id: 'nc-registro',
        label: 'Registro',
        icon: AlertTriangle
      },
      {
        id: 'nc-consulta',
        label: 'Consulta',
        icon: FileSearch
      }
    ]
  },
  {
    id: 'itpop',
    label: 'IT/POP',
    icon: BookOpen,
    subItems: [
      {
        id: 'titulo-itpop-cadastro',
        label: 'Cadastro Título',
        icon: BookOpen
      },
      {
        id: 'titulo-itpop-consulta',
        label: 'Consulta Títulos',
        icon: FileSearch
      },
      {
        id: 'registro-itpop',
        label: 'Registro IT/POP',
        icon: FileText
      },
      {
        id: 'registros-itpop-consulta',
        label: 'Consulta Registros',
        icon: FileSearch
      },
      {
        id: 'visualizar-itpop',
        label: 'Visualizar',
        icon: FileSearch
      }
    ]
  },
  {
    id: 'bpmn',
    label: 'BPMN',
    icon: Network,
    subItems: [
      {
        id: 'titulo-bpmn-cadastro',
        label: 'Cadastro Título',
        icon: Network
      },
      {
        id: 'titulo-bpmn-consulta',
        label: 'Consulta Títulos',
        icon: FileSearch
      },
      {
        id: 'registro-bpmn',
        label: 'Registro BPMN',
        icon: Workflow
      },
      {
        id: 'registros-bpmn-consulta',
        label: 'Consulta Registros',
        icon: FileSearch
      },
      {
        id: 'visualizar-bpmn',
        label: 'Visualizar',
        icon: FileSearch
      }
    ]
  },
  {
    id: 'certificados',
    label: 'Certificados',
    icon: Award,
    subItems: [
      {
        id: 'certificados-registro',
        label: 'Registro',
        icon: Award
      },
      {
        id: 'certificados-consulta',
        label: 'Consulta',
        icon: FileSearch
      }
    ]
  },
  {
    id: 'filiais',
    label: 'Filiais',
    icon: Building,
    subItems: [
      {
        id: 'filiais-cadastro',
        label: 'Cadastro',
        icon: Building
      },
      {
        id: 'filiais-consulta',
        label: 'Consulta',
        icon: FileSearch
      }
    ]
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    subItems: [
      {
        id: 'configuracoes',
        label: 'Geral',
        icon: Settings
      },
      {
        id: 'config-retornado',
        label: 'Retornados',
        icon: FileText
      },
      {
        id: 'status-cadastro',
        label: 'Status',
        icon: Settings
      },
      {
        id: 'usuarios',
        label: 'Usuários',
        icon: Users
      },
      {
        id: 'apis-integracoes',
        label: 'APIs e Integrações',
        icon: Database
      }
    ]
  }
];
