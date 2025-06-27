
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { retornadoService } from '@/services/retornadoService';

export const GraficosRetornados: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [filialData, setFilialData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Classic PHP colors - solid, no gradients
  const colors = ['#336699', '#669933', '#CC6600', '#CC3333', '#663399'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const stats = await retornadoService.getStats();
      
      const monthlyArray = Object.entries(stats.monthlyData).map(([month, data]: [string, any]) => ({
        mes: month,
        quantidade: data.quantidade,
        peso: data.peso
      }));
      
      const filialArray = Object.entries(stats.filialData).map(([filial, quantidade]) => ({
        filial,
        quantidade
      }));

      setMonthlyData(monthlyArray);
      setFilialData(filialArray);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, []);

  if (isLoading) {
    return (
      <div className="classic-container">
        <div className="classic-header">
          Gráficos de Retornados
        </div>
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '12px', color: '#666' }}>
          Carregando gráficos...
        </div>
      </div>
    );
  }

  return (
    <div className="classic-container">
      <div className="classic-header">
        Gráficos de Retornados
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Gráfico de Quantidade por Mês */}
        <div className="classic-chart">
          <h3>Retornados por Mês</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="none" stroke="#cccccc" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#333' }} />
                <YAxis tick={{ fontSize: 11, fill: '#333' }} />
                <Bar dataKey="quantidade" fill="#336699" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico por Filial */}
        <div className="classic-chart">
          <h3>Retornados por Filial</h3>
          <div style={{ height: '300px' }}>
            {filialData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={filialData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ filial, percent }) => `${filial}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {filialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '12px' }}>
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gráfico de Peso Total */}
      <div className="classic-chart">
        <h3>Peso Total por Mês (kg)</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="none" stroke="#cccccc" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#333' }} />
              <YAxis tick={{ fontSize: 11, fill: '#333' }} />
              <Line type="monotone" dataKey="peso" stroke="#669933" strokeWidth={2} dot={{ fill: '#669933', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {monthlyData.length === 0 && filialData.length === 0 && (
        <div className="classic-chart">
          <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
            Não há dados suficientes para gerar os gráficos.
          </div>
        </div>
      )}
    </div>
  );
};
