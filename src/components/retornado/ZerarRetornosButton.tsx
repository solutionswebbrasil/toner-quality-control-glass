
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { retornadoService } from '@/services/retornadoService';

interface ZerarRetornosButtonProps {
  onZerarComplete: () => void;
}

export const ZerarRetornosButton: React.FC<ZerarRetornosButtonProps> = ({ onZerarComplete }) => {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user has admin permissions to delete all records
  const canDeleteAll = hasPermission('Retornados', 'Consulta', 'excluir') && 
                       hasPermission('Configurações', 'Usuários', 'editar'); // Admin check

  if (!canDeleteAll) {
    return null; // Hide button if user doesn't have permissions
  }

  const handleZerarRetornos = async () => {
    if (!confirm('ATENÇÃO: Esta ação irá excluir TODOS os retornados do banco de dados. Esta operação não pode ser desfeita. Tem certeza que deseja continuar?')) {
      return;
    }

    if (!confirm('CONFIRMAÇÃO FINAL: Você tem certeza absoluta de que deseja excluir TODOS os registros de retornados? Esta ação é IRREVERSÍVEL!')) {
      return;
    }

    setIsProcessing(true);
    
    try {
      await retornadoService.deleteAll();
      
      toast({
        title: "Sucesso",
        description: "Todos os retornados foram excluídos com sucesso!",
      });
      
      onZerarComplete();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao zerar retornados:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir os retornados. Verifique suas permissões.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
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
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="text-sm text-red-800 font-medium mb-2">
                <strong>ATENÇÃO:</strong> Esta ação irá excluir permanentemente TODOS os retornados do banco de dados.
              </p>
              <p className="text-sm text-red-700">
                Esta operação não pode ser desfeita e requer permissões de administrador!
              </p>
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleZerarRetornos}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Confirmar Exclusão'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
