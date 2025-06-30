
import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { Auditoria } from '@/types';

interface AuditoriaActionsProps {
  auditoria: Auditoria;
  isLoading: boolean;
  onDownloadPDF: (auditoria: Auditoria) => void;
  onDelete: (auditoria: Auditoria) => void;
}

export const AuditoriaActions: React.FC<AuditoriaActionsProps> = ({
  auditoria,
  isLoading,
  onDownloadPDF,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDownloadPDF(auditoria)}
        disabled={!auditoria.formulario_pdf || isLoading}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isLoading ? 'Baixando...' : 'Baixar PDF'}
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a auditoria #{auditoria.id} da unidade {auditoria.unidade_auditada}?
              Esta ação não pode ser desfeita e todos os arquivos anexados serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(auditoria)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
