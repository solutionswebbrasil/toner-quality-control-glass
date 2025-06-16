
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RetornadoActionsProps {
  onExportCSV: () => void;
  onDownloadTemplate: () => void;
  onImportCSV: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
      
      <label htmlFor="import-csv">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 cursor-pointer"
          disabled={importing}
          asChild
        >
          <span>
            <Upload className="h-4 w-4" />
            {importing ? 'Importando...' : 'Importar CSV'}
          </span>
        </Button>
      </label>
      <input
        id="import-csv"
        type="file"
        accept=".csv"
        onChange={onImportCSV}
        className="hidden"
        disabled={importing}
      />
      
      <Button onClick={onExportCSV} className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        Exportar CSV
      </Button>
    </div>
  );
};
