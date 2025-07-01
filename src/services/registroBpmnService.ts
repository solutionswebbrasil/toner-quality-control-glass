
export interface RegistroBpmn {
  id: number;
  titulo_id: number;
  titulo: string;
  arquivo_bpmn: string;
  data_upload: string;
  versao: number;
  data_registro: string;
}

export const registroBpmnService = {
  getAll: async (): Promise<RegistroBpmn[]> => {
    const data = localStorage.getItem('registros_bpmn');
    return data ? JSON.parse(data) : [
      { 
        id: 1, 
        titulo_id: 1, 
        titulo: 'Processo de Vendas',
        arquivo_bpmn: 'processo.bpmn', 
        data_upload: '2024-01-01',
        versao: 1,
        data_registro: '2024-01-01'
      }
    ];
  },
  getByTituloId: async (tituloId: number): Promise<RegistroBpmn[]> => {
    const registros = await registroBpmnService.getAll();
    return registros.filter((r: RegistroBpmn) => r.titulo_id === tituloId);
  },
  create: async (data: Omit<RegistroBpmn, 'id' | 'versao' | 'data_registro'>): Promise<RegistroBpmn> => {
    const registros = await registroBpmnService.getAll();
    const existingVersions = registros.filter(r => r.titulo_id === data.titulo_id);
    const nextVersion = existingVersions.length > 0 
      ? Math.max(...existingVersions.map(r => r.versao)) + 1 
      : 1;

    const newRegistro = { 
      id: Date.now(), 
      versao: nextVersion,
      data_registro: new Date().toISOString(),
      ...data
    };
    registros.push(newRegistro);
    localStorage.setItem('registros_bpmn', JSON.stringify(registros));
    return newRegistro;
  },
  update: async (id: number, data: Partial<RegistroBpmn>): Promise<RegistroBpmn> => {
    const registros = await registroBpmnService.getAll();
    const index = registros.findIndex((r: RegistroBpmn) => r.id === id);
    if (index !== -1) {
      registros[index] = { ...registros[index], ...data };
      localStorage.setItem('registros_bpmn', JSON.stringify(registros));
      return registros[index];
    }
    throw new Error('Registro não encontrado');
  },
  delete: async (id: number): Promise<void> => {
    const registros = await registroBpmnService.getAll();
    const filtered = registros.filter((r: RegistroBpmn) => r.id !== id);
    localStorage.setItem('registros_bpmn', JSON.stringify(filtered));
  }
};
