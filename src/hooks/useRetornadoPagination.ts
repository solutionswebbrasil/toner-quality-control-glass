
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockRetornados = [
  {
    id: 1,
    codigo_produto: 'HP001',
    descricao: 'Toner HP LaserJet',
    quantidade: 2,
    data_retorno: '2024-01-15',
    motivo: 'Defeito de fabricação'
  }
];

export const useRetornadoPagination = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [retornados] = useState(mockRetornados);
  const [loading] = useState(false);

  const totalItems = retornados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const totalCount = totalItems;

  const paginatedRetornados = retornados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const loadAllRetornados = async () => {
    // Mock function for loading all data
    console.log('Loading all retornados...');
  };

  const handleDeleteRetornado = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Retornado excluído com sucesso!",
    });
  };

  return {
    retornados: paginatedRetornados,
    allRetornados: retornados,
    currentPage,
    totalPages,
    totalItems,
    totalCount,
    itemsPerPage,
    loading,
    setCurrentPage,
    loadAllRetornados,
    handleDeleteRetornado,
  };
};
