import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DateFilter } from '../ChartFilters';
import { retornadosApi } from '@/lib/api';
import { format, parse, subYears, isSameMonth, isSameYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RetornadosChartsProps {
  filter: DateFilter;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const RetornadosCharts: React.FC<RetornadosChartsProps> = ({ filter }) => {
  // Mock data for demonstration - will be replaced with real API data
  const retornados = [
    {
      id: 1,
      data_registro: '2024-01-15',
      peso: '500',
      destino_final: 'Estoque',
      valor_recuperado: 150.50,
      toner: { modelo: 'HP CF280A', peso_vazio: '50', gramatura: '450', capacidade_folhas: 2700, valor_por_folha: 0.05, cor: 'Preto' }
    },
    {
      id: 2,
      data_registro: '2024-02-20',
      peso: '600',
      destino_final: 'Garantia',
      valor_recuperado: 200.00,
      toner: { modelo: 'Samsung MLT-D111S', peso_vazio: '60', gramatura: '540', capacidade_folhas: 1000, valor_por_folha: 0.08, cor: 'Preto' }
    },
    {
      id: 3,
      data_registro: '2024-03-10',
      peso: '400',
      destino_final: 'Descarte',
      valor_recuperado: 0,
      toner: { modelo: 'Canon 725', peso_vazio: '45', gramatura: '355', capacidade_folhas: 1600, valor_por_folha: 0.06, cor: 'Preto' }
    },
    {
      id: 4,
      data_registro: '2023-01-15',
      peso: '450',
      destino_final: 'Estoque Semi Novo',
      valor_recuperado: 180.00,
      toner: { modelo: 'HP CF280A', peso_vazio: '50', gramatura: '400', capacidade_folhas: 2700, valor_por_folha: 0.05, cor: 'Preto' }
    },
    {
      id: 5,
      data_registro: '2024-04-25',
      peso: '520',
      destino_final: 'Uso Interno',
      valor_recuperado: 0,
      toner: { modelo: 'Brother TN-2340', peso_vazio: '55', gramatura: '465', capacidade_folhas: 2600, valor_por_folha: 0.04, cor: 'Preto' }
    }
  ];

  // Process data for volumetry chart (monthly count)
  const getVolumetryData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    retornados.forEach((item: any) => {
      const date = new Date(item.data_registro);
      const monthKey = format(date, 'yyyy-MM');
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({
        mes: format(parse(month, 'yyyy-MM', new Date()), 'MMM yyyy', { locale: ptBR }),
        quantidade: count
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  };

  // Process data for value recovered chart
  const getValueRecoveredData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    retornados.forEach((item: any) => {
      const date = new Date(item.data_registro);
      const monthKey = format(date, 'yyyy-MM');
      let valorRecuperado = item.valor_recuperado || 0;

      // Calculate recovered value for stock items
      if ((item.destino_final === 'Estoque' || item.destino_final === 'Estoque Semi Novo') && !item.valor_recuperado && item.toner) {
        const gramaturaRestante = parseFloat(item.peso) - parseFloat(item.toner.peso_vazio);
        const percentualGramatura = (gramaturaRestante / parseFloat(item.toner.gramatura)) * 100;
        const folhasRestantes = (percentualGramatura / 100) * item.toner.capacidade_folhas;
        valorRecuperado = folhasRestantes * parseFloat(item.toner.valor_por_folha);
      }

      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + valorRecuperado;
    });

    return Object.entries(monthlyData)
      .map(([month, value]) => ({
        mes: format(parse(month, 'yyyy-MM', new Date()), 'MMM yyyy', { locale: ptBR }),
        valor: value
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  };

  // Process data for year comparison
  const getYearComparisonData = () => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    const currentYearData: { [key: string]: number } = {};
    const previousYearData: { [key: string]: number } = {};

    retornados.forEach((item: any) => {
      const date = new Date(item.data_registro);
      const year = date.getFullYear();
      const month = format(date, 'MMM', { locale: ptBR });

      if (year === currentYear) {
        currentYearData[month] = (currentYearData[month] || 0) + 1;
      } else if (year === previousYear) {
        previousYearData[month] = (previousYearData[month] || 0) + 1;
      }
    });

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return months.map(month => ({
      mes: month,
      anoAtual: currentYearData[month] || 0,
      anoAnterior: previousYearData[month] || 0
    }));
  };

  // Process data for destination pie chart
  const getDestinationData = () => {
    const destinationCount: { [key: string]: number } = {};
    
    retornados.forEach((item: any) => {
      const destino = item.destino_final || 'Não informado';
      destinationCount[destino] = (destinationCount[destino] || 0) + 1;
    });

    return Object.entries(destinationCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  const volumetryData = getVolumetryData();
  const valueRecoveredData = getValueRecoveredData();
  const yearComparisonData = getYearComparisonData();
  const destinationData = getDestinationData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Volumetry Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Volumetria de Toners Retornados por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumetryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Value Recovered Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Valor Recuperado por Mês (R$)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={valueRecoveredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']} />
              <Bar dataKey="valor" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Year Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação Ano Atual vs Ano Anterior</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="anoAtual" fill="#0088FE" name="Ano Atual" />
              <Line dataKey="anoAnterior" stroke="#FF8042" name="Ano Anterior" type="monotone" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Destination Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Quantidade por Destino Final</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={destinationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {destinationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};