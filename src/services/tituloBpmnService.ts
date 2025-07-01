
export const tituloBpmnService = {
  getAll: async () => {
    const data = localStorage.getItem('titulos_bpmn');
    return data ? JSON.parse(data) : [
      { id: 1, titulo: 'Processo de Vendas', descricao: 'Fluxo de vendas', data_cadastro: '2024-01-01' }
    ];
  },
  create: async (data: any) => {
    const titulos = await tituloBpmnService.getAll();
    const newTitulo = { id: Date.now(), ...data };
    titulos.push(newTitulo);
    localStorage.setItem('titulos_bpmn', JSON.stringify(titulos));
    return newTitulo;
  },
  update: async (id: number, data: any) => {
    const titulos = await tituloBpmnService.getAll();
    const index = titulos.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      titulos[index] = { ...titulos[index], ...data };
      localStorage.setItem('titulos_bpmn', JSON.stringify(titulos));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const titulos = await tituloBpmnService.getAll();
    const filtered = titulos.filter((t: any) => t.id !== id);
    localStorage.setItem('titulos_bpmn', JSON.stringify(filtered));
    return { success: true };
  }
};
