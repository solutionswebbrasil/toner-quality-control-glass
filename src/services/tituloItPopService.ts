
export const tituloItPopService = {
  getAll: async () => {
    const data = localStorage.getItem('titulos_itpop');
    return data ? JSON.parse(data) : [
      { id: 1, titulo: 'Manual de TI', descricao: 'Procedimentos de TI', data_cadastro: '2024-01-01' }
    ];
  },
  create: async (data: any) => {
    const titulos = await tituloItPopService.getAll();
    const newTitulo = { id: Date.now(), ...data };
    titulos.push(newTitulo);
    localStorage.setItem('titulos_itpop', JSON.stringify(titulos));
    return newTitulo;
  },
  update: async (id: number, data: any) => {
    const titulos = await tituloItPopService.getAll();
    const index = titulos.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      titulos[index] = { ...titulos[index], ...data };
      localStorage.setItem('titulos_itpop', JSON.stringify(titulos));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const titulos = await tituloItPopService.getAll();
    const filtered = titulos.filter((t: any) => t.id !== id);
    localStorage.setItem('titulos_itpop', JSON.stringify(filtered));
    return { success: true };
  }
};
