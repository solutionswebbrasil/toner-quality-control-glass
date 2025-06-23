


export interface GarantiaToner {
  id?: number;
  ticket_numero: string;
  modelo_toner: string;
  filial_origem: string;
  fornecedor: string;
  defeito: string;
  responsavel_envio: string;
  status: 'Pendente' | 'Em Análise' | 'Aguardando Toner Chegar no Laboratório' | 'Enviado para Fornecedor' | 'Concluído';
  data_envio: string;
  data_registro: string;
  observacoes?: string;
  ns?: string;
  lote?: string;
  user_id: string;
}

export const garantiaTonerService = {
  async create(garantiaToner: Omit<GarantiaToner, 'id' | 'ticket_numero' | 'data_registro' | 'user_id'>): Promise<GarantiaToner> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Gerar número do ticket
    const ticketNumero = `GT${Date.now().toString().slice(-8)}`;
    
    const garantiaData = {
      ...garantiaToner,
      ticket_numero: ticketNumero,
      data_registro: new Date().toISOString(),
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('garantias_toners')
      .insert([garantiaData])
      .select()
      .single();

    if (error) {
      console.error('Error creating garantia toner:', error);
      throw error;
    }

    return data as GarantiaToner;
  },

  async getAll(): Promise<GarantiaToner[]> {
    const { data, error } = await supabase
      .from('garantias_toners')
      .select('*')
      .order('data_registro', { ascending: false });

    if (error) {
      console.error('Error fetching garantias toners:', error);
      throw error;
    }

    return (data || []) as GarantiaToner[];
  },

  async updateStatus(id: number, status: GarantiaToner['status'], observacoes?: string): Promise<GarantiaToner> {
    const { data, error } = await supabase
      .from('garantias_toners')
      .update({ status, observacoes })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating garantia toner status:', error);
      throw error;
    }

    return data as GarantiaToner;
  },

  async getStats(): Promise<any> {
    const { data: garantiasToners, error } = await supabase
      .from('garantias_toners')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar estatísticas de garantias de toners:', error);
      throw error;
    }
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Dados por mês para gráficos
    const monthlyData = (garantiasToners || []).reduce((acc: any, g: any) => {
      const date = new Date(g.data_registro);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { quantidade: 0 };
      }
      
      acc[monthKey].quantidade += 1;
      
      return acc;
    }, {} as Record<string, { quantidade: number }>);

    // Dados por fornecedor no mês atual
    const currentMonthByFornecedor = (garantiasToners || [])
      .filter((g: any) => {
        const date = new Date(g.data_registro);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((acc: any, g: any) => {
        const fornecedor = g.fornecedor || 'N/A';
        acc[fornecedor] = (acc[fornecedor] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Dados por status
    const statusData = (garantiasToners || []).reduce((acc: any, g: any) => {
      const status = g.status || 'Pendente';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      monthlyData,
      currentMonthByFornecedor,
      statusData
    };
  }
};
