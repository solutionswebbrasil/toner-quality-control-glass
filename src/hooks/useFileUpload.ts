
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
        const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Usar sheet_to_json com opções mais específicas para capturar todos os dados
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: '',
          blankrows: false
        });

        console.log('Dados brutos da planilha:', jsonData.length, 'registros');
        console.log('Primeiros 5 registros:', jsonData.slice(0, 5));

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
              // Aceitar valores numéricos incluindo 0
              const clienteId = Number(value);
              normalizedRow.id_cliente = isNaN(clienteId) ? 0 : clienteId;
            } else if (lowerKey.includes('filial') || lowerKey.includes('branch') || lowerKey.includes('unidade')) {
              normalizedRow.filial = String(value || '').trim();
            } else if (lowerKey.includes('destino') || lowerKey.includes('destination')) {
              normalizedRow.destino_final = String(value || '').trim();
            } else if (lowerKey.includes('valor') && (lowerKey.includes('recuperado') || lowerKey.includes('recovery'))) {
              // Processar valores monetários
              if (value !== undefined && value !== null && value !== '') {
                let valorStr = String(value);
                valorStr = valorStr.replace(/R\$\s*/g, '');
                valorStr = valorStr.replace(/[^\d,.-]/g, '');
                if (valorStr.includes(',') && !valorStr.includes('.')) {
                  valorStr = valorStr.replace(',', '.');
                }
                const valorNumerico = parseFloat(valorStr);
                normalizedRow.valor_recuperado = isNaN(valorNumerico) ? null : valorNumerico;
              } else {
                normalizedRow.valor_recuperado = null;
              }
            } else if (lowerKey.includes('peso') || lowerKey.includes('weight')) {
              const peso = Number(value);
              normalizedRow.peso = isNaN(peso) ? 100 : peso;
            } else if (lowerKey.includes('data') || lowerKey.includes('date')) {
              // Manter o valor original da data para processamento posterior
              normalizedRow.data_registro = value;
            }
          });

          // Valores padrão para campos obrigatórios
          if (normalizedRow.id_cliente === undefined || normalizedRow.id_cliente === null) {
            normalizedRow.id_cliente = 0; // ID padrão para retornados sem identificação
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
          if (!normalizedRow.peso) {
            normalizedRow.peso = 100; // Peso padrão
          }

          console.log(`Linha ${index + 1} normalizada:`, normalizedRow);
          return normalizedRow;
        });

        console.log('Total de dados normalizados:', normalizedData.length);

        // Validação customizada se fornecida
        if (validateData && !validateData(normalizedData)) {
          return;
        }

        onUpload(normalizedData);
        toast({
          title: "Arquivo Processado",
          description: `${normalizedData.length} registros prontos para importação!`
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
