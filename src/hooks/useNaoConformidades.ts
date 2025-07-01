
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data - updated to match NaoConformidade type
const mockNaoConformidades = [
  {
    id: 1,
    unidade_filial: 'São Paulo',
    setor_responsavel: 'Produção',
    tipo_nc: 'Produto',
    classificacao: 'Crítica',
    descricao: 'Defeito na impressão',
    data_ocorrencia: '2024-01-15',
    status: 'Aberta',
    responsavel_registro: 'João Silva',
    responsavel_analise: 'Maria Santos',
    prazo_acao: '2024-02-15',
    acao_corretiva: '',
    data_finalizacao: null
  }
];

export const useNaoConformidades = () => {
  const { toast } = useToast();
  const [naoConformidades, setNaoConformidades] = useState(mockNaoConformidades);
  const [loading, setLoading] = useState(false);

  const deleteNaoConformidade = (id: number) => {
    setNaoConformidades(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Sucesso",
      description: "Não conformidade excluída com sucesso!",
    });
  };

  const handleDeleteNaoConformidade = (id: number) => {
    deleteNaoConformidade(id);
  };

  const loadNaoConformidades = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNaoConformidades(mockNaoConformidades);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar não conformidades.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    naoConformidades,
    loading,
    deleteNaoConformidade,
    handleDeleteNaoConformidade,
    loadNaoConformidades,
  };
};
