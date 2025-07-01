
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
  }
};

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
  create: async (data: any) => {
    return { id: Date.now(), ...data };
  },
  update: async (id: number, data: any) => {
    return { id, ...data };
  },
  delete: async (id: number) => {
    return { success: true };
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
  }
};

export const filialService = {
  getAll: async () => {
    return [
      {
        id: 1,
        nome: 'São Paulo',
        endereco: 'Rua A, 123',
        telefone: '(11) 1234-5678',
        data_cadastro: '2024-01-01',
        ativo: true
      },
      {
        id: 2,
        nome: 'Rio de Janeiro',
        endereco: 'Rua B, 456',
        telefone: '(21) 9876-5432',
        data_cadastro: '2024-01-01',
        ativo: true
      }
    ];
  }
};

export const fornecedorService = {
  getAll: async () => {
    return [
      {
        id: 1,
        nome: 'Fornecedor A',
        endereco: 'Rua A, 123',
        telefone: '(11) 1234-5678',
        data_cadastro: '2024-01-01',
        ativo: true
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
    return { success: true, message: 'Fornecedor deletado com sucesso' };
  }
};

export const garantiaService = {
  getAll: async () => {
    return [
      {
        id: 1,
        item: 'Produto A',
        quantidade: 10,
        defeito: 'Defeito exemplo',
        fornecedor_id: 1,
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
  }
};
