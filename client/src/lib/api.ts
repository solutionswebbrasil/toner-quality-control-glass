
import { Toner } from '@/types';

// Mock data for demonstration
const mockToners: Toner[] = [
  {
    id: 1,
    modelo: 'CF217A',
    cor: 'Preto',
    impressoras_compat: 'HP LaserJet Pro M102, M130',
    capacidade_folhas: 1600,
    valor_por_folha: 0.025,
    preco_produto: 89.90,
    gramatura: 80,
    peso_cheio: 0.650,
    peso_vazio: 0.450,
    registrado_por: 1,
    user_id: '1',
    data_registro: new Date().toISOString(),
  },
];

// Mock Ishikawa API
interface IshikawaAnalise {
  id: number;
  nome: string;
  problema: string;
  criado_por: string;
  data_criacao: string;
}

interface IshikawaCategoria {
  id: number;
  analise_id: number;
  nome: string;
  causas: string[];
}

let mockAnalises: IshikawaAnalise[] = [];
let mockCategorias: IshikawaCategoria[] = [];
let nextId = 1;

export const ishikawaApi = {
  async getAnalises(): Promise<IshikawaAnalise[]> {
    return Promise.resolve(mockAnalises);
  },

  async getCategorias(analiseId: number): Promise<IshikawaCategoria[]> {
    return Promise.resolve(mockCategorias.filter(cat => cat.analise_id === analiseId));
  },

  async createAnalise(data: Omit<IshikawaAnalise, 'id' | 'data_criacao'>): Promise<IshikawaAnalise> {
    const newAnalise: IshikawaAnalise = {
      ...data,
      id: nextId++,
      data_criacao: new Date().toISOString(),
    };
    mockAnalises.push(newAnalise);
    return Promise.resolve(newAnalise);
  },

  async createCategoria(data: Omit<IshikawaCategoria, 'id'>): Promise<IshikawaCategoria> {
    const newCategoria: IshikawaCategoria = {
      ...data,
      id: nextId++,
    };
    mockCategorias.push(newCategoria);
    return Promise.resolve(newCategoria);
  },
};

// Mock Pareto API
interface ParetoAnalise {
  id: number;
  nome: string;
  descricao: string;
  criado_por: string;
  data_criacao: string;
}

interface ParetoItem {
  id: number;
  analise_id: number;
  categoria: string;
  quantidade: number;
  custo: number;
  percentual: number;
  acumulado: number;
}

let mockParetoAnalises: ParetoAnalise[] = [];
let mockParetoItems: ParetoItem[] = [];
let paretoNextId = 1;

export const paretoApi = {
  async getAnalises(): Promise<ParetoAnalise[]> {
    return Promise.resolve(mockParetoAnalises);
  },

  async getItems(analiseId: number): Promise<ParetoItem[]> {
    return Promise.resolve(mockParetoItems.filter(item => item.analise_id === analiseId));
  },

  async createAnalise(data: Omit<ParetoAnalise, 'id' | 'data_criacao'>): Promise<ParetoAnalise> {
    const newAnalise: ParetoAnalise = {
      ...data,
      id: paretoNextId++,
      data_criacao: new Date().toISOString(),
    };
    mockParetoAnalises.push(newAnalise);
    return Promise.resolve(newAnalise);
  },

  async createItem(data: Omit<ParetoItem, 'id'>): Promise<ParetoItem> {
    const newItem: ParetoItem = {
      ...data,
      id: paretoNextId++,
    };
    mockParetoItems.push(newItem);
    return Promise.resolve(newItem);
  },
};

// Mock APIs for charts
export const garantiasApi = {
  async getStats() {
    return {
      monthlyData: {},
      statusData: {},
      totalValue: 0
    };
  }
};

export const naoConformidadesApi = {
  async getStats() {
    return {
      monthlyData: {},
      statusData: {},
      total: 0
    };
  }
};

export const retornadosApi = {
  async getStats() {
    return {
      monthlyData: {},
      filialData: {},
      total: 0
    };
  }
};

// Mock Auth API
export const authApi = {
  async getCurrentUser() {
    return null;
  },
  async login(email: string, password: string) {
    return { user: null, error: null };
  },
  async logout() {
    return { error: null };
  }
};

export const mockData = {
  toners: mockToners,
  retornados: [],
  garantias: [],
  auditorias: [],
  naoConformidades: [],
};
