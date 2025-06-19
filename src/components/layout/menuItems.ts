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
        path: "/toners",
        permission: { modulo: "cadastros", submenu: "toners", acao: "visualizar" },
      },
      {
        label: "Retornados",
        path: "/retornados",
        permission: { modulo: "cadastros", submenu: "retornados", acao: "visualizar" },
      },
      {
        label: "Fornecedores",
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
        path: "/nao-conformidades",
        permission: { modulo: "qualidade", submenu: "nao-conformidades", acao: "visualizar" },
      },
      {
        label: "Garantias",
        path: "/garantias",
        permission: { modulo: "qualidade", submenu: "garantias", acao: "visualizar" },
      },
      {
        label: "Auditorias",
        path: "/auditorias",
        permission: { modulo: "qualidade", submenu: "auditorias", acao: "visualizar" },
      },
      {
        label: "Certificados",
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
        path: "/entrada-toners",
        permission: { modulo: "logistica", submenu: "entrada-toners", acao: "visualizar" },
      },
      {
        label: "Saída de Toners",
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
        path: "/inventario",
        permission: { modulo: "estoque", submenu: "inventario", acao: "visualizar" },
      },
      {
        label: "Movimentação",
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
        path: "/titulos-itpop",
        permission: { modulo: "itpop", submenu: "titulos", acao: "visualizar" },
      },
      {
        label: "Registros",
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
        path: "/titulos-bpmn",
        permission: { modulo: "bpmn", submenu: "titulos", acao: "visualizar" },
      },
      {
        label: "Registros",
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
        path: "/usuarios",
        permission: { modulo: "configuracoes", submenu: "usuarios", acao: "visualizar" }
      },
      {
        label: "E-mail",
        path: "/configuracoes/email",
        permission: { modulo: "configuracoes", submenu: "email", acao: "visualizar" }
      }
    ]
  }
];
