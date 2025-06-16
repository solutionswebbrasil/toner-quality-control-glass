import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, TrendingUp, DollarSign } from 'lucide-react';
import { tonerService, retornadoService } from '@/services/dataService';

interface DashboardStats {
  totalToners: number;
  totalRetornados: number;
  valorRecuperado: number;
  mesAtual: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalToners: 0,
    totalRetornados: 0,
    valorRecuperado: 0,
    mesAtual: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [toners, retornados] = await Promise.all([
        tonerService.getAll(),
        retornadoService.getAll()
      ]);

      const valorRecuperado = retornados
        .filter(r => r.valor_recuperado)
        .reduce((sum, r) => sum + (r.valor_recuperado || 0), 0);

      // Calcular retornados do mês atual
      const agora = new Date();
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      const retornadosMesAtual = retornados.filter(r => 
        new Date(r.data_registro) >= inicioMes
      );

      setStats({
        totalToners: toners.length,
        totalRetornados: retornados.length,
        valorRecuperado,
        mesAtual: retornadosMesAtual.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }) => (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Dashboard
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Visão geral do sistema de controle de qualidade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Toners"
          value={stats.totalToners}
          icon={Package}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="Modelos cadastrados"
        />
        
        <StatCard
          title="Retornados"
          value={stats.totalRetornados}
          icon={FileText}
          color="bg-gradient-to-r from-green-500 to-green-600"
          subtitle="Total processados"
        />
        
        <StatCard
          title="Valor Recuperado"
          value={`R$ ${stats.valorRecuperado.toFixed(2)}`}
          icon={DollarSign}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          subtitle="Em estoque"
        />
        
        <StatCard
          title="Mês Atual"
          value={stats.mesAtual}
          icon={TrendingUp}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle="Retornados este mês"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                <Package className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Sistema inicializado</p>
                  <p className="text-sm text-slate-500">Controle de qualidade ativo</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10">
                <FileText className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Módulos carregados</p>
                  <p className="text-sm text-slate-500">Toners e Retornados disponíveis</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200/50 dark:border-blue-800/50 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-200 text-left">
                <Package className="w-5 h-5 text-blue-500 mb-2" />
                <p className="font-medium text-sm">Cadastrar Toner</p>
              </button>
              <button className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-200/50 dark:border-green-800/50 hover:from-green-500/20 hover:to-green-600/20 transition-all duration-200 text-left">
                <FileText className="w-5 h-5 text-green-500 mb-2" />
                <p className="font-medium text-sm">Novo Retornado</p>
              </button>
              <button className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-200/50 dark:border-purple-800/50 hover:from-purple-500/20 hover:to-purple-600/20 transition-all duration-200 text-left">
                <TrendingUp className="w-5 h-5 text-purple-500 mb-2" />
                <p className="font-medium text-sm">Ver Gráficos</p>
              </button>
              <button className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-200/50 dark:border-orange-800/50 hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-200 text-left">
                <DollarSign className="w-5 h-5 text-orange-500 mb-2" />
                <p className="font-medium text-sm">Importar CSV</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
