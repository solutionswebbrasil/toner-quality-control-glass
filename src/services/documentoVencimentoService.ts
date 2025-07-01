
export interface DocumentoVencimento {
  id: number;
  nome_documento: string;
  arquivo_pdf: string;
  data_vencimento: string;
  receber_lembrete: boolean;
  dias_antes_lembrete?: number;
  data_cadastro: string;
}

export const documentoVencimentoService = {
  getAll: async (): Promise<DocumentoVencimento[]> => {
    const data = localStorage.getItem('documentos_vencimento');
    return data ? JSON.parse(data) : [];
  },
  
  create: async (data: Omit<DocumentoVencimento, 'id' | 'data_cadastro'>): Promise<DocumentoVencimento> => {
    const documentos = await documentoVencimentoService.getAll();
    const newDocumento = { 
      id: Date.now(), 
      ...data,
      data_cadastro: new Date().toISOString()
    };
    documentos.push(newDocumento);
    localStorage.setItem('documentos_vencimento', JSON.stringify(documentos));
    return newDocumento;
  },
  
  update: async (id: number, data: Partial<DocumentoVencimento>): Promise<DocumentoVencimento> => {
    const documentos = await documentoVencimentoService.getAll();
    const index = documentos.findIndex((d: DocumentoVencimento) => d.id === id);
    if (index !== -1) {
      documentos[index] = { ...documentos[index], ...data };
      localStorage.setItem('documentos_vencimento', JSON.stringify(documentos));
      return documentos[index];
    }
    throw new Error('Documento não encontrado');
  },
  
  delete: async (id: number): Promise<void> => {
    const documentos = await documentoVencimentoService.getAll();
    const filtered = documentos.filter((d: DocumentoVencimento) => d.id !== id);
    localStorage.setItem('documentos_vencimento', JSON.stringify(filtered));
  },
  
  getVencendoEm: async (dias: number): Promise<DocumentoVencimento[]> => {
    const documentos = await documentoVencimentoService.getAll();
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() + dias);
    
    return documentos.filter(doc => {
      const dataVencimento = new Date(doc.data_vencimento);
      return dataVencimento <= dataLimite && dataVencimento >= hoje;
    });
  }
};
