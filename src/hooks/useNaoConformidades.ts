
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockNaoConformidades = [
  {
    id: 1,
    tipo: 'Produto',
    descricao: 'Defeito na impressão',
    filial: 'São Paulo',
    data_ocorrencia: '2024-01-15',
    status: 'Aberta',
    responsavel: 'João Silva'
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

  return {
    naoConformidades,
    loading,
    deleteNaoConformidade,
  };
};
