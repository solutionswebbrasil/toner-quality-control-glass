
// Mock garantia service  
export const garantiaService = {
  getAll: async () => {
    return [
      {
        id: 1,
        item: 'Toner HP 12A',
        quantidade: 2,
        defeito: 'Não imprime',
        fornecedor_id: 1,
        fornecedor: 'HP Brasil',
        status: 'aberta',
        valor_unitario: 150,
        valor_total: 300,
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
  },
  getStats: async () => {
    return {
      monthlyData: {
        '2024-01': { quantidade: 5, valor: 1500 },
        '2024-02': { quantidade: 3, valor: 900 },
        '2024-03': { quantidade: 7, valor: 2100 }
      },
      currentMonthByFornecedor: {
        'HP Brasil': 3,
        'Canon Brasil': 2
      }
    };
  },
  getStatusConfiguracoes: async (tipo: string) => {
    return [
      { id: 1, status_nome: 'Aberta', cor: '#ff0000' },
      { id: 2, status_nome: 'Em Andamento', cor: '#ffff00' },
      { id: 3, status_nome: 'Finalizada', cor: '#00ff00' }
    ];
  },
  getResultadoConfiguracoes: async (tipo: string) => {
    return [
      { id: 1, resultado_nome: 'Aprovado' },
      { id: 2, resultado_nome: 'Reprovado' },
      { id: 3, resultado_nome: 'Cancelado' }
    ];
  },
  uploadFile: async (file: File) => {
    return 'mock-file-url';
  },
  deleteFile: async (url: string) => {
    return { success: true };
  }
};
