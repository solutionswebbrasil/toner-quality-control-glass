
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { garantiaService, fornecedorService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Fornecedor } from '@/types';
import { Upload } from 'lucide-react';

interface GarantiaFormProps {
  onSuccess?: () => void;
}

export const GarantiaForm: React.FC<GarantiaFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [formData, setFormData] = useState({
    item: '',
    quantidade: 1,
    defeito: '',
    fornecedor_id: 0,
    status: 'aberta' as const,
    resultado: '' as const,
    valor_unitario: 0
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
      toast({
        title: "Erro",
        description: "Erro ao carregar fornecedores.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.fornecedor_id === 0) {
      toast({
        title: "Erro",
        description: "Selecione um fornecedor.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await garantiaService.create({
        ...formData,
        ...files
      });
      
      toast({
        title: "Sucesso!",
        description: "Garantia registrada com sucesso.",
      });
      
      // Reset form
      setFormData({
        item: '',
        quantidade: 1,
        defeito: '',
        fornecedor_id: 0,
        status: 'aberta',
        resultado: '',
        valor_unitario: 0
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
        description: "Erro ao registrar garantia. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const valorTotal = formData.quantidade * formData.valor_unitario;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Registro de Garantia</h2>
      
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Dados da Garantia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item">Item *</Label>
                <Input
                  id="item"
                  value={formData.item}
                  onChange={(e) => handleChange('item', e.target.value)}
                  placeholder="Ex: Impressora HP LaserJet"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  value={formData.quantidade}
                  onChange={(e) => handleChange('quantidade', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defeito">Descrição do Defeito *</Label>
              <Textarea
                id="defeito"
                value={formData.defeito}
                onChange={(e) => handleChange('defeito', e.target.value)}
                placeholder="Descreva detalhadamente o defeito apresentado..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor *</Label>
                <Select
                  value={formData.fornecedor_id.toString()}
                  onValueChange={(value) => handleChange('fornecedor_id', parseInt(value))}
                >
                  <SelectTrigger>
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
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberta">Aberta</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="recusada">Recusada</SelectItem>
                    <SelectItem value="aguardando_fornecedor">Aguardando Fornecedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor_unitario">Valor Unitário (R$) *</Label>
                <Input
                  id="valor_unitario"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor_unitario}
                  onChange={(e) => handleChange('valor_unitario', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Valor Total (R$)</Label>
                <Input
                  value={valorTotal.toFixed(2)}
                  disabled
                  className="bg-slate-100 dark:bg-slate-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resultado">Resultado</Label>
                <Select
                  value={formData.resultado}
                  onValueChange={(value) => handleChange('resultado', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    <SelectItem value="devolucao_credito">Devolução em Crédito</SelectItem>
                    <SelectItem value="trocado">Trocado</SelectItem>
                    <SelectItem value="consertado">Consertado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload de arquivos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documentos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nf_compra">NF de Compra (PDF)</Label>
                  <div className="relative">
                    <Input
                      id="nf_compra"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('nf_compra_pdf', e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-2 p-2 border border-input rounded-md bg-background cursor-pointer hover:bg-accent">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm text-muted-foreground">
                        {files.nf_compra_pdf ? files.nf_compra_pdf.name : 'Selecionar arquivo'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nf_remessa">NF de Remessa (PDF)</Label>
                  <div className="relative">
                    <Input
                      id="nf_remessa"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('nf_remessa_pdf', e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-2 p-2 border border-input rounded-md bg-background cursor-pointer hover:bg-accent">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm text-muted-foreground">
                        {files.nf_remessa_pdf ? files.nf_remessa_pdf.name : 'Selecionar arquivo'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nf_devolucao">NF de Devolução (PDF)</Label>
                  <div className="relative">
                    <Input
                      id="nf_devolucao"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('nf_devolucao_pdf', e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-2 p-2 border border-input rounded-md bg-background cursor-pointer hover:bg-accent">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm text-muted-foreground">
                        {files.nf_devolucao_pdf ? files.nf_devolucao_pdf.name : 'Selecionar arquivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {isSubmitting ? 'Registrando...' : 'Registrar Garantia'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
