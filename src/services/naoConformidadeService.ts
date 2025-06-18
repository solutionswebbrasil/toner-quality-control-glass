
import { supabase } from '@/integrations/supabase/client';
import { NaoConformidade } from '@/types/naoConformidade';
import { auditLogger } from '@/utils/auditLogger';

export const naoConformidadeService = {
  async getAll(): Promise<NaoConformidade[]> {
    const { data, error } = await supabase
      .from('nao_conformidades')
      .select('*')
      .order('data_registro', { ascending: false });

    if (error) {
      console.error('Erro ao buscar não conformidades:', error);
      throw error;
    }

    return data || [];
  },

  async getById(id: number): Promise<NaoConformidade | null> {
    const { data, error } = await supabase
      .from('nao_conformidades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar não conformidade:', error);
      throw error;
    }

    return data;
  },

  async create(naoConformidade: Omit<NaoConformidade, 'id' | 'data_registro' | 'data_atualizacao' | 'user_id'>): Promise<NaoConformidade> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const naoConformidadeWithUser = {
      ...naoConformidade,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('nao_conformidades')
      .insert([naoConformidadeWithUser])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar não conformidade:', error);
      throw error;
    }

    // Log audit
    await auditLogger.logCreate('nao_conformidades', data.id.toString(), data);

    return data;
  },

  async update(id: number, naoConformidade: Omit<Partial<NaoConformidade>, 'user_id'>): Promise<NaoConformidade> {
    const { data, error } = await supabase
      .from('nao_conformidades')
      .update(naoConformidade)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar não conformidade:', error);
      throw error;
    }

    // Log audit
    await auditLogger.logUpdate('nao_conformidades', id.toString(), {}, data);

    return data;
  },

  async delete(id: number): Promise<void> {
    // Get record before deletion for audit
    const { data: oldRecord } = await supabase
      .from('nao_conformidades')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('nao_conformidades')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir não conformidade:', error);
      throw error;
    }

    // Log audit
    if (oldRecord) {
      await auditLogger.logDelete('nao_conformidades', id.toString(), oldRecord);
    }
  }
};
