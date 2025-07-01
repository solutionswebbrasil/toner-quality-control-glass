
import { useToast } from '@/hooks/use-toast';

// Mock fornecedor service
export const fornecedorService = {
  getAll: async () => {
    return [
      { id: 1, nome: 'HP Brasil', telefone: '(11) 1234-5678', link_rma: 'https://hp.com/rma', data_cadastro: '2024-01-01' },
      { id: 2, nome: 'Canon Brasil', telefone: '(11) 8765-4321', link_rma: 'https://canon.com/rma', data_cadastro: '2024-01-02' }
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
        status: 'aberta',
        valor_unitario: 150,
        data_registro: '2024-01-01'
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
