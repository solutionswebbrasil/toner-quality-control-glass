
export const tonerService = {
  getAll: async () => {
    const data = localStorage.getItem('toners');
    return data ? JSON.parse(data) : [
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
    const toners = await tonerService.getAll();
    const newToner = { id: Date.now(), ...data };
    toners.push(newToner);
    localStorage.setItem('toners', JSON.stringify(toners));
    return newToner;
  },
  update: async (id: number, data: any) => {
    const toners = await tonerService.getAll();
    const index = toners.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      toners[index] = { ...toners[index], ...data };
      localStorage.setItem('toners', JSON.stringify(toners));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const toners = await tonerService.getAll();
    const filtered = toners.filter((t: any) => t.id !== id);
    localStorage.setItem('toners', JSON.stringify(filtered));
    return { success: true };
  }
};

export const retornadoService = {
  getAll: async () => {
    const data = localStorage.getItem('retornados');
    return data ? JSON.parse(data) : [
      {
        id: 1,
        id_modelo: 1,
        id_cliente: 1,
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
    const retornados = await retornadoService.getAll();
    const newRetornado = { id: Date.now(), ...data };
    retornados.push(newRetornado);
    localStorage.setItem('retornados', JSON.stringify(retornados));
    return newRetornado;
  },
  update: async (id: number, data: any) => {
    const retornados = await retornadoService.getAll();
    const index = retornados.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      retornados[index] = { ...retornados[index], ...data };
      localStorage.setItem('retornados', JSON.stringify(retornados));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const retornados = await retornadoService.getAll();
    const filtered = retornados.filter((r: any) => r.id !== id);
    localStorage.setItem('retornados', JSON.stringify(filtered));
    return { success: true };
  },
  getAllForCharts: async () => {
    return await retornadoService.getAll();
  }
};

export const filialService = {
  getAll: async () => {
    const data = localStorage.getItem('filiais');
    return data ? JSON.parse(data) : [
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
  },
  create: async (data: any) => {
    const filiais = await filialService.getAll();
    const newFilial = { id: Date.now(), ...data };
    filiais.push(newFilial);
    localStorage.setItem('filiais', JSON.stringify(filiais));
    return newFilial;
  },
  update: async (id: number, data: any) => {
    const filiais = await filialService.getAll();
    const index = filiais.findIndex((f: any) => f.id === id);
    if (index !== -1) {
      filiais[index] = { ...filiais[index], ...data };
      localStorage.setItem('filiais', JSON.stringify(filiais));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const filiais = await filialService.getAll();
    const filtered = filiais.filter((f: any) => f.id !== id);
    localStorage.setItem('filiais', JSON.stringify(filtered));
    return { success: true };
  }
};

export const fornecedorService = {
  getAll: async () => {
    const data = localStorage.getItem('fornecedores');
    return data ? JSON.parse(data) : [
      {
        id: 1,
        nome: 'Fornecedor A',
        telefone: '(11) 1234-5678',
        link_rma: 'https://example.com/rma',
        data_cadastro: '2024-01-01',
        user_id: 'user1'
      }
    ];
  },
  create: async (data: any) => {
    const fornecedores = await fornecedorService.getAll();
    const newFornecedor = { id: Date.now(), ...data };
    fornecedores.push(newFornecedor);
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    return newFornecedor;
  },
  update: async (id: number, data: any) => {
    const fornecedores = await fornecedorService.getAll();
    const index = fornecedores.findIndex((f: any) => f.id === id);
    if (index !== -1) {
      fornecedores[index] = { ...fornecedores[index], ...data };
      localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const fornecedores = await fornecedorService.getAll();
    const filtered = fornecedores.filter((f: any) => f.id !== id);
    localStorage.setItem('fornecedores', JSON.stringify(filtered));
    return { success: true, message: 'Fornecedor deletado com sucesso' };
  }
};

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
