
import type { Retornado } from '@/types';
import { tonerService } from './tonerService';

// Mock data storage
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

let nextRetornadoId = 3;

export const retornadoService = {
  getAll: (): Promise<Retornado[]> => {
    return Promise.resolve([...retornados]);
  },

  create: async (retornado: Omit<Retornado, 'id'>): Promise<Retornado> => {
    const toners = await tonerService.getAll();
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

  update: async (id: number, retornado: Partial<Retornado>): Promise<Retornado | null> => {
    const index = retornados.findIndex(r => r.id === id);
    if (index === -1) return Promise.resolve(null);
    
    retornados[index] = { ...retornados[index], ...retornado };
    
    // Update modelo if id_modelo changed
    if (retornado.id_modelo !== undefined) {
      const toners = await tonerService.getAll();
      const toner = toners.find(t => t.id === retornado.id_modelo);
      retornados[index].modelo = toner?.modelo || 'N/A';
    }
    
    return Promise.resolve(retornados[index]);
  },

  bulkCreate: async (retornadosList: Omit<Retornado, 'id'>[]): Promise<Retornado[]> => {
    const toners = await tonerService.getAll();
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
