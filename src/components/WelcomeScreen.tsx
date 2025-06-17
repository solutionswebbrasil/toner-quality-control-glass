
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  User, 
  Calendar, 
  Clock,
  CheckCircle,
  Building2,
  Star,
  Award
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { usuario } = useAuth();

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Bem-vindo ao SGQ PRO
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Sistema de Gestão da Qualidade - Sua plataforma completa para excelência operacional
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                    Olá, {usuario?.nome_completo}!
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">@{usuario?.usuario}</p>
                </div>
              </div>
              
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Online
              </Badge>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>{currentDate}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Clock className="w-5 h-5 text-indigo-500" />
                <span>{currentTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Gestão de Qualidade
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Controle total sobre processos de qualidade e conformidade
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-slate-200/50 dark:border-slate-700/50 hover:border-purple-300/50 dark:hover:border-purple-600/50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Controle Empresarial
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Gerencie filiais, fornecedores e processos organizacionais
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-slate-200/50 dark:border-slate-700/50 hover:border-green-300/50 dark:hover:border-green-600/50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Excelência Operacional
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Monitore indicadores e alcance a excelência em todos os processos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Message */}
        <Card className="backdrop-blur-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-900/50 border-blue-200/50 dark:border-slate-700/50">
          <CardContent className="p-8 text-center">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Navegue pelo sistema usando o menu lateral
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Utilize o menu à esquerda para acessar as funcionalidades disponíveis conforme suas permissões. 
              O SGQ PRO foi desenvolvido para oferecer uma experiência intuitiva e eficiente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
