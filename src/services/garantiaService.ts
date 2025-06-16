
import type { Garantia } from '@/types';
import { fornecedorService } from './fornecedorService';

// Mock data storage
let garantias: Garantia[] = [
  {
    id: 1,
    item: "Impressora HP LaserJet P1102",
    quantidade: 2,
    defeito: "Não está imprimindo, display com erro",
    fornecedor_id: 1,
    fornecedor: "HP Brasil",
    status: 'em_analise',
    resultado: '',
    valor_unitario: 450.00,
    valor_total: 900.00,
    data_registro: new Date('2024-02-01')
  },
  {
    id: 2,
    item: "Scanner Canon LiDE 300",
    quantidade: 1,
    defeito: "Não reconhece documentos, luz não acende",
    fornecedor_id: 2,
    fornecedor: "Canon Brasil",
    status: 'concluida',
    resultado: 'trocado',
    valor_unitario: 180.00,
    valor_total: 180.00,
    data_registro: new Date('2024-01-28')
  }
];

let nextGarantiaId = 3;

export const garantiaService = {
  getAll: (): Promise<Garantia[]> => {
    return Promise.resolve([...garantias]);
  },

  getById: (id: number): Promise<Garantia | undefined> => {
    return Promise.resolve(garantias.find(g => g.id === id));
  },

  create: async (garantia: Omit<Garantia, 'id'>): Promise<Garantia> => {
    const fornecedores = await fornecedorService.getAll();
    const fornecedor = fornecedores.find(f => f.id === garantia.fornecedor_id);
    const valor_total = garantia.quantidade * garantia.valor_unitario;
    
    const newGarantia: Garantia = {
      ...garantia,
      id: nextGarantiaId++,
      valor_total,
      data_registro: new Date(),
      fornecedor: fornecedor?.nome || 'N/A'
    };
    garantias.push(newGarantia);
    return Promise.resolve(newGarantia);
  },

  update: async (id: number, garantia: Partial<Garantia>): Promise<Garantia | null> => {
    const index = garantias.findIndex(g => g.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedGarantia = { ...garantias[index], ...garantia };
    
    // Recalcular valor total se quantidade ou valor unitário mudaram
    if (garantia.quantidade !== undefined || garantia.valor_unitario !== undefined) {
      updatedGarantia.valor_total = updatedGarantia.quantidade * updatedGarantia.valor_unitario;
    }
    
    // Atualizar nome do fornecedor se fornecedor_id mudou
    if (garantia.fornecedor_id !== undefined) {
      const fornecedores = await fornecedorService.getAll();
      const fornecedor = fornecedores.find(f => f.id === garantia.fornecedor_id);
      updatedGarantia.fornecedor = fornecedor?.nome || 'N/A';
    }
    
    garantias[index] = updatedGarantia;
    return Promise.resolve(garantias[index]);
  },

  delete: (id: number): Promise<boolean> => {
    const index = garantias.findIndex(g => g.id === id);
    if (index === -1) return Promise.resolve(false);
    
    garantias.splice(index, 1);
    return Promise.resolve(true);
  },

  getStats: () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Dados por mês para gráficos
    const monthlyData = garantias.reduce((acc, g) => {
      const date = new Date(g.data_registro);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { quantidade: 0, valor: 0 };
      }
      
      acc[monthKey].quantidade += g.quantidade;
      acc[monthKey].valor += g.valor_total;
      
      return acc;
    }, {} as Record<string, { quantidade: number; valor: number }>);

    // Dados por fornecedor no mês atual
    const currentMonthByFornecedor = garantias
      .filter(g => {
        const date = new Date(g.data_registro);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((acc, g) => {
        const fornecedor = g.fornecedor || 'N/A';
        acc[fornecedor] = (acc[fornecedor] || 0) + g.quantidade;
        return acc;
      }, {} as Record<string, number>);

    return Promise.resolve({
      monthlyData,
      currentMonthByFornecedor
    });
  }
};
