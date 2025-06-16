
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Save, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RegraRetornado {
  id: string;
  destino: string;
  percentual_min: number;
  percentual_max: number;
  orientacoes: string;
}

const regrasIniciais: RegraRetornado[] = [
  {
    id: 'estoque',
    destino: 'Estoque',
    percentual_min: 0,
    percentual_max: 20,
    orientacoes: 'Toners com baixíssimo uso, adequados para reuso futuro. Verificar condições de armazenamento.'
  },
  {
    id: 'estoque_semi_novo',
    destino: 'Estoque Semi Novo',
    percentual_min: 21,
    percentual_max: 40,
    orientacoes: 'Toners com uso baixo a moderado, em bom estado para uso como semi novos.'
  },
  {
    id: 'uso_interno',
    destino: 'Uso Interno',
    percentual_min: 41,
    percentual_max: 70,
    orientacoes: 'Toners com uso moderado, utilizáveis para impressões internas e testes.'
  },
  {
    id: 'garantia',
    destino: 'Garantia',
    percentual_min: 71,
    percentual_max: 90,
    orientacoes: 'Toners com alto uso, verificar se ainda estão no período de garantia.'
  },
  {
    id: 'descarte',
    destino: 'Descarte',
    percentual_min: 91,
    percentual_max: 100,
    orientacoes: 'Toners com uso muito alto, destinados ao descarte ecológico adequado.'
  }
];

export const ConfiguracoesRetornado: React.FC = () => {
  const [regras, setRegras] = useState<RegraRetornado[]>(regrasIniciais);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    carregarRegras();
  }, []);

  const carregarRegras = () => {
    // Carregar regras do localStorage por enquanto
    const regrasStorage = localStorage.getItem('regras_retornado');
    if (regrasStorage) {
      setRegras(JSON.parse(regrasStorage));
    }
  };

  const salvarRegras = async () => {
    setIsLoading(true);
    try {
      // Validar se os percentuais não se sobrepõem
      const regrasOrdenadas = [...regras].sort((a, b) => a.percentual_min - b.percentual_min);
      
      for (let i = 0; i < regrasOrdenadas.length - 1; i++) {
        if (regrasOrdenadas[i].percentual_max >= regrasOrdenadas[i + 1].percentual_min) {
          toast({
            title: "Erro de Validação",
            description: "Os percentuais não podem se sobrepor entre as regras.",
            variant: "destructive"
          });
          return;
        }
      }

      // Salvar no localStorage por enquanto
      localStorage.setItem('regras_retornado', JSON.stringify(regras));
      
      toast({
        title: "Sucesso!",
        description: "Regras de retornado salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar regras de retornado.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarRegra = (index: number, campo: keyof RegraRetornado, valor: string | number) => {
    const novasRegras = [...regras];
    if (campo === 'percentual_min' || campo === 'percentual_max') {
      novasRegras[index][campo] = Number(valor);
    } else {
      novasRegras[index][campo] = valor as string;
    }
    setRegras(novasRegras);
  };

  const getDestinoColor = (destino: string) => {
    switch (destino) {
      case 'Estoque':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'Estoque Semi Novo':
        return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950';
      case 'Uso Interno':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      case 'Garantia':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'Descarte':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-950';
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações de Regras de Retornado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Como funciona:</h4>
            <p>
              Configure os percentuais de uso de gramatura para determinar automaticamente o destino final dos toners retornados.
              O sistema calculará o percentual de uso baseado na gramatura usada vs gramatura total do toner.
            </p>
          </div>

          {regras.map((regra, index) => (
            <Card key={regra.id} className={`${getDestinoColor(regra.destino)} border-2`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{regra.destino}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`min-${regra.id}`}>Percentual Mínimo (%)</Label>
                    <Input
                      id={`min-${regra.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={regra.percentual_min}
                      onChange={(e) => atualizarRegra(index, 'percentual_min', e.target.value)}
                      className="bg-white/70 dark:bg-slate-800/70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`max-${regra.id}`}>Percentual Máximo (%)</Label>
                    <Input
                      id={`max-${regra.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={regra.percentual_max}
                      onChange={(e) => atualizarRegra(index, 'percentual_max', e.target.value)}
                      className="bg-white/70 dark:bg-slate-800/70"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`orientacoes-${regra.id}`}>Orientações para Preenchimento</Label>
                  <Textarea
                    id={`orientacoes-${regra.id}`}
                    placeholder="Digite as orientações para este destino..."
                    value={regra.orientacoes}
                    onChange={(e) => atualizarRegra(index, 'orientacoes', e.target.value)}
                    className="bg-white/70 dark:bg-slate-800/70 min-h-[80px]"
                  />
                </div>

                <div className="text-sm font-medium text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded">
                  Faixa: {regra.percentual_min}% - {regra.percentual_max}% de uso
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            onClick={salvarRegras}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
