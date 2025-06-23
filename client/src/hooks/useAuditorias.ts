
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { auditoriaService } from '@/services/auditoriaService';
import { fileUploadService } from '@/services/fileUploadService';
import type { Auditoria } from '@/types';

export const useAuditorias = () => {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [filteredAuditorias, setFilteredAuditorias] = useState<Auditoria[]>([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('Todas');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAuditorias();
  }, []);

  useEffect(() => {
    filterAuditorias();
  }, [auditorias, dataInicio, dataFim, unidadeSelecionada]);

  const loadAuditorias = async () => {
    try {
      setIsLoading(true);
      const data = await auditoriaService.getAll();
      setAuditorias(data);
    } catch (error) {
      console.error('Erro ao carregar auditorias:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar auditorias. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAuditorias = () => {
    let filtered = [...auditorias];

    if (dataInicio) {
      filtered = filtered.filter(auditoria => auditoria.data_inicio >= dataInicio);
    }

    if (dataFim) {
      filtered = filtered.filter(auditoria => auditoria.data_fim <= dataFim);
    }

    if (unidadeSelecionada !== 'Todas') {
      filtered = filtered.filter(auditoria => auditoria.unidade_auditada === unidadeSelecionada);
    }

    setFilteredAuditorias(filtered);
  };

  const handleDownloadPDF = async (auditoria: Auditoria) => {
    if (!auditoria.formulario_pdf) {
      toast({
        title: 'Arquivo não disponível',
        description: 'Esta auditoria não possui formulário anexado.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (auditoria.formulario_pdf.startsWith('http')) {
        const response = await fetch(auditoria.formulario_pdf);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `auditoria_${auditoria.id}_formulario.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        
        toast({
          title: 'Download concluído',
          description: `Formulário da auditoria de ${auditoria.unidade_auditada} baixado com sucesso.`,
        });
      } else {
        toast({
          title: 'Erro no download',
          description: 'URL do arquivo inválida.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      toast({
        title: 'Erro no download',
        description: 'Erro ao baixar o arquivo. Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAuditoria = async (auditoria: Auditoria) => {
    try {
      setIsLoading(true);
      
      if (auditoria.formulario_pdf && auditoria.formulario_pdf.startsWith('http')) {
        await fileUploadService.deletePdf(auditoria.formulario_pdf);
      }
      
      const success = await auditoriaService.delete(auditoria.id);
      
      if (success) {
        setAuditorias(prev => prev.filter(a => a.id !== auditoria.id));
        
        toast({
          title: 'Sucesso',
          description: 'Auditoria excluída com sucesso.',
        });
      } else {
        throw new Error('Falha ao excluir auditoria');
      }
    } catch (error) {
      console.error('Erro ao excluir auditoria:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir auditoria. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setUnidadeSelecionada('Todas');
  };

  return {
    auditorias,
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
