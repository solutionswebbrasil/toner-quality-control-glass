
import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Package,
  Truck,
  AlertTriangle,
  File,
  Presentation,
  Mail,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path?: string;
  permission?: {
    modulo: string;
    submenu: string;
    acao: string;
  };
  submenu?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    path: "/",
    permission: { modulo: "dashboard", submenu: "dashboard", acao: "visualizar" },
  },
  {
    id: "cadastros",
    label: "Cadastros",
    icon: LayoutDashboard,
    submenu: [
      {
        id: "toners",
        label: "Toners",
        icon: Package,
        path: "/toners",
        permission: { modulo: "cadastros", submenu: "toners", acao: "visualizar" },
      },
      {
        id: "retornados",
        label: "Retornados",
        icon: Truck,
        path: "/retornados",
        permission: { modulo: "cadastros", submenu: "retornados", acao: "visualizar" },
      },
      {
        id: "fornecedores",
        label: "Fornecedores",
        icon: Users,
        path: "/fornecedores",
        permission: { modulo: "cadastros", submenu: "fornecedores", acao: "visualizar" },
      },
    ],
  },
  {
    id: "qualidade",
    label: "Qualidade",
    icon: FileText,
    submenu: [
      {
        id: "nao-conformidades",
        label: "Não Conformidades",
        icon: AlertTriangle,
        path: "/nao-conformidades",
        permission: { modulo: "qualidade", submenu: "nao-conformidades", acao: "visualizar" },
      },
      {
        id: "garantias",
        label: "Garantias",
        icon: FileText,
        path: "/garantias",
        permission: { modulo: "qualidade", submenu: "garantias", acao: "visualizar" },
      },
      {
        id: "auditorias",
        label: "Auditorias",
        icon: FileText,
        path: "/auditorias",
        permission: { modulo: "qualidade", submenu: "auditorias", acao: "visualizar" },
      },
      {
        id: "certificados",
        label: "Certificados",
        icon: File,
        path: "/certificados",
        permission: { modulo: "qualidade", submenu: "certificados", acao: "visualizar" },
      },
    ],
  },
  {
    id: "logistica",
    label: "Logística",
    icon: Truck,
    submenu: [
      {
        id: "entrada-toners",
        label: "Entrada de Toners",
        icon: Package,
        path: "/entrada-toners",
        permission: { modulo: "logistica", submenu: "entrada-toners", acao: "visualizar" },
      },
      {
        id: "saida-toners",
        label: "Saída de Toners",
        icon: Truck,
        path: "/saida-toners",
        permission: { modulo: "logistica", submenu: "saida-toners", acao: "visualizar" },
      },
    ],
  },
  {
    id: "estoque",
    label: "Estoque",
    icon: Package,
    submenu: [
      {
        id: "inventario",
        label: "Inventário",
        icon: Package,
        path: "/inventario",
        permission: { modulo: "estoque", submenu: "inventario", acao: "visualizar" },
      },
      {
        id: "movimentacao",
        label: "Movimentação",
        icon: Truck,
        path: "/movimentacao",
        permission: { modulo: "estoque", submenu: "movimentacao", acao: "visualizar" },
      },
    ],
  },
  {
    id: "itpop",
    label: "IT/POP",
    icon: File,
    submenu: [
      {
        id: "titulos-itpop",
        label: "Títulos",
        icon: File,
        path: "/titulos-itpop",
        permission: { modulo: "itpop", submenu: "titulos", acao: "visualizar" },
      },
      {
        id: "registros-itpop",
        label: "Registros",
        icon: FileText,
        path: "/registros-itpop",
        permission: { modulo: "itpop", submenu: "registros", acao: "visualizar" },
      },
    ],
  },
  {
    id: "bpmn",
    label: "BPMN",
    icon: Presentation,
    submenu: [
      {
        id: "titulos-bpmn",
        label: "Títulos",
        icon: File,
        path: "/titulos-bpmn",
        permission: { modulo: "bpmn", submenu: "titulos", acao: "visualizar" },
      },
      {
        id: "registros-bpmn",
        label: "Registros",
        icon: FileText,
        path: "/registros-bpmn",
        permission: { modulo: "bpmn", submenu: "registros", acao: "visualizar" },
      },
    ],
  },
  {
    id: "configuracoes",
    label: "Configurações",
    icon: Settings,
    submenu: [
      {
        id: "usuarios",
        label: "Usuários",
        icon: Users,
        path: "/usuarios",
        permission: { modulo: "configuracoes", submenu: "usuarios", acao: "visualizar" }
      },
      {
        id: "email",
        label: "E-mail",
        icon: Mail,
        path: "/configuracoes/email",
        permission: { modulo: "configuracoes", submenu: "email", acao: "visualizar" }
      }
    ]
  }
];
