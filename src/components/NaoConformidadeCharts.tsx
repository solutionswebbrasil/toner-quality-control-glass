
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { NaoConformidade } from '@/types/naoConformidade';
import { format, startOfMonth, parseISO } from 'date-fns';

interface NaoConformidadeChartsProps {
  naoConformidades: NaoConformidade[];
}

export const NaoConformidadeCharts: React.FC<NaoConformidadeChartsProps> = ({ naoConformidades }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const chartData = useMemo(() => {
    console.log('Dados de NC para gráficos:', naoConformidades);

    // Dados por tipo
    const tipoData = naoConformidades.reduce((acc, nc) => {
      acc[nc.tipo_nc] = (acc[nc.tipo_nc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Dados por classificação
    const classificacaoData = naoConformidades.reduce((acc, nc) => {
      acc[nc.classificacao] = (acc[nc.classificacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Dados por setor
    const setorData = naoConformidades.reduce((acc, nc) => {
      acc[nc.setor_responsavel] = (acc[nc.setor_responsavel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Dados por status
    const statusData = naoConformidades.reduce((acc, nc) => {
      acc[nc.status] = (acc[nc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tendência mensal
    const monthlyData = naoConformidades.reduce((acc, nc) => {
      try {
        const month = format(startOfMonth(parseISO(nc.data_ocorrencia)), 'MMM/yyyy');
        acc[month] = (acc[month] || 0) + 1;
      } catch (error) {
        console.error('Erro ao processar data:', nc.data_ocorrencia, error);
      }
      return acc;
    }, {} as Record<string, number>);

    const chartResults = {
      tipoChart: Object.entries(tipoData).map(([name, value]) => ({ name, value })),
      classificacaoChart: Object.entries(classificacaoData).map(([name, value]) => ({ name, value })),
      setorChart: Object.entries(setorData).map(([name, value]) => ({ name, value })),
      statusChart: Object.entries(statusData).map(([name, value]) => ({ name, value })),
      monthlyChart: Object.entries(monthlyData)
        .sort(([a], [b]) => {
          try {
            return new Date(a).getTime() - new Date(b).getTime();
          } catch {
            return a.localeCompare(b);
          }
        })
        .map(([name, value]) => ({ name, value }))
    };

    console.log('Dados processados para gráficos:', chartResults);
    return chartResults;
  }, [naoConformidades]);

  if (naoConformidades.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Gráficos de Não Conformidades
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Nenhuma não conformidade registrada para exibir gráficos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Gráficos de Não Conformidades
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Análise estatística das {naoConformidades.length} não conformidades registradas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por Tipo */}
        {chartData.tipoChart.length > 0 && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>NC por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.tipoChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Gráfico por Classificação */}
        {chartData.classificacaoChart.length > 0 && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>NC por Classificação</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.classificacaoChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.classificacaoChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Gráfico por Setor */}
        {chartData.setorChart.length > 0 && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>NC por Setor</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.setorChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Gráfico por Status */}
        {chartData.statusChart.length > 0 && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>NC por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.statusChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.statusChart.map((entry, index) => (
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

      {/* Tendência Mensal */}
      {chartData.monthlyChart.length > 0 && (
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle>Tendência Mensal de NC</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData.monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
