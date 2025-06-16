
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FileDropZone } from './import/FileDropZone';
import { ImportActions } from './import/ImportActions';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any[]) => void;
  onDownloadTemplate: () => void;
  title: string;
  templateDescription: string;
  requiredColumns?: string[];
  validateData?: (data: any[]) => boolean;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onDownloadTemplate,
  title,
  templateDescription,
  requiredColumns,
  validateData
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { processFile, isProcessing } = useFileUpload({ 
    onUpload, 
    requiredColumns,
    validateData 
  });

  const handleFileSelect = (file: File) => {
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            A planilha deve conter as colunas: id_cliente, modelo, filial, destino_final, valor_recuperado, data_registro. 
            O formato da data pode ser DD/MM/AAAA ou DD-MM-AAAA. A coluna peso foi removida do modelo.
          </div>

          <FileDropZone
            isDragging={isDragging}
            isProcessing={isProcessing}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <ImportActions
            onDownloadTemplate={onDownloadTemplate}
            onSelectFile={() => fileInputRef.current?.click()}
            isProcessing={isProcessing}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
