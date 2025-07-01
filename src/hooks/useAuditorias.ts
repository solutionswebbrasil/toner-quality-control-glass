
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock audit data
const mockAuditorias = [
  {
    id: 1,
    data_inicio: '2024-01-15',
    data_fim: '2024-01-20',
    unidade_auditada: 'Filial São Paulo',
    formulario_pdf: 'auditoria_1.pdf',
    data_registro: '2024-01-21T10:30:00Z'
  },
  {
    id: 2,
    data_inicio: '2024-02-10',
    data_fim: '2024-02-15',
    unidade_auditada: 'Filial Rio de Janeiro',
    formulario_pdf: null,
    data_registro: '2024-02-16T14:20:00Z'
  }
];

export const useAuditorias = () => {
  const { toast } = useToast();
  const [filteredAuditorias, setFilteredAuditorias] = useState(mockAuditorias);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadPDF = (auditoria: any) => {
    if (auditoria.formulario_pdf) {
      toast({
        title: "Download",
        description: `Baixando ${auditoria.formulario_pdf}...`,
      });
    } else {
      toast({
        title: "Aviso",
        description: "Esta auditoria não possui arquivo PDF.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAuditoria = (id: number) => {
    setFilteredAuditorias(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Sucesso",
      description: "Auditoria excluída com sucesso!",
    });
  };

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setUnidadeSelecionada('');
    setFilteredAuditorias(mockAuditorias);
  };

  return {
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
  };
};
