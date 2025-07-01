
// Mock registro BPMN service
export const registroBpmnService = {
  getAll: async () => {
    return [
      { id: 1, titulo_id: 1, arquivo_bpmn: 'processo.bpmn', data_upload: '2024-01-01' }
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
