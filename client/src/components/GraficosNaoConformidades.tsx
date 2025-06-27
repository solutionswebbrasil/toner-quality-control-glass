
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { naoConformidadeService } from '@/services/naoConformidadeService';

export const GraficosNaoConformidades: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [tipoData, setTipoData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const colors = ['#336699', '#669933', '#CC6600', '#CC3333', '#663399'];

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const naoConformidades = await naoConformidadeService.getAll();
      
      const monthlyMap = new Map();
      const tipoMap = new Map();
      const statusMap = new Map();
      
      naoConformidades.forEach(nc => {
        const date = new Date(nc.data_registro || nc.data_ocorrencia);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
        tipoMap.set(nc.tipo_nc, (tipoMap.get(nc.tipo_nc) || 0) + 1);
        statusMap.set(nc.status, (statusMap.get(nc.status) || 0) + 1);
      });

      const monthlyArray = Array.from(monthlyMap.entries()).map(([mes, quantidade]) => ({
        mes,
        quantidade
      }));

      const tipoArray = Array.from(tipoMap.entries()).map(([tipo, quantidade]) => ({
        tipo,
        quantidade
      }));

      const statusArray = Array.from(statusMap.entries()).map(([status, quantidade]) => ({
        status,
        quantidade
      }));

      setMonthlyData(monthlyArray);
      setTipoData(tipoArray);
      setStatusData(statusArray);
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
          Gráficos de Não Conformidades
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
        Gráficos de Não Conformidades
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Gráfico de Quantidade por Mês */}
        <div className="classic-chart">
          <h3>Não Conformidades por Mês</h3>
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

        {/* Gráfico por Tipo */}
        <div className="classic-chart">
          <h3>Não Conformidades por Tipo</h3>
          <div style={{ height: '300px' }}>
            {tipoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={tipoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo, percent }) => `${tipo}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {tipoData.map((entry, index) => (
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

      {/* Gráfico de Status */}
      <div className="classic-chart">
        <h3>Status das Não Conformidades</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="none" stroke="#cccccc" />
              <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#333' }} />
              <YAxis tick={{ fontSize: 11, fill: '#333' }} />
              <Bar dataKey="quantidade" fill="#669933" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {monthlyData.length === 0 && tipoData.length === 0 && statusData.length === 0 && (
        <div className="classic-chart">
          <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
            Não há dados suficientes para gerar os gráficos.
          </div>
        </div>
      )}
    </div>
  );
};
