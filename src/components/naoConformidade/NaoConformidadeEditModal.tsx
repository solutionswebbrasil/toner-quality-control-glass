
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { NaoConformidade } from '@/types/naoConformidade';
import { naoConformidadeService } from '@/services/naoConformidadeService';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

interface NaoConformidadeEditModalProps {
  naoConformidade: NaoConformidade;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NaoConformidadeEditModal: React.FC<NaoConformidadeEditModalProps> = ({
  naoConformidade,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<NaoConformidade>>({});

  useEffect(() => {
    if (naoConformidade) {
      setFormData({
        status: naoConformidade.status,
        acao_imediata: naoConformidade.acao_imediata || '',
        acao_corretiva_proposta: naoConformidade.acao_corretiva_proposta || '',
        responsavel_tratamento: naoConformidade.responsavel_tratamento,
        necessita_acao_corretiva: naoConformidade.necessita_acao_corretiva,
        observacoes: naoConformidade.observacoes || '',
        data_limite_correcao: naoConformidade.data_limite_correcao
      });
    }
  }, [naoConformidade]);

  const handleSave = async () => {
    if (!naoConformidade.id) return;

    try {
      setLoading(true);
      await naoConformidadeService.update(naoConformidade.id, formData);
      
      toast({
        title: "Sucesso",
        description: "Não conformidade atualizada com sucesso!",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar não conformidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar não conformidade.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Editar NC-{String(naoConformidade.id).padStart(4, '0')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select
              value={formData.status || ''}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Corrigida">Corrigida</SelectItem>
                <SelectItem value="Recusada">Recusada</SelectItem>
                <SelectItem value="Reaberta">Reaberta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Responsável pelo Tratamento</label>
            <Input
              value={formData.responsavel_tratamento || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, responsavel_tratamento: e.target.value }))}
              placeholder="Nome do responsável"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Data Limite para Correção</label>
            <Input
              type="date"
              value={formData.data_limite_correcao || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, data_limite_correcao: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Ação Imediata</label>
            <Textarea
              value={formData.acao_imediata || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, acao_imediata: e.target.value }))}
              placeholder="Descreva a ação imediata tomada..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Ação Corretiva Proposta</label>
            <Textarea
              value={formData.acao_corretiva_proposta || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, acao_corretiva_proposta: e.target.value }))}
              placeholder="Descreva a ação corretiva proposta..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="necessita_acao_corretiva"
              checked={formData.necessita_acao_corretiva || false}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, necessita_acao_corretiva: !!checked }))
              }
            />
            <label htmlFor="necessita_acao_corretiva" className="text-sm font-medium">
              Necessita ação corretiva
            </label>
          </div>

          <div>
            <label className="text-sm font-medium">Observações</label>
            <Textarea
              value={formData.observacoes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
