
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Maximize2, RefreshCw } from 'lucide-react';
import { ChartModal } from './ChartModal';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { retornadoService } from '@/services/retornadoService';

export const RetornadoCharts: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [valorData, setValorData] = useState<any[]>([]);
  const [destinoData, setDestinoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [totalRegistros, setTotalRegistros] = useState(0);

  // Cores mais vibrantes para os gráficos
  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando TODOS os dados do banco para gráficos...');
      
      // Buscar TODOS os retornados do banco sem limitação
      const retornados = await retornadoService.getAll();
      console.log('Total de dados carregados para gráficos:', retornados.length);
      setTotalRegistros(retornados.length);
      
      // Verificar se há dados com valor_recuperado
      const comValor = retornados.filter(item => item.valor_recuperado && item.valor_recuperado > 0);
      console.log('Registros com valor_recuperado:', comValor.length);
      
      // Verificar destinos
      const destinosUnicos = [...new Set(retornados.map(item => item.destino_final))];
      console.log('Destinos únicos encontrados:', destinosUnicos);
      
      // Filtrar dados baseado nas datas selecionadas
      let filteredData = retornados;
      
      if (startDate && endDate) {
        filteredData = retornados.filter(item => {
          const itemDate = new Date(item.data_registro);
          return itemDate >= startDate && itemDate <= endDate;
        });
        console.log('Dados filtrados por período:', filteredData.length, 'registros');
      }

      // Preparar dados baseado no período selecionado
      let dataMap = new Map();

      if (startDate && endDate) {
        const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        
        if (daysDifference <= 31) {
          // Mostrar por dias se período for menor que 31 dias
          const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
          
          daysInterval.forEach(day => {
            const key = format(day, 'dd/MM', { locale: ptBR });
            dataMap.set(key, { period: key, quantidade: 0, valor: 0 });
          });
          
          filteredData.forEach(item => {
            const date = new Date(item.data_registro);
            const key = format(date, 'dd/MM', { locale: ptBR });
            
            if (dataMap.has(key)) {
              const existing = dataMap.get(key);
              existing.quantidade += 1;
              existing.valor += Number(item.valor_recuperado) || 0;
            }
          });
        } else {
          // Mostrar por meses se período for maior que 31 dias
          const monthsInterval = eachMonthOfInterval({ start: startOfMonth(startDate), end: endOfMonth(endDate) });
          
          monthsInterval.forEach(month => {
            const key = format(month, 'MMM/yy', { locale: ptBR });
            dataMap.set(key, { period: key, quantidade: 0, valor: 0 });
          });
          
          filteredData.forEach(item => {
            const date = new Date(item.data_registro);
            const key = format(date, 'MMM/yy', { locale: ptBR });
            
            if (dataMap.has(key)) {
              const existing = dataMap.get(key);
              existing.quantidade += 1;
              existing.valor += Number(item.valor_recuperado) || 0;
            }
          });
        }
      } else {
        // Mostrar todos os dados agrupados por mês quando não há filtro
        if (retornados.length > 0) {
          const allDates = retornados.map(item => new Date(item.data_registro));
          const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
          const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
          
          console.log('Período total dos dados:', format(minDate, 'dd/MM/yyyy'), 'até', format(maxDate, 'dd/MM/yyyy'));
          
          const monthsInterval = eachMonthOfInterval({ 
            start: startOfMonth(minDate), 
            end: endOfMonth(maxDate) 
          });
          
          monthsInterval.forEach(month => {
            const key = format(month, 'MMM/yy', { locale: ptBR });
            dataMap.set(key, { period: key, quantidade: 0, valor: 0 });
          });
          
          retornados.forEach(item => {
            const date = new Date(item.data_registro);
            const key = format(date, 'MMM/yy', { locale: ptBR });
            
            if (dataMap.has(key)) {
              const existing = dataMap.get(key);
              existing.quantidade += 1;
              existing.valor += Number(item.valor_recuperado) || 0;
            }
          });
        }
      }

      const periodArray = Array.from(dataMap.values());
      console.log('Dados processados para gráfico de período:', periodArray);
      
      setMonthlyData(periodArray);
      setValorData(periodArray);

      // Dados por destino - contar TODOS os registros filtrados
      const destinoMap = new Map();
      filteredData.forEach(item => {
        const destino = item.destino_final;
        destinoMap.set(destino, (destinoMap.get(destino) || 0) + 1);
      });

      const destinoArray = Array.from(destinoMap.entries())
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));

      console.log('Dados por destino (todos os registros):', destinoArray);
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

  const refreshData = () => {
    console.log('Recarregando dados dos gráficos...');
    loadChartData();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Gráficos de Retornados</h2>
        <div className="flex justify-center py-8">
          <div className="text-slate-500">Carregando todos os dados do banco...</div>
        </div>
      </div>
    );
  }

  const getPeriodLabel = () => {
    if (startDate && endDate) {
      const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      return daysDifference <= 31 ? 'por Período Diário' : 'por Período Mensal';
    }
    return 'Todos os Períodos (Banco Completo)';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Gráficos de Retornados</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Total no banco: {totalRegistros} registros
          </span>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recarregar Banco
          </Button>
        </div>
      </div>
      
      {/* Filtros de Data */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/30 dark:border-slate-700/50 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Data Inicial:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal bg-white dark:bg-slate-800",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="p-3 pointer-events-auto"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Data Final:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal bg-white dark:bg-slate-800",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="p-3 pointer-events-auto"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={clearFilters} className="bg-white dark:bg-slate-800">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Gráfico de Quantidade */}
      <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Retornados {getPeriodLabel()}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedChart('quantidade')}
            className="bg-white/50 dark:bg-slate-800/50"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="pb-4">
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                  }}
                />
                <Bar 
                  dataKey="quantidade" 
                  fill="#3b82f6" 
                  radius={[6, 6, 0, 0]}
                  name="Quantidade"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico Pizza - Destino Final */}
      <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Destino Final dos Retornados
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedChart('destino')}
            className="bg-white/50 dark:bg-slate-800/50"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="pb-4">
          {destinoData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={destinoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    {destinoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500">
              Nenhum dado disponível para o período selecionado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Valor Recuperado */}
      <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Valor Recuperado {getPeriodLabel()}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedChart('valor')}
            className="bg-white/50 dark:bg-slate-800/50"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="pb-4">
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valorData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor Recuperado']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                  }}
                />
                <Bar 
                  dataKey="valor" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]}
                  name="Valor Recuperado"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Modals para Gráficos Expandidos */}
      <ChartModal
        isOpen={expandedChart === 'quantidade'}
        onClose={() => setExpandedChart(null)}
        title={`Retornados ${getPeriodLabel()}`}
      >
        <ChartContainer config={chartConfig} className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="quantidade" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartModal>

      <ChartModal
        isOpen={expandedChart === 'destino'}
        onClose={() => setExpandedChart(null)}
        title="Destino Final dos Retornados"
      >
        {destinoData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-96">
            <ResponsiveContainer width="100%" height="100%">
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
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {destinoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
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
        title={`Valor Recuperado ${getPeriodLabel()}`}
      >
        <ChartContainer config={chartConfig} className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={valorData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor Recuperado']}
              />
              <Bar dataKey="valor" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
