import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartModal } from './ChartModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { Maximize2 } from 'lucide-react';

export const ParetoPage: React.FC = () => {
  const [modalChart, setModalChart] = useState<string | null>(null);

  // Dados de exemplo para análise de Pareto
  const paretoData = [
    { 
      categoria: 'Vazamento de Toner', 
      quantidade: 45, 
      percentual: 32.14,
      acumulado: 32.14,
      custo: 15750
    },
    { 
      categoria: 'Qualidade de Impressão', 
      quantidade: 38, 
      percentual: 27.14,
      acumulado: 59.28,
      custo: 13300
    },
    { 
      categoria: 'Desgaste Prematuro', 
      quantidade: 25, 
      percentual: 17.86,
      acumulado: 77.14,
      custo: 8750
    },
    { 
      categoria: 'Falha no Cartucho', 
      quantidade: 18, 
      percentual: 12.86,
      acumulado: 90.00,
      custo: 6300
    },
    { 
      categoria: 'Incompatibilidade', 
      quantidade: 8, 
      percentual: 5.71,
      acumulado: 95.71,
      custo: 2800
    },
    { 
      categoria: 'Outros', 
      quantidade: 6, 
      percentual: 4.29,
      acumulado: 100.00,
      custo: 2100
    }
  ];

  const custosParetoData = [
    { 
      categoria: 'Vazamento de Toner', 
      custo: 15750, 
      percentual: 31.5,
      acumulado: 31.5
    },
    { 
      categoria: 'Qualidade de Impressão', 
      custo: 13300, 
      percentual: 26.6,
      acumulado: 58.1
    },
    { 
      categoria: 'Desgaste Prematuro', 
      custo: 8750, 
      percentual: 17.5,
      acumulado: 75.6
    },
    { 
      categoria: 'Falha no Cartucho', 
      custo: 6300, 
      percentual: 12.6,
      acumulado: 88.2
    },
    { 
      categoria: 'Incompatibilidade', 
      custo: 2800, 
      percentual: 5.6,
      acumulado: 93.8
    },
    { 
      categoria: 'Outros', 
      custo: 2100, 
      percentual: 4.2,
      acumulado: 98.0
    }
  ];

  const ParetoChart = ({ data, dataKey, title, yAxisLabel, isModal = false }: any) => {
    const height = isModal ? "100%" : 400;
    
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="categoria" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            fontSize={12}
          />
          <YAxis yAxisId="left" orientation="left" label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: '% Acumulado', angle: 90, position: 'insideRight' }} />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'Acumulado %') return [`${value}%`, name];
              if (dataKey === 'custo') return [`R$ ${value.toLocaleString()}`, name];
              return [value, name];
            }}
          />
          <Legend />
          <Bar 
            yAxisId="left" 
            dataKey={dataKey} 
            fill="#0088FE" 
            name={dataKey === 'custo' ? 'Custo (R$)' : 'Quantidade'}
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="acumulado" 
            stroke="#FF8042" 
            strokeWidth={3}
            name="Acumulado %"
            dot={{ fill: '#FF8042', strokeWidth: 2, r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
          Análise de Pareto
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">140</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total de Problemas</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">R$ 49.000</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Custo Total</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">77%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Top 3 Problemas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pareto por Quantidade */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Análise de Pareto - Quantidade de Problemas</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalChart('quantidade')}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ParetoChart 
              data={paretoData} 
              dataKey="quantidade" 
              title="Quantidade de Problemas"
              yAxisLabel="Quantidade"
            />
          </CardContent>
        </Card>

        {/* Pareto por Custo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Análise de Pareto - Custo dos Problemas</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalChart('custo')}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ParetoChart 
              data={custosParetoData} 
              dataKey="custo" 
              title="Custo dos Problemas"
              yAxisLabel="Custo (R$)"
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Dados */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento dos Problemas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Categoria</th>
                  <th className="text-right p-2">Quantidade</th>
                  <th className="text-right p-2">%</th>
                  <th className="text-right p-2">% Acumulado</th>
                  <th className="text-right p-2">Custo (R$)</th>
                  <th className="text-center p-2">Classificação</th>
                </tr>
              </thead>
              <tbody>
                {paretoData.map((item, index) => (
                  <tr key={item.categoria} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="p-2 font-medium">{item.categoria}</td>
                    <td className="text-right p-2">{item.quantidade}</td>
                    <td className="text-right p-2">{item.percentual.toFixed(1)}%</td>
                    <td className="text-right p-2">{item.acumulado.toFixed(1)}%</td>
                    <td className="text-right p-2">R$ {item.custo.toLocaleString()}</td>
                    <td className="text-center p-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.acumulado <= 80 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {item.acumulado <= 80 ? 'Classe A' : 'Classe B'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interpretação */}
      <Card>
        <CardHeader>
          <CardTitle>Interpretação da Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🎯 Classe A (Críticos) - 80% dos problemas</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Vazamento de Toner, Qualidade de Impressão e Desgaste Prematuro</strong> representam 77% dos problemas.
                Concentre 80% dos esforços nestas categorias para máximo impacto.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Classe B (Importantes) - 20% dos problemas</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Falha no Cartucho, Incompatibilidade e Outros</strong> representam 23% dos problemas.
                Monitore regularmente e implemente melhorias graduais.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Recomendações</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Foque na prevenção de vazamentos através de melhor controle de qualidade</li>
                <li>• Implemente testes mais rigorosos na linha de produção</li>
                <li>• Revise especificações técnicas com fornecedores</li>
                <li>• Monitore indicadores dos itens Classe A semanalmente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ChartModal
        isOpen={modalChart === 'quantidade'}
        onClose={() => setModalChart(null)}
        title="Análise de Pareto - Quantidade de Problemas"
      >
        <ParetoChart 
          data={paretoData} 
          dataKey="quantidade" 
          title="Quantidade de Problemas"
          yAxisLabel="Quantidade"
          isModal={true}
        />
      </ChartModal>

      <ChartModal
        isOpen={modalChart === 'custo'}
        onClose={() => setModalChart(null)}
        title="Análise de Pareto - Custo dos Problemas"
      >
        <ParetoChart 
          data={custosParetoData} 
          dataKey="custo" 
          title="Custo dos Problemas"
          yAxisLabel="Custo (R$)"
          isModal={true}
        />
      </ChartModal>
    </div>
  );
};