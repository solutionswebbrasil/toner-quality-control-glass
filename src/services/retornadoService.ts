
export const retornadoService = {
  getAll: async () => {
    const data = localStorage.getItem('retornados');
    return data ? JSON.parse(data) : [
      {
        id: 1,
        id_modelo: 1,
        id_cliente: 'CLI001',
        peso: 2.5,
        destino_final: 'Reciclagem',
        valor_recuperado: 25.00,
        data_registro: '2024-01-01',
        filial: 'São Paulo',
        user_id: 'user1'
      }
    ];
  },
  getAllForCharts: async () => {
    return await retornadoService.getAll();
  },
  create: async (data: any) => {
    const retornados = await retornadoService.getAll();
    const newRetornado = { id: Date.now(), ...data };
    retornados.push(newRetornado);
    localStorage.setItem('retornados', JSON.stringify(retornados));
    return newRetornado;
  },
  update: async (id: number, data: any) => {
    const retornados = await retornadoService.getAll();
    const index = retornados.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      retornados[index] = { ...retornados[index], ...data };
      localStorage.setItem('retornados', JSON.stringify(retornados));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const retornados = await retornadoService.getAll();
    const filtered = retornados.filter((r: any) => r.id !== id);
    localStorage.setItem('retornados', JSON.stringify(filtered));
    return { success: true };
  }
};
