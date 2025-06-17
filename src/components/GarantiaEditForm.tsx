import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { garantiaService, fornecedorService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Garantia, Fornecedor } from '@/types';
import { Upload, FileText, X } from 'lucide-react';

interface StatusConfig {
  id: number;
  status_nome: string;
  cor: string;
}

interface ResultadoConfig {
  id: number;
  resultado_nome: string;
}

interface GarantiaEditFormProps {
  garantia: Garantia | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GarantiaEditForm: React.FC<GarantiaEditFormProps> = ({
  garantia,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [statusConfigs, setStatusConfigs] = useState<StatusConfig[]>([]);
  const [resultadoConfigs, setResultadoConfigs] = useState<ResultadoConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState<{[key: string]: boolean}>({});

  // Form states
  const [item, setItem] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [defeito, setDefeito] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [status, setStatus] = useState<string>('aberta');
  const [resultado, setResultado] = useState<string>('nao_definido');
  const [valorUnitario, setValorUnitario] = useState(0);
  const [nfCompra, setNfCompra] = useState<string>('');
  const [nfRemessa, setNfRemessa] = useState<string>('');
  const [nfDevolucao, setNfDevolucao] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (garantia) {
        setItem(garantia.item);
        setQuantidade(garantia.quantidade);
        setDefeito(garantia.defeito);
        setFornecedorId(garantia.fornecedor_id.toString());
        setStatus(garantia.status);
        setResultado(garantia.resultado || 'nao_definido');
        setValorUnitario(garantia.valor_unitario);
        setNfCompra(garantia.nf_compra_pdf || '');
        setNfRemessa(garantia.nf_remessa_pdf || '');
        setNfDevolucao(garantia.nf_devolucao_pdf || '');
      }
    }
  }, [isOpen, garantia]);

  const loadData = async () => {
    try {
      const [fornecedoresData, statusData, resultadoData] = await Promise.all([
        fornecedorService.getAll(),
        garantiaService.getStatusConfiguracoes('Garantias'),
        garantiaService.getResultadoConfiguracoes('Garantias')
      ]);
      
      console.log('Status configs loaded:', statusData);
      console.log('Resultado configs loaded:', resultadoData);
      console.log('Fornecedores loaded:', fornecedoresData);
      
      setFornecedores(fornecedoresData);
      setStatusConfigs(statusData);
      setResultadoConfigs(resultadoData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (file: File, type: 'compra' | 'remessa' | 'devolucao') => {
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "Erro",
        description: "Arquivo muito grande. Máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.includes('pdf')) {
      toast({
        title: "Erro",
        description: "Apenas arquivos PDF são aceitos.",
        variant: "destructive",
      });
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      const url = await garantiaService.uploadFile(file);
      
      switch (type) {
        case 'compra':
          setNfCompra(url);
          break;
        case 'remessa':
          setNfRemessa(url);
          break;
        case 'devolucao':
          setNfDevolucao(url);
          break;
      }

      toast({
        title: "Sucesso!",
        description: "Arquivo enviado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar arquivo.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleRemoveFile = async (type: 'compra' | 'remessa' | 'devolucao') => {
    const fileUrl = type === 'compra' ? nfCompra : type === 'remessa' ? nfRemessa : nfDevolucao;
    
    if (fileUrl) {
      try {
        await garantiaService.deleteFile(fileUrl);
        
        switch (type) {
          case 'compra':
            setNfCompra('');
            break;
          case 'remessa':
            setNfRemessa('');
            break;
          case 'devolucao':
            setNfDevolucao('');
            break;
        }

        toast({
          title: "Sucesso!",
          description: "Arquivo removido com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover arquivo.",
          variant: "destructive",
        });
      }
    }
  };

  const FileUploadSection = ({ 
    type, 
    label, 
    currentFile 
  }: { 
    type: 'compra' | 'remessa' | 'devolucao'; 
    label: string; 
    currentFile: string; 
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        {currentFile ? (
          <div className="flex items-center gap-2 p-2 border rounded">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm truncate max-w-[200px]">
              {currentFile.split('/').pop()}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRemoveFile(type)}
              className="p-1 h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, type);
              }}
              className="hidden"
              id={`file-${type}`}
            />
            <Label 
              htmlFor={`file-${type}`}
              className="flex items-center gap-2 px-3 py-2 border rounded cursor-pointer hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              {uploading[type] ? 'Enviando...' : 'Selecionar PDF'}
            </Label>
          </div>
        )}
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!garantia || !item || !defeito || !fornecedorId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const updateData: any = {
        item,
        quantidade,
        defeito,
        fornecedor_id: parseInt(fornecedorId),
        status,
        valor_unitario: valorUnitario,
        valor_total: quantidade * valorUnitario,
        nf_compra_pdf: nfCompra || null,
        nf_remessa_pdf: nfRemessa || null,
        nf_devolucao_pdf: nfDevolucao || null
      };

      // Only include resultado if it's not the default "nao_definido"
      if (resultado !== 'nao_definido') {
        updateData.resultado = resultado;
      }

      await garantiaService.update(garantia.id!, updateData);

      toast({
        title: "Sucesso!",
        description: "Garantia atualizada com sucesso.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar garantia.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Garantia</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Item *</Label>
            <Input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Nome do item"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantidade *</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                min="1"
                required
              />
            </div>

            <div>
              <Label>Valor Unitário (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label>Defeito *</Label>
            <Textarea
              value={defeito}
              onChange={(e) => setDefeito(e.target.value)}
              placeholder="Descreva o defeito..."
              className="min-h-[80px]"
              required
            />
          </div>

          <div>
            <Label>Fornecedor *</Label>
            <Select value={fornecedorId} onValueChange={setFornecedorId} required>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusConfigs.map((config) => {
                    const statusValue = config.status_nome.toLowerCase().replace(/\s+/g, '_');
                    console.log('Status config:', config, 'Value:', statusValue);
                    return (
                      <SelectItem key={config.id} value={statusValue || 'default_status'}>
                        {config.status_nome}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Resultado</Label>
              <Select value={resultado} onValueChange={setResultado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao_definido">Não definido</SelectItem>
                  {resultadoConfigs.map((config) => {
                    const resultadoValue = config.resultado_nome.toLowerCase().replace(/\s+/g, '_');
                    console.log('Resultado config:', config, 'Value:', resultadoValue);
                    return (
                      <SelectItem key={config.id} value={resultadoValue || 'default_resultado'}>
                        {config.resultado_nome}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File Upload Sections */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Anexar Notas Fiscais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FileUploadSection 
                type="compra" 
                label="NF Compra" 
                currentFile={nfCompra} 
              />
              <FileUploadSection 
                type="remessa" 
                label="NF Remessa" 
                currentFile={nfRemessa} 
              />
              <FileUploadSection 
                type="devolucao" 
                label="NF Devolução" 
                currentFile={nfDevolucao} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
