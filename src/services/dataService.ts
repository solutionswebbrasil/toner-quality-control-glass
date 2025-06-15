
import { Toner, Retornado } from '@/types';

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

let nextTonerId = 3;
let nextRetornadoId = 3;

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
