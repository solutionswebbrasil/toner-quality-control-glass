
import { useState, useEffect, useMemo } from 'react';
import { auditoriaService } from '@/services/auditoriaService';
import type { Auditoria } from '@/types';

export const useAuditorias = () => {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>('');

  const loadAuditorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await auditoriaService.getAll();
      setAuditorias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar auditorias');
      console.error('Erro ao carregar auditorias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditorias();
  }, []);

  const filteredAuditorias = useMemo(() => {
    return auditorias.filter(auditoria => {
      const matchDataInicio = !dataInicio || auditoria.data_inicio >= dataInicio;
      const matchDataFim = !dataFim || auditoria.data_fim <= dataFim;
      const matchUnidade = !unidadeSelecionada || auditoria.unidade_auditada.toLowerCase().includes(unidadeSelecionada.toLowerCase());
      
      return matchDataInicio && matchDataFim && matchUnidade;
    });
  }, [auditorias, dataInicio, dataFim, unidadeSelecionada]);

  const createAuditoria = async (auditoria: Omit<Auditoria, 'id' | 'data_registro'>) => {
    try {
      const newAuditoria = await auditoriaService.create(auditoria);
      setAuditorias(prev => [newAuditoria, ...prev]);
      return newAuditoria;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar auditoria');
      throw err;
    }
  };

  const updateAuditoria = async (id: number, auditoria: Partial<Auditoria>) => {
    try {
      const updatedAuditoria = await auditoriaService.update(id, auditoria);
      if (updatedAuditoria) {
        setAuditorias(prev => 
          prev.map(item => item.id === id ? updatedAuditoria : item)
        );
      }
      return updatedAuditoria;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar auditoria');
      throw err;
    }
  };

  const deleteAuditoria = async (id: number) => {
    try {
      const success = await auditoriaService.delete(id);
      if (success) {
        setAuditorias(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir auditoria');
      throw err;
    }
  };

  const getAuditoriaById = async (id: number) => {
    try {
      const auditoria = await auditoriaService.getById(id);
      return auditoria;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar auditoria');
      throw err;
    }
  };

  const handleDownloadPDF = (auditoria: Auditoria) => {
    if (auditoria.formulario_pdf) {
      window.open(auditoria.formulario_pdf, '_blank');
    }
  };

  const handleDeleteAuditoria = async (id: number) => {
    await deleteAuditoria(id);
  };

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setUnidadeSelecionada('');
  };

  const refreshAuditorias = () => {
    loadAuditorias();
  };

  return {
    auditorias,
    filteredAuditorias,
    loading,
    isLoading: loading,
    error,
    dataInicio,
    dataFim,
    unidadeSelecionada,
    setDataInicio,
    setDataFim,
    setUnidadeSelecionada,
    createAuditoria,
    updateAuditoria,
    deleteAuditoria,
    getAuditoriaById,
    handleDownloadPDF,
    handleDeleteAuditoria,
    clearFilters,
    refreshAuditorias,
  };
};
