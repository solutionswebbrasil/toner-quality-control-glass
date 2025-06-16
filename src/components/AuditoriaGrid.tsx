
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditoriaFilters } from './auditoria/AuditoriaFilters';
import { AuditoriaTable } from './auditoria/AuditoriaTable';
import { useAuditorias } from '@/hooks/useAuditorias';

export const AuditoriaGrid: React.FC = () => {
  const {
    filteredAuditorias,
    dataInicio,
    dataFim,
    unidadeSelecionada,
    isLoading,
    setDataInicio,
    setDataFim,
    setUnidadeSelecionada,
    handleDownloadPDF,
    handleDeleteAuditoria,
    clearFilters,
  } = useAuditorias();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Consulta de Auditorias
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte, baixe os formulários e gerencie as auditorias realizadas
        </p>
      </div>

      <AuditoriaFilters
        dataInicio={dataInicio}
        dataFim={dataFim}
        unidadeSelecionada={unidadeSelecionada}
        onDataInicioChange={setDataInicio}
        onDataFimChange={setDataFim}
        onUnidadeChange={setUnidadeSelecionada}
        onClearFilters={clearFilters}
      />

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Auditorias Encontradas ({filteredAuditorias.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <AuditoriaTable
              auditorias={filteredAuditorias}
              isLoading={isLoading}
              onDownloadPDF={handleDownloadPDF}
              onDelete={handleDeleteAuditoria}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
