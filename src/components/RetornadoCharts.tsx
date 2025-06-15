
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { ChartModal } from './ChartModal';
import { ChartFilters, DateFilter } from './ChartFilters';
import { ComparisonStats } from './ComparisonStats';
import { retornadoService } from '@/services/dataService';

export const RetornadoCharts: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [destinoData, setDestinoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [filter, setFilter] = useState<DateFilter>({
    type: 'month',
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  const [comparisonStats, setComparisonStats] = useState<{
    currentQuantity: number;
    previousQuantity: number;
    currentValue: number;
    previousValue: number;
  }>({
    currentQuantity: 0,
    previousQuantity: 0,
    currentValue: 0,
    previousValue: 0
  });

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      
      const retornados = await retornadoService.getAll();
      
      // Filtrar dados baseado no filtro selecionado
      const filteredData = retornados.filter(item => {
        const itemDate = new Date(item.data_registro);
        
        if (filter.type === 'day' && filter.startDate && filter.endDate) {
          return itemDate >= filter.startDate && itemDate <= filter.endDate;
        } else if (filter.type === 'month' && filter.month !== undefined && filter.year) {
          return itemDate.getMonth() === filter.month && itemDate.getFullYear() === filter.year;
        } else if (filter.type === 'year' && filter.year) {
          return itemDate.getFullYear() === filter.year;
        }
        
        return true;
      });

      // Calcular dados para comparação (período anterior)
      const previousPeriodData = retornados.filter(item => {
        const itemDate = new Date(item.data_registro);
        
        if (filter.type === 'month' && filter.month !== undefined && filter.year) {
          const prevMonth = filter.month === 0 ? 11 : filter.month - 1;
          const prevYear = filter.month === 0 ? filter.year - 1 : filter.year;
          return itemDate.getMonth() === prevMonth && itemDate.getFullYear() === prevYear;
        } else if (filter.type === 'year' && filter.year) {
          return itemDate.getFullYear() === filter.year - 1;
        }
        
        return false;
      });

      // Estatísticas de comparação
      const currentQuantity = filteredData.length;
      const previousQuantity = previousPeriodData.length;
      const currentValue = filteredData.reduce((sum, item) => sum + (item.valor_recuperado || 0), 0);
      const previousValue = previousPeriodData.reduce((sum, item) => sum + (item.valor_recuperado || 0), 0);

      setComparisonStats({
        currentQuantity,
        previousQuantity,
        currentValue,
        previousValue
      });

      // Dados mensais (últimos 6 meses se não filtrado)
      const monthlyDataMap = new Map();
      const last6Months = [];
      
      if (filter.type === 'month' && filter.year && filter.month !== undefined) {
        // Se filtro específico, mostrar apenas esse mês
        const key = `${String(filter.month + 1).padStart(2, '0')}/${String(filter.year).slice(-2)}`;
        monthlyDataMap.set(key, { month: key, quantidade: 0, valor: 0 });
      } else {
        // Últimos 6 meses
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const key = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
          monthlyDataMap.set(key, { month: key, quantidade: 0, valor: 0 });
        }
      }

      filteredData.forEach(item => {
        const date = new Date(item.data_registro);
        const key = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
        
        if (monthlyDataMap.has(key)) {
          const existing = monthlyDataMap.get(key);
          existing.quantidade += 1;
          existing.valor += item.valor_recuperado || 0;
        }
      });

      const monthlyArray = Array.from(monthlyDataMap.values());
      setMonthlyData(monthlyArray);

      // Dados por destino (apenas itens com valor > 0)
      const destinoMap = new Map();
      filteredData.forEach(item => {
        const destino = item.destino_final;
        destinoMap.set(destino, (destinoMap.get(destino) || 0) + 1);
      });

      const destinoArray = Array.from(destinoMap.entries())
        .filter(([_, value]) => value > 0) // Remover itens com valor zero
        .map(([name, value]) => ({ name, value }));

      setDestinoData(destinoArray);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, [filter]);

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
        <h2 className="text-2xl font-bold">Gráficos de Retornados</h2>
        <div className="flex justify-center py-8">
          <div className="text-slate-500">Carregando gráficos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gráficos de Retornados</h2>
      
      <ChartFilters filter={filter} onFilterChange={setFilter} />

      {/* Estatísticas de Comparação */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <ComparisonStats
          currentValue={comparisonStats.currentQuantity}
          previousValue={comparisonStats.previousQuantity}
          label="Quantidade de Retornados"
          format="number"
        />
        <ComparisonStats
          currentValue={comparisonStats.currentValue}
          previousValue={comparisonStats.previousValue}
          label="Valor Recuperado"
          format="currency"
        />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Gráfico de Quantidade por Mês */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quantidade de Retornados por Período</CardTitle>
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
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantidade" fill="var(--color-quantidade)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico Pizza - Destino Final */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Destino Final dos Retornados</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('destino')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {destinoData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={destinoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {destinoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal para Gráfico Expandido */}
      <ChartModal
        isOpen={expandedChart === 'quantidade'}
        onClose={() => setExpandedChart(null)}
        title="Quantidade de Retornados por Período"
      >
        <ChartContainer config={chartConfig} className="h-96">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="quantidade" fill="var(--color-quantidade)" />
          </BarChart>
        </ChartContainer>
      </ChartModal>

      <ChartModal
        isOpen={expandedChart === 'destino'}
        onClose={() => setExpandedChart(null)}
        title="Destino Final dos Retornados"
      >
        {destinoData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-96">
            <PieChart>
              <Pie
                data={destinoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {destinoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="h-96 flex items-center justify-center text-slate-500">
            Nenhum dado disponível para o período selecionado
          </div>
        )}
      </ChartModal>

      {monthlyData.every(item => item.quantidade === 0) && destinoData.length === 0 && (
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardContent className="p-8 text-center text-slate-500">
            Não há dados suficientes para gerar os gráficos no período selecionado.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
