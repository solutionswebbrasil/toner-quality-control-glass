
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Building2 } from 'lucide-react';
import { Fornecedor } from '@/types';
import { fornecedorService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';

interface FornecedorFormProps {
  onSuccess?: () => void;
}

export const FornecedorForm: React.FC<FornecedorFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    link_rma: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fornecedor: Omit<Fornecedor, 'id'> = {
        nome: formData.nome,
        telefone: formData.telefone,
        link_rma: formData.link_rma,
        data_cadastro: new Date()
      };

      await fornecedorService.create(fornecedor);
      
      toast({
        title: "Sucesso!",
        description: "Fornecedor cadastrado com sucesso.",
      });

      // Reset form
      setFormData({
        nome: '',
        telefone: '',
        link_rma: ''
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar fornecedor.",
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
          <Building2 className="w-5 h-5" />
          Cadastro de Fornecedores
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

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Cadastrar Fornecedor'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
