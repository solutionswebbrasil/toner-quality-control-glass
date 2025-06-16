
import React, { useState } from 'react';
import { 
  HiChartPie, 
  HiViewBoards, 
  HiUser, 
  HiShoppingBag, 
  HiArrowSmRight,
  HiDocumentText,
  HiFolder,
  HiTemplate,
  HiCollection,
  HiBookOpen,
  HiOutlineDocumentText,
  HiCubeTransparent,
  HiAdjustments,
  HiCog,
  HiOfficeBuilding,
  HiSearch
} from 'react-icons/hi';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    {
      title: "Toners",
      items: [
        {
          id: "toners-cadastro",
          label: "Cadastrar Toner",
          icon: HiShoppingBag
        },
        {
          id: "toners-consulta",
          label: "Consultar Toners",
          icon: HiViewBoards
        }
      ]
    },
    {
      title: "Retornados",
      items: [
        {
          id: "retornados-registro",
          label: "Registrar Retorno",
          icon: HiArrowSmRight
        },
        {
          id: "retornados-consulta",
          label: "Consultar Retornos",
          icon: HiChartPie
        },
        {
          id: "retornados-graficos",
          label: "Gráficos",
          icon: HiChartPie
        }
      ]
    },
    {
      title: "Garantias",
      items: [
        {
          id: "garantias-fornecedores-cadastro",
          label: "Cadastrar Fornecedor",
          icon: HiUser
        },
        {
          id: "garantias-fornecedores-consulta",
          label: "Consultar Fornecedores",
          icon: HiViewBoards
        },
        {
          id: "garantias-registro",
          label: "Registrar Garantia",
          icon: HiDocumentText
        },
        {
          id: "garantias-consulta",
          label: "Consultar Garantias",
          icon: HiViewBoards
        },
        {
          id: "garantias-graficos",
          label: "Gráficos",
          icon: HiChartPie
        }
      ]
    },
    {
      title: "Auditorias",
      items: [
        {
          id: "auditorias-registro",
          label: "Registrar Auditoria",
          icon: HiOutlineDocumentText
        },
        {
          id: "auditorias-consulta",
          label: "Consultar Auditorias",
          icon: HiViewBoards
        }
      ]
    },
    {
      title: "IT/POP",
      items: [
        {
          id: "itpop-titulo-cadastro",
          label: "Cadastrar Título",
          icon: HiTemplate
        },
        {
          id: "itpop-titulo-consulta",
          label: "Consultar Títulos",
          icon: HiCollection
        },
        {
          id: "itpop-registro",
          label: "Registrar IT/POP",
          icon: HiBookOpen
        },
        {
          id: "itpop-registros-consulta",
          label: "Consultar Registros",
          icon: HiViewBoards
        },
        {
          id: "itpop-visualizar",
          label: "Visualizar IT/POP",
          icon: HiCubeTransparent
        }
      ]
    },
    {
      title: "BPMN",
      items: [
        {
          id: "bpmn-titulo-cadastro",
          label: "Cadastrar Título",
          icon: HiTemplate
        },
        {
          id: "bpmn-titulo-consulta",
          label: "Consultar Títulos",
          icon: HiCollection
        },
        {
          id: "bpmn-registro",
          label: "Registrar BPMN",
          icon: HiBookOpen
        },
        {
          id: "bpmn-registros-consulta",
          label: "Consultar Registros",
          icon: HiViewBoards
        },
        {
          id: "bpmn-visualizar",
          label: "Visualizar BPMN",
          icon: HiCubeTransparent
        }
      ]
    },
    {
      title: "Configurações",
      items: [
        {
          id: "configuracoes-filiais-cadastro",
          label: "Cadastrar Filiais",
          icon: HiOfficeBuilding
        },
        {
          id: "configuracoes-filiais-consulta", 
          label: "Consultar Filiais",
          icon: HiSearch
        }
      ]
    }
  ];

  const SidebarContent = () => (
    <ScrollArea className="h-full py-6 px-4">
      <div className="space-y-6">
        {menuItems.map((menuGroup, index) => (
          <div key={index}>
            <h3 className="mb-2 px-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              {menuGroup.title}
            </h3>
            <div className="space-y-1">
              {menuGroup.items.map(item => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onPageChange(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
            {index < menuItems.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-40 w-full">
        <div className="flex h-16 items-center px-4">
          {/* Menu móvel */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navegue pelas opções do sistema.
                  </SheetDescription>
                </SheetHeader>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="font-bold text-xl">
            <span className="text-blue-600">Easy</span>Toner
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar fixo para desktop */}
        <aside className="hidden lg:block w-80 border-r border-gray-200 dark:border-gray-700">
          <div className="bg-white dark:bg-gray-800 h-full">
            <SidebarContent />
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
