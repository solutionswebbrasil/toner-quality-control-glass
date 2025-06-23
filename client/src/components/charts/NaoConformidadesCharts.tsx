import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DateFilter } from '../ChartFilters';
import { naoConformidadesApi } from '@/lib/api';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NaoConformidadesChartsProps {
  filter: DateFilter;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const NaoConformidadesCharts: React.FC<NaoConformidadesChartsProps> = ({ filter }) => {
  const { data: naoConformidades = [], isLoading } = useQuery({
    queryKey: ['/api/nao-conformidades'],
    queryFn: naoConformidadesApi.getAll
  });

  if (isLoading) {
    return <div>Carregando dados...</div>;
  }

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
        <CardHeader>
          <CardTitle>Não Conformidades por Mês</CardTitle>
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
        <CardHeader>
          <CardTitle>Não Conformidades por Categoria</CardTitle>
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
    </div>
  );
};