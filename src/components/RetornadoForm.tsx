
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Package } from 'lucide-react';
import { Toner, Retornado } from '@/types';
import { tonerService, retornadoService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';

interface RetornadoFormProps {
  onSuccess?: () => void;
}

export const RetornadoForm: React.FC<RetornadoFormProps> = ({ onSuccess }) => {
  const [toners, setToners] = useState<Toner[]>([]);
  const [formData, setFormData] = useState({
    id_modelo: '',
    id_cliente: '',
    peso: '',
    destino_final: 'Estoque' as 'Estoque' | 'Descarte' | 'Manutencao',
    filial: '',
    valor_recuperado: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadToners();
  }, []);

  const loadToners = async () => {
    try {
      const data = await tonerService.getAll();
      setToners(data);
    } catch (error) {
      console.error('Erro ao carregar toners:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        destino_final: 'Estoque',
        filial: '',
        valor_recuperado: ''
      });

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
                placeholder="101"
                value={formData.id_cliente}
                onChange={(e) => handleInputChange('id_cliente', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso">Peso (g) *</Label>
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
              <Label htmlFor="destino_final">Destino Final *</Label>
              <Select value={formData.destino_final} onValueChange={(value) => handleInputChange('destino_final', value)}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estoque">Estoque</SelectItem>
                  <SelectItem value="Descarte">Descarte</SelectItem>
                  <SelectItem value="Manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
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

            {formData.destino_final === 'Estoque' && (
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
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            {isSubmitting ? 'Salvando...' : 'Registrar Retornado'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
