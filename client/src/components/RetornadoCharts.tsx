
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface RetornadoChartsProps {
  data: Array<{
    id: number;
    modelo: string;
    peso: number;
    destino_final: string;
    valor_recuperado: number;
    filial: string;
    data_registro: string;
  }>;
}

export const RetornadoCharts: React.FC<RetornadoChartsProps> = ({ data }) => {
  // Processar dados para gráficos
  const dadosPorMes = React.useMemo(() => {
    const meses = new Map<string, { quantidade: number; valor: number }>();
    
    data.forEach(item => {
      const mes = new Date(item.data_registro).toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!meses.has(mes)) {
        meses.set(mes, { quantidade: 0, valor: 0 });
      }
      
      const dados = meses.get(mes)!;
      dados.quantidade += 1;
      dados.valor += item.valor_recuperado || 0;
    });
    
    return Array.from(meses.entries()).map(([mes, dados]) => ({
      mes,
      quantidade: dados.quantidade,
      valor: dados.valor
    })).sort((a, b) => {
      const dateA = new Date(a.mes);
      const dateB = new Date(b.mes);
      return dateA.getTime() - dateB.getTime();
    });
  }, [data]);

  const dadosPorFilial = React.useMemo(() => {
    const filiais = new Map<string, { quantidade: number; valor: number }>();
    
    data.forEach(item => {
      if (!filiais.has(item.filial)) {
        filiais.set(item.filial, { quantidade: 0, valor: 0 });
      }
      
      const dados = filiais.get(item.filial)!;
      dados.quantidade += 1;
      dados.valor += item.valor_recuperado || 0;
    });
    
    return Array.from(filiais.entries()).map(([filial, dados]) => ({
      filial,
      quantidade: dados.quantidade,
      valor: dados.valor
    }));
  }, [data]);

  const dadosPorDestino = React.useMemo(() => {
    const destinos = new Map<string, number>();
    
    data.forEach(item => {
      const count = destinos.get(item.destino_final) || 0;
      destinos.set(item.destino_final, count + 1);
    });
    
    return Array.from(destinos.entries()).map(([destino, quantidade]) => ({
      destino,
      quantidade
    }));
  }, [data]);

  const totalRetornados = data.length;
  const totalValorRecuperado = data.reduce((sum, item) => sum + (item.valor_recuperado || 0), 0);
  const totalEstoque = data.filter(item => item.destino_final === 'Estoque').length;
  const totalGarantia = data.filter(item => item.destino_final === 'Garantia').length;

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Retornados</p>
                <p className="text-2xl font-bold">{totalRetornados}</p>
              </div>
              <Badge variant="secondary">{totalRetornados} itens</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Recuperado</p>
                <p className="text-2xl font-bold">
                  R$ {totalValorRecuperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Badge variant="secondary">Total</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enviados p/ Estoque</p>
                <p className="text-2xl font-bold">{totalEstoque}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {((totalEstoque / totalRetornados) * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enviados p/ Garantia</p>
                <p className="text-2xl font-bold">{totalGarantia}</p>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {((totalGarantia / totalRetornados) * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Retornados por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Retornados por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Valor Recuperado por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Valor Recuperado por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [
                  `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  'Valor Recuperado'
                ]}
              />
              <Bar dataKey="valor" fill="#10B981" name="Valor Recuperado" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico por Filial */}
      <Card>
        <CardHeader>
          <CardTitle>Retornados por Filial</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosPorFilial}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="filial" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#8B5CF6" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumo por Destino */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Destino</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dadosPorDestino.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.destino}</span>
                  <span className="text-sm text-gray-600">
                    {item.quantidade} itens ({((item.quantidade / totalRetornados) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.quantidade / totalRetornados) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
