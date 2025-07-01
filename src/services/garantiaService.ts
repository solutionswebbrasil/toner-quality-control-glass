
export const garantiaService = {
  getAll: async () => {
    const data = localStorage.getItem('garantias');
    return data ? JSON.parse(data) : [
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
    const garantias = await garantiaService.getAll();
    const newGarantia = { id: Date.now(), ...data };
    garantias.push(newGarantia);
    localStorage.setItem('garantias', JSON.stringify(garantias));
    return newGarantia;
  },
  update: async (id: number, data: any) => {
    const garantias = await garantiaService.getAll();
    const index = garantias.findIndex((g: any) => g.id === id);
    if (index !== -1) {
      garantias[index] = { ...garantias[index], ...data };
      localStorage.setItem('garantias', JSON.stringify(garantias));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const garantias = await garantiaService.getAll();
    const filtered = garantias.filter((g: any) => g.id !== id);
    localStorage.setItem('garantias', JSON.stringify(filtered));
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
      fornecedorData: {},
      currentMonthByFornecedor: {}
    };
  },
  getStatusConfiguracoes: async () => {
    return ['Pendente', 'Em Análise', 'Aprovado', 'Rejeitado'];
  },
  getResultadoConfiguracoes: async () => {
    return ['Procedente', 'Improcedente', 'Parcialmente Procedente'];
  }
};
