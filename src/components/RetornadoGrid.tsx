
import React from 'react';
import { RetornadoFilters, RetornadoActions } from './retornado';
import { RetornadoTablePaginated } from './retornado/RetornadoTablePaginated';
import { ImportModal } from './ImportModal';
import { useRetornadoPagination } from '@/hooks/useRetornadoPagination';
import { useRetornadoFilters } from '@/hooks/useRetornadoFilters';
import { useRetornadoImportExport } from '@/hooks/useRetornadoImportExport';

export const RetornadoGrid: React.FC = () => {
  const { 
    allRetornados, 
    loading, 
    totalCount,
    loadAllRetornados, 
    handleDeleteRetornado 
  } = useRetornadoPagination();

  const {
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    filialSelecionada,
    setFilialSelecionada,
    destinoSelecionado,
    setDestinoSelecionado,
    filteredRetornados,
    clearFilters
  } = useRetornadoFilters(allRetornados);

  const {
    importing,
    importProgress,
    isImportModalOpen,
    setIsImportModalOpen,
    handleExportCSV,
    handleDownloadTemplate,
    handleImportUpload,
    handleImportCSV
  } = useRetornadoImportExport();

  const handleZerarComplete = () => {
    loadAllRetornados(); // Recarregar todos os dados após zerar
  };

  const handleExportWithData = () => {
    handleExportCSV();
  };

  const handleImportCallback = () => {
    loadAllRetornados();
  };

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50 rounded-lg p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Carregando todos os retornados...</p>
      </div>
    );
  }

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
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
        filialSelecionada={filialSelecionada}
        setFilialSelecionada={setFilialSelecionada}
        destinoSelecionado={destinoSelecionado}
        setDestinoSelecionado={setDestinoSelecionado}
        clearFilters={clearFilters}
        resultCount={filteredRetornados.length}
      />

      <div className="flex justify-end">
        <RetornadoActions
          onExportCSV={handleExportWithData}
          onDownloadTemplate={handleDownloadTemplate}
          onImportCSV={handleImportCallback}
          importing={importing}
          onZerarComplete={handleZerarComplete}
        />
      </div>

      <RetornadoTablePaginated
        retornados={filteredRetornados}
        onDelete={handleDeleteRetornado}
        totalCount={filteredRetornados.length}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onUpload={handleImportUpload}
        onDownloadTemplate={handleDownloadTemplate}
        title="Importar Planilha de Retornados"
        templateDescription="A planilha deve conter as colunas: id_cliente, modelo, filial, destino_final, valor_recuperado, data_registro"
        requiredColumns={['id_cliente']}
        importing={importing}
        progress={importProgress}
      />
    </div>
  );
};
