
import { useState, useEffect } from 'react';
import { NaoConformidade } from '@/types/naoConformidade';
import { naoConformidadeService } from '@/services/naoConformidadeService';
import { useToast } from '@/hooks/use-toast';

export const useNaoConformidades = () => {
  const { toast } = useToast();
  const [naoConformidades, setNaoConformidades] = useState<NaoConformidade[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNaoConformidades = async () => {
    setLoading(true);
    try {
      const data = await naoConformidadeService.getAll();
      setNaoConformidades(data);
    } catch (error) {
      console.error('Erro ao carregar não conformidades:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar não conformidades.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNaoConformidade = async (id: number) => {
    try {
      await naoConformidadeService.delete(id);
      setNaoConformidades(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Não conformidade excluída com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir não conformidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir não conformidade.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadNaoConformidades();
  }, []);

  return {
    naoConformidades,
    setNaoConformidades,
    loading,
    loadNaoConformidades,
    handleDeleteNaoConformidade
  };
};
