
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Package, FileText, TrendingUp, DollarSign, Shield, AlertTriangle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { tonerService, retornadoService, garantiaService } from '@/services/dataService';

interface DashboardStats {
  totalToners: number;
  totalRetornados: number;
  valorRecuperado: number;
  totalGarantias: number;
  valorGarantias: number;
  totalNaoConformidades: number;
}

interface ChartData {
  retornadosPorMes: Array<{ mes: string; quantidade: number; valor: number }>;
  garantiasPorMes: Array<{ mes: string; quantidade: number }>;
  garantiasPorFornecedor: Array<{ fornecedor: string; quantidade: number; valor: number }>;
  naoConformidadesPorTipo: Array<{ tipo: string; quantidade: number }>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalToners: 0,
    totalRetornados: 0,
    valorRecuperado: 0,
    totalGarantias: 0,
    valorGarantias: 0,
    totalNaoConformidades: 0
  });

  const [chartData, setChartData] = useState<ChartData>({
    retornadosPorMes: [],
    garantiasPorMes: [],
    garantiasPorFornecedor: [],
    naoConformidadesPorTipo: []
  });

  const [filters, setFilters] = useState({
    filial: 'Todas',
    dataInicio: '2023-01-01',
    dataFim: '2024-12-31'
  });

  useEffect(() => {
    loadStats();
    loadChartData();
  }, [filters]);

  const loadStats = async () => {
    try {
      const [toners, retornados] = await Promise.all([
        tonerService.getAll(),
        retornadoService.getAll()
      ]);

      // Dados fictícios para demonstração
      const valorRecuperado = 125000.50;
      const totalGarantias = 87;
      const valorGarantias = 35000.75;
      const totalNaoConformidades = 23;

      setStats({
        totalToners: toners.length,
        totalRetornados: retornados.length,
        valorRecuperado,
        totalGarantias,
        valorGarantias,
        totalNaoConformidades
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadChartData = () => {
    // Dados fictícios para demonstração (2023-2024)
    const retornadosPorMes = [
      { mes: 'Jan 2023', quantidade: 45, valor: 8500 },
      { mes: 'Fev 2023', quantidade: 52, valor: 9200 },
      { mes: 'Mar 2023', quantidade: 38, valor: 7100 },
      { mes: 'Abr 2023', quantidade: 61, valor: 11300 },
      { mes: 'Mai 2023', quantidade: 47, valor: 8900 },
      { mes: 'Jun 2023', quantidade: 55, valor: 10200 },
      { mes: 'Jul 2023', quantidade: 42, valor: 7800 },
      { mes: 'Ago 2023', quantidade: 58, valor: 10800 },
      { mes: 'Set 2023', quantidade: 49, valor: 9100 },
      { mes: 'Out 2023', quantidade: 63, valor: 11700 },
      { mes: 'Nov 2023', quantidade: 51, valor: 9500 },
      { mes: 'Dez 2023', quantidade: 44, valor: 8200 },
      { mes: 'Jan 2024', quantidade: 56, valor: 10400 },
      { mes: 'Fev 2024', quantidade: 48, valor: 8900 },
      { mes: 'Mar 2024', quantidade: 62, valor: 11500 },
      { mes: 'Abr 2024', quantidade: 45, valor: 8300 },
      { mes: 'Mai 2024', quantidade: 59, valor: 10900 },
      { mes: 'Jun 2024', quantidade: 53, valor: 9800 }
    ];

    const garantiasPorMes = [
      { mes: 'Jan 2023', quantidade: 8 },
      { mes: 'Fev 2023', quantidade: 12 },
      { mes: 'Mar 2023', quantidade: 6 },
      { mes: 'Abr 2023', quantidade: 15 },
      { mes: 'Mai 2023', quantidade: 9 },
      { mes: 'Jun 2023', quantidade: 11 },
      { mes: 'Jul 2023', quantidade: 7 },
      { mes: 'Ago 2023', quantidade: 13 },
      { mes: 'Set 2023', quantidade: 10 },
      { mes: 'Out 2023', quantidade: 14 },
      { mes: 'Nov 2023', quantidade: 8 },
      { mes: 'Dez 2023', quantidade: 9 },
      { mes: 'Jan 2024', quantidade: 16 },
      { mes: 'Fev 2024', quantidade: 11 },
      { mes: 'Mar 2024', quantidade: 13 },
      { mes: 'Abr 2024', quantidade: 8 },
      { mes: 'Mai 2024', quantidade: 12 },
      { mes: 'Jun 2024', quantidade: 10 }
    ];

    const garantiasPorFornecedor = [
      { fornecedor: 'HP Inc.', quantidade: 25, valor: 12500 },
      { fornecedor: 'Canon Brasil', quantidade: 18, valor: 8900 },
      { fornecedor: 'Lexmark', quantidade: 15, valor: 7200 },
      { fornecedor: 'Brother', quantidade: 12, valor: 5800 },
      { fornecedor: 'Xerox', quantidade: 10, valor: 4900 },
      { fornecedor: 'Samsung', quantidade: 7, valor: 3400 }
    ];

    const naoConformidadesPorTipo = [
      { tipo: 'Qualidade do Produto', quantidade: 8 },
      { tipo: 'Processo Operacional', quantidade: 6 },
      { tipo: 'Documentação', quantidade: 4 },
      { tipo: 'Atendimento ao Cliente', quantidade: 3 },
      { tipo: 'Logística', quantidade: 2 }
    ];

    setChartData({
      retornadosPorMes,
      garantiasPorMes,
      garantiasPorFornecedor,
      naoConformidadesPorTipo
    });
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Dashboard
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Visão geral do sistema de controle de qualidade
        </p>
      </div>

      {/* Filtros */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filial">Filial</Label>
              <Select value={filters.filial} onValueChange={(value) => setFilters({...filters, filial: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  <SelectItem value="São Paulo">São Paulo</SelectItem>
                  <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                  <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                  <SelectItem value="Brasília">Brasília</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Retornados"
          value={stats.totalRetornados}
          icon={Package}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="Registrados"
        />
        
        <StatCard
          title="Valor Recuperado"
          value={`R$ ${stats.valorRecuperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-green-600"
          subtitle="Em estoque"
        />
        
        <StatCard
          title="Total Garantias"
          value={stats.totalGarantias}
          icon={Shield}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle="Itens processados"
        />
        
        <StatCard
          title="Valor Garantias"
          value={`R$ ${stats.valorGarantias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          subtitle="Total em garantias"
        />

        <StatCard
          title="Toners Cadastrados"
          value={stats.totalToners}
          icon={FileText}
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          subtitle="Modelos"
        />

        <StatCard
          title="Não Conformidades"
          value={stats.totalNaoConformidades}
          icon={AlertTriangle}
          color="bg-gradient-to-r from-red-500 to-red-600"
          subtitle="Registros"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retornados por Mês */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle>Retornados por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                quantidade: { label: "Quantidade", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.retornadosPorMes}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quantidade" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Valor Recuperado por Mês */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle>Valor Recuperado por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                valor: { label: "Valor (R$)", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.retornadosPorMes}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="valor" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Garantias por Mês */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle>Garantias por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                quantidade: { label: "Quantidade", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.garantiasPorMes}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quantidade" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Garantias por Fornecedor (Pizza) */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle>Garantias por Fornecedor</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                quantidade: { label: "Quantidade", color: "hsl(var(--chart-4))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.garantiasPorFornecedor}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {chartData.garantiasPorFornecedor.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Não Conformidades por Tipo */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Não Conformidades por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              quantidade: { label: "Quantidade", color: "hsl(var(--chart-5))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.naoConformidadesPorTipo} layout="horizontal">
                <XAxis type="number" />
                <YAxis dataKey="tipo" type="category" width={150} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantidade" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
