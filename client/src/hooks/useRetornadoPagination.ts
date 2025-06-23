
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
      console.log('🔄 Hook: Iniciando carregamento de TODOS os retornados...');
      const data = await retornadoService.getAll();
      console.log(`✅ Hook: Total de retornados carregados: ${data.length}`);
      
      // Garantir que todos os dados sejam carregados
      if (data.length === 0) {
        console.warn('⚠️ Hook: Nenhum retornado foi carregado do banco');
        toast({
          title: "Aviso",
          description: "Nenhum retornado encontrado no banco de dados.",
          variant: "destructive"
        });
      } else {
        console.log(`🎯 Hook: Definindo ${data.length} registros no estado`);
      }
      
      setAllRetornados(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('❌ Hook: Erro ao carregar todos os retornados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar retornados do banco de dados.",
        variant: "destructive"
      });
      // Não limpar os dados em caso de erro, manter o que já tinha
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRetornado = async (id: number) => {
    try {
      await retornadoService.delete(id);
      
      // Atualizar localmente
      setAllRetornados(prev => {
        const updated = prev.filter(item => item.id !== id);
        console.log(`🗑️ Registro ${id} removido. Total atual: ${updated.length}`);
        return updated;
      });
      setTotalCount(prev => prev - 1);
      
      toast({
        title: "Sucesso",
        description: "Retornado excluído com sucesso!",
      });
    } catch (error) {
      console.error('❌ Erro ao excluir retornado:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir retornado.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log('🚀 Hook: Montando useRetornadoPagination, carregando dados...');
    loadAllRetornados();
  }, []);

  // Log quando os dados mudarem
  useEffect(() => {
    console.log(`📊 Hook: Estado atualizado - ${allRetornados.length} retornados carregados`);
  }, [allRetornados]);

  return {
    allRetornados,
    setAllRetornados,
    loading,
    totalCount,
    loadAllRetornados,
    handleDeleteRetornado
  };
};
