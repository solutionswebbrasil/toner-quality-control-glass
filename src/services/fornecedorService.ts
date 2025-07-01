
// Mock fornecedor service
export const fornecedorService = {
  getAll: async () => {
    return [
      { id: 1, nome: 'HP Brasil', telefone: '(11) 1234-5678', link_rma: 'https://hp.com/rma', data_cadastro: '2024-01-01' },
      { id: 2, nome: 'Canon Brasil', telefone: '(11) 8765-4321', link_rma: 'https://canon.com/rma', data_cadastro: '2024-01-02' }
    ];
  },
  create: async (data: any) => {
    return { id: Date.now(), ...data };
  },
  update: async (id: number, data: any) => {
    return { id, ...data };
  },
  delete: async (id: number) => {
    return { success: true };
  }
};
