
export const registroBpmnService = {
  getAll: async () => {
    const data = localStorage.getItem('registros_bpmn');
    return data ? JSON.parse(data) : [
      { 
        id: 1, 
        titulo_id: 1, 
        arquivo_bpmn: 'processo.bpmn', 
        data_upload: '2024-01-01',
        versao: 1,
        data_registro: '2024-01-01'
      }
    ];
  },
  getByTituloId: async (tituloId: number) => {
    const registros = await registroBpmnService.getAll();
    return registros.filter((r: any) => r.titulo_id === tituloId);
  },
  create: async (data: any) => {
    const registros = await registroBpmnService.getAll();
    const newRegistro = { id: Date.now(), versao: 1, data_registro: new Date().toISOString(), ...data };
    registros.push(newRegistro);
    localStorage.setItem('registros_bpmn', JSON.stringify(registros));
    return newRegistro;
  },
  update: async (id: number, data: any) => {
    const registros = await registroBpmnService.getAll();
    const index = registros.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      registros[index] = { ...registros[index], ...data };
      localStorage.setItem('registros_bpmn', JSON.stringify(registros));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const registros = await registroBpmnService.getAll();
    const filtered = registros.filter((r: any) => r.id !== id);
    localStorage.setItem('registros_bpmn', JSON.stringify(filtered));
    return { success: true };
  }
};
