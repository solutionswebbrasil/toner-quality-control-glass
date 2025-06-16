
import { useState, useEffect } from 'react';
import { Retornado } from '@/types';
import { retornadoService } from '@/services/retornadoService';
import { useToast } from '@/hooks/use-toast';

export const useRetornados = () => {
  const { toast } = useToast();
  const [retornados, setRetornados] = useState<Retornado[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRetornados = async () => {
    setLoading(true);
    try {
      const data = await retornadoService.getAll();
      console.log('Dados carregados do Supabase:', data.length, 'registros');
      console.log('Primeiros 3 registros:', data.slice(0, 3));
      setRetornados(data);
    } catch (error) {
      console.error('Erro ao carregar retornados:', error);
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
      
      // Atualizar as listas localmente removendo o item excluído
      setRetornados(prev => prev.filter(item => item.id !== id));
      
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
    loadRetornados();
  }, []);

  return {
    retornados,
    setRetornados,
    loading,
    loadRetornados,
    handleDeleteRetornado
  };
};
