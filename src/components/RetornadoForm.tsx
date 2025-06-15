
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Package, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Toner, Retornado } from '@/types';
import { tonerService, retornadoService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';

interface RetornadoFormProps {
  onSuccess?: () => void;
}

export const RetornadoForm: React.FC<RetornadoFormProps> = ({ onSuccess }) => {
  const [toners, setToners] = useState<Toner[]>([]);
  const [selectedToner, setSelectedToner] = useState<Toner | null>(null);
  const [formData, setFormData] = useState({
    id_modelo: '',
    id_cliente: '',
    peso: '',
    destino_final: null as 'Estoque' | 'Descarte' | 'Manutencao' | null,
    filial: '',
    valor_recuperado: ''
  });
  const [analysis, setAnalysis] = useState<{
    percentage: number;
    recommendation: string;
    options: string[];
    alertType: 'error' | 'warning' | 'info' | 'success';
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadToners();
  }, []);

  useEffect(() => {
    if (selectedToner && formData.peso) {
      calculateAnalysis();
    } else {
      setAnalysis(null);
      setFormData(prev => ({ ...prev, destino_final: null }));
    }
  }, [selectedToner, formData.peso]);

  const loadToners = async () => {
    try {
      const data = await tonerService.getAll();
      setToners(data);
    } catch (error) {
      console.error('Erro ao carregar toners:', error);
    }
  };

  const calculateAnalysis = () => {
    if (!selectedToner || !formData.peso) return;

    const pesoRetornado = parseFloat(formData.peso);
    const gramaturaRestante = pesoRetornado - selectedToner.peso_vazio;
    const percentage = Math.max(0, (gramaturaRestante / selectedToner.gramatura) * 100);

    let recommendation = '';
    let options: string[] = [];
    let alertType: 'error' | 'warning' | 'info' | 'success' = 'info';

    if (percentage >= 0 && percentage <= 20) {
      recommendation = 'Sistema recomenda: DESCARTAR - Toner com baixa gramatura restante.';
      options = ['Descarte'];
      alertType = 'error';
    } else if (percentage >= 21 && percentage <= 39) {
      recommendation = 'Sistema recomenda: TESTE O TONER - Se a qualidade estiver boa, pode usar internamente. Se estiver ruim, descarte.';
      options = ['Descarte', 'Manutencao'];
      alertType = 'warning';
    } else if (percentage >= 40 && percentage <= 80) {
      recommendation = 'Sistema recomenda: TESTE O TONER - Se a qualidade estiver boa, pode enviar para estoque como semi-novo. Se estiver ruim, envie para garantia.';
      options = ['Estoque', 'Manutencao'];
      alertType = 'info';
    } else if (percentage >= 81 && percentage <= 100) {
      recommendation = 'Sistema recomenda: TESTE O TONER - Se a qualidade estiver boa, pode enviar para estoque como novo. Se estiver ruim, envie para garantia.';
      options = ['Estoque', 'Manutencao'];
      alertType = 'success';
    }

    setAnalysis({
      percentage: Math.round(percentage * 100) / 100,
      recommendation,
      options,
      alertType
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destino_final) return;
    
    setIsSubmitting(true);

    try {
      const retornado: Omit<Retornado, 'id'> = {
        id_modelo: parseInt(formData.id_modelo),
        id_cliente: parseInt(formData.id_cliente),
        peso: parseFloat(formData.peso),
        destino_final: formData.destino_final,
        filial: formData.filial,
        data_registro: new Date(),
        valor_recuperado: formData.valor_recuperado ? parseFloat(formData.valor_recuperado) : undefined
      };

      await retornadoService.create(retornado);
      
      toast({
        title: "Sucesso!",
        description: "Retornado registrado com sucesso.",
      });

      // Reset form
      setFormData({
        id_modelo: '',
        id_cliente: '',
        peso: '',
        destino_final: null,
        filial: '',
        valor_recuperado: ''
      });
      setSelectedToner(null);
      setAnalysis(null);

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar retornado.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTonerSelect = (value: string) => {
    handleInputChange('id_modelo', value);
    const toner = toners.find(t => t.id!.toString() === value);
    setSelectedToner(toner || null);
  };

  const handleDestinoSelect = (value: string) => {
    setFormData(prev => ({ ...prev, destino_final: value as 'Estoque' | 'Descarte' | 'Manutencao' }));
  };

  const getAlertIcon = () => {
    if (!analysis) return null;
    
    switch (analysis.alertType) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const canSubmit = formData.id_modelo && formData.id_cliente && formData.peso && 
                   formData.destino_final && formData.filial && analysis;

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Registro de Retornados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id_modelo">Modelo do Toner *</Label>
              <Select value={formData.id_modelo} onValueChange={handleTonerSelect}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  {toners.map((toner) => (
                    <SelectItem key={toner.id} value={toner.id!.toString()}>
                      {toner.modelo} - {toner.cor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_cliente">ID do Cliente *</Label>
              <Input
                id="id_cliente"
                type="number"
                placeholder="101"
                value={formData.id_cliente}
                onChange={(e) => handleInputChange('id_cliente', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            {selectedToner && (
              <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Detalhes do Toner Selecionado:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div><strong>Modelo:</strong> {selectedToner.modelo}</div>
                  <div><strong>Cor:</strong> {selectedToner.cor}</div>
                  <div><strong>Peso Cheio:</strong> {selectedToner.peso_cheio}g</div>
                  <div><strong>Peso Vazio:</strong> {selectedToner.peso_vazio}g</div>
                  <div><strong>Gramatura:</strong> {selectedToner.gramatura}g</div>
                  <div><strong>Capacidade:</strong> {selectedToner.capacidade_folhas} folhas</div>
                  <div><strong>Preço:</strong> R$ {selectedToner.preco_produto.toFixed(2)}</div>
                  <div><strong>Valor/Folha:</strong> R$ {selectedToner.valor_por_folha.toFixed(4)}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="peso">Peso do Retornado (g) *</Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                placeholder="125.5"
                value={formData.peso}
                onChange={(e) => handleInputChange('peso', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filial">Filial *</Label>
              <Input
                id="filial"
                placeholder="Matriz, Filial 1, etc."
                value={formData.filial}
                onChange={(e) => handleInputChange('filial', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            {analysis && (
              <div className="md:col-span-2 space-y-4">
                <div className={`p-4 rounded-lg border ${
                  analysis.alertType === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                  analysis.alertType === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                  analysis.alertType === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}>
                  <div className="flex items-start gap-3">
                    {getAlertIcon()}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Análise do Toner - {analysis.percentage}% de gramatura restante</h3>
                      <p className="text-sm mb-3">{analysis.recommendation}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destino_final">Destino Final * (Baseado na análise)</Label>
                  <Select value={formData.destino_final || ''} onValueChange={handleDestinoSelect}>
                    <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                      <SelectValue placeholder="Selecione o destino baseado na recomendação" />
                    </SelectTrigger>
                    <SelectContent>
                      {analysis.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === 'Estoque' ? 'Estoque' : 
                           option === 'Descarte' ? 'Descarte' : 'Manutenção'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {formData.destino_final === 'Estoque' && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="valor_recuperado">Valor Recuperado (R$)</Label>
                <Input
                  id="valor_recuperado"
                  type="number"
                  step="0.01"
                  placeholder="25.50"
                  value={formData.valor_recuperado}
                  onChange={(e) => handleInputChange('valor_recuperado', e.target.value)}
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
                />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !canSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Registrar Retornado'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
