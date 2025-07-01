
// Mock registro IT POP service
export const registroItPopService = {
  getAll: async () => {
    return [
      { id: 1, titulo_id: 1, arquivo_pdf: 'manual.pdf', data_upload: '2024-01-01' }
    ];
  },
  getByTituloId: async (tituloId: number) => {
    return [
      { id: 1, titulo_id: tituloId, arquivo_pdf: 'manual.pdf', data_upload: '2024-01-01' }
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
