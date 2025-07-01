
export interface GarantiaToner {
  id?: number;
  modelo: string;
  marca: string;
  status: 'Pendente' | 'Em Análise' | 'Aguardando Toner Chegar no Laboratório' | 'Enviado para Fornecedor' | 'Concluído';
  data_cadastro: string;
  ticket_numero: string;
  modelo_toner: string;
  fornecedor: string;
  filial_origem: string;
  ns?: string;
  lote?: string;
  data_envio: string;
  responsavel_envio: string;
  defeito: string;
  observacoes?: string;
}

export const garantiaTonerService = {
  getAll: async () => {
    const data = localStorage.getItem('garantias_toner');
    return data ? JSON.parse(data) : [
      {
        id: 1,
        modelo: 'HP 12A',
        marca: 'HP',
        status: 'Pendente' as const,
        data_cadastro: '2024-01-01',
        ticket_numero: 'TK2024001',
        modelo_toner: 'HP 12A Q2612A',
        fornecedor: 'HP Brasil',
        filial_origem: 'São Paulo',
        ns: 'SN123456789',
        lote: 'LT2024001',
        data_envio: '2024-01-15',
        responsavel_envio: 'João Silva',
        defeito: 'Não imprime corretamente',
        observacoes: 'Toner retornado para análise'
      },
      {
        id: 2,
        modelo: 'Canon 728',
        marca: 'Canon',
        status: 'Concluído' as const,
        data_cadastro: '2024-01-05',
        ticket_numero: 'TK2024002',
        modelo_toner: 'Canon 728',
        fornecedor: 'Canon Brasil',
        filial_origem: 'Rio de Janeiro',
        ns: 'SN987654321',
        lote: 'LT2024002',
        data_envio: '2024-01-20',
        responsavel_envio: 'Maria Santos',
        defeito: 'Vazamento de toner',
        observacoes: 'Garantia aprovada - toner substituído'
      }
    ];
  },
  create: async (data: any) => {
    const garantias = await garantiaTonerService.getAll();
    const newGarantia = { id: Date.now(), ...data };
    garantias.push(newGarantia);
    localStorage.setItem('garantias_toner', JSON.stringify(garantias));
    return newGarantia;
  },
  update: async (id: number, data: any) => {
    const garantias = await garantiaTonerService.getAll();
    const index = garantias.findIndex((g: any) => g.id === id);
    if (index !== -1) {
      garantias[index] = { ...garantias[index], ...data };
      localStorage.setItem('garantias_toner', JSON.stringify(garantias));
    }
    return { id, ...data };
  },
  updateStatus: async (id: number, status: string, observacoes?: string) => {
    const garantias = await garantiaTonerService.getAll();
    const index = garantias.findIndex((g: any) => g.id === id);
    if (index !== -1) {
      garantias[index] = { ...garantias[index], status, observacoes };
      localStorage.setItem('garantias_toner', JSON.stringify(garantias));
    }
    return { id, status, observacoes };
  },
  delete: async (id: number) => {
    const garantias = await garantiaTonerService.getAll();
    const filtered = garantias.filter((g: any) => g.id !== id);
    localStorage.setItem('garantias_toner', JSON.stringify(filtered));
    return { success: true };
  },
  getStats: async () => {
    return {
      monthlyData: {
        '2024-01': { quantidade: 2 },
        '2024-02': { quantidade: 1 },
        '2024-03': { quantidade: 4 }
      },
      statusData: {
        'Pendente': 3,
        'Em Análise': 2,
        'Concluído': 5
      },
      currentMonthByFornecedor: {
        'HP Brasil': 3,
        'Canon Brasil': 1
      }
    };
  }
};
