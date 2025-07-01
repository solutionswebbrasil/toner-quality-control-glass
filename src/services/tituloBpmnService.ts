
export interface TituloBpmn {
  id: number;
  titulo: string;
  descricao: string;
  data_cadastro: string;
}

export const tituloBpmnService = {
  getAll: async (): Promise<TituloBpmn[]> => {
    const data = localStorage.getItem('titulos_bpmn');
    return data ? JSON.parse(data) : [
      { id: 1, titulo: 'Processo de Vendas', descricao: 'Fluxo de vendas', data_cadastro: '2024-01-01' }
    ];
  },
  create: async (data: Omit<TituloBpmn, 'id' | 'data_cadastro'>): Promise<TituloBpmn> => {
    const titulos = await tituloBpmnService.getAll();
    const newTitulo = { 
      id: Date.now(), 
      ...data, 
      data_cadastro: new Date().toISOString().split('T')[0] 
    };
    titulos.push(newTitulo);
    localStorage.setItem('titulos_bpmn', JSON.stringify(titulos));
    return newTitulo;
  },
  update: async (id: number, data: Partial<TituloBpmn>): Promise<TituloBpmn> => {
    const titulos = await tituloBpmnService.getAll();
    const index = titulos.findIndex((t: TituloBpmn) => t.id === id);
    if (index !== -1) {
      titulos[index] = { ...titulos[index], ...data };
      localStorage.setItem('titulos_bpmn', JSON.stringify(titulos));
      return titulos[index];
    }
    throw new Error('Título não encontrado');
  },
  delete: async (id: number): Promise<void> => {
    const titulos = await tituloBpmnService.getAll();
    const filtered = titulos.filter((t: TituloBpmn) => t.id !== id);
    localStorage.setItem('titulos_bpmn', JSON.stringify(filtered));
  }
};
