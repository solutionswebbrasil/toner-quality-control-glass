
import { useState, useEffect } from 'react';
import { Certificado } from '@/types/certificado';
import { certificadoService } from '@/services/certificadoService';
import { useToast } from '@/hooks/use-toast';

export const useCertificados = () => {
  const { toast } = useToast();
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCertificados = async () => {
    setLoading(true);
    try {
      const data = await certificadoService.getAll();
      setCertificados(data);
    } catch (error) {
      console.error('Erro ao carregar certificados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar certificados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificado = async (id: number) => {
    try {
      await certificadoService.delete(id);
      toast({
        title: "Sucesso",
        description: "Certificado excluído com sucesso!",
      });
      await loadCertificados();
    } catch (error) {
      console.error('Erro ao excluir certificado:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir certificado.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadCertificados();
  }, []);

  return {
    certificados,
    loading,
    loadCertificados,
    deleteCertificado
  };
};
