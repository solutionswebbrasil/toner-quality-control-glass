
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Shield, Upload } from 'lucide-react';
import { Fornecedor, Garantia } from '@/types';
import { fornecedorService, garantiaService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';

interface GarantiaFormProps {
  onSuccess?: () => void;
}

export const GarantiaForm: React.FC<GarantiaFormProps> = ({ onSuccess }) => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [formData, setFormData] = useState({
    item: '',
    quantidade: '',
    defeito: '',
    fornecedor_id: '',
    valor_unitario: ''
  });
  const [files, setFiles] = useState({
    nf_compra_pdf: null as File | null,
    nf_remessa_pdf: null as File | null,
    nf_devolucao_pdf: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFornecedores();
  }, []);

  const loadFornecedores = async () => {
    try {
      const data = await fornecedorService.getAll();
      setFornecedores(data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quantidade = parseInt(formData.quantidade);
      const valor_unitario = parseFloat(formData.valor_unitario);
      
      const garantia: Omit<Garantia, 'id'> = {
        item: formData.item,
        quantidade,
        defeito: formData.defeito,
        fornecedor_id: parseInt(formData.fornecedor_id),
        nf_compra_pdf: files.nf_compra_pdf ? files.nf_compra_pdf.name : undefined, // Store file name as string
        nf_remessa_pdf: files.nf_remessa_pdf ? files.nf_remessa_pdf.name : undefined, // Store file name as string
        nf_devolucao_pdf: files.nf_devolucao_pdf ? files.nf_devolucao_pdf.name : undefined, // Store file name as string
        status: 'aberta',
        resultado: '',
        valor_unitario,
        valor_total: quantidade * valor_unitario,
        data_registro: new Date().toISOString() // Convert Date to string
      };

      await garantiaService.create(garantia);
      
      toast({
        title: "Sucesso!",
        description: "Garantia registrada com sucesso.",
      });

      // Reset form
      setFormData({
        item: '',
        quantidade: '',
        defeito: '',
        fornecedor_id: '',
        valor_unitario: ''
      });
      setFiles({
        nf_compra_pdf: null,
        nf_remessa_pdf: null,
        nf_devolucao_pdf: null
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar garantia.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const valorTotal = formData.quantidade && formData.valor_unitario ? 
    (parseInt(formData.quantidade) * parseFloat(formData.valor_unitario)).toFixed(2) : '0.00';

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Registro de Garantias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="item">Item *</Label>
              <Input
                id="item"
                placeholder="Impressora HP LaserJet P1102"
                value={formData.item}
                onChange={(e) => handleInputChange('item', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                placeholder="1"
                value={formData.quantidade}
                onChange={(e) => handleInputChange('quantidade', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor_id">Fornecedor *</Label>
              <Select value={formData.fornecedor_id} onValueChange={(value) => handleInputChange('fornecedor_id', value)}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {fornecedores.map((fornecedor) => (
                    <SelectItem key={fornecedor.id} value={fornecedor.id!.toString()}>
                      {fornecedor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_unitario">Valor Unitário (R$) *</Label>
              <Input
                id="valor_unitario"
                type="number"
                step="0.01"
                min="0"
                placeholder="450.00"
                value={formData.valor_unitario}
                onChange={(e) => handleInputChange('valor_unitario', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label>Valor Total</Label>
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md font-medium">
                R$ {valorTotal}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="defeito">Descrição do Defeito *</Label>
              <Textarea
                id="defeito"
                placeholder="Descreva detalhadamente o defeito apresentado..."
                value={formData.defeito}
                onChange={(e) => handleInputChange('defeito', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nf_compra">NF de Compra (PDF)</Label>
              <Input
                id="nf_compra"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('nf_compra_pdf', e.target.files?.[0] || null)}
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nf_remessa">NF de Remessa (PDF)</Label>
              <Input
                id="nf_remessa"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('nf_remessa_pdf', e.target.files?.[0] || null)}
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nf_devolucao">NF de Devolução (PDF)</Label>
              <Input
                id="nf_devolucao"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('nf_devolucao_pdf', e.target.files?.[0] || null)}
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Registrar Garantia'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
