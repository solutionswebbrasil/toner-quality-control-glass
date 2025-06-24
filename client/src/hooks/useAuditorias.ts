
import { useState, useEffect } from 'react';
import { auditoriaService } from '@/services/auditoriaService';
import type { Auditoria } from '@/types';

export const useAuditorias = () => {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const refreshAuditorias = () => {
    loadAuditorias();
  };

  return {
    auditorias,
    loading,
    error,
    createAuditoria,
    updateAuditoria,
    deleteAuditoria,
    getAuditoriaById,
    refreshAuditorias,
  };
};
