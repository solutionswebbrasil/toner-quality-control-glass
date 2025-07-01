
import { useState } from 'react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [retornados] = useState(mockRetornados);
  const [loading] = useState(false);

  const totalItems = retornados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedRetornados = retornados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    retornados: paginatedRetornados,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    loading,
    setCurrentPage,
  };
};
