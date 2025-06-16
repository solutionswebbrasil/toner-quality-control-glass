import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { ChartModal } from './ChartModal';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { retornadoService } from '@/services/dataService';

const getMonthName = (monthNumber: number) => {
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  return months[monthNumber];
};

export const RetornadoCharts: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [valorData, setValorData] = useState<any[]>([]);
  const [destinoData, setDestinoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      
      const retornados = await retornadoService.getAll();
      
      // Filtrar dados baseado nas datas selecionadas
      const filteredData = retornados.filter(item => {
        const itemDate = new Date(item.data_registro);
        
        if (startDate && endDate) {
          return itemDate >= startDate && itemDate <= endDate;
        }
        
        return true;
      });

      // Dados mensais ou por período
      const dataMap = new Map();
      
      if (startDate && endDate) {
        // Se há filtro de data, agrupar por dia
        const startDay = new Date(startDate);
        const endDay = new Date(endDate);
        
        for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate() + 1)) {
          const key = format(new Date(d), 'dd/MM');
          dataMap.set(key, { period: key, quantidade: 0, valor: 0 });
        }
        
        filteredData.forEach(item => {
          const date = new Date(item.data_registro);
          const key = format(date, 'dd/MM');
          
          if (dataMap.has(key)) {
            const existing = dataMap.get(key);
            existing.quantidade += 1;
            existing.valor += item.valor_recuperado || 0;
          }
        });
      } else {
        // Últimos 6 meses por padrão
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthName = getMonthName(date.getMonth());
          const year = date.getFullYear();
          const key = `${monthName}/${year}`;
          dataMap.set(key, { period: key, quantidade: 0, valor: 0 });
        }
        
        filteredData.forEach(item => {
          const date = new Date(item.data_registro);
          const monthName = getMonthName(date.getMonth());
          const year = date.getFullYear();
          const key = `${monthName}/${year}`;
          
          if (dataMap.has(key)) {
            const existing = dataMap.get(key);
            existing.quantidade += 1;
            existing.valor += item.valor_recuperado || 0;
          }
        });
      }

      const periodArray = Array.from(dataMap.values());
      setMonthlyData(periodArray);
      setValorData(periodArray);

      // Dados por destino
      const destinoMap = new Map();
      filteredData.forEach(item => {
        const destino = item.destino_final;
        destinoMap.set(destino, (destinoMap.get(destino) || 0) + 1);
      });

      const destinoArray = Array.from(destinoMap.entries())
        .filter(([_, value]) => value > 0)
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
  }, [startDate, endDate]);

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

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
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

  const periodLabel = startDate && endDate ? 
    `${startDate && endDate && (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) <= 31 ? 'por Período' : 'por Mês'}` : 
    'por Mês';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gráficos de Retornados</h2>
      
      {/* Filtros de Data */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium mb-2 block">Data Inicial:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Data Final:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Gráfico de Quantidade */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Retornados {periodLabel}</CardTitle>
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
                <XAxis dataKey="period" />
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

        {/* Novo Gráfico de Valor Recuperado */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Valor Recuperado {periodLabel}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedChart('valor')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={valorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor Recuperado']}
                />
                <Bar dataKey="valor" fill="var(--color-valor)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Modals para Gráficos Expandidos */}
      <ChartModal
        isOpen={expandedChart === 'quantidade'}
        onClose={() => setExpandedChart(null)}
        title={`Retornados ${periodLabel}`}
      >
        <ChartContainer config={chartConfig} className="h-96">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
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

      <ChartModal
        isOpen={expandedChart === 'valor'}
        onClose={() => setExpandedChart(null)}
        title={`Valor Recuperado ${periodLabel}`}
      >
        <ChartContainer config={chartConfig} className="h-96">
          <BarChart data={valorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor Recuperado']}
            />
            <Bar dataKey="valor" fill="var(--color-valor)" />
          </BarChart>
        </ChartContainer>
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
