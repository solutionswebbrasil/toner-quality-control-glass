
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { garantiaService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Maximize2, Minimize2 } from 'lucide-react';

export const GarantiaCharts: React.FC = () => {
  const { toast } = useToast();
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [fornecedorData, setFornecedorData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const stats = await garantiaService.getStats();
      
      // Processar dados mensais
      const monthlyArray = Object.entries(stats.monthlyData).map(([month, data]: [string, any]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { 
          month: 'short', 
          year: 'numeric' 
        }),
        quantidade: data.quantidade,
        valor: data.valor
      }));

      // Processar dados por fornecedor
      const fornecedorArray = Object.entries(stats.currentMonthByFornecedor).map(([fornecedor, quantidade]: [string, any]) => ({
        name: fornecedor,
        value: quantidade
      }));

      setMonthlyData(monthlyArray);
      setFornecedorData(fornecedorArray);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos gráficos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, []);

  const handleExpandChart = (chartType: string) => {
    setExpandedChart(expandedChart === chartType ? null : chartType);
  };

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
        <h2 className="text-2xl font-bold">Gráficos de Garantia</h2>
        <div className="flex justify-center py-8">
          <div className="text-slate-500">Carregando gráficos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gráficos de Garantia</h2>
      
      {expandedChart ? (
        // Modo expandido - mostrar apenas um gráfico em tela cheia
        <div className="w-full">
          {expandedChart === 'quantidade' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quantidade de Garantias por Mês</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedChart(null)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[500px] w-full">
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
          )}

          {expandedChart === 'valor' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Valor de Garantias por Mês (R$)</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedChart(null)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[500px] w-full">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: any) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                    />
                    <Bar dataKey="valor" fill="var(--color-valor)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {expandedChart === 'fornecedor' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quantidade por Fornecedor (Mês Atual)</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedChart(null)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[500px] w-full">
                  <PieChart>
                    <Pie
                      data={fornecedorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fornecedorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Modo normal - mostrar todos os gráficos em grid
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Gráfico de Quantidade por Mês */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quantidade de Garantias por Mês</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExpandChart('quantidade')}
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

          {/* Gráfico de Valor por Mês */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Valor de Garantias por Mês (R$)</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExpandChart('valor')}
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
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: any) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                  />
                  <Bar dataKey="valor" fill="var(--color-valor)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Gráfico Pizza - Quantidade por Fornecedor */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quantidade por Fornecedor (Mês Atual)</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExpandChart('fornecedor')}
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fornecedorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

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
