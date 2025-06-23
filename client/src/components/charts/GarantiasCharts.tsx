import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from 'recharts';
import { DateFilter } from '../ChartFilters';
import { garantiasApi } from '@/lib/api';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GarantiasChartsProps {
  filter: DateFilter;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export const GarantiasCharts: React.FC<GarantiasChartsProps> = ({ filter }) => {
  // Mock data for demonstration - will be replaced with real API data
  const garantias = [
    {
      id: 1,
      data_registro: '2024-01-10',
      valor_total: 350.00,
      fornecedor: { nome: 'HP Inc.' }
    },
    {
      id: 2,
      data_registro: '2024-02-15',
      valor_total: 280.00,
      fornecedor: { nome: 'Samsung' }
    },
    {
      id: 3,
      data_registro: '2024-03-08',
      valor_total: 420.00,
      fornecedor: { nome: 'Canon' }
    },
    {
      id: 4,
      data_registro: '2023-01-10',
      valor_total: 300.00,
      fornecedor: { nome: 'HP Inc.' }
    },
    {
      id: 5,
      data_registro: '2024-04-20',
      valor_total: 500.00,
      fornecedor: { nome: 'Brother' }
    }
  ];

  // Process data for monthly warranties chart
  const getMonthlyWarrantiesData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    garantias.forEach((item: any) => {
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

  // Process data for warranties by supplier
  const getWarrantiesBySupplierData = () => {
    const supplierCount: { [key: string]: number } = {};
    
    garantias.forEach((item: any) => {
      const supplier = item.fornecedor?.nome || 'Não informado';
      supplierCount[supplier] = (supplierCount[supplier] || 0) + 1;
    });

    return Object.entries(supplierCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Process data for year comparison
  const getYearComparisonData = () => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    const currentYearData: { [key: string]: number } = {};
    const previousYearData: { [key: string]: number } = {};

    garantias.forEach((item: any) => {
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

  // Process data for warranty value by month
  const getWarrantyValueData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    garantias.forEach((item: any) => {
      const date = new Date(item.data_registro);
      const monthKey = format(date, 'yyyy-MM');
      const value = item.valor_total || 0;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + value;
    });

    return Object.entries(monthlyData)
      .map(([month, value]) => ({
        mes: format(parse(month, 'yyyy-MM', new Date()), 'MMM yyyy', { locale: ptBR }),
        valor: value
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  };

  const monthlyWarrantiesData = getMonthlyWarrantiesData();
  const supplierData = getWarrantiesBySupplierData();
  const yearComparisonData = getYearComparisonData();
  const warrantyValueData = getWarrantyValueData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Warranties Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Garantias Realizadas por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyWarrantiesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Warranties by Supplier Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Garantias por Fornecedor</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={supplierData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supplierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Year Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação Garantias: Ano Atual vs Anterior</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={yearComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="anoAtual" fill="#0088FE" name="Ano Atual" />
              <Line dataKey="anoAnterior" stroke="#FF8042" name="Ano Anterior" type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Warranty Value Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Valor de Garantias Solicitadas por Mês (R$)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={warrantyValueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']} />
              <Line dataKey="valor" stroke="#00C49F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};