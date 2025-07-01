
// Mock retornado service
export const retornadoService = {
  getAll: async () => {
    return [
      {
        id: 1,
        id_modelo: 1,
        id_cliente: 'CLI001',
        peso: 2.5,
        destino_final: 'Reciclagem',
        valor_recuperado: 25.00,
        data_registro: '2024-01-01',
        filial: 'São Paulo',
        user_id: 'user1'
      }
    ];
  },
  getAllForCharts: async () => {
    return [
      {
        id: 1,
        id_modelo: 1,
        id_cliente: 'CLI001',
        peso: 2.5,
        destino_final: 'Reciclagem',
        valor_recuperado: 25.00,
        data_registro: '2024-01-01',
        filial: 'São Paulo',
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
