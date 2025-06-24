
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { ChartModal } from './ChartModal';
import { retornadoService } from '@/services/retornadoService';

export const GraficosRetornados: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [filialData, setFilialData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const stats = await retornadoService.getStats();
      
      // Convert monthly data
      const monthlyArray = Object.entries(stats.monthlyData).map(([month, data]: [string, any]) => ({
        mes: month,
        quantidade: data.quantidade,
        peso: data.peso
      }));
      
      // Convert filial data
      const filialArray = Object.entries(stats.filialData).map(([filial, quantidade]) => ({
        filial,
        quantidade
      }));

      setMonthlyData(monthlyArray);
      setFilialData(filialArray);
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
    peso: {
      label: "Peso (kg)",
      color: "#10b981",
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold">Gráficos de Retornados</h2>
        <div className="flex justify-center py-8">
          <div className="text-slate-500">Carregando gráficos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Gráficos de Retornados</h2>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Gráfico de Quantidade por Mês */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Retornados por Mês</CardTitle>
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

        {/* Gráfico por Filial */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Retornados por Filial</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('filial')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {filialData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={filialData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ filial, percent }) => `${filial}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {filialData.map((entry, index) => (
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

        {/* Gráfico de Peso Total */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Peso Total por Mês</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('peso')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="peso" stroke="var(--color-peso)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Modals para Gráficos Expandidos */}
      <ChartModal
        isOpen={expandedChart === 'quantidade'}
        onClose={() => setExpandedChart(null)}
        title="Retornados por Mês"
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
        isOpen={expandedChart === 'filial'}
        onClose={() => setExpandedChart(null)}
        title="Retornados por Filial"
      >
        {filialData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-96">
            <PieChart>
              <Pie
                data={filialData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ filial, percent }) => `${filial}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {filialData.map((entry, index) => (
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
        isOpen={expandedChart === 'peso'}
        onClose={() => setExpandedChart(null)}
        title="Peso Total por Mês"
      >
        <ChartContainer config={chartConfig} className="h-96">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="peso" stroke="var(--color-peso)" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </ChartModal>

      {monthlyData.length === 0 && filialData.length === 0 && (
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardContent className="p-8 text-center text-slate-500">
            Não há dados suficientes para gerar os gráficos.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
