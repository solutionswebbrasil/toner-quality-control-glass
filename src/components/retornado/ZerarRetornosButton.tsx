
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ZerarRetornosButtonProps {
  onZerarComplete: () => void;
}

export const ZerarRetornosButton: React.FC<ZerarRetornosButtonProps> = ({ onZerarComplete }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [senha, setSenha] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleZerarRetornos = async () => {
    if (senha !== '4817') {
      toast({
        title: "Erro",
        description: "Senha incorreta! Acesso negado.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('ATENÇÃO: Esta ação irá excluir TODOS os retornados do banco de dados. Esta operação não pode ser desfeita. Tem certeza que deseja continuar?')) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Sucesso",
        description: "Todos os retornados foram excluídos com sucesso!",
      });
      
      onZerarComplete();
      setIsOpen(false);
      setSenha('');
    } catch (error) {
      console.error('Erro ao zerar retornados:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir os retornados.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSenha('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Zerar Retornos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">⚠️ Zerar Todos os Retornados</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">
              <strong>ATENÇÃO:</strong> Esta ação irá excluir permanentemente TODOS os retornados do banco de dados.
            </p>
            <p className="text-sm text-red-700 mt-2">
              Esta operação não pode ser desfeita!
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha-admin">Senha de Administrador:</Label>
            <Input
              id="senha-admin"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite a senha de administrador"
              className="w-full"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleZerarRetornos}
              disabled={isProcessing || !senha}
            >
              {isProcessing ? 'Processando...' : 'Confirmar Exclusão'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
