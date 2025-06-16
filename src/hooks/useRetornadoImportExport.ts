
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV } from '@/utils/csvExporter';
import { processImportData } from '@/utils/importDataProcessor';
import { generateExcelTemplate } from '@/utils/templateGenerator';
import { Retornado } from '@/types';

export const useRetornadoImportExport = (loadRetornados: () => void) => {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleExportCSV = (filteredRetornados: Retornado[]) => {
    exportToCSV(
      filteredRetornados,
      () => {
        toast({
          title: "Sucesso",
          description: "Arquivo CSV exportado com sucesso!",
        });
      },
      () => {
        toast({
          title: "Erro",
          description: "Erro ao exportar CSV.",
          variant: "destructive"
        });
      }
    );
  };

  const handleDownloadTemplate = () => {
    generateExcelTemplate(
      () => {
        toast({
          title: "Sucesso",
          description: "Modelo de planilha baixado com sucesso!",
        });
      },
      () => {
        toast({
          title: "Erro",
          description: "Erro ao baixar modelo de planilha.",
          variant: "destructive"
        });
      }
    );
  };

  const handleImportUpload = async (data: any[]) => {
    setImporting(true);
    
    try {
      const { importedCount, errorCount, errors } = await processImportData(data);
      
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
