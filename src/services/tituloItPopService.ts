
// Mock titulo IT POP service
export const tituloItPopService = {
  getAll: async () => {
    return [
      { id: 1, titulo: 'Manual de TI', descricao: 'Procedimentos de TI', data_cadastro: '2024-01-01' }
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
