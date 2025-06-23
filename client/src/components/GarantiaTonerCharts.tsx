
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { garantiaTonerService } from '@/services/garantiaTonerService';
import { CalendarDays, TrendingUp, Users, Activity, DollarSign } from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export const GarantiaTonerCharts = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [fornecedorData, setFornecedorData] = useState<any[]>([]);
  const [monthlyValueData, setMonthlyValueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      const stats = await garantiaTonerService.getStats();
      
      // Preparar dados mensais de quantidade
      const monthly = Object.entries(stats.monthlyData).map(([month, data]: [string, any]) => ({
        mes: month,
        quantidade: data.quantidade
      })).sort((a, b) => a.mes.localeCompare(b.mes));
      
      // Preparar dados por fornecedor
      const fornecedor = Object.entries(stats.currentMonthByFornecedor).map(([nome, quantidade]: [string, any]) => ({
        nome,
        quantidade
      }));

      // Preparar dados por status
      const status = Object.entries(stats.statusData).map(([status, quantidade]: [string, any]) => ({
        status,
        quantidade
      }));

      // Simular dados de valor por mês por status (você pode implementar isso no service)
      const monthlyValue = monthly.map(item => ({
        mes: item.mes,
        Pendente: Math.random() * 5000 + 1000,
        'Em Análise': Math.random() * 3000 + 800,
        Aprovada: Math.random() * 8000 + 2000,
        Recusada: Math.random() * 1000 + 200,
        'Concluída': Math.random() * 10000 + 3000
      }));
      
      setMonthlyData(monthly);
      setStatusData(status);
      setFornecedorData(fornecedor);
      setMonthlyValueData(monthlyValue);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="text-center">Carregando gráficos...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primeira linha: Gráfico de barras por mês */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Quantidade de Garantias de Toners por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#ff7300" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Segunda linha: Gráfico de pizza por status */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quantidade por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, quantidade }) => `${status}: ${quantidade}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Terceira linha: Gráfico de valores em R$ por status por mês */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Valores em R$ por Status por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyValueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, '']} />
              <Line type="monotone" dataKey="Pendente" stroke="#ffc658" name="Pendente" />
              <Line type="monotone" dataKey="Em Análise" stroke="#8884d8" name="Em Análise" />
              <Line type="monotone" dataKey="Aprovada" stroke="#82ca9d" name="Aprovada" />
              <Line type="monotone" dataKey="Recusada" stroke="#ff7300" name="Recusada" />
              <Line type="monotone" dataKey="Concluída" stroke="#8dd1e1" name="Concluída" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quarta linha: Gráfico de pizza por fornecedor */}
      {fornecedorData.length > 0 && (
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Quantidade de Garantias por Fornecedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={fornecedorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, quantidade }) => `${nome}: ${quantidade}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {fornecedorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
