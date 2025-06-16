
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { Toner } from '@/types';

interface GarantiaTonerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: GarantiaTonerData) => void;
  selectedToner: Toner | null;
  filial: string;
}

export interface GarantiaTonerData {
  fornecedor: string;
  defeito: string;
  responsavel_envio: string;
}

export const GarantiaTonerModal: React.FC<GarantiaTonerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedToner,
  filial
}) => {
  const [formData, setFormData] = useState<GarantiaTonerData>({
    fornecedor: '',
    defeito: '',
    responsavel_envio: ''
  });

  const handleInputChange = (field: keyof GarantiaTonerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fornecedor && formData.defeito && formData.responsavel_envio) {
      onConfirm(formData);
      // Reset form
      setFormData({
        fornecedor: '',
        defeito: '',
        responsavel_envio: ''
      });
    }
  };

  const handleClose = () => {
    setFormData({
      fornecedor: '',
      defeito: '',
      responsavel_envio: ''
    });
    onClose();
  };

  const isFormValid = () => {
    return formData.fornecedor && formData.defeito && formData.responsavel_envio;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Registrar Garantia de Toner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-slate-600 dark:text-slate-400">Modelo:</span>
                <div>{selectedToner?.modelo || 'N/A'}</div>
              </div>
              <div>
                <span className="font-medium text-slate-600 dark:text-slate-400">Filial:</span>
                <div>{filial}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Nome do Fornecedor *</Label>
              <Input
                id="fornecedor"
                type="text"
                value={formData.fornecedor}
                onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                placeholder="Ex: HP Brasil, Canon Brasil..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defeito">Descrição do Defeito *</Label>
              <Textarea
                id="defeito"
                value={formData.defeito}
                onChange={(e) => handleInputChange('defeito', e.target.value)}
                placeholder="Descreva o defeito encontrado no toner..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel_envio">Responsável pelo Envio *</Label>
              <Input
                id="responsavel_envio"
                type="text"
                value={formData.responsavel_envio}
                onChange={(e) => handleInputChange('responsavel_envio', e.target.value)}
                placeholder="Nome da pessoa que enviou o toner"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid()}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Registrar Garantia
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
