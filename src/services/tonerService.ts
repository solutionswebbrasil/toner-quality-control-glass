
export const tonerService = {
  getAll: async () => {
    const data = localStorage.getItem('toners');
    return data ? JSON.parse(data) : [
      {
        id: 1,
        modelo: 'HP 12A',
        marca: 'HP',
        cor: 'Preto',
        compatibilidade: 'LaserJet 1010/1012/1015',
        data_cadastro: '2024-01-01',
        peso_cheio: 2.5,
        peso_vazio: 0.8,
        gramatura: 85.5,
        preco_produto: 150.00,
        capacidade_folhas: 2300,
        valor_por_folha: 0.02,
        impressoras_compat: 'LaserJet 1010/1012/1015',
        registrado_por: 1,
        data_registro: '2024-01-01',
        user_id: 'user1'
      }
    ];
  },
  create: async (data: any) => {
    const toners = await tonerService.getAll();
    const newToner = { id: Date.now(), ...data };
    toners.push(newToner);
    localStorage.setItem('toners', JSON.stringify(toners));
    return newToner;
  },
  update: async (id: number, data: any) => {
    const toners = await tonerService.getAll();
    const index = toners.findIndex((t: any) => t.id === id);
    if (index !== -1) {
      toners[index] = { ...toners[index], ...data };
      localStorage.setItem('toners', JSON.stringify(toners));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const toners = await tonerService.getAll();
    const filtered = toners.filter((t: any) => t.id !== id);
    localStorage.setItem('toners', JSON.stringify(filtered));
    return { success: true };
  }
};
