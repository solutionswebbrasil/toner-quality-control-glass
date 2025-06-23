import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from 'recharts';
import { DateFilter } from '../ChartFilters';
import { ChartModal } from '../ChartModal';
import { garantiasApi } from '@/lib/api';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Maximize2 } from 'lucide-react';

interface GarantiasChartsProps {
  filter: DateFilter;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export const GarantiasCharts: React.FC<GarantiasChartsProps> = ({ filter }) => {
  const [modalChart, setModalChart] = useState<string | null>(null);
  // Enhanced mock data for demonstration - comprehensive dataset for presentation
  const generateMockGarantias = () => {
    const fornecedores = ['HP Inc.', 'Samsung', 'Canon', 'Brother', 'Xerox', 'Ricoh', 'Kyocera'];
    const filiais = ['Jundiaí', 'Franca'];
    
    const mockData = [];
    let id = 1;
    
    // Gerar dados dos últimos 24 meses
    for (let monthsBack = 23; monthsBack >= 0; monthsBack--) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthsBack);
      
      // 3-8 garantias por mês
      const recordsThisMonth = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < recordsThisMonth; i++) {
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const recordDate = new Date(date.getFullYear(), date.getMonth(), randomDay);
        const fornecedor = fornecedores[Math.floor(Math.random() * fornecedores.length)];
        const filial = filiais[Math.floor(Math.random() * filiais.length)];
        const valor_total = Math.random() * 800 + 150; // R$ 150-950
        
        mockData.push({
          id: id++,
          data_registro: recordDate.toISOString().split('T')[0],
          valor_total,
          filial,
          fornecedor: { nome: fornecedor }
        });
      }
    }
    
    return mockData;
  };

  const allGarantias = generateMockGarantias();
  
  // Apply filters
  const garantias = allGarantias.filter(item => {
    const itemDate = new Date(item.data_registro);
    
    // Filter by date range
    if (filter.startDate && itemDate < filter.startDate) return false;
    if (filter.endDate && itemDate > filter.endDate) return false;
    
    // Filter by filial
    if (filter.filial && item.filial !== filter.filial) return false;
    
    return true;
  });

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

    // Process all data without filters for year comparison
    allGarantias.forEach((item: any) => {
      const date = new Date(item.data_registro);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();

      if (year === currentYear) {
        currentYearData[monthIndex] = (currentYearData[monthIndex] || 0) + 1;
      } else if (year === previousYear) {
        previousYearData[monthIndex] = (previousYearData[monthIndex] || 0) + 1;
      }
    });

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return months.map((month, index) => ({
      mes: month,
      anoAtual: currentYearData[index] || 0,
      anoAnterior: previousYearData[index] || 0
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
      <Card className="shadow-lg border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Garantias Mensais
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Acionamentos por mês
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalChart('monthly')}
            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyWarrantiesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="mes" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="quantidade" fill="#f59e0b" radius={[4, 4, 0, 0]} />
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

      {/* Chart Modals */}
      <ChartModal
        isOpen={modalChart === 'monthly'}
        onClose={() => setModalChart(null)}
        title="Garantias Realizadas por Mês"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyWarrantiesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </ChartModal>
    </div>
  );
};