
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any[]) => void;
  onDownloadTemplate: () => void;
  title: string;
  templateDescription: string;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onDownloadTemplate,
  title,
  templateDescription
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast({
            title: "Erro",
            description: "A planilha está vazia",
            variant: "destructive"
          });
          return;
        }

        // Validar se tem as colunas necessárias
        const firstRow = jsonData[0] as any;
        const requiredColumns = ['modelo', 'quantidade', 'fornecedor'];
        const hasRequiredColumns = requiredColumns.every(col => 
          Object.keys(firstRow).some(key => 
            key.toLowerCase().includes(col.toLowerCase())
          )
        );

        if (!hasRequiredColumns) {
          toast({
            title: "Erro",
            description: `A planilha deve conter as colunas: ${requiredColumns.join(', ')}`,
            variant: "destructive"
          });
          return;
        }

        // Normalizar os nomes das colunas
        const normalizedData = jsonData.map((row: any) => {
          const normalizedRow: any = {};
          Object.keys(row).forEach(key => {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('modelo')) {
              normalizedRow.modelo = row[key];
            } else if (lowerKey.includes('quantidade')) {
              normalizedRow.quantidade = Number(row[key]) || 0;
            } else if (lowerKey.includes('fornecedor')) {
              normalizedRow.fornecedor = row[key];
            }
          });
          return normalizedRow;
        });

        onUpload(normalizedData);
        toast({
          title: "Sucesso",
          description: `${normalizedData.length} registros importados com sucesso!`
        });
        
      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        toast({
          title: "Erro",
          description: "Erro ao processar o arquivo. Verifique se é um arquivo Excel válido.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
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
            {templateDescription}
          </div>

          {/* Área de Upload */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                : 'border-slate-300 dark:border-slate-600'
              }
              ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <div className="text-lg font-medium mb-2">
              {isProcessing ? 'Processando...' : 'Arraste e solte seu arquivo aqui'}
            </div>
            <div className="text-sm text-slate-500 mb-4">
              ou clique para selecionar
            </div>
            <div className="text-xs text-slate-400">
              Formatos aceitos: .xlsx, .xls
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Botões */}
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
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center gap-2"
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4" />
              Selecionar Arquivo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
