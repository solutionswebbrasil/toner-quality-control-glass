
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
    label: "Dashboard",
    icon: Home,
    path: "/",
    permission: { modulo: "dashboard", submenu: "dashboard", acao: "visualizar" },
  },
  {
    label: "Cadastros",
    icon: LayoutDashboard,
    submenu: [
      {
        label: "Toners",
        icon: Package,
        path: "/toners",
        permission: { modulo: "cadastros", submenu: "toners", acao: "visualizar" },
      },
      {
        label: "Retornados",
        icon: Truck,
        path: "/retornados",
        permission: { modulo: "cadastros", submenu: "retornados", acao: "visualizar" },
      },
      {
        label: "Fornecedores",
        icon: Users,
        path: "/fornecedores",
        permission: { modulo: "cadastros", submenu: "fornecedores", acao: "visualizar" },
      },
    ],
  },
  {
    label: "Qualidade",
    icon: FileText,
    submenu: [
      {
        label: "Não Conformidades",
        icon: AlertTriangle,
        path: "/nao-conformidades",
        permission: { modulo: "qualidade", submenu: "nao-conformidades", acao: "visualizar" },
      },
      {
        label: "Garantias",
        icon: FileText,
        path: "/garantias",
        permission: { modulo: "qualidade", submenu: "garantias", acao: "visualizar" },
      },
      {
        label: "Auditorias",
        icon: FileText,
        path: "/auditorias",
        permission: { modulo: "qualidade", submenu: "auditorias", acao: "visualizar" },
      },
      {
        label: "Certificados",
        icon: File,
        path: "/certificados",
        permission: { modulo: "qualidade", submenu: "certificados", acao: "visualizar" },
      },
    ],
  },
  {
    label: "Logística",
    icon: Truck,
    submenu: [
      {
        label: "Entrada de Toners",
        icon: Package,
        path: "/entrada-toners",
        permission: { modulo: "logistica", submenu: "entrada-toners", acao: "visualizar" },
      },
      {
        label: "Saída de Toners",
        icon: Truck,
        path: "/saida-toners",
        permission: { modulo: "logistica", submenu: "saida-toners", acao: "visualizar" },
      },
    ],
  },
  {
    label: "Estoque",
    icon: Package,
    submenu: [
      {
        label: "Inventário",
        icon: Package,
        path: "/inventario",
        permission: { modulo: "estoque", submenu: "inventario", acao: "visualizar" },
      },
      {
        label: "Movimentação",
        icon: Truck,
        path: "/movimentacao",
        permission: { modulo: "estoque", submenu: "movimentacao", acao: "visualizar" },
      },
    ],
  },
  {
    label: "IT/POP",
    icon: File,
    submenu: [
      {
        label: "Títulos",
        icon: File,
        path: "/titulos-itpop",
        permission: { modulo: "itpop", submenu: "titulos", acao: "visualizar" },
      },
      {
        label: "Registros",
        icon: FileText,
        path: "/registros-itpop",
        permission: { modulo: "itpop", submenu: "registros", acao: "visualizar" },
      },
    ],
  },
  {
    label: "BPMN",
    icon: Presentation,
    submenu: [
      {
        label: "Títulos",
        icon: File,
        path: "/titulos-bpmn",
        permission: { modulo: "bpmn", submenu: "titulos", acao: "visualizar" },
      },
      {
        label: "Registros",
        icon: FileText,
        path: "/registros-bpmn",
        permission: { modulo: "bpmn", submenu: "registros", acao: "visualizar" },
      },
    ],
  },
  {
    label: "Configurações",
    icon: Settings,
    submenu: [
      {
        label: "Usuários",
        icon: Users,
        path: "/usuarios",
        permission: { modulo: "configuracoes", submenu: "usuarios", acao: "visualizar" }
      },
      {
        label: "E-mail",
        icon: Mail,
        path: "/configuracoes/email",
        permission: { modulo: "configuracoes", submenu: "email", acao: "visualizar" }
      }
    ]
  }
];
