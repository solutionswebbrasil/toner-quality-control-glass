
import { useState } from 'react';

// Mock filiais data
const mockFiliais = [
  { id: 1, nome: 'Filial São Paulo', endereco: 'Rua A, 123', telefone: '(11) 1234-5678' },
  { id: 2, nome: 'Filial Rio de Janeiro', endereco: 'Rua B, 456', telefone: '(21) 9876-5432' },
  { id: 3, nome: 'Filial Belo Horizonte', endereco: 'Rua C, 789', telefone: '(31) 5555-5555' }
];

export const useFiliais = () => {
  const [filiais] = useState(mockFiliais);
  const [loading] = useState(false);

  return {
    filiais,
    loading,
  };
};
