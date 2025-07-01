
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock certificate data
const mockCertificados = [
  {
    id: 1,
    nome_certificado: 'ISO 9001:2015',
    data_emissao: '2024-01-15',
    arquivo_pdf: 'iso9001.pdf',
    data_registro: '2024-01-16T10:30:00Z'
  },
  {
    id: 2,
    nome_certificado: 'ISO 14001:2015',
    data_emissao: '2024-02-10',
    arquivo_pdf: 'iso14001.pdf',
    data_registro: '2024-02-11T14:20:00Z'
  }
];

export const useCertificados = () => {
  const { toast } = useToast();
  const [certificados, setCertificados] = useState(mockCertificados);
  const [loading, setLoading] = useState(false);

  const deleteCertificado = (id: number) => {
    setCertificados(prev => prev.filter(cert => cert.id !== id));
    toast({
      title: "Sucesso",
      description: "Certificado excluído com sucesso!",
    });
  };

  return {
    certificados,
    loading,
    deleteCertificado,
  };
};
