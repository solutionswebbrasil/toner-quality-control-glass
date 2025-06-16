
import { supabase } from '@/integrations/supabase/client';

export interface GarantiaToner {
  id?: number;
  ticket_numero: string;
  modelo_toner: string;
  filial_origem: string;
  fornecedor: string;
  defeito: string;
  responsavel_envio: string;
  status: 'Pendente' | 'Em Análise' | 'Aprovada' | 'Recusada' | 'Concluída';
  data_envio: string;
  data_registro: string;
  observacoes?: string;
}

export const garantiaTonerService = {
  async create(garantiaToner: Omit<GarantiaToner, 'id' | 'ticket_numero' | 'data_registro'>): Promise<GarantiaToner> {
    // Gerar número do ticket
    const ticketNumero = `GT${Date.now().toString().slice(-8)}`;
    
    const { data, error } = await supabase
      .from('garantias_toners' as any)
      .insert([{
        ...garantiaToner,
        ticket_numero: ticketNumero,
        data_registro: new Date().toISOString()
      }])
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
      .from('garantias_toners' as any)
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
      .from('garantias_toners' as any)
      .update({ status, observacoes })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating garantia toner status:', error);
      throw error;
    }

    return data as GarantiaToner;
  }
};
