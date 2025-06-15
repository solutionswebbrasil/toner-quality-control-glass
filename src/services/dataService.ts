import { Toner, Retornado, Fornecedor, Garantia } from '@/types';

// Mock data storage
let toners: Toner[] = [
  {
    id: 1,
    modelo: "HP 85A",
    peso_cheio: 850.5,
    peso_vazio: 120.0,
    gramatura: 730.5,
    preco_produto: 89.90,
    capacidade_folhas: 1600,
    valor_por_folha: 0.056,
    impressoras_compat: "HP LaserJet P1102, P1102w, M1130, M1132, M1134, M1136, M1137, M1138, M1210, M1212nf, M1213nf, M1214nfh, M1216nfh, M1217nfw",
    cor: "Preto",
    registrado_por: 1,
    data_registro: new Date('2024-01-15')
  },
  {
    id: 2,
    modelo: "Canon 725",
    peso_cheio: 780.0,
    peso_vazio: 110.0,
    gramatura: 670.0,
    preco_produto: 95.50,
    capacidade_folhas: 1600,
    valor_por_folha: 0.060,
    impressoras_compat: "Canon LBP6000, LBP6020, LBP6030, MF3010",
    cor: "Preto",
    registrado_por: 1,
    data_registro: new Date('2024-01-10')
  }
];

let retornados: Retornado[] = [
  {
    id: 1,
    id_modelo: 1,
    id_cliente: 101,
    peso: 125.5,
    destino_final: 'Estoque',
    filial: 'Matriz',
    data_registro: new Date('2024-02-01'),
    valor_recuperado: 25.50,
    modelo: 'HP 85A'
  },
  {
    id: 2,
    id_modelo: 2,
    id_cliente: 102,
    peso: 115.0,
    destino_final: 'Descarte',
    filial: 'Filial 1',
    data_registro: new Date('2024-02-03'),
    modelo: 'Canon 725'
  }
];

let fornecedores: Fornecedor[] = [
  {
    id: 1,
    nome: "HP Brasil",
    telefone: "(11) 3456-7890",
    link_rma: "https://support.hp.com/br-pt/rma",
    data_cadastro: new Date('2024-01-10')
  },
  {
    id: 2,
    nome: "Canon Brasil",
    telefone: "(11) 2345-6789",
    link_rma: "https://canon.com.br/suporte/rma",
    data_cadastro: new Date('2024-01-12')
  }
];

let garantias: Garantia[] = [
  {
    id: 1,
    item: "Impressora HP LaserJet P1102",
    quantidade: 2,
    defeito: "Não está imprimindo, display com erro",
    fornecedor_id: 1,
    fornecedor: "HP Brasil",
    status: 'em_analise',
    resultado: '',
    valor_unitario: 450.00,
    valor_total: 900.00,
    data_registro: new Date('2024-02-01')
  },
  {
    id: 2,
    item: "Scanner Canon LiDE 300",
    quantidade: 1,
    defeito: "Não reconhece documentos, luz não acende",
    fornecedor_id: 2,
    fornecedor: "Canon Brasil",
    status: 'concluida',
    resultado: 'trocado',
    valor_unitario: 180.00,
    valor_total: 180.00,
    data_registro: new Date('2024-01-28')
  }
];

let nextTonerId = 3;
let nextRetornadoId = 3;
let nextFornecedorId = 3;
let nextGarantiaId = 3;

// Toner services
export const tonerService = {
  getAll: (): Promise<Toner[]> => {
    return Promise.resolve([...toners]);
  },

  getById: (id: number): Promise<Toner | undefined> => {
    return Promise.resolve(toners.find(t => t.id === id));
  },

  create: (toner: Omit<Toner, 'id'>): Promise<Toner> => {
    const newToner: Toner = {
      ...toner,
      id: nextTonerId++,
      data_registro: new Date()
    };
    toners.push(newToner);
    return Promise.resolve(newToner);
  },

  update: (id: number, toner: Partial<Toner>): Promise<Toner | null> => {
    const index = toners.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(null);
    
    toners[index] = { ...toners[index], ...toner };
    return Promise.resolve(toners[index]);
  },

  delete: (id: number): Promise<boolean> => {
    const index = toners.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(false);
    
    toners.splice(index, 1);
    return Promise.resolve(true);
  }
};

// Retornado services
export const retornadoService = {
  getAll: (): Promise<Retornado[]> => {
    return Promise.resolve([...retornados]);
  },

  create: (retornado: Omit<Retornado, 'id'>): Promise<Retornado> => {
    const toner = toners.find(t => t.id === retornado.id_modelo);
    const newRetornado: Retornado = {
      ...retornado,
      id: nextRetornadoId++,
      data_registro: new Date(),
      modelo: toner?.modelo || 'N/A'
    };
    retornados.push(newRetornado);
    return Promise.resolve(newRetornado);
  },

  bulkCreate: (retornadosList: Omit<Retornado, 'id'>[]): Promise<Retornado[]> => {
    const newRetornados = retornadosList.map(retornado => {
      const toner = toners.find(t => t.modelo === retornado.modelo);
      return {
        ...retornado,
        id: nextRetornadoId++,
        id_modelo: toner?.id || 0,
        data_registro: new Date(),
        modelo: toner?.modelo || 'N/A'
      };
    });
    retornados.push(...newRetornados);
    return Promise.resolve(newRetornados);
  },

  delete: (id: number): Promise<boolean> => {
    const index = retornados.findIndex(r => r.id === id);
    if (index === -1) return Promise.resolve(false);
    
    retornados.splice(index, 1);
    return Promise.resolve(true);
  },

  getStats: () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthData = retornados.filter(r => {
      const date = new Date(r.data_registro);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const previousMonthData = retornados.filter(r => {
      const date = new Date(r.data_registro);
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    });

    return Promise.resolve({
      currentMonth: currentMonthData,
      previousMonth: previousMonthData,
      byDestination: retornados.reduce((acc, r) => {
        acc[r.destino_final] = (acc[r.destino_final] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byModel: retornados.reduce((acc, r) => {
        const model = r.modelo || 'N/A';
        acc[model] = (acc[model] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    });
  }
};

// Fornecedor services
export const fornecedorService = {
  getAll: (): Promise<Fornecedor[]> => {
    return Promise.resolve([...fornecedores]);
  },

  getById: (id: number): Promise<Fornecedor | undefined> => {
    return Promise.resolve(fornecedores.find(f => f.id === id));
  },

  create: (fornecedor: Omit<Fornecedor, 'id'>): Promise<Fornecedor> => {
    const newFornecedor: Fornecedor = {
      ...fornecedor,
      id: nextFornecedorId++,
      data_cadastro: new Date()
    };
    fornecedores.push(newFornecedor);
    return Promise.resolve(newFornecedor);
  },

  update: (id: number, fornecedor: Partial<Fornecedor>): Promise<Fornecedor | null> => {
    const index = fornecedores.findIndex(f => f.id === id);
    if (index === -1) return Promise.resolve(null);
    
    fornecedores[index] = { ...fornecedores[index], ...fornecedor };
    return Promise.resolve(fornecedores[index]);
  },

  delete: (id: number): Promise<boolean> => {
    const index = fornecedores.findIndex(f => f.id === id);
    if (index === -1) return Promise.resolve(false);
    
    fornecedores.splice(index, 1);
    return Promise.resolve(true);
  }
};

// Garantia services
export const garantiaService = {
  getAll: (): Promise<Garantia[]> => {
    return Promise.resolve([...garantias]);
  },

  getById: (id: number): Promise<Garantia | undefined> => {
    return Promise.resolve(garantias.find(g => g.id === id));
  },

  create: (garantia: Omit<Garantia, 'id'>): Promise<Garantia> => {
    const fornecedor = fornecedores.find(f => f.id === garantia.fornecedor_id);
    const valor_total = garantia.quantidade * garantia.valor_unitario;
    
    const newGarantia: Garantia = {
      ...garantia,
      id: nextGarantiaId++,
      valor_total,
      data_registro: new Date(),
      fornecedor: fornecedor?.nome || 'N/A'
    };
    garantias.push(newGarantia);
    return Promise.resolve(newGarantia);
  },

  update: (id: number, garantia: Partial<Garantia>): Promise<Garantia | null> => {
    const index = garantias.findIndex(g => g.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedGarantia = { ...garantias[index], ...garantia };
    
    // Recalcular valor total se quantidade ou valor unitário mudaram
    if (garantia.quantidade !== undefined || garantia.valor_unitario !== undefined) {
      updatedGarantia.valor_total = updatedGarantia.quantidade * updatedGarantia.valor_unitario;
    }
    
    // Atualizar nome do fornecedor se fornecedor_id mudou
    if (garantia.fornecedor_id !== undefined) {
      const fornecedor = fornecedores.find(f => f.id === garantia.fornecedor_id);
      updatedGarantia.fornecedor = fornecedor?.nome || 'N/A';
    }
    
    garantias[index] = updatedGarantia;
    return Promise.resolve(garantias[index]);
  },

  delete: (id: number): Promise<boolean> => {
    const index = garantias.findIndex(g => g.id === id);
    if (index === -1) return Promise.resolve(false);
    
    garantias.splice(index, 1);
    return Promise.resolve(true);
  },

  getStats: () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Dados por mês para gráficos
    const monthlyData = garantias.reduce((acc, g) => {
      const date = new Date(g.data_registro);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { quantidade: 0, valor: 0 };
      }
      
      acc[monthKey].quantidade += g.quantidade;
      acc[monthKey].valor += g.valor_total;
      
      return acc;
    }, {} as Record<string, { quantidade: number; valor: number }>);

    // Dados por fornecedor no mês atual
    const currentMonthByFornecedor = garantias
      .filter(g => {
        const date = new Date(g.data_registro);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((acc, g) => {
        const fornecedor = g.fornecedor || 'N/A';
        acc[fornecedor] = (acc[fornecedor] || 0) + g.quantidade;
        return acc;
      }, {} as Record<string, number>);

    return Promise.resolve({
      monthlyData,
      currentMonthByFornecedor
    });
  }
};
