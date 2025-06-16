import { useState } from 'react';
import { Retornado } from '@/types';
import { retornadoService } from '@/services/retornadoService';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

export const useRetornadoImportExport = (loadRetornados: () => void) => {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleExportCSV = (filteredRetornados: Retornado[]) => {
    try {
      const headers = ['ID Cliente', 'Modelo', 'Filial', 'Destino Final', 'Valor Recuperado', 'Data Registro'];
      const csvContent = [
        headers.join(','),
        ...filteredRetornados.map(row => [
          row.id_cliente,
          `"${row.modelo || ''}"`,
          `"${row.filial}"`,
          `"${row.destino_final}"`,
          row.valor_recuperado || '',
          new Date(row.data_registro).toLocaleDateString('pt-BR')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `retornados_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Sucesso",
        description: "Arquivo CSV exportado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar CSV.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadTemplate = () => {
    try {
      // Modelo sem a coluna peso, já que não é necessária
      const template = [
        { 
          id_cliente: 12345, 
          modelo: 'HP CF217A', 
          filial: 'Matriz', 
          destino_final: 'Estoque',
          valor_recuperado: 25.50, 
          data_registro: '16/06/2024' // Formato brasileiro
        }
      ];

      const ws = XLSX.utils.json_to_sheet(template);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Retornados');
      XLSX.writeFile(wb, 'template_importacao_retornados.xlsx');

      toast({
        title: "Sucesso",
        description: "Modelo de planilha baixado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao baixar modelo de planilha.",
        variant: "destructive"
      });
    }
  };

  // Função para normalizar data - foco no formato brasileiro DD/MM/YYYY
  const normalizeDate = (dateValue: any): string => {
    if (!dateValue) {
      return new Date().toISOString().split('T')[0];
    }

    console.log('Processando data:', dateValue, 'Tipo:', typeof dateValue);

    // Se já é uma string no formato correto YYYY-MM-DD
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }

    // Se é uma data do Excel (número)
    if (typeof dateValue === 'number') {
      const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
      return excelDate.toISOString().split('T')[0];
    }

    // Se é string, priorizar formato brasileiro DD/MM/YYYY
    if (typeof dateValue === 'string') {
      const dateStr = dateValue.trim();
      
      // Formato DD/MM/YYYY (formato brasileiro preferido)
      const brDateMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (brDateMatch) {
        const [, day, month, year] = brDateMatch;
        const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        console.log(`Data convertida de ${dateStr} para ${normalizedDate}`);
        return normalizedDate;
      }

      // Formato DD-MM-YYYY (alternativo)
      const brDateDashMatch = dateStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (brDateDashMatch) {
        const [, day, month, year] = brDateDashMatch;
        const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        console.log(`Data convertida de ${dateStr} para ${normalizedDate}`);
        return normalizedDate;
      }

      // Formato YYYY/MM/DD ou YYYY-MM-DD
      const isoDateMatch = dateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
      if (isoDateMatch) {
        const [, year, month, day] = isoDateMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      // Tentar parser nativo como último recurso
      try {
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split('T')[0];
        }
      } catch (e) {
        console.log('Erro ao parsear data:', e);
      }
    }

    // Se chegou aqui, usar data atual
    console.log('Usando data atual como fallback para:', dateValue);
    return new Date().toISOString().split('T')[0];
  };

  const handleImportUpload = async (data: any[]) => {
    setImporting(true);
    
    try {
      console.log('Iniciando importação com dados:', data);
      
      let importedCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const [index, item] of data.entries()) {
        try {
          console.log(`Processando item ${index + 1}:`, item);
          
          // Validação mais rigorosa dos dados
          if (!item.id_cliente || item.id_cliente <= 0) {
            throw new Error(`ID do cliente inválido: ${item.id_cliente}`);
          }

          // Normalizar e validar dados
          const retornadoData = {
            id_cliente: parseInt(String(item.id_cliente)) || 1,
            id_modelo: 1, // ID padrão - seria ideal ter uma lookup table
            peso: 100, // Peso padrão fixo, já que não é obrigatório na planilha
            destino_final: String(item.destino_final || 'Estoque').trim(),
            filial: String(item.filial || 'Matriz').trim(),
            valor_recuperado: item.valor_recuperado ? parseFloat(String(item.valor_recuperado)) : null,
            data_registro: normalizeDate(item.data_registro)
          };

          console.log(`Dados preparados para importação item ${index + 1}:`, retornadoData);
          
          const novoRetornado = await retornadoService.create(retornadoData);
          console.log(`Item ${index + 1} importado com sucesso:`, novoRetornado);
          
          importedCount++;
        } catch (error) {
          console.error(`Erro ao importar item ${index + 1}:`, item, error);
          errorCount++;
          errors.push(`Linha ${index + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      console.log(`Importação concluída: ${importedCount} sucessos, ${errorCount} erros`);
      
      // Recarregar dados após importação
      await loadRetornados();
      setIsImportModalOpen(false);

      if (errorCount > 0) {
        console.log('Erros encontrados:', errors);
        toast({
          title: "Importação Parcial",
          description: `${importedCount} registros importados. ${errorCount} erros encontrados. Verifique o console para detalhes.`,
          variant: errorCount > importedCount ? "destructive" : "default"
        });
      } else {
        toast({
          title: "Importação Concluída",
          description: `${importedCount} registros importados com sucesso!`,
        });
      }

    } catch (error) {
      console.error('Erro geral na importação:', error);
      toast({
        title: "Erro na Importação",
        description: error instanceof Error ? error.message : "Erro ao processar arquivo.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImportCSV = () => {
    setIsImportModalOpen(true);
  };

  return {
    importing,
    isImportModalOpen,
    setIsImportModalOpen,
    handleExportCSV,
    handleDownloadTemplate,
    handleImportUpload,
    handleImportCSV
  };
};
