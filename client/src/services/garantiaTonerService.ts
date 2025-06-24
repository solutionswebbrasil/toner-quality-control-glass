
import { supabase } from '@/integrations/supabase/client';
import type { GarantiaToner } from '@/types/garantiaToner';

export type { GarantiaToner };

export const garantiaTonerService = {
  async getAll(): Promise<GarantiaToner[]> {
    const { data, error } = await supabase
      .from('garantias_toners')
      .select('*')
      .order('data_registro', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar garantias de toners: ${error.message}`);
    }

    return data || [];
  },

  async getStats() {
    const data = await this.getAll();
    
    // Basic stats calculation
    const monthlyData: Record<string, { quantidade: number; valor: number }> = {};
    const currentMonthByFornecedor: Record<string, number> = {};
    
    data.forEach(garantia => {
      const date = new Date(garantia.data_registro || Date.now());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { quantidade: 0, valor: 0 };
      }
      monthlyData[monthKey].quantidade += 1;
      
      // Current month stats
      const currentMonth = new Date();
      if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
        currentMonthByFornecedor[garantia.fornecedor] = (currentMonthByFornecedor[garantia.fornecedor] || 0) + 1;
      }
    });

    return {
      monthlyData,
      currentMonthByFornecedor,
      total: data.length
    };
  },

  async create(garantia: Omit<GarantiaToner, 'id' | 'data_registro' | 'ticket_numero' | 'user_id'>): Promise<GarantiaToner> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Generate ticket number
    const ticketNumero = `GT${Date.now()}`;

    const garantiaData = {
      ...garantia,
      user_id: user.id,
      ticket_numero: ticketNumero,
      data_registro: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('garantias_toners')
      .insert(garantiaData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar garantia de toner: ${error.message}`);
    }

    return data;
  },

  async update(id: number, garantia: Partial<GarantiaToner>): Promise<GarantiaToner | null> {
    const { data, error } = await supabase
      .from('garantias_toners')
      .update(garantia)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar garantia de toner:', error);
      return null;
    }

    return data;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('garantias_toners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar garantia de toner:', error);
      return false;
    }

    return true;
  },

  async updateStatus(id: number, status: string, observacoes?: string): Promise<boolean> {
    const updateData: any = { status };
    if (observacoes) {
      updateData.observacoes = observacoes;
    }

    const { error } = await supabase
      .from('garantias_toners')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar status da garantia:', error);
      return false;
    }

    return true;
  }
};
