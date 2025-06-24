
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { ChartModal } from './ChartModal';
import { naoConformidadeService } from '@/services/naoConformidadeService';

export const GraficosNaoConformidades: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [tipoData, setTipoData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const naoConformidades = await naoConformidadeService.getAll();
      
      // Process monthly data
      const monthlyMap = new Map();
      const tipoMap = new Map();
      const statusMap = new Map();
      
      naoConformidades.forEach(nc => {
        const date = new Date(nc.data_registro);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        // Monthly data
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
        
        // Tipo data
        tipoMap.set(nc.tipo_nc, (tipoMap.get(nc.tipo_nc) || 0) + 1);
        
        // Status data
        statusMap.set(nc.status, (statusMap.get(nc.status) || 0) + 1);
      });

      const monthlyArray = Array.from(monthlyMap.entries()).map(([mes, quantidade]) => ({
        mes,
        quantidade
      }));

      const tipoArray = Array.from(tipoMap.entries()).map(([tipo, quantidade]) => ({
        tipo,
        quantidade
      }));

      const statusArray = Array.from(statusMap.entries()).map(([status, quantidade]) => ({
        status,
        quantidade
      }));

      setMonthlyData(monthlyArray);
      setTipoData(tipoArray);
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
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold">Gráficos de Não Conformidades</h2>
        <div className="flex justify-center py-8">
          <div className="text-slate-500">Carregando gráficos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Gráficos de Não Conformidades</h2>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Gráfico de Quantidade por Mês */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Não Conformidades por Mês</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('mensal')}
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

        {/* Gráfico por Tipo */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Não Conformidades por Tipo</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('tipo')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {tipoData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={tipoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo, percent }) => `${tipo}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {tipoData.map((entry, index) => (
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
            <CardTitle>Status das Não Conformidades</CardTitle>
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
        isOpen={expandedChart === 'mensal'}
        onClose={() => setExpandedChart(null)}
        title="Não Conformidades por Mês"
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
        isOpen={expandedChart === 'tipo'}
        onClose={() => setExpandedChart(null)}
        title="Não Conformidades por Tipo"
      >
        {tipoData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-96">
            <PieChart>
              <Pie
                data={tipoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tipo, percent }) => `${tipo}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {tipoData.map((entry, index) => (
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
        title="Status das Não Conformidades"
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

      {monthlyData.length === 0 && tipoData.length === 0 && statusData.length === 0 && (
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardContent className="p-8 text-center text-slate-500">
            Não há dados suficientes para gerar os gráficos.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
