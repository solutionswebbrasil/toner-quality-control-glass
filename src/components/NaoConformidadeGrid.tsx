
import React, { useState } from 'react';
import { NaoConformidadeFilters } from './naoConformidade/NaoConformidadeFilters';
import { NaoConformidadeTable } from './naoConformidade/NaoConformidadeTable';
import { NaoConformidadeViewModal } from './naoConformidade/NaoConformidadeViewModal';
import { NaoConformidadeEditModal } from './naoConformidade/NaoConformidadeEditModal';
import { useNaoConformidades } from '@/hooks/useNaoConformidades';
import { useNaoConformidadeFilters } from '@/hooks/useNaoConformidadeFilters';
import { useToast } from '@/hooks/use-toast';
import { NaoConformidade } from '@/types/naoConformidade';

export const NaoConformidadeGrid: React.FC = () => {
  const { toast } = useToast();
  const [selectedNc, setSelectedNc] = useState<NaoConformidade | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { 
    naoConformidades, 
    loading, 
    handleDeleteNaoConformidade,
    loadNaoConformidades 
  } = useNaoConformidades();

  const {
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    unidadeSelecionada,
    setUnidadeSelecionada,
    setorSelecionado,
    setSetorSelecionado,
    tipoSelecionado,
    setTipoSelecionado,
    classificacaoSelecionada,
    setClassificacaoSelecionada,
    statusSelecionado,
    setStatusSelecionado,
    filteredNaoConformidades,
    clearFilters
  } = useNaoConformidadeFilters(naoConformidades);

  const handleView = (id: number) => {
    const nc = naoConformidades.find(item => item.id === id);
    if (nc) {
      setSelectedNc(nc);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id: number) => {
    const nc = naoConformidades.find(item => item.id === id);
    if (nc) {
      setSelectedNc(nc);
      setIsEditModalOpen(true);
    }
  };

  const handlePrint = (id: number) => {
    console.log('Imprimir NC:', id);
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A função de impressão será implementada em breve.",
    });
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedNc(null);
    loadNaoConformidades();
  };

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50 rounded-lg p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Carregando não conformidades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Consulta de Não Conformidades
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consulte e gerencie as não conformidades registradas
        </p>
        <div className="mt-2 text-sm text-slate-500">
          Total de registros: {naoConformidades.length} | Exibindo: {filteredNaoConformidades.length}
        </div>
      </div>

      <NaoConformidadeFilters
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
        unidadeSelecionada={unidadeSelecionada}
        setUnidadeSelecionada={setUnidadeSelecionada}
        setorSelecionado={setorSelecionado}
        setSetorSelecionado={setSetorSelecionado}
        tipoSelecionado={tipoSelecionado}
        setTipoSelecionado={setTipoSelecionado}
        classificacaoSelecionada={classificacaoSelecionada}
        setClassificacaoSelecionada={setClassificacaoSelecionada}
        statusSelecionado={statusSelecionado}
        setStatusSelecionado={setStatusSelecionado}
        clearFilters={clearFilters}
        resultCount={filteredNaoConformidades.length}
      />

      <NaoConformidadeTable
        naoConformidades={filteredNaoConformidades}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteNaoConformidade}
        onPrint={handlePrint}
      />

      {selectedNc && (
        <>
          <NaoConformidadeViewModal
            naoConformidade={selectedNc}
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedNc(null);
            }}
          />
          
          <NaoConformidadeEditModal
            naoConformidade={selectedNc}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedNc(null);
            }}
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </div>
  );
};
