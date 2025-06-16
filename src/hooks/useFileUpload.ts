
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

interface UseFileUploadProps {
  onUpload: (data: any[]) => void;
  requiredColumns?: string[];
  validateData?: (data: any[]) => boolean;
}

export const useFileUpload = ({ onUpload, requiredColumns = [], validateData }: UseFileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processFile = (file: File) => {
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

        // Validar colunas se fornecidas
        if (requiredColumns.length > 0) {
          const firstRow = jsonData[0] as any;
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
        }

        // Normalizar os dados
        const normalizedData = jsonData.map((row: any) => {
          const normalizedRow: any = {};
          Object.keys(row).forEach(key => {
            const lowerKey = key.toLowerCase();
            
            // Mapear colunas comuns
            if (lowerKey.includes('modelo')) {
              normalizedRow.modelo = row[key];
            } else if (lowerKey.includes('quantidade')) {
              normalizedRow.quantidade = Number(row[key]) || 0;
            } else if (lowerKey.includes('fornecedor')) {
              normalizedRow.fornecedor = row[key];
            } else if (lowerKey.includes('id_cliente')) {
              normalizedRow.id_cliente = row[key];
            } else if (lowerKey.includes('filial')) {
              normalizedRow.filial = row[key];
            } else if (lowerKey.includes('destino_final')) {
              normalizedRow.destino_final = row[key];
            } else if (lowerKey.includes('peso')) {
              normalizedRow.peso = Number(row[key]) || 0;
            } else if (lowerKey.includes('valor_recuperado')) {
              normalizedRow.valor_recuperado = Number(row[key]) || 0;
            } else if (lowerKey.includes('data_registro')) {
              normalizedRow.data_registro = row[key];
            }
          });
          return normalizedRow;
        });

        // Validação customizada se fornecida
        if (validateData && !validateData(normalizedData)) {
          return;
        }

        onUpload(normalizedData);
        toast({
          title: "Sucesso",
          description: `${normalizedData.length} registros processados com sucesso!`
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

  return {
    processFile,
    isProcessing
  };
};
