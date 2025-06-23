import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DateFilter } from '../ChartFilters';
import { ChartModal } from '../ChartModal';
import { retornadosApi } from '@/lib/api';
import { format, parse, subYears, isSameMonth, isSameYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Maximize2 } from 'lucide-react';

interface RetornadosChartsProps {
  filter: DateFilter;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const RetornadosCharts: React.FC<RetornadosChartsProps> = ({ filter }) => {
  const [modalChart, setModalChart] = useState<string | null>(null);
  // Enhanced mock data for demonstration - comprehensive dataset for presentation
  const generateMockRetornados = () => {
    const filiais = ['Jundiaí', 'Franca'];
    const destinos = ['Estoque', 'Garantia', 'Descarte', 'Estoque Semi Novo', 'Uso Interno'];
    const toners = [
      { modelo: 'HP CF280A', peso_vazio: '50', gramatura: '450', capacidade_folhas: 2700, valor_por_folha: 0.05, cor: 'Preto' },
      { modelo: 'Samsung MLT-D111S', peso_vazio: '60', gramatura: '540', capacidade_folhas: 1000, valor_por_folha: 0.08, cor: 'Preto' },
      { modelo: 'Canon 725', peso_vazio: '45', gramatura: '355', capacidade_folhas: 1600, valor_por_folha: 0.06, cor: 'Preto' },
      { modelo: 'Brother TN-2340', peso_vazio: '55', gramatura: '465', capacidade_folhas: 2600, valor_por_folha: 0.04, cor: 'Preto' },
      { modelo: 'Xerox 106R03623', peso_vazio: '52', gramatura: '480', capacidade_folhas: 3000, valor_por_folha: 0.07, cor: 'Preto' }
    ];
    
    const mockData = [];
    let id = 1;
    
    // Gerar dados dos últimos 24 meses
    for (let monthsBack = 23; monthsBack >= 0; monthsBack--) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthsBack);
      
      // 5-15 registros por mês
      const recordsThisMonth = Math.floor(Math.random() * 11) + 5;
      
      for (let i = 0; i < recordsThisMonth; i++) {
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const recordDate = new Date(date.getFullYear(), date.getMonth(), randomDay);
        const toner = toners[Math.floor(Math.random() * toners.length)];
        const filial = filiais[Math.floor(Math.random() * filiais.length)];
        const destino = destinos[Math.floor(Math.random() * destinos.length)];
        const peso = (Math.random() * 400 + 200).toFixed(0); // 200-600g
        
        let valor_recuperado = 0;
        if (destino === 'Estoque' || destino === 'Estoque Semi Novo') {
          const gramaturaRestante = parseFloat(peso) - parseFloat(toner.peso_vazio);
          const percentualGramatura = (gramaturaRestante / parseFloat(toner.gramatura)) * 100;
          const folhasRestantes = (percentualGramatura / 100) * toner.capacidade_folhas;
          valor_recuperado = folhasRestantes * toner.valor_por_folha;
        } else if (destino === 'Garantia') {
          valor_recuperado = Math.random() * 300 + 100; // R$ 100-400
        }
        
        mockData.push({
          id: id++,
          data_registro: recordDate.toISOString().split('T')[0],
          peso,
          destino_final: destino,
          filial,
          valor_recuperado,
          toner
        });
      }
    }
    
    return mockData;
  };

  const allRetornados = generateMockRetornados();
  
  // Apply filters
  const retornados = allRetornados.filter(item => {
    const itemDate = new Date(item.data_registro);
    
    // Filter by date range
    if (filter.startDate && itemDate < filter.startDate) return false;
    if (filter.endDate && itemDate > filter.endDate) return false;
    
    // Filter by filial
    if (filter.filial && item.filial !== filter.filial) return false;
    
    return true;
  });

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

    // Process all data without filters for year comparison
    allRetornados.forEach((item: any) => {
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
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Volumetry Chart */}
      <Card className="shadow-lg border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Volumetria de Toners
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Quantidade de retornos por mês
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalChart('volumetry')}
            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumetryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <Bar dataKey="quantidade" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Value Recovered Chart */}
      <Card className="shadow-lg border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Valor Recuperado
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Receita obtida com retornos (R$)
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalChart('value')}
            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={valueRecoveredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="valor" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Year Comparison Chart */}
      <Card className="shadow-lg border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Comparação Anual
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Ano atual vs ano anterior
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalChart('comparison')}
            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <Legend />
              <Bar dataKey="anoAtual" fill="#3b82f6" name="Ano Atual" radius={[2, 2, 0, 0]} />
              <Bar dataKey="anoAnterior" fill="#6b7280" name="Ano Anterior" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Destination Pie Chart */}
      <Card className="shadow-lg border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Destino Final
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Distribuição por destino
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalChart('destination')}
            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={destinationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {destinationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart Modals */}
      <ChartModal
        isOpen={modalChart === 'volumetry'}
        onClose={() => setModalChart(null)}
        title="Volumetria de Toners Retornados por Mês"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={volumetryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </ChartModal>

      <ChartModal
        isOpen={modalChart === 'value'}
        onClose={() => setModalChart(null)}
        title="Valor Recuperado por Mês (R$)"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={valueRecoveredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']} />
            <Bar dataKey="valor" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </ChartModal>

      <ChartModal
        isOpen={modalChart === 'comparison'}
        onClose={() => setModalChart(null)}
        title="Comparação Ano Atual vs Ano Anterior"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yearComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="anoAtual" fill="#0088FE" name="Ano Atual" />
            <Bar dataKey="anoAnterior" fill="#FF8042" name="Ano Anterior" />
          </BarChart>
        </ResponsiveContainer>
      </ChartModal>

      <ChartModal
        isOpen={modalChart === 'destination'}
        onClose={() => setModalChart(null)}
        title="Quantidade por Destino Final"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={destinationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={200}
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
      </ChartModal>
    </div>
    </>
  );
};