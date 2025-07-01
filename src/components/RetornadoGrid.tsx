
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Retornado } from '@/types';
import { retornadoService } from '@/services/retornadoService';
import { useToast } from '@/hooks/use-toast';
import { RetornadoTable } from '@/components/retornado/RetornadoTable';
import { RetornadoFilters } from '@/components/retornado/RetornadoFilters';
import { RetornadoActions } from '@/components/retornado/RetornadoActions';
import { useRetornadoFilters } from '@/hooks/useRetornadoFilters';
import { useRetornadoPagination } from '@/hooks/useRetornadoPagination';
import { useRetornadoImportExport } from '@/hooks/useRetornadoImportExport';

export const RetornadoGrid: React.FC = () => {
  const { toast } = useToast();
  const [retornados, setRetornados] = useState<Retornado[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    selectedFilial,
    setSelectedFilial,
    filteredData: filteredRetornados
  } = useRetornadoFilters(retornados);

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage
  } = useRetornadoPagination(filteredRetornados, 10);

  const {
    isImporting,
    isExporting,
    handleImportExcel,
    handleExportExcel
  } = useRetornadoImportExport();

  useEffect(() => {
    loadRetornados();
  }, []);

  const loadRetornados = async () => {
    setLoading(true);
    try {
      const data = await retornadoService.getAll();
      setRetornados(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar os dados de Retornados.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleImportData = (data: any[]) => {
    console.log('Import data:', data);
    // Process imported data
  };

  const handleImportFile = (file: File) => {
    console.log('Import file:', file);
    // Process imported file
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Consulta de Retornados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RetornadoFilters
            dataInicio={dateRange.from}
            onDataInicioChange={(value) => setDateRange(prev => ({ ...prev, from: value }))}
            dataFim={dateRange.to}
            onDataFimChange={(value) => setDateRange(prev => ({ ...prev, to: value }))}
            filial={selectedFilial}
            onFilialChange={setSelectedFilial}
            clearFilters={() => {
              setSearchTerm('');
              setDateRange({ from: '', to: '' });
              setSelectedFilial('');
            }}
          />

          <RetornadoActions
            onImportExcel={handleImportData}
            onExportExcel={() => handleExportExcel()}
            onImportCSV={() => console.log('Import CSV')}
            onExportCSV={() => console.log('Export CSV')}
            onDownloadTemplate={() => console.log('Download template')}
            isImporting={isImporting}
            isExporting={isExporting}
          />

          <RetornadoTable
            retornados={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrevPage={prevPage}
            onNextPage={nextPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};
