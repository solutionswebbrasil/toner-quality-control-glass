
// Mock titulo BPMN service
export const tituloBpmnService = {
  getAll: async () => {
    return [
      { id: 1, titulo: 'Processo de Vendas', descricao: 'Fluxo de vendas', data_cadastro: '2024-01-01' }
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
