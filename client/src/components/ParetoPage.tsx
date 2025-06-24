import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartModal } from './ChartModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { paretoApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Maximize2, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const ParetoPage: React.FC = () => {
  const [modalChart, setModalChart] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { register, handleSubmit, reset } = useForm();
  const [itens, setItens] = useState([
    { categoria: '', quantidade: 0, custo: 0 }
  ]);

  // Fetch análises
  const { data: analises = [] } = useQuery({
    queryKey: ['analises-pareto'],
    queryFn: paretoApi.getAnalises
  });

  // Fetch itens da análise selecionada - Fix method name
  const { data: itensData = [] } = useQuery({
    queryKey: ['itens-pareto', selectedAnalise],
    queryFn: () => selectedAnalise ? paretoApi.getItems(selectedAnalise) : Promise.resolve([]),
    enabled: !!selectedAnalise
  });

  // Mutation para criar análise
  const createAnaliseMutation = useMutation({
    mutationFn: paretoApi.createAnalise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises-pareto'] });
      toast({ title: "Análise criada com sucesso!" });
      setFormOpen(false);
      reset();
    }
  });

  // Mutation para criar item
  const createItemMutation = useMutation({
    mutationFn: paretoApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itens-pareto', selectedAnalise] });
    }
  });

  // Calcular dados do Pareto
  const getParetoData = () => {
    if (!selectedAnalise || itensData.length === 0) {
      // Dados de exemplo
      return [
        { categoria: 'Vazamento de Toner', quantidade: 45, percentual: 32.14, acumulado: 32.14, custo: 15750 },
        { categoria: 'Qualidade de Impressão', quantidade: 38, percentual: 27.14, acumulado: 59.28, custo: 13300 },
        { categoria: 'Desgaste Prematuro', quantidade: 25, percentual: 17.86, acumulado: 77.14, custo: 8750 },
        { categoria: 'Falha no Cartucho', quantidade: 18, percentual: 12.86, acumulado: 90.00, custo: 6300 },
        { categoria: 'Incompatibilidade', quantidade: 8, percentual: 5.71, acumulado: 95.71, custo: 2800 },
        { categoria: 'Outros', quantidade: 6, percentual: 4.29, acumulado: 100.00, custo: 2100 }
      ];
    }

    // Ordenar por quantidade decrescente
    const sorted = [...itensData].sort((a, b) => b.quantidade - a.quantidade);
    const total = sorted.reduce((sum, item) => sum + item.quantidade, 0);
    
    let acumulado = 0;
    return sorted.map(item => {
      const percentual = (item.quantidade / total) * 100;
      acumulado += percentual;
      return {
        ...item,
        percentual,
        acumulado
      };
    });
  };

  const paretoData = getParetoData();

  const getCustosParetoData = () => {
    if (!selectedAnalise || itensData.length === 0) {
      return [
        { categoria: 'Vazamento de Toner', custo: 15750, percentual: 31.5, acumulado: 31.5 },
        { categoria: 'Qualidade de Impressão', custo: 13300, percentual: 26.6, acumulado: 58.1 },
        { categoria: 'Desgaste Prematuro', custo: 8750, percentual: 17.5, acumulado: 75.6 },
        { categoria: 'Falha no Cartucho', custo: 6300, percentual: 12.6, acumulado: 88.2 },
        { categoria: 'Incompatibilidade', custo: 2800, percentual: 5.6, acumulado: 93.8 },
        { categoria: 'Outros', custo: 2100, percentual: 4.2, acumulado: 98.0 }
      ];
    }

    const sorted = [...itensData].sort((a, b) => (b.custo || 0) - (a.custo || 0));
    const total = sorted.reduce((sum, item) => sum + (item.custo || 0), 0);
    
    let acumulado = 0;
    return sorted.map(item => {
      const percentual = ((item.custo || 0) / total) * 100;
      acumulado += percentual;
      return {
        ...item,
        percentual,
        acumulado
      };
    });
  };

  const custosParetoData = getCustosParetoData();

  const onSubmit = async (data: any) => {
    try {
      const analiseData = {
        nome: data.nome,
        descricao: data.descricao,
        criado_por: 'usuário_atual'
      };

      const analise = await createAnaliseMutation.mutateAsync(analiseData);

      // Criar os itens
      for (const item of itens) {
        if (item.categoria && item.quantidade > 0) {
          const total = itens.reduce((sum, i) => sum + i.quantidade, 0);
          const percentual = (item.quantidade / total) * 100;
          
          await createItemMutation.mutateAsync({
            analise_id: analise.id,
            categoria: item.categoria,
            quantidade: item.quantidade,
            custo: item.custo || 0,
            percentual,
            acumulado: 0 // Será calculado depois
          });
        }
      }
    } catch (error) {
      toast({ title: "Erro ao criar análise", variant: "destructive" });
    }
  };

  const addItem = () => {
    setItens([...itens, { categoria: '', quantidade: 0, custo: 0 }]);
  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItens = [...itens];
    newItens[index] = { ...newItens[index], [field]: value };
    setItens(newItens);
  };

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
        <div className="flex gap-3">
          <Select value={selectedAnalise?.toString() || ''} onValueChange={(value) => setSelectedAnalise(value ? parseInt(value) : null)}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione uma análise" />
            </SelectTrigger>
            <SelectContent>
              {analises.map((analise: any) => (
                <SelectItem key={analise.id} value={analise.id.toString()}>
                  {analise.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Análise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Análise Pareto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Análise</Label>
                    <Input {...register('nome', { required: true })} placeholder="Ex: Análise de Defeitos por Categoria" />
                  </div>
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea {...register('descricao')} placeholder="Descrição da análise..." />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Itens da Análise</h3>
                  {itens.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label>Categoria</Label>
                            <Input
                              value={item.categoria}
                              onChange={(e) => updateItem(index, 'categoria', e.target.value)}
                              placeholder="Nome da categoria..."
                            />
                          </div>
                          <div>
                            <Label>Quantidade</Label>
                            <Input
                              type="number"
                              value={item.quantidade}
                              onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label>Custo (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.custo}
                              onChange={(e) => updateItem(index, 'custo', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createAnaliseMutation.isPending}>
                    {createAnaliseMutation.isPending ? 'Salvando...' : 'Salvar Análise'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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
