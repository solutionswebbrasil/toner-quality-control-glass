
import type { Auditoria } from '@/types';

// Mock data storage
let auditorias: Auditoria[] = [
  {
    id: 1,
    data_inicio: new Date('2024-02-01'),
    data_fim: new Date('2024-02-03'),
    unidade_auditada: 'Matriz - São Paulo',
    formulario_pdf: 'auditoria_matriz_feb2024.pdf',
    data_registro: new Date('2024-02-01')
  },
  {
    id: 2,
    data_inicio: new Date('2024-01-15'),
    data_fim: new Date('2024-01-17'),
    unidade_auditada: 'Filial Rio de Janeiro',
    formulario_pdf: 'auditoria_rj_jan2024.pdf',
    data_registro: new Date('2024-01-15')
  }
];

let nextAuditoriaId = 3;

export const auditoriaService = {
  getAll: (): Promise<Auditoria[]> => {
    return Promise.resolve([...auditorias]);
  },

  getById: (id: number): Promise<Auditoria | undefined> => {
    return Promise.resolve(auditorias.find(a => a.id === id));
  },

  create: (auditoria: Omit<Auditoria, 'id'>): Promise<Auditoria> => {
    const newAuditoria: Auditoria = {
      ...auditoria,
      id: nextAuditoriaId++,
      data_registro: new Date()
    };
    auditorias.push(newAuditoria);
    return Promise.resolve(newAuditoria);
  },

  update: (id: number, auditoria: Partial<Auditoria>): Promise<Auditoria | null> => {
    const index = auditorias.findIndex(a => a.id === id);
    if (index === -1) return Promise.resolve(null);
    
    auditorias[index] = { ...auditorias[index], ...auditoria };
    return Promise.resolve(auditorias[index]);
  },

  delete: (id: number): Promise<boolean> => {
    const index = auditorias.findIndex(a => a.id === id);
    if (index === -1) return Promise.resolve(false);
    
    auditorias.splice(index, 1);
    return Promise.resolve(true);
  }
};
