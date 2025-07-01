import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Upload, FileText, Trash2, Edit, Plus } from 'lucide-react';
import { Retornado } from '@/types';
import { retornadoService } from '@/services/retornadoService';
import { useToast } from '@/hooks/use-toast';
import { RetornadoTable } from '@/components/retornado/RetornadoTable';
import { RetornadoFilters } from '@/components/retornado/RetornadoFilters';
import { RetornadoActions } from '@/components/retornado/RetornadoActions';
import { ImportModal } from '@/components/ImportModal';
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
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedFilial={selectedFilial}
            onFilialChange={setSelectedFilial}
          />

          <RetornadoActions
            onImportExcel={handleImportData}
            onExportExcel={handleExportExcel}
            onImportCSV={handleImportFile}
            onExportCSV={() => console.log('Export CSV')}
            onDownloadTemplate={() => console.log('Download template')}
            isImporting={isImporting}
            isExporting={isExporting}
          />

          <RetornadoTable
            retornados={paginatedData}
            loading={loading}
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
