import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Calculator } from 'lucide-react';
import { Toner } from '@/types';
import { tonerService } from '@/services/tonerService';
import { useToast } from '@/hooks/use-toast';
import { tonersApi } from '@/lib/api';

interface TonerFormProps {
  onSuccess?: () => void;
}

export const TonerForm: React.FC<TonerFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    modelo: '',
    peso_cheio: '',
    peso_vazio: '',
    preco_produto: '',
    capacidade_folhas: '',
    impressoras_compat: '',
    cor: 'Preto'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cálculos automáticos
  const gramatura = formData.peso_cheio && formData.peso_vazio 
    ? (parseFloat(formData.peso_cheio) - parseFloat(formData.peso_vazio)).toFixed(2)
    : '0';

  const valorPorFolha = formData.preco_produto && formData.capacidade_folhas
    ? (parseFloat(formData.preco_produto) / parseInt(formData.capacidade_folhas)).toFixed(4)
    : '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado.",
          variant: "destructive"
        });
        return;
      }

      const toner: Omit<Toner, 'id'> = {
        modelo: formData.modelo,
        peso_cheio: parseFloat(formData.peso_cheio),
        peso_vazio: parseFloat(formData.peso_vazio),
        gramatura: parseFloat(gramatura),
        preco_produto: parseFloat(formData.preco_produto),
        capacidade_folhas: parseInt(formData.capacidade_folhas),
        valor_por_folha: parseFloat(valorPorFolha),
        impressoras_compat: formData.impressoras_compat,
        cor: formData.cor,
        registrado_por: 1, // Mock user ID
        data_registro: new Date().toISOString(),
        user_id: user.id
      };

      console.log('Criando toner:', toner);
      const result = await tonerService.create(toner);
      console.log('Toner criado:', result);
      
      toast({
        title: "Sucesso!",
        description: "Toner cadastrado com sucesso.",
      });

      // Reset form
      setFormData({
        modelo: '',
        peso_cheio: '',
        peso_vazio: '',
        preco_produto: '',
        capacidade_folhas: '',
        impressoras_compat: '',
        cor: 'Preto'
      });

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao cadastrar toner:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar toner.",
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
          <Save className="w-5 h-5" />
          Cadastro de Toner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                placeholder="Ex: HP 85A"
                value={formData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <Select value={formData.cor} onValueChange={(value) => handleInputChange('cor', value)}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
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

            <div className="space-y-2">
              <Label htmlFor="peso_cheio">Peso Cheio (g) *</Label>
              <Input
                id="peso_cheio"
                type="number"
                step="0.01"
                placeholder="850.5"
                value={formData.peso_cheio}
                onChange={(e) => handleInputChange('peso_cheio', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso_vazio">Peso Vazio (g) *</Label>
              <Input
                id="peso_vazio"
                type="number"
                step="0.01"
                placeholder="120.0"
                value={formData.peso_vazio}
                onChange={(e) => handleInputChange('peso_vazio', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label>Gramatura (calculado)</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={`${gramatura} g`}
                  readOnly
                  className="bg-slate-100/50 dark:bg-slate-700/50"
                />
                <Calculator className="w-4 h-4 text-blue-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco_produto">Preço (R$) *</Label>
              <Input
                id="preco_produto"
                type="number"
                step="0.01"
                placeholder="89.90"
                value={formData.preco_produto}
                onChange={(e) => handleInputChange('preco_produto', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade_folhas">Capacidade (folhas) *</Label>
              <Input
                id="capacidade_folhas"
                type="number"
                placeholder="1600"
                value={formData.capacidade_folhas}
                onChange={(e) => handleInputChange('capacidade_folhas', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label>Valor por Folha (calculado)</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={`R$ ${valorPorFolha}`}
                  readOnly
                  className="bg-slate-100/50 dark:bg-slate-700/50"
                />
                <Calculator className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="impressoras_compat">Impressoras Compatíveis</Label>
            <Textarea
              id="impressoras_compat"
              placeholder="HP LaserJet P1102, P1102w, M1130..."
              value={formData.impressoras_compat}
              onChange={(e) => handleInputChange('impressoras_compat', e.target.value)}
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur min-h-20"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Toner'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
