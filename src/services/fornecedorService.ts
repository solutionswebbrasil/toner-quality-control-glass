
import { Fornecedor } from '@/types';

export const fornecedorService = {
  getAll: async (): Promise<Fornecedor[]> => {
    const data = localStorage.getItem('fornecedores');
    return data ? JSON.parse(data) : [
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
  },
  
  create: async (data: Omit<Fornecedor, 'id'>): Promise<Fornecedor> => {
    const fornecedores = await fornecedorService.getAll();
    const newFornecedor = {
      id: Date.now(),
      ...data
    };
    fornecedores.push(newFornecedor);
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    return newFornecedor;
  },
  
  update: async (id: number, data: Partial<Fornecedor>): Promise<Fornecedor> => {
    const fornecedores = await fornecedorService.getAll();
    const index = fornecedores.findIndex(f => f.id === id);
    if (index !== -1) {
      fornecedores[index] = { ...fornecedores[index], ...data };
      localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
      return fornecedores[index];
    }
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
    const fornecedores = await fornecedorService.getAll();
    const filtered = fornecedores.filter(f => f.id !== id);
    localStorage.setItem('fornecedores', JSON.stringify(filtered));
    return { success: true, message: 'Fornecedor excluído com sucesso' };
  }
};
