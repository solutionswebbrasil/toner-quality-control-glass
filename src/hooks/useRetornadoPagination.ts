
import { useState, useEffect } from 'react';
import { Retornado } from '@/types';
import { retornadoService } from '@/services/retornadoService';
import { useToast } from '@/hooks/use-toast';

export const useRetornadoPagination = () => {
  const { toast } = useToast();
  const [allRetornados, setAllRetornados] = useState<Retornado[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loadAllRetornados = async () => {
    setLoading(true);
    try {
      console.log('Carregando TODOS os retornados do banco...');
      const data = await retornadoService.getAll();
      console.log('Total de retornados carregados:', data.length);
      
      setAllRetornados(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('Erro ao carregar todos os retornados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar retornados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRetornado = async (id: number) => {
    try {
      await retornadoService.delete(id);
      
      // Atualizar localmente
      setAllRetornados(prev => prev.filter(item => item.id !== id));
      setTotalCount(prev => prev - 1);
      
      toast({
        title: "Sucesso",
        description: "Retornado excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir retornado:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir retornado.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadAllRetornados();
  }, []);

  return {
    allRetornados,
    setAllRetornados,
    loading,
    totalCount,
    loadAllRetornados,
    handleDeleteRetornado
  };
};
