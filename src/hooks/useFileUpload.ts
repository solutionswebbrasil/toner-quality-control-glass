
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

        console.log('Dados brutos da planilha:', jsonData);

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
              key.toLowerCase().trim().includes(col.toLowerCase())
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

        // Normalizar os dados com melhor mapeamento
        const normalizedData = jsonData.map((row: any, index: number) => {
          const normalizedRow: any = {};
          
          console.log(`Processando linha ${index + 1}:`, row);
          
          Object.keys(row).forEach(key => {
            const value = row[key];
            const lowerKey = key.toLowerCase().trim();
            
            // Mapear colunas com mais variações
            if (lowerKey.includes('modelo') || lowerKey.includes('model')) {
              normalizedRow.modelo = String(value || '').trim();
            } else if (lowerKey.includes('quantidade') || lowerKey.includes('qtd') || lowerKey.includes('qty')) {
              normalizedRow.quantidade = Number(value) || 0;
            } else if (lowerKey.includes('fornecedor') || lowerKey.includes('supplier')) {
              normalizedRow.fornecedor = String(value || '').trim();
            } else if (lowerKey.includes('id_cliente') || lowerKey.includes('cliente') || lowerKey.includes('customer')) {
              normalizedRow.id_cliente = Number(value) || 0;
            } else if (lowerKey.includes('filial') || lowerKey.includes('branch')) {
              normalizedRow.filial = String(value || '').trim();
            } else if (lowerKey.includes('destino') || lowerKey.includes('destination')) {
              normalizedRow.destino_final = String(value || '').trim();
            } else if (lowerKey.includes('valor') && (lowerKey.includes('recuperado') || lowerKey.includes('recovery'))) {
              normalizedRow.valor_recuperado = Number(value) || 0;
            } else if (lowerKey.includes('data') || lowerKey.includes('date')) {
              // Manter o valor original da data para processamento posterior
              normalizedRow.data_registro = value;
            }
            // Remover mapeamento de peso - não é mais obrigatório
          });

          // Valores padrão para campos obrigatórios
          if (!normalizedRow.id_cliente || normalizedRow.id_cliente <= 0) {
            normalizedRow.id_cliente = 1; // ID padrão
          }
          if (!normalizedRow.filial) {
            normalizedRow.filial = 'Matriz'; // Filial padrão
          }
          if (!normalizedRow.destino_final) {
            normalizedRow.destino_final = 'Estoque'; // Destino padrão
          }
          if (!normalizedRow.data_registro) {
            normalizedRow.data_registro = new Date().toLocaleDateString('pt-BR');
          }

          console.log(`Linha ${index + 1} normalizada:`, normalizedRow);
          return normalizedRow;
        });

        console.log('Dados normalizados finais:', normalizedData);

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
