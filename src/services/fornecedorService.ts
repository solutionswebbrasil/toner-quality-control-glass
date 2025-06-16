
import type { Fornecedor } from '@/types';

// Mock data storage
let fornecedores: Fornecedor[] = [
  {
    id: 1,
    nome: "HP Brasil",
    telefone: "(11) 3456-7890",
    link_rma: "https://support.hp.com/br-pt/rma",
    data_cadastro: new Date('2024-01-10')
  },
  {
    id: 2,
    nome: "Canon Brasil",
    telefone: "(11) 2345-6789",
    link_rma: "https://canon.com.br/suporte/rma",
    data_cadastro: new Date('2024-01-12')
  }
];

let nextFornecedorId = 3;

export const fornecedorService = {
  getAll: (): Promise<Fornecedor[]> => {
    return Promise.resolve([...fornecedores]);
  },

  getById: (id: number): Promise<Fornecedor | undefined> => {
    return Promise.resolve(fornecedores.find(f => f.id === id));
  },

  create: (fornecedor: Omit<Fornecedor, 'id'>): Promise<Fornecedor> => {
    const newFornecedor: Fornecedor = {
      ...fornecedor,
      id: nextFornecedorId++,
      data_cadastro: new Date()
    };
    fornecedores.push(newFornecedor);
    return Promise.resolve(newFornecedor);
  },

  update: (id: number, fornecedor: Partial<Fornecedor>): Promise<Fornecedor | null> => {
    const index = fornecedores.findIndex(f => f.id === id);
    if (index === -1) return Promise.resolve(null);
    
    fornecedores[index] = { ...fornecedores[index], ...fornecedor };
    return Promise.resolve(fornecedores[index]);
  },

  delete: (id: number): Promise<boolean> => {
    const index = fornecedores.findIndex(f => f.id === id);
    if (index === -1) return Promise.resolve(false);
    
    fornecedores.splice(index, 1);
    return Promise.resolve(true);
  }
};
