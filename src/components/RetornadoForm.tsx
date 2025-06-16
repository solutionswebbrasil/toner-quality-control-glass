import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Recycle } from 'lucide-react';
import { Toner, Retornado } from '@/types';
import { tonerService, retornadoService, filialService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';
import type { Filial } from '@/types/filial';

interface RetornadoFormProps {
  onSuccess?: () => void;
}

const destinosFinais = [
  'Descarte',
  'Garantia',
  'Estoque',
  'Uso Interno'
];

export const RetornadoForm: React.FC<RetornadoFormProps> = ({ onSuccess }) => {
  const [toners, setToners] = useState<Toner[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [formData, setFormData] = useState({
    id_modelo: '',
    id_cliente: '',
    peso: '',
    destino_final: 'Descarte',
    filial: '',
    valor_recuperado: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedToner, setSelectedToner] = useState<Toner | null>(null);

  useEffect(() => {
    loadToners();
    loadFiliais();
  }, []);

  // Atualizar toner selecionado quando o modelo mudar
  useEffect(() => {
    if (formData.id_modelo) {
      const toner = toners.find(t => t.id?.toString() === formData.id_modelo);
      setSelectedToner(toner || null);
    } else {
      setSelectedToner(null);
    }
  }, [formData.id_modelo, toners]);

  const loadToners = async () => {
    try {
      const data = await tonerService.getAll();
      setToners(data);
    } catch (error) {
      console.error('Erro ao carregar toners:', error);
    }
  };

  const loadFiliais = async () => {
    try {
      const data = await filialService.getAll();
      setFiliais(data);
      // Se houver filiais e nenhuma estiver selecionada, selecionar a primeira
      if (data.length > 0 && !formData.filial) {
        setFormData(prev => ({ ...prev, filial: data[0].nome }));
      }
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const retornado: Omit<Retornado, 'id' | 'modelo'> = {
        id_modelo: parseInt(formData.id_modelo),
        id_cliente: parseInt(formData.id_cliente),
        peso: parseFloat(formData.peso),
        destino_final: formData.destino_final,
        filial: formData.filial,
        valor_recuperado: formData.valor_recuperado ? parseFloat(formData.valor_recuperado) : undefined,
        data_registro: new Date().toISOString()
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
        destino_final: 'Descarte',
        filial: '',
        valor_recuperado: ''
      });
      setSelectedToner(null);

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

  const calculateGramaturaUsada = () => {
    if (!selectedToner || !formData.peso) return 0;
    const pesoAtual = parseFloat(formData.peso);
    return selectedToner.peso_cheio - pesoAtual;
  };

  const calculatePercentualUso = () => {
    if (!selectedToner) return 0;
    const gramaturaUsada = calculateGramaturaUsada();
    return ((gramaturaUsada / selectedToner.gramatura) * 100).toFixed(1);
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Recycle className="w-5 h-5" />
          Registro de Retornados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id_modelo">Modelo do Toner *</Label>
              <Select value={formData.id_modelo} onValueChange={(value) => handleInputChange('id_modelo', value)}>
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
                placeholder="123456"
                value={formData.id_cliente}
                onChange={(e) => handleInputChange('id_cliente', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso">Peso Atual (g) *</Label>
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
              <Select value={formData.filial} onValueChange={(value) => handleInputChange('filial', value)}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  {filiais.map((filial) => (
                    <SelectItem key={filial.id} value={filial.nome}>
                      {filial.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino_final">Destino Final *</Label>
              <Select value={formData.destino_final} onValueChange={(value) => handleInputChange('destino_final', value)}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {destinosFinais.map((destino) => (
                    <SelectItem key={destino} value={destino}>
                      {destino}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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
          </div>

          {selectedToner && formData.peso && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Informações Calculadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Label>Peso Cheio Original</Label>
                  <div className="font-medium">{selectedToner.peso_cheio}g</div>
                </div>
                <div>
                  <Label>Gramatura Usada</Label>
                  <div className="font-medium text-orange-600 dark:text-orange-400">
                    {calculateGramaturaUsada().toFixed(2)}g
                  </div>
                </div>
                <div>
                  <Label>Percentual de Uso</Label>
                  <div className="font-medium text-red-600 dark:text-red-400">
                    {calculatePercentualUso()}%
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Registrar Retornado'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
