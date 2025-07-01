
export const garantiaService = {
  getAll: async () => {
    return [
      {
        id: 1,
        item: 'Produto A',
        quantidade: 10,
        defeito: 'Defeito exemplo',
        fornecedor_id: 1,
        fornecedor: 'Fornecedor A',
        status: 'Pendente',
        valor_unitario: 100.00,
        valor_total: 1000.00,
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
  uploadFile: async (file: File) => {
    return { url: 'file-url' };
  },
  deleteFile: async (url: string) => {
    return { success: true };
  },
  getStats: async () => {
    return {
      monthlyData: {},
      statusData: {},
      fornecedorData: {}
    };
  },
  getStatusConfiguracoes: async () => {
    return ['Pendente', 'Em Análise', 'Aprovado', 'Rejeitado'];
  },
  getResultadoConfiguracoes: async () => {
    return ['Procedente', 'Improcedente', 'Parcialmente Procedente'];
  }
};
