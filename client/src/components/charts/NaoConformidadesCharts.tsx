import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DateFilter } from '../ChartFilters';
import { ChartModal } from '../ChartModal';
import { naoConformidadesApi } from '@/lib/api';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Maximize2 } from 'lucide-react';

interface NaoConformidadesChartsProps {
  filter: DateFilter;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const NaoConformidadesCharts: React.FC<NaoConformidadesChartsProps> = ({ filter }) => {
  const [modalChart, setModalChart] = useState<string | null>(null);
  // Enhanced mock data for demonstration - comprehensive dataset for presentation
  const generateMockNaoConformidades = () => {
    const tipos = [
      { categoria: 'Processo', descricoes: ['Falha no processo de impressão', 'Processo de limpeza inadequado', 'Falha na calibração do processo'] },
      { categoria: 'Peças', descricoes: ['Peça defeituosa no equipamento', 'Desgaste prematuro de peças', 'Peça fora de especificação'] },
      { categoria: 'Toners', descricoes: ['Toner com vazamento', 'Qualidade de impressão ruim', 'Toner ressecado'] },
      { categoria: 'Máquinas', descricoes: ['Máquina apresentando ruído excessivo', 'Falha no sistema de alimentação', 'Superaquecimento do equipamento'] }
    ];
    const filiais = ['Jundiaí', 'Franca'];
    
    const mockData = [];
    let id = 1;
    
    // Gerar dados dos últimos 24 meses
    for (let monthsBack = 23; monthsBack >= 0; monthsBack--) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthsBack);
      
      // 2-6 não conformidades por mês
      const recordsThisMonth = Math.floor(Math.random() * 5) + 2;
      
      for (let i = 0; i < recordsThisMonth; i++) {
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const recordDate = new Date(date.getFullYear(), date.getMonth(), randomDay);
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        const descricao = tipo.descricoes[Math.floor(Math.random() * tipo.descricoes.length)];
        const filial = filiais[Math.floor(Math.random() * filiais.length)];
        
        mockData.push({
          id: id++,
          data_criacao: recordDate.toISOString().split('T')[0],
          descricao,
          categoria: tipo.categoria,
          filial
        });
      }
    }
    
    return mockData;
  };

  const allNaoConformidades = generateMockNaoConformidades();
  
  // Apply filters
  const naoConformidades = allNaoConformidades.filter(item => {
    const itemDate = new Date(item.data_criacao);
    
    // Filter by date range
    if (filter.startDate && itemDate < filter.startDate) return false;
    if (filter.endDate && itemDate > filter.endDate) return false;
    
    // Filter by filial
    if (filter.filial && item.filial !== filter.filial) return false;
    
    return true;
  });

  // Process data for monthly non-conformities chart
  const getMonthlyNaoConformidadesData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    naoConformidades.forEach((item: any) => {
      const date = new Date(item.data_criacao);
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

  // Process data for non-conformities by category
  const getNaoConformidadesByCategoryData = () => {
    const categoryCount: { [key: string]: number } = {};
    
    naoConformidades.forEach((item: any) => {
      // Determine category based on the description or type
      let category = 'Outros';
      const descricao = (item.descricao || '').toLowerCase();
      
      if (descricao.includes('processo')) {
        category = 'Processo';
      } else if (descricao.includes('peça') || descricao.includes('peças')) {
        category = 'Peças';
      } else if (descricao.includes('toner') || descricao.includes('toners')) {
        category = 'Toners';
      } else if (descricao.includes('máquina') || descricao.includes('maquina') || descricao.includes('equipamento')) {
        category = 'Máquinas';
      }
      
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  const monthlyData = getMonthlyNaoConformidadesData();
  const categoryData = getNaoConformidadesByCategoryData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Non-Conformities Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Não Conformidades por Mês</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalChart('monthly')}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Non-Conformities by Category Pie Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Não Conformidades por Categoria</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalChart('category')}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart Modals */}
      <ChartModal
        isOpen={modalChart === 'monthly'}
        onClose={() => setModalChart(null)}
        title="Não Conformidades por Mês"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </ChartModal>

      <ChartModal
        isOpen={modalChart === 'category'}
        onClose={() => setModalChart(null)}
        title="Não Conformidades por Categoria"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={200}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartModal>
    </div>
  );
};