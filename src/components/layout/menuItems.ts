
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
  page?: string;
  permission?: {
    modulo: string;
    submenu: string;
    acao: string;
  };
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  page: string;
}

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    page: "/",
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
        page: "/toners",
      },
      {
        id: "retornados",
        label: "Retornados",
        page: "/retornados",
      },
      {
        id: "fornecedores",
        label: "Fornecedores",
        page: "/fornecedores",
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
        page: "/nao-conformidades",
      },
      {
        id: "garantias",
        label: "Garantias",
        page: "/garantias",
      },
      {
        id: "auditorias",
        label: "Auditorias",
        page: "/auditorias",
      },
      {
        id: "certificados",
        label: "Certificados",
        page: "/certificados",
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
        page: "/entrada-toners",
      },
      {
        id: "saida-toners",
        label: "Saída de Toners",
        page: "/saida-toners",
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
        page: "/inventario",
      },
      {
        id: "movimentacao",
        label: "Movimentação",
        page: "/movimentacao",
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
        page: "/titulos-itpop",
      },
      {
        id: "registros-itpop",
        label: "Registros",
        page: "/registros-itpop",
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
        page: "/titulos-bpmn",
      },
      {
        id: "registros-bpmn",
        label: "Registros",
        page: "/registros-bpmn",
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
        page: "/usuarios",
      },
      {
        id: "email",
        label: "E-mail",
        page: "/configuracoes/email",
      }
    ]
  }
];
