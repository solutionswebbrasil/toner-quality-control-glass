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

interface MenuItem {
  title: string;
  icon: keyof typeof Icons;
  items: {
    title: string;
    href: string;
    description: string;
  }[];
}

const Icons = {
  Home,
  Package,
  Shield,
  Printer,
  AlertTriangle,
  FileCheck,
  Award,
  Settings,
};

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'Home',
    items: [
      {
        title: 'Visão Geral',
        href: '/',
        description: 'Resumo geral do sistema'
      }
    ],
  },
  {
    title: 'Retornados',
    icon: 'Package',
    items: [
      {
        title: 'Novo Retornado',
        href: '/retornado-form',
        description: 'Cadastrar novo item retornado'
      },
      {
        title: 'Consultar Retornados',
        href: '/retornado-grid',
        description: 'Listagem e busca de itens retornados'
      },
      {
        title: 'Gráficos Retornados',
        href: '/retornado-charts',
        description: 'Visualização gráfica dos dados de retornados'
      }
    ],
  },
  {
    title: 'Garantias',
    icon: 'Shield',
    items: [
      {
        title: 'Registrar Garantia',
        href: '/garantia-form',
        description: 'Abrir um chamado de garantia'
      },
      {
        title: 'Consultar Garantias',
        href: '/garantia-grid',
        description: 'Acompanhar o status das garantias'
      },
      {
        title: 'Gráficos de Garantias',
        href: '/garantia-charts',
        description: 'Análise visual das garantias'
      },
	  {
        title: 'Gráficos Gerais',
        href: '/garantia-geral-charts',
        description: 'Análise visual geral das garantias'
      },
      {
        title: 'Consultar Toners',
        href: '/garantia-toner-consulta',
        description: 'Consulta específica de garantias de toners'
      },
      {
        title: 'Listar Toners',
        href: '/garantia-toner-grid',
        description: 'Listagem de garantias de toners'
      },
      {
        title: 'Gráficos de Toners',
        href: '/garantia-toner-charts',
        description: 'Visualização gráfica das garantias de toners'
      }
    ],
  },
  {
    title: 'Toners',
    icon: 'Printer',
    items: [
      {
        title: 'Novo Toner',
        href: '/toner-form',
        description: 'Cadastrar um novo toner'
      },
      {
        title: 'Consultar Toners',
        href: '/toner-grid',
        description: 'Listar e buscar toners cadastrados'
      }
    ],
  },
  {
    title: 'Não Conformidades',
    icon: 'AlertTriangle',
    items: [
      {
        title: 'Nova Não Conformidade',
        href: '/nao-conformidade-form',
        description: 'Registrar uma não conformidade'
      },
      {
        title: 'Consultar Não Conformidades',
        href: '/nao-conformidade-grid',
        description: 'Listar as não conformidades registradas'
      },
      {
        title: 'Gráficos de Não Conformidades',
        href: '/nao-conformidade-charts',
        description: 'Visualização gráfica das não conformidades'
      }
    ],
  },
  {
    title: 'Auditorias',
    icon: 'FileCheck',
    items: [
      {
        title: 'Nova Auditoria',
        href: '/auditoria-form',
        description: 'Agendar e registrar auditorias'
      },
      {
        title: 'Consultar Auditorias',
        href: '/auditoria-grid',
        description: 'Listar auditorias realizadas'
      }
    ],
  },
  {
    title: 'Certificados',
    icon: 'Award',
    items: [
      {
        title: 'Novo Certificado',
        href: '/certificado-form',
        description: 'Cadastrar um novo certificado'
      },
      {
        title: 'Consultar Certificados',
        href: '/certificado-grid',
        description: 'Gerenciar certificados da empresa'
      }
    ],
  },
  {
    title: 'Configurações',
    icon: 'Settings',
    items: [
      {
        title: 'Filiais',
        href: '/filiais',
        description: 'Gerenciar filiais da empresa'
      },
      {
        title: 'Fornecedores',
        href: '/fornecedores',
        description: 'Cadastro e consulta de fornecedores'
      },
      {
        title: 'Usuários',
        href: '/usuarios',
        description: 'Gerenciamento de usuários do sistema'
      },
      {
        title: 'Consulta Usuários',
        href: '/consulta-usuarios',
        description: 'Consultar e gerenciar usuários cadastrados'
      },
      {
        title: 'APIs de Integrações',
        href: '/apis-integracoes',
        description: 'Configurar APIs para integrações externas'
      },
      {
        title: 'Configurar Retornados',
        href: '/configurar-retornados',
        description: 'Configurar opções para retornados'
      }
    ],
  },
];
