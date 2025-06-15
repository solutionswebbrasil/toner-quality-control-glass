
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fornecedorService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Fornecedor } from '@/types';

interface FornecedorFormProps {
  onSuccess?: () => void;
  editingFornecedor?: Fornecedor;
  onCancel?: () => void;
}

export const FornecedorForm: React.FC<FornecedorFormProps> = ({ 
  onSuccess, 
  editingFornecedor, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: editingFornecedor?.nome || '',
    telefone: editingFornecedor?.telefone || '',
    link_rma: editingFornecedor?.link_rma || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingFornecedor) {
        await fornecedorService.update(editingFornecedor.id!, formData);
        toast({
          title: "Sucesso!",
          description: "Fornecedor atualizado com sucesso.",
        });
      } else {
        await fornecedorService.create(formData);
        toast({
          title: "Sucesso!",
          description: "Fornecedor cadastrado com sucesso.",
        });
      }
      
      setFormData({ nome: '', telefone: '', link_rma: '' });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar fornecedor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {editingFornecedor ? 'Editar Fornecedor' : 'Cadastro de Fornecedor'}
      </h2>
      
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Dados do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Fornecedor *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Ex: HP Brasil"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="(11) 1234-5678"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_rma">Link do RMA *</Label>
              <Input
                id="link_rma"
                type="url"
                value={formData.link_rma}
                onChange={(e) => handleChange('link_rma', e.target.value)}
                placeholder="https://support.fornecedor.com/rma"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {isSubmitting ? 'Salvando...' : editingFornecedor ? 'Atualizar' : 'Cadastrar'}
              </Button>
              
              {editingFornecedor && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
