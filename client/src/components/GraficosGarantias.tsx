
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { ChartModal } from './ChartModal';
import { garantiaTonerService } from '@/services/garantiaTonerService';

export const GraficosGarantias: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [fornecedorData, setFornecedorData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const stats = await garantiaTonerService.getStats();
      
      // Convert monthly data
      const monthlyArray = Object.entries(stats.monthlyData).map(([month, data]: [string, any]) => ({
        mes: month,
        quantidade: data.quantidade,
        valor: data.valor
      }));
      
      // Convert fornecedor data
      const fornecedorArray = Object.entries(stats.currentMonthByFornecedor).map(([fornecedor, quantidade]) => ({
        fornecedor,
        quantidade
      }));

      // Convert status data
      const statusArray = Object.entries(stats.statusData).map(([status, quantidade]) => ({
        status,
        quantidade
      }));

      setMonthlyData(monthlyArray);
      setFornecedorData(fornecedorArray);
      setStatusData(statusArray);
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
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold">Gráficos de Garantias</h2>
        <div className="flex justify-center py-8">
          <div className="text-slate-500">Carregando gráficos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Gráficos de Garantias</h2>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Gráfico de Quantidade por Mês */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Garantias por Mês</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('quantidade')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantidade" fill="var(--color-quantidade)" />
              </BarChart>
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
            {fornecedorData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={fornecedorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ fornecedor, percent }) => `${fornecedor}: ${(percent * 100).toFixed(0)}%`}
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
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Status */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Status das Garantias</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('status')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantidade" fill="var(--color-quantidade)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Modals para Gráficos Expandidos */}
      <ChartModal
        isOpen={expandedChart === 'quantidade'}
        onClose={() => setExpandedChart(null)}
        title="Garantias por Mês"
      >
        <ChartContainer config={chartConfig} className="h-96">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="quantidade" fill="var(--color-quantidade)" />
          </BarChart>
        </ChartContainer>
      </ChartModal>

      <ChartModal
        isOpen={expandedChart === 'fornecedor'}
        onClose={() => setExpandedChart(null)}
        title="Garantias por Fornecedor"
      >
        {fornecedorData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-96">
            <PieChart>
              <Pie
                data={fornecedorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ fornecedor, percent }) => `${fornecedor}: ${(percent * 100).toFixed(0)}%`}
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
        ) : (
          <div className="h-96 flex items-center justify-center text-slate-500">
            Nenhum dado disponível
          </div>
        )}
      </ChartModal>

      <ChartModal
        isOpen={expandedChart === 'status'}
        onClose={() => setExpandedChart(null)}
        title="Status das Garantias"
      >
        <ChartContainer config={chartConfig} className="h-96">
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="quantidade" fill="var(--color-quantidade)" />
          </BarChart>
        </ChartContainer>
      </ChartModal>

      {monthlyData.length === 0 && fornecedorData.length === 0 && statusData.length === 0 && (
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardContent className="p-8 text-center text-slate-500">
            Não há dados suficientes para gerar os gráficos.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
