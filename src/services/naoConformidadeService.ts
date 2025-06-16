
import { supabase } from '@/integrations/supabase/client';
import { NaoConformidade } from '@/types/naoConformidade';

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

  async create(naoConformidade: Omit<NaoConformidade, 'id' | 'data_registro' | 'data_atualizacao'>): Promise<NaoConformidade> {
    const { data, error } = await supabase
      .from('nao_conformidades')
      .insert([naoConformidade])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar não conformidade:', error);
      throw error;
    }

    return data;
  },

  async update(id: number, naoConformidade: Partial<NaoConformidade>): Promise<NaoConformidade> {
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

    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('nao_conformidades')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir não conformidade:', error);
      throw error;
    }
  }
};
