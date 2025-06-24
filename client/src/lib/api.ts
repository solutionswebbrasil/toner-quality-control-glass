
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

export const mockData = {
  toners: mockToners,
  retornados: [],
  garantias: [],
  auditorias: [],
  naoConformidades: [],
};
