
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

interface ImportActionsProps {
  onDownloadTemplate: () => void;
  onSelectFile: () => void;
  isProcessing: boolean;
}

export const ImportActions: React.FC<ImportActionsProps> = ({
  onDownloadTemplate,
  onSelectFile,
  isProcessing
}) => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onDownloadTemplate}
        variant="outline"
        className="flex-1 flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Baixar Modelo
      </Button>
      
      <Button
        onClick={onSelectFile}
        className="flex-1 flex items-center gap-2"
        disabled={isProcessing}
      >
        <Upload className="w-4 h-4" />
        Selecionar Arquivo
      </Button>
    </div>
  );
};
