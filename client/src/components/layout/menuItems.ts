
import { Home, FileText, Users, Wrench, ClipboardList, BarChart3, Settings, TrendingUp, PieChart, BarChart } from 'lucide-react';
import type { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '#',
    onClick: 'dashboard',
  },
  {
    id: 'graficos',
    label: 'Gráficos',
    icon: BarChart3,
    children: [
      {
        id: 'graficos-retornados',
        label: 'Retornados',
        icon: BarChart,
        href: '#',
        onClick: 'graficos-retornados',
      },
      {
        id: 'graficos-garantias',
        label: 'Garantias',
        icon: PieChart,
        href: '#',
        onClick: 'graficos-garantias',
      },
      {
        id: 'graficos-nao-conformidades',
        label: 'Não Conformidades',
        icon: TrendingUp,
        href: '#',
        onClick: 'graficos-nao-conformidades',
      },
    ],
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    children: [
      {
        id: 'config-usuarios',
        label: 'Usuários',
        icon: Users,
        href: '#',
        onClick: 'config-usuarios',
      },
      {
        id: 'config-sistema',
        label: 'Sistema',
        icon: Wrench,
        href: '#',
        onClick: 'config-sistema',
      },
    ],
  },
];
