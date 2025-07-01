
export interface TituloItPop {
  id: number;
  titulo: string;
  data_cadastro: string;
}

export const tituloItPopService = {
  getAll: async (): Promise<TituloItPop[]> => {
    const data = localStorage.getItem('titulos_itpop');
    return data ? JSON.parse(data) : [
      { id: 1, titulo: 'POP 001 - Higienização de Equipamento', data_cadastro: '2024-01-01' }
    ];
  },
  create: async (data: Omit<TituloItPop, 'id' | 'data_cadastro'>): Promise<TituloItPop> => {
    const titulos = await tituloItPopService.getAll();
    const newTitulo = { 
      id: Date.now(), 
      ...data, 
      data_cadastro: new Date().toISOString().split('T')[0] 
    };
    titulos.push(newTitulo);
    localStorage.setItem('titulos_itpop', JSON.stringify(titulos));
    return newTitulo;
  },
  update: async (id: number, data: Partial<TituloItPop>): Promise<TituloItPop> => {
    const titulos = await tituloItPopService.getAll();
    const index = titulos.findIndex((t: TituloItPop) => t.id === id);
    if (index !== -1) {
      titulos[index] = { ...titulos[index], ...data };
      localStorage.setItem('titulos_itpop', JSON.stringify(titulos));
      return titulos[index];
    }
    throw new Error('Título não encontrado');
  },
  delete: async (id: number): Promise<void> => {
    const titulos = await tituloItPopService.getAll();
    const filtered = titulos.filter((t: TituloItPop) => t.id !== id);
    localStorage.setItem('titulos_itpop', JSON.stringify(filtered));
  }
};
