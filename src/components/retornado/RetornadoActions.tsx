
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';

interface RetornadoActionsProps {
  onExportCSV: () => void;
  onDownloadTemplate: () => void;
  onImportCSV: () => void;
  importing: boolean;
}

export const RetornadoActions: React.FC<RetornadoActionsProps> = ({
  onExportCSV,
  onDownloadTemplate,
  onImportCSV,
  importing
}) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onDownloadTemplate} variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Baixar Modelo
      </Button>
      
      <Button 
        onClick={onImportCSV}
        variant="outline" 
        className="flex items-center gap-2"
        disabled={importing}
      >
        <Upload className="h-4 w-4" />
        {importing ? 'Importando...' : 'Importar Planilha'}
      </Button>
      
      <Button onClick={onExportCSV} className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        Exportar CSV
      </Button>
    </div>
  );
};
