
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

interface FileDropZoneProps {
  isDragging: boolean;
  isProcessing: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onClick: () => void;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  isDragging,
  isProcessing,
  onDrop,
  onDragOver,
  onDragLeave,
  onClick
}) => {
  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
          : 'border-slate-300 dark:border-slate-600'
        }
        ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'}
      `}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={onClick}
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
  );
};
