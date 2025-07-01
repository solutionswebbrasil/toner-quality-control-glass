
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

// Mock toner service
export const tonerService = {
  getAll: async () => {
    return [
      {
        id: 1,
        modelo: 'HP 12A',
        marca: 'HP',
        cor: 'Preto',
        compatibilidade: 'LaserJet 1010/1012/1015',
        data_cadastro: '2024-01-01',
        peso_cheio: 2.5,
        peso_vazio: 0.8,
        gramatura: 85.5,
        preco_produto: 150.00,
        capacidade_folhas: 2300,
        valor_por_folha: 0.02,
        impressoras_compat: 'LaserJet 1010/1012/1015',
        registrado_por: 1,
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
  }
};

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

// Mock filial service
export const filialService = {
  getAll: async () => {
    return [
      { id: 1, nome: 'São Paulo', endereco: 'Rua A, 123', telefone: '(11) 1234-5678' },
      { id: 2, nome: 'Rio de Janeiro', endereco: 'Rua B, 456', telefone: '(21) 8765-4321' }
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
