
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Building2, X } from 'lucide-react';
import { Fornecedor } from '@/types';
import { fornecedorService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';

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
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    link_rma: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingFornecedor) {
      setFormData({
        nome: editingFornecedor.nome,
        telefone: editingFornecedor.telefone,
        link_rma: editingFornecedor.link_rma
      });
    }
  }, [editingFornecedor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingFornecedor) {
        // Update existing fornecedor
        const updatedFornecedor: Fornecedor = {
          ...editingFornecedor,
          nome: formData.nome,
          telefone: formData.telefone,
          link_rma: formData.link_rma
        };

        await fornecedorService.update(editingFornecedor.id!, updatedFornecedor);
        
        toast({
          title: "Sucesso!",
          description: "Fornecedor atualizado com sucesso.",
        });
      } else {
        // Create new fornecedor
        const fornecedor: Omit<Fornecedor, 'id'> = {
          nome: formData.nome,
          telefone: formData.telefone,
          link_rma: formData.link_rma,
          data_cadastro: new Date().toISOString() // Convert Date to string
        };

        await fornecedorService.create(fornecedor);
        
        toast({
          title: "Sucesso!",
          description: "Fornecedor cadastrado com sucesso.",
        });
      }

      // Reset form if not editing
      if (!editingFornecedor) {
        setFormData({
          nome: '',
          telefone: '',
          link_rma: ''
        });
      }

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: editingFornecedor ? "Erro ao atualizar fornecedor." : "Erro ao cadastrar fornecedor.",
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {editingFornecedor ? 'Editar Fornecedor' : 'Cadastro de Fornecedores'}
          </div>
          {editingFornecedor && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Fornecedor *</Label>
              <Input
                id="nome"
                placeholder="HP Brasil, Canon Brasil, etc."
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                placeholder="(11) 1234-5678"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="link_rma">Link do RMA *</Label>
              <Input
                id="link_rma"
                type="url"
                placeholder="https://support.hp.com/br-pt/rma"
                value={formData.link_rma}
                onChange={(e) => handleInputChange('link_rma', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Salvando...' : (editingFornecedor ? 'Atualizar Fornecedor' : 'Cadastrar Fornecedor')}
            </Button>
            {editingFornecedor && onCancel && (
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
  );
};
