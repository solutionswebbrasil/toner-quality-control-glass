
import { Fornecedor } from '@/types';

const mockFornecedores: Fornecedor[] = [
  {
    id: 1,
    nome: 'HP Brasil',
    telefone: '(11) 1234-5678',
    link_rma: 'https://hp.com/rma',
    data_cadastro: '2024-01-01',
    user_id: 'user1'
  },
  {
    id: 2,
    nome: 'Canon Brasil',
    telefone: '(11) 9876-5432',
    link_rma: 'https://canon.com/rma',
    data_cadastro: '2024-01-02',
    user_id: 'user1'
  }
];

export const fornecedorService = {
  getAll: async (): Promise<Fornecedor[]> => {
    return mockFornecedores;
  },
  
  create: async (data: Omit<Fornecedor, 'id'>): Promise<Fornecedor> => {
    const newFornecedor = {
      id: Date.now(),
      ...data
    };
    return newFornecedor;
  },
  
  update: async (id: number, data: Partial<Fornecedor>): Promise<Fornecedor> => {
    return {
      id,
      nome: 'Updated Nome',
      telefone: '(11) 0000-0000',
      link_rma: 'https://updated.com',
      data_cadastro: '2024-01-01',
      user_id: 'user1',
      ...data
    };
  },
  
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    return { success: true, message: 'Fornecedor excluído com sucesso' };
  }
};
