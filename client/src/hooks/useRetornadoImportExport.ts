
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV } from '@/utils/csvExporter';
import { processImportData } from '@/utils/importDataProcessor';
import { generateExcelTemplate } from '@/utils/templateGenerator';
import { Retornado } from '@/types';

export const useRetornadoImportExport = (loadRetornados: () => void) => {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
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
    setImportProgress(0);
    
    try {
      console.log(`Iniciando importação de ${data.length} registros`);
      
      const result = await processImportData(data);
      
      const importedCount = result.processedCount || 0;
      const errorCount = result.errors?.length || 0;
      
      console.log(`Importação concluída: ${importedCount} sucessos, ${errorCount} erros de ${data.length} registros`);
      
      // Recarregar dados após importação - aguardar um pouco para garantir consistência
      setTimeout(async () => {
        await loadRetornados();
        setIsImportModalOpen(false);
        setImportProgress(0);
      }, 1000);

      if (errorCount > 0) {
        console.log('Erros encontrados:', result.errors?.slice(0, 10)); // Mostrar apenas os primeiros 10 erros
        toast({
          title: "Importação Parcial",
          description: `${importedCount} de ${data.length} registros importados. ${errorCount} erros encontrados.`,
          variant: errorCount > importedCount ? "destructive" : "default"
        });
      } else {
        toast({
          title: "Importação Concluída",
          description: `Todos os ${importedCount} registros foram importados com sucesso!`,
        });
      }

    } catch (error) {
      console.error('Erro geral na importação:', error);
      toast({
        title: "Erro na Importação",
        description: error instanceof Error ? error.message : "Erro ao processar arquivo.",
        variant: "destructive"
      });
      setIsImportModalOpen(false);
      setImportProgress(0);
    } finally {
      setImporting(false);
    }
  };

  const handleImportCSV = () => {
    setIsImportModalOpen(true);
  };

  return {
    importing,
    importProgress,
    isImportModalOpen,
    setIsImportModalOpen,
    handleExportCSV,
    handleDownloadTemplate,
    handleImportUpload,
    handleImportCSV
  };
};
