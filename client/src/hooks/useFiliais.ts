
import { useState, useEffect } from 'react';
import { Filial } from '@/types/filial';
import { filialService } from '@/services/filialService';
import { useToast } from '@/hooks/use-toast';

export const useFiliais = () => {
  const { toast } = useToast();
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFiliais = async () => {
    setLoading(true);
    try {
      const data = await filialService.getAll();
      setFiliais(data);
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar filiais.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiliais();
  }, []);

  return {
    filiais,
    loading,
    loadFiliais
  };
};
