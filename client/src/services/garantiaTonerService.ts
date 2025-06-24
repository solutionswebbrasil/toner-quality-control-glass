
import { supabase } from '@/integrations/supabase/client';
import type { GarantiaToner } from '@/types';

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
