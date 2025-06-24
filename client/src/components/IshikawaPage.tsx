
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
import { ishikawaApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Maximize2, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface IshikawaAnalise {
  id: number;
  nome: string;
  problema: string;
  criado_por: string;
  data_criacao: string;
}

interface IshikawaCategoria {
  id: number;
  analise_id: number;
  nome: string;
  causas: string[];
}

interface CategoriaLocal {
  nome: string;
  causas: string[];
}

export const IshikawaPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAnalise, setSelectedAnalise] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [categorias, setCategorias] = useState<CategoriaLocal[]>([
    { nome: 'Máquina/Equipamento', causas: [''] },
    { nome: 'Material', causas: [''] },
    { nome: 'Método', causas: [''] },
    { nome: 'Mão de Obra', causas: [''] },
    { nome: 'Meio Ambiente', causas: [''] },
    { nome: 'Medida', causas: [''] }
  ]);

  // Fetch análises
  const { data: analises = [] } = useQuery({
    queryKey: ['analises-ishikawa'],
    queryFn: ishikawaApi.getAnalises
  });

  // Fetch categorias da análise selecionada
  const { data: categoriasData = [] } = useQuery({
    queryKey: ['categorias-ishikawa', selectedAnalise],
    queryFn: () => selectedAnalise ? ishikawaApi.getCategorias(selectedAnalise) : Promise.resolve([]),
    enabled: !!selectedAnalise
  });

  // Mutation para criar análise
  const createAnaliseMutation = useMutation({
    mutationFn: ishikawaApi.createAnalise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises-ishikawa'] });
      toast({ title: "Análise criada com sucesso!" });
      setFormOpen(false);
      reset();
    }
  });

  // Mutation para criar categoria
  const createCategoriaMutation = useMutation({
    mutationFn: ishikawaApi.createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias-ishikawa', selectedAnalise] });
    }
  });

  // Dados do diagrama
  const getIshikawaData = () => {
    if (!selectedAnalise || categoriasData.length === 0) {
      // Dados de exemplo se nenhuma análise for selecionada
      return {
        problema: "Defeitos em Toners (Exemplo)",
        categorias: [
          { nome: "Máquina/Equipamento", causas: ["Desgaste de peças", "Calibragem inadequada"] },
          { nome: "Material", causas: ["Qualidade da matéria-prima", "Fornecedores inadequados"] },
          { nome: "Método", causas: ["Procedimentos inadequados", "Falta de padronização"] },
          { nome: "Mão de Obra", causas: ["Falta de treinamento", "Experiência insuficiente"] },
          { nome: "Meio Ambiente", causas: ["Temperatura inadequada", "Umidade excessiva"] },
          { nome: "Medida", causas: ["Instrumentos descalibrados", "Frequência inadequada"] }
        ]
      };
    }

    const analise = (analises as IshikawaAnalise[]).find((a: IshikawaAnalise) => a.id === selectedAnalise);
    return {
      problema: analise?.problema || "Problema não definido",
      categorias: (categoriasData as IshikawaCategoria[]).map((cat: IshikawaCategoria) => ({
        nome: cat.nome,
        causas: cat.causas || []
      }))
    };
  };

  const ishikawaData = getIshikawaData();

  const IshikawaDiagram = ({ isModal = false }) => {
    const containerHeight = isModal ? "80vh" : "600px";
    
    return (
      <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-lg border" style={{ height: containerHeight }}>
        <svg width="100%" height="100%" viewBox="0 0 1200 600" className="absolute inset-0">
          {/* Linha principal (espinha central) */}
          <line x1="150" y1="300" x2="1050" y2="300" stroke="#374151" strokeWidth="4" />
          
          {/* Cabeça do peixe (problema) */}
          <polygon points="1050,300 1100,280 1100,320" fill="#dc2626" />
          
          {/* Texto do problema */}
          <text x="950" y="295" textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-lg font-bold">
            {ishikawaData.problema}
          </text>
          
          {/* Categorias e causas */}
          {ishikawaData.categorias.map((categoria: { nome: string; causas: string[] }, index: number) => {
            const isTop = index < 3;
            const xPosition = 200 + (index % 3) * 280;
            const yPosition = isTop ? 150 : 450;
            const lineY = isTop ? 300 - 150 : 300 + 150;
            
            return (
              <g key={categoria.nome}>
                {/* Linha da categoria */}
                <line 
                  x1={xPosition} 
                  y1={lineY} 
                  x2={xPosition + 150} 
                  y2="300" 
                  stroke="#6b7280" 
                  strokeWidth="3" 
                />
                
                {/* Texto da categoria */}
                <text 
                  x={xPosition - 10} 
                  y={isTop ? lineY - 10 : lineY + 20} 
                  textAnchor="middle" 
                  className="fill-blue-600 dark:fill-blue-400 text-sm font-bold"
                >
                  {categoria.nome}
                </text>
                
                {/* Causas */}
                {categoria.causas.map((causa: string, causaIndex: number) => {
                  const causaY = isTop 
                    ? lineY - 30 - (causaIndex * 25)
                    : lineY + 30 + (causaIndex * 25);
                  const causaX = xPosition - 20 - (causaIndex * 15);
                  
                  return (
                    <g key={causa}>
                      {/* Linha da causa */}
                      <line 
                        x1={causaX} 
                        y1={causaY} 
                        x2={causaX + 40} 
                        y2={isTop ? causaY + 20 : causaY - 20} 
                        stroke="#9ca3af" 
                        strokeWidth="2" 
                      />
                      
                      {/* Texto da causa */}
                      <text 
                        x={causaX - 5} 
                        y={isTop ? causaY - 5 : causaY + 15} 
                        textAnchor="end" 
                        className="fill-slate-600 dark:fill-slate-400 text-xs"
                      >
                        {causa}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
        
        {/* Legenda */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
          <h4 className="font-semibold text-sm mb-2">Análise de Ishikawa - 6M</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Categorias</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
              <span>Causas</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onSubmit = async (data: any) => {
    try {
      const analiseData = {
        nome: data.nome,
        problema: data.problema,
        criado_por: 'usuário_atual' // Aqui você pegaria do contexto de autenticação
      };

      const analise = await createAnaliseMutation.mutateAsync(analiseData);

      // Criar as categorias
      for (const categoria of categorias) {
        if (categoria.causas.some(c => c.trim())) {
          await createCategoriaMutation.mutateAsync({
            analise_id: (analise as IshikawaAnalise).id,
            nome: categoria.nome,
            causas: categoria.causas.filter(c => c.trim())
          });
        }
      }
    } catch (error) {
      toast({ title: "Erro ao criar análise", variant: "destructive" });
    }
  };

  const addCausa = (categoriaIndex: number) => {
    const newCategorias = [...categorias];
    newCategorias[categoriaIndex].causas.push('');
    setCategorias(newCategorias);
  };

  const removeCausa = (categoriaIndex: number, causaIndex: number) => {
    const newCategorias = [...categorias];
    newCategorias[categoriaIndex].causas.splice(causaIndex, 1);
    setCategorias(newCategorias);
  };

  const updateCausa = (categoriaIndex: number, causaIndex: number, value: string) => {
    const newCategorias = [...categorias];
    newCategorias[categoriaIndex].causas[causaIndex] = value;
    setCategorias(newCategorias);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
          Análise de Ishikawa (Diagrama Espinha de Peixe)
        </h1>
        <div className="flex gap-3">
          <Select value={selectedAnalise?.toString() || ''} onValueChange={(value) => setSelectedAnalise(value ? parseInt(value) : null)}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione uma análise" />
            </SelectTrigger>
            <SelectContent>
              {(analises as IshikawaAnalise[]).map((analise: IshikawaAnalise) => (
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
                <DialogTitle>Criar Nova Análise Ishikawa</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Análise</Label>
                    <Input {...register('nome', { required: true })} placeholder="Ex: Análise de Defeitos em Produção" />
                  </div>
                  <div>
                    <Label htmlFor="problema">Problema Central</Label>
                    <Input {...register('problema', { required: true })} placeholder="Ex: Alto índice de defeitos" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Categorias e Causas (6M)</h3>
                  {categorias.map((categoria: CategoriaLocal, catIndex: number) => (
                    <Card key={catIndex}>
                      <CardHeader>
                        <CardTitle className="text-md">{categoria.nome}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {categoria.causas.map((causa: string, causaIndex: number) => (
                            <div key={causaIndex} className="flex gap-2">
                              <Input
                                value={causa}
                                onChange={(e) => updateCausa(catIndex, causaIndex, e.target.value)}
                                placeholder="Descreva uma causa..."
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeCausa(catIndex, causaIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addCausa(catIndex)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Causa
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Diagrama de Causa e Efeito - Defeitos em Toners</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setModalOpen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <IshikawaDiagram />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ishikawaData.categorias.map((categoria: { nome: string; causas: string[] }, index: number) => (
          <Card key={categoria.nome}>
            <CardHeader>
              <CardTitle className="text-lg">{categoria.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {categoria.causas.map((causa: string, causaIndex: number) => (
                  <li key={causaIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {causa}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <ChartModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Análise de Ishikawa - Diagrama Completo"
      >
        <IshikawaDiagram isModal={true} />
      </ChartModal>
    </div>
  );
};
