
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock auditorias data with user_id
const mockAuditorias = [
  {
    id: 1,
    data_inicio: '2024-01-15',
    data_fim: '2024-01-16',
    unidade_auditada: 'São Paulo',
    formulario_pdf: 'auditoria1.pdf',
    data_registro: '2024-01-17T10:30:00Z',
    user_id: 'user1'
  },
  {
    id: 2,
    data_inicio: '2024-02-10',
    data_fim: '2024-02-11',
    unidade_auditada: 'Rio de Janeiro',
    formulario_pdf: 'auditoria2.pdf',
    data_registro: '2024-02-12T14:20:00Z',
    user_id: 'user2'
  }
];

export const useAuditorias = () => {
  const { toast } = useToast();
  const [auditorias] = useState(mockAuditorias);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredAuditorias = auditorias.filter(auditoria => {
    const matchDataInicio = !dataInicio || auditoria.data_inicio >= dataInicio;
    const matchDataFim = !dataFim || auditoria.data_fim <= dataFim;
    const matchUnidade = !unidadeSelecionada || auditoria.unidade_auditada === unidadeSelecionada;
    
    return matchDataInicio && matchDataFim && matchUnidade;
  });

  const handleDownloadPDF = (auditoria: any) => {
    if (auditoria.formulario_pdf) {
      toast({
        title: "Download iniciado",
        description: `Baixando ${auditoria.formulario_pdf}`,
      });
    }
  };

  const handleDeleteAuditoria = (auditoria: any) => {
    toast({
      title: "Sucesso",
      description: "Auditoria excluída com sucesso!",
    });
  };

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setUnidadeSelecionada('');
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
