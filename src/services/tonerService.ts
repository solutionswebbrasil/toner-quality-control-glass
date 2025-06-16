
import type { Toner } from '@/types';

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

let nextTonerId = 3;

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
