import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Garantia, Fornecedor } from '@/types';

export const GarantiaForm: React.FC = () => {
  const [formData, setFormData] = useState({
    item: '',
    quantidade: '',
    defeito: '',
    fornecedor_id: '',
    valor_unitario: '',
    valor_total: '',
    ns: ''
  });

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [files, setFiles] = useState({
    nf_compra: null as File | null,
    nf_remessa: null as File | null,
    nf_devolucao: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'quantidade' || field === 'valor_unitario') {
      const quantidade = parseFloat(field === 'quantidade' ? value : formData.quantidade) || 0;
      const valorUnitario = parseFloat(field === 'valor_unitario' ? value : formData.valor_unitario) || 0;
      const valorTotal = quantidade * valorUnitario;
      setFormData(prev => ({ ...prev, valor_total: valorTotal.toString() }));
    }
  };

  const handleFileChange = (fileType: keyof typeof files, file: File | null) => {
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const uploadFiles = async () => {
    const uploadedFiles: Record<string, string> = {};
    
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        try {
          const url = await fileUploadService.uploadGarantiaFile(file, key);
          uploadedFiles[`${key}_pdf`] = url;
        } catch (error) {
          console.error(`Erro ao fazer upload do arquivo ${key}:`, error);
          throw new Error(`Erro ao fazer upload do arquivo ${key}`);
        }
      }
    }
    
    return uploadedFiles;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item || !formData.quantidade || !formData.defeito || 
        !formData.fornecedor_id || !formData.valor_unitario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const uploadedFiles = await uploadFiles();
      
      const garantiaData: Omit<Garantia, 'id'> = {
        item: formData.item,
        quantidade: parseInt(formData.quantidade),
        defeito: formData.defeito,
        fornecedor_id: parseInt(formData.fornecedor_id),
        valor_unitario: parseFloat(formData.valor_unitario),
        valor_total: parseFloat(formData.valor_total),
        status: 'aberta',
        data_registro: new Date().toISOString(),
        ns: formData.ns || undefined,
        ...uploadedFiles
      };

      await garantiaService.create(garantiaData);
      
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
        valor_unitario: '',
        valor_total: '',
        ns: ''
      });
      setFiles({
        nf_compra: null,
        nf_remessa: null,
        nf_devolucao: null,
      });
    } catch (error) {
      console.error('Erro ao registrar garantia:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar garantia. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Shield className="w-5 h-5" />
          Registrar Garantia Geral
        </CardTitle>
      </CardHeader>
      
      <Separator className="mx-6 bg-gradient-to-r from-blue-500/20 via-purple-500/40 to-blue-500/20" />
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item">Item/Produto *</Label>
              <Input
                id="item"
                value={formData.item}
                onChange={(e) => handleInputChange('item', e.target.value)}
                placeholder="Ex: Placa principal HP LaserJet"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ns">Número de Série</Label>
              <Input
                id="ns"
                value={formData.ns}
                onChange={(e) => handleInputChange('ns', e.target.value)}
                placeholder="Número de série (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => handleInputChange('quantidade', e.target.value)}
                placeholder="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Select value={formData.fornecedor_id} onValueChange={(value) => handleInputChange('fornecedor_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
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
              <Label htmlFor="valor_unitario">Valor Unitário *</Label>
              <Input
                id="valor_unitario"
                type="number"
                step="0.01"
                value={formData.valor_unitario}
                onChange={(e) => handleInputChange('valor_unitario', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total</Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                value={formData.valor_total}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defeito">Descrição do Defeito *</Label>
            <Textarea
              id="defeito"
              value={formData.defeito}
              onChange={(e) => handleInputChange('defeito', e.target.value)}
              placeholder="Descreva detalhadamente o defeito encontrado..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>NF Compra</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange('nf_compra', e.target.files?.[0] || null)}
                  className="hidden"
                  id="nf_compra"
                />
                <label htmlFor="nf_compra" className="cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {files.nf_compra ? files.nf_compra.name : 'Clique para selecionar'}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>NF Remessa</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange('nf_remessa', e.target.files?.[0] || null)}
                  className="hidden"
                  id="nf_remessa"
                />
                <label htmlFor="nf_remessa" className="cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {files.nf_remessa ? files.nf_remessa.name : 'Clique para selecionar'}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>NF Devolução</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange('nf_devolucao', e.target.files?.[0] || null)}
                  className="hidden"
                  id="nf_devolucao"
                />
                <label htmlFor="nf_devolucao" className="cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {files.nf_devolucao ? files.nf_devolucao.name : 'Clique para selecionar'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={uploading}
          >
            {uploading ? 'Registrando...' : 'Registrar Garantia'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
