
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toner } from '@/types';
import { tonerService } from '@/services/tonerService';
import { useToast } from '@/hooks/use-toast';

interface TonerEditFormProps {
  toner: Toner;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TonerEditForm: React.FC<TonerEditFormProps> = ({ toner, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Toner>(toner);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Atualizando toner:', formData);
      const result = await tonerService.update(toner.id!, formData);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: "Toner atualizado com sucesso.",
        });
        onSuccess();
      } else {
        throw new Error('Falha na atualização');
      }
    } catch (error) {
      console.error('Erro ao atualizar toner:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar toner.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Toner, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcular automaticamente os campos derivados
      if (field === 'peso_cheio' || field === 'peso_vazio') {
        updated.gramatura = updated.peso_cheio - updated.peso_vazio;
      }
      
      if (field === 'preco_produto' || field === 'capacidade_folhas' || updated.preco_produto || updated.capacidade_folhas) {
        updated.valor_por_folha = updated.preco_produto / updated.capacidade_folhas;
      }
      
      return updated;
    });
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle>Editar Toner</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => handleChange('modelo', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Select value={formData.cor} onValueChange={(value) => handleChange('cor', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preto">Preto</SelectItem>
                  <SelectItem value="Ciano">Ciano</SelectItem>
                  <SelectItem value="Magenta">Magenta</SelectItem>
                  <SelectItem value="Amarelo">Amarelo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="peso_cheio">Peso Cheio (g)</Label>
              <Input
                id="peso_cheio"
                type="number"
                value={formData.peso_cheio}
                onChange={(e) => handleChange('peso_cheio', Number(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="peso_vazio">Peso Vazio (g)</Label>
              <Input
                id="peso_vazio"
                type="number"
                value={formData.peso_vazio}
                onChange={(e) => handleChange('peso_vazio', Number(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="preco_produto">Preço (R$)</Label>
              <Input
                id="preco_produto"
                type="number"
                step="0.01"
                value={formData.preco_produto}
                onChange={(e) => handleChange('preco_produto', Number(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="capacidade_folhas">Capacidade (folhas)</Label>
              <Input
                id="capacidade_folhas"
                type="number"
                value={formData.capacidade_folhas}
                onChange={(e) => handleChange('capacidade_folhas', Number(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="impressoras_compat">Impressoras Compatíveis</Label>
              <Input
                id="impressoras_compat"
                value={formData.impressoras_compat}
                onChange={(e) => handleChange('impressoras_compat', e.target.value)}
                placeholder="Ex: HP LaserJet Pro M404, M428"
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
