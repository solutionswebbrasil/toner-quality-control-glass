
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Save, Settings, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRegrasRetornado } from '@/hooks/useRegrasRetornado';

export const ConfiguracoesRetornado: React.FC = () => {
  const { regras, setRegras, restaurarPadrao } = useRegrasRetornado();
  const [isLoading, setIsLoading] = useState(false);

  const salvarRegras = async () => {
    setIsLoading(true);
    try {
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

  const handleRestaurarPadrao = () => {
    restaurarPadrao();
    toast({
      title: "Restaurado!",
      description: "Regras restauradas para o padrão do sistema.",
    });
  };

  const atualizarRegra = (index: number, campo: keyof typeof regras[0], valor: string | number) => {
    const novasRegras = [...regras];
    if (campo === 'percentual_min' || campo === 'percentual_max') {
      novasRegras[index][campo] = Number(valor);
    } else {
      novasRegras[index][campo] = valor as string;
    }
    setRegras(novasRegras);
  };

  const getDestinoColor = (destino: string) => {
    if (destino.includes('Descarte')) {
      return 'border-red-500 bg-red-50 dark:bg-red-950';
    } else if (destino.includes('Uso Interno')) {
      return 'border-orange-500 bg-orange-50 dark:bg-orange-950';
    } else if (destino.includes('Semi Novo')) {
      return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
    } else if (destino.includes('Novo')) {
      return 'border-green-500 bg-green-50 dark:bg-green-950';
    }
    return 'border-gray-500 bg-gray-50 dark:bg-gray-950';
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
              Configure os percentuais de gramatura restante para sugerir automaticamente o destino final dos toners retornados.
              O sistema calcula: <strong>Gramatura Restante = Peso Atual - Peso Vazio</strong>, depois compara com a gramatura total para obter a porcentagem.
              As regras são sugestões e os percentuais podem se sobrepor conforme necessário.
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
                  Faixa: {regra.percentual_min}% - {regra.percentual_max}% de gramatura restante
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button 
              onClick={salvarRegras}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>

            <Button 
              onClick={handleRestaurarPadrao}
              variant="outline"
              className="bg-white/70 dark:bg-slate-800/70"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
