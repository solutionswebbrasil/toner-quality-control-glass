
export interface RegistroItPop {
  id: number;
  titulo_id: number;
  titulo: string;
  arquivo_pdf: string;
  setor_responsavel: string;
  permissao_visualizacao: 'qualquer_pessoa' | 'apenas_setor';
  versao: number;
  data_upload: string;
  data_registro: string;
}

export const registroItPopService = {
  getAll: async (): Promise<RegistroItPop[]> => {
    const data = localStorage.getItem('registros_itpop');
    return data ? JSON.parse(data) : [];
  },
  
  getByTituloId: async (tituloId: number): Promise<RegistroItPop[]> => {
    const registros = await registroItPopService.getAll();
    return registros.filter((r: RegistroItPop) => r.titulo_id === tituloId);
  },
  
  getLatestVersion: async (tituloId: number): Promise<RegistroItPop | null> => {
    const registros = await registroItPopService.getByTituloId(tituloId);
    if (registros.length === 0) return null;
    return registros.reduce((latest, current) => 
      current.versao > latest.versao ? current : latest
    );
  },
  
  create: async (data: Omit<RegistroItPop, 'id' | 'versao' | 'data_registro'>): Promise<RegistroItPop> => {
    const registros = await registroItPopService.getAll();
    const existingVersions = registros.filter(r => r.titulo_id === data.titulo_id);
    const nextVersion = existingVersions.length > 0 
      ? Math.max(...existingVersions.map(r => r.versao)) + 1 
      : 1;
    
    const newRegistro = { 
      id: Date.now(), 
      ...data,
      versao: nextVersion,
      data_registro: new Date().toISOString()
    };
    registros.push(newRegistro);
    localStorage.setItem('registros_itpop', JSON.stringify(registros));
    return newRegistro;
  },
  
  update: async (id: number, data: Partial<RegistroItPop>): Promise<RegistroItPop> => {
    const registros = await registroItPopService.getAll();
    const index = registros.findIndex((r: RegistroItPop) => r.id === id);
    if (index !== -1) {
      registros[index] = { ...registros[index], ...data };
      localStorage.setItem('registros_itpop', JSON.stringify(registros));
      return registros[index];
    }
    throw new Error('Registro não encontrado');
  },
  
  delete: async (id: number): Promise<void> => {
    const registros = await registroItPopService.getAll();
    const filtered = registros.filter((r: RegistroItPop) => r.id !== id);
    localStorage.setItem('registros_itpop', JSON.stringify(filtered));
  }
};
