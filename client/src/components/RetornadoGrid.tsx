
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { RetornadoFilters } from './retornado/RetornadoFilters';
import { RetornadoTablePaginated } from './retornado/RetornadoTablePaginated';
import { RetornadoActions } from './retornado/RetornadoActions';
import { retornadoService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';
import { useRetornadoImportExport } from '@/hooks/useRetornadoImportExport';
import { Retornado } from '@/types';

export const RetornadoGrid: React.FC = () => {
  const [retornados, setRetornados] = useState<Retornado[]>([]);
  const [filteredRetornados, setFilteredRetornados] = useState<Retornado[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loadRetornados = async () => {
    try {
      setLoading(true);
      const data = await retornadoService.getAll();
      setRetornados(data);
      setFilteredRetornados(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('Erro ao carregar retornados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos retornados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRetornados();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await retornadoService.delete(id);
      toast({
        title: "Sucesso",
        description: "Retornado excluído com sucesso!",
      });
      loadRetornados();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir retornado.",
        variant: "destructive"
      });
    }
  };

  const {
    importing,
    importProgress,
    isImportModalOpen,
    setIsImportModalOpen,
    handleExportCSV,
    handleDownloadTemplate,
    handleImportUpload,
    handleImportCSV
  } = useRetornadoImportExport(loadRetornados);

  const handleExportClick = () => {
    handleExportCSV(filteredRetornados);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Consulta de Retornados
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte e exporte dados dos toners retornados
        </p>
        <div className="mt-2 text-sm text-slate-500">
          Total de registros no banco: {totalCount} | Exibindo após filtros: {filteredRetornados.length}
        </div>
      </div>

      <RetornadoFilters
        onFilteredChange={setFilteredRetornados}
        allRetornados={retornados}
      />

      <RetornadoActions
        filteredRetornados={filteredRetornados}
        onExportCSV={handleExportClick}
        onDownloadTemplate={handleDownloadTemplate}
        onImportCSV={handleImportCSV}
        importing={importing}
        importProgress={importProgress}
        isImportModalOpen={isImportModalOpen}
        setIsImportModalOpen={setIsImportModalOpen}
        onImportUpload={handleImportUpload}
      />

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Retornados Encontrados ({filteredRetornados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <RetornadoTablePaginated
              data={filteredRetornados}
              onDelete={handleDelete}
              totalCount={totalCount}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
