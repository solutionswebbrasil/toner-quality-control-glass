
// Mock toner service
export const tonerService = {
  getAll: async () => {
    return [
      {
        id: 1,
        modelo: 'HP 12A',
        marca: 'HP',
        cor: 'Preto',
        compatibilidade: 'LaserJet 1010/1012/1015',
        data_cadastro: '2024-01-01',
        peso_cheio: 2.5,
        peso_vazio: 0.8,
        gramatura: 85.5,
        preco_produto: 150.00,
        capacidade_folhas: 2300,
        valor_por_folha: 0.02,
        impressoras_compat: 'LaserJet 1010/1012/1015',
        registrado_por: 1,
        data_registro: '2024-01-01',
        user_id: 'user1'
      }
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
