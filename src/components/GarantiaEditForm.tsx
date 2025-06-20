
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
import { Upload, FileText, X, Trash2, Mail } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

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

// Função para normalizar valores removendo acentos e caracteres especiais
const normalizeValue = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, '') // Remove caracteres especiais exceto espaços
    .replace(/\s+/g, '_') // Substitui espaços por underscore
    .replace(/\t/g, '') // Remove tabs
    .trim();
};

export const GarantiaEditForm: React.FC<GarantiaEditFormProps> = ({
  garantia,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [statusConfigs, setStatusConfigs] = useState<StatusConfig[]>([]);
  const [resultadoConfigs, setResultadoConfigs] = useState<ResultadoConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState<{[key: string]: boolean}>({});
  const [deleting, setDeleting] = useState<{[key: string]: boolean}>({});

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
  const [emailNotificacao, setEmailNotificacao] = useState<string>('');

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
        setEmailNotificacao(garantia.email_notificacao || '');
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
      setDeleting(prev => ({ ...prev, [type]: true }));
      
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
      } finally {
        setDeleting(prev => ({ ...prev, [type]: false }));
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
          <div className="flex items-center gap-2 p-2 border rounded bg-slate-50 dark:bg-slate-800/50">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm truncate max-w-[150px]">
              {currentFile.split('/').pop()}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(currentFile, '_blank')}
              className="p-1 h-6 w-6"
              title="Visualizar arquivo"
            >
              <FileText className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleRemoveFile(type)}
              className="p-1 h-6 w-6"
              disabled={deleting[type]}
              title="Excluir arquivo"
            >
              {deleting[type] ? (
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
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
              disabled={uploading[type]}
            />
            <Label 
              htmlFor={`file-${type}`}
              className="flex items-center gap-2 px-3 py-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Upload className="w-4 h-4" />
              {uploading[type] ? 'Enviando...' : 'Selecionar PDF'}
            </Label>
          </div>
        )}
      </div>
    </div>
  );

  const sendNotificationEmail = async (garantiaData: Garantia) => {
    if (!garantiaData.email_notificacao || status !== 'finalizada') {
      return;
    }

    try {
      const response = await fetch('/functions/v1/send-garantia-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: garantiaData.email_notificacao,
          garantia: garantiaData
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar email');
      }

      toast({
        title: "Email enviado!",
        description: "Notificação enviada para o email informado.",
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Aviso",
        description: "Garantia atualizada, mas houve erro ao enviar o email de notificação.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!garantia) {
      toast({
        title: "Erro",
        description: "Garantia não encontrada.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const previousStatus = garantia.status;

    try {
      const updateData: any = {
        item: item || 'Não informado',
        quantidade: quantidade || 1,
        defeito: defeito || 'Não informado',
        fornecedor_id: parseInt(fornecedorId) || 1,
        status,
        valor_unitario: valorUnitario || 0,
        valor_total: (quantidade || 1) * (valorUnitario || 0),
        nf_compra_pdf: nfCompra || null,
        nf_remessa_pdf: nfRemessa || null,
        nf_devolucao_pdf: nfDevolucao || null,
        email_notificacao: emailNotificacao || null
      };

      // Only include resultado if it's not the default "nao_definido"
      if (resultado !== 'nao_definido') {
        updateData.resultado = resultado;
      }

      const updatedGarantia = await garantiaService.update(garantia.id!, updateData);

      // Enviar email apenas se o status mudou para "finalizada"
      if (previousStatus !== 'finalizada' && status === 'finalizada') {
        await sendNotificationEmail({ ...updatedGarantia, ...updateData });
      }

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
            <Label>Item</Label>
            <Input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Nome do item"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                min="1"
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
            <Label>Defeito</Label>
            <Textarea
              value={defeito}
              onChange={(e) => setDefeito(e.target.value)}
              placeholder="Descreva o defeito..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label>Fornecedor</Label>
            <Select value={fornecedorId} onValueChange={setFornecedorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o fornecedor" />
              </SelectTrigger>
              <SelectContent>
                {fornecedores.map((fornecedor) => (
                  <SelectItem 
                    key={fornecedor.id} 
                    value={fornecedor.id!.toString()}
                  >
                    {fornecedor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email_notificacao" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email para Notificação
            </Label>
            <Input
              id="email_notificacao"
              type="email"
              value={emailNotificacao}
              onChange={(e) => setEmailNotificacao(e.target.value)}
              placeholder="email@exemplo.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email será enviado quando a garantia for finalizada
            </p>
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
                    const statusValue = normalizeValue(config.status_nome || '');
                    return (
                      <SelectItem 
                        key={config.id} 
                        value={statusValue}
                      >
                        {config.status_nome || 'Status sem nome'}
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
                  <SelectItem value="nao_definido">
                    Não definido
                  </SelectItem>
                  {resultadoConfigs.map((config) => {
                    const resultadoValue = normalizeValue(config.resultado_nome || '');
                    return (
                      <SelectItem 
                        key={config.id} 
                        value={resultadoValue}
                      >
                        {config.resultado_nome || 'Resultado sem nome'}
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
