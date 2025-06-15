
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { ChartModal } from './ChartModal';

export const GarantiaCharts: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [fornecedorData, setFornecedorData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      const mockMonthlyData = [
        { month: 'Jan/24', quantidade: 12, valor: 5400 },
        { month: 'Fev/24', quantidade: 8, valor: 3600 },
        { month: 'Mar/24', quantidade: 15, valor: 6750 },
        { month: 'Abr/24', quantidade: 10, valor: 4500 },
        { month: 'Mai/24', quantidade: 18, valor: 8100 },
        { month: 'Jun/24', quantidade: 14, valor: 6300 }
      ];

      const mockFornecedorData = [
        { nome: 'HP Brasil', quantidade: 25 },
        { nome: 'Canon Brasil', valor: 15 },
        { nome: 'Epson', valor: 10 },
        { nome: 'Brother', valor: 8 }
      ];

      setMonthlyData(mockMonthlyData);
      setFornecedorData(mockFornecedorData);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, []);

  const chartConfig = {
    quantidade: {
      label: "Quantidade",
      color: "#3b82f6",
    },
    valor: {
      label: "Valor (R$)",
      color: "#10b981",
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Gráficos de Garantias</h2>
        <div className="flex justify-center py-8">
          <div className="text-slate-500">Carregando gráficos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gráficos de Garantias</h2>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Gráfico de Garantias por Mês */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Garantias por Mês</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('monthly')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="quantidade" stroke="var(--color-quantidade)" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico por Fornecedor */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Garantias por Fornecedor</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('fornecedor')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <PieChart>
                <Pie
                  data={fornecedorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {fornecedorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Modals para Gráficos Expandidos */}
      <ChartModal
        isOpen={expandedChart === 'monthly'}
        onClose={() => setExpandedChart(null)}
        title="Garantias por Mês"
      >
        <ChartContainer config={chartConfig} className="h-96">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="quantidade" stroke="var(--color-quantidade)" strokeWidth={3} />
          </LineChart>
        </ChartContainer>
      </ChartModal>

      <ChartModal
        isOpen={expandedChart === 'fornecedor'}
        onClose={() => setExpandedChart(null)}
        title="Garantias por Fornecedor"
      >
        <ChartContainer config={chartConfig} className="h-96">
          <PieChart>
            <Pie
              data={fornecedorData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="quantidade"
            >
              {fornecedorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </ChartModal>

      {monthlyData.length === 0 && fornecedorData.length === 0 && (
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardContent className="p-8 text-center text-slate-500">
            Não há dados suficientes para gerar os gráficos. Registre algumas garantias primeiro.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
