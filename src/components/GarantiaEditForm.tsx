
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { garantiaService, fornecedorService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Garantia, Fornecedor } from '@/types';

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
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [item, setItem] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [defeito, setDefeito] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [status, setStatus] = useState<'aberta' | 'em_analise' | 'concluida' | 'recusada' | 'aguardando_fornecedor'>('aberta');
  const [resultado, setResultado] = useState<'devolucao_credito' | 'trocado' | 'consertado' | 'nao_definido'>('nao_definido');
  const [valorUnitario, setValorUnitario] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadFornecedores();
      if (garantia) {
        setItem(garantia.item);
        setQuantidade(garantia.quantidade);
        setDefeito(garantia.defeito);
        setFornecedorId(garantia.fornecedor_id.toString());
        setStatus(garantia.status);
        setResultado(garantia.resultado || 'nao_definido');
        setValorUnitario(garantia.valor_unitario);
      }
    }
  }, [isOpen, garantia]);

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
      await garantiaService.update(garantia.id!, {
        item,
        quantidade,
        defeito,
        fornecedor_id: parseInt(fornecedorId),
        status,
        resultado: resultado === 'nao_definido' ? '' : resultado,
        valor_unitario: valorUnitario,
        valor_total: quantidade * valorUnitario
      });

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Garantia</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Item *</label>
            <Input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Nome do item"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantidade *</label>
            <Input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Defeito *</label>
            <Textarea
              value={defeito}
              onChange={(e) => setDefeito(e.target.value)}
              placeholder="Descreva o defeito..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fornecedor *</label>
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

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
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

          <div>
            <label className="block text-sm font-medium mb-2">Resultado</label>
            <Select value={resultado} onValueChange={(value: any) => setResultado(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nao_definido">Não definido</SelectItem>
                <SelectItem value="devolucao_credito">Devolução em Crédito</SelectItem>
                <SelectItem value="trocado">Trocado</SelectItem>
                <SelectItem value="consertado">Consertado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Valor Unitário (R$)</label>
            <Input
              type="number"
              step="0.01"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
