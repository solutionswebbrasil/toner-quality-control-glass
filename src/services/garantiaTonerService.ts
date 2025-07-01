
export interface GarantiaToner {
  id?: number;
  modelo: string;
  marca: string;
  status: string;
  data_cadastro: string;
}

// Mock garantia toner service
export const garantiaTonerService = {
  getAll: async () => {
    return [
      {
        id: 1,
        modelo: 'HP 12A',
        marca: 'HP',
        status: 'ativo',
        data_cadastro: '2024-01-01'
      }
    ];
  },
  create: async (data: any) => {
    return { id: Date.now(), ...data };
  },
  update: async (id: number, data: any) => {
    return { id, ...data };
  },
  updateStatus: async (id: number, status: string) => {
    return { id, status };
  },
  delete: async (id: number) => {
    return { success: true };
  },
  getStats: async () => {
    return {
      monthlyData: {
        '2024-01': { quantidade: 2 },
        '2024-02': { quantidade: 1 },
        '2024-03': { quantidade: 4 }
      },
      statusData: {
        'Ativo': 5,
        'Inativo': 2,
        'Pendente': 1
      },
      currentMonthByFornecedor: {
        'HP': 3,
        'Canon': 1
      }
    };
  }
};
