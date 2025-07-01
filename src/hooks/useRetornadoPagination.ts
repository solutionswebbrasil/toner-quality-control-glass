
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data with complete Retornado structure
const mockRetornados = [
  {
    id: 1,
    id_modelo: 1,
    id_cliente: 'CLI001',
    peso: 2.5,
    destino_final: 'Reciclagem',
    valor_recuperado: 25.00,
    data_registro: '2024-01-15',
    filial: 'São Paulo'
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
