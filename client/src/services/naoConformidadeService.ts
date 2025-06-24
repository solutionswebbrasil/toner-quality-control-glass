
import { supabase } from '@/integrations/supabase/client';
import type { NaoConformidade } from '@/types';

export const naoConformidadeService = {
  async getAll(): Promise<NaoConformidade[]> {
    const { data, error } = await supabase
      .from('nao_conformidades')
      .select('*')
      .order('data_registro', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar não conformidades: ${error.message}`);
    }

    return data || [];
  },

  async getById(id: number): Promise<NaoConformidade | undefined> {
    const { data, error } = await supabase
      .from('nao_conformidades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar não conformidade:', error);
      return undefined;
    }

    return data;
  },

  async create(naoConformidade: Omit<NaoConformidade, 'id' | 'data_registro' | 'data_atualizacao' | 'user_id'>): Promise<NaoConformidade> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const naoConformidadeData = {
      ...naoConformidade,
      user_id: user.id,
      data_registro: new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('nao_conformidades')
      .insert(naoConformidadeData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar não conformidade: ${error.message}`);
    }

    return data;
  },

  async update(id: number, naoConformidade: Partial<NaoConformidade>): Promise<NaoConformidade | null> {
    const updateData = {
      ...naoConformidade,
      data_atualizacao: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('nao_conformidades')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar não conformidade:', error);
      return null;
    }

    return data;
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('nao_conformidades')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar não conformidade:', error);
      return false;
    }

    return true;
  }
};
